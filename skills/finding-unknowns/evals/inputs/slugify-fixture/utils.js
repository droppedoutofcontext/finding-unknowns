// Called for every row when the catalog is exported (~200k rows per run).
function slugify(title) {
  let out = title.toLowerCase();
  out = out.split('').map((ch) => (/[a-z0-9]/.test(ch) ? ch : '-')).join('');
  while (out.includes('--')) out = out.replace('--', '-');
  while (out.startsWith('-')) out = out.slice(1);
  while (out.endsWith('-')) out = out.slice(0, -1);
  return out;
}

module.exports = { slugify };
