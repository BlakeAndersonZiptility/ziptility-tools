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

test('registry: 67+ calculators, valid schema, ordered categories', () => {
  assert.ok(calculators.length >= 67, `only ${calculators.length} calculators`);
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

test('treatment: flux & UFRV (v2.1)', () => {
  const LMH = 3.78541 / 0.09290304 / 24; // ≈ 1.69779 LMH per gfd
  const f = solve('flux', { flow: 100, area: 50, gfd: null, lmh: null });
  approx(f.values.gfd, 2880);
  approx(f.values.lmh, 2880 * LMH);
  approx(solve('flux', { flow: null, area: 200, gfd: 20, lmh: null }).values.flow, 20 * 200 / 1440);
  approx(solve('ufrv', { flow: null, area: null, rate: 4, hrs: 20, ufrv: null }).values.ufrv, 4800);
  approx(solve('ufrv', { flow: 200, area: 50, rate: null, hrs: 24, ufrv: null }).values.ufrv, 5760);
});

test('power conversion & operating cost (v2.1)', () => {
  approx(uConv(1, 'hp', 'kW', 'power'), 0.745700, 1e-4);
  approx(uConv(1, 'hp', 'btuh', 'power'), 2544.43, 1e-4);
  approx(solve('conv-power', { in: 1, out: null }).values.out, 1, 1e-9);
  approx(solve('op-cost', { hp: 50, price: 0.12, meff: null, hrs: null, perhr: null, perday: null }).values.perhr, 4.476);
  const oc = solve('op-cost', { hp: 50, price: 0.12, meff: 90, hrs: 24, perhr: null, perday: null });
  approx(oc.values.perhr, 50 * 0.746 / 0.9 * 0.12);
  approx(oc.values.perday, oc.values.perhr * 24);
  const se = solve('specific-energy', { kwh: 1500, mg: 1, price: 0.1, kpmg: null, cpmg: null, kwhB: 1200, mgB: 1, kpmgB: null, cpmgB: null });
  approx(se.values.kpmg, 1500); approx(se.values.cpmg, 150); approx(se.values.kpmgB, 1200);
});

test('field disinfection (v2.1)', () => {
  // dimensional inputs are in BASE units (ft) — the UI's unit selects convert
  const w = solve('well-disinfection', { dia: 0.5, depth: 100, vol: null, dose: 50, lbs: null, liqpct: 5, liqgal: null, drypct: 65, drylbs: null });
  approx(w.values.vol, 146.88, 1e-2); // = 0.0408 × 6in² × 100ft
  approx(w.values.lbs, 50 * (w.values.vol / 1e6) * 8.34);
  approx(w.values.liqgal, w.values.lbs / (8.34 * 0.05));
  approx(w.values.drylbs, w.values.lbs / 0.65);
  approx(solve('tank-volume-field', { dia: 8, depth: 10, gal: null }).values.gal, 0.0408 * 96 * 96 * 10, 1e-2);
  approx(solve('pipe-volume', { dia: 8 / 12, len: 1000, gal: null }).values.gal, 2611.2, 1e-2);
  approx(solve('pipe-volume', { dia: 8 / 12, len: null, gal: 2611.2 }).values.len, 1000, 1e-2);
  const m = solve('main-disinfection', { dia: 8 / 12, len: 1000, vol: null, dose: null, lbs: null, liqpct: 5, liqgal: null, drypct: null, drylbs: null });
  approx(m.values.dose, 25); // C651 default
  approx(m.values.lbs, 25 * (m.values.vol / 1e6) * 8.34);
  approx(m.values.liqgal, m.values.lbs / (8.34 * 0.05));
  // tank chlorination: target → liquid AND granular, plus both inverses
  const t = solve('tank-chlorination', { dia: null, depth: null, gal: 50000, dose: 10, lbs: null, liqpct: 12.5, liqgal: null, drypct: 65, drylbs: null });
  approx(t.values.lbs, 4.17);
  approx(t.values.liqgal, 4.17 / (8.34 * 0.125));
  approx(t.values.drylbs, 4.17 / 0.65);
  approx(solve('tank-chlorination', { dia: null, depth: null, gal: 50000, dose: null, lbs: null, liqpct: 12.5, liqgal: 4, drypct: null, drylbs: null }).values.dose,
    (4 * 8.34 * 0.125) / (0.05 * 8.34));
  approx(solve('tank-chlorination', { dia: null, depth: null, gal: 50000, dose: null, lbs: null, liqpct: null, liqgal: null, drypct: 65, drylbs: 6.4154 }).values.dose, 10, 1e-3);
});

test('hydrant flow test (v2.1)', () => {
  const q = 29.83 * 0.9 * 2.5 * 2.5 * Math.sqrt(50);
  const r = solve('hydrant-flow', { d: null, c: null, pitot: 50, q: null, static: 62, resid: 42, q20: null });
  approx(r.values.q, q, 1e-2);
  approx(r.values.q20, q * Math.pow(42, 0.54) / Math.pow(20, 0.54), 1e-2);
  // explicit nozzle dia arrives in base ft: 4.5" pumper nozzle
  approx(solve('hydrant-flow', { d: 4.5 / 12, c: 0.8, pitot: 30, q: null, static: null, resid: null, q20: null }).values.q,
    29.83 * 0.8 * 4.5 * 4.5 * Math.sqrt(30), 1e-2);
  assert.equal(solve('hydrant-flow', { d: null, c: null, pitot: 50, q: null, static: 42, resid: 62, q20: null }).error.length > 0, true);
});

test('water loss & capacity (v2.1)', () => {
  const cl = solve('customer-leak', { gph: 5, gpd: null, gpmo: null, rate: 4, cost: null });
  approx(cl.values.gpd, 120); approx(cl.values.gpmo, 3600); approx(cl.values.cost, 14.4);
  const bl = solve('break-loss', { d: 1 / 12, c: null, psi: 60, gpm: null, mins: 120, flush: 5000, total: null });
  approx(bl.values.gpm, 29.83 * 0.6 * Math.sqrt(60), 1e-2);
  approx(bl.values.total, bl.values.gpm * 120 + 5000, 1e-2);
  const ok = solve('capacity-assessment', { avg: 500000, peak: 900000, source: 1000000, storage: 600000, capr: null, sdays: null, capsub: null, storsub: null, score: null });
  approx(ok.values.score, 100);
  const short = solve('capacity-assessment', { avg: 500000, peak: 1200000, source: 900000, storage: 300000, capr: null, sdays: null, capsub: null, storsub: null, score: null });
  approx(short.values.capr, 0.75); approx(short.values.sdays, 0.6); approx(short.values.score, 54);
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

test('links: resource backlinks are well-formed', () => {
  const linked = calculators.filter(c => c.links && c.links.length);
  assert.ok(linked.length >= 2, 'expected at least the two seed links');
  // v2.1 cards cite external references (EPA/AWWA/NFPA); all links must be https,
  // and the original ziptility.com seed backlinks must still exist.
  for (const c of linked) for (const l of c.links) {
    assert.match(l.href, /^https:\/\//, c.id);
    assert.ok(l.label.length > 3, c.id);
  }
  const zip = linked.filter(c => c.links.some(l => /^https:\/\/www\.ziptility\.com\//.test(l.href)));
  assert.ok(zip.length >= 2, 'expected the two ziptility.com seed backlinks to remain');
});
