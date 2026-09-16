// Fidelity check against the LIVE page (run before every sheets release; not in CI because it
// needs the network): every formula <li> on ziptility.com/tools/formula-sheets (or the staging
// host passed as argv[2]) must match a US line in src/sheets/lines.js, and every SI-bearing line
// must be on the page. The browser suite runs on a mirror generated FROM lines.js, so this is the
// one check that is not circular. Usage: node scripts/check-sheets-live.mjs [host]
import { SHEETS } from '../src/sheets/lines.js';
const host = process.argv[2] || 'https://www.ziptility.com';
const html = await (await fetch(host + '/tools/formula-sheets')).text();
const norm = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const known = new Map(); SHEETS.forEach((sh) => sh.blocks.forEach((b) => b.lines.forEach((l) => known.set(norm(l.imp), l))));
let onPage = 0, unknown = [];
for (const sh of SHEETS) {
  const start = html.indexOf('id="' + sh.id + '"'); const next = SHEETS[SHEETS.indexOf(sh) + 1]; const end = next ? html.indexOf('id="' + next.id + '"') : html.indexOf('id="fs-related-tools"');
  const sec = html.slice(start, end > 0 ? end : undefined);
  for (const m of sec.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) { const t = norm(m[1]); if (known.has(t)) onPage++; else unknown.push(sh.id + ': ' + t.slice(0, 90)); }
}
const total = SHEETS.reduce((n, s) => n + s.blocks.reduce((m, b) => m + b.lines.length, 0), 0);
console.log(host, '| lines on page matched:', onPage, 'of', total, 'in lines.js', unknown.length ? '| UNKNOWN on page: ' + unknown.length : '');
unknown.forEach((u) => console.log('  ', u));
process.exit(unknown.length || onPage < total ? 1 : 0);
