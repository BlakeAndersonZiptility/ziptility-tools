/* Tool shell markup — moved from the legacy Webflow embed (v1), minus the
   SEO copy (stays server-rendered in Webflow) and the logo masthead (the
   Webflow global nav above the tool carries the brand). */
export function buildShell(){
  return `
<header>
  <div class="head-wrap">
    <div class="head-title"><h1>Operator Calculator</h1><p>Water &amp; wastewater system math</p></div>
    <div class="head-spacer"></div>
    <div class="head-hint">Pick units per field &middot; enter decimals (1&#39;6&quot; = 1.5&#39;)</div>
  </div>
</header>

<div class="control">
  <div class="control-wrap">
    <div class="modebar" id="modebar">
      <button class="mode-btn" data-m="water" type="button" aria-pressed="true">
        <span class="mode-ic"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8 7 5.5 10.6 5.5 14.2A6.5 6.5 0 0 0 18.5 14.2C18.5 10.6 16 7 12 2Z"/></svg></span>
        <span class="mode-txt"><b>Water</b><span>Distribution, treatment, wells, dosing</span></span>
      </button>
      <button class="mode-btn" data-m="wastewater" type="button" aria-pressed="false">
        <span class="mode-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4 4.5 8.2 8.8 8.2"/><path d="M4.6 7.6A8 8 0 0 1 19 8.5"/><path d="M17 20 19.5 15.8 15.2 15.8"/><path d="M19.4 16.4A8 8 0 0 1 5 15.5"/></svg></span>
        <span class="mode-txt"><b>Wastewater</b><span>Process control, solids, loading</span></span>
      </button>
    </div>
    <div class="toolbar">
      <div class="field-wrap">
        <span class="mag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></span>
        <input type="search" id="search" placeholder="Search calculators…" aria-label="Search calculators">
      </div>
      <span class="lbl">Category</span>
      <div class="field-wrap" id="catWrap">
        <select id="catSelect" aria-label="Calculator category"></select>
        <span class="chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>
      </div>
      <span class="count" id="count"></span>
    </div>
  </div>
</div>

<main><div class="grid" id="grid"></div></main>

<div class="cta">
  <div class="cta-inner">
    <div class="cta-txt">
      <h3>Built by people who actually run small systems</h3>
      <p>Ziptility puts your map, assets, work orders, and compliance records in one place — no GIS degree required. These numbers are easier to track when they live in your system, not a clipboard.</p>
    </div>
    <div class="cta-actions">
      <a class="cta-btn cta-primary" href="https://www.ziptility.com/request-a-free-demo-ziptility-utility-management-software" target="_blank" rel="noopener">Book a demo</a>
      <button class="cta-btn cta-ghost" id="openSheet" type="button">Get the formula sheet (PDF)</button>
    </div>
  </div>
</div>



<footer>
  <div class="disclaimer">
    <strong>Always verify before field use.</strong> This is a working aid for common operator math, not a substitute for your own check, your system&#39;s engineering, or regulatory requirements. The guidance notes are general rules of thumb — your permit, process, and state rules govern. Confirm any number that drives a compliance, dosing, or safety decision.
  </div>
  <div class="ref">
    <h3>Reference constants</h3>
    <div class="ref-grid">
      <span>1 cu ft = 7.4805 gal</span><span>1 gal = 8.3454 lbs</span><span>8.34 lb/gal (dosage)</span>
      <span>1 gal = 3.78541 L</span><span>1 psi = 2.3067 ft head</span><span>1 MGD = 694 gpm</span>
      <span>1 cfs = 0.6463 MGD</span><span>1 gr/gal = 17.1181 mg/L</span><span>1 hp = 0.746 kW</span>
      <span>&pi;/4 = 0.7854</span><span>1 PE = 0.17 lb BOD/day</span><span>SDI = 100 / SVI</span>
    </div>
  </div>
  <div class="colophon">
    <span>Wastewater formulas follow WPI / ABC (Association of Boards of Certification) exam conventions.</span>
    <span>Dosage &amp; loading use 8.34 lb/gal; unit conversions use precise factors.</span>
    <a href="https://www.ziptility.com" target="_blank" rel="noopener">ziptility.com</a>
  </div>
</footer>

<!-- Lead-capture modal (opt-in only) -->
<div class="modal" id="leadModal" role="dialog" aria-modal="true" aria-labelledby="leadTitle">
  <div class="modal-card">
    <button class="modal-close" id="leadClose" aria-label="Close">&times;</button>
    <div id="leadForm">
      <h3 id="leadTitle">Get the formula &amp; rounding sheet</h3>
      <p>A printable PDF of every formula in this tool, with the interpretation ranges and constants. We&#39;ll email it over.</p>
      <div class="modal-field"><label for="ld-name">Name</label><input id="ld-name" autocomplete="name"></div>
      <div class="modal-field"><label for="ld-email">Work email</label><input id="ld-email" type="email" autocomplete="email"></div>
      <div class="modal-field"><label for="ld-util">Utility / system (optional)</label><input id="ld-util" autocomplete="organization"></div>
      <button class="modal-submit" id="leadSubmit" type="button">Send it to me</button>
      <p class="modal-fine">We&#39;ll send the sheet and the occasional Ziptility note for small-system operators. Unsubscribe anytime. No spam.</p>
    </div>
    <div class="modal-ok" id="leadOk">
      <div class="check"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
      <h3>On its way</h3>
      <p id="leadOkMsg">Check your inbox for the formula sheet. Thanks!</p>
    </div>
  </div>
</div>
`;
}
