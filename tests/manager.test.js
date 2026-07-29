// Manager toolbox tests - registry schema + solver math.
// Direct ESM imports, no DOM needed (mirrors tests/solvers.test.js style).
// Worked fixtures are pulled from the spec itself, not invented:
//   - the "City of Everytown" asset-inventory table (annualized_replace =
//     cost_replace / life_yrs), reference/water-utility/operator-fundamentals/
//     repair-vs-replacement.md in the master repo.
//   - the $5,000/repair x 1 break/yr vs $100k/50yr REPLACE case, and the
//     1,200 ft / 3 breaks / 3 yr / ~4.4 breaks-per-mile-year example, both
//     from the same source doc (ADEQ Block 7 / Session 1 material).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculators, CAT_ORDER, validate } from '../src/manager/registry.js';

const byId = Object.fromEntries(calculators.map(c => [c.id, c]));
const solve = (id, v) => byId[id].solve(v);
const approx = (got, want, tol = 1e-3) => {
  assert.ok(got != null && isFinite(got), `expected ~${want}, got ${got}`);
  assert.ok(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)), `expected ~${want}, got ${got}`);
};

test('registry: 3 manager tools, valid schema, one per cat', () => {
  assert.equal(calculators.length, 3);
  assert.deepEqual(validate(), []);
  const ids = calculators.map(c => c.id).sort();
  assert.deepEqual(ids, ['cost-of-turnover', 'energy-cost', 'repair-or-replace']);
  for (const c of calculators) {
    assert.ok(CAT_ORDER.includes(c.cat), c.id);
    assert.ok(/^[a-z0-9-]+$/.test(c.id), c.id);
    for (const f of c.fields) assert.ok(f.k && typeof f.label === 'string', c.id + '.' + f.k);
  }
});

test('sweep: no manager tool throws on empty input; returns error string', () => {
  for (const c of calculators) {
    const empty = {}; c.fields.forEach(f => empty[f.k] = null);
    const r = c.solve(empty);
    assert.equal(typeof r.error, 'string', c.id);
    assert.ok(r.error.length > 0, c.id + ' should error on a fully blank form');
  }
});

test('sweep: no manager tool throws on any single-field input', () => {
  for (const c of calculators) {
    for (const f of c.fields) {
      const v = {}; c.fields.forEach(g => v[g.k] = null); v[f.k] = 1;
      assert.doesNotThrow(() => c.solve(v), `${c.id}.${f.k}`);
    }
  }
});

// ---------------------------------------------------------------------------
// repair-or-replace
// ---------------------------------------------------------------------------

test('repair-or-replace: worked fixture - $5,000/repair x 1 break/yr vs $100k/50yr -> REPLACE', () => {
  const r = solve('repair-or-replace', {
    breaksYr: 1, costRepair: 5000, costReplace: 100000, lifeYrs: 50, discountRate: 0, criticality: 'Normal'
  });
  approx(r.values.annualRepair, 5000);
  approx(r.values.annualizedReplace, 2000);
  approx(r.values.breakEvenN, 0.4);
  assert.equal(r.values.verdict, 'REPLACE');
  assert.ok(r.values.annualRepair > 1.10 * r.values.annualizedReplace);
});

test('repair-or-replace: worked fixture - City of Everytown reserve table (annualized_replace = cost_replace / life_yrs)', () => {
  // reference/water-utility/operator-fundamentals/repair-vs-replacement.md, the
  // "City of Everytown" asset-inventory table: each row's "Annual reserve" is
  // exactly cost_replace / life_yrs (life = the low end where a range is given).
  const mains = solve('repair-or-replace', { breaksYr: 0, costRepair: 5000, costReplace: 13986340, lifeYrs: 50 });
  approx(mains.values.annualizedReplace, 279726.80, 1e-4);
  const hydrants = solve('repair-or-replace', { breaksYr: 0, costRepair: 5000, costReplace: 840000, lifeYrs: 50 });
  approx(hydrants.values.annualizedReplace, 16800);
  const meters = solve('repair-or-replace', { breaksYr: 0, costRepair: 5000, costReplace: 447500, lifeYrs: 20 });
  approx(meters.values.annualizedReplace, 22375);
});

