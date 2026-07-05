#!/usr/bin/env node
// Verify a finding-unknowns HTML artifact before handing it to the user.
//
// Usage: node verify_artifact.mjs <artifact.html>
//
// Checks:
//   1. No external URLs (src/href/import/fetch to http[s]) — must work offline.
//   2. Inline <script> parses (node --check via the running node binary).
//   3. Every id referenced via getElementById/querySelector('#...') exists.
//   4. The last <script> sits at the end of <body>.
//   5. Reply plumbing present: a <textarea> and a copy control.
//
// Exit code 0 = all checks passed; 1 = at least one failed.
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const file = process.argv[2];
if (!file) {
  console.log('Usage: node verify_artifact.mjs <artifact.html>');
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
  /(?:src|href)\s*=\s*["']https?:\/\/[^"']+|@import\s+url\(\s*["']?https?:\/\/|fetch\(\s*["']https?:\/\//g,
) || [];
check('no external URLs', ext.length === 0, ext.slice(0, 3).join('; '));

const js = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1]).join('\n');

if (js.trim()) {
  // process.execPath = the node running this script — no PATH lookup needed
  const tmp = join(tmpdir(), `verify-artifact-${process.pid}.js`);
  writeFileSync(tmp, js, 'utf8');
  let r;
  try {
    r = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
  } finally {
    unlinkSync(tmp);
  }
  check('inline JS parses', r.status === 0, (r.stderr || '').trim().slice(0, 200));

  const used = new Set(
    [...js.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map((m) => m[1]).concat(
      [...js.matchAll(/querySelector(?:All)?\(["']#([\w-]+)["']\)/g)].map((m) => m[1]),
    ),
  );
  const defined = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
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

check('has reply textarea', html.includes('<textarea'));
check('has copy control', /copy/i.test(html));

process.exit(failed ? 1 : 0);
