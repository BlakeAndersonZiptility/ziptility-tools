/* The seam between the two bundles.

   Every practice question may carry a `calculator` field naming an
   Operator Calculator id. The practice bundle turns it into a link,
   calcUrl + '#' + q.calculator, offered as "Run this math in the Operator
   Calculator". Nothing had ever checked that those ids resolve, and two
   separate things were broken at once:

     1. No calculator card carried an id, so #<id> matched nothing. Fixed
        by card.id = c.id in src/ui/render.js.
     2. The grid renders one category of one mode at a time, so even with
        ids the target card is usually not in the DOM to scroll to. Fixed
        by gotoHash() switching mode and category before scrolling.

   The first half is testable here without a browser (do the ids exist in
   the registry at all), and that is the half that silently rots: a
   calculator renamed or retired on one side breaks links emitted by the
   other, in a different bundle, on a different release train, with
   nothing in either CI run noticing. The second half is exercised in
   tests/browser.test.js.

   Run: node --test tests/cross-tool-links.test.js */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculators } from '../src/registry.js';
import { TESTS } from '../src/practice/manifest.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'banks-src');

function allBanks() {
  return readdirSync(SRC).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(path.join(SRC, f), 'utf8')));
}

test('every calculator id referenced by a practice question exists in the registry', () => {
  const known = new Set(calculators.map((c) => c.id));
  const missing = [];
  for (const bank of allBanks()) {
    for (const q of bank.questions) {
      if (q.calculator && !known.has(q.calculator)) {
        missing.push(bank.id + ' / ' + q.id + ' -> #' + q.calculator);
      }
    }
  }
  assert.deepEqual(missing, [],
    'practice questions link to calculator ids that do not exist:\n  ' + missing.join('\n  '));
});

test('the cross-links are actually being exercised, not vacuously passing', () => {
  /* Guards the test above against becoming a no-op if the `calculator`
     field is ever dropped from the export: zero references would pass the
     missing-id check while meaning the feature is gone. */
  const refs = new Set();
  for (const bank of allBanks()) {
    for (const q of bank.questions) if (q.calculator) refs.add(q.calculator);
  }
  assert.ok(refs.size >= 20,
    'only ' + refs.size + ' distinct calculator cross-links found across the banks; expected the full set');
});

test('every bank named in the manifest has a source file', () => {
  const present = new Set(readdirSync(SRC).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
  for (const t of TESTS) {
    assert.ok(present.has(t.id), 'manifest names "' + t.id + '" but banks-src/' + t.id + '.json is missing');
  }
});
