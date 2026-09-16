/* Ziptility operator formula sheets: both unit systems on ONE URL.
   (Blake ruling 2026-09-10, WW-11 + WW-01 step 2; record in
   purgatory/wwtoolkit-teardown-2026-09-03/09-rulings-2026-09-10.md.)

   The page /tools/formula-sheets keeps its four server-rendered sheets
   (section#water-treatment, #water-distribution, #wastewater-treatment,
   #wastewater-collection, each a plain list of formula lines), so the
   text a crawler reads is unchanged. This bundle adds, on top:
     1. the same US customary / Metric strip the calculator carries, read
        from and written to the ONE shared store (zip-units);
     2. an in-place swap of every formula line to its SI form from
        lines.js, the single list both systems are generated from; the
        US side of that list is verified against the live page's text by
        tests, so the page and the data cannot drift apart silently;
     3. a "Print this sheet" button per sheet, and a PDF title that names
        the system (and the sheet) at print time;
     4. the "email me the PDF" offer, rendered only when a HubSpot form id
        is configured (config.js), never a gate: print works with no email.
   Mount: <div id="ziptility-sheets"></div> placed in the page hero. */
import CSS from './styles.css';
import { SHEETS } from './lines.js';
import { SHEETS_CFG } from './config.js';
import { getSystem, setSystem, subscribe } from '../shared/units-store.js';
import { trackComplete } from '../shared/analytics.js';

const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

