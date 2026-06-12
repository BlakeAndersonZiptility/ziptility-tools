/* Ziptility Operator Calculator — entry point.
   Bundled by esbuild into a single IIFE (dist/calculator-vX.Y.Z.js).
   The Webflow page provides only a mount node:
     <div id="ziptility-calculator"></div>
   Everything else — styles, markup, behavior — is rendered from here. */
import CSS from './ui/styles.css';
import { buildShell } from './ui/template.js';
import { initApp } from './ui/render.js';
import { initLead } from './ui/lead.js';

/* No font loading here — by design (Core Web Vitals audit, 2026-06).
   The Webflow site provides Hankensans + Circular Std (self-hosted,
   preloaded); the stylesheet's stacks use those with system fallbacks.
   Loading Google Fonts with display=swap from this bundle was the
   page's main CLS source. Do not reintroduce a font <link>. */

function boot(){
  const mount=document.getElementById('ziptility-calculator');
  if(!mount || mount.dataset.zipBooted) return;
  mount.dataset.zipBooted='1';
  if(!document.getElementById('zip-calc-styles')){
    const s=document.createElement('style'); s.id='zip-calc-styles'; s.textContent=CSS;
    document.head.appendChild(s);
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
