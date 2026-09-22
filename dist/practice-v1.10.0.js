/* Ziptility Practice Tests practice-v1.10.0 (d41e7dd731dc875d65f12461372479805d88b55b) — https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var ve=`/* Ziptility practice tests: DS 4.0 reskin, ported from
   web/practice-tests/engine/quiz.css. Token values are 1:1 with the QAQC
   sheet's token table (qaqc/practice-bundle-ui.md); this block is the
   one sanctioned raw-hex site (oxlint adherence allowlist), every other
   rule below references a token. Everything nests under #ziptility-practice:
   no bare *, html, or body selectors (the styles.css flaw in the
   calculator bundle this port must not repeat). The tool paints no page
   background, the host page owns gutters/background. */
#ziptility-practice{
  /* ---- tokens ---- */
  --tomato:#ff442f;
  --tomato-press:#c02100;
  --tomato-soft:#ffe9e6;
  --tomato-tint:#fff4f2;
  --midnight:#0c1f30;
  --linen:#f6eee6;
  --white:#ffffff;
  --n50:#f8fafc;
  --n100:#f1f5f9;
  --n200:#e2e8f0;
  --n300:#cbd5e1;
  --n400:#94a3b8;
  --n500:#64748b;
  --n600:#475569;
  --n700:#334155;
  --n900:#0f172a;
  --warm-100:#f9f3ec;
  --warm-400:#e6dac9;
  --info:#0088ff;
  --success:#16a34a;
  --success-bg:#f0fdf4;
  --success-border:#86efac;
  --success-fg:#15803d;
  --danger:#dc2626;
  --danger-bg:#fef2f2;
  --danger-border:#fca5a5;
  --danger-fg:#b91c1c;
  --warning-bg:#fffbeb;
  --warning-border:#fcd34d;
  --gradient-dark:linear-gradient(to bottom,#0c1f30,#0f1923);
  --shadow-xs:0 1px 2px rgba(12,31,48,.06);
  --shadow-sm:0 2px 8px rgba(12,31,48,.08);
  --shadow-md:0 8px 24px rgba(12,31,48,.10);
  --shadow-lg:0 18px 48px rgba(12,31,48,.14);
  --radius:10px;
  --radius-sm:6px;
  --radius-lg:16px;
  --radius-pill:999px;
  --dur:220ms;
  --dur-fast:200ms;
  --ease:cubic-bezier(.4,0,.2,1);
  --font-sans:'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-ui:'Geist', var(--font-sans);
  --press-scale:0.96;

  /* ---- scoped root rules ---- */
  margin:0;
  color:var(--n600);
  font-family:var(--font-sans);
  font-size:16px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
#ziptility-practice *,
#ziptility-practice *::before,
#ziptility-practice *::after{ box-sizing:border-box; }

#ziptility-practice .zq-wrap{
  max-width:48rem;
  margin:0 auto;
  scroll-margin-top:96px; /* must-fix 1: target for rootEl.scrollIntoView() */
}
#ziptility-practice .zq-visually-hidden{
  position:absolute; width:1px; height:1px; margin:-1px; padding:0;
  overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;
}

/* ---------- badge / title (in-tool, start screen only; page owns the H1) ---------- */
#ziptility-practice .zq-badge{
  display:inline-block;
  background:var(--n100);
  color:var(--n700);
  border-radius:var(--radius-pill);
  font-size:12px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.04em;
  padding:.3rem .7rem;
  margin-bottom:10px;
}
#ziptility-practice .zq-title{
  font-family:var(--font-sans);
  font-weight:900;
  font-size:clamp(24px,3vw,28px);
  line-height:1.15;
  letter-spacing:-0.02em;
  color:var(--midnight);
  margin:0 0 1rem;
}
#ziptility-practice .zq-intro{ font-size:16px; line-height:1.6; color:var(--n600); }
#ziptility-practice .zq-intro a{
  font-weight:600; color:var(--tomato-press); text-decoration:none;
  transition:color var(--dur-fast) var(--ease);
}
#ziptility-practice .zq-intro a:hover{ text-decoration:underline; }

/* ---------- cards & buttons ---------- */
#ziptility-practice .zq-card{
  background:var(--white);
  border-radius:var(--radius-lg);
  border:none;
  box-shadow:var(--shadow-md);
  padding:1.75rem;
  margin:1rem 0;
}
@media (max-width:559px){
  #ziptility-practice .zq-card{ padding:1.25rem; }
}

/* HOST-LEAK GUARD (fit pass, 2026-09-22). Measured on the live page: the bundle styled none of
   its own card headings, so the Webflow site's GLOBAL rules won inside the tool. "Set up your
   test" rendered at 54.4px / weight 900 / slate grey (the site's h2); "Where you stand by
   topic" and "Review what you missed" at 40px / 900 / slate (the site's h3); the site's
   li{margin-bottom:.25rem} added 4px under every choice button; its p{font-weight:500} made
   every paragraph in the tool semi-bold. A scoped bundle has to own every element it renders,
   because the host's stylesheet is not something it controls. */
#ziptility-practice .zq-card > h2{
  font-family:var(--font-sans); font-weight:900; font-size:22px; line-height:1.2;
  letter-spacing:-0.01em; color:var(--midnight); margin:0 0 16px;
}
#ziptility-practice .zq-card > h3{
  font-family:var(--font-sans); font-weight:700; font-size:20px; line-height:1.25;
  color:var(--midnight); margin:0 0 12px;
}
#ziptility-practice p{ font-weight:400; }
#ziptility-practice ul, #ziptility-practice li{ margin:0; padding:0; }
/* An unbroken token (a URL, a long unit string) in a stem, choice or explanation must wrap
   inside the 270px phone column rather than push the card wider. */
#ziptility-practice .zq-stem,
#ziptility-practice .zq-choice > span:last-child,
#ziptility-practice .zq-explain,
#ziptility-practice .zq-missed summary,
#ziptility-practice .zq-missed-body{ overflow-wrap:anywhere; min-width:0; }

/* Renders as <button> everywhere except the two places that are genuine
   navigations (the deep-linked "All practice tests" exit, the unresolved
   -slug error's way out), so it carries the anchor's no-underline rule. */
#ziptility-practice .zq-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:.6rem;
  font-family:var(--font-sans); font-weight:700;
  border-radius:var(--radius);
  border:2px solid transparent;
  cursor:pointer; text-decoration:none;
  transition:background var(--dur) var(--ease), color var(--dur) var(--ease),
             border-color var(--dur) var(--ease), transform var(--dur-fast) var(--ease);
}
#ziptility-practice .zq-btn:active{ transform:scale(var(--press-scale)); }
#ziptility-practice .zq-btn[disabled]{ opacity:.5; cursor:not-allowed; }
#ziptility-practice .zq-btn .zq-arrow{ display:inline-flex; transition:transform var(--dur-fast) var(--ease); }

/* PRIMARY-ACTION FIX, 2026-07-29 (design pass, Blake ruling: "use design system rules (not
   calculator rules) ... make it look on brand and professional"). This button's fill used to be
   pinned to raw tomato by a test (tests/practice-browser.test.js, now updated in the same pass)
   in service of a superseded calculator-local ruling; the workaround that pin forced was
   navy/midnight TEXT on raw tomato (~4.88:1) instead of fixing the fill. The fill now moves to
   the DS's own sanctioned text-bearing tomato, --tomato-press (#c02100, MEASURED white-on-press =
   6.07:1), with white text - the same treatment src/ui, src/manager and this bundle's own
   .zq-choice .zq-selected .zq-letter all use, so the primary action reads as ONE pattern across
   all four tool bundles rather than a different compromise in each. The arrow icon uses
   stroke="currentColor" (quiz-engine.js ARROW_PATH) so it follows white automatically. */
