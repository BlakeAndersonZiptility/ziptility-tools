/* Ziptility practice tests: bank registry.
   Per-test display fields the bundle needs at runtime (title/badge/
   discipline/level), verified against catalog/manifest.json and the bank
   itself: web/practice-tests/catalog/banks/operator-math-1.json carries
   durationMin 120, refCount 100, and 110 questions (questionCount here).
   bankVersion is the DIST ARTIFACT tag used to build the immutable
   filename in dist/practice-banks/ (bank-loader.js), a different thing
   from the bank JSON's own internal "version" field (a content-revision
   date quiz.js/quiz-engine.js use for localStorage session invalidation).
   Wave-1 note: all six Wave-1 tests ship as of practice-v1.3.0 (WT L1 +
   WWT L1 added 2026-07-11 after their banks closed the two-lens verify
   gate and Blake's nod; practice-tests/HANDOFF.md).

   `slug` is the LAST URL SEGMENT of that test's own page under
   /tools/practice/ (the Q-12 split, ruled 2026-07-28). It exists so an
   embed on /tools/practice/water-treatment can pin its bank with
   data-test="water-treatment" instead of the opaque internal id "wt-1":
   the person writing the embed reads the slug straight off the URL, so
   the class of typo where a page silently serves the wrong discipline
   cannot happen. Both forms resolve (main.js), and the slugs are the
   RULED, permanent URLs from ARCHITECTURE §7 — changing one here without
   changing the page URL breaks the pairing, so they are validated below
   for shape and uniqueness the same way ids are.

   `description` is rendered on the hub picker card (picker.js). Every
   entry carries one: five of the six rendered an empty <p> until
   2026-07-29 because picker.js read a local map that only defined
   operator-math-1 while these strings sat here unread. */
export const BANK_BASE_URL = 'https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-banks/';

export const TESTS = [
  {
    id: 'operator-math-1',
    slug: 'operator-math',
    title: 'Operator math practice test',
    badge: 'Operator math · Levels 1-2 (ABC Class I-II)',
    discipline: 'Operator Math',
    level: 'Levels 1-2 (ABC Class I-II)',
    description: 'Unit conversions, flow, dosing, and the 8.34 pounds formula, worked out in plain English.',
    questionCount: 110,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  },
  {
    id: 'regulations-1',
    slug: 'regulations',
    title: 'Water and wastewater regulations practice test (federal)',
    badge: 'Federal regulations · Entry to working level',
    discipline: 'Regulations (Federal)',
    level: 'Entry to working level (ABC Class I-II)',
    description: 'The federal rules an operator answers to: the Safe Drinking Water Act, the Clean Water Act, monitoring and reporting, public notice, and recordkeeping. Every answer carries a citation.',
    questionCount: 103,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  },
  {
    id: 'wd-1',
    slug: 'water-distribution',
    title: 'Water distribution operator practice test, Class I',
    badge: 'Water distribution · Class I entry level',
    discipline: 'Water Distribution',
    level: 'Entry level (ABC Class I)',
    description: 'Mains, valves, hydrants, storage, pumps, cross-connection control, flushing, sampling, and crew safety. Machine-checked math and cited answers.',
    questionCount: 125,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  },
  {
    id: 'wwc-1',
    slug: 'wastewater-collection',
    title: 'Wastewater collection operator practice test, Class I',
    badge: 'Wastewater collection · Class I entry level',
    discipline: 'Wastewater Collections',
    level: 'Entry level (ABC Class I)',
    description: 'Gravity mains, manholes, lift stations, cleaning and CCTV, infiltration and inflow, SSO response, and confined-space and trench safety. Cited answers throughout.',
    questionCount: 120,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  },
  {
    id: 'wt-1',
    slug: 'water-treatment',
    title: 'Water treatment operator practice test, Class I',
    badge: 'Water treatment · Class I entry level',
    discipline: 'Water Treatment',
    level: 'Entry level (ABC Class I)',
    description: 'Coagulation and jar testing, sedimentation, filtration, disinfection and CT, source water, plant pumps and chemical feeders, lab work, and chlorine safety. Machine-checked math and cited answers.',
    questionCount: 128,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  },
  {
    id: 'wwt-1',
    slug: 'wastewater-treatment',
    title: 'Wastewater treatment operator practice test, Class I',
    badge: 'Wastewater treatment · Class I entry level',
    discipline: 'Wastewater Treatment',
    level: 'Entry level (ABC Class I)',
    description: 'Preliminary and primary treatment, activated sludge, clarifiers, trickling filters and lagoons, disinfection, solids handling, blowers and clarifier drives, lab work, and H2S and confined-space safety. Cited answers throughout.',
    questionCount: 119,
    durationMin: 120,
    refCount: 100,
    bankVersion: '1.0.0'
  }
];

/* Fails fast on a malformed manifest: missing/duplicate ids or slugs, or
   a bankVersion that will not build a sane dist filename. Runs at module
   load AND in CI (tests/practice-bank-schema.test.js), so a manifest that
   would mis-route a discipline page fails the PR, not production. */
export function validate(tests) {
  const ids = new Set();
  const slugs = new Set();
  for (const t of tests) {
    if (!t || !t.id) throw new Error('practice manifest: entry missing id');
    if (ids.has(t.id)) throw new Error('practice manifest: duplicate id "' + t.id + '"');
    ids.add(t.id);
    /* Slug shape is enforced because it is half of a URL: a slug with a
       slash, space, or capital would resolve on one page and 404 on
       another with no error anywhere in between. */
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug || '')) {
      throw new Error('practice manifest: "' + t.id + '" has a missing or non-kebab-case slug');
    }
    if (slugs.has(t.slug)) throw new Error('practice manifest: duplicate slug "' + t.slug + '"');
    slugs.add(t.slug);
    if (!t.title || !t.badge || !t.discipline || !t.level || !t.description) {
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
  /* Deep links resolve against ids AND slugs in one namespace (main.js),
     so a slug that shadows a different test's id would silently serve the
     wrong discipline's bank. Cheap check, impossible failure to debug. */
  for (const t of tests) {
    if (ids.has(t.slug) && t.slug !== t.id) {
      throw new Error('practice manifest: slug "' + t.slug + '" collides with another test id');
    }
  }
  return true;
}

validate(TESTS);
