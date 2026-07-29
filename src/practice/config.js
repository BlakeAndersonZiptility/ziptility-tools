/* Ziptility practice tests: tool config.
   calcUrl / formulaSheetUrl point at the site routes for this bundle.
   contactEmail carries the engine's own default verbatim: quiz.js only
   renders the "report a problem" link when CFG.contactEmail is truthy
   (engine/quiz.js:459), and the source manifest ships it blank
   (catalog/manifest.json config.contactEmail: ""), so the link stays
   hidden until Blake sets a real address. */
export const CONFIG = {
  calcUrl: '/tools/calculator',
  formulaSheetUrl: '/tools/formula-sheets',
  contactEmail: 'sales@ziptility.com', /* Blake ruling 2026-07-10 */
  /* The practice-test hub. Two jobs, both added for the Q-12 split:
     (1) on a deep-linked discipline page, "All practice tests" is a real
     link HERE rather than an in-place swap to the six-card picker, which
     would paint the hub's content onto a page whose whole reason to exist
     is not being a duplicate of the hub; (2) the base each hub-to-child
     card link is built from when childPages mode is on. */
  hubUrl: '/tools/practice'
};