#ziptility-practice .zq-btn-primary{
  background:var(--tomato-press); color:var(--white);
  padding:1rem 2rem; font-size:20px;
  box-shadow:0 3px 10px rgba(192,33,0,.22);
}
/* DISABLED (fit pass, 2026-09-22): the primary at opacity .5 rendered as a salmon pink no token
   defines, and since "Check answer" is disabled until a choice is picked, that pink was the first
   thing on every question. Disabled is now a neutral fill: unmistakably inactive, on token. */
#ziptility-practice .zq-btn-primary[disabled]{
  background:var(--n200); color:var(--n500); box-shadow:none; opacity:1;
}
#ziptility-practice .zq-btn-primary[disabled]:hover{ filter:none; box-shadow:none; }
/* Hover darkens the already-passing tomato-press fill with brightness() (never risks contrast,
   since darkening a passing background against white text can only raise the ratio) and adds the
   canon "shadow lift" (DESIGN_SYSTEM_HANDOFF.md \xA74) on top. */
#ziptility-practice .zq-btn-primary:hover{ filter:brightness(0.85); box-shadow:var(--shadow-md); }
#ziptility-practice .zq-btn-primary:hover .zq-arrow{ transform:translateX(3px); }

#ziptility-practice .zq-btn-secondary{
  background:transparent; color:var(--tomato-press);
  border-color:var(--tomato);
  padding:1rem 2rem; font-size:14px;
}
#ziptility-practice .zq-btn-secondary:hover{ background:var(--tomato-tint); }

#ziptility-practice .zq-btn-quiet{
  background:transparent; color:var(--n600);
  border-color:var(--n200);
  padding:1rem 2rem; font-size:14px;
}
#ziptility-practice .zq-btn-quiet:hover{ border-color:var(--n300); color:var(--n700); }

/* ---------- focus (C1: #0088ff site-wide, ruled 2026-07-07) ---------- */
#ziptility-practice .zq-btn:focus-visible,
#ziptility-practice .zq-choice:focus-visible,
#ziptility-practice .zq-mode:focus-visible,
#ziptility-practice .zq-size:focus-visible,
#ziptility-practice .zq-hubcard:focus-visible,
#ziptility-practice .zq-missed summary:focus-visible,
#ziptility-practice a:focus-visible{
  outline:2px solid var(--info);
  outline-offset:2px;
}

/* ---------- start screen ---------- */
#ziptility-practice .zq-mode-grid{ display:grid; grid-template-columns:1fr; gap:12px; }
@media (min-width:560px){ #ziptility-practice .zq-mode-grid{ grid-template-columns:1fr 1fr; } }
#ziptility-practice .zq-mode{
  text-align:left; background:var(--white); color:inherit; font:inherit;
  border-radius:var(--radius); border:2px solid var(--n200);
  padding:18px; cursor:pointer;
  transition:border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}
#ziptility-practice .zq-mode:hover{ border-color:var(--n300); box-shadow:var(--shadow-xs); }
#ziptility-practice .zq-mode.zq-selected{ border-color:var(--tomato); background:var(--tomato-tint); }
#ziptility-practice .zq-mode h3{ margin:0 0 4px; font-size:17px; font-weight:700; color:var(--midnight); }
#ziptility-practice .zq-mode p{ margin:0; font-size:14px; color:var(--n600); }

#ziptility-practice .zq-size-row{ display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; }
#ziptility-practice .zq-size{
  font-family:var(--font-sans); font-weight:700; color:var(--midnight);
  background:var(--white); border:2px solid var(--n200); border-radius:var(--radius);
  padding:.6rem 1.1rem; min-height:44px; cursor:pointer;
  transition:border-color var(--dur-fast) var(--ease);
}
#ziptility-practice .zq-size:hover{ border-color:var(--n300); }
#ziptility-practice .zq-size.zq-selected{ border-color:var(--tomato); background:var(--tomato-tint); }
#ziptility-practice .zq-size small{ display:block; font-weight:400; font-size:12px; color:var(--n500); }

#ziptility-practice .zq-resume{
  background:var(--warning-bg); border:1px solid var(--warning-border);
  border-radius:var(--radius); color:var(--n700);
  padding:14px 16px; margin:14px 0;
  display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
}
#ziptility-practice .zq-best{ font-size:14px; color:var(--n500); margin-top:8px; }

/* ---------- shared button rows ---------- */
#ziptility-practice .zq-navrow{
  display:flex; gap:.6rem; margin-top:18px; flex-wrap:wrap; align-items:center;
}
#ziptility-practice .zq-navrow .zq-spacer{ flex:1; }
#ziptility-practice .zq-navrow.zq-navrow-center{ justify-content:center; }
/* PHONE (fit pass, 2026-09-22). Measured at 390px: the page column is 310px and the card's
   inner width 270px. "Start practice (25 questions)" wrapped to two lines (105px tall) with the
   arrow orphaned on a third; "Check answer" and "Next question" sat right-aligned as 73px
   blocks; the score screen stacked three buttons of three different widths. On a phone every
   button row becomes a full-width stack, the primary first, at 18px. */
@media (max-width:559px){
  /* 16px, not 18: at 18px "Take it again (new draw)" filled the 230px line exactly and the
     arrow dropped onto a line of its own. 16px keeps that label and its arrow together and
     lets "Start practice (25 questions)" wrap once with the arrow after its last word. */
  #ziptility-practice .zq-btn-primary{ font-size:16px; padding:.9rem 1rem; }
  #ziptility-practice .zq-btn-secondary,
  #ziptility-practice .zq-btn-quiet{ padding:.85rem 1.25rem; }
  #ziptility-practice .zq-navrow{ flex-direction:column; align-items:stretch; gap:.5rem; }
  #ziptility-practice .zq-navrow .zq-spacer{ display:none; }
  /* display:block, not flex: a long label ("Start practice (25 questions)") may wrap in the
     230px the phone leaves, and as a flex column the arrow floated beside the wrapped text
     like a separate control. Inline, it trails the last word. */
  #ziptility-practice .zq-navrow .zq-btn{
    display:block; width:100%; text-align:center; position:relative; padding-right:2.4rem;
  }
  /* The arrow is pinned to the right edge (the site's own full-width CTA shape), out of the
     text flow, so it can never drop onto a line of its own when the label fills the width. */
  #ziptility-practice .zq-navrow .zq-btn .zq-arrow{
    position:absolute; right:1rem; top:50%; transform:translateY(-50%); margin:0;
  }
  #ziptility-practice .zq-navrow .zq-btn-primary:hover .zq-arrow{ transform:translateY(-50%) translateX(3px); }
  #ziptility-practice .zq-navrow .zq-btn-primary{ order:-1; }
  #ziptility-practice .zq-resume{ flex-direction:column; align-items:stretch; }
}

/* ---------- run screen ---------- */
#ziptility-practice .zq-topbar{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  font-size:14px; color:var(--n600); margin:6px 0 10px; flex-wrap:wrap;
}
#ziptility-practice .zq-progressbar{
  height:8px; background:var(--n200); border-radius:var(--radius-pill);
  overflow:hidden; margin-bottom:16px;
}
#ziptility-practice .zq-progressbar i{
  display:block; height:100%; background:var(--midnight); border-radius:var(--radius-pill);
  transition:width var(--dur-fast) var(--ease);
}
#ziptility-practice .zq-timer{
  font-family:var(--font-ui); font-weight:600;
  font-variant-numeric:tabular-nums; color:var(--midnight);
}
#ziptility-practice .zq-timer.zq-low{ color:var(--danger-fg); }
#ziptility-practice .zq-domchip{
  display:inline-block; background:var(--n100); color:var(--n700);
  border:1px solid var(--n200); border-radius:var(--radius-pill);
  font-family:var(--font-ui); font-weight:600; font-size:12px;
  letter-spacing:.03em; text-transform:uppercase;
  padding:2px 9px;
}
#ziptility-practice .zq-stem{
  font-family:var(--font-sans); font-weight:700; font-size:20px; line-height:1.4;
  color:var(--midnight); margin:10px 0 16px;
}

