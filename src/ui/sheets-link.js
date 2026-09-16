/* The formula-sheet PDFs in the calculator's CTA band: two links, the one
   for the reader's current unit system is the red primary and sits first.
   Replaces the lead modal (lead.js, retired 2026-09-16): the file is the
   offer, nothing to fill in. A click is a completion on this surface. */
import { SHEETS_PDF } from '../shared/sheets-pdf.js';
import { getSystem, subscribe } from '../shared/units-store.js';
import { trackComplete } from '../shared/analytics.js';

export function initSheetsLink(){
  const links = { imperial: document.getElementById('sheetPdfImp'), metric: document.getElementById('sheetPdfMet') };
  if(!links.imperial || !links.metric) return;
  Object.keys(links).forEach((sys) => {
    const a = links[sys]; a.href = SHEETS_PDF[sys];
    a.addEventListener('click', () => { try{ trackComplete('calculator', { calc:'formula-sheets-pdf', mode:sys }); }catch(e){} });
  });
  function apply(sys){
    Object.keys(links).forEach((k) => { links[k].classList.toggle('cta-primary', k === sys); links[k].classList.toggle('cta-ghost', k !== sys); });
    const first = links[sys]; first.parentNode.insertBefore(first, first.parentNode.firstChild);
  }
  subscribe(apply); apply(getSystem());
}
