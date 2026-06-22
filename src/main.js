/* Ziptility Operator Calculator — entry point.
   Bundled by esbuild into a single IIFE (dist/calculator-vX.Y.Z.js).
   The Webflow page provides only a mount node:
     <div id="ziptility-calculator"></div>
   Everything else — styles, markup, behavior — is rendered from here. */
import CSS from './ui/styles.css';
import { buildShell } from './ui/template.js';
import { initApp } from './ui/render.js';
import { initLead } from './ui/lead.js';

/* Fonts: DS 4.0 (2026-06-22) moved the tool to Archivo + Geist and now loads
   them from the bundle (see boot()), so it renders correctly on any host.
   This deliberately reverses the earlier "no font <link>" rule from the
   2026-06 CWV audit (Hankensans/Circular were site-provided then). The load
   is preconnected + display=swap to limit CLS; re-check CrUX after deploy and
   fall back to display=optional / self-host if it regresses. */

function boot(){
  const mount=document.getElementById('ziptility-calculator');
  if(!mount || mount.dataset.zipBooted) return;
  mount.dataset.zipBooted='1';
  if(!document.getElementById('zip-calc-styles')){
    const s=document.createElement('style'); s.id='zip-calc-styles'; s.textContent=CSS;
    document.head.appendChild(s);
  }
  /* DS 4.0: load the brand type (Archivo + Geist) from the bundle so the tool
     is self-contained on any host. Preconnect + display=swap keep the swap
     fast; id-guarded so it injects once, like the style block above. */
  if(!document.getElementById('zip-calc-fonts')){
    const pc1=document.createElement('link'); pc1.rel='preconnect'; pc1.href='https://fonts.googleapis.com';
    const pc2=document.createElement('link'); pc2.rel='preconnect'; pc2.href='https://fonts.gstatic.com'; pc2.crossOrigin='anonymous';
    const ff=document.createElement('link'); ff.id='zip-calc-fonts'; ff.rel='stylesheet';
    ff.href='https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap';
    document.head.append(pc1, pc2, ff);
  }
  mount.innerHTML=buildShell();
  /* ?embed=app or data-embed="app" → gated/in-app build: hide marketing CTA
     and Webflow SEO sections, just the tool. Guarded: reading location can
     throw inside a sandboxed iframe. */
  try{
    const q=new URLSearchParams(window.location.search);
    if(q.get('embed')==='app' || mount.dataset.embed==='app') document.body.classList.add('embed-app');
  }catch(e){ if(mount.dataset.embed==='app') document.body.classList.add('embed-app'); }
  initApp();
  initLead();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
