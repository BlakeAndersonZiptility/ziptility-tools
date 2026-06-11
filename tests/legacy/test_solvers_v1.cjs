// QA harness: load calculator.js up to (not including) the DOM-wiring code,
// then exercise every solver.
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync(require('path').join(__dirname, '..', '..', 'calculator.js'), 'utf8');
const cut = src.indexOf("const grid=document.getElementById");
if (cut < 0) { console.error('FATAL: slice marker not found'); process.exit(1); }
const head = src.slice(0, cut);

// minimal DOM stub so the brand-CSS injection runs harmlessly
const styleEls = [];
const sandbox = {
  document: {
    createElement: (tag) => ({ tag, id: '', textContent: '' }),
    body: { appendChild: (el) => styleEls.push(el) },
    head: { appendChild: (el) => styleEls.push(el) },
    createTreeWalker: () => ({ nextNode: () => null }),
    querySelectorAll: () => [],
  },
  NodeFilter: { SHOW_TEXT: 4 },
  console, Math, isFinite, parseFloat, String, Object,
};
vm.createContext(sandbox);
const { calculators, UNITS, uConv } = vm.runInContext(head + ';({calculators, UNITS, uConv})', sandbox);
let pass = 0, fail = 0;
const approx = (a, b, tol = 1e-3) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
function check(name, got, want, tol) {
  if (got != null && isFinite(got) && approx(got, want, tol)) { pass++; }
  else { fail++; console.log(`FAIL ${name}: got ${got}, want ${want}`); }
}
function solve(id, v) {
  const c = calculators.find(c => c.id === id);
  return c.solve(v);
}

// brand CSS actually injected?
if (styleEls.length === 1 && styleEls[0].id === 'zip-brand-align' && styleEls[0].textContent.includes('#ff442f')) pass++;
else { fail++; console.log('FAIL: brand style not injected as expected'); }

