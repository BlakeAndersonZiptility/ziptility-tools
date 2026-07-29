/* Ziptility Practice Tests practice-v1.5.0 (0b5ad900053a23e23d95d5024a99081c1ec1b154) — https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var pe=`/* Ziptility practice tests: DS 4.0 reskin, ported from
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
  background:var(--n50);
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

/* G1 fix, 2026-07-29: white text on raw tomato measured 3.43:1 (WCAG relative-luminance formula),
   below the 4.5:1 floor (design-audit G1; canon cites the same failure at ~3.4:1). This button's
   fill is pinned to raw tomato by tests/practice-browser.test.js:412 (\`.zq-btn-primary\`
   backgroundColor === rgb(255, 68, 47)) \u2014 outside this fix's permitted scope (src/ui,
   src/practice only) \u2014 so the fill stays and the TEXT flips dark instead. MEASURED
   var(--midnight) on #ff442f = 4.88:1, clearing the floor. Navy/midnight-on-tomato is also the
   exact pairing the logo-contrast table already sanctions, so this is not an invented combo. The
   arrow icon uses stroke="currentColor" (quiz-engine.js ARROW_PATH) so it follows the same color
   automatically. */
#ziptility-practice .zq-btn-primary{
  background:var(--tomato); color:var(--midnight);
  padding:1.15rem 2.4rem; font-size:20px;
}
/* Hover previously swapped to --tomato-press (#c02100): with midnight text that measures only
   ~2.8:1, a real regression. Darkening further only makes it worse (midnight is already very
   dark, so a darker background shrinks the gap). Fill stays pinned to raw tomato in every state
   instead, and hover reads via a shadow lift, matching DESIGN_SYSTEM_HANDOFF.md \xA74's "Hover =
   ... shadow lift" and this file's own --shadow-md token. */
#ziptility-practice .zq-btn-primary:hover{ box-shadow:var(--shadow-md); }
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
  font-family:inherit; font-size:16px; line-height:1.5; color:var(--n600);
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
  flex:0 0 auto; width:26px; height:26px; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  background:var(--n100); color:var(--n600);
  font-family:var(--font-ui); font-weight:600; font-size:13px;
  margin-top:1px;
}
/* Same G1 failure as .zq-btn-primary, found while fixing it (not in the original flagged list):
   white text on raw tomato measures 3.43:1. Not test-pinned, so straight swap to --tomato-press
   (6.07:1) rather than the text-color workaround the pinned button needed. */
