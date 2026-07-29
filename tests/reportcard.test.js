/* Utility Health Report Card: scoring tests.

   Checked against the workbook's Methodology sheet, quoted in each case,
   not against arithmetic invented here. A utility may carry this grade to
   its board, so the branches that change a headline letter (the leg mean,
   the mean-of-legs, the practical-grade cap) each get a hand-built fixture.

   Run: node --test tests/reportcard.test.js */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GRADE_VALUES, GRADES, LEGS, valueToGrade, legAverage, overallGrade,
  redLineFlags, practicalGrade, oneRungUp, actionFor, score
} from '../src/reportcard/scoring.js';
import { RED_LINE_IDS, PRACTICAL_CAP_THRESHOLD } from '../src/reportcard/config.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RUBRIC = JSON.parse(readFileSync(path.join(ROOT, 'src/reportcard/data/rubric.json'), 'utf8'));
const DIMS = RUBRIC.dimensions;

/* ---- the data itself ------------------------------------------------- */

test('the rubric holds 23 dimensions split 9 Technical / 8 Managerial / 6 Financial', () => {
  assert.equal(DIMS.length, 23);
  const counts = {};
  for (const d of DIMS) counts[d.leg] = (counts[d.leg] || 0) + 1;
  assert.deepEqual(counts, { T: 9, M: 8, F: 6 });
});

test('every dimension has all five rung descriptors and all four transition cells', () => {
  /* 115 rungs and 92 action cells. A missing rung is a dimension a reader
     cannot grade themselves against, which is the whole mechanism. */
  let rungs = 0, actions = 0;
  for (const d of DIMS) {
    for (const g of GRADES) {
      assert.ok(d.rungs[g] && d.rungs[g].trim().length > 0, d.id + ' is missing its ' + g + ' rung');
      rungs++;
    }
    for (const t of ['F->D', 'D->C', 'C->B', 'B->A']) {
      assert.ok(d.actions[t] && d.actions[t].trim().length > 0, d.id + ' is missing its ' + t + ' action cell');
      actions++;
    }
  }
  assert.equal(rungs, 115);
  assert.equal(actions, 92);
});

test('every dimension carries a citation', () => {
  for (const d of DIMS) {
    assert.ok(d.citation && d.citation.trim().length > 0, d.id + ' has no citation');
  }
});

test('every configured red-line id is a real dimension', () => {
  /* A typo here would silently disable a flag: the dimension would never
     match, so the panel would just never fire for it. */
  const ids = new Set(DIMS.map((d) => d.id));
  for (const id of RED_LINE_IDS) {
    assert.ok(ids.has(id), 'red-line id "' + id + '" is not a dimension in the rubric');
  }
});

/* ---- grade conversion ------------------------------------------------ */

test('grades convert F=0 D=1 C=2 B=3 A=4', () => {
  assert.deepEqual(GRADE_VALUES, { F: 0, D: 1, C: 2, B: 3, A: 4 });
});

test('averages round to the nearest letter, and .5 rounds upward', () => {
  assert.equal(valueToGrade(0), 'F');
  assert.equal(valueToGrade(4), 'A');
  assert.equal(valueToGrade(1.4), 'D');
  assert.equal(valueToGrade(1.5), 'C'); /* upward, consistently */
  assert.equal(valueToGrade(2.49), 'C');
  assert.equal(valueToGrade(2.5), 'B');
  assert.equal(valueToGrade(null), null);
});

/* ---- leg averages --------------------------------------------------- */

function allAt(grade) {
  const g = {};
  for (const d of DIMS) g[d.id] = grade;
  return g;
}

test('a uniform assessment returns that grade for every leg and overall', () => {
  for (const grade of GRADES) {
    const s = score(allAt(grade), DIMS);
    for (const l of s.legAverages) assert.equal(l.grade, grade, 'leg ' + l.leg + ' at uniform ' + grade);
    assert.equal(s.overall.grade, grade);
  }
});

