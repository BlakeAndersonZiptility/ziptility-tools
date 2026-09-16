/* Formula sheets: the one configurable thing is the "email me the PDF"
   offer's HubSpot form. Empty means the offer is not rendered at all; the
   sheets and every print button work regardless (an offer, never a gate:
   Blake ruling 2026-09-10, WW-11). Blake directed the form built 2026-09-16 (SHEETS-FORM-SPEC.md records the shape). Do
   NOT reuse the calculator's form id (a different offer, a different list). */
export const SHEETS_CFG = {
  hubspotPortalId: '4938013',
  hubspotFormId: 'be491609-9dff-4488-9823-28c4803b1c47' /* "Formula sheets PDF request", created 2026-09-16 on Blake's directive; E2E-verified at the endpoint the same day */
};