#ziptility-practice .zq-choice.zq-selected .zq-letter{ background:var(--tomato-press); color:var(--white); }
#ziptility-practice .zq-choice.zq-correct .zq-letter{ background:var(--success); color:var(--white); }
#ziptility-practice .zq-choice.zq-wrong .zq-letter{ background:var(--danger); color:var(--white); }

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
#ziptility-practice .zq-score-hero{ text-align:center; padding:8px 0 2px; }
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
#ziptility-practice .zq-hub-section-title{
  font-family:var(--font-sans); font-weight:900; font-size:20px; color:var(--midnight); margin:0 0 12px;
}
#ziptility-practice .zq-hub-grid{ display:grid; grid-template-columns:1fr; gap:1rem; }
@media (min-width:600px){ #ziptility-practice .zq-hub-grid{ grid-template-columns:1fr 1fr; } }
/* Renders as a <button> on the hub (launches in place) and as an <a> in
   childPages mode (routes to /tools/practice/<slug>), so it carries the
   no-underline rule the anchor form needs. */
#ziptility-practice .zq-hubcard{
  display:block; width:100%; text-align:left;
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
#ziptility-practice .zq-hubcard .zq-meta{
  margin-top:10px; font-family:var(--font-ui); font-weight:500; font-size:12px; color:var(--n500);
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
`;var K={calcUrl:"/tools/calculator",formulaSheetUrl:"/tools/formula-sheets",contactEmail:"sales@ziptility.com",hubUrl:"/tools/practice"};var ue="https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-banks/",U=[{id:"operator-math-1",slug:"operator-math",title:"Operator math practice test",badge:"Operator math \xB7 Levels 1-2 (ABC Class I-II)",discipline:"Operator Math",level:"Levels 1-2 (ABC Class I-II)",description:"Unit conversions, flow, dosing, and the 8.34 pounds formula, worked out in plain English.",questionCount:110,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"regulations-1",slug:"regulations",title:"Water and wastewater regulations practice test (federal)",badge:"Federal regulations \xB7 Entry to working level",discipline:"Regulations (Federal)",level:"Entry to working level (ABC Class I-II)",description:"The federal rules an operator answers to: the Safe Drinking Water Act, the Clean Water Act, monitoring and reporting, public notice, and recordkeeping. Every answer carries a citation.",questionCount:103,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wd-1",slug:"water-distribution",title:"Water distribution operator practice test, Class I",badge:"Water distribution \xB7 Class I entry level",discipline:"Water Distribution",level:"Entry level (ABC Class I)",description:"Mains, valves, hydrants, storage, pumps, cross-connection control, flushing, sampling, and crew safety. Machine-checked math and cited answers.",questionCount:125,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wwc-1",slug:"wastewater-collection",title:"Wastewater collection operator practice test, Class I",badge:"Wastewater collection \xB7 Class I entry level",discipline:"Wastewater Collections",level:"Entry level (ABC Class I)",description:"Gravity mains, manholes, lift stations, cleaning and CCTV, infiltration and inflow, SSO response, and confined-space and trench safety. Cited answers throughout.",questionCount:120,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wt-1",slug:"water-treatment",title:"Water treatment operator practice test, Class I",badge:"Water treatment \xB7 Class I entry level",discipline:"Water Treatment",level:"Entry level (ABC Class I)",description:"Coagulation and jar testing, sedimentation, filtration, disinfection and CT, source water, plant pumps and chemical feeders, lab work, and chlorine safety. Machine-checked math and cited answers.",questionCount:128,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wwt-1",slug:"wastewater-treatment",title:"Wastewater treatment operator practice test, Class I",badge:"Wastewater treatment \xB7 Class I entry level",discipline:"Wastewater Treatment",level:"Entry level (ABC Class I)",description:"Preliminary and primary treatment, activated sludge, clarifiers, trickling filters and lagoons, disinfection, solids handling, blowers and clarifier drives, lab work, and H2S and confined-space safety. Cited answers throughout.",questionCount:119,durationMin:120,refCount:100,bankVersion:"1.0.0"}];function Me(e){let r=new Set,o=new Set;for(let a of e){if(!a||!a.id)throw new Error("practice manifest: entry missing id");if(r.has(a.id))throw new Error('practice manifest: duplicate id "'+a.id+'"');if(r.add(a.id),!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug||""))throw new Error('practice manifest: "'+a.id+'" has a missing or non-kebab-case slug');if(o.has(a.slug))throw new Error('practice manifest: duplicate slug "'+a.slug+'"');if(o.add(a.slug),!a.title||!a.badge||!a.discipline||!a.level||!a.description)throw new Error('practice manifest: "'+a.id+'" is missing a required label field');if(!Number.isInteger(a.questionCount)||a.questionCount<=0)throw new Error('practice manifest: "'+a.id+'" has a bad questionCount');if(!Number.isInteger(a.durationMin)||a.durationMin<=0)throw new Error('practice manifest: "'+a.id+'" has a bad durationMin');if(!Number.isInteger(a.refCount)||a.refCount<=0)throw new Error('practice manifest: "'+a.id+'" has a bad refCount');if(!/^\d+\.\d+\.\d+$/.test(a.bankVersion||""))throw new Error('practice manifest: "'+a.id+'" has a malformed bankVersion')}for(let a of e)if(r.has(a.slug)&&a.slug!==a.id)throw new Error('practice manifest: slug "'+a.slug+'" collides with another test id');return!0}Me(U);var J=new Map;async function he(e,r,o){let a=e+"-v"+r;if(J.has(a))return J.get(a);let f=o+a+".json",u=new AbortController,b=setTimeout(()=>u.abort(),1e4),p;try{p=await fetch(f,{signal:u.signal})}finally{clearTimeout(b)}if(!p.ok)throw new Error("practice bank fetch failed: "+f+" ("+p.status+")");let m=await p.json();return J.set(a,m),m}function k(e,r,o){let a=document.createElement(e);return r&&(a.className=r),o!=null&&(a.textContent=o),a}function X(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function fe(e,{onSelect:r,childPages:o=!1,hubUrl:a="/tools/practice"}){X(e),e.appendChild(k("h2","zq-hub-section-title","Pick your test"));let f=String(a).replace(/\/+$/,""),u=k("div","zq-hub-grid");U.forEach(b=>{let p=k(o?"a":"button","zq-hubcard");o?p.href=f+"/"+b.slug:p.type="button",p.appendChild(k("span","zq-eyebrow",b.discipline)),p.appendChild(k("h3",null,b.title)),p.appendChild(k("p",null,b.description||"")),p.appendChild(k("div","zq-meta",b.questionCount+" questions \xB7 practice or timed exam")),o||p.addEventListener("click",()=>r(b)),u.appendChild(p)}),e.appendChild(u)}function me(e){X(e);let r=k("div","zq-loading");r.appendChild(k("span","zq-spinner")),r.appendChild(k("span",null,"Loading questions\u2026")),e.appendChild(r)}function $(e,{message:r,onRetry:o,hubUrl:a}){X(e);let f=k("div","zq-error");if(f.setAttribute("role","alert"),f.appendChild(k("h3",null,"Could not load this test")),f.appendChild(k("p",null,r||"The question set did not load. Check your connection and try again.")),o){let u=k("button","zq-btn zq-btn-secondary","Try again");u.type="button",u.addEventListener("click",o),f.appendChild(u)}if(a){let u=k("a","zq-btn zq-btn-secondary","All practice tests");u.href=a,f.appendChild(u)}e.appendChild(f)}function V(e){for(let r=e.length-1;r>0;r--){let o=Math.floor(Math.random()*(r+1)),a=e[r];e[r]=e[o],e[o]=a}return e}function Z(e){let r=Math.floor(e/60),o=e%60;return r+":"+(o<10?"0":"")+o}function ge(e){let r=[],o=[25,50,100];for(let a of o)a<e&&r.push(a);return r.push(e),r}function ee(e,r,o,a){let f=r||o;return Math.max(10,Math.round((a||120)*e/f))}function ze(e,r,o){let a=new Set(r||[]),f=[],u=[];for(let p of e)(a.has(p.id)?u:f).push(p);V(f),V(u);let b=f.concat(u).slice(0,o);return V(b),b.map(p=>{let m=V([0,1,2,3]);return{q:p,order:m,correctPos:m.indexOf(p.correctIndex)}})}function be(e,r){let o=e.length,a=0,f={},u=[];for(let p=0;p<o;p++){let m=e[p],I=m.q.domain||"General";f[I]||(f[I]={n:0,ok:0}),f[I].n+=1;let g=p in r?r[p]:null;g===m.correctPos?(a+=1,f[I].ok+=1):u.push({item:m,sel:g})}let b=Math.round(100*a/o);return{correct:a,n:o,pct:b,byDomain:f,missed:u}}function ve(e){return Object.keys(e).sort((r,o)=>e[r].ok/e[r].n-e[o].ok/e[o].n)}var te={MATH:"Operator math",CHEM:"Chemistry",MICRO:"Microbiology",REGS:"Regulations",SAMP:"Sampling",SAFE:"Safety",PROC:"Process control",EQIP:"Equipment",ADMIN:"Administration",Multiple:"Mixed topics"};function Ne(e){try{return window.localStorage.getItem(e)}catch{return null}}function ie(e,r){try{window.localStorage.setItem(e,r)}catch{}}function Be(e){try{window.localStorage.removeItem(e)}catch{}}function D(e){let r=Ne(e);if(!r)return null;try{return JSON.parse(r)}catch{return null}}function t(e,r,o){let a=document.createElement(e);return r&&(a.className=r),o!=null&&(a.textContent=o),a}function G(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var Oe='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';function M(e,r,{arrow:o=!1}={}){let a=t("button",r);a.type="button";let f=t("span","zq-btn-label",e);if(a.appendChild(f),o){let u=document.createElement("span");u.className="zq-arrow",u.innerHTML=Oe,a.appendChild(u)}return a}function Pe(e,r){let o=e.querySelector(".zq-btn-label");o&&(o.textContent=r)}function qe(e,r,o,{onExit:a}={}){let f="zpt-pt-session-"+r.id,u="zpt-pt-history-"+r.id,b="zpt-pt-seen-"+r.id,p={};for(let n of r.questions)p[n.id]=n;G(e);let m=t("div"),I=t("div","zq-visually-hidden");I.setAttribute("aria-live","polite"),e.appendChild(m),e.appendChild(I);function g(n){I.textContent=n}let i=null,x={mode:"practice",size:null};function B(){i&&ie(f,JSON.stringify({v:1,bankVersion:r.version||"",mode:i.mode,size:i.size,qids:i.qs.map(n=>n.q.id),orders:i.qs.map(n=>n.order),answers:i.answers,checked:i.checked,idx:i.idx,remainingSec:i.remainingSec}))}function xe(){let n=D(f);if(!n||n.v!==1||n.bankVersion!==(r.version||"")||!n.qids||!n.qids.length)return null;for(let l of n.qids)if(!p[l])return null;return n}function Y(){Be(f)}function we(n){let l=D(u)||[];l.unshift(n),l.length>25&&(l=l.slice(0,25)),ie(u,JSON.stringify(l))}function Ce(n){let s=(D(b)||[]).concat(n);s.length>600&&(s=s.slice(s.length-600)),ie(b,JSON.stringify(s))}function F(){H(),i=null,G(m);let n=t("div");n.appendChild(t("span","zq-badge",o.badge||r.discipline||"")),n.appendChild(t("h2","zq-title",o.title||r.title)),m.appendChild(n);let l=xe();if(l){let c=t("div","zq-resume"),h=t("div");h.appendChild(t("strong",null,"You have a test in progress. ")),h.appendChild(document.createTextNode((l.mode==="exam"?"Timed exam":"Practice")+", question "+(l.idx+1)+" of "+l.qids.length+".")),c.appendChild(h);let z=t("div","zq-navrow"),d=M("Resume","zq-btn zq-btn-primary",{arrow:!0});d.addEventListener("click",()=>ke(l));let S=M("Discard","zq-btn zq-btn-quiet");S.addEventListener("click",()=>{Y(),F()}),z.appendChild(d),z.appendChild(S),c.appendChild(z),m.appendChild(c)}let s=t("div","zq-card");s.appendChild(t("h2",null,"Set up your test"));let q=t("div","zq-mode-grid"),y=[{id:"practice",name:"Practice",desc:"Check each answer as you go. Every question shows a plain-English explanation."},{id:"exam",name:"Timed exam",desc:"No feedback until the end, with a clock running. The closest thing to test day."}],w={};y.forEach(c=>{let h=t("button","zq-mode"+(x.mode===c.id?" zq-selected":""));h.type="button",h.appendChild(t("h3",null,c.name)),h.appendChild(t("p",null,c.desc)),h.addEventListener("click",()=>{x.mode=c.id;for(let z in w)w[z].classList.toggle("zq-selected",z===c.id);A()}),w[c.id]=h,q.appendChild(h)}),s.appendChild(q);let v=ge(r.questions.length);(x.size===null||v.indexOf(x.size)===-1)&&(x.size=v[0]);let N=t("div","zq-size-row"),O={};v.forEach(c=>{let h=t("button","zq-size"+(x.size===c?" zq-selected":""));h.type="button",h.appendChild(document.createTextNode(c===r.questions.length&&v.length>1?"All "+c:String(c))),h.appendChild(t("small",null,"questions")),h.addEventListener("click",()=>{x.size=c;for(let z in O)O[z].classList.toggle("zq-selected",Number(z)===c);A()}),O[c]=h,N.appendChild(h)}),s.appendChild(N);let L=t("div","zq-navrow"),R=M("","zq-btn zq-btn-primary",{arrow:!0});R.addEventListener("click",()=>re(x.mode,x.size)),L.appendChild(R),s.appendChild(L),m.appendChild(s);function A(){Pe(R,x.mode==="exam"?"Start timed exam ("+x.size+" questions, "+ee(x.size,r.refCount,r.questions.length,r.durationMin)+" min)":"Start practice ("+x.size+" questions)")}A();let E=D(u)||[];if(E.length){let c=0;for(let h of E)h.scorePct>c&&(c=h.scorePct);m.appendChild(t("p","zq-best","Your best score on this test so far: "+c+" percent. Attempts: "+E.length+"."))}}function re(n,l){Y();let s=D(b)||[];i={mode:n,size:l,qs:ze(r.questions,s,l),idx:0,answers:{},checked:{},remainingSec:n==="exam"?ee(l,r.refCount,r.questions.length,r.durationMin)*60:0,timerId:null},B(),n==="exam"&&ae(),W()}function ke(n){i={mode:n.mode,size:n.size,qs:n.qids.map((l,s)=>{let q=p[l],y=n.orders[s];return{q,order:y,correctPos:y.indexOf(q.correctIndex)}}),idx:n.idx||0,answers:n.answers||{},checked:n.checked||{},remainingSec:n.remainingSec||0,timerId:null},i.mode==="exam"&&ae(),W()}function ne(){let n=e.querySelector(".zq-timer");n&&(n.textContent=Z(Math.max(0,i.remainingSec)),n.classList.toggle("zq-low",i.remainingSec<=120)),i.remainingSec%15===0&&B(),i.remainingSec<=0&&(g("Time is up. Scoring your exam."),Q())}function ae(){H(),i.timerId=setInterval(()=>{i.remainingSec-=1,ne()},1e3)}function H(){i&&i.timerId&&(clearInterval(i.timerId),i.timerId=null)}function W(){G(m);let n=i.qs[i.idx],l=n.q,s=i.qs.length,q=!!i.checked[i.idx],y=i.idx in i.answers?i.answers[i.idx]:null,w=t("div","zq-topbar"),v=t("div");if(v.appendChild(document.createTextNode("Question "+(i.idx+1)+" of "+s+"  ")),v.appendChild(t("span","zq-domchip",te[l.domain]||l.domain||"General")),w.appendChild(v),i.mode==="exam"){let c=t("span","zq-timer",Z(Math.max(0,i.remainingSec)));i.remainingSec<=120&&c.classList.add("zq-low"),w.appendChild(c)}m.appendChild(w);let N=t("div","zq-progressbar"),O=t("i");O.style.width=Math.round(100*i.idx/s)+"%",N.appendChild(O),m.appendChild(N);let L=t("div","zq-card");L.appendChild(t("div","zq-stem",l.text));let R=t("ul","zq-choices"),A=["A","B","C","D"];n.order.forEach((c,h)=>{let z=t("li"),d=t("button","zq-choice");d.type="button",d.appendChild(t("span","zq-letter",A[h])),d.appendChild(t("span",null,l.choices[c])),y===h&&d.classList.add("zq-selected"),q?(d.disabled=!0,h===n.correctPos?(d.classList.remove("zq-selected"),d.classList.add("zq-correct")):y===h&&(d.classList.remove("zq-selected"),d.classList.add("zq-wrong"))):d.addEventListener("click",()=>oe(h)),z.appendChild(d),R.appendChild(z)}),L.appendChild(R),q&&L.appendChild(Se(n,y));let E=t("div","zq-navrow");if(i.mode==="exam"){let c=M("Previous","zq-btn zq-btn-quiet");if(c.disabled=i.idx===0,c.addEventListener("click",()=>{i.idx-=1,B(),W()}),E.appendChild(c),E.appendChild(t("span","zq-spacer")),i.idx<s-1){let d=M("Next","zq-btn zq-btn-primary",{arrow:!0});d.addEventListener("click",()=>{i.idx+=1,B(),W()}),E.appendChild(d)}let h=0;for(let d in i.answers)i.answers[d]!==null&&h++;let z=M("Submit ("+h+"/"+s+" answered)",i.idx===s-1?"zq-btn zq-btn-primary":"zq-btn zq-btn-secondary");z.addEventListener("click",()=>{h<s&&!window.confirm("You have unanswered questions. Submit anyway?")||Q()}),E.appendChild(z)}else if(E.appendChild(t("span","zq-spacer")),q){let c=M(i.idx<s-1?"Next question":"See your score","zq-btn zq-btn-primary",{arrow:!0});c.setAttribute("data-zq-next",""),c.addEventListener("click",()=>{i.idx<s-1?(i.idx+=1,B(),W()):Q()}),E.appendChild(c)}else{let c=M("Check answer","zq-btn zq-btn-primary");c.setAttribute("data-zq-check",""),c.disabled=y===null,c.addEventListener("click",se),E.appendChild(c)}L.appendChild(E),m.appendChild(L);try{e.scrollIntoView({block:"start"})}catch{}}function oe(n){i.answers[i.idx]=n,B(),W()}function se(){if(!(i.idx in i.answers))return;i.checked[i.idx]=!0,B();let n=i.qs[i.idx];g(i.answers[i.idx]===n.correctPos?"Correct.":"Not quite. The explanation is shown below."),W()}function Se(n,l){let s=n.q,q=l===n.correctPos,y=t("div","zq-feedback "+(q?"zq-ok":"zq-err"));y.appendChild(t("h4",q?"zq-okt":"zq-errt",q?"Correct":"Not quite")),s.explanation&&y.appendChild(t("p","zq-explain",s.explanation)),s.formula&&y.appendChild(t("div","zq-formula",s.formula)),s.citation&&y.appendChild(t("div","zq-cite","Source: "+s.citation));let w=t("div","zq-minilinks");if(s.calculator&&o.calcUrl){let v=t("a",null,"Run this math in the Operator Calculator");v.href=o.calcUrl+"#"+s.calculator,v.target="_blank",v.rel="noopener",w.appendChild(v)}if(o.contactEmail){let v=t("a",null,"Report a problem with this question");v.href="mailto:"+o.contactEmail+"?subject="+encodeURIComponent("Practice test question "+s.id),w.appendChild(v)}return w.childNodes.length&&y.appendChild(w),y}function Q(){H();let{correct:n,n:l,pct:s,byDomain:q,missed:y}=be(i.qs,i.answers);we({date:new Date().toISOString().slice(0,10),mode:i.mode,size:l,scorePct:s}),Ce(i.qs.map(w=>w.q.id)),Y(),Ee(s,n,l,q,y)}function Ee(n,l,s,q,y){G(m);let w=n>=70,v=t("div","zq-card zq-score-hero");v.appendChild(t("div","zq-score-num "+(w?"zq-pass":"zq-fail"),n+"%")),v.appendChild(t("div","zq-score-verdict "+(w?"zq-tag-ok":"zq-tag-err"),w?"Pass at the 70 percent line":"Below the 70 percent line")),v.appendChild(t("div","zq-score-sub",l+" of "+s+" correct"+(i.mode==="exam"?" on a timed exam":""))),v.appendChild(t("p","zq-passnote","Most states set the pass line at 70 percent. Your state's rules govern, so check your certification program for the real requirement.")),g("You scored "+n+" percent, "+l+" of "+s+" correct. "+(w?"That clears the 70 percent line.":"That is below the 70 percent line."));let N=t("div","zq-navrow zq-navrow-center"),O=M("Take it again (new draw)","zq-btn zq-btn-primary",{arrow:!0});O.addEventListener("click",()=>re(i.mode,s));let L=M("Change setup","zq-btn zq-btn-secondary");L.addEventListener("click",F);let R=o.deepLinked&&o.hubUrl,A;if(R?(A=t("a","zq-btn zq-btn-quiet"),A.href=o.hubUrl,A.appendChild(t("span","zq-btn-label","All practice tests"))):(A=M("All practice tests","zq-btn zq-btn-quiet"),A.addEventListener("click",()=>{a&&a()})),N.appendChild(O),N.appendChild(L),N.appendChild(A),v.appendChild(N),m.appendChild(v),Object.keys(q).length>1){let z=t("div","zq-card zq-dombars");z.appendChild(t("h3",null,"Where you stand by topic")),ve(q).forEach(d=>{let S=q[d],C=Math.round(100*S.ok/S.n),T=t("div","zq-dombar"+(C<70?" zq-weak":"")),j=t("div","zq-domlabel");j.appendChild(t("span",null,te[d]||d)),j.appendChild(t("span",null,S.ok+"/"+S.n+" ("+C+"%)")),T.appendChild(j);let P=t("div","zq-track"),le=t("span","zq-fill");le.style.width=C+"%",P.appendChild(le),T.appendChild(P),z.appendChild(T)}),m.appendChild(z)}if(y.length){let z=t("div","zq-card zq-missed");z.appendChild(t("h3",null,"Review what you missed ("+y.length+")")),y.forEach(d=>{let S=t("details");S.appendChild(t("summary",null,d.item.q.text));let C=t("div","zq-missed-body"),T=["A","B","C","D"];if(d.sel!==null&&d.sel!==void 0){let P=t("p");P.appendChild(t("span","zq-tag-err","Your answer: ")),P.appendChild(document.createTextNode(T[d.sel]+". "+d.item.q.choices[d.item.order[d.sel]])),C.appendChild(P)}else{let P=t("p");P.appendChild(t("span","zq-tag-err","Skipped.")),C.appendChild(P)}let j=t("p");j.appendChild(t("span","zq-tag-ok","Correct answer: ")),j.appendChild(document.createTextNode(T[d.item.correctPos]+". "+d.item.q.choices[d.item.q.correctIndex])),C.appendChild(j),d.item.q.explanation&&C.appendChild(t("p","zq-explain",d.item.q.explanation)),d.item.q.formula&&C.appendChild(t("div","zq-formula",d.item.q.formula)),d.item.q.citation&&C.appendChild(t("div","zq-cite","Source: "+d.item.q.citation)),S.appendChild(C),z.appendChild(S)}),m.appendChild(z)}let c=t("div","zq-capture-slot");c.hidden=!0,m.appendChild(document.createComment(" soft-capture slot: reserved, ruling 2026-07-10 ")),m.appendChild(c);let h=D(u)||[];if(h.length>1){let z=t("div","zq-card zq-history");z.appendChild(t("h3",null,"Your attempts on this test"));let d=t("table"),S=t("tr");["Date","Mode","Questions","Score"].forEach(C=>S.appendChild(t("th",null,C))),d.appendChild(S),h.slice(0,8).forEach(C=>{let T=t("tr");T.appendChild(t("td",null,C.date)),T.appendChild(t("td",null,C.mode==="exam"?"Timed":"Practice")),T.appendChild(t("td",null,String(C.size))),T.appendChild(t("td",null,C.scorePct+"%")),d.appendChild(T)}),z.appendChild(d),m.appendChild(z)}}let ce=!0,_=null;typeof IntersectionObserver=="function"&&(_=new IntersectionObserver(n=>{for(let l of n)ce=l.isIntersecting},{threshold:0}),_.observe(e));function Ie(){if(_)return ce;let n=e.getBoundingClientRect(),l=window.innerHeight||document.documentElement.clientHeight,s=window.innerWidth||document.documentElement.clientWidth;return n.bottom>0&&n.top<l&&n.right>0&&n.left<s}function de(n){if(!i||n.target&&(n.target.tagName==="INPUT"||n.target.tagName==="TEXTAREA")||!Ie())return;let l=n.key;if(l>="1"&&l<="4"){let s=Number(l)-1;i.checked[i.idx]||(oe(s),n.preventDefault())}else if(l==="Enter"){let s=e.querySelector("[data-zq-check]"),q=e.querySelector("[data-zq-next]");s&&!s.disabled?(se(),n.preventDefault()):q&&(q.click(),n.preventDefault())}}document.addEventListener("keydown",de);function Ae(){H(),_&&_.disconnect(),document.removeEventListener("keydown",de),G(e)}function Te(n){i&&(i.remainingSec=n,ne())}return F(),{destroy:Ae,__debugSetRemainingSec:Te}}function ye(){let e=document.getElementById("ziptility-practice");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zpt-practice-styles")){let g=document.createElement("style");g.id="zpt-practice-styles",g.textContent=pe,document.head.appendChild(g)}if(!document.getElementById("zpt-practice-fonts")){let g=document.createElement("link");g.rel="preconnect",g.href="https://fonts.googleapis.com";let i=document.createElement("link");i.rel="preconnect",i.href="https://fonts.gstatic.com",i.crossOrigin="anonymous";let x=document.createElement("link");x.id="zpt-practice-fonts",x.rel="stylesheet",x.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(g,i,x)}let r=!1,o=null;try{let g=new URLSearchParams(window.location.search);r=g.get("embed")==="app",o=g.get("test")}catch{}r||(r=e.dataset.embed==="app"),o||(o=e.dataset.test||null),r&&e.classList.add("zq-embed-app");let a=e.dataset.childPages==="1",f=e.dataset.bankBase||ue,u=e.dataset.hubUrl||K.hubUrl;e.innerHTML="";let b=document.createElement("div");b.className="zq-wrap",e.appendChild(b);let p=null;function m(){p&&(p.destroy(),p=null),fe(b,{onSelect:I,childPages:a,hubUrl:u})}function I(g,i){me(b),he(g.id,g.bankVersion,f).then(x=>{let B={...K,embedApp:r,hubUrl:u,title:g.title,badge:g.badge,deepLinked:!!i};p=qe(b,x,B,{onExit:i?null:m}),e.dataset.debug==="1"&&(e.__zqDebug=p)}).catch(()=>{$(b,{message:'Could not load "'+g.title+'." Check your connection and try again.',onRetry:()=>I(g,i)})})}if(o){let g=U.find(i=>i.slug===o||i.id===o);g?I(g,!0):$(b,{message:'This practice test is not available at "'+o+'." Pick a test from the full list instead.',hubUrl:u})}else m()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ye):ye();})();
