/* Ziptility Practice Tests practice-v1.9.0 (48727f179cb13eb847dac1b1746f34a9f2304a9e) — https://github.com/BlakeAndersonZiptility/ziptility-tools */
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
  padding:1.15rem 2.4rem; font-size:20px;
  box-shadow:0 3px 10px rgba(192,33,0,.22);
}
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
/* THE SPEC-PLATE STAT (design pass, 2026-07-29): the audit called this hub "a generic, clean card
   list... no visual hook". Per DS 9.11 ("the number is the hero, the label is support"), the
   question count gets a real Geist numeral instead of living only in the 12px meta caption below -
   the same technique src/manager's result gauge now uses, so "a real number, presented like a
   spec" reads as one idea across the tool suite, not just this hub. */
#ziptility-practice .zq-hubcard-stat{
  display:flex; align-items:baseline; gap:6px; margin-top:14px;
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
`;var Z={calcUrl:"/tools/calculator",formulaSheetUrl:"/tools/formula-sheets",contactEmail:"sales@ziptility.com",hubUrl:"/tools/practice"};var ye="https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-banks/",V=[{id:"operator-math-1",slug:"operator-math",title:"Operator math practice test",badge:"Operator math \xB7 Levels 1-2 (ABC Class I-II)",discipline:"Operator Math",level:"Levels 1-2 (ABC Class I-II)",description:"Unit conversions, flow, dosing, and the 8.34 pounds formula, worked out in plain English.",questionCount:110,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"regulations-1",slug:"regulations",title:"Water and wastewater regulations practice test (federal)",badge:"Federal regulations \xB7 Entry to working level",discipline:"Regulations (Federal)",level:"Entry to working level (ABC Class I-II)",description:"The federal rules an operator answers to: the Safe Drinking Water Act, the Clean Water Act, monitoring and reporting, public notice, and recordkeeping. Every answer carries a citation.",questionCount:103,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wd-1",slug:"water-distribution",title:"Water distribution operator practice test, Class I",badge:"Water distribution \xB7 Class I entry level",discipline:"Water Distribution",level:"Entry level (ABC Class I)",description:"Mains, valves, hydrants, storage, pumps, cross-connection control, flushing, sampling, and crew safety. Machine-checked math and cited answers.",questionCount:125,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"wwc-1",slug:"wastewater-collection",title:"Wastewater collection operator practice test, Class I",badge:"Wastewater collection \xB7 Class I entry level",discipline:"Wastewater Collections",level:"Entry level (ABC Class I)",description:"Gravity mains, manholes, lift stations, cleaning and CCTV, infiltration and inflow, SSO response, and confined-space and trench safety. Cited answers throughout.",questionCount:120,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"wt-1",slug:"water-treatment",title:"Water treatment operator practice test, Class I",badge:"Water treatment \xB7 Class I entry level",discipline:"Water Treatment",level:"Entry level (ABC Class I)",description:"Coagulation and jar testing, sedimentation, filtration, disinfection and CT, source water, plant pumps and chemical feeders, lab work, and chlorine safety. Machine-checked math and cited answers.",questionCount:128,durationMin:120,refCount:100,bankVersion:"1.1.0"},{id:"wwt-1",slug:"wastewater-treatment",title:"Wastewater treatment operator practice test, Class I",badge:"Wastewater treatment \xB7 Class I entry level",discipline:"Wastewater Treatment",level:"Entry level (ABC Class I)",description:"Preliminary and primary treatment, activated sludge, clarifiers, trickling filters and lagoons, disinfection, solids handling, blowers and clarifier drives, lab work, and H2S and confined-space safety. Cited answers throughout.",questionCount:119,durationMin:120,refCount:100,bankVersion:"1.1.0"}];function Ve(e){let t=new Set,a=new Set;for(let o of e){if(!o||!o.id)throw new Error("practice manifest: entry missing id");if(t.has(o.id))throw new Error('practice manifest: duplicate id "'+o.id+'"');if(t.add(o.id),!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(o.slug||""))throw new Error('practice manifest: "'+o.id+'" has a missing or non-kebab-case slug');if(a.has(o.slug))throw new Error('practice manifest: duplicate slug "'+o.slug+'"');if(a.add(o.slug),!o.title||!o.badge||!o.discipline||!o.level||!o.description)throw new Error('practice manifest: "'+o.id+'" is missing a required label field');if(!Number.isInteger(o.questionCount)||o.questionCount<=0)throw new Error('practice manifest: "'+o.id+'" has a bad questionCount');if(!Number.isInteger(o.durationMin)||o.durationMin<=0)throw new Error('practice manifest: "'+o.id+'" has a bad durationMin');if(!Number.isInteger(o.refCount)||o.refCount<=0)throw new Error('practice manifest: "'+o.id+'" has a bad refCount');if(!/^\d+\.\d+\.\d+$/.test(o.bankVersion||""))throw new Error('practice manifest: "'+o.id+'" has a malformed bankVersion')}for(let o of e)if(t.has(o.slug)&&o.slug!==o.id)throw new Error('practice manifest: slug "'+o.slug+'" collides with another test id');return!0}Ve(V);var ee=new Map;async function we(e,t,a){let o=e+"-v"+t;if(ee.has(o))return ee.get(o);let c=a+o+".json",u=new AbortController,y=setTimeout(()=>u.abort(),1e4),h;try{h=await fetch(c,{signal:u.signal})}finally{clearTimeout(y)}if(!h.ok)throw new Error("practice bank fetch failed: "+c+" ("+h.status+")");let f=await h.json();return ee.set(o,f),f}function C(e,t,a){let o=document.createElement(e);return t&&(o.className=t),a!=null&&(o.textContent=a),o}function te(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var Ye=new Set(["operator-math-1","regulations-1"]);function qe(e,{onSelect:t,childPages:a=!1,hubUrl:o="/tools/practice"}){te(e),e.appendChild(C("h2","zq-hub-section-title","Pick your test"));let c=String(o).replace(/\/+$/,""),u=C("div","zq-hub-grid"),y=!1;V.forEach(h=>{let f=Ye.has(h.id);!f&&!y&&(u.appendChild(C("div","zq-hub-groupdivider","By discipline")),y=!0);let w=C(a?"a":"button","zq-hubcard"+(f?" zq-hubcard-featured":""));a?w.href=c+"/"+h.slug:w.type="button",w.appendChild(C("span","zq-eyebrow",h.discipline)),w.appendChild(C("h3",null,h.title)),w.appendChild(C("p",null,h.description||""));let m=C("div","zq-hubcard-stat");m.appendChild(C("span","zq-hubcard-stat-num",String(h.questionCount))),m.appendChild(C("span","zq-hubcard-stat-label","questions in the bank")),w.appendChild(m),w.appendChild(C("div","zq-meta","Practice or timed exam")),a||w.addEventListener("click",()=>t(h)),u.appendChild(w)}),e.appendChild(u)}function xe(e){te(e);let t=C("div","zq-loading");t.appendChild(C("span","zq-spinner")),t.appendChild(C("span",null,"Loading questions\u2026")),e.appendChild(t)}function ie(e,{message:t,onRetry:a,hubUrl:o}){te(e);let c=C("div","zq-error");if(c.setAttribute("role","alert"),c.appendChild(C("h3",null,"Could not load this test")),c.appendChild(C("p",null,t||"The question set did not load. Check your connection and try again.")),a){let u=C("button","zq-btn zq-btn-secondary","Try again");u.type="button",u.addEventListener("click",a),c.appendChild(u)}if(o){let u=C("a","zq-btn zq-btn-secondary","All practice tests");u.href=o,c.appendChild(u)}e.appendChild(c)}function F(e){for(let t=e.length-1;t>0;t--){let a=Math.floor(Math.random()*(t+1)),o=e[t];e[t]=e[a],e[a]=o}return e}function re(e){let t=Math.floor(e/60),a=e%60;return t+":"+(a<10?"0":"")+a}function Ce(e){let t=[],a=[25,50,100];for(let o of a)o<e&&t.push(o);return t.push(e),t}function ne(e,t,a,o){let c=t||a;return Math.max(10,Math.round((o||120)*e/c))}function ke(e,t,a){let o=new Set(t||[]),c=[],u=[];for(let h of e)(o.has(h.id)?u:c).push(h);F(c),F(u);let y=c.concat(u).slice(0,a);return F(y),y.map(h=>{let f=F([0,1,2,3]);return{q:h,order:f,correctPos:f.indexOf(h.correctIndex)}})}function Se(e,t){let a=e.length,o=0,c={},u=[];for(let h=0;h<a;h++){let f=e[h],w=f.q.domain||"General";c[w]||(c[w]={n:0,ok:0}),c[w].n+=1;let m=h in t?t[h]:null;m===f.correctPos?(o+=1,c[w].ok+=1):u.push({item:f,sel:m})}let y=Math.round(100*o/a);return{correct:o,n:a,pct:y,byDomain:c,missed:u}}function Ee(e){return Object.keys(e).sort((t,a)=>e[t].ok/e[t].n-e[a].ok/e[a].n)}var He="tool_complete",Fe="tool_progress";function Te(e){try{if(typeof window>"u")return;window.dataLayer=window.dataLayer||[],window.dataLayer.push(e)}catch{}}function ae(e,t){if(!e)return;let a={event:He,tool_name:String(e)};t&&typeof t=="object"&&Object.keys(t).forEach(o=>{let c=t[o];c==null||c===""||typeof c!="object"&&(a["tool_"+o]=typeof c=="number"?c:String(c))}),Te(a)}function Ie(e,t,a){!e||!a||Te({event:Fe,tool_name:String(e),tool_answered:Number(t),tool_total:Number(a),tool_percent:Math.round(Number(t)/Number(a)*100)})}function oe(e){let t={},a=(e||[25,50,75]).slice().sort((o,c)=>o-c);return function(c,u){if(!u)return null;let y=c/u*100;for(let h=a.length-1;h>=0;h--){let f=a[h];if(y>=f&&!t[f])return t[f]=!0,f}return null}}var Qe="zip-units";var Q=null;function Ke(e){return e==="metric"?"metric":"imperial"}function K(){if(Q)return Q;let e=null;try{e=window.localStorage.getItem(Qe)}catch{e=null}return Q=Ke(e),Q}var se={MATH:"Operator math",CHEM:"Chemistry",MICRO:"Microbiology",REGS:"Regulations",SAMP:"Sampling",SAFE:"Safety",PROC:"Process control",EQIP:"Equipment",ADMIN:"Administration",Multiple:"Mixed topics"};function Xe(e){try{return window.localStorage.getItem(e)}catch{return null}}function ce(e,t){try{window.localStorage.setItem(e,t)}catch{}}function Je(e){try{window.localStorage.removeItem(e)}catch{}}function j(e){let t=Xe(e);if(!t)return null;try{return JSON.parse(t)}catch{return null}}function r(e,t,a){let o=document.createElement(e);return t&&(o.className=t),a!=null&&(o.textContent=a),o}function Y(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var $e='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';function L(e,t,{arrow:a=!1}={}){let o=r("button",t);o.type="button";let c=r("span","zq-btn-label",e);if(o.appendChild(c),a){let u=document.createElement("span");u.className="zq-arrow",u.innerHTML=$e,o.appendChild(u)}return o}function Ze(e,t){let a=e.querySelector(".zq-btn-label");a&&(a.textContent=t)}function Ae(e,t,a,{onExit:o}={}){let c="zpt-pt-session-"+t.id,u="zpt-pt-history-"+t.id,y="zpt-pt-seen-"+t.id,h={};for(let n of t.questions)h[n.id]=n;Y(e);let f=r("div"),w=r("div","zq-visually-hidden");w.setAttribute("aria-live","polite"),e.appendChild(f),e.appendChild(w);function m(n){w.textContent=n}let i=null,N="practice-"+(a.slug||t.id),G=oe([25,50,75]);function le(n,l){if(G=oe([25,50,75]),n>0)for(let s=0;s<4&&G(n,l);s++);}function Ne(){try{let n=Object.keys(i.answers).length;G(n,i.qs.length)&&Ie(N,n,i.qs.length)}catch{}}let E={mode:"practice",size:null};function _(){i&&ce(c,JSON.stringify({v:1,bankVersion:t.version||"",mode:i.mode,size:i.size,qids:i.qs.map(n=>n.q.id),system:t.variants&&t.variants.system||"imperial",orders:i.qs.map(n=>n.order),answers:i.answers,checked:i.checked,idx:i.idx,remainingSec:i.remainingSec}))}function Oe(){let n=j(c);if(!n||n.v!==1||n.bankVersion!==(t.version||"")||!n.qids||!n.qids.length||(n.system||"imperial")!==(t.variants&&t.variants.system||"imperial"))return null;for(let l of n.qids)if(!h[l])return null;return n}function X(){Je(c)}function Be(n){let l=j(u)||[];l.unshift(n),l.length>25&&(l=l.slice(0,25)),ce(u,JSON.stringify(l))}function Pe(n){let s=(j(y)||[]).concat(n);s.length>600&&(s=s.slice(s.length-600)),ce(y,JSON.stringify(s))}function de(n){let l=K()==="metric",s=t.variants||{total:0,withSi:0},z;return n==="results"&&l&&s.withSi>0?z="Your calculator is set to metric; questions with a metric version showed it, the rest used US customary exam-sheet units.":l?s.withSi>0&&s.withSi>=s.total?z="Shown in metric (SI) units, to match your calculator. Switch the calculator to US customary to practise in exam-sheet units.":s.withSi>0?z="Your calculator is set to metric. "+s.withSi+" of "+s.total+" questions here have a metric version and show it; the rest still use US customary exam-sheet units (gallons, feet, MGD, lb/day).":z="Your calculator is set to metric. These practice questions still use US customary exam-sheet units (gallons, feet, MGD, lb/day), the way the exam sheet does. Metric question sets follow.":z="Math questions use US customary exam-sheet units (gallons, feet, MGD, lb/day), the way the exam sheet does.",r("p","zq-note zq-units-note",z)}function J(){H(),i=null,Y(f);let n=r("div");n.appendChild(r("span","zq-badge",a.badge||t.discipline||"")),n.appendChild(r("h2","zq-title",a.title||t.title)),n.appendChild(de()),f.appendChild(n);let l=Oe();if(l){let d=r("div","zq-resume"),g=r("div");g.appendChild(r("strong",null,"You have a test in progress. ")),g.appendChild(document.createTextNode((l.mode==="exam"?"Timed exam":"Practice")+", question "+(l.idx+1)+" of "+l.qids.length+".")),d.appendChild(g);let b=r("div","zq-navrow"),p=L("Resume","zq-btn zq-btn-primary",{arrow:!0});p.addEventListener("click",()=>Re(l));let S=L("Discard","zq-btn zq-btn-quiet");S.addEventListener("click",()=>{X(),J()}),b.appendChild(p),b.appendChild(S),d.appendChild(b),f.appendChild(d)}let s=r("div","zq-card");s.appendChild(r("h2",null,"Set up your test"));let z=r("div","zq-mode-grid"),q=[{id:"practice",name:"Practice",desc:"Check each answer as you go. Every question shows a plain-English explanation."},{id:"exam",name:"Timed exam",desc:"No feedback until the end, with a clock running. The closest thing to test day."}],x={};q.forEach(d=>{let g=r("button","zq-mode"+(E.mode===d.id?" zq-selected":""));g.type="button",g.appendChild(r("h3",null,d.name)),g.appendChild(r("p",null,d.desc)),g.addEventListener("click",()=>{E.mode=d.id;for(let b in x)x[b].classList.toggle("zq-selected",b===d.id);I()}),x[d.id]=g,z.appendChild(g)}),s.appendChild(z);let v=Ce(t.questions.length);(E.size===null||v.indexOf(E.size)===-1)&&(E.size=v[0]);let O=r("div","zq-size-row"),B={};v.forEach(d=>{let g=r("button","zq-size"+(E.size===d?" zq-selected":""));g.type="button",g.appendChild(document.createTextNode(d===t.questions.length&&v.length>1?"All "+d:String(d))),g.appendChild(r("small",null,"questions")),g.addEventListener("click",()=>{E.size=d;for(let b in B)B[b].classList.toggle("zq-selected",Number(b)===d);I()}),B[d]=g,O.appendChild(g)}),s.appendChild(O);let M=r("div","zq-navrow"),R=L("","zq-btn zq-btn-primary",{arrow:!0});R.addEventListener("click",()=>pe(E.mode,E.size)),M.appendChild(R),s.appendChild(M),f.appendChild(s);function I(){Ze(R,E.mode==="exam"?"Start timed exam ("+E.size+" questions, "+ne(E.size,t.refCount,t.questions.length,t.durationMin)+" min)":"Start practice ("+E.size+" questions)")}I();let T=j(u)||[];if(T.length){let d=0;for(let g of T)g.scorePct>d&&(d=g.scorePct);f.appendChild(r("p","zq-best","Your best score on this test so far: "+d+" percent. Attempts: "+T.length+"."))}}function pe(n,l){X();let s=j(y)||[];i={mode:n,size:l,qs:ke(t.questions,s,l),idx:0,answers:{},checked:{},remainingSec:n==="exam"?ne(l,t.refCount,t.questions.length,t.durationMin)*60:0,timerId:null},_(),le(0,i.qs.length),n==="exam"&&he(),D()}function Re(n){i={mode:n.mode,size:n.size,qs:n.qids.map((l,s)=>{let z=h[l],q=n.orders[s];return{q:z,order:q,correctPos:q.indexOf(z.correctIndex)}}),idx:n.idx||0,answers:n.answers||{},checked:n.checked||{},remainingSec:n.remainingSec||0,timerId:null},le(Object.keys(i.answers).length,i.qs.length),i.mode==="exam"&&he(),D()}function ue(){let n=e.querySelector(".zq-timer");n&&(n.textContent=re(Math.max(0,i.remainingSec)),n.classList.toggle("zq-low",i.remainingSec<=120)),i.remainingSec%15===0&&_(),i.remainingSec<=0&&(m("Time is up. Scoring your exam."),$())}function he(){H(),i.timerId=setInterval(()=>{i.remainingSec-=1,ue()},1e3)}function H(){i&&i.timerId&&(clearInterval(i.timerId),i.timerId=null)}function D(){Y(f);let n=i.qs[i.idx],l=n.q,s=i.qs.length,z=!!i.checked[i.idx],q=i.idx in i.answers?i.answers[i.idx]:null,x=r("div","zq-topbar"),v=r("div");if(v.appendChild(document.createTextNode("Question "+(i.idx+1)+" of "+s+"  ")),v.appendChild(r("span","zq-domchip",se[l.domain]||l.domain||"General")),x.appendChild(v),i.mode==="exam"){let d=r("span","zq-timer",re(Math.max(0,i.remainingSec)));i.remainingSec<=120&&d.classList.add("zq-low"),x.appendChild(d)}f.appendChild(x);let O=r("div","zq-progressbar"),B=r("i");B.style.width=Math.round(100*i.idx/s)+"%",O.appendChild(B),f.appendChild(O);let M=r("div","zq-card");M.appendChild(r("div","zq-stem",l.text));let R=r("ul","zq-choices"),I=["A","B","C","D"];n.order.forEach((d,g)=>{let b=r("li"),p=r("button","zq-choice");p.type="button",p.appendChild(r("span","zq-letter",I[g])),p.appendChild(r("span",null,l.choices[d])),q===g&&p.classList.add("zq-selected"),z?(p.disabled=!0,g===n.correctPos?(p.classList.remove("zq-selected"),p.classList.add("zq-correct")):q===g&&(p.classList.remove("zq-selected"),p.classList.add("zq-wrong"))):p.addEventListener("click",()=>fe(g)),b.appendChild(p),R.appendChild(b)}),M.appendChild(R),z&&M.appendChild(_e(n,q));let T=r("div","zq-navrow");if(i.mode==="exam"){let d=L("Previous","zq-btn zq-btn-quiet");if(d.disabled=i.idx===0,d.addEventListener("click",()=>{i.idx-=1,_(),D()}),T.appendChild(d),T.appendChild(r("span","zq-spacer")),i.idx<s-1){let p=L("Next","zq-btn zq-btn-primary",{arrow:!0});p.addEventListener("click",()=>{i.idx+=1,_(),D()}),T.appendChild(p)}let g=0;for(let p in i.answers)i.answers[p]!==null&&g++;let b=L("Submit ("+g+"/"+s+" answered)",i.idx===s-1?"zq-btn zq-btn-primary":"zq-btn zq-btn-secondary");b.addEventListener("click",()=>{g<s&&!window.confirm("You have unanswered questions. Submit anyway?")||$()}),T.appendChild(b)}else if(T.appendChild(r("span","zq-spacer")),z){let d=L(i.idx<s-1?"Next question":"See your score","zq-btn zq-btn-primary",{arrow:!0});d.setAttribute("data-zq-next",""),d.addEventListener("click",()=>{i.idx<s-1?(i.idx+=1,_(),D()):$()}),T.appendChild(d)}else{let d=L("Check answer","zq-btn zq-btn-primary");d.setAttribute("data-zq-check",""),d.disabled=q===null,d.addEventListener("click",me),T.appendChild(d)}M.appendChild(T),f.appendChild(M);try{e.scrollIntoView({block:"start"})}catch{}}function fe(n){i.answers[i.idx]=n,_(),Ne(),D()}function me(){if(!(i.idx in i.answers))return;i.checked[i.idx]=!0,_();let n=i.qs[i.idx];m(i.answers[i.idx]===n.correctPos?"Correct.":"Not quite. The explanation is shown below."),D()}function _e(n,l){let s=n.q,z=l===n.correctPos,q=r("div","zq-feedback "+(z?"zq-ok":"zq-err"));q.appendChild(r("h4",z?"zq-okt":"zq-errt",z?"Correct":"Not quite")),s.explanation&&q.appendChild(r("p","zq-explain",s.explanation)),s.formula&&q.appendChild(r("div","zq-formula",s.formula)),s.citation&&q.appendChild(r("div","zq-cite","Source: "+s.citation));let x=r("div","zq-minilinks");if(s.calculator&&a.calcUrl){let v=r("a",null,"Run this math in the Operator Calculator");v.href=a.calcUrl+"#"+s.calculator,v.target="_blank",v.rel="noopener",x.appendChild(v)}if(a.contactEmail){let v=r("a",null,"Report a problem with this question");v.href="mailto:"+a.contactEmail+"?subject="+encodeURIComponent("Practice test question "+s.id),x.appendChild(v)}return x.childNodes.length&&q.appendChild(x),q}function $(){H();let{correct:n,n:l,pct:s,byDomain:z,missed:q}=Se(i.qs,i.answers);if(!i.completeSent){i.completeSent=!0;try{let x=(j(u)||[]).length;ae(N,{mode:i.mode,size:l,score_pct:s,passed:s>=70?"yes":"no",attempt:x+1,deep_linked:a.deepLinked?"yes":"no"})}catch{ae(N)}}Be({date:new Date().toISOString().slice(0,10),mode:i.mode,size:l,scorePct:s}),Pe(i.qs.map(x=>x.q.id)),X(),De(s,n,l,z,q)}function De(n,l,s,z,q){Y(f);let x=n>=70,v=r("div","zq-card zq-score-hero");v.appendChild(r("div","zq-score-num "+(x?"zq-pass":"zq-fail"),n+"%")),v.appendChild(r("div","zq-score-verdict "+(x?"zq-tag-ok":"zq-tag-err"),x?"Pass at the 70 percent line":"Below the 70 percent line")),v.appendChild(r("div","zq-score-sub",l+" of "+s+" correct"+(i.mode==="exam"?" on a timed exam":""))),v.appendChild(r("p","zq-passnote","Most states set the pass line at 70 percent. Your state's rules govern, so check your certification program for the real requirement.")),v.appendChild(de("results")),m("You scored "+n+" percent, "+l+" of "+s+" correct. "+(x?"That clears the 70 percent line.":"That is below the 70 percent line."));let O=r("div","zq-navrow zq-navrow-center"),B=L("Take it again (new draw)","zq-btn zq-btn-primary",{arrow:!0});B.addEventListener("click",()=>pe(i.mode,s));let M=L("Change setup","zq-btn zq-btn-secondary");M.addEventListener("click",J);let R=a.deepLinked&&a.hubUrl,I;if(R?(I=r("a","zq-btn zq-btn-quiet"),I.href=a.hubUrl,I.appendChild(r("span","zq-btn-label","All practice tests"))):(I=L("All practice tests","zq-btn zq-btn-quiet"),I.addEventListener("click",()=>{o&&o()})),O.appendChild(B),O.appendChild(M),O.appendChild(I),v.appendChild(O),f.appendChild(v),Object.keys(z).length>1){let b=r("div","zq-card zq-dombars");b.appendChild(r("h3",null,"Where you stand by topic")),Ee(z).forEach(p=>{let S=z[p],k=Math.round(100*S.ok/S.n),A=r("div","zq-dombar"+(k<70?" zq-weak":"")),U=r("div","zq-domlabel");U.appendChild(r("span",null,se[p]||p)),U.appendChild(r("span",null,S.ok+"/"+S.n+" ("+k+"%)")),A.appendChild(U);let P=r("div","zq-track"),be=r("span","zq-fill");be.style.width=k+"%",P.appendChild(be),A.appendChild(P),b.appendChild(A)}),f.appendChild(b)}if(q.length){let b=r("div","zq-card zq-missed");b.appendChild(r("h3",null,"Review what you missed ("+q.length+")")),q.forEach(p=>{let S=r("details");S.appendChild(r("summary",null,p.item.q.text));let k=r("div","zq-missed-body"),A=["A","B","C","D"];if(p.sel!==null&&p.sel!==void 0){let P=r("p");P.appendChild(r("span","zq-tag-err","Your answer: ")),P.appendChild(document.createTextNode(A[p.sel]+". "+p.item.q.choices[p.item.order[p.sel]])),k.appendChild(P)}else{let P=r("p");P.appendChild(r("span","zq-tag-err","Skipped.")),k.appendChild(P)}let U=r("p");U.appendChild(r("span","zq-tag-ok","Correct answer: ")),U.appendChild(document.createTextNode(A[p.item.correctPos]+". "+p.item.q.choices[p.item.q.correctIndex])),k.appendChild(U),p.item.q.explanation&&k.appendChild(r("p","zq-explain",p.item.q.explanation)),p.item.q.formula&&k.appendChild(r("div","zq-formula",p.item.q.formula)),p.item.q.citation&&k.appendChild(r("div","zq-cite","Source: "+p.item.q.citation)),S.appendChild(k),b.appendChild(S)}),f.appendChild(b)}let d=r("div","zq-capture-slot");d.hidden=!0,f.appendChild(document.createComment(" soft-capture slot: reserved, ruling 2026-07-10 ")),f.appendChild(d);let g=j(u)||[];if(g.length>1){let b=r("div","zq-card zq-history");b.appendChild(r("h3",null,"Your attempts on this test"));let p=r("table"),S=r("tr");["Date","Mode","Questions","Score"].forEach(k=>S.appendChild(r("th",null,k))),p.appendChild(S),g.slice(0,8).forEach(k=>{let A=r("tr");A.appendChild(r("td",null,k.date)),A.appendChild(r("td",null,k.mode==="exam"?"Timed":"Practice")),A.appendChild(r("td",null,String(k.size))),A.appendChild(r("td",null,k.scorePct+"%")),p.appendChild(A)}),b.appendChild(p),f.appendChild(b)}}let ge=!0,W=null;typeof IntersectionObserver=="function"&&(W=new IntersectionObserver(n=>{for(let l of n)ge=l.isIntersecting},{threshold:0}),W.observe(e));function Ue(){if(W)return ge;let n=e.getBoundingClientRect(),l=window.innerHeight||document.documentElement.clientHeight,s=window.innerWidth||document.documentElement.clientWidth;return n.bottom>0&&n.top<l&&n.right>0&&n.left<s}function ze(n){if(!i||n.target&&(n.target.tagName==="INPUT"||n.target.tagName==="TEXTAREA")||!Ue())return;let l=n.key;if(l>="1"&&l<="4"){let s=Number(l)-1;i.checked[i.idx]||(fe(s),n.preventDefault())}else if(l==="Enter"){let s=e.querySelector("[data-zq-check]"),z=e.querySelector("[data-zq-next]");s&&!s.disabled?(me(),n.preventDefault()):z&&(z.click(),n.preventDefault())}}document.addEventListener("keydown",ze);function je(){H(),W&&W.disconnect(),document.removeEventListener("keydown",ze),Y(e)}function Ge(n){i&&(i.remainingSec=n,ue())}return J(),{destroy:je,__debugSetRemainingSec:Ge}}function et(e,t){if(t!=="metric"||!e||!e.si)return e;let a=e.si;return Object.assign({},e,{text:a.text,choices:a.choices,correctIndex:a.correctIndex,explanation:a.explanation,formula:a.formula==null?e.formula:a.formula,unitSystem:"metric"})}function Me(e,t){let a=(e.questions||[]).map(c=>et(c,t)),o=(e.questions||[]).filter(c=>c&&c.si).length;return Object.assign({},e,{questions:a,variants:{system:t,total:a.length,withSi:o}})}function Le(){let e=document.getElementById("ziptility-practice");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zpt-practice-styles")){let m=document.createElement("style");m.id="zpt-practice-styles",m.textContent=ve,document.head.appendChild(m)}if(!document.getElementById("zpt-practice-fonts")){let m=document.createElement("link");m.rel="preconnect",m.href="https://fonts.googleapis.com";let i=document.createElement("link");i.rel="preconnect",i.href="https://fonts.gstatic.com",i.crossOrigin="anonymous";let N=document.createElement("link");N.id="zpt-practice-fonts",N.rel="stylesheet",N.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(m,i,N)}let t=!1,a=null;try{let m=new URLSearchParams(window.location.search);t=m.get("embed")==="app",a=m.get("test")}catch{}t||(t=e.dataset.embed==="app"),a||(a=e.dataset.test||null),t&&e.classList.add("zq-embed-app");let o=e.dataset.childPages==="1",c=e.dataset.bankBase||ye,u=e.dataset.hubUrl||Z.hubUrl;e.innerHTML="";let y=document.createElement("div");y.className="zq-wrap",e.appendChild(y);let h=null;function f(){h&&(h.destroy(),h=null),qe(y,{onSelect:w,childPages:o,hubUrl:u})}function w(m,i){xe(y),we(m.id,m.bankVersion,c).then(N=>{let G={...Z,embedApp:t,hubUrl:u,title:m.title,badge:m.badge,deepLinked:!!i,slug:m.slug};h=Ae(y,Me(N,K()),G,{onExit:i?null:f}),e.dataset.debug==="1"&&(e.__zqDebug=h)}).catch(()=>{ie(y,{message:'Could not load "'+m.title+'." Check your connection and try again.',onRetry:()=>w(m,i)})})}if(a){let m=V.find(i=>i.slug===a||i.id===a);m?w(m,!0):ie(y,{message:'This practice test is not available at "'+a+'." Pick a test from the full list instead.',hubUrl:u})}else f()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Le):Le();})();