test('leg average is the mean of that leg only', () => {
  /* Technical has 9 dimensions. Setting 5 to A (4) and 4 to F (0) gives
     20/9 = 2.22, which rounds to C. */
  const g = allAt('C');
  const tech = DIMS.filter((d) => d.leg === 'T');
  tech.forEach((d, i) => { g[d.id] = i < 5 ? 'A' : 'F'; });
  const l = legAverage(g, DIMS, 'T');
  assert.equal(l.answered, 9);
  assert.ok(Math.abs(l.value - 20 / 9) < 1e-9, 'expected 20/9, got ' + l.value);
  assert.equal(l.grade, 'C');
});

test('ungraded dimensions are excluded from the average, not counted as F', () => {
  /* Intake allows skip-and-return, so counting blanks as F would report a
     failing leg to somebody who simply has not finished. */
  const g = {};
  const tech = DIMS.filter((d) => d.leg === 'T');
  g[tech[0].id] = 'A';
  g[tech[1].id] = 'A';
  const l = legAverage(g, DIMS, 'T');
  assert.equal(l.answered, 2);
  assert.equal(l.total, 9);
  assert.equal(l.grade, 'A');
});

test('a leg with nothing graded reports null rather than F', () => {
  const l = legAverage({}, DIMS, 'M');
  assert.equal(l.value, null);
  assert.equal(l.grade, null);
  assert.equal(l.answered, 0);
});

/* ---- overall = mean of the three LEG averages ----------------------- */

test('overall is the mean of the three leg averages, not of all 23 dimensions', () => {
  /* The distinction is the point. Technical (9) all A, Managerial (8) and
     Financial (6) all F.
       mean of legs   = (4 + 0 + 0) / 3 = 1.33  -> D
       mean of all 23 = 9*4 / 23        = 1.57  -> C
     Getting this wrong would over-weight Technical by half again. */
  const g = {};
  for (const d of DIMS) g[d.id] = d.leg === 'T' ? 'A' : 'F';
  const s = score(g, DIMS);
  assert.ok(Math.abs(s.overall.value - 4 / 3) < 1e-9, 'expected 4/3, got ' + s.overall.value);
  assert.equal(s.overall.grade, 'D');
  assert.notEqual(s.overall.grade, 'C', 'overall was computed across all 23 dimensions instead of across legs');
});

/* ---- red-line flags -------------------------------------------------- */

test('a red-line F raises a flag; the same F on a non-red-line dimension does not', () => {
  const redLine = DIMS.find((d) => RED_LINE_IDS.includes(d.id));
  const plain = DIMS.find((d) => !RED_LINE_IDS.includes(d.id));

  const g1 = allAt('B'); g1[redLine.id] = 'F';
  assert.deepEqual(redLineFlags(g1, DIMS).map((f) => f.id), [redLine.id]);

  const g2 = allAt('B'); g2[plain.id] = 'F';
  assert.deepEqual(redLineFlags(g2, DIMS), []);
});

test('a red-line D does not flag under the F-only trigger', () => {
  /* The workbook Methodology says an F indicates existential risk. The
     prototype fired on F or D; this asserts which rule shipped. */
  const redLine = DIMS.find((d) => RED_LINE_IDS.includes(d.id));
  const g = allAt('B'); g[redLine.id] = 'D';
  assert.deepEqual(redLineFlags(g, DIMS), []);
});

test('flags come back in rubric order, not object-key order', () => {
  const g = allAt('B');
  for (const id of RED_LINE_IDS) g[id] = 'F';
  const order = DIMS.filter((d) => RED_LINE_IDS.includes(d.id)).map((d) => d.id);
  assert.deepEqual(redLineFlags(g, DIMS).map((f) => f.id), order);
});

/* ---- the practical-grade cap ---------------------------------------- */

test('one red-line F does not cap the overall grade', () => {
  const g = allAt('A'); g[RED_LINE_IDS[0]] = 'F';
  const s = score(g, DIMS);
  assert.equal(s.flags.length, 1);
  assert.equal(s.practical.capped, false);
  assert.equal(s.practical.grade, s.overall.grade);
});