#ziptility-practice .zq-choices{ display:flex; flex-direction:column; gap:10px; margin:0; padding:0; list-style:none; }
#ziptility-practice .zq-choice{
  display:flex; align-items:flex-start; gap:12px; width:100%; text-align:left;
  font-family:inherit; font-size:16px; line-height:1.5; color:var(--n700);
  background:var(--white); border:2px solid var(--n200); border-radius:var(--radius);
  padding:13px 14px; cursor:pointer;
  transition:border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
}
#ziptility-practice .zq-choice:hover{ border-color:var(--n300); background:var(--n50); }
#ziptility-practice .zq-choice[disabled]{ cursor:default; }
#ziptility-practice .zq-choice.zq-selected{ border-color:var(--tomato); background:var(--tomato-tint); }
#ziptility-practice .zq-choice.zq-correct{ border-color:var(--success); background:var(--success-bg); }
#ziptility-practice .zq-choice.zq-wrong{ border-color:var(--danger); background:var(--danger-bg); }

#ziptility-practice .zq-letter{
  flex:0 0 auto; width:28px; height:28px; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  background:var(--n100); color:var(--midnight);
  font-family:var(--font-ui); font-weight:700; font-size:13px;
  margin-top:-2px;
}
/* Same G1 failure as .zq-btn-primary, found while fixing it (not in the original flagged list):
   white text on raw tomato measures 3.43:1. Not test-pinned, so straight swap to --tomato-press
   (6.07:1) rather than the text-color workaround the pinned button needed. */
#ziptility-practice .zq-choice.zq-selected .zq-letter{ background:var(--tomato-press); color:var(--white); }
/* STATUS-COLOUR AUDIT, 2026-07-29: the DS semantic tokens are tuned to pass as TEXT on their own
   -bg tint, not as a FILL under white text. MEASURED white-on-raw-success(#16a34a) = 3.30:1,
   failing 4.5:1 (raw danger happens to clear it here at 4.83:1, but that is luck, not a rule, and
   is made consistent below anyway). Both letters now use the -fg variant as the fill instead -
   the same darker, text-safe value already used for this exact grade's colour everywhere else on
   the results screen - so "correct"/"wrong" is measurably accessible AND the one dark-fill
   treatment is consistent between the two states, not raw-passes-by-luck vs -fg-because-it-had-to. */
#ziptility-practice .zq-choice.zq-correct .zq-letter{ background:var(--success-fg); color:var(--white); }
#ziptility-practice .zq-choice.zq-wrong .zq-letter{ background:var(--danger-fg); color:var(--white); }

#ziptility-practice .zq-feedback{ border-radius:var(--radius); padding:14px 16px; margin-top:14px; font-size:15px; }
#ziptility-practice .zq-feedback.zq-ok{ background:var(--success-bg); border:1px solid var(--success-border); }
#ziptility-practice .zq-feedback.zq-err{ background:var(--danger-bg); border:1px solid var(--danger-border); }
#ziptility-practice .zq-feedback h4{ margin:0 0 6px; font-size:15px; font-weight:700; }
#ziptility-practice .zq-feedback h4.zq-okt{ color:var(--success-fg); }
#ziptility-practice .zq-feedback h4.zq-errt{ color:var(--danger-fg); }
#ziptility-practice .zq-explain{ margin:0; font-size:15px; line-height:1.6; color:var(--n600); white-space:pre-line; }
#ziptility-practice .zq-formula{
  background:var(--n50); border:1px dashed var(--n300); border-radius:var(--radius-sm);
  font-family:var(--font-ui); font-weight:400; font-size:14px;
  padding:8px 12px; margin-top:10px; overflow-x:auto;
}
#ziptility-practice .zq-cite{ font-family:var(--font-ui); font-weight:500; font-size:12px; color:var(--n500); margin-top:10px; }
#ziptility-practice .zq-minilinks{ margin-top:10px; display:flex; gap:14px; flex-wrap:wrap; }
#ziptility-practice .zq-minilinks a{ font-weight:600; font-size:14px; color:var(--tomato-press); text-decoration:none; }
#ziptility-practice .zq-minilinks a:hover{ text-decoration:underline; }

/* ---------- results ---------- */
/* Fit pass 2026-09-22: this used to set padding:8px 0 2px, which threw away the card's side
   padding, so the note and the three buttons ran edge to edge inside the card. */
#ziptility-practice .zq-score-hero{ text-align:center; }
#ziptility-practice .zq-score-num{
  font-family:var(--font-sans); font-weight:900;
  font-size:clamp(44px,8vw,64px); line-height:1; letter-spacing:-0.02em;
}
#ziptility-practice .zq-score-num.zq-pass{ color:var(--success-fg); }
#ziptility-practice .zq-score-num.zq-fail{ color:var(--danger-fg); }
#ziptility-practice .zq-score-verdict{ font-weight:700; font-size:16px; margin-top:4px; }
#ziptility-practice .zq-score-sub{ font-size:16px; color:var(--n600); margin-top:6px; }
#ziptility-practice .zq-passnote{ font-size:14px; color:var(--n500); margin-top:10px; }

#ziptility-practice .zq-dombars{ margin-top:8px; }
#ziptility-practice .zq-dombar{ margin:10px 0; }
#ziptility-practice .zq-dombar .zq-domlabel{ display:flex; justify-content:space-between; font-size:14px; margin-bottom:4px; }
#ziptility-practice .zq-dombar .zq-domlabel span:first-child{ font-weight:600; color:var(--n700); }
#ziptility-practice .zq-dombar .zq-domlabel span:last-child{ color:var(--n600); }
#ziptility-practice .zq-dombar .zq-track{ height:8px; background:var(--n200); border-radius:var(--radius-pill); overflow:hidden; }
#ziptility-practice .zq-dombar .zq-fill{ display:block; height:100%; border-radius:var(--radius-pill); background:var(--midnight); }
#ziptility-practice .zq-dombar.zq-weak .zq-fill{ background:var(--danger); }

#ziptility-practice .zq-missed details{ background:var(--white); border:1px solid var(--n200); border-radius:var(--radius); margin:10px 0; }
#ziptility-practice .zq-missed summary{
  cursor:pointer; padding:12px 14px; font-weight:600; font-size:16px; color:var(--midnight);
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  list-style:none;
}
#ziptility-practice .zq-missed summary::-webkit-details-marker{ display:none; }
#ziptility-practice .zq-missed summary::after{
  content:"";
  flex:0 0 auto; width:18px; height:18px;
  background-color:var(--tomato);
  -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") center / contain no-repeat;
  mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") center / contain no-repeat;
  transition:transform var(--dur) var(--ease);
}
#ziptility-practice .zq-missed details[open] summary::after{ transform:rotate(180deg); }
#ziptility-practice .zq-missed .zq-missed-body{ padding:0 14px 14px; font-size:14.5px; }
#ziptility-practice .zq-tag-ok{ color:var(--success-fg); font-weight:700; }
#ziptility-practice .zq-tag-err{ color:var(--danger-fg); font-weight:700; }

#ziptility-practice .zq-capture-slot{ /* reserved, ruling 2026-07-10: never rendered visible */ }

