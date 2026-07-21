/* ============================================================
   LEAD CAPTURE CONFIG — wire to HubSpot when ready.
   Fill portalId + formId to POST to HubSpot Forms; otherwise the
   form falls back to a mailto: to fallbackEmail.
   HubSpot portal 4938013 (confirm). To go live: create the
   formula-sheet form in HubSpot, paste its GUID into hubspotFormId.
   ============================================================ */
export const LEAD = { hubspotPortalId:"4938013", hubspotFormId:"d00fc6e5-a341-4e43-b612-45e0b62dde30", fallbackEmail:"sales@ziptility.com" };