test('repair-or-replace: worked fixture - 1,200 ft / 3 breaks / 3 yr -> ~4.4 breaks/mile-yr, outlier', () => {
  // Same source doc: "a 1,200 ft section (about 0.227 miles) with 3 breaks
  // over 3 years ... Rate = 1 / 0.227 ~= 4.4 breaks per mile-year".
  const r = solve('repair-or-replace', {
    segLen: 1200, years: 3, breaks: 3, costRepair: 5000, costReplace: 50000, lifeYrs: 50
  });
  approx(r.values.breaksPerMileYr, 4.4, 1e-2);
  assert.equal(r.values.flagOutlier, true);
  approx(r.values.breaksYr, 1); // auto-filled from breaks/years, not overridden
});

test('repair-or-replace: +/-10% band, just inside and just outside each edge (annualized_replace = 2000)', () => {
  const base = { costRepair: 1000, costReplace: 100000, lifeYrs: 50, discountRate: 0 };
  // KEEP REPAIRING requires annual_repair < 0.90 * 2000 = 1800 (strict).
  const keepInside = solve('repair-or-replace', { ...base, breaksYr: 1.799 }); // annual = 1799
  assert.equal(keepInside.values.verdict, 'KEEP REPAIRING');
  const keepEdge = solve('repair-or-replace', { ...base, breaksYr: 1.8 }); // annual = 1800, not < 1800
  assert.equal(keepEdge.values.verdict, 'ON THE LINE');
  // REPLACE requires annual_repair > 1.10 * 2000 = 2200 (strict).
  const replaceEdge = solve('repair-or-replace', { ...base, breaksYr: 2.2 }); // annual = 2200, not > 2200
  assert.equal(replaceEdge.values.verdict, 'ON THE LINE');
  const replaceInside = solve('repair-or-replace', { ...base, breaksYr: 2.201 }); // annual = 2201
  assert.equal(replaceInside.values.verdict, 'REPLACE');
  // Dead center of the band.
  const centered = solve('repair-or-replace', { ...base, breaksYr: 2.0 }); // annual = 2000 = annualized_replace
  assert.equal(centered.values.verdict, 'ON THE LINE');
});

test('repair-or-replace: criticality override beats the arithmetic', () => {
  const base = { breaksYr: 0.05, costRepair: 1000, costReplace: 100000, lifeYrs: 50 }; // annual = 50, deep in KEEP REPAIRING territory
  const normal = solve('repair-or-replace', { ...base, criticality: 'Normal' });
  assert.equal(normal.values.verdict, 'KEEP REPAIRING');
  assert.equal(normal.values.criticalityOverride, false);
  const high = solve('repair-or-replace', { ...base, criticality: 'High' });
  assert.equal(high.values.verdict, 'REPLACE');
  assert.equal(high.values.criticalityOverride, true);
  const critical = solve('repair-or-replace', { ...base, criticality: 'Critical' });
  assert.equal(critical.values.verdict, 'REPLACE');
  assert.equal(critical.values.criticalityOverride, true);
});

test('repair-or-replace: 2x outlier rule fires at >= 2x cohort avg, not below it', () => {
  const base = { breaksYr: 1, costRepair: 5000, costReplace: 100000, lifeYrs: 50 };
  // cohortAvg defaults to 0.25 -> threshold 0.5 breaks/mile-yr.
  // milesVal = 2 exactly -> segLen (base ft) = 2 * 5280 = 10560 -> rate = (1/1)/2 = 0.5
  const atThreshold = solve('repair-or-replace', { ...base, segLen: 10560, years: 1, breaks: 1 });
  approx(atThreshold.values.breaksPerMileYr, 0.5);
  assert.equal(atThreshold.values.flagOutlier, true);
  // milesVal slightly above 2 -> rate slightly under 0.5 -> not flagged.
  const belowThreshold = solve('repair-or-replace', { ...base, segLen: 10565.28, years: 1, breaks: 1 });
  assert.ok(belowThreshold.values.breaksPerMileYr < 0.5);
  assert.equal(belowThreshold.values.flagOutlier, false);
  // An explicit, non-default cohort average is honored too.
  const customCohort = solve('repair-or-replace', { ...base, segLen: 8800, years: 1, breaks: 1, cohortAvg: 0.3 });
  // milesVal = 8800/5280 = 1.6667 -> rate = 1/1.6667 = 0.6 = 2 * 0.3
  approx(customCohort.values.breaksPerMileYr, 0.6, 1e-3);
  assert.equal(customCohort.values.flagOutlier, true);
});

