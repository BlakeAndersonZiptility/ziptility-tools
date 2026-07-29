/* Manager toolbox - page shell. One tool per page (deep-linked by id), so
   the shell just frames whichever tool main.js resolved: no category
   browser, no mode switch, no logo/masthead (the Webflow global nav above
   the tool carries the brand - same call as the operator calculator's
   ui/template.js), and no demo CTA band (neutral-lane rule, tool-specs.md
   Verification section: "no demo CTA, no gate before the result, no logo"). */
function escHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function buildShell(tool) {
  return `
<header class="zmt-head">
  <div class="zmt-head-wrap">
    <p class="zmt-eyebrow">Manager toolbox</p>
    <h1>${escHtml(tool.title)}</h1>
    <p class="zmt-tagline">${escHtml(tool.note)}</p>
  </div>
</header>

<main><div class="zmt-stage" id="zmt-stage"></div></main>

<!-- Soft capture - opt-in only, and only reachable after a result exists
     (render.js unhides #zmt-capture-open; never a gate in front of the answer). -->
<div class="zmt-modal" id="zmt-lead-modal" role="dialog" aria-modal="true" aria-labelledby="zmt-lead-title">
  <div class="zmt-modal-card">
    <button class="zmt-modal-close" id="zmt-lead-close" type="button" aria-label="Close">&times;</button>
    <div id="zmt-lead-form">
      <h3 id="zmt-lead-title">Email or print this result</h3>
      <p>We will send the numbers you just calculated, formatted for a board packet or a work order. No result is shared until you ask for it.</p>
      <div class="zmt-modal-field"><label for="zmt-ld-name">Name</label><input id="zmt-ld-name" autocomplete="name"></div>
      <div class="zmt-modal-field"><label for="zmt-ld-email">Work email</label><input id="zmt-ld-email" type="email" autocomplete="email"></div>
      <div class="zmt-modal-field"><label for="zmt-ld-util">Utility / system (optional)</label><input id="zmt-ld-util" autocomplete="organization"></div>
      <button class="zmt-modal-submit" id="zmt-lead-submit" type="button">Send it to me</button>
      <p class="zmt-modal-fine">We will send this result and the occasional Ziptility note for utility managers. Unsubscribe anytime. No spam.</p>
    </div>
    <div class="zmt-modal-ok" id="zmt-lead-ok">
      <div class="zmt-check">&#10003;</div>
      <h3>On its way</h3>
      <p id="zmt-lead-ok-msg">Check your inbox. Thanks!</p>
    </div>
  </div>
</div>

<footer class="zmt-foot">
  <div class="zmt-disclaimer">
    <strong>Always verify before you act on this.</strong> This is a working aid for common manager math, not a substitute for your board packet, your engineer's estimate, or your utility's own numbers. Every default value on this page is a rule of thumb; use your own number wherever you have one.
  </div>
  <div class="zmt-colophon"><a href="https://www.ziptility.com" target="_blank" rel="noopener">ziptility.com</a></div>
</footer>
`;
}

export { escHtml };
