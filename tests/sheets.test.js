// Formula sheets data: one list, both systems. Direct ESM imports, no DOM.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHEETS } from '../src/sheets/lines.js';

const all = SHEETS.flatMap((sh) => sh.blocks.flatMap((b) => b.lines.map((l) => ({ ...l, sheet: sh.id, block: b.h }))));
// US-customary conversion constants that must not survive into an SI line (the ruling's whole point).
const BAD_CONST = /(8\.34|7\.48|\b694\b|1\.547|1\.55 cubic|2\.31|0\.433|3,960|0\.746|448\.8|5,280)/;
// US unit words that must not appear in an SI line unless the line is unit-invariant (identical).
const BAD_UNIT = /\b(gallons?|gpm|MGD|gpd|psi|feet|foot|inch(es)?|pounds?|horsepower|cubic f(ee|oo)t|acre-?f(ee|oo)t|miles?)\b/i;

test('sheets: four sheets, every line has a US and an SI form', () => {
  assert.deepEqual(SHEETS.map((s) => s.id), ['water-treatment', 'water-distribution', 'wastewater-treatment', 'wastewater-collection']);
  assert.ok(all.length >= 85, `only ${all.length} lines`);
  for (const l of all) {
    assert.ok(l.imp && l.imp.trim(), `${l.sheet}/${l.block}: empty imp`);
    assert.ok(l.si && l.si.trim(), `${l.sheet}/${l.block}: empty si for "${l.imp}"`);
    assert.ok(!/[—–]/.test(l.imp + l.si), `${l.sheet}: em/en dash in "${l.imp}"`);
  }
});

test('sheets: SI lines carry no US-customary conversion constant or unit word', () => {
  for (const l of all) {
    if (l.si === l.imp) continue; // unit-invariant line, allowed to be identical
    assert.ok(!BAD_CONST.test(l.si), `${l.sheet}: constant left in SI line "${l.si}"`);
    assert.ok(!BAD_UNIT.test(l.si), `${l.sheet}: US unit word in SI line "${l.si}"`);
  }
});

test('sheets: a US line that appears on more than one sheet has one SI form', () => {
  const seen = new Map();
  for (const l of all) {
    const k = l.imp.replace(/\s+/g, ' ').trim();
    if (seen.has(k)) assert.equal(seen.get(k), l.si, `"${k}" has two SI forms`);
    seen.set(k, l.si);
  }
});

test('sheets: the lines that carry a constant were actually rewritten', () => {
  const carrying = all.filter((l) => BAD_CONST.test(l.imp));
  assert.ok(carrying.length >= 20, `expected the ~23 constant-bearing lines, found ${carrying.length}`);
  for (const l of carrying) assert.notEqual(l.si, l.imp, `${l.sheet}: "${l.imp}" unchanged in SI`);
});