test('repair-or-replace: discount-rate capital-recovery form reduces to cost_replace/life at d=0', () => {
  const zero = solve('repair-or-replace', { breaksYr: 1, costRepair: 5000, costReplace: 100000, lifeYrs: 50, discountRate: 0 });
  approx(zero.values.annualizedReplace, 100000 / 50);
  const omitted = solve('repair-or-replace', { breaksYr: 1, costRepair: 5000, costReplace: 100000, lifeYrs: 50 });
  approx(omitted.values.annualizedReplace, 100000 / 50);
  // A real discount rate actually changes the number (uses the capital-recovery form).
  const withDiscount = solve('repair-or-replace', { breaksYr: 1, costRepair: 5000, costReplace: 100000, lifeYrs: 50, discountRate: 5 });
  const d = 0.05, growth = Math.pow(1 + d, 50);
  const expected = 100000 * (d * growth) / (growth - 1);
  approx(withDiscount.values.annualizedReplace, expected, 1e-6);
  assert.notEqual(withDiscount.values.annualizedReplace, zero.values.annualizedReplace);
});

test('repair-or-replace: required-field guards return errors, not throws', () => {
  assert.match(solve('repair-or-replace', { costReplace: 100000, lifeYrs: 50 }).error, /breaks/i);
  assert.match(solve('repair-or-replace', { breaksYr: 1 }).error, /replacement cost/i);
  assert.match(solve('repair-or-replace', { breaksYr: 1, costReplace: 100000, lifeYrs: 0 }).error, /useful life/i);
});

// ---------------------------------------------------------------------------
// cost-of-turnover
// ---------------------------------------------------------------------------

test('cost-of-turnover: annual churn total and the retention-raise headline (defaults applied)', () => {
  const r = solve('cost-of-turnover', {
    operatorsLost: 2, salary: 60000, recruitCost: 3000, vacancyWeeks: 6
    // otWeeklyRate / rampMonths / rampLossPct all omitted -> defaults 400 / 12 / 50
  });
  approx(r.values.otBackfillCost, 2400); // 400/wk x 6 wk
  approx(r.values.rampCost, 30000);      // 60000 x (12/12) x 0.50
  approx(r.values.costPerDeparture, 35400);
  approx(r.values.annualCost, 70800);    // 2 x 35400
  approx(r.values.breakEvenRaise, 35400);
});

test('cost-of-turnover: overriding every default changes the math accordingly', () => {
  const r = solve('cost-of-turnover', {
    operatorsLost: 3, salary: 50000, recruitCost: 2000, vacancyWeeks: 4,
    otWeeklyRate: 300, rampMonths: 6, rampLossPct: 25
  });
  approx(r.values.otBackfillCost, 1200);
  approx(r.values.rampCost, 6250); // 50000 x 0.5 x 0.25
  approx(r.values.costPerDeparture, 9450);
  approx(r.values.annualCost, 28350);
  approx(r.values.breakEvenRaise, 9450);
});

test('cost-of-turnover: zero recruiting cost and zero vacancy weeks are valid, not errors', () => {
  const r = solve('cost-of-turnover', { operatorsLost: 1, salary: 60000, recruitCost: 0, vacancyWeeks: 0 });
  assert.equal(r.error, '');
  approx(r.values.otBackfillCost, 0);
  approx(r.values.costPerDeparture, r.values.rampCost);
});

test('cost-of-turnover: required-field guards return errors, not throws', () => {
  assert.match(solve('cost-of-turnover', { salary: 60000, recruitCost: 1000, vacancyWeeks: 1 }).error, /operators/i);
  assert.match(solve('cost-of-turnover', { operatorsLost: 1, recruitCost: 1000, vacancyWeeks: 1 }).error, /salary/i);
  assert.match(solve('cost-of-turnover', { operatorsLost: 1, salary: 60000, vacancyWeeks: 1 }).error, /recruiting/i);
  assert.match(solve('cost-of-turnover', { operatorsLost: 1, salary: 60000, recruitCost: 1000 }).error, /vacant/i);
});

// ---------------------------------------------------------------------------
// energy-cost
// ---------------------------------------------------------------------------

