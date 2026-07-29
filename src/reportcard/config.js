/* Utility Health Report Card: the two calibration decisions, isolated.

   Both are ONE LINE to change and both are open questions for Blake. They
   live here rather than inline in the scoring so changing an answer is not
   a code review.

   ---------------------------------------------------------------------
   DECISION 1: which dimensions are red-line.

   The sources disagree, so this is not a detail:

   - The design spec (70-tool-report-card.md) names SIX: T5, T7, T8, F1,
     F2, M8, and calls the size an open decision ("6 vs a tighter 4 vs a
     wider 8").
   - Blake SIGNED six on 2026-06-28 (decision D26, "the spec default"),
     choosing against 4 and 8.
   - The workbook's Rubric sheet marks SEVEN with a filled circle, adding
     M3 Evidence-Based Decision-Making. The workbook was last modified
     2026-05-15, BEFORE that ruling, and its own Dashboard still reads
     "[Red-line dimensions: TBD by author]".

   Default is SIX, because the signed ruling is later than the workbook and
   the workbook itself does not claim to have settled it. M3 is listed
   below, commented out, so adding it is uncommenting one line.
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
  'F1', /* Financial Reserves */
  'F2', /* Rate Adequacy */
  'M8'  /* Workforce / Operator Bench */
  /* 'M3' */ /* Evidence-Based Decision-Making: marked in the workbook,
                absent from the signed six. Uncomment to go to seven. */
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