#ziptility-practice .zq-history{ font-size:14px; color:var(--n600); }
#ziptility-practice .zq-history table{ border-collapse:collapse; width:100%; margin-top:6px; }
#ziptility-practice .zq-history th{
  text-align:left; padding:5px 8px; font-family:var(--font-ui); font-weight:600;
  font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--n500);
  border-bottom:1px solid var(--n100);
}
#ziptility-practice .zq-history td{
  text-align:left; padding:5px 8px; font-size:14px; color:var(--n600);
  border-bottom:1px solid var(--n100);
}

#ziptility-practice .zq-note{
  background:var(--warm-100); border:1px solid var(--warm-400);
  border-radius:var(--radius); font-size:14px; color:var(--n600);
  padding:12px 16px; margin:18px 0;
}

/* ---------- picker / hub ---------- */
/* SIGNATURE, 2026-07-29 (design pass): a small corner-slash accent on the section heading, the
   brand's own signature device (DS readme \xA76: "Tomato parallelograms (skew ~ -22deg) as corner
   accents on banners and cards. Use 2-4 per layout, anchored to corners."). Used ONCE here, at
   the top of the section, rather than repeated on every card, so the hub still reads as "one
   Tomato accent" and not six competing ones. aria-hidden via ::before/::after: decorative only,
   nothing here is information a screen reader needs. */
#ziptility-practice .zq-hub-section-title{
  position:relative;
  font-family:var(--font-sans); font-weight:900; font-size:20px; color:var(--midnight);
  margin:0 0 16px; padding-left:20px;
}
#ziptility-practice .zq-hub-section-title::before,
#ziptility-practice .zq-hub-section-title::after{
  content:''; position:absolute; left:0; top:3px;
  width:7px; height:16px; background:var(--tomato);
  transform:skewX(-22deg);
}
#ziptility-practice .zq-hub-section-title::after{ left:9px; top:3px; height:10px; opacity:.55; }

#ziptility-practice .zq-hub-grid{ display:grid; grid-template-columns:1fr; gap:1rem; }
@media (min-width:600px){ #ziptility-practice .zq-hub-grid{ grid-template-columns:1fr 1fr; } }

/* The two foundation tests (Operator Math, Regulations - the ones everyone takes regardless of
   discipline) run the full grid width as a wider, calmer surface: Linen instead of white, so the
   page has a second surface family before the discipline cards below it (RHYTHM, 9.7: "distinct
   widths ... surface rhythm"). Kept as a simple full-width block (not a flex row) - this file's
   later, more specific ".zq-hubcard{ display:block }" base rule would otherwise win the cascade
   on source order and silently flatten a flex attempt here back to block, which is exactly what
   happened on the first pass of this fix; simpler and correct beats clever and wrong. */
#ziptility-practice .zq-hubcard-featured{ grid-column:1/-1; background:var(--warm-100); }

/* A labeled break between the two foundation tests and the four discipline tests - a plain grid
   sibling, not another button, so it never touches the .zq-hubcard count any test asserts. */
#ziptility-practice .zq-hub-groupdivider{
  grid-column:1/-1; margin:6px 0 -2px;
  font-family:var(--font-ui); font-weight:700; font-size:12px; text-transform:uppercase;
  letter-spacing:.06em; color:var(--n600);
  padding-top:14px; border-top:1px solid var(--n200);
}

/* Renders as a <button> on the hub (launches in place) and as an <a> in
   childPages mode (routes to /tools/practice/<slug>), so it carries the
   no-underline rule the anchor form needs. */
#ziptility-practice .zq-hubcard{
  display:flex; flex-direction:column; width:100%; text-align:left;
  background:var(--white); border:none; border-radius:var(--radius);
  box-shadow:var(--shadow-sm); padding:18px; cursor:pointer;
  font-family:inherit; color:inherit; text-decoration:none;
  transition:box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}
#ziptility-practice .zq-hubcard:hover{ box-shadow:var(--shadow-md); transform:translateY(-3px); }
/* G1 fix, 2026-07-29: tomato text on white measured 3.43:1, below the 4.5:1 floor. No test pins
   this color (only textContent is checked), so it moves straight to --tomato-press (6.07:1). */
#ziptility-practice .zq-hubcard .zq-eyebrow{
  display:block; font-weight:700; font-size:12px; text-transform:uppercase;
  letter-spacing:.06em; color:var(--tomato-press); margin-bottom:6px;
}
#ziptility-practice .zq-hubcard h3{ margin:0 0 4px; font-weight:700; font-size:20px; line-height:1.25; color:var(--midnight); }
#ziptility-practice .zq-hubcard p{ margin:0; font-size:14px; line-height:1.55; color:var(--n600); }
/* THE SPEC-PLATE STAT (design pass, 2026-07-29): the audit called this hub "a generic, clean card
   list... no visual hook". Per DS 9.11 ("the number is the hero, the label is support"), the
   question count gets a real Geist numeral instead of living only in the 12px meta caption below -
   the same technique src/manager's result gauge now uses, so "a real number, presented like a
   spec" reads as one idea across the tool suite, not just this hub. */
/* margin-top:auto (fit pass 2026-09-22): the card is a flex column, so the number plate sits
   on the same baseline across a row whatever the description length above it. */
#ziptility-practice .zq-hubcard-stat{
  display:flex; align-items:baseline; gap:6px; margin-top:auto; padding-top:14px;
}
#ziptility-practice .zq-hubcard-stat-num{
  font-family:var(--font-ui); font-weight:700; font-size:28px; letter-spacing:-0.01em; color:var(--midnight);
}
#ziptility-practice .zq-hubcard-stat-label{
  font-family:var(--font-ui); font-size:12px; color:var(--n500);
}
#ziptility-practice .zq-hubcard .zq-meta{
  margin-top:8px; font-family:var(--font-ui); font-weight:500; font-size:12px; color:var(--n500);
}

/* ---------- loading / error (new) ---------- */
#ziptility-practice .zq-loading{
  display:flex; align-items:center; gap:12px;
  padding:2rem 0; font-size:14px; color:var(--n600);
}
#ziptility-practice .zq-spinner{
  width:28px; height:28px; border-radius:50%;
  border:3px solid var(--n200); border-top-color:var(--tomato);
  animation:zq-spin 0.7s linear infinite;
}
@keyframes zq-spin{ to{ transform:rotate(360deg); } }
#ziptility-practice .zq-error{
  background:var(--danger-bg); border:1px solid var(--danger-border);
  border-radius:var(--radius); padding:16px; margin:14px 0;
}
#ziptility-practice .zq-error h3{ margin:0 0 6px; font-size:16px; font-weight:700; color:var(--danger-fg); }
#ziptility-practice .zq-error p{ margin:0 0 12px; color:var(--n700); }

/* ---------- a11y + print, scoped ---------- */
@media (prefers-reduced-motion:reduce){
  #ziptility-practice *{ transition:none!important; animation:none!important; }
}
@media print{
  #ziptility-practice .zq-navrow,
  #ziptility-practice .zq-btn{ display:none!important; }
  #ziptility-practice .zq-card{ box-shadow:none; padding:0; }
}

/* WW-01 interim units note (2026-09-16): the same callout family as .zq-note, one line, quieter,
   under the title on the setup screen and under the pass line on the score screen. */
#ziptility-practice .zq-units-note{ margin:10px 0 0; padding:8px 12px; font-size:13px; line-height:1.45; }
#ziptility-practice .zq-score-hero .zq-units-note{ margin:14px auto 0; max-width:560px; text-align:left; }

/* ---------- phone overrides that must follow the base rules above (fit pass 2026-09-22) ----------
   Same specificity as the base .zq-stem / .zq-size rules, so source order decides: these sit
   last on purpose. */
