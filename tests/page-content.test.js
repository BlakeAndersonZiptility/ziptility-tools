/* Tests for the generated server-rendered body of the six per-discipline
   practice pages (scripts/build-page-content.mjs).

   These pages carry a BLOCKING build precondition: each needs a genuinely
   unique server-rendered body (the discipline's topic breakdown plus 5 to
   10 worked sample questions in the page source), because six pages cloned
   from the hub would be thin and near-duplicate at the same time. The
   fragments are committed, so without tests nothing would notice a
   regenerated fragment that quietly lost its samples, misreported a count,
   marked the wrong answer, or drifted back toward the hub's copy.

   Run: node --test tests/page-content.test.js
   (self-sufficient: regenerates the fragments first) */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TESTS } from '../src/practice/manifest.js';
import { DOMAIN_LABELS } from '../src/practice/domains.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const OUT = path.join(ROOT, 'page-content');

const banks = {};
const frags = {};
const facts = {};

before(() => {
  execSync('node scripts/build-page-content.mjs', { cwd: ROOT, stdio: 'pipe' });
  for (const t of TESTS) {
    banks[t.id] = JSON.parse(readFileSync(path.join(ROOT, 'banks-src', t.id + '.json'), 'utf8'));
    frags[t.slug] = readFileSync(path.join(OUT, t.slug + '.html'), 'utf8');
    facts[t.slug] = JSON.parse(readFileSync(path.join(OUT, t.slug + '.json'), 'utf8'));
  }
});

function bodyText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

test('every test in the manifest produced a fragment and a facts file', () => {
  const written = readdirSync(OUT).filter((f) => f.endsWith('.html')).sort();
  assert.deepEqual(written, TESTS.map((t) => t.slug + '.html').sort());
});

test('regenerating is byte-stable: an unchanged bank produces an identical file', () => {
  /* Selection must be fully deterministic. If it is not, every rebuild
     churns the committed fragments and a real content change becomes
     impossible to spot in a diff. */
  const before1 = TESTS.map((t) => frags[t.slug]);
  execSync('node scripts/build-page-content.mjs', { cwd: ROOT, stdio: 'pipe' });
  const after = TESTS.map((t) => readFileSync(path.join(OUT, t.slug + '.html'), 'utf8'));
  assert.deepEqual(after, before1);
});

test('each page carries 5 to 10 worked samples (the precondition range)', () => {
  for (const t of TESTS) {
    const n = facts[t.slug].sampledIds.length;
    assert.ok(n >= 5 && n <= 10, t.slug + ' has ' + n + ' samples, outside the required 5 to 10');
    const rendered = (frags[t.slug].match(/class="zpt-sample"/g) || []).length;
    assert.equal(rendered, n, t.slug + ' rendered ' + rendered + ' samples but recorded ' + n);
  }
});

test('the subject-area table accounts for every question in the bank', () => {
  for (const t of TESTS) {
    const bank = banks[t.id];
    const sum = Object.values(facts[t.slug].domains).reduce((a, b) => a + b, 0);
    assert.equal(sum, bank.questions.length,
      t.slug + ' subject counts sum to ' + sum + ' but the bank holds ' + bank.questions.length);
    assert.equal(facts[t.slug].questionCount, t.questionCount,
      t.slug + ' facts questionCount disagrees with the manifest');
  }
});

test('every sampled question exists in its bank and its choices render verbatim', () => {
  for (const t of TESTS) {
    const byId = Object.fromEntries(banks[t.id].questions.map((q) => [q.id, q]));
    for (const id of facts[t.slug].sampledIds) {
      const q = byId[id];
      assert.ok(q, t.slug + ' sampled unknown question id ' + id);
      const text = bodyText(frags[t.slug]);
      assert.ok(text.includes(q.text.replace(/\s+/g, ' ').trim()),
        t.slug + ': question text for ' + id + ' is missing from the fragment');
      for (const c of q.choices) {
        assert.ok(text.includes(c.replace(/\s+/g, ' ').trim()),
          t.slug + ': choice "' + c + '" for ' + id + ' is missing from the fragment');
      }
    }
  }
});