test('two red-line Fs cap the overall grade at D and keep the descriptive grade', () => {
  /* "When 2 or more red-line F's are flagged, the Overall grade is
     annotated 'Practical Grade: D (capped by diagnostic flags)' even if
     the descriptive composite is higher." */
  const g = allAt('A');
  g[RED_LINE_IDS[0]] = 'F';
  g[RED_LINE_IDS[1]] = 'F';
  const s = score(g, DIMS);
  assert.equal(s.flags.length, 2);
  assert.ok(s.flags.length >= PRACTICAL_CAP_THRESHOLD);
  assert.equal(s.practical.capped, true);
  assert.equal(s.practical.grade, 'D');
  assert.ok(GRADE_VALUES[s.practical.descriptiveGrade] > GRADE_VALUES['D'],
    'the descriptive composite should still be reported, and higher');
});

test('the cap never raises a grade', () => {
  /* Everything at F: two red-line Fs are present, but "capped at D" must
     not lift a failing system to D. */
  const s = score(allAt('F'), DIMS);
  assert.ok(s.flags.length >= 2);
  assert.equal(s.overall.grade, 'F');
  assert.equal(s.practical.grade, 'F');
  assert.equal(s.practical.capped, false);
});

/* ---- one rung up ---------------------------------------------------- */

test('one rung up names three dimensions with their next grade up', () => {
  const s = score(allAt('C'), DIMS);
  assert.equal(s.oneRungUp.length, 3);
  for (const r of s.oneRungUp) {
    assert.equal(r.current, 'C');
    assert.equal(r.target, 'B');
  }
});

test('a red-line dimension outranks a non-red-line dimension at the same grade', () => {
  const redLine = DIMS.find((d) => RED_LINE_IDS.includes(d.id));
  const g = allAt('A');
  const plain = DIMS.find((d) => !RED_LINE_IDS.includes(d.id) && d.id !== redLine.id);
  g[redLine.id] = 'C';
  g[plain.id] = 'C';
  const ranked = oneRungUp(g, DIMS);
  const iRed = ranked.findIndex((r) => r.id === redLine.id);
  const iPlain = ranked.findIndex((r) => r.id === plain.id);
  assert.ok(iRed > -1 && iRed < iPlain, 'the red-line dimension should rank first');
});

test('a dimension already at A is never offered a rung up', () => {
  const s = score(allAt('A'), DIMS);
  assert.deepEqual(s.oneRungUp, []);
});

test('one rung up is deterministic for identical answers', () => {
  const g = allAt('D');
  assert.deepEqual(oneRungUp(g, DIMS).map((r) => r.id), oneRungUp(g, DIMS).map((r) => r.id));
});

/* ---- action lookup -------------------------------------------------- */

test('the action for a grade is that grade\'s transition cell', () => {
  const d = DIMS[0];
  assert.equal(actionFor(d, 'F'), d.actions['F->D']);
  assert.equal(actionFor(d, 'C'), d.actions['C->B']);
  assert.equal(actionFor(d, 'B'), d.actions['B->A']);
  assert.equal(actionFor(d, 'A'), null, 'A has nothing above it');
  assert.equal(actionFor(d, 'nonsense'), null);
});

test('every dimension resolves an action for every grade below A', () => {
  for (const d of DIMS) {
    for (const g of ['F', 'D', 'C', 'B']) {
      assert.ok(actionFor(d, g), d.id + ' has no action for ' + g);
    }
  }
});

/* ---- completeness --------------------------------------------------- */

test('score reports partial progress honestly', () => {
  const g = {};
  DIMS.slice(0, 5).forEach((d) => { g[d.id] = 'C'; });
  const s = score(g, DIMS);
  assert.equal(s.answered, 5);
  assert.equal(s.total, 23);
  assert.equal(s.complete, false);
  const full = score(allAt('C'), DIMS);
  assert.equal(full.complete, true);
  assert.equal(full.answered, 23);
});

test('an empty assessment produces no grade rather than an F', () => {
  const s = score({}, DIMS);
  assert.equal(s.overall.grade, null);
  assert.equal(s.practical.grade, null);
  assert.equal(s.flags.length, 0);
  assert.equal(s.answered, 0);
});
