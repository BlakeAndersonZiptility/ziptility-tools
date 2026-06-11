/* Ziptility Operator Calculator — entry point.
   Bundled by esbuild into a single IIFE (dist/calculator-vX.Y.Z.js).
   The Webflow page provides only a mount node:
     <div id="ziptility-calculator"></div>
   Everything else — styles, markup, behavior — is rendered from here. */
import CSS from './ui/styles.css';
import { buildShell } from './ui/template.js';
import { initApp } from './ui/render.js';
import { initLead } from './ui/lead.js';

const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap';

function ensureFonts(){
  if(document.querySelector('link[href="'+FONT_CSS+'"]')) return;
  for(const href of ['https://fonts.googleapis.com','https://fonts.gstatic.com']){
    const l=document.createElement('link'); l.rel='preconnect'; l.href=href;
    if(href.includes('gstatic')) l.crossOrigin='anonymous';
    document.head.appendChild(l);
  }
  const l=document.createElement('link'); l.rel='stylesheet'; l.href=FONT_CSS; document.head.appendChild(l);
}

function boot(){
  const mount=document.getElementById('ziptility-calculator');
  if(!mount || mount.dataset.zipBooted) return;
  mount.dataset.zipBooted='1';
  ensureFonts();
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
