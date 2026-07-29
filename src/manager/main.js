/* Ziptility Manager Toolbox - entry point for all three manager tools.
   Bundled by esbuild into a single IIFE, same pattern as src/main.js:
     esbuild src/manager/main.js --bundle --format=iife --loader:.css=text
   Three separate Webflow pages (/tools/repair-or-replace,
   /tools/cost-of-turnover, /tools/energy-cost) each provide the SAME mount:
     <div id="ziptility-manager-tools" data-tool="repair-or-replace"></div>
   and the same <script src>; the mount's data-tool (or a ?tool= query
   param) tells this one bundle which of the three tools to render. A page
   pins exactly one tool - this deliberately does NOT fall back to a picker
   when the id is missing or wrong (same call as src/practice/main.js's
   deep-link handling): fail where someone sees it, not the wrong tool. */
import CSS from './styles.css';
import { calculators } from './registry.js';
import { renderTool } from './ui/render.js';
import { initLead } from './ui/lead.js';

function boot() {
  const mount = document.getElementById('ziptility-manager-tools');
  if (!mount || mount.dataset.zipBooted) return;
  mount.dataset.zipBooted = '1';

  if (!document.getElementById('zip-manager-styles')) {
    const s = document.createElement('style'); s.id = 'zip-manager-styles'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  /* DS 4.0: Archivo + Geist, self-loaded so the tool renders correctly on
     any host (same idiom as src/main.js and src/practice/main.js). */
  if (!document.getElementById('zip-manager-fonts')) {
    const pc1 = document.createElement('link'); pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    const pc2 = document.createElement('link'); pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com'; pc2.crossOrigin = 'anonymous';
    const ff = document.createElement('link'); ff.id = 'zip-manager-fonts'; ff.rel = 'stylesheet';
    ff.href = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap';
    document.head.append(pc1, pc2, ff);
  }

  /* ?embed=app / data-embed="app" and ?tool=/data-tool, guarded: reading
     location can throw inside a sandboxed iframe (documented lesson). */
  let embedApp = false;
  let deepLinkTool = null;
  try {
    const q = new URLSearchParams(window.location.search);
    embedApp = q.get('embed') === 'app';
    deepLinkTool = q.get('tool');
  } catch (e) { /* sandboxed iframe: location threw */ }
  if (!embedApp) embedApp = mount.dataset.embed === 'app';
  if (!deepLinkTool) deepLinkTool = mount.dataset.tool || null;
  if (embedApp) mount.classList.add('zmt-embed-app');

  mount.innerHTML = '';
  if (!deepLinkTool) {
    mount.innerHTML = '<div class="zmt-error">This page is missing its tool id. Set <code>data-tool</code> on the mount div (or add <code>?tool=</code> to the URL) to one of: ' +
      calculators.map((c) => c.id).join(', ') + '.</div>';
    return;
  }
  const tool = calculators.find((c) => c.id === deepLinkTool);
  if (!tool) {
    /* Deliberately not a picker fallback (src/practice/main.js precedent):
       a page with a typo'd data-tool should fail visibly, not quietly
       render an arbitrary tool. */
    mount.innerHTML = '<div class="zmt-error">"' + deepLinkTool + '" is not one of the manager tools. Available: ' +
      calculators.map((c) => c.id).join(', ') + '.</div>';
    return;
  }

  renderTool(mount, tool);
  initLead(mount, tool);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