// ---- spot checks against hand-computed values ----
check('area-rect 10x20', solve('area-rect', { L: 10, W: 20, A: null }).values.A, 200);
check('area-rect back-solve W', solve('area-rect', { L: 10, W: null, A: 200 }).values.W, 20);
check('area-circle D=10', solve('area-circle', { D: 10, R: null, A: null }).values.A, 78.54, 1e-2);
check('vol-cyl D=20 H=10 gal', solve('vol-cyl', { D: 20, R: null, H: 10, V: null }).values.V, 0.7854 * 400 * 10 * 7.4805, 1e-3);
check('vol-box 10x10x10 gal', solve('vol-box', { L: 10, W: 10, H: 10, V: null }).values.V, 7480.5, 1e-3);
check('gpm->mgd 694.444gpm', solve('gpm-mgd', { gpm: 694.444, mgd: null, ml: null }).values.mgd, 1.0, 1e-3);
check('pressure 100psi->ft', solve('pressure-head', { psi: 100, ft: null }).values.ft, 230.67, 1e-3);
check('loading 1MGD 200mg/L', solve('loading', { mgd: 1, conc: 200, lbs: null }).values.lbs, 1668);
check('mass back-solve conc', solve('mass', { mg: 2, conc: null, lbs: 3336 }).values.conc, 200);
check('CT 1.2mg/L 30min', solve('ct-disinfection', { conc: 1.2, time: 30, ct: null, req: 36, ratio: null }).values.ratio, 1.0);
check('detention V/Q', solve('detention', { vol: 100000, flow: 500, t: null }).values.t, 200);
check('SVI ssv=200 mlss=2000', solve('svi', { ssv: 200, ssvpct: null, mlss: 2000, svi: null, sdi: null }).values.svi, 100);
check('SVI sdi', solve('svi', { ssv: 200, ssvpct: null, mlss: 2000, svi: null, sdi: null }).values.sdi, 1.0);
check('removal 200->20', solve('removal', { in: 200, out: 20, eff: null }).values.eff, 90);
check('fm ratio', solve('fm-ratio', { bod: 200, mgd: 1, mlvss: 2500, mg: 0.5, fm: null }).values.fm, 0.16);
check('chem-feed 10mg/L 1MGD 100%', solve('chem-feed', { dose: 10, mgd: 1, pur: null, feed: null }).values.feed, 83.4);
check('chem-feed 65% purity', solve('chem-feed', { dose: 10, mgd: 1, pur: 65, feed: null }).values.feed, 128.3, 1e-2);
check('dilution C1V1=C2V2', solve('dilution', { c1: 12, v1: null, c2: 0.5, v2: 120 }).values.v1, 5);
check('hp 500gpm 100ft 80%eff', solve('hp', { gpm: 500, head: 100, sg: null, eff: 80, hp: null, price: null, hrs: null, cost: null }).values.hp, 500 * 100 / (3960 * 0.8), 1e-3);
check('water-hp', solve('water-hp', { gpm: 396, head: 100, whp: null }).values.whp, 10);
check('motor-hp', solve('motor-hp', { gpm: 396, head: 100, peff: 80, meff: 90, mhp: null }).values.mhp, 10 / 0.72, 1e-3);
check('ohms law', solve('ohms-law', { v: null, a: 5, r: 10 }).values.v, 50);
check('temp 212F->100C', solve('temp', { f: 212, c: null }).values.c, 100);
check('temp 0C->32F', solve('temp', { f: null, c: 0 }).values.f, 32);
check('alkalinity', solve('alkalinity', { tit: 10, norm: 0.02, samp: 100, alk: null }).values.alk, 100);
check('bod', solve('bod', { ido: 8, fdo: 4, samp: 300, bod: null }).values.bod, 4);
check('drawdown SC', (() => { const r = solve('drawdown', { air: 120, poff: 20, pon: 10, gpm: 100, stat: null, pump: null, dd: null, sc: null }); return r.values.sc; })(), 100 / (20 * 2.3067 - 10 * 2.3067), 1e-3);
check('water-loss pct', solve('water-loss', { pump: 1000, met: 800, unmet: 50, leak: 50, other: 0, acct: null, lost: null, pct: null }).values.pct, 10);
check('mcrt', solve('mcrt', { mlss: 3000, aer: 1, was: 8000, wasq: 0.05, ess: 20, essq: 1, mcrt: null }).values.mcrt, (3000 * 1) / (8000 * 0.05 + 20 * 1), 1e-3);
check('pop-equiv', solve('pop-equiv', { mgd: 1, bod: 200, pe: null }).values.pe, 1668 / 0.17, 1e-3);
check('uConv 1 mi -> ft', uConv(1, 'mi', 'ft', 'length'), 5280);
check('uConv 1 MGD -> gpm', uConv(1, 'mgd', 'gpm', 'flow'), 694.444, 1e-3);
check('converter length ft->m', (() => { const c = calculators.find(c => c.id === 'conv-length'); return c.solve({ in: 1, out: null }).values.out; })(), 1, 1e-9); // base-unit passthrough

// ---- sweep: no calculator may throw on empty, and must return an error string ----
for (const c of calculators) {
  const empty = {}; c.fields.forEach(f => empty[f.k] = null);
  try {
    const r = c.solve(empty);
    if (r && typeof r.error === 'string') pass++;
    else { fail++; console.log(`FAIL sweep ${c.id}: bad shape`, r); }
  } catch (e) { fail++; console.log(`FAIL sweep ${c.id}: threw ${e.message}`); }
}
// sweep: single-field partial input must not throw
for (const c of calculators) {
  for (const f of c.fields) {
    const v = {}; c.fields.forEach(g => v[g.k] = null); v[f.k] = 1;
    try { c.solve(v); pass++; } catch (e) { fail++; console.log(`FAIL partial ${c.id}.${f.k}: ${e.message}`); }
  }
}

console.log(`\n${pass} passed, ${fail} failed (${calculators.length} calculators)`);
process.exit(fail ? 1 : 0);
