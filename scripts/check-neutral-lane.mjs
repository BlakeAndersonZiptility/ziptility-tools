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

/* Blank out comments, and optionally string literals, so each scan sees
   only what it should. Replaces with spaces rather than deleting, so line
   numbers stay honest.

   Two modes, because the two scans want different things:
   - keepStrings: the PROSE scan. Reader-facing copy lives in strings, so
     they must survive, but comments must not: the first version of this
     check flagged the comment that says "no pricing" and the copy that
     says "there is no email required", which is four false failures on
     correct code. A check that cries wolf gets switched off. */
function strip(src, { keepStrings = false } = {}) {
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
      if (c === '"' || c === "'" || c === '`') { mode = 'str'; quote = c; out += keepStrings ? c : ' '; i++; continue; }
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
    if (c === '\\') { out += keepStrings ? src.slice(i, i + 2) : '  '; i += 2; continue; }
    if (c === quote) { mode = 'code'; out += keepStrings ? c : ' '; i++; continue; }
    out += keepStrings ? c : (c === '\n' ? '\n' : ' '); i++;
  }
  return out;
}

/* Line numbers (1-based) that sit inside a try block. Brace-counted on
   comment- and string-stripped code, so a brace in a comment or a string
   cannot throw the depth off.

   Needed because guarded access is not always same-line. storage.js wraps
   a multi-line try around its localStorage calls, which is correct and
   which the same-line version of this check failed. */
function tryBlockLines(codeSrc) {
  const inTry = new Set();
  const stack = [];      /* brace depth at which each open try block started */
  let depth = 0;
  let line = 1;
  let pendingTry = false;
  const isWordChar = (ch) => ch !== undefined && /[A-Za-z0-9_$]/.test(ch);

  /* Character-wise over the whole source rather than line by line. The
     line-by-line version had the `try` detection running AFTER that line's
     braces, so `try {` on one line never opened a block and every
     multi-line guard read as unguarded. */
  for (let i = 0; i < codeSrc.length; i++) {
    const c = codeSrc[i];
    if (stack.length) inTry.add(line);

    if (c === '\n') { line++; continue; }

    if (c === 't' && codeSrc.startsWith('try', i) &&
        !isWordChar(codeSrc[i - 1]) && !isWordChar(codeSrc[i + 3])) {
      pendingTry = true;
      i += 2;
      continue;
    }
    if (c === '{') {
      depth++;
      if (pendingTry) { stack.push(depth); pendingTry = false; inTry.add(line); }
      continue;
    }
    if (c === '}') {
      if (stack.length && stack[stack.length - 1] === depth) stack.pop();
      depth--;
    }
  }
  return inTry;
}

/* Prose scans run on comment-stripped source with STRINGS KEPT: what a
   reader sees lives in string literals and markup, while a comment
   describing the rule ("no pricing", "no email field") is not a breach of
   it. Scanning raw source conflated the two.

   NEGATION guards each rule for the same reason. Honest neutrality copy
   says the thing it is not doing: "There is no email required to see the
   result" is the tool KEEPING the rule, and flagging it would teach people
   to delete the sentence that proves compliance. */
const NEGATION = /\b(?:no|not|never|without|nothing|free of|zero)\b[^.!?]{0,40}$/i;

const PROSE_RULES = [
  { name: 'demo CTA', re: /book a demo|get a demo|request-a-free-demo|schedule a demo/i,
    why: 'the neutral-lane wall forbids a hard CTA in the body of a free tool' },
  { name: 'pricing', re: /\$\s?\d[\d,]*\s?(?:\/|per )\s?(?:mo\b|month|yr\b|year|seat|user)|\bpricing\b/i,
    why: 'pricing is commercial-lane content and does not belong on an ungated tool' },
  { name: 'gate before the value',
    re: /enter your email to (?:see|get|view|unlock|download)|unlock your (?:score|results?|report)|(?:email|sign\s?up|account)\s+(?:is\s+)?required/i,
    why: 'completion is the conversion; a gate in front of the result is a defect by rule (R14)' },
  /* On the live page the Webflow global header and footer wrap the tool and
     carry the brand. A logo inside the bundle is the brand twice on one
     screen. \b matters: "analogous" contains the letters l-o-g-o and an
     unbounded match flags the report card's own AWWA rung descriptors. */
  { name: 'inline logo',
    re: /\blogo\b|[-_]logo\b|\blogo[-_]|wordmark|brandmark|\bmasthead\b/i,
    why: 'the page chrome carries the brand; a logo inside the tool is the brand twice' }
];

/* HTML comments are commentary too, including inside a JS template literal
   that builds markup, where strip() deliberately keeps the string. Blanked
   with spaces so line numbers stay honest. */
function blankHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
}

/* True when the match is inside a negated clause, e.g. "no email required".
   Looks only at the text BEFORE the match on that line, capped so a
   negation three sentences earlier does not excuse a real breach. */
function negated(line, matchIndex) {
  return NEGATION.test(line.slice(0, matchIndex));
}

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

    const rawLines = raw.split('\n');
    const isJs = /\.(js|mjs)$/.test(file);
    const isCss = /\.css$/.test(file);
    /* Comments stripped, strings kept, for JS and CSS alike. CSS uses the
       same block-comment syntax, and a stylesheet comment explaining why
       there is no logo must not read as one. */
    const prose = blankHtmlComments((isJs || isCss) ? strip(raw, { keepStrings: true }) : raw);

    prose.split('\n').forEach((line, i) => {
      for (const rule of PROSE_RULES) {
        const m = rule.re.exec(line);
        if (m && !negated(line, m.index)) {
          failures.push(rel + ':' + (i + 1) + '  ' + rule.name + ': ' + rule.why + '\n    ' + rawLines[i].trim());
        }
      }
    });

    if (isJs) {
      const code = strip(raw);
      const guarded = tryBlockLines(code);
      code.split('\n').forEach((line, i) => {
        /* Guarded means the access sits inside a try, on the same line or
           anywhere in an enclosing try block. Both shapes are in use. */
        if (/\b(?:localStorage|sessionStorage)\b/.test(line) && !guarded.has(i + 1)) {
          failures.push(rel + ':' + (i + 1) +
            '  unguarded storage access: throws inside a sandboxed iframe, wrap it in try/catch\n    ' +
            rawLines[i].trim());
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
