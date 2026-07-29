/* Report card: the survey layer. Rung shuffling and the HubSpot payload.

   These exist because the value of the whole dataset rests on two
   properties that are invisible from the outside:
   - the rung order is a real permutation, and it is STABLE for the life of
     an assessment
   - what gets sent is what was answered

   A bug in either produces data that looks fine and means nothing.

   Run: node --test tests/reportcard-survey.test.js */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeOrders, isValidOrder, ensureOrders } from '../src/reportcard/rung-order.js';
import { buildPayload } from '../src/reportcard/submit.js';
import { GRADES, score } from '../src/reportcard/scoring.js';
import { RED_LINE_IDS } from '../src/reportcard/config.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RUBRIC = JSON.parse(readFileSync(path.join(ROOT, 'src/reportcard/data/rubric.json'), 'utf8'));
const DIMS = RUBRIC.dimensions;

const fieldValue = (payload, name) => {
  const f = payload.fields.find((x) => x.name === name);
  return f ? f.value : undefined;
};

/* ---- the ruling -------------------------------------------------------- */

test('the red-line set is the ruled SEVEN, including M3', () => {
  /* Blake ruling 2026-07-29, superseding the signed six. M3 is the whole
     difference between the two answers, so it gets named. */
  assert.equal(RED_LINE_IDS.length, 7);
  assert.deepEqual([...RED_LINE_IDS].sort(), ['F1', 'F2', 'M3', 'M8', 'T5', 'T7', 'T8']);
});

/* ---- rung order -------------------------------------------------------- */

test('every generated order is a genuine permutation of the five grades', () => {
  const orders = makeOrders(DIMS);
  assert.equal(Object.keys(orders).length, 23);
  for (const d of DIMS) {
    const o = orders[d.id];
    assert.equal(o.length, 5, d.id);
    assert.deepEqual([...o].sort(), [...GRADES].sort(), d.id + ' dropped or duplicated a rung');
  }
});

test('orders actually vary, rather than returning the fixed ladder every time', () => {
  /* If shuffling silently no-opped, the tool would look right and the
     positional cue the ruling exists to remove would still be there.
     Across 23 dimensions x 8 runs, every order coming back FDCBA is not
     luck. */
  const seen = new Set();
  for (let run = 0; run < 8; run++) {
    const orders = makeOrders(DIMS);
    for (const d of DIMS) seen.add(orders[d.id].join(''));
  }
  assert.ok(seen.size > 1, 'shuffle produced a single fixed order');
  assert.ok(seen.size > 20, 'shuffle produced only ' + seen.size + ' distinct orders; suspiciously few');
});

test('isValidOrder rejects anything that is not a clean permutation', () => {
  assert.equal(isValidOrder(['F', 'D', 'C', 'B', 'A']), true);
  assert.equal(isValidOrder(['A', 'B', 'C', 'D', 'F']), true);
  assert.equal(isValidOrder(['F', 'D', 'C', 'B']), false, 'too short');
  assert.equal(isValidOrder(['F', 'D', 'C', 'B', 'A', 'A']), false, 'too long');
  assert.equal(isValidOrder(['F', 'F', 'C', 'B', 'A']), false, 'duplicate');
  assert.equal(isValidOrder(['F', 'D', 'C', 'B', 'X']), false, 'unknown grade');
  assert.equal(isValidOrder(null), false);
  assert.equal(isValidOrder('FDCBA'), false, 'a string is not an order');
});

test('ensureOrders preserves valid stored orders and only fills the gaps', () => {
  /* The stability guarantee. A reader is mid-assessment; anything that
     reshuffles an order they have already answered against moves the
     answer out from under them, and a mis-click we caused is
     indistinguishable from a real answer in the data. */
  const existing = { T1: ['C', 'A', 'F', 'B', 'D'], T2: ['bad'], T3: null };
  const out = ensureOrders(DIMS, existing);
  assert.deepEqual(out.T1, ['C', 'A', 'F', 'B', 'D'], 'a valid stored order must survive untouched');
  assert.ok(isValidOrder(out.T2), 'a malformed order must be replaced, not kept');
  assert.ok(isValidOrder(out.T3), 'a missing order must be generated');
  assert.equal(Object.keys(out).length, 23, 'every dimension ends up with an order');
});

test('ensureOrders is idempotent: running it twice changes nothing', () => {
  const first = ensureOrders(DIMS, null);
  const second = ensureOrders(DIMS, first);
  assert.deepEqual(second, first);
});

