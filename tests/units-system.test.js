// WW-01 unit system: the shared store, the partner table, the affine group,
// and the field edge conversions. Direct ESM imports, no DOM.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { UNITS, uConv, anchorOf, partner, systemOf, unitList, targetUnit, fieldToBase, fieldFromBase } from '../src/units.js';
import { getSystem, setSystem, subscribe, isMetric, _reset, STORAGE_KEY } from '../src/shared/units-store.js';
import { calculators } from '../src/registry.js';

const approx = (got, want, tol = 1e-6) => assert.ok(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)), `expected ~${want}, got ${got}`);

function fakeStorage(initial = {}, { throwOn = null } = {}) {
  const m = { ...initial };
  return {
    getItem(k) { if (throwOn === 'get') throw new Error('sandboxed'); return k in m ? m[k] : null; },
    setItem(k, v) { if (throwOn === 'set') throw new Error('sandboxed'); m[k] = String(v); },
    _m: m,
  };
}

test('store: imperial by default, only the exact string "metric" is metric', () => {
  for (const stored of [undefined, null, '', 'Metric', 'si', 'imperial']) {
    _reset(); globalThis.window = { localStorage: fakeStorage(stored == null ? {} : { [STORAGE_KEY]: stored }) };
    assert.equal(getSystem(), 'imperial', `stored=${stored}`);
  }
  _reset(); globalThis.window = { localStorage: fakeStorage({ [STORAGE_KEY]: 'metric' }) };
  assert.equal(getSystem(), 'metric'); assert.equal(isMetric(), true);
});

test('store: set persists, notifies once per change, ignores no-ops', () => {
  _reset(); const ls = fakeStorage(); globalThis.window = { localStorage: ls };
  const seen = []; subscribe(s => seen.push(s));
  setSystem('metric'); setSystem('metric'); setSystem('nonsense'); setSystem('imperial');
  assert.deepEqual(seen, ['metric', 'imperial']);
  assert.equal(ls._m[STORAGE_KEY], 'imperial');
});

test('store: a throwing localStorage never reaches the caller', () => {
  _reset(); globalThis.window = { localStorage: fakeStorage({}, { throwOn: 'get' }) };
  assert.equal(getSystem(), 'imperial');
  _reset(); globalThis.window = { localStorage: fakeStorage({}, { throwOn: 'set' }) };
  assert.equal(setSystem('metric'), 'metric');
  _reset(); delete globalThis.window;
  assert.equal(getSystem(), 'imperial');
});

test('units: every group has one anchor and every partner resolves inside its group', () => {
  for (const [g, members] of Object.entries(UNITS)) {
    assert.ok(anchorOf(g), `group ${g} has no anchor`);
    for (const [u, m] of Object.entries(members)) {
      if (m.met) { assert.ok(members[m.met], `${g}.${u}.met -> ${m.met} missing`); assert.equal(systemOf(g, m.met), 'metric', `${g}.${m.met} should be metric`); }
      if (m.imp) { assert.ok(members[m.imp], `${g}.${u}.imp -> ${m.imp} missing`); assert.equal(systemOf(g, m.imp), 'imperial', `${g}.${m.imp} should be imperial`); }
      assert.ok(!(m.met && m.imp), `${g}.${u} cannot be both systems`);
    }
  }
});

test('units: the ruled exam-sheet constants survive a round trip', () => {
  approx(uConv(1, 'mgd', 'gpm', 'flow'), 694.44444);
  approx(uConv(1, 'cf', 'gal', 'volume'), 7.480519);
  approx(uConv(1, 'psi', 'kPa', 'pressure'), 6.894757, 1e-5);
  approx(uConv(1, 'MLd', 'Lps', 'flow'), 11.574074, 1e-5);
  approx(uConv(1, 'gpdft2', 'm3m2d', 'arealflow'), 0.0407458, 1e-5);
  approx(uConv(1, 'gpdft', 'm3md', 'linearflow'), 0.0124193, 1e-5);
  for (const [g, members] of Object.entries(UNITS)) for (const u of Object.keys(members)) {
    const a = anchorOf(g); approx(uConv(uConv(12.5, u, a, g), a, u, g), 12.5, 1e-9);
  }
});

