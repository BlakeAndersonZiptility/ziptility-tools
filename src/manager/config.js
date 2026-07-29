/* ============================================================
   MANAGER TOOLBOX CONFIG.
   LEAD CAPTURE: same HubSpot-Forms-with-mailto-fallback pattern as
   src/config.js, but this bundle serves THREE separate manager tools on
   three separate pages, not one operator calculator, so it needs its own
   HubSpot form rather than silently posting into the calculator's
   formula-sheet form.
   ASK (flagged UNSURE, 2026-07-29 build): Blake has not created a
   manager-tools capture form yet. hubspotFormId is left blank on purpose so
   the soft-capture flow falls back to mailto: instead of guessing a GUID.
   Fill it in once the form exists in HubSpot portal 4938013.
   ============================================================ */
export const LEAD = { hubspotPortalId: "4938013", hubspotFormId: "", fallbackEmail: "sales@ziptility.com" };

/* localStorage key for the energy-cost tool's optional prior-period trend.
   Guarded everywhere it's read/written (see ui/render.js); unguarded
   localStorage access throws inside a sandboxed iframe (documented lesson,
   src/main.js). */
export const ENERGY_HISTORY_KEY = "zip-manager-energy-history";
