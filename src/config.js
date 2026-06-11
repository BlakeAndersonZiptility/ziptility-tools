/* ============================================================
   LEAD CAPTURE CONFIG — wire to HubSpot when ready.
   Fill portalId + formId to POST to HubSpot Forms; otherwise the
   form falls back to a mailto: to fallbackEmail.
   HubSpot portal 4938013 (confirm). To go live: create the
   formula-sheet form in HubSpot, paste its GUID into hubspotFormId.
   ============================================================ */
export const LEAD = { hubspotPortalId:"4938013", hubspotFormId:"", fallbackEmail:"sales@ziptility.com" };