test('units: temperature is affine, not a factor', () => {
  approx(uConv(212, 'F', 'C', 'temperature'), 100);
  approx(uConv(-40, 'C', 'F', 'temperature'), -40);
  approx(uConv(0, 'C', 'F', 'temperature'), 32);
});

test('units: partner() and targetUnit() land where the ruling says', () => {
  assert.equal(partner('flow', 'mgd', 'metric'), 'MLd');
  assert.equal(partner('flow', 'MLd', 'imperial'), 'mgd');
  assert.equal(partner('flow', 'MLd', 'metric'), 'MLd');
  assert.equal(partner('volume', 'floz', 'metric'), 'mL');
  const liq = { unit: 'volume', def: 'gal', met: 'L', units: ['gal', 'floz', 'L', 'mL'] };
  assert.equal(targetUnit(liq, 'gal', 'metric'), 'L');   // field-level metric default wins
  assert.equal(targetUnit(liq, 'floz', 'metric'), 'mL');  // a hand-picked unit follows its own partner
  assert.equal(targetUnit(liq, 'L', 'imperial'), 'gal');
  assert.equal(targetUnit(liq, 'mL', 'imperial'), 'floz');
  const liqNoMet = { unit: 'volume', def: 'gal', units: ['gal', 'floz', 'L', 'mL'] }; // the WW-02 field as committed
  assert.equal(targetUnit(liqNoMet, 'gal', 'metric'), 'L');   // nearest declared metric unit, never m³
  assert.deepEqual(unitList(liqNoMet), ['gal', 'floz', 'L', 'mL']); // nothing appended
  const well = { unit: 'volume', def: 'gal', units: ['gal', 'L', 'm3', 'MG'] };
  assert.equal(targetUnit(well, 'gal', 'metric'), 'm3');
  assert.equal(targetUnit(well, 'MG', 'metric'), 'm3');   // ML not offered; m³ is the nearest declared
  assert.equal(targetUnit(well, 'm3', 'imperial'), 'gal');
  assert.equal(targetUnit(well, 'L', 'imperial'), 'gal');
  const impOnly = { unit: 'flow', def: 'mgd', units: ['mgd', 'gpm'] };
  assert.deepEqual(unitList(impOnly), ['mgd', 'gpm', 'MLd', 'Lps']); // partners appended so a flip can land
  const dia = { unit: 'length', def: 'in', units: ['in', 'ft', 'mm', 'cm', 'm'] };
  assert.equal(targetUnit(dia, 'in', 'metric'), 'mm');
  assert.equal(targetUnit(dia, 'mm', 'imperial'), 'in');
  assert.equal(targetUnit(dia, 'ft', 'metric'), 'm');
});

test('units: unitList() always contains both systems for every declared unit', () => {
  for (const c of calculators) for (const f of c.fields) {
    if (!f.unit) continue;
    const list = unitList(f);
    assert.ok(list.includes(f.def), `${c.id}.${f.k} list lacks def`);
    for (const u of list) for (const sys of ['metric', 'imperial']) {
      const t = targetUnit(f, u, sys);
      assert.ok(list.includes(t), `${c.id}.${f.k}: ${u} -> ${sys} lands on ${t}, not in list`);
      if (systemOf(f.unit, u) !== 'neutral') assert.equal(systemOf(f.unit, t), sys, `${c.id}.${f.k}: ${u} -> ${sys} landed on ${t} (${systemOf(f.unit, t)})`);
    }
  }
});

test('units: field base conversion keeps existing math and enables baked-in units', () => {
  const vol = { unit: 'volume', def: 'gal' };            // existing field: anchor gal
  approx(fieldToBase(vol, 1000, 'L'), 264.17205);
  approx(fieldFromBase(vol, 264.17205, 'L'), 1000);
  const flowMgd = { unit: 'flow', def: 'mgd', base: 'mgd' }; // a solver that expects MGD
  approx(fieldToBase(flowMgd, 1, 'mgd'), 1);
  approx(fieldToBase(flowMgd, 694.44444, 'gpm'), 1);
  approx(fieldToBase(flowMgd, 1, 'MLd'), 0.26417205, 1e-5);
  approx(fieldFromBase(flowMgd, 1, 'MLd'), 3.7854118, 1e-5);
  const temp = { unit: 'temperature', def: 'F', base: 'F' };
  approx(fieldToBase(temp, 100, 'C'), 212);
});
