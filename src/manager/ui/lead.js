/* Manager toolbox - soft capture, wired the same way as the operator
   calculator's src/ui/lead.js (HubSpot Forms POST with a mailto fallback).
   The button that opens this modal only exists once render.js has revealed
   it after a successful calculation (see ui/render.js renderResult); this
   module never gates anything, it only handles the modal once it is open. */
import { LEAD } from '../config.js';

export function initLead(mount, tool) {
  const openBtn = mount.querySelector('#zmt-capture-open');
  const modal = mount.querySelector('#zmt-lead-modal');
  if (!openBtn || !modal) return;

  function openLead() {
    modal.classList.add('zmt-show');
    mount.querySelector('#zmt-lead-form').style.display = 'block';
    mount.querySelector('#zmt-lead-ok').style.display = 'none';
  }
  function closeLead() { modal.classList.remove('zmt-show'); }

  openBtn.addEventListener('click', openLead);
  mount.querySelector('#zmt-lead-close').addEventListener('click', closeLead);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeLead(); });

  mount.querySelector('#zmt-lead-submit').addEventListener('click', () => {
    const name = mount.querySelector('#zmt-ld-name').value.trim();
    const email = mount.querySelector('#zmt-ld-email').value.trim();
    const util = mount.querySelector('#zmt-ld-util').value.trim();
    if (!email || !/.+@.+\..+/.test(email)) { mount.querySelector('#zmt-ld-email').focus(); return; }

    const summary = mount.dataset.zmtResultSummary || (tool.title + ' result');
    const showOk = (m) => {
      mount.querySelector('#zmt-lead-form').style.display = 'none';
      const ok = mount.querySelector('#zmt-lead-ok'); ok.style.display = 'block';
      if (m) mount.querySelector('#zmt-lead-ok-msg').textContent = m;
    };

    if (LEAD.hubspotPortalId && LEAD.hubspotFormId) {
      fetch('https://api.hsforms.com/submissions/v3/integration/submit/' + LEAD.hubspotPortalId + '/' + LEAD.hubspotFormId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'email', value: email },
            { name: 'firstname', value: name },
            { name: 'company', value: util },
            { name: 'message', value: summary }
          ]
        })
      }).then(() => showOk()).catch(() => showOk("Saved. We'll be in touch shortly."));
    } else {
      const body = encodeURIComponent('Please send this ' + tool.title + ' result.\n\n' + summary + '\n\nName: ' + name + '\nUtility: ' + util + '\nEmail: ' + email);
      try { window.location.href = 'mailto:' + LEAD.fallbackEmail + '?subject=' + encodeURIComponent(tool.title + ' result') + '&body=' + body; }
      catch (e) { /* sandboxed iframe: navigation blocked, still show confirmation */ }
      showOk('Opening your email app to finish the request.');
    }
  });
}
