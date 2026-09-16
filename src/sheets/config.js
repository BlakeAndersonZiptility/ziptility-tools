/* Formula sheets: the one configurable thing is the "email me the PDF"
   offer's HubSpot form. Empty means the offer is not rendered at all; the
   sheets and every print button work regardless (an offer, never a gate:
   Blake ruling 2026-09-10, WW-11). Creating the form is a write to a shared
   system and lands only on Blake's approval: see SHEETS-FORM-SPEC.md. Do
   NOT reuse the calculator's form id (a different offer, a different list). */
export const SHEETS_CFG = {
  hubspotPortalId: '4938013',
  hubspotFormId: ''
};
