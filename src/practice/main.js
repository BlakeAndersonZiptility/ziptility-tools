/* Ziptility practice tests: entry point. Bundled by esbuild into a single
   IIFE (dist/practice-vX.Y.Z.js). The host page provides only a mount:
     <div id="ziptility-practice"></div>
   Everything else (styles, fonts, picker, quiz) renders from here. */
import CSS from './styles.css';
import { CONFIG } from './config.js';
import { TESTS, BANK_BASE_URL } from './manifest.js';
import { loadBank } from './bank-loader.js';
import { renderPicker, renderLoading, renderError } from './picker.js';
import { initQuiz } from './quiz-engine.js';

function boot() {
  const mount = document.getElementById('ziptility-practice');
  if (!mount || mount.dataset.zipBooted) return;
  mount.dataset.zipBooted = '1';

  if (!document.getElementById('zpt-practice-styles')) {
    const s = document.createElement('style'); s.id = 'zpt-practice-styles'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  /* DS 4.0: same self-load pattern as the calculator (src/main.js L29-35)
     so the tool renders correctly on any host; preconnect + display=swap
     to limit CLS. */
  if (!document.getElementById('zpt-practice-fonts')) {
    const pc1 = document.createElement('link'); pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    const pc2 = document.createElement('link'); pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com'; pc2.crossOrigin = 'anonymous';
    const ff = document.createElement('link'); ff.id = 'zpt-practice-fonts'; ff.rel = 'stylesheet';
    ff.href = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap';
    document.head.append(pc1, pc2, ff);
  }

  /* ?embed=app / data-embed="app", resolved once (calculator idiom;
     guarded since reading location can throw inside a sandboxed iframe).
     Nothing in this bundle currently branches on embedApp: the CTA/SEO
     hide use case that drives it in the calculator does not apply here
     (must-fix 4 removed both from this bundle). Kept for parity and any
     future gating; passed through on cfg. */
  let embedApp = false;
  let deepLinkTest = null;
  try {
    const q = new URLSearchParams(window.location.search);
    embedApp = q.get('embed') === 'app';
    deepLinkTest = q.get('test');
  } catch (e) { /* sandboxed iframe: location threw */ }
  if (!embedApp) embedApp = mount.dataset.embed === 'app';
  if (!deepLinkTest) deepLinkTest = mount.dataset.test || null;

  const bankBase = mount.dataset.bankBase || BANK_BASE_URL;

  mount.innerHTML = '';
  const stage = document.createElement('div');
  stage.className = 'zq-wrap';
  mount.appendChild(stage);

  let controller = null;

  function showPicker() {
    if (controller) { controller.destroy(); controller = null; }
    renderPicker(stage, { onSelect: selectTest });
  }

  function selectTest(test) {
    renderLoading(stage);
    loadBank(test.id, test.bankVersion, bankBase)
      .then((bank) => {
        const cfg = { ...CONFIG, embedApp, title: test.title, badge: test.badge };
        controller = initQuiz(stage, bank, cfg, { onExit: showPicker });
      })
      .catch(() => {
        renderError(stage, {
          message: 'Could not load "' + test.title + '." Check your connection and try again.',
          onRetry: () => selectTest(test)
        });
      });
  }

  if (deepLinkTest) {
    const test = TESTS.find((t) => t.id === deepLinkTest);
    if (test) selectTest(test);
    else showPicker();
  } else {
    showPicker();
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
