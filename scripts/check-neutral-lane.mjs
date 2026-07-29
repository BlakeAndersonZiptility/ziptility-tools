/* Neutral-lane and sandbox-safety checks for the tool bundles.

   These are POLICY, not style, which is why they run in CI instead of
   being left to review:

   - The free tools sit in the ungated lane. Completion is the conversion,
     and "a gate before the value is a RED-FLAG by rule". The report card
     is ungated by explicit ruling (R14): asking for an email before the
     score forfeits the lane's neutrality. A demo CTA or a price on these
     pages is a policy breach shipped to a live page, not a bug somebody
     will notice.

   - Unguarded localStorage or location reads THROW inside a sandboxed
     iframe. This repo has been bitten by it before, so both bundles wrap
     every access. A grep cannot tell code from prose, so this strips
     comments and strings first: the earlier grep version flagged the
     comment that documents the rule, which is how a check trains people
     to ignore it.

   Run: node scripts/check-neutral-lane.mjs [dir ...]
*/
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const DIRS = process.argv.slice(2);
if (!DIRS.length) {
  console.error('usage: node scripts/check-neutral-lane.mjs <dir> [dir ...]');
  process.exit(2);
}

/* Blank out comments and string literals so the scans below see code only.
   Replaces with spaces rather than deleting, to keep line numbers honest. */
function codeOnly(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let mode = 'code';
  let quote = '';
  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];
    if (mode === 'code') {
      if (c === '/' && c2 === '*') { mode = 'block'; out += '  '; i += 2; continue; }
      if (c === '/' && c2 === '/') { mode = 'line'; out += '  '; i += 2; continue; }
      if (c === '"' || c === "'" || c === '`') { mode = 'str'; quote = c; out += ' '; i++; continue; }
      out += c; i++; continue;
    }
    if (mode === 'block') {
      if (c === '*' && c2 === '/') { mode = 'code'; out += '  '; i += 2; continue; }
      out += c === '\n' ? '\n' : ' '; i++; continue;
    }
    if (mode === 'line') {
      if (c === '\n') { mode = 'code'; out += '\n'; i++; continue; }
      out += ' '; i++; continue;
    }
    /* string */
    if (c === '\\') { out += '  '; i += 2; continue; }
    if (c === quote) { mode = 'code'; out += ' '; i++; continue; }
    out += c === '\n' ? '\n' : ' '; i++;
  }
  return out;
}

/* Prose scans run on the RAW source, because a demo CTA or a price would
   live in a string or in rendered markup, which codeOnly() blanks out. */
const PROSE_RULES = [
  { name: 'demo CTA', re: /book a demo|get a demo|request-a-free-demo|schedule a demo/i,
    why: 'the neutral-lane wall forbids a hard CTA in the body of a free tool' },
  { name: 'pricing', re: /\$\s?\d[\d,]*\s?(?:\/|per )\s?(?:mo\b|month|yr\b|year|seat|user)|\bpricing\b/i,
    why: 'pricing is commercial-lane content and does not belong on an ungated tool' },
  { name: 'gate before the value', re: /enter your email to (?:see|get|view|unlock)|unlock your (?:score|results?)|email required/i,
    why: 'completion is the conversion; a gate in front of the result is a defect by rule (R14)' }
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(js|mjs|css|html)$/.test(entry)) out.push(p);
  }
  return out;
}

const failures = [];

for (const dir of DIRS) {
  for (const file of walk(dir)) {
    const raw = readFileSync(file, 'utf8');
    const rel = path.relative(process.cwd(), file);

    raw.split('\n').forEach((line, i) => {
      for (const rule of PROSE_RULES) {
        if (rule.re.test(line)) {
          failures.push(rel + ':' + (i + 1) + '  ' + rule.name + ': ' + rule.why + '\n    ' + line.trim());
        }
      }
    });

    if (/\.(js|mjs)$/.test(file)) {
      const code = codeOnly(raw);
      code.split('\n').forEach((line, i) => {
        /* Guarded means the access sits inside a try. Every current call
           site is a one-line try/catch, so same-line is the honest check;
           a multi-line try block would need real parsing, and a false PASS
           is worse here than a false FAIL somebody has to look at. */
        if (/\b(?:localStorage|sessionStorage)\b/.test(line) && !/\btry\b/.test(line)) {
          failures.push(rel + ':' + (i + 1) +
            '  unguarded storage access: throws inside a sandboxed iframe, wrap it in try/catch\n    ' +
            raw.split('\n')[i].trim());
        }
      });
    }
  }
}

if (failures.length) {
  console.error('Neutral-lane / sandbox check FAILED (' + failures.length + '):\n');
  for (const f of failures) console.error('  ' + f + '\n');
  process.exit(1);
}
console.log('Neutral-lane / sandbox check passed for: ' + DIRS.join(', '));