function boot() {
  const mount = document.getElementById('ziptility-sheets');
  if (!mount || mount.dataset.zipBooted) return;
  mount.dataset.zipBooted = '1';
  document.body.classList.add('zs-booted');
  /* The breadcrumb bar sits above the hero in its own wrapper and was printing as a near-empty first page. */
  const bc = document.querySelector('nav[aria-label="Breadcrumb"]'); if (bc) (bc.closest('section') || bc.closest('.padding-global') || bc).classList.add('zs-print-hide');
  if (!document.getElementById('zip-sheets-styles')) {
    const s = document.createElement('style'); s.id = 'zip-sheets-styles'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* Index every formula line on the page by its US text. */
  const byImp = new Map();
  SHEETS.forEach((sh) => sh.blocks.forEach((b) => b.lines.forEach((l) => { if (!byImp.has(norm(l.imp))) byImp.set(norm(l.imp), l); })));
  const items = [];
  const heads = [];
  const titleOf = {};
  SHEETS.forEach((sh) => {
    titleOf[sh.id] = sh.title;
    const sec = document.getElementById(sh.id); if (!sec) return;
    /* Only a plain-text li is swappable: one carrying a link, strong or sup keeps its markup and its US text. */
    sec.querySelectorAll('li').forEach((li) => { if (li.children.length) return; const l = byImp.get(norm(li.textContent)); if (l && l.si) items.push({ li, l }); });
    /* A block heading that names a US unit ("Pounds, dosage, and loading") has its own SI form. */
    sh.blocks.forEach((b) => { if (!b.hSI) return; sec.querySelectorAll('h2, h3').forEach((h) => { if (!h.children.length && norm(h.textContent) === norm(b.h)) heads.push({ h, b }); }); });
  });
  /* What matched, for the verification scripts: every SI-bearing line should be on the page. */
  const expected = SHEETS.reduce((n, sh) => n + sh.blocks.reduce((m2, b) => m2 + b.lines.filter((l) => l.si).length, 0), 0);
  mount.dataset.zsMatched = items.length + '/' + expected;

  /* The strip. Same shape and sizes as the calculator's (compact by rule). */
  mount.innerHTML = '';
  const strip = el('div', 'zs-strip');
  const seg = el('div', 'zs-seg'); seg.setAttribute('role', 'group'); seg.setAttribute('aria-label', 'Unit system');
  const bImp = el('button', null, 'US customary'); bImp.type = 'button'; bImp.dataset.sys = 'imperial';
  const bMet = el('button', null, 'Metric'); bMet.type = 'button'; bMet.dataset.sys = 'metric';
  seg.append(bImp, bMet);
  const note = el('p', 'zs-note');
  note.appendChild(el('span', 'zs-long', 'Both systems on one sheet. Print works in either; the PDF name says which. Remembered on this device.'));
  note.appendChild(el('span', 'zs-short', 'Both systems, one sheet. Remembered on this device.'));
  strip.append(seg, note); mount.appendChild(strip);
  [bImp, bMet].forEach((b) => b.addEventListener('click', () => setSystem(b.dataset.sys)));

  /* Per-sheet print, after each sheet's title. */
  SHEETS.forEach((sh) => {
    const sec = document.getElementById(sh.id); const h2 = sec && sec.querySelector('h2'); if (!h2) return;
    const tools = el('div', 'zs-sheet-tools');
    const b = el('button', 'zs-print-one', 'Print this sheet'); b.type = 'button'; b.setAttribute('aria-label', 'Print this sheet: ' + sh.title);
    b.addEventListener('click', () => printSheets(sh.id));
    tools.appendChild(b); h2.insertAdjacentElement('afterend', tools);
  });

  function apply(sys) {
    const metric = sys === 'metric';
    items.forEach(({ li, l }) => { const want = metric ? l.si : l.imp; if (norm(li.textContent) !== norm(want)) li.textContent = want; });
    heads.forEach(({ h, b }) => { const want = metric ? b.hSI : b.h; if (norm(h.textContent) !== norm(want)) h.textContent = want; });
    bImp.setAttribute('aria-pressed', String(!metric)); bMet.setAttribute('aria-pressed', String(metric));
    mount.dataset.system = sys;
  }
  subscribe(apply);
  apply(getSystem());

  /* Print: the platform's only print hooks are beforeprint/afterprint on
     window (same lesson as the report card). The title is what "Save as
     PDF" names the file, so it carries the system and, for a single-sheet
     print, the sheet. A print is the completion on this surface. */
  let printOne = null;
  const baseTitle = document.title;
  window.addEventListener('beforeprint', () => {
    const sys = getSystem();
    document.title = 'Ziptility operator formula sheets (' + (sys === 'metric' ? 'metric' : 'US customary') + (printOne ? ', ' + titleOf[printOne] : '') + ')';
    try { trackComplete('formula-sheets', { mode: sys, calc: printOne || 'all-four' }); } catch (e) {}
  });
  window.addEventListener('afterprint', () => { document.title = baseTitle; clearPrintOne(); });
  function clearPrintOne() {
    document.body.classList.remove('zs-print-one');
    document.querySelectorAll('.zs-target').forEach((t) => t.classList.remove('zs-target'));
    printOne = null;
  }
  function printSheets(id) {
    clearPrintOne(); /* never inherit a stale state from a print whose afterprint did not fire */
    if (id && document.getElementById(id)) { printOne = id; document.body.classList.add('zs-print-one'); document.getElementById(id).classList.add('zs-target'); }
    try { window.print(); } catch (e) { clearPrintOne(); document.title = baseTitle; }
  }
  /* afterprint is unreliable on some mobile browsers; the print media query flipping back is the second signal. */
  try { const mq = window.matchMedia('print'); mq.addEventListener('change', (e) => { if (!e.matches && printOne) { document.title = baseTitle; clearPrintOne(); } }); } catch (e) {}

  /* The offer. Only when a form exists to post to; the sheets and the
     print buttons above never depend on it. */
  if (SHEETS_CFG.hubspotFormId) renderOffer();

  function renderOffer() {
    const last = document.getElementById(SHEETS[SHEETS.length - 1].id); if (!last) return;
    const box = el('section', 'zs-offer'); box.id = 'zs-offer';
    const inner = el('div', 'zs-offer-inner');
    inner.appendChild(el('h3', null, 'Get the PDF by email'));
    inner.appendChild(el('p', null, 'Printing works with no email, right from the buttons above. If you would rather have the PDF sent to you, leave an address and we will send the links, one for each system.'));
    const form = el('form', 'zs-offer-form'); form.noValidate = true;
    const f1 = field('Name', 'zs-name', 'name', 'text'), f2 = field('Work email', 'zs-email', 'email', 'email'), f3 = field('Utility or system (optional)', 'zs-util', 'organization', 'text');
    const submit = el('button', 'zs-offer-submit', 'Send it to me'); submit.type = 'submit';
    const fine = el('p', 'zs-offer-fine', 'An offer, never a gate: nothing on this page sits behind this form. We send the links and nothing else.');
    const msg = el('p', 'zs-offer-msg'); msg.setAttribute('aria-live', 'polite');
    form.append(f1.wrap, f2.wrap, f3.wrap, submit, fine, msg);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = f2.input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'That email does not look right yet.'; return; }
      submit.disabled = true;
      const body = { fields: [
        { name: 'firstname', value: f1.input.value.trim() }, { name: 'email', value: email }, { name: 'company', value: f3.input.value.trim() },
        { name: 'formula_sheet_system', value: getSystem() }
      ], context: { pageUri: safeHref(), pageName: 'Operator formula sheets' } };
      fetch('https://api.hsforms.com/submissions/v3/integration/submit/' + SHEETS_CFG.hubspotPortalId + '/' + SHEETS_CFG.hubspotFormId, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      }).then((r) => { if (!r.ok) throw new Error('hs ' + r.status); form.querySelectorAll('input,button').forEach((x) => { x.disabled = true; }); msg.textContent = 'On its way. Check your inbox for the link.'; })
        .catch(() => { submit.disabled = false; msg.textContent = 'That did not go through. Printing still works, right from the buttons above.'; });
    });
    inner.appendChild(form); box.appendChild(inner);
    last.insertAdjacentElement('afterend', box);
  }
  function field(label, id, ac, type) {
    const wrap = el('div', 'zs-field'); const lab = el('label', null, label); lab.htmlFor = id;
    const input = el('input'); input.id = id; input.type = type; input.autocomplete = ac;
    wrap.append(lab, input); return { wrap, input };
  }
  function safeHref() { try { return window.location.href; } catch (e) { return ''; } }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
