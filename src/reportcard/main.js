/* Utility Health Report Card: entry point. Bundled by esbuild into a
   single IIFE (dist/reportcard-dev.js in dev; dist/reportcard-vX.Y.Z.js
   once versioned). The host page provides only a mount:
     <div id="ziptility-report-card"></div>
   Boot idiom (mount lookup, boot guard, style/font injection, guarded
   location/localStorage reads) is copied from src/practice/main.js
   L12-50 on purpose, so every embedded tool on the site behaves the
   same way to a host page and to a QA pass. */
import CSS from './styles.css';
import RUBRIC from './data/rubric.json';
import { score } from './scoring.js';
import { loadState, saveState } from './storage.js';
import { ensureOrders, makeOrders } from './rung-order.js';
import { submitAssessment } from './submit.js';
import { renderLanding } from './ui/landing.js';
import { renderIntake, updateAnswerFeedback } from './ui/intake.js';
import { renderProfile } from './ui/profile.js';
import { renderResults } from './ui/results.js';
import { trackComplete, trackProgress, makeMilestoneGate } from '../shared/analytics.js';

function boot() {
  const mount = document.getElementById('ziptility-report-card');
  if (!mount || mount.dataset.zipBooted) return;
  mount.dataset.zipBooted = '1';

  if (!document.getElementById('zrc-styles')) {
    const s = document.createElement('style');
    s.id = 'zrc-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  /* DS 4.0: same self-load pattern as practice/main.js L21-30 so the
     tool renders correctly on any host page, with preconnect +
     display=swap to limit layout shift. */
  if (!document.getElementById('zrc-fonts')) {
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    const ff = document.createElement('link');
    ff.id = 'zrc-fonts';
    ff.rel = 'stylesheet';
    ff.href = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap';
    document.head.append(pc1, pc2, ff);
  }

  /* C4 print fix: a CSS-only "force a closed <details> open in print"
     rule does not actually work in current Chromium. Verified directly:
     with `details:not([open]) > :not(summary){ display:block!important }`
     applied, the citation <p> itself computes display:block and a real
     non-zero height in isolation, but the <details> ancestor still
     collapses to zero height in the rendered page - closed <details>
     content sits behind an internal UA wrapper a light-DOM child's own
     display cannot reach into. The citation styles.css still adds are
     harmless defence in depth, not the actual fix.
     The real fix is the native `open` attribute, flipped only around the
     print itself via the platform's only print lifecycle hooks
     (beforeprint/afterprint fire on window, not per element, which is why
     this lives once at boot rather than being re-wired on every render),
     and restored immediately after - so "closed by default" stays true
     for every render the reader actually looks at on screen. */
  window.addEventListener('beforeprint', () => {
    mount.querySelectorAll('.zrc-cite-details').forEach((d) => {
      d.dataset.zrcWasOpen = d.open ? '1' : '0';
      d.open = true;
    });
  });
  window.addEventListener('afterprint', () => {
    mount.querySelectorAll('.zrc-cite-details').forEach((d) => {
      d.open = d.dataset.zrcWasOpen === '1';
    });
  });

  const dims = RUBRIC.dimensions;
  const gradeLabels = RUBRIC.gradeLabels;

  /* Guarded the same way as the practice bundle: reading localStorage or
     location can throw inside a sandboxed preview iframe, and a thrown
     exception here must never stop the tool from booting. */
  let saved = null;
  try { saved = loadState(); } catch (e) { saved = null; }

  let grades = (saved && saved.grades) || {};
  let idx = saved && typeof saved.idx === 'number' ? saved.idx : 0;
  /* Generated once and reused for the life of the assessment. ensureOrders
     keeps every valid stored order exactly as the reader has been seeing
     it and only fills gaps. */
  let orders = ensureOrders(dims, saved && saved.orders);
  let profile = (saved && saved.profile) || null;
  let submitted = Boolean(saved && saved.submitted);
  let screen = 'landing';

  mount.innerHTML = '';
  const stage = document.createElement('div');
  stage.className = 'zrc-wrap';
  mount.appendChild(stage);

  function persist() {
    try { saveState({ grades, idx, orders, profile, submitted }); }
    catch (e) { /* guarded in storage.js too; belt and suspenders */ }
  }

  function clampIdx(i) {
    return Math.max(0, Math.min(dims.length - 1, i));
  }

  function goLanding() {
    screen = 'landing';
    render();
  }
  function goIntake(atIdx) {
    screen = 'intake';
    if (typeof atIdx === 'number') idx = clampIdx(atIdx);
    persist();
    render();
  }
  /* D1 fix: Start must be a genuine restart, not a second Resume. Before
     this fix onStart and onResume both called goIntake(idx), so a saved
     assessment made "Start the Report Card" land wherever the reader had
     left off (verified live: 23/23 saved, click Start, land on F6),
     which breaks the annual-update workflow this tool is meant for - the
     only way to begin a fresh assessment was clearing localStorage by
     hand.
     A genuine restart clears the answers AND regenerates the rung order:
     a new assessment deserves a new shuffle (see rung-order.js on why the
     shuffle exists), and reusing last year's shuffle would leave a stale
     positional pattern sitting under this year's blind intake. */
  function startFresh() {
    idx = 0;
    grades = {};
    orders = makeOrders(dims);
    goIntake(0);
  }
  /* The optional closing block sits between the last dimension and the
     score: demographics last is standard survey practice, because a wall
     of profile questions up front is where people quit, and by here the
     reader has already put in 90 minutes.

     It is NOT a gate (R14). Skipping goes straight to the same score, and
     the block is shown once: a reader who has already passed it, or who is
     coming back to a finished assessment, goes direct to results. */
  function goProfile() {
    if (profile || submitted) { goResults(); return; }
    screen = 'profile';
    render();
  }
  /* Fires once per page load, not once per render: goResults is reachable
     again from the profile skip path and from a returning reader. */
  let completeSent = false;
  function goResults() {
    screen = 'results';
    if (!completeSent) {
      completeSent = true;
      /* NO PII. Grades and counts only, never the email or the profile
         free-text, because the whole point of this tool is that a reader can
         finish it without identifying themselves. */
      try {
        const s2 = score(grades, RUBRIC.dimensions);
        trackComplete('report-card', {
          practical_grade: s2.practical && s2.practical.grade,
          overall_grade: s2.overall && s2.overall.grade,
          capped: s2.practical && s2.practical.capped ? 'yes' : 'no',
          redline_count: s2.flags ? s2.flags.length : 0,
          answered: s2.answered,
          complete: s2.complete ? 'yes' : 'no'
        });
      } catch (e) {
        trackComplete('report-card');
      }
    }
    render();
  }
  function handleProfile(answers) {
    profile = answers || {};
    persist();
    /* Fire and forget. The score must never wait on a network call, and a
       failed submission is our problem, not the reader's: they see their
       results either way. */
    submitAssessment({ grades, profile, dimensions: dims })
      .then(() => { submitted = true; persist(); })
      .catch(() => { /* nothing to tell the reader; their report is unaffected */ });
    goResults();
  }
  /* Coarse milestones only. 23 answers must not become 23 events per
     session; what matters is the shape of the drop-off, not each keystroke. */
  const progressGate = makeMilestoneGate([25, 50, 75]);
  function handleAnswer(dimId, grade) {
    grades = Object.assign({}, grades, { [dimId]: grade });
    persist();
    try {
      const answered = Object.keys(grades).length;
      if (progressGate(answered, dims.length)) {
        trackProgress('report-card', answered, dims.length);
      }
    } catch (e) { /* analytics never blocks answering */ }
    /* Lightweight update only (see updateAnswerFeedback's own comment):
       a full renderIntake here would rebuild the radio the reader just
       picked and drop keyboard focus off it. */
    updateAnswerFeedback(stage, { dimensions: dims, grades });
  }

  function intakeProps() {
    return {
      dimensions: dims,
      grades,
      idx,
      gradeLabels,
      rungOrders: orders,
      onAnswer: handleAnswer,
      onGoto: goIntake,
      onExit: goLanding,
      onViewResults: goProfile
    };
  }

  function render() {
    if (screen === 'landing') {
      const s = score(grades, dims);
      renderLanding(stage, {
        hasSaved: s.answered > 0,
        savedCount: s.answered,
        total: s.total,
        onStart: startFresh,
        onResume: () => goIntake(idx)
      });
    } else if (screen === 'intake') {
      renderIntake(stage, intakeProps());
    } else if (screen === 'profile') {
      renderProfile(stage, {
        profile,
        onSubmit: handleProfile,
        onSkip: goResults,
        onBack: () => goIntake(idx)
      });
    } else {
      renderResults(stage, {
        dimensions: dims,
        grades,
        gradeLabels,
        profile,
        onBack: () => goIntake(idx),
        onEdit: (i) => goIntake(i)
      });
    }
  }

  render();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
