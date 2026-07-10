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
  contactEmail: '' /* BLAKE-BATCH: confirm final address */
};
