// Solver math + registry schema tests. Direct ESM imports — no DOM needed.
// Expected values are hand-computed (ported unchanged from the v1 QA suite).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculators, CAT_ORDER, validate } from '../src/registry.js';
import { UNITS, uConv } from '../src/units.js';

const byId = Object.fromEntries(calculators.map(c => [c.id, c]));
const solve = (id, v) => byId[id].solve(v);
const approx = (got, want, tol = 1e-3) => {
  assert.ok(got != null && isFinite(got), `expected ~${want}, got ${got}`);
  assert.ok(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)), `expected ~${want}, got ${got}`);
};

test('registry: 53+ calculators, valid schema, ordered categories', () => {
  assert.ok(calculators.length >= 53, `only ${calculators.length} calculators`);
  assert.deepEqual(validate(), []);
  for (const c of calculators) assert.ok(CAT_ORDER.includes(c.cat), c.id);
});

test('geometry & volume', () => {
  approx(solve('area-rect', { L: 10, W: 20, A: null }).values.A, 200);
  approx(solve('area-rect', { L: 10, W: null, A: 200 }).values.W, 20);
  approx(solve('area-circle', { D: 10, R: null, A: null }).values.A, 78.54, 1e-2);
  approx(solve('vol-cyl', { D: 20, R: null, H: 10, V: null }).values.V, 0.7854 * 400 * 10 * 7.4805);
  approx(solve('vol-box', { L: 10, W: 10, H: 10, V: null }).values.V, 7480.5);
});

test('flow & pressure', () => {
  approx(solve('gpm-mgd', { gpm: 694.444, mgd: null, ml: null }).values.mgd, 1.0);
  approx(solve('pressure-head', { psi: 100, ft: null }).values.ft, 230.67);
  approx(solve('detention', { vol: 100000, flow: 500, t: null }).values.t, 200);
});

test('loading & mass', () => {
  approx(solve('loading', { mgd: 1, conc: 200, lbs: null }).values.lbs, 1668);
  approx(solve('mass', { mg: 2, conc: null, lbs: 3336 }).values.conc, 200);
  approx(solve('pop-equiv', { mgd: 1, bod: 200, pe: null }).values.pe, 1668 / 0.17);
});

test('treatment, process control, solids', () => {
  approx(solve('ct-disinfection', { conc: 1.2, time: 30, ct: null, req: 36, ratio: null }).values.ratio, 1.0);
  approx(solve('svi', { ssv: 200, ssvpct: null, mlss: 2000, svi: null, sdi: null }).values.svi, 100);
  approx(solve('svi', { ssv: 200, ssvpct: null, mlss: 2000, svi: null, sdi: null }).values.sdi, 1.0);
  approx(solve('removal', { in: 200, out: 20, eff: null }).values.eff, 90);
  approx(solve('fm-ratio', { bod: 200, mgd: 1, mlvss: 2500, mg: 0.5, fm: null }).values.fm, 0.16);
  approx(solve('mcrt', { mlss: 3000, aer: 1, was: 8000, wasq: 0.05, ess: 20, essq: 1, mcrt: null }).values.mcrt, (3000 * 1) / (8000 * 0.05 + 20 * 1));
});

test('dosage & chemical', () => {
  approx(solve('chem-feed', { dose: 10, mgd: 1, pur: null, feed: null }).values.feed, 83.4);
  approx(solve('chem-feed', { dose: 10, mgd: 1, pur: 65, feed: null }).values.feed, 128.3, 1e-2);
  approx(solve('dilution', { c1: 12, v1: null, c2: 0.5, v2: 120 }).values.v1, 5);
});

test('pumps & power', () => {
  approx(solve('hp', { gpm: 500, head: 100, sg: null, eff: 80, hp: null, price: null, hrs: null, cost: null }).values.hp, 500 * 100 / (3960 * 0.8));
  approx(solve('water-hp', { gpm: 396, head: 100, whp: null }).values.whp, 10);
  approx(solve('motor-hp', { gpm: 396, head: 100, peff: 80, meff: 90, mhp: null }).values.mhp, 10 / 0.72);
  approx(solve('ohms-law', { v: null, a: 5, r: 10 }).values.v, 50);
});

test('wells, lab, conversions', () => {
  const dd = solve('drawdown', { air: 120, poff: 20, pon: 10, gpm: 100, stat: null, pump: null, dd: null, sc: null });
  approx(dd.values.sc, 100 / (20 * 2.3067 - 10 * 2.3067));
  approx(solve('water-loss', { pump: 1000, met: 800, unmet: 50, leak: 50, other: 0, acct: null, lost: null, pct: null }).values.pct, 10);
  approx(solve('alkalinity', { tit: 10, norm: 0.02, samp: 100, alk: null }).values.alk, 100);
  approx(solve('bod', { ido: 8, fdo: 4, samp: 300, bod: null }).values.bod, 4);
  approx(solve('temp', { f: 212, c: null }).values.c, 100);
  approx(solve('temp', { f: null, c: 0 }).values.f, 32);
  approx(uConv(1, 'mi', 'ft', 'length'), 5280);
  approx(uConv(1, 'mgd', 'gpm', 'flow'), 694.444);
  approx(solve('conv-length', { in: 1, out: null }).values.out, 1, 1e-9);
});

test('sweep: no calculator throws on empty input; returns error string', () => {
  for (const c of calculators) {
    const empty = {}; c.fields.forEach(f => empty[f.k] = null);
    const r = c.solve(empty);
    assert.equal(typeof r.error, 'string', c.id);
  }
});

test('sweep: no calculator throws on any single-field input', () => {
  for (const c of calculators) {
    for (const f of c.fields) {
      const v = {}; c.fields.forEach(g => v[g.k] = null); v[f.k] = 1;
      assert.doesNotThrow(() => c.solve(v), `${c.id}.${f.k}`);
    }
  }
});

test('links: seeded resource backlinks are well-formed', () => {
  const linked = calculators.filter(c => c.links && c.links.length);
  assert.ok(linked.length >= 2, 'expected at least the two seed links');
  for (const c of linked) for (const l of c.links) {
    assert.match(l.href, /^https:\/\/www\.ziptility\.com\//, c.id);
    assert.ok(l.label.length > 3, c.id);
  }
});