test('exactly one choice per sample is marked correct, and it is the bank\'s correctIndex', () => {
  /* The whole value of a worked example is that the marked answer is the
     right one. A rendering bug here would publish six pages of confidently
     wrong answers to people studying for a certification exam. */
  for (const t of TESTS) {
    const byId = Object.fromEntries(banks[t.id].questions.map((q) => [q.id, q]));
    const blocks = frags[t.slug].split('<li class="zpt-sample">').slice(1);
    assert.equal(blocks.length, facts[t.slug].sampledIds.length);

    blocks.forEach((block, i) => {
      const q = byId[facts[t.slug].sampledIds[i]];
      const marked = block.match(/zpt-choice-correct/g) || [];
      assert.equal(marked.length, 1,
        t.slug + ' sample ' + q.id + ' marked ' + marked.length + ' correct answers, expected exactly 1');

      const items = block.split('<li class="zpt-choice').slice(1);
      const markedIdx = items.findIndex((s) => s.startsWith(' zpt-choice-correct'));
      assert.equal(markedIdx, q.correctIndex,
        t.slug + ' sample ' + q.id + ' marked choice ' + markedIdx + ' but the bank says ' + q.correctIndex);

      /* Correctness is stated in text, not by class or colour alone: it is
         what a screen reader and a crawler actually read. */
      assert.ok(items[markedIdx].includes('Correct answer'),
        t.slug + ' sample ' + q.id + ' does not state the correct answer in text');
    });
  }
});

test('content holds: no PFAS and no CHEM anywhere in the generated pages', () => {
  /* Blake ruling 2026-06-12: PFAS is a hard exclude while the federal rule
     is in flux, chemistry is held pending SME review. SAFE is NOT held:
     those rows cleared the per-row SME-SIGNOFF gate and already run in the
     live test. The generator asserts this at build time too; this is the
     check on what actually got written. */
  for (const t of TESTS) {
    const text = bodyText(frags[t.slug]);
    assert.ok(!/\bPFAS\b|\bPFOA\b|\bPFOS\b/i.test(text), t.slug + ' mentions PFAS');
    for (const id of facts[t.slug].sampledIds) {
      const q = banks[t.id].questions.find((x) => x.id === id);
      assert.notEqual(q.domain, 'CHEM', t.slug + ' sampled a held CHEM question (' + id + ')');
    }
  }
});

test('the six pages are not near-duplicates of each other', () => {
  /* The reason the split exists. Measured as shared sentences rather than
     asserted: the failure mode the precondition names is six pages that
     each carry the same ~1,200 characters of hub copy. */
  const sentences = (slug) => new Set(
    bodyText(frags[slug]).split(/(?<=[.?])\s+/).map((s) => s.trim()).filter((s) => s.length > 25)
  );
  const slugs = TESTS.map((t) => t.slug);
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const a = sentences(slugs[i]);
      const b = sentences(slugs[j]);
      let shared = 0;
      for (const s of a) if (b.has(s)) shared++;
      const pct = (100 * shared) / Math.min(a.size, b.size);
      assert.ok(pct < 25,
        slugs[i] + ' and ' + slugs[j] + ' share ' + Math.round(pct) + '% of their sentences');
    }
  }
});

test('each page carries substantially more unique body than the hub template it replaces', () => {
  /* The precondition's own number: the hub serves ~1,209 characters of
     body text, and six clones of it would be thin. Anything at or under
     that is a regression back to the state that blocked the build. */
  for (const t of TESTS) {
    const len = bodyText(frags[t.slug]).length;
    assert.ok(len > 2500, t.slug + ' body is only ' + len + ' characters');
  }
});

test('every subject code present in a bank has a reader-facing label', () => {
  for (const t of TESTS) {
    for (const code of Object.keys(facts[t.slug].domains)) {
      assert.ok(DOMAIN_LABELS[code], 'no label for subject code "' + code + '" (in ' + t.id + ')');
      assert.ok(bodyText(frags[t.slug]).includes(DOMAIN_LABELS[code]),
        t.slug + ' does not render the label for ' + code);
    }
  }
});

test('samples spread across topics rather than clustering in one corner', () => {
  for (const t of TESTS) {
    const topics = facts[t.slug].sampledTopics;
    const distinct = new Set(topics).size;
    assert.ok(distinct >= Math.min(6, topics.length),
      t.slug + ' sampled only ' + distinct + ' distinct topics across ' + topics.length + ' questions');
  }
});

test('the fragment declares which bank revision it was built from', () => {
  /* Lets anyone reading a live page tell whether it predates a bank
     update, without diffing it against the repo. */
  for (const t of TESTS) {
    assert.match(frags[t.slug], new RegExp('data-bank="' + t.id + '"'));
    assert.match(frags[t.slug], new RegExp('data-bank-version="' + banks[t.id].version + '"'));
  }
});
