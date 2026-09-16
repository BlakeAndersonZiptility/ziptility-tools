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
     4. the two PDFs as plain links in the strip (src/shared/sheets-pdf.js);
        the link follows the pressed system. No form since 1.1.0: the file
        is the offer (Blake 2026-09-16).
   Mount: <div id="ziptility-sheets"></div> placed in the page hero. */
import CSS from './styles.css';
import { SHEETS } from './lines.js';
import { SHEETS_PDF, SHEETS_PDF_LABEL } from '../shared/sheets-pdf.js';
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
  note.appendChild(el('span', 'zs-long', 'Both systems on one sheet. Remembered on this device.'));
  note.appendChild(el('span', 'zs-short', 'Remembered on this device.'));
  /* The PDF: one link, the file for the pressed system. Flip the strip for the other. */
  const dl = el('a', 'zs-dl'); dl.target = '_blank'; dl.rel = 'noopener';
  const dlLong = el('span', 'zs-long'), dlShort = el('span', 'zs-short', 'PDF'); dl.append(dlLong, dlShort);
  dl.addEventListener('click', () => { try { trackComplete('formula-sheets', { mode: getSystem(), calc: 'pdf' }); } catch (e) {} });
  strip.append(seg, dl, note); mount.appendChild(strip);
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
    dl.href = SHEETS_PDF[sys]; dlLong.textContent = 'PDF, ' + SHEETS_PDF_LABEL[sys]; dl.setAttribute('aria-label', 'Download the PDF, ' + SHEETS_PDF_LABEL[sys]);
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

}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
