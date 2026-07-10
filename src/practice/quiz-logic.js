/* Ziptility practice tests: pure quiz logic, ported from
   web/practice-tests/engine/quiz.js. No DOM, no localStorage: every
   function here takes plain data in and returns plain data out, so
   quiz-engine.js (the DOM state machine) and tests can both call it. */

/* quiz.js L84-90. Fisher-Yates (Durstenfeld); already correct/unbiased in
   the original, ported unchanged (no PORT-NOTE needed). Mutates and
   returns arr, matching the original's call sites. */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

/* quiz.js L91-94 */
export function fmtClock(totalSec) {
  const m = Math.floor(totalSec / 60), s = totalSec % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

/* quiz.js L102-109. Took BANK.questions.length via closure; now takes the
   question count as a param. */
export function sizesAvailable(questionCount) {
  const sizes = [];
  const std = [25, 50, 100];
  for (const s of std) if (s < questionCount) sizes.push(s);
  sizes.push(questionCount); /* the full bank is always offered last */
  return sizes;
}

/* quiz.js L111-115. Took BANK.refCount / BANK.questions.length via
   closure; now takes both as params (same fallback: ref count falls back
   to the total question count when the bank omits refCount). */
export function examMinutes(size, refCount, questionCount, durationMin) {
  const ref = refCount || questionCount;
  const dur = durationMin || 120;
  return Math.max(10, Math.round(dur * size / ref));
}

/* quiz.js L117-132. Refactored to take allQuestions + seenIds as params
   instead of reading BANK.questions and the zpt-pt-seen-<id> localStorage
   key directly. Semantics unchanged: unseen questions drawn first (each
   half shuffled independently), concatenated then sliced to size, the
   picked set re-shuffled as a whole, then each question's 4 choices get
   their own shuffled display order with correctPos recomputed against it. */
export function drawQuestions(allQuestions, seenIds, size) {
  const seenSet = new Set(seenIds || []);
  const unseen = [], rest = [];
  for (const q of allQuestions) {
    (seenSet.has(q.id) ? rest : unseen).push(q);
  }
  shuffle(unseen); shuffle(rest);
  const picked = unseen.concat(rest).slice(0, size);
  shuffle(picked);
  return picked.map((q) => {
    const order = shuffle([0, 1, 2, 3]);
    return { q, order, correctPos: order.indexOf(q.correctIndex) };
  });
}

/* quiz.js L470-485. Scoring loop extracted from finish(). Takes the drawn
   qs array and the {idx: selectedPos} answers map, returns the same shape
   finish() used to build inline: correct count, n, rounded pct, per-domain
   {n, ok} tallies, and the missed list ({item, sel}) the review card and
   history use downstream. */
export function scoreAttempt(qs, answers) {
  const n = qs.length;
  let correct = 0;
  const byDomain = {};
  const missed = [];
  for (let i = 0; i < n; i++) {
    const item = qs[i];
    const dom = item.q.domain || 'General';
    if (!byDomain[dom]) byDomain[dom] = { n: 0, ok: 0 };
    byDomain[dom].n += 1;
    const sel = (i in answers) ? answers[i] : null;
    if (sel === item.correctPos) { correct += 1; byDomain[dom].ok += 1; }
    else missed.push({ item, sel });
  }
  const pct = Math.round(100 * correct / n);
  return { correct, n, pct, byDomain, missed };
}

/* quiz.js L519-526. Domain ordering extracted from renderResults(): the
   "where you stand by topic" bars sort weakest-percentage-first. */
export function weakestFirstDomains(byDomain) {
  return Object.keys(byDomain).sort(
    (a, b) => (byDomain[a].ok / byDomain[a].n) - (byDomain[b].ok / byDomain[b].n)
  );
}
