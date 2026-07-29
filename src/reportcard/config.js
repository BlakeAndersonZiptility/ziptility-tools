/* Utility Health Report Card: the two calibration decisions, isolated.

   Both are ONE LINE to change and both are open questions for Blake. They
   live here rather than inline in the scoring so changing an answer is not
   a code review.

   ---------------------------------------------------------------------
   DECISION 1: which dimensions are red-line. RULED: SEVEN.

   Blake ruled 2026-07-29: seven, matching the workbook's own Rubric sheet,
   which marks T5, T7, T8, M3, M8, F1 and F2 with a filled circle.

   This supersedes D26 (2026-06-28), which signed six against the design
   spec's list and omitted M3 Evidence-Based Decision-Making. Worth keeping
   the history visible, because the two numbers are still both written down
   in different places: the design spec and D26 say six, the workbook says
   seven, and the workbook's own Dashboard says "[Red-line dimensions: TBD
   by author]". Seven is now the answer.
   ---------------------------------------------------------------------
   DECISION 2: what trips a red-line flag.

   The workbook Methodology is explicit: "an F grade in any one indicates
   existential risk", and the practical-grade cap needs "2 or more red-line
   F's". The prototype .dc.html instead flags on F OR D, which would fire
   the panel far more often and change what the cap means.

   Default follows the Methodology (F only), because it is the written
   rule and the prototype is a visual mock whose own header says its
   content is placeholder.
   --------------------------------------------------------------------- */

export const RED_LINE_IDS = [
  'T5', /* Operations & Maintenance Practices */
  'T7', /* Regulatory Compliance */
  'T8', /* Emergency Preparedness */
  'M3', /* Evidence-Based Decision-Making (Blake ruling 2026-07-29) */
  'M8', /* Workforce / Operator Bench */
  'F1', /* Financial Reserves */
  'F2'  /* Rate Adequacy */
];

/* Grades that trip a red-line flag. ['F'] per the Methodology; ['F','D']
   reproduces the prototype's wider net. */
export const RED_LINE_TRIGGER = ['F'];

/* Red-line dimensions count this much more in the one-rung-up ranking.
   1 would rank purely by how far a dimension is from Thriving. */
export const RED_LINE_WEIGHT = 2;

/* Number of dimensions the one-rung-up list names. Three per the
   Methodology ("the three dimensions where moving up one letter would be
   the highest-leverage next step"). */
export const ONE_RUNG_UP_COUNT = 3;

/* 2 or more red-line F's caps the Overall grade (Methodology,
   "Practical-grade cap"). */
export const PRACTICAL_CAP_THRESHOLD = 2;
export const PRACTICAL_CAP_GRADE = 'D';

/* Where a weak dimension sends the reader. Every weak dimension links the
   guide that addresses it (R14); the mapping itself is not in the
   workbook, so it is left for the page build rather than invented here. */
export const CONFIG = {
  guideBaseUrl: '/field-guide/for-managers',
  contactEmail: 'sales@ziptility.com'
};

/* Survey submission (Blake ruling 2026-07-29: HubSpot, with an optional
   email). Portal is the same one the calculator's formula-sheet form uses.

   formId IS DELIBERATELY BLANK. The form does not exist in HubSpot yet,
   and creating one is a write to a shared system, which is Blake's call
   rather than something to do quietly. While it is blank the tool is fully
   usable and simply sends nothing (submit.js no-ops). The exact fields to
   create are written out in HUBSPOT-FORM-SPEC.md; drop the GUID here and
   submission starts working with no other change.

   Reusing the calculator's form id (d00fc6e5) would be wrong: different
   purpose, different fields, and it would mix survey responses into a
   formula-sheet lead list. */
export const HUBSPOT = {
  portalId: '4938013',
  formId: ''
};