/* ---- the payload ------------------------------------------------------- */

function fullGrades(grade) {
  const g = {};
  for (const d of DIMS) g[d.id] = grade;
  return g;
}

test('the payload reports the same grades the scorer computed', () => {
  const grades = fullGrades('C');
  const s = score(grades, DIMS);
  const payload = buildPayload({ grades, profile: {}, dimensions: DIMS });
  assert.equal(fieldValue(payload, 'rc_overall_grade'), s.overall.grade);
  assert.equal(fieldValue(payload, 'rc_leg_t'), s.legAverages.find((l) => l.leg === 'T').grade);
  assert.equal(fieldValue(payload, 'rc_leg_m'), s.legAverages.find((l) => l.leg === 'M').grade);
  assert.equal(fieldValue(payload, 'rc_leg_f'), s.legAverages.find((l) => l.leg === 'F').grade);
  assert.equal(fieldValue(payload, 'rc_answered'), '23');
  assert.equal(fieldValue(payload, 'rc_complete'), 'yes');
});

test('the payload carries all 23 answers, not just the summary', () => {
  /* The summaries are what you chart; the blob is what keeps a question
     nobody has asked yet answerable later. Losing a dimension is
     unrecoverable. */
  const grades = fullGrades('B');
  grades.T1 = 'F';
  const payload = buildPayload({ grades, profile: {}, dimensions: DIMS });
  const blob = JSON.parse(fieldValue(payload, 'rc_grades_json'));
  assert.equal(Object.keys(blob).length, 23);
  assert.equal(blob.T1, 'F');
  assert.equal(blob.T2, 'B');
});

test('the red-line fields report the flags, and the cap is reported honestly', () => {
  const grades = fullGrades('A');
  grades[RED_LINE_IDS[0]] = 'F';
  grades[RED_LINE_IDS[1]] = 'F';
  const payload = buildPayload({ grades, profile: {}, dimensions: DIMS });
  assert.equal(fieldValue(payload, 'rc_redline_count'), '2');
  assert.equal(fieldValue(payload, 'rc_practical_capped'), 'yes');
  assert.equal(fieldValue(payload, 'rc_practical_grade'), 'D');
  const ids = fieldValue(payload, 'rc_redline_ids').split(',');
  assert.deepEqual(ids.sort(), [RED_LINE_IDS[0], RED_LINE_IDS[1]].sort());
});

test('blank profile answers are omitted, never sent as empty strings', () => {
  /* HubSpot treats an empty string as a real answer, which would put
     phantom blanks into the dataset as if somebody had chosen them. */
  const payload = buildPayload({
    grades: fullGrades('C'),
    profile: { connections: '1,000 to 3,300', employees: '', revenue: null, email: undefined },
    dimensions: DIMS
  });
  const names = payload.fields.map((f) => f.name);
  assert.ok(names.includes('rc_connections'));
  assert.ok(!names.includes('rc_employees'), 'an empty string must be dropped');
  assert.ok(!names.includes('rc_revenue_band'), 'a null must be dropped');
  assert.ok(!names.includes('email'), 'an undefined email must be dropped');
});

test('a skipped profile still produces a valid submission', () => {
  /* Skipping is a first-class path (R14, ungated). An anonymous response
     with no profile is still a data point worth having. */
  const payload = buildPayload({ grades: fullGrades('D'), profile: null, dimensions: DIMS });
  assert.ok(payload.fields.length > 0);
  assert.ok(!payload.fields.some((f) => f.name === 'email'));
  assert.equal(fieldValue(payload, 'rc_overall_grade'), 'D');
});

test('a partial assessment is submittable and is labelled partial', () => {
  const grades = {};
  DIMS.slice(0, 9).forEach((d) => { grades[d.id] = 'C'; });
  const payload = buildPayload({ grades, profile: {}, dimensions: DIMS });
  assert.equal(fieldValue(payload, 'rc_answered'), '9');
  assert.equal(fieldValue(payload, 'rc_complete'), 'no');
});

test('no legal-consent block is attached', () => {
  /* This is a survey response, not a marketing opt-in. An email, when
     given, is for sending the reader their own report. */
  const payload = buildPayload({ grades: fullGrades('C'), profile: { email: 'a@b.com' }, dimensions: DIMS });
  assert.equal(payload.legalConsentOptions, undefined);
  assert.equal(fieldValue(payload, 'email'), 'a@b.com');
});