@media (max-width:559px){
  #ziptility-practice .zq-stem{ font-size:18px; line-height:1.35; }
  #ziptility-practice .zq-size{ flex:1 1 calc(50% - 5px); }
}
`;var te={calcUrl:"/tools/calculator",formulaSheetUrl:"/tools/formula-sheets",contactEmail:"sales@ziptility.com",hubUrl:"/tools/practice"};var xe="https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-banks/",V=[{id:"operator-math-1",slug:"operator-math",title:"Operator math practice test",badge:"Operator math \xB7 Levels 1-2 (ABC Class I-II)",discipline:"Operator Math",level:"Levels 1-2 (ABC Class I-II)",description:"Unit conversions, flow, dosing, and the 8.34 pounds formula, worked out in plain English.",questionCount:110,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"regulations-1",slug:"regulations",title:"Water and wastewater regulations practice test (federal)",badge:"Federal regulations \xB7 Entry to working level",discipline:"Regulations (Federal)",level:"Entry to working level (ABC Class I-II)",description:"The federal rules an operator answers to: the Safe Drinking Water Act, the Clean Water Act, monitoring and reporting, public notice, and recordkeeping. Every answer carries a citation.",questionCount:103,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wd-1",slug:"water-distribution",title:"Water distribution operator practice test, Class I",badge:"Water distribution \xB7 Class I entry level",discipline:"Water Distribution",level:"Entry level (ABC Class I)",description:"Mains, valves, hydrants, storage, pumps, cross-connection control, flushing, sampling, and crew safety. Machine-checked math and cited answers.",questionCount:125,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"wwc-1",slug:"wastewater-collection",title:"Wastewater collection operator practice test, Class I",badge:"Wastewater collection \xB7 Class I entry level",discipline:"Wastewater Collections",level:"Entry level (ABC Class I)",description:"Gravity mains, manholes, lift stations, cleaning and CCTV, infiltration and inflow, SSO response, and confined-space and trench safety. Cited answers throughout.",questionCount:120,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"wt-1",slug:"water-treatment",title:"Water treatment operator practice test, Class I",badge:"Water treatment \xB7 Class I entry level",discipline:"Water Treatment",level:"Entry level (ABC Class I)",description:"Coagulation and jar testing, sedimentation, filtration, disinfection and CT, source water, plant pumps and chemical feeders, lab work, and chlorine safety. Machine-checked math and cited answers.",questionCount:128,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"wwt-1",slug:"wastewater-treatment",title:"Wastewater treatment operator practice test, Class I",badge:"Wastewater treatment \xB7 Class I entry level",discipline:"Wastewater Treatment",level:"Entry level (ABC Class I)",description:"Preliminary and primary treatment, activated sludge, clarifiers, trickling filters and lagoons, disinfection, solids handling, blowers and clarifier drives, lab work, and H2S and confined-space safety. Cited answers throughout.",questionCount:119,durationMin:120,refCount:100,bankVersion:"1.1.0"}];function He(e){let t=new Set,n=new Set;for(let a of e){if(!a||!a.id)throw new Error("practice manifest: entry missing id");if(t.has(a.id))throw new Error('practice manifest: duplicate id "'+a.id+'"');if(t.add(a.id),!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug||""))throw new Error('practice manifest: "'+a.id+'" has a missing or non-kebab-case slug');if(n.has(a.slug))throw new Error('practice manifest: duplicate slug "'+a.slug+'"');if(n.add(a.slug),!a.title||!a.badge||!a.discipline||!a.level||!a.description)throw new Error('practice manifest: "'+a.id+'" is missing a required label field');if(!Number.isInteger(a.questionCount)||a.questionCount<=0)throw new Error('practice manifest: "'+a.id+'" has a bad questionCount');if(!Number.isInteger(a.durationMin)||a.durationMin<=0)throw new Error('practice manifest: "'+a.id+'" has a bad durationMin');if(!Number.isInteger(a.refCount)||a.refCount<=0)throw new Error('practice manifest: "'+a.id+'" has a bad refCount');if(!/^\d+\.\d+\.\d+$/.test(a.bankVersion||""))throw new Error('practice manifest: "'+a.id+'" has a malformed bankVersion')}for(let a of e)if(t.has(a.slug)&&a.slug!==a.id)throw new Error('practice manifest: slug "'+a.slug+'" collides with another test id');return!0}He(V);var ie=new Map;async function qe(e,t,n){let a=e+"-v"+t;if(ie.has(a))return ie.get(a);let c=n+a+".json",h=new AbortController,w=setTimeout(()=>h.abort(),1e4),u;try{u=await fetch(c,{signal:h.signal})}finally{clearTimeout(w)}if(!u.ok)throw new Error("practice bank fetch failed: "+c+" ("+u.status+")");let f=await u.json();return ie.set(a,f),f}function C(e,t,n){let a=document.createElement(e);return t&&(a.className=t),n!=null&&(a.textContent=n),a}function re(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var Fe=new Set(["operator-math-1","regulations-1"]);function Ce(e,{onSelect:t,childPages:n=!1,hubUrl:a="/tools/practice"}){re(e),e.appendChild(C("h2","zq-hub-section-title","Pick your test"));let c=String(a).replace(/\/+$/,""),h=C("div","zq-hub-grid"),w=!1;V.forEach(u=>{let f=Fe.has(u.id);!f&&!w&&(h.appendChild(C("div","zq-hub-groupdivider","By discipline")),w=!0);let v=C(n?"a":"button","zq-hubcard"+(f?" zq-hubcard-featured":""));n?v.href=c+"/"+u.slug:v.type="button",v.appendChild(C("span","zq-eyebrow",u.discipline)),v.appendChild(C("h3",null,u.title)),v.appendChild(C("p",null,u.description||""));let m=C("div","zq-hubcard-stat");m.appendChild(C("span","zq-hubcard-stat-num",String(u.questionCount))),m.appendChild(C("span","zq-hubcard-stat-label","questions in the bank")),v.appendChild(m),v.appendChild(C("div","zq-meta","Practice or timed exam")),n||v.addEventListener("click",()=>t(u)),h.appendChild(v)}),e.appendChild(h)}function ke(e){re(e);let t=C("div","zq-loading");t.appendChild(C("span","zq-spinner")),t.appendChild(C("span",null,"Loading questions\u2026")),e.appendChild(t)}function ne(e,{message:t,onRetry:n,hubUrl:a}){re(e);let c=C("div","zq-error");if(c.setAttribute("role","alert"),c.appendChild(C("h3",null,"Could not load this test")),c.appendChild(C("p",null,t||"The question set did not load. Check your connection and try again.")),n){let h=C("button","zq-btn zq-btn-secondary","Try again");h.type="button",h.addEventListener("click",n),c.appendChild(h)}if(a){let h=C("a","zq-btn zq-btn-secondary","All practice tests");h.href=a,c.appendChild(h)}e.appendChild(c)}function F(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1)),a=e[t];e[t]=e[n],e[n]=a}return e}function ae(e){let t=Math.floor(e/60),n=e%60;return t+":"+(n<10?"0":"")+n}function Se(e){let t=[],n=[25,50,100];for(let a of n)a<e&&t.push(a);return t.push(e),t}function oe(e,t,n,a){let c=t||n;return Math.max(10,Math.round((a||120)*e/c))}function Ee(e,t,n){let a=new Set(t||[]),c=[],h=[];for(let u of e)(a.has(u.id)?h:c).push(u);F(c),F(h);let w=c.concat(h).slice(0,n);return F(w),w.map(u=>{let f=F([0,1,2,3]);return{q:u,order:f,correctPos:f.indexOf(u.correctIndex)}})}function Te(e,t){let n=e.length,a=0,c={},h=[];for(let u=0;u<n;u++){let f=e[u],v=f.q.domain||"General";c[v]||(c[v]={n:0,ok:0}),c[v].n+=1;let m=u in t?t[u]:null;m===f.correctPos?(a+=1,c[v].ok+=1):h.push({item:f,sel:m})}let w=Math.round(100*a/n);return{correct:a,n,pct:w,byDomain:c,missed:h}}function Ie(e){return Object.keys(e).sort((t,n)=>e[t].ok/e[t].n-e[n].ok/e[n].n)}var Ke="tool_complete",Qe="tool_progress";function Ae(e){try{if(typeof window>"u")return;window.dataLayer=window.dataLayer||[],window.dataLayer.push(e)}catch{}}function se(e,t){if(!e)return;let n={event:Ke,tool_name:String(e)};t&&typeof t=="object"&&Object.keys(t).forEach(a=>{let c=t[a];c==null||c===""||typeof c!="object"&&(n["tool_"+a]=typeof c=="number"?c:String(c))}),Ae(n)}function Me(e,t,n){!e||!n||Ae({event:Qe,tool_name:String(e),tool_answered:Number(t),tool_total:Number(n),tool_percent:Math.round(Number(t)/Number(n)*100)})}function ce(e){let t={},n=(e||[25,50,75]).slice().sort((a,c)=>a-c);return function(c,h){if(!h)return null;let w=c/h*100;for(let u=n.length-1;u>=0;u--){let f=n[u];if(w>=f&&!t[f])return t[f]=!0,f}return null}}var Xe="zip-units";var K=null;function Je(e){return e==="metric"?"metric":"imperial"}function Q(){if(K)return K;let e=null;try{e=window.localStorage.getItem(Xe)}catch{e=null}return K=Je(e),K}var le={MATH:"Operator math",CHEM:"Chemistry",MICRO:"Microbiology",REGS:"Regulations",SAMP:"Sampling",SAFE:"Safety",PROC:"Process control",EQIP:"Equipment",ADMIN:"Administration",Multiple:"Mixed topics"};function $e(e){try{return window.localStorage.getItem(e)}catch{return null}}function de(e,t){try{window.localStorage.setItem(e,t)}catch{}}function Ze(e){try{window.localStorage.removeItem(e)}catch{}}function G(e){let t=$e(e);if(!t)return null;try{return JSON.parse(t)}catch{return null}}function r(e,t,n){let a=document.createElement(e);return t&&(a.className=t),n!=null&&(a.textContent=n),a}function Y(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var et='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';function O(e,t,{arrow:n=!1}={}){let a=r("button",t);a.type="button";let c=r("span","zq-btn-label",e);if(a.appendChild(c),n){let h=document.createElement("span");h.className="zq-arrow",h.innerHTML=et,a.appendChild(h)}return a}function tt(e,t){let n=e.querySelector(".zq-btn-label");n&&(n.textContent=t)}function Le(e,t,n,{onExit:a}={}){let c="zpt-pt-session-"+t.id,h="zpt-pt-history-"+t.id,w="zpt-pt-seen-"+t.id,u={};for(let i of t.questions)u[i.id]=i;Y(e);let f=r("div"),v=r("div","zq-visually-hidden");v.setAttribute("aria-live","polite"),e.appendChild(f),e.appendChild(v);function m(i){v.textContent=i}let S=!1;function L(){try{e.scrollIntoView({block:"start"})}catch{}}let o=null,X="practice-"+(n.slug||t.id),J=ce([25,50,75]);function pe(i,l){if(J=ce([25,50,75]),i>0)for(let s=0;s<4&&J(i,l);s++);}function Be(){try{let i=Object.keys(o.answers).length;J(i,o.qs.length)&&Me(X,i,o.qs.length)}catch{}}let T={mode:"practice",size:null};function _(){o&&de(c,JSON.stringify({v:1,bankVersion:t.version||"",mode:o.mode,size:o.size,qids:o.qs.map(i=>i.q.id),system:t.variants&&t.variants.system||"imperial",orders:o.qs.map(i=>i.order),answers:o.answers,checked:o.checked,idx:o.idx,remainingSec:o.remainingSec}))}function Pe(){let i=G(c);if(!i||i.v!==1||i.bankVersion!==(t.version||"")||!i.qids||!i.qids.length||(i.system||"imperial")!==(t.variants&&t.variants.system||"imperial"))return null;for(let l of i.qids)if(!u[l])return null;return i}function $(){Ze(c)}function Re(i){let l=G(h)||[];l.unshift(i),l.length>25&&(l=l.slice(0,25)),de(h,JSON.stringify(l))}function De(i){let s=(G(w)||[]).concat(i);s.length>600&&(s=s.slice(s.length-600)),de(w,JSON.stringify(s))}function ue(i){let l=Q()==="metric",s=t.variants||{total:0,withSi:0},z;return i==="results"&&l&&s.withSi>0?z="Your calculator is set to metric; questions with a metric version showed it, the rest used US customary exam-sheet units.":l?s.withSi>0&&s.withSi>=s.total?z="Shown in metric (SI) units, to match your calculator. Switch the calculator to US customary to practise in exam-sheet units.":s.withSi>0?z="Your calculator is set to metric. "+s.withSi+" of "+s.total+" questions here have a metric version and show it; the rest still use US customary exam-sheet units (gallons, feet, MGD, lb/day).":z="Your calculator is set to metric. These practice questions still use US customary exam-sheet units (gallons, feet, MGD, lb/day), the way the exam sheet does. Metric question sets follow.":z="Math questions use US customary exam-sheet units (gallons, feet, MGD, lb/day), the way the exam sheet does.",r("p","zq-note zq-units-note",z)}function Z(){H(),o=null,Y(f),S&&L(),S=!0;let i=r("div");i.appendChild(r("span","zq-badge",n.badge||t.discipline||"")),i.appendChild(r("h2","zq-title",n.title||t.title)),i.appendChild(ue()),f.appendChild(i);let l=Pe();if(l){let p=r("div","zq-resume"),g=r("div");g.appendChild(r("strong",null,"You have a test in progress. ")),g.appendChild(document.createTextNode((l.mode==="exam"?"Timed exam":"Practice")+", question "+(l.idx+1)+" of "+l.qids.length+".")),p.appendChild(g);let b=r("div","zq-navrow"),d=O("Resume","zq-btn zq-btn-primary",{arrow:!0});d.addEventListener("click",()=>_e(l));let E=O("Discard","zq-btn zq-btn-quiet");E.addEventListener("click",()=>{$(),Z()}),b.appendChild(d),b.appendChild(E),p.appendChild(b),f.appendChild(p)}let s=r("div","zq-card");s.appendChild(r("h2",null,"Set up your test"));let z=r("div","zq-mode-grid"),x=[{id:"practice",name:"Practice",desc:"Check each answer as you go. Every question shows a plain-English explanation."},{id:"exam",name:"Timed exam",desc:"No feedback until the end, with a clock running. The closest thing to test day."}],q={};x.forEach(p=>{let g=r("button","zq-mode"+(T.mode===p.id?" zq-selected":""));g.type="button",g.appendChild(r("h3",null,p.name)),g.appendChild(r("p",null,p.desc)),g.addEventListener("click",()=>{T.mode=p.id;for(let b in q)q[b].classList.toggle("zq-selected",b===p.id);A()}),q[p.id]=g,z.appendChild(g)}),s.appendChild(z);let y=Se(t.questions.length);(T.size===null||y.indexOf(T.size)===-1)&&(T.size=y[0]);let B=r("div","zq-size-row"),P={};y.forEach(p=>{let g=r("button","zq-size"+(T.size===p?" zq-selected":""));g.type="button",g.appendChild(document.createTextNode(p===t.questions.length&&y.length>1?"All "+p:String(p))),g.appendChild(r("small",null,"questions")),g.addEventListener("click",()=>{T.size=p;for(let b in P)P[b].classList.toggle("zq-selected",Number(b)===p);A()}),P[p]=g,B.appendChild(g)}),s.appendChild(B);let N=r("div","zq-navrow"),D=O("","zq-btn zq-btn-primary",{arrow:!0});D.addEventListener("click",()=>he(T.mode,T.size)),N.appendChild(D),s.appendChild(N),f.appendChild(s);function A(){tt(D,T.mode==="exam"?"Start timed exam ("+T.size+" questions, "+oe(T.size,t.refCount,t.questions.length,t.durationMin)+" min)":"Start practice ("+T.size+" questions)")}A();let I=G(h)||[];if(I.length){let p=0;for(let g of I)g.scorePct>p&&(p=g.scorePct);f.appendChild(r("p","zq-best","Your best score on this test so far: "+p+" percent. Attempts: "+I.length+"."))}}function he(i,l){$();let s=G(w)||[];o={mode:i,size:l,qs:Ee(t.questions,s,l),idx:0,answers:{},checked:{},remainingSec:i==="exam"?oe(l,t.refCount,t.questions.length,t.durationMin)*60:0,timerId:null},_(),pe(0,o.qs.length),i==="exam"&&me(),U()}function _e(i){o={mode:i.mode,size:i.size,qs:i.qids.map((l,s)=>{let z=u[l],x=i.orders[s];return{q:z,order:x,correctPos:x.indexOf(z.correctIndex)}}),idx:i.idx||0,answers:i.answers||{},checked:i.checked||{},remainingSec:i.remainingSec||0,timerId:null},pe(Object.keys(o.answers).length,o.qs.length),o.mode==="exam"&&me(),U()}function fe(){let i=e.querySelector(".zq-timer");i&&(i.textContent=ae(Math.max(0,o.remainingSec)),i.classList.toggle("zq-low",o.remainingSec<=120)),o.remainingSec%15===0&&_(),o.remainingSec<=0&&(m("Time is up. Scoring your exam."),ee())}function me(){H(),o.timerId=setInterval(()=>{o.remainingSec-=1,fe()},1e3)}function H(){o&&o.timerId&&(clearInterval(o.timerId),o.timerId=null)}function U(){Y(f);let i=o.qs[o.idx],l=i.q,s=o.qs.length,z=!!o.checked[o.idx],x=o.idx in o.answers?o.answers[o.idx]:null,q=r("div","zq-topbar"),y=r("div");if(y.appendChild(document.createTextNode("Question "+(o.idx+1)+" of "+s+"  ")),y.appendChild(r("span","zq-domchip",le[l.domain]||l.domain||"General")),q.appendChild(y),o.mode==="exam"){let p=r("span","zq-timer",ae(Math.max(0,o.remainingSec)));o.remainingSec<=120&&p.classList.add("zq-low"),q.appendChild(p)}f.appendChild(q);let B=r("div","zq-progressbar"),P=r("i");P.style.width=Math.round(100*(o.idx+1)/s)+"%",B.appendChild(P),f.appendChild(B);let N=r("div","zq-card");N.appendChild(r("div","zq-stem",l.text));let D=r("ul","zq-choices"),A=["A","B","C","D"];i.order.forEach((p,g)=>{let b=r("li"),d=r("button","zq-choice");d.type="button",d.appendChild(r("span","zq-letter",A[g])),d.appendChild(r("span",null,l.choices[p])),x===g&&d.classList.add("zq-selected"),z?(d.disabled=!0,g===i.correctPos?(d.classList.remove("zq-selected"),d.classList.add("zq-correct")):x===g&&(d.classList.remove("zq-selected"),d.classList.add("zq-wrong"))):d.addEventListener("click",()=>ge(g)),b.appendChild(d),D.appendChild(b)}),N.appendChild(D),z&&N.appendChild(Ue(i,x));let I=r("div","zq-navrow");if(o.mode==="exam"){let p=O("Previous","zq-btn zq-btn-quiet");if(p.disabled=o.idx===0,p.addEventListener("click",()=>{o.idx-=1,_(),U()}),I.appendChild(p),I.appendChild(r("span","zq-spacer")),o.idx<s-1){let d=O("Next","zq-btn zq-btn-primary",{arrow:!0});d.addEventListener("click",()=>{o.idx+=1,_(),U()}),I.appendChild(d)}let g=0;for(let d in o.answers)o.answers[d]!==null&&g++;let b=O("Submit ("+g+"/"+s+" answered)",o.idx===s-1?"zq-btn zq-btn-primary":"zq-btn zq-btn-secondary");b.addEventListener("click",()=>{g<s&&!window.confirm("You have unanswered questions. Submit anyway?")||ee()}),I.appendChild(b)}else if(I.appendChild(r("span","zq-spacer")),z){let p=O(o.idx<s-1?"Next question":"See your score","zq-btn zq-btn-primary",{arrow:!0});p.setAttribute("data-zq-next",""),p.addEventListener("click",()=>{o.idx<s-1?(o.idx+=1,_(),U()):ee()}),I.appendChild(p)}else{let p=O("Check answer","zq-btn zq-btn-primary");p.setAttribute("data-zq-check",""),p.disabled=x===null,p.addEventListener("click",ze),I.appendChild(p)}N.appendChild(I),f.appendChild(N),L(),S=!0}function ge(i){o.answers[o.idx]=i,_(),Be(),U()}function ze(){if(!(o.idx in o.answers))return;o.checked[o.idx]=!0,_();let i=o.qs[o.idx];m(o.answers[o.idx]===i.correctPos?"Correct.":"Not quite. The explanation is shown below."),U()}function Ue(i,l){let s=i.q,z=l===i.correctPos,x=r("div","zq-feedback "+(z?"zq-ok":"zq-err"));x.appendChild(r("h4",z?"zq-okt":"zq-errt",z?"Correct":"Not quite")),s.explanation&&x.appendChild(r("p","zq-explain",s.explanation)),s.formula&&x.appendChild(r("div","zq-formula",s.formula)),s.citation&&x.appendChild(r("div","zq-cite","Source: "+s.citation));let q=r("div","zq-minilinks");if(s.calculator&&n.calcUrl){let y=r("a",null,"Run this math in the Operator Calculator");y.href=n.calcUrl+"#"+s.calculator,y.target="_blank",y.rel="noopener",q.appendChild(y)}if(n.contactEmail){let y=r("a",null,"Report a problem with this question");y.href="mailto:"+n.contactEmail+"?subject="+encodeURIComponent("Practice test question "+s.id),q.appendChild(y)}return q.childNodes.length&&x.appendChild(q),x}function ee(){H();let{correct:i,n:l,pct:s,byDomain:z,missed:x}=Te(o.qs,o.answers);if(!o.completeSent){o.completeSent=!0;try{let q=(G(h)||[]).length;se(X,{mode:o.mode,size:l,score_pct:s,passed:s>=70?"yes":"no",attempt:q+1,deep_linked:n.deepLinked?"yes":"no"})}catch{se(X)}}Re({date:new Date().toISOString().slice(0,10),mode:o.mode,size:l,scorePct:s}),De(o.qs.map(q=>q.q.id)),$(),je(s,i,l,z,x)}function je(i,l,s,z,x){Y(f),L();let q=i>=70,y=r("div","zq-card zq-score-hero");y.appendChild(r("div","zq-score-num "+(q?"zq-pass":"zq-fail"),i+"%")),y.appendChild(r("div","zq-score-verdict "+(q?"zq-tag-ok":"zq-tag-err"),q?"Pass at the 70 percent line":"Below the 70 percent line")),y.appendChild(r("div","zq-score-sub",l+" of "+s+" correct"+(o.mode==="exam"?" on a timed exam":""))),y.appendChild(r("p","zq-passnote","Most states set the pass line at 70 percent. Your state's rules govern, so check your certification program for the real requirement.")),y.appendChild(ue("results")),m("You scored "+i+" percent, "+l+" of "+s+" correct. "+(q?"That clears the 70 percent line.":"That is below the 70 percent line."));let B=r("div","zq-navrow zq-navrow-center"),P=O("Take it again (new draw)","zq-btn zq-btn-primary",{arrow:!0});P.addEventListener("click",()=>he(o.mode,s));let N=O("Change setup","zq-btn zq-btn-secondary");N.addEventListener("click",Z);let D=n.deepLinked&&n.hubUrl,A;if(D?(A=r("a","zq-btn zq-btn-quiet"),A.href=n.hubUrl,A.appendChild(r("span","zq-btn-label","All practice tests"))):(A=O("All practice tests","zq-btn zq-btn-quiet"),A.addEventListener("click",()=>{a&&a()})),B.appendChild(P),B.appendChild(N),B.appendChild(A),y.appendChild(B),f.appendChild(y),Object.keys(z).length>1){let b=r("div","zq-card zq-dombars");b.appendChild(r("h3",null,"Where you stand by topic")),Ie(z).forEach(d=>{let E=z[d],k=Math.round(100*E.ok/E.n),M=r("div","zq-dombar"+(k<70?" zq-weak":"")),j=r("div","zq-domlabel");j.appendChild(r("span",null,le[d]||d)),j.appendChild(r("span",null,E.ok+"/"+E.n+" ("+k+"%)")),M.appendChild(j);let R=r("div","zq-track"),ye=r("span","zq-fill");ye.style.width=k+"%",R.appendChild(ye),M.appendChild(R),b.appendChild(M)}),f.appendChild(b)}if(x.length){let b=r("div","zq-card zq-missed");b.appendChild(r("h3",null,"Review what you missed ("+x.length+")")),x.forEach(d=>{let E=r("details");E.appendChild(r("summary",null,d.item.q.text));let k=r("div","zq-missed-body"),M=["A","B","C","D"];if(d.sel!==null&&d.sel!==void 0){let R=r("p");R.appendChild(r("span","zq-tag-err","Your answer: ")),R.appendChild(document.createTextNode(M[d.sel]+". "+d.item.q.choices[d.item.order[d.sel]])),k.appendChild(R)}else{let R=r("p");R.appendChild(r("span","zq-tag-err","Skipped.")),k.appendChild(R)}let j=r("p");j.appendChild(r("span","zq-tag-ok","Correct answer: ")),j.appendChild(document.createTextNode(M[d.item.correctPos]+". "+d.item.q.choices[d.item.q.correctIndex])),k.appendChild(j),d.item.q.explanation&&k.appendChild(r("p","zq-explain",d.item.q.explanation)),d.item.q.formula&&k.appendChild(r("div","zq-formula",d.item.q.formula)),d.item.q.citation&&k.appendChild(r("div","zq-cite","Source: "+d.item.q.citation)),E.appendChild(k),b.appendChild(E)}),f.appendChild(b)}let p=r("div","zq-capture-slot");p.hidden=!0,f.appendChild(document.createComment(" soft-capture slot: reserved, ruling 2026-07-10 ")),f.appendChild(p);let g=G(h)||[];if(g.length>1){let b=r("div","zq-card zq-history");b.appendChild(r("h3",null,"Your attempts on this test"));let d=r("table"),E=r("tr");["Date","Mode","Questions","Score"].forEach(k=>E.appendChild(r("th",null,k))),d.appendChild(E),g.slice(0,8).forEach(k=>{let M=r("tr");M.appendChild(r("td",null,k.date)),M.appendChild(r("td",null,k.mode==="exam"?"Timed":"Practice")),M.appendChild(r("td",null,String(k.size))),M.appendChild(r("td",null,k.scorePct+"%")),d.appendChild(M)}),b.appendChild(d),f.appendChild(b)}}let be=!0,W=null;typeof IntersectionObserver=="function"&&(W=new IntersectionObserver(i=>{for(let l of i)be=l.isIntersecting},{threshold:0}),W.observe(e));function Ge(){if(W)return be;let i=e.getBoundingClientRect(),l=window.innerHeight||document.documentElement.clientHeight,s=window.innerWidth||document.documentElement.clientWidth;return i.bottom>0&&i.top<l&&i.right>0&&i.left<s}function we(i){if(!o||i.target&&(i.target.tagName==="INPUT"||i.target.tagName==="TEXTAREA")||!Ge())return;let l=i.key;if(l>="1"&&l<="4"){let s=Number(l)-1;o.checked[o.idx]||(ge(s),i.preventDefault())}else if(l==="Enter"){let s=e.querySelector("[data-zq-check]"),z=e.querySelector("[data-zq-next]");s&&!s.disabled?(ze(),i.preventDefault()):z&&(z.click(),i.preventDefault())}}document.addEventListener("keydown",we);function We(){H(),W&&W.disconnect(),document.removeEventListener("keydown",we),Y(e)}function Ve(i){o&&(o.remainingSec=i,fe())}return Z(),{destroy:We,__debugSetRemainingSec:Ve}}function it(e,t){if(t!=="metric"||!e||!e.si)return e;let n=e.si;return Object.assign({},e,{text:n.text,choices:n.choices,correctIndex:n.correctIndex,explanation:n.explanation,formula:n.formula==null?e.formula:n.formula,unitSystem:"metric"})}function Ne(e,t){let n=(e.questions||[]).map(c=>it(c,t)),a=(e.questions||[]).filter(c=>c&&c.si).length;return Object.assign({},e,{questions:n,variants:{system:t,total:n.length,withSi:a}})}function Oe(){let e=document.getElementById("ziptility-practice");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zpt-practice-styles")){let m=document.createElement("style");m.id="zpt-practice-styles",m.textContent=ve,document.head.appendChild(m)}if(!document.getElementById("zpt-practice-fonts")){let m=document.createElement("link");m.rel="preconnect",m.href="https://fonts.googleapis.com";let S=document.createElement("link");S.rel="preconnect",S.href="https://fonts.gstatic.com",S.crossOrigin="anonymous";let L=document.createElement("link");L.id="zpt-practice-fonts",L.rel="stylesheet",L.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(m,S,L)}let t=!1,n=null;try{let m=new URLSearchParams(window.location.search);t=m.get("embed")==="app",n=m.get("test")}catch{}t||(t=e.dataset.embed==="app"),n||(n=e.dataset.test||null),t&&e.classList.add("zq-embed-app");let a=e.dataset.childPages==="1",c=e.dataset.bankBase||xe,h=e.dataset.hubUrl||te.hubUrl;e.innerHTML="";let w=document.createElement("div");w.className="zq-wrap",e.appendChild(w);let u=null;function f(){let m=!!u;if(u&&(u.destroy(),u=null),Ce(w,{onSelect:v,childPages:a,hubUrl:h}),m)try{w.scrollIntoView({block:"start"})}catch{}}function v(m,S){if(ke(w),!S)try{w.scrollIntoView({block:"start"})}catch{}qe(m.id,m.bankVersion,c).then(L=>{let o={...te,embedApp:t,hubUrl:h,title:m.title,badge:m.badge,deepLinked:!!S,slug:m.slug};u=Le(w,Ne(L,Q()),o,{onExit:S?null:f}),e.dataset.debug==="1"&&(e.__zqDebug=u)}).catch(()=>{ne(w,{message:'Could not load "'+m.title+'." Check your connection and try again.',onRetry:()=>v(m,S)})})}if(n){let m=V.find(S=>S.slug===n||S.id===n);m?v(m,!0):ne(w,{message:'This practice test is not available at "'+n+'." Pick a test from the full list instead.',hubUrl:h})}else f()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Oe):Oe();})();
