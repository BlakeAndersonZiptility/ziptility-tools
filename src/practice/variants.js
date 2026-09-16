/* SI item variants (WW-01 step 3, Blake ruling 2026-09-10).

   A question may carry `si`: a second, re-derived version of the same
   item in SI units, written through the content pipeline (never a
   render-time conversion of the numbers). When the reader's unit system is
   metric and the item has one, the quiz shows the SI version: its stem,
   its four choices, its keyed index, its explanation and formula. The id,
   topic, difficulty and calculator link are the parent's, so seen-lists,
   history and completion events stay one item regardless of system.

   Applied once, at bank load, so every consumer downstream (draw, resume,
   score, review, feedback) sees one question shape and never branches. */

export function applyVariant(q, system) {
  if (system !== 'metric' || !q || !q.si) return q;
  const v = q.si;
  return Object.assign({}, q, {
    text: v.text,
    choices: v.choices,
    correctIndex: v.correctIndex,
    explanation: v.explanation,
    formula: v.formula == null ? q.formula : v.formula,
    unitSystem: 'metric'
  });
}

/* Returns a shallow copy of the bank whose questions are the views for
   `system`, plus what the note needs: how many items had an SI version. */
export function withVariants(bank, system) {
  const questions = (bank.questions || []).map((q) => applyVariant(q, system));
  const withSi = (bank.questions || []).filter((q) => q && q.si).length;
  return Object.assign({}, bank, { questions, variants: { system, total: questions.length, withSi } });
}
