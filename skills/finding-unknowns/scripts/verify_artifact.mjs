#!/usr/bin/env node
// Verify a finding-unknowns HTML artifact before handing it to the user.
//
// Usage: node verify_artifact.mjs <artifact.html> [--template]
//
// Checks:
//   1. No external resources — src/href/srcset/url()/@import/import()/fetch/
//      XHR/WebSocket pointing anywhere: the file must work offline from file://.
//   2. Each inline JS <script> parses (node --check via the running node binary).
//   3. Every id referenced via getElementById/querySelector('#...') exists.
//   4. The last <script> sits at the end of <body>.
//   5. Reply plumbing intact: textarea#out, button#copyBtn, execCommand fallback.
//   6. No skeleton placeholders left (skipped with --template).
//
// Exit code 0 = all checks passed; 1 = at least one failed.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const template = args.includes('--template');
if (!file) {
  console.log('Usage: node verify_artifact.mjs <artifact.html> [--template]');
  process.exit(1);
}
const html = readFileSync(file, 'utf8');

let failed = false;
function check(name, ok, detail = '') {
  const suffix = !ok && detail ? ` — ${detail}` : '';
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${suffix}`);
  if (!ok) failed = true;
}

const ext = html.match(
  /\b(?:src|href|srcset|poster|action)\s*=\s*["']?\s*(?:https?:)?\/\/[^\s"'>]*|url\(\s*["']?\s*(?:https?:)?\/\/[^)]*|@import\s+(?:url\()?\s*["']?(?:https?:)?\/\/[^;]*|\bimport\s*\(?\s*["'](?:https?:)?\/\/[^"']*|\bfetch\s*\(|\bXMLHttpRequest\b|\bnew\s+WebSocket\b/gi,
) || [];
check('no external resources', ext.length === 0, ext.slice(0, 3).join('; '));

// Inline scripts only, and only those the browser would run as JavaScript.
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attrs]) => !/\bsrc\s*=/.test(attrs))
  .filter(([, attrs]) => {
    const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
    return !type || /^(text\/javascript|application\/javascript|module)$/i.test(type);
  })
  .map(([, , body]) => body);
const js = scripts.join('\n');

if (js.trim()) {
  // process.execPath = the node running this script — no PATH lookup needed
  const errors = [];
  scripts.forEach((body, i) => {
    const tmp = join(tmpdir(), `verify-artifact-${process.pid}-${i}.js`);
    writeFileSync(tmp, body, 'utf8');
    try {
      const r = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
      if (r.status !== 0) errors.push((r.stderr || '').trim().split('\n').slice(0, 4).join(' '));
    } finally {
      unlinkSync(tmp);
    }
  });
  check('inline JS parses', errors.length === 0, errors.join(' | ').slice(0, 240));

  const used = new Set(
    [...js.matchAll(/getElementById\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]).concat(
      [...js.matchAll(/querySelector(?:All)?\(\s*["']#([\w-]+)["']\s*\)/g)].map((m) => m[1]),
    ),
  );
  const defined = new Set([...html.matchAll(/\bid\s*=\s*["']?([^"'\s>]+)/g)].map((m) => m[1]));
  const missing = [...used].filter((id) => !defined.has(id));
  check('all ids referenced from JS exist', missing.length === 0, missing.join(', '));

  const lastScript = html.lastIndexOf('<script');
  const bodyEnd = html.lastIndexOf('</body>');
  const tail = html.slice(lastScript, bodyEnd === -1 ? undefined : bodyEnd);
  const afterLastScript = tail.split('</script>').pop();
  check(
    'script at end of body',
    !/<(button|input|textarea|select)\b/.test(afterLastScript),
    'interactive elements appear after the last <script>',
  );
} else {
  check('has inline JS (interactive artifact)', false, 'no <script> found');
}

check('reply textarea#out', /<textarea\b[^>]*\bid\s*=\s*["']?out\b/i.test(html));
check('copy button#copyBtn', /<button\b[^>]*\bid\s*=\s*["']?copyBtn\b/i.test(html));
check(
  'copy falls back to execCommand',
  /execCommand\(\s*["']copy["']\s*\)/.test(js),
  'sandboxed viewers block navigator.clipboard silently',
);

if (!template) {
  const left = ['ARTIFACT TITLE', 'YOUR CONTENT HERE', 'example trait one', 'Example quiz question']
    .filter((p) => html.includes(p));
  check('no skeleton placeholders left', left.length === 0, left.join(', '));
}

process.exit(failed ? 1 : 0);
