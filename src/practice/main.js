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
     Resolved embedApp adds the 'zq-embed-app' class to mount: a live,
     styleable, testable variant hook (T51), currently a visual no-op (no
     styles.css rule targets it yet). Nothing else in this bundle branches
     on embedApp: the CTA/SEO hide use case that drives it in the
     calculator does not apply here (must-fix 4 removed both from this
     bundle). Kept for parity and any future gating; also passed through
     on cfg. */
  let embedApp = false;
  let deepLinkTest = null;
  try {
    const q = new URLSearchParams(window.location.search);
    embedApp = q.get('embed') === 'app';
    deepLinkTest = q.get('test');
  } catch (e) { /* sandboxed iframe: location threw */ }
  if (!embedApp) embedApp = mount.dataset.embed === 'app';
  if (!deepLinkTest) deepLinkTest = mount.dataset.test || null;
  if (embedApp) mount.classList.add('zq-embed-app');

  /* Q-12 split: the hub links out to per-discipline pages instead of
     launching in place. Off unless the embed opts in, since those pages
     do not exist until they are built. */
  const childPages = mount.dataset.childPages === '1';

  const bankBase = mount.dataset.bankBase || BANK_BASE_URL;
  const hubUrl = mount.dataset.hubUrl || CONFIG.hubUrl;

  mount.innerHTML = '';
  const stage = document.createElement('div');
  stage.className = 'zq-wrap';
  mount.appendChild(stage);

  let controller = null;

  function showPicker() {
    if (controller) { controller.destroy(); controller = null; }
    renderPicker(stage, { onSelect: selectTest, childPages, hubUrl });
  }

  /* deepLinked: entered straight into one bank from a per-discipline page
     rather than by picking on the hub. It changes one thing downstream:
     "All practice tests" becomes a link to the hub instead of swapping
     the six-card picker in place, which on /tools/practice/<discipline>
     would render the hub's own content on the page built NOT to duplicate
     it. See quiz-engine.js renderResults. */
  function selectTest(test, deepLinked) {
    renderLoading(stage);
    loadBank(test.id, test.bankVersion, bankBase)
      .then((bank) => {
        const cfg = {
          ...CONFIG, embedApp, hubUrl,
          title: test.title, badge: test.badge, deepLinked: !!deepLinked
        };
        controller = initQuiz(stage, bank, cfg, { onExit: deepLinked ? null : showPicker });
        /* test-only reach-in: mirrors the calculator's debug-hook idiom.
           Never set outside an explicit opt-in, so production pages never
           expose the controller. */
        if (mount.dataset.debug === '1') mount.__zqDebug = controller;
      })
      .catch(() => {
        renderError(stage, {
          message: 'Could not load "' + test.title + '." Check your connection and try again.',
          onRetry: () => selectTest(test, deepLinked)
        });
      });
  }

  if (deepLinkTest) {
    /* Resolve by URL slug ("water-treatment") or internal id ("wt-1").
       The slug is what the embed author reads off the page URL; the id is
       kept working so every embed written before the split keeps running. */
    const test = TESTS.find((t) => t.slug === deepLinkTest || t.id === deepLinkTest);
    if (test) {
      selectTest(test, true);
    } else {
      /* Deliberately NOT a fallback to the picker. A discipline page whose
         data-test has a typo would then quietly render the six-card hub:
         wrong content, on the one page that exists to not be the hub, with
         nothing anywhere reporting a problem. Fail where someone sees it. */
      renderError(stage, {
        message: 'This practice test is not available at "' + deepLinkTest + '." Pick a test from the full list instead.',
        hubUrl
      });
    }
  } else {
    showPicker();
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
