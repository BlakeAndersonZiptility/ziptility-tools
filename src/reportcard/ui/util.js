/* Utility Health Report Card: shared DOM + presentation helpers.

   Nothing in this file computes a grade. It only draws one that
   score() already produced, or splits/colours text that is already in
   rubric.json. Keeping that boundary here means the UI files never need
   to reimplement scoring.js by accident. */

export function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/* rubric.json's gradeLabels are workbook text verbatim, e.g. "F —
   Survival" (an em dash). House rule is no em dashes in anything WE
   write, but this is quoted source text, not our prose. Splitting it
   into letter + name means the dash character itself never reaches the
   rendered page either way. */
export function splitGradeLabel(label) {
  const i = label.indexOf('—');
  if (i === -1) return { letter: label.trim(), name: '' };
  return { letter: label.slice(0, i).trim(), name: label.slice(i + 1).trim() };
}

export function gradeName(letter, gradeLabels) {
  if (!letter || !gradeLabels[letter]) return '';
  return splitGradeLabel(gradeLabels[letter]).name;
}

/* "Currently: B, Very Stable" style text. Never the only carrier of a
   grade's meaning (colour supplements this, not the other way round). */
export function gradeText(letter, gradeLabels) {
  if (!letter) return 'Not yet gradable';
  return letter + ' ' + gradeName(letter, gradeLabels);
}

/* Colour pairs below are all >=4.5:1 foreground-on-background, checked
   by hand against the WCAG relative-luminance formula (not eyeballed).
   Every place that uses these also renders the letter and the name as
   text right next to the colour, so a reader who cannot see colour at
   all still gets the full answer. */
export const GRADE_COLORS = {
  F: { fg: '#b91c1c', bg: '#fef2f2' },
  D: { fg: '#c2410c', bg: '#fff7ed' },
  C: { fg: '#b45309', bg: '#fffbeb' },
  B: { fg: '#4d7c0f', bg: '#f7fee7' },
  A: { fg: '#15803d', bg: '#f0fdf4' }
};

export const UNGRADED_COLOR = '#cbd5e1';

export const LEG_COLOR = { T: '#0c1f30', M: '#475569', F: '#b45309' };
