/* Ziptility practice tests: bank registry.
   Per-test display fields the bundle needs at runtime (title/badge/
   discipline/level), verified against catalog/manifest.json and the bank
   itself: web/practice-tests/catalog/banks/operator-math-1.json carries
   durationMin 120, refCount 100, and 110 questions (questionCount here).
   bankVersion is the DIST ARTIFACT tag used to build the immutable
   filename in dist/practice-banks/ (bank-loader.js), a different thing
   from the bank JSON's own internal "version" field (a content-revision
   date quiz.js/quiz-engine.js use for localStorage session invalidation).
   Wave-1 note: operator-math-1 + regulations-1 ship today; the other 4
   Wave-1 entries (WT L1, WD L1, WWT L1, WWC L1) land here as their banks
   clear the verify gate + Blake's flags pass (practice-tests/HANDOFF.md). */
export const BANK_BASE_URL = 'https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-banks/';

export const TESTS = [
  {
    id: 'operator-math-1',
    title: 'Operator math practice test',
    badge: 'Operator math · Levels 1-2 (ABC Class I-II)',
    discipline: 'Operator Math',
    level: 'Levels 1-2 (ABC Class I-II)',
    questionCount: 110,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  },
  {
    id: 'regulations-1',
    title: 'Water and wastewater regulations practice test (federal)',
    badge: 'Federal regulations · Entry to working level',
    discipline: 'Regulations (Federal)',
    level: 'Entry to working level (ABC Class I-II)',
    questionCount: 103,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  }
];

/* Fails fast on a malformed manifest: missing/duplicate ids or a
   bankVersion that will not build a sane dist filename. */
export function validate(tests) {
  const ids = new Set();
  for (const t of tests) {
    if (!t || !t.id) throw new Error('practice manifest: entry missing id');
    if (ids.has(t.id)) throw new Error('practice manifest: duplicate id "' + t.id + '"');
    ids.add(t.id);
    if (!t.title || !t.badge || !t.discipline || !t.level) {
      throw new Error('practice manifest: "' + t.id + '" is missing a required label field');
    }
    if (!Number.isInteger(t.questionCount) || t.questionCount <= 0) {
      throw new Error('practice manifest: "' + t.id + '" has a bad questionCount');
    }
    if (!Number.isInteger(t.durationMin) || t.durationMin <= 0) {
      throw new Error('practice manifest: "' + t.id + '" has a bad durationMin');
    }
    if (!Number.isInteger(t.refCount) || t.refCount <= 0) {
      throw new Error('practice manifest: "' + t.id + '" has a bad refCount');
    }
    if (!/^\d+\.\d+\.\d+$/.test(t.bankVersion || '')) {
      throw new Error('practice manifest: "' + t.id + '" has a malformed bankVersion');
    }
  }
  return true;
}

validate(TESTS);