test('energy-cost: kWh/kgal and $/kgal math', () => {
  const r = solve('energy-cost', { kwh: 1500, gallons: 100000 }); // rate defaults to 0.10
  approx(r.values.kwhPerKgal, 15);
  approx(r.values.costPerKgal, 1.5);
  const r2 = solve('energy-cost', { kwh: 1500, gallons: 100000, rate: 0.12 });
  approx(r2.values.costPerKgal, 1.8);
});

test('energy-cost: kWh/kgal PM trigger fires at >= 15% up, not just under', () => {
  const base = { gallons: 100000, gallonsPrior: 100000, kwhPrior: 1000 }; // kwhPerKgalPrior = 10
  const atThreshold = solve('energy-cost', { ...base, kwh: 1150 }); // kwhPerKgal = 11.5, +15% exactly
  approx(atThreshold.values.energyPctChange, 15);
  assert.equal(atThreshold.values.flagEnergyUp, true);
  const justUnder = solve('energy-cost', { ...base, kwh: 1149.9 }); // +14.99%
  assert.ok(justUnder.values.energyPctChange < 15);
  assert.equal(justUnder.values.flagEnergyUp, false);
});

test('energy-cost: starts/day PM trigger fires at >= 25% up, not just under', () => {
  const base = { kwh: 1000, gallons: 100000, startsPerDayPrior: 100 };
  const atThreshold = solve('energy-cost', { ...base, startsPerDay: 125 }); // +25% exactly
  approx(atThreshold.values.startsPctChange, 25);
  assert.equal(atThreshold.values.flagStartsUp, true);
  const justUnder = solve('energy-cost', { ...base, startsPerDay: 124.9 }); // +24.9%
  assert.ok(justUnder.values.startsPctChange < 25);
  assert.equal(justUnder.values.flagStartsUp, false);
});

test('energy-cost: specific-capacity PM trigger fires at >= 20% down, not just under', () => {
  const base = { kwh: 1000, gallons: 100000, specificCapacityPrior: 100 };
  const atThreshold = solve('energy-cost', { ...base, specificCapacity: 80 }); // -20% exactly
  approx(atThreshold.values.scPctChange, -20);
  assert.equal(atThreshold.values.flagCapacityDown, true);
  const justUnder = solve('energy-cost', { ...base, specificCapacity: 80.1 }); // -19.9%
  assert.ok(justUnder.values.scPctChange > -20);
  assert.equal(justUnder.values.flagCapacityDown, false);
});

test('energy-cost: interpret() reflects trigger state (watch when tripped, good when clean)', () => {
  const tripped = solve('energy-cost', { kwh: 1150, gallons: 100000, kwhPrior: 1000, gallonsPrior: 100000 });
  const insTripped = byId['energy-cost'].interpret(tripped.values);
  assert.equal(insTripped.level, 'watch');
  const clean = solve('energy-cost', { kwh: 1000, gallons: 100000, kwhPrior: 1000, gallonsPrior: 100000 });
  const insClean = byId['energy-cost'].interpret(clean.values);
  assert.equal(insClean.level, 'good');
});

test('energy-cost: required-field guards return errors, not throws', () => {
  assert.match(solve('energy-cost', { gallons: 1000 }).error, /kwh/i);
  assert.match(solve('energy-cost', { kwh: 100 }).error, /gallons/i);
  assert.match(solve('energy-cost', { kwh: 100, gallons: 0 }).error, /gallons/i);
});

// ---------------------------------------------------------------------------
// House style: no em dashes in any user-visible string (project rule).
// ---------------------------------------------------------------------------

test('house style: no em dashes in titles, notes, formulas, or interpret() text', () => {
  const sample = {
    breaksYr: 1, costRepair: 5000, costReplace: 100000, lifeYrs: 50, criticality: 'High',
    segLen: 10560, years: 1, breaks: 1
  };
  for (const c of calculators) {
    for (const field of ['title', 'formula', 'note']) {
      assert.ok(!String(c[field]).includes('—'), c.id + '.' + field);
    }
    if (c.interpret) {
      const r = c.solve(Object.assign({}, ...c.fields.map(f => ({ [f.k]: null })), sample));
      const ins = c.interpret(r.values);
      if (ins) assert.ok(!ins.text.includes('—'), c.id + '.interpret()');
    }
  }
});
