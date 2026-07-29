/* Utility Health Report Card: scoring. Pure functions, no DOM, no
   storage, so the arithmetic can be tested against the workbook's own
   Methodology sheet without a browser.

   Every rule here is quoted from that sheet in the function that
   implements it. Where the sheet is ambiguous it is called out rather than
   silently resolved: this produces a grade a utility may take to its
   board, so a guess dressed up as a formula is worse than a stated
   assumption. */
import {
  RED_LINE_IDS, RED_LINE_TRIGGER, RED_LINE_WEIGHT,
  ONE_RUNG_UP_COUNT, PRACTICAL_CAP_THRESHOLD, PRACTICAL_CAP_GRADE
} from './config.js';

/* "dimension grades convert to numeric values (F=0, D=1, C=2, B=3, A=4)" */
export const GRADE_VALUES = { F: 0, D: 1, C: 2, B: 3, A: 4 };
export const GRADES = ['F', 'D', 'C', 'B', 'A'];
export const LEGS = ['T', 'M', 'F'];
export const LEG_NAMES = { T: 'Technical', M: 'Managerial', F: 'Financial' };

const MAX_VALUE = 4;

export function isGrade(g) {
  return Object.prototype.hasOwnProperty.call(GRADE_VALUES, g);
}

/* Nearest letter. Math.round takes .5 upward, so a leg averaging exactly
   1.5 reads C rather than D: the optimistic direction, consistent for
   every leg and every year, which is what comparability across years
   needs. */
export function valueToGrade(v) {
  if (v == null || !isFinite(v)) return null;
  const i = Math.round(v);
  return GRADES[Math.max(0, Math.min(GRADES.length - 1, i))] || null;
}

export function redLineSet() {
  return new Set(RED_LINE_IDS);
}

/* "Within each TMF leg, dimension grades convert to numeric values,
   average, and round to the nearest letter."

   Ungraded dimensions are EXCLUDED from the average rather than counted as
   F. Intake allows skip-and-return, so a part-finished assessment would
   otherwise report a failing leg purely because the reader has not got
   there yet. `answered` is returned so the caller can say so. */
export function legAverage(grades, dimensions, leg) {
  const inLeg = dimensions.filter((d) => d.leg === leg);
  const vals = inLeg
    .map((d) => grades[d.id])
    .filter((g) => isGrade(g))
    .map((g) => GRADE_VALUES[g]);
  if (!vals.length) return { leg, value: null, grade: null, answered: 0, total: inLeg.length };
  const value = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { leg, value, grade: valueToGrade(value), answered: vals.length, total: inLeg.length };
}

/* "The Overall grade is the mean of the three leg averages."

   The mean of the LEG AVERAGES, not of all 23 dimensions. It matters:
   Technical carries 9 dimensions and Financial 6, so averaging the raw 23
   would quietly weight Technical half again as heavily as Financial. This
   gives each leg an equal third, which is what TMF means. */
export function overallGrade(legAverages) {
  const vals = legAverages.map((l) => l.value).filter((v) => v != null && isFinite(v));
  if (!vals.length) return { value: null, grade: null, legsCounted: 0 };
  const value = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { value, grade: valueToGrade(value), legsCounted: vals.length };
}

/* "Some dimensions are designated red-line: an F grade in any one
   indicates existential risk regardless of composite performance."

   Returns the flagged dimensions in the rubric's own order, so the panel
   reads T before M before F every time rather than in object-key order. */
export function redLineFlags(grades, dimensions) {
  const set = redLineSet();
  const trigger = new Set(RED_LINE_TRIGGER);
  return dimensions
    .filter((d) => set.has(d.id) && trigger.has(grades[d.id]))
    .map((d) => ({ id: d.id, name: d.name, leg: d.leg, grade: grades[d.id] }));
}

/* "When 2 or more red-line F's are flagged, the Overall grade is annotated
   'Practical Grade: D (capped by diagnostic flags)' even if the descriptive
   composite is higher. This is the only place the descriptive and
   diagnostic tracks merge."

   Annotated, not replaced: the descriptive grade is still returned and
   still shown. And only ever downward. A system with two red-line F's
   whose composite already sits at F is not lifted to D by the cap. */
export function practicalGrade(overall, flags) {
  const capped = flags.length >= PRACTICAL_CAP_THRESHOLD;
  if (!capped || overall.grade == null) {
    return { capped: false, grade: overall.grade, descriptiveGrade: overall.grade, flagCount: flags.length };
  }
  const worse = GRADE_VALUES[PRACTICAL_CAP_GRADE] < GRADE_VALUES[overall.grade];
  return {
    capped: worse,
    grade: worse ? PRACTICAL_CAP_GRADE : overall.grade,
    descriptiveGrade: overall.grade,
    flagCount: flags.length
  };
}

/* "the three dimensions where moving up one letter would be the
   highest-leverage next step. The rule is: largest gap to the next grade x
   red-line weighting."

   INTERPRETATION, flagged because the sheet is ambiguous and this is the
   one place in the tool that ranks rather than counts. Read literally,
   "gap to the next grade" is one rung for every dimension below A, which
   would make the rule constant and the ranking meaningless. So gap is read
   as distance to Thriving (4 - value): the dimensions with the most room
   left, with red-line dimensions weighted up so an existential weakness
   outranks a merely low score.

   Already at A cannot move up and is excluded. Ties break by the rubric's
   own dimension order, never by object-key order, so the same answers
   always produce the same three. */
export function oneRungUp(grades, dimensions) {
  const set = redLineSet();
  return dimensions
    .map((d, index) => ({ d, index }))
    .filter(({ d }) => isGrade(grades[d.id]) && GRADE_VALUES[grades[d.id]] < MAX_VALUE)
    .map(({ d, index }) => {
      const value = GRADE_VALUES[grades[d.id]];
      const gap = MAX_VALUE - value;
      const isRedLine = set.has(d.id);
      return {
        id: d.id,
        name: d.name,
        leg: d.leg,
        current: grades[d.id],
        target: GRADES[value + 1],
        isRedLine,
        score: gap * (isRedLine ? RED_LINE_WEIGHT : 1),
        index
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, ONE_RUNG_UP_COUNT);
}

/* The transition cell for a dimension's CURRENT grade: what to do to move
   up one. A dimension at A has nothing above it, so it has no cell. */
export function actionFor(dimension, grade) {
  if (!isGrade(grade)) return null;
  const v = GRADE_VALUES[grade];
  if (v >= MAX_VALUE) return null;
  return dimension.actions[grade + '->' + GRADES[v + 1]] || null;
}

/* One call for the whole results view, so the screen never recomputes a
   number a different way than the tests checked. */
export function score(grades, dimensions) {
  const legAverages = LEGS.map((leg) => legAverage(grades, dimensions, leg));
  const overall = overallGrade(legAverages);
  const flags = redLineFlags(grades, dimensions);
  return {
    legAverages,
    overall,
    flags,
    practical: practicalGrade(overall, flags),
    oneRungUp: oneRungUp(grades, dimensions),
    answered: dimensions.filter((d) => isGrade(grades[d.id])).length,
    total: dimensions.length,
    complete: dimensions.every((d) => isGrade(grades[d.id]))
  };
}
