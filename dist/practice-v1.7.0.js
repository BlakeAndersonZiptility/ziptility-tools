/* Ziptility Practice Tests practice-v1.7.0 (8a8a0ca5504ce51a4bdf58bcbb68e127e3d67995) — https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var ge=`/* Ziptility practice tests: DS 4.0 reskin, ported from
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
`;var J={calcUrl:"/tools/calculator",formulaSheetUrl:"/tools/formula-sheets",contactEmail:"sales@ziptility.com",hubUrl:"/tools/practice"};var ze="https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-banks/",H=[{id:"operator-math-1",slug:"operator-math",title:"Operator math practice test",badge:"Operator math \xB7 Levels 1-2 (ABC Class I-II)",discipline:"Operator Math",level:"Levels 1-2 (ABC Class I-II)",description:"Unit conversions, flow, dosing, and the 8.34 pounds formula, worked out in plain English.",questionCount:110,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"regulations-1",slug:"regulations",title:"Water and wastewater regulations practice test (federal)",badge:"Federal regulations \xB7 Entry to working level",discipline:"Regulations (Federal)",level:"Entry to working level (ABC Class I-II)",description:"The federal rules an operator answers to: the Safe Drinking Water Act, the Clean Water Act, monitoring and reporting, public notice, and recordkeeping. Every answer carries a citation.",questionCount:103,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wd-1",slug:"water-distribution",title:"Water distribution operator practice test, Class I",badge:"Water distribution \xB7 Class I entry level",discipline:"Water Distribution",level:"Entry level (ABC Class I)",description:"Mains, valves, hydrants, storage, pumps, cross-connection control, flushing, sampling, and crew safety. Machine-checked math and cited answers.",questionCount:125,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wwc-1",slug:"wastewater-collection",title:"Wastewater collection operator practice test, Class I",badge:"Wastewater collection \xB7 Class I entry level",discipline:"Wastewater Collections",level:"Entry level (ABC Class I)",description:"Gravity mains, manholes, lift stations, cleaning and CCTV, infiltration and inflow, SSO response, and confined-space and trench safety. Cited answers throughout.",questionCount:120,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wt-1",slug:"water-treatment",title:"Water treatment operator practice test, Class I",badge:"Water treatment \xB7 Class I entry level",discipline:"Water Treatment",level:"Entry level (ABC Class I)",description:"Coagulation and jar testing, sedimentation, filtration, disinfection and CT, source water, plant pumps and chemical feeders, lab work, and chlorine safety. Machine-checked math and cited answers.",questionCount:128,durationMin:120,refCount:100,bankVersion:"1.0.0"},{id:"wwt-1",slug:"wastewater-treatment",title:"Wastewater treatment operator practice test, Class I",badge:"Wastewater treatment \xB7 Class I entry level",discipline:"Wastewater Treatment",level:"Entry level (ABC Class I)",description:"Preliminary and primary treatment, activated sludge, clarifiers, trickling filters and lagoons, disinfection, solids handling, blowers and clarifier drives, lab work, and H2S and confined-space safety. Cited answers throughout.",questionCount:119,durationMin:120,refCount:100,bankVersion:"1.0.0"}];function je(e){let i=new Set,o=new Set;for(let a of e){if(!a||!a.id)throw new Error("practice manifest: entry missing id");if(i.has(a.id))throw new Error('practice manifest: duplicate id "'+a.id+'"');if(i.add(a.id),!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug||""))throw new Error('practice manifest: "'+a.id+'" has a missing or non-kebab-case slug');if(o.has(a.slug))throw new Error('practice manifest: duplicate slug "'+a.slug+'"');if(o.add(a.slug),!a.title||!a.badge||!a.discipline||!a.level||!a.description)throw new Error('practice manifest: "'+a.id+'" is missing a required label field');if(!Number.isInteger(a.questionCount)||a.questionCount<=0)throw new Error('practice manifest: "'+a.id+'" has a bad questionCount');if(!Number.isInteger(a.durationMin)||a.durationMin<=0)throw new Error('practice manifest: "'+a.id+'" has a bad durationMin');if(!Number.isInteger(a.refCount)||a.refCount<=0)throw new Error('practice manifest: "'+a.id+'" has a bad refCount');if(!/^\d+\.\d+\.\d+$/.test(a.bankVersion||""))throw new Error('practice manifest: "'+a.id+'" has a malformed bankVersion')}for(let a of e)if(i.has(a.slug)&&a.slug!==a.id)throw new Error('practice manifest: slug "'+a.slug+'" collides with another test id');return!0}je(H);var $=new Map;async function be(e,i,o){let a=e+"-v"+i;if($.has(a))return $.get(a);let p=o+a+".json",u=new AbortController,b=setTimeout(()=>u.abort(),1e4),h;try{h=await fetch(p,{signal:u.signal})}finally{clearTimeout(b)}if(!h.ok)throw new Error("practice bank fetch failed: "+p+" ("+h.status+")");let f=await h.json();return $.set(a,f),f}function C(e,i,o){let a=document.createElement(e);return i&&(a.className=i),o!=null&&(a.textContent=o),a}function Z(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var Ue=new Set(["operator-math-1","regulations-1"]);function ve(e,{onSelect:i,childPages:o=!1,hubUrl:a="/tools/practice"}){Z(e),e.appendChild(C("h2","zq-hub-section-title","Pick your test"));let p=String(a).replace(/\/+$/,""),u=C("div","zq-hub-grid"),b=!1;H.forEach(h=>{let f=Ue.has(h.id);!f&&!b&&(u.appendChild(C("div","zq-hub-groupdivider","By discipline")),b=!0);let q=C(o?"a":"button","zq-hubcard"+(f?" zq-hubcard-featured":""));o?q.href=p+"/"+h.slug:q.type="button",q.appendChild(C("span","zq-eyebrow",h.discipline)),q.appendChild(C("h3",null,h.title)),q.appendChild(C("p",null,h.description||""));let m=C("div","zq-hubcard-stat");m.appendChild(C("span","zq-hubcard-stat-num",String(h.questionCount))),m.appendChild(C("span","zq-hubcard-stat-label","questions in the bank")),q.appendChild(m),q.appendChild(C("div","zq-meta","Practice or timed exam")),o||q.addEventListener("click",()=>i(h)),u.appendChild(q)}),e.appendChild(u)}function qe(e){Z(e);let i=C("div","zq-loading");i.appendChild(C("span","zq-spinner")),i.appendChild(C("span",null,"Loading questions\u2026")),e.appendChild(i)}function ee(e,{message:i,onRetry:o,hubUrl:a}){Z(e);let p=C("div","zq-error");if(p.setAttribute("role","alert"),p.appendChild(C("h3",null,"Could not load this test")),p.appendChild(C("p",null,i||"The question set did not load. Check your connection and try again.")),o){let u=C("button","zq-btn zq-btn-secondary","Try again");u.type="button",u.addEventListener("click",o),p.appendChild(u)}if(a){let u=C("a","zq-btn zq-btn-secondary","All practice tests");u.href=a,p.appendChild(u)}e.appendChild(p)}function F(e){for(let i=e.length-1;i>0;i--){let o=Math.floor(Math.random()*(i+1)),a=e[i];e[i]=e[o],e[o]=a}return e}function te(e){let i=Math.floor(e/60),o=e%60;return i+":"+(o<10?"0":"")+o}function we(e){let i=[],o=[25,50,100];for(let a of o)a<e&&i.push(a);return i.push(e),i}function ie(e,i,o,a){let p=i||o;return Math.max(10,Math.round((a||120)*e/p))}function ye(e,i,o){let a=new Set(i||[]),p=[],u=[];for(let h of e)(a.has(h.id)?u:p).push(h);F(p),F(u);let b=p.concat(u).slice(0,o);return F(b),b.map(h=>{let f=F([0,1,2,3]);return{q:h,order:f,correctPos:f.indexOf(h.correctIndex)}})}function xe(e,i){let o=e.length,a=0,p={},u=[];for(let h=0;h<o;h++){let f=e[h],q=f.q.domain||"General";p[q]||(p[q]={n:0,ok:0}),p[q].n+=1;let m=h in i?i[h]:null;m===f.correctPos?(a+=1,p[q].ok+=1):u.push({item:f,sel:m})}let b=Math.round(100*a/o);return{correct:a,n:o,pct:b,byDomain:p,missed:u}}function Ce(e){return Object.keys(e).sort((i,o)=>e[i].ok/e[i].n-e[o].ok/e[o].n)}var We="tool_complete",Ge="tool_progress";function ke(e){try{if(typeof window>"u")return;window.dataLayer=window.dataLayer||[],window.dataLayer.push(e)}catch{}}function re(e,i){if(!e)return;let o={event:We,tool_name:String(e)};i&&typeof i=="object"&&Object.keys(i).forEach(a=>{let p=i[a];p==null||p===""||typeof p!="object"&&(o["tool_"+a]=typeof p=="number"?p:String(p))}),ke(o)}function Se(e,i,o){!e||!o||ke({event:Ge,tool_name:String(e),tool_answered:Number(i),tool_total:Number(o),tool_percent:Math.round(Number(i)/Number(o)*100)})}function ne(e){let i={},o=(e||[25,50,75]).slice().sort((a,p)=>a-p);return function(p,u){if(!u)return null;let b=p/u*100;for(let h=o.length-1;h>=0;h--){let f=o[h];if(b>=f&&!i[f])return i[f]=!0,f}return null}}var ae={MATH:"Operator math",CHEM:"Chemistry",MICRO:"Microbiology",REGS:"Regulations",SAMP:"Sampling",SAFE:"Safety",PROC:"Process control",EQIP:"Equipment",ADMIN:"Administration",Multiple:"Mixed topics"};function He(e){try{return window.localStorage.getItem(e)}catch{return null}}function oe(e,i){try{window.localStorage.setItem(e,i)}catch{}}function Ve(e){try{window.localStorage.removeItem(e)}catch{}}function U(e){let i=He(e);if(!i)return null;try{return JSON.parse(i)}catch{return null}}function r(e,i,o){let a=document.createElement(e);return i&&(a.className=i),o!=null&&(a.textContent=o),a}function V(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var Ye='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';function M(e,i,{arrow:o=!1}={}){let a=r("button",i);a.type="button";let p=r("span","zq-btn-label",e);if(a.appendChild(p),o){let u=document.createElement("span");u.className="zq-arrow",u.innerHTML=Ye,a.appendChild(u)}return a}function Fe(e,i){let o=e.querySelector(".zq-btn-label");o&&(o.textContent=i)}function Ee(e,i,o,{onExit:a}={}){let p="zpt-pt-session-"+i.id,u="zpt-pt-history-"+i.id,b="zpt-pt-seen-"+i.id,h={};for(let n of i.questions)h[n.id]=n;V(e);let f=r("div"),q=r("div","zq-visually-hidden");q.setAttribute("aria-live","polite"),e.appendChild(f),e.appendChild(q);function m(n){q.textContent=n}let t=null,N="practice-"+(o.slug||i.id),W=ne([25,50,75]);function se(n,c){if(W=ne([25,50,75]),n>0)for(let s=0;s<4&&W(n,c);s++);}function Ie(){try{let n=Object.keys(t.answers).length;W(n,t.qs.length)&&Se(N,n,t.qs.length)}catch{}}let E={mode:"practice",size:null};function _(){t&&oe(p,JSON.stringify({v:1,bankVersion:i.version||"",mode:t.mode,size:t.size,qids:t.qs.map(n=>n.q.id),orders:t.qs.map(n=>n.order),answers:t.answers,checked:t.checked,idx:t.idx,remainingSec:t.remainingSec}))}function Ae(){let n=U(p);if(!n||n.v!==1||n.bankVersion!==(i.version||"")||!n.qids||!n.qids.length)return null;for(let c of n.qids)if(!h[c])return null;return n}function Q(){Ve(p)}function Le(n){let c=U(u)||[];c.unshift(n),c.length>25&&(c=c.slice(0,25)),oe(u,JSON.stringify(c))}function Me(n){let s=(U(b)||[]).concat(n);s.length>600&&(s=s.slice(s.length-600)),oe(b,JSON.stringify(s))}function K(){Y(),t=null,V(f);let n=r("div");n.appendChild(r("span","zq-badge",o.badge||i.discipline||"")),n.appendChild(r("h2","zq-title",o.title||i.title)),f.appendChild(n);let c=Ae();if(c){let d=r("div","zq-resume"),g=r("div");g.appendChild(r("strong",null,"You have a test in progress. ")),g.appendChild(document.createTextNode((c.mode==="exam"?"Timed exam":"Practice")+", question "+(c.idx+1)+" of "+c.qids.length+".")),d.appendChild(g);let z=r("div","zq-navrow"),l=M("Resume","zq-btn zq-btn-primary",{arrow:!0});l.addEventListener("click",()=>Ne(c));let S=M("Discard","zq-btn zq-btn-quiet");S.addEventListener("click",()=>{Q(),K()}),z.appendChild(l),z.appendChild(S),d.appendChild(z),f.appendChild(d)}let s=r("div","zq-card");s.appendChild(r("h2",null,"Set up your test"));let w=r("div","zq-mode-grid"),y=[{id:"practice",name:"Practice",desc:"Check each answer as you go. Every question shows a plain-English explanation."},{id:"exam",name:"Timed exam",desc:"No feedback until the end, with a clock running. The closest thing to test day."}],x={};y.forEach(d=>{let g=r("button","zq-mode"+(E.mode===d.id?" zq-selected":""));g.type="button",g.appendChild(r("h3",null,d.name)),g.appendChild(r("p",null,d.desc)),g.addEventListener("click",()=>{E.mode=d.id;for(let z in x)x[z].classList.toggle("zq-selected",z===d.id);I()}),x[d.id]=g,w.appendChild(g)}),s.appendChild(w);let v=we(i.questions.length);(E.size===null||v.indexOf(E.size)===-1)&&(E.size=v[0]);let O=r("div","zq-size-row"),B={};v.forEach(d=>{let g=r("button","zq-size"+(E.size===d?" zq-selected":""));g.type="button",g.appendChild(document.createTextNode(d===i.questions.length&&v.length>1?"All "+d:String(d))),g.appendChild(r("small",null,"questions")),g.addEventListener("click",()=>{E.size=d;for(let z in B)B[z].classList.toggle("zq-selected",Number(z)===d);I()}),B[d]=g,O.appendChild(g)}),s.appendChild(O);let L=r("div","zq-navrow"),R=M("","zq-btn zq-btn-primary",{arrow:!0});R.addEventListener("click",()=>ce(E.mode,E.size)),L.appendChild(R),s.appendChild(L),f.appendChild(s);function I(){Fe(R,E.mode==="exam"?"Start timed exam ("+E.size+" questions, "+ie(E.size,i.refCount,i.questions.length,i.durationMin)+" min)":"Start practice ("+E.size+" questions)")}I();let T=U(u)||[];if(T.length){let d=0;for(let g of T)g.scorePct>d&&(d=g.scorePct);f.appendChild(r("p","zq-best","Your best score on this test so far: "+d+" percent. Attempts: "+T.length+"."))}}function ce(n,c){Q();let s=U(b)||[];t={mode:n,size:c,qs:ye(i.questions,s,c),idx:0,answers:{},checked:{},remainingSec:n==="exam"?ie(c,i.refCount,i.questions.length,i.durationMin)*60:0,timerId:null},_(),se(0,t.qs.length),n==="exam"&&le(),D()}function Ne(n){t={mode:n.mode,size:n.size,qs:n.qids.map((c,s)=>{let w=h[c],y=n.orders[s];return{q:w,order:y,correctPos:y.indexOf(w.correctIndex)}}),idx:n.idx||0,answers:n.answers||{},checked:n.checked||{},remainingSec:n.remainingSec||0,timerId:null},se(Object.keys(t.answers).length,t.qs.length),t.mode==="exam"&&le(),D()}function de(){let n=e.querySelector(".zq-timer");n&&(n.textContent=te(Math.max(0,t.remainingSec)),n.classList.toggle("zq-low",t.remainingSec<=120)),t.remainingSec%15===0&&_(),t.remainingSec<=0&&(m("Time is up. Scoring your exam."),X())}function le(){Y(),t.timerId=setInterval(()=>{t.remainingSec-=1,de()},1e3)}function Y(){t&&t.timerId&&(clearInterval(t.timerId),t.timerId=null)}function D(){V(f);let n=t.qs[t.idx],c=n.q,s=t.qs.length,w=!!t.checked[t.idx],y=t.idx in t.answers?t.answers[t.idx]:null,x=r("div","zq-topbar"),v=r("div");if(v.appendChild(document.createTextNode("Question "+(t.idx+1)+" of "+s+"  ")),v.appendChild(r("span","zq-domchip",ae[c.domain]||c.domain||"General")),x.appendChild(v),t.mode==="exam"){let d=r("span","zq-timer",te(Math.max(0,t.remainingSec)));t.remainingSec<=120&&d.classList.add("zq-low"),x.appendChild(d)}f.appendChild(x);let O=r("div","zq-progressbar"),B=r("i");B.style.width=Math.round(100*t.idx/s)+"%",O.appendChild(B),f.appendChild(O);let L=r("div","zq-card");L.appendChild(r("div","zq-stem",c.text));let R=r("ul","zq-choices"),I=["A","B","C","D"];n.order.forEach((d,g)=>{let z=r("li"),l=r("button","zq-choice");l.type="button",l.appendChild(r("span","zq-letter",I[g])),l.appendChild(r("span",null,c.choices[d])),y===g&&l.classList.add("zq-selected"),w?(l.disabled=!0,g===n.correctPos?(l.classList.remove("zq-selected"),l.classList.add("zq-correct")):y===g&&(l.classList.remove("zq-selected"),l.classList.add("zq-wrong"))):l.addEventListener("click",()=>pe(g)),z.appendChild(l),R.appendChild(z)}),L.appendChild(R),w&&L.appendChild(Oe(n,y));let T=r("div","zq-navrow");if(t.mode==="exam"){let d=M("Previous","zq-btn zq-btn-quiet");if(d.disabled=t.idx===0,d.addEventListener("click",()=>{t.idx-=1,_(),D()}),T.appendChild(d),T.appendChild(r("span","zq-spacer")),t.idx<s-1){let l=M("Next","zq-btn zq-btn-primary",{arrow:!0});l.addEventListener("click",()=>{t.idx+=1,_(),D()}),T.appendChild(l)}let g=0;for(let l in t.answers)t.answers[l]!==null&&g++;let z=M("Submit ("+g+"/"+s+" answered)",t.idx===s-1?"zq-btn zq-btn-primary":"zq-btn zq-btn-secondary");z.addEventListener("click",()=>{g<s&&!window.confirm("You have unanswered questions. Submit anyway?")||X()}),T.appendChild(z)}else if(T.appendChild(r("span","zq-spacer")),w){let d=M(t.idx<s-1?"Next question":"See your score","zq-btn zq-btn-primary",{arrow:!0});d.setAttribute("data-zq-next",""),d.addEventListener("click",()=>{t.idx<s-1?(t.idx+=1,_(),D()):X()}),T.appendChild(d)}else{let d=M("Check answer","zq-btn zq-btn-primary");d.setAttribute("data-zq-check",""),d.disabled=y===null,d.addEventListener("click",ue),T.appendChild(d)}L.appendChild(T),f.appendChild(L);try{e.scrollIntoView({block:"start"})}catch{}}function pe(n){t.answers[t.idx]=n,_(),Ie(),D()}function ue(){if(!(t.idx in t.answers))return;t.checked[t.idx]=!0,_();let n=t.qs[t.idx];m(t.answers[t.idx]===n.correctPos?"Correct.":"Not quite. The explanation is shown below."),D()}function Oe(n,c){let s=n.q,w=c===n.correctPos,y=r("div","zq-feedback "+(w?"zq-ok":"zq-err"));y.appendChild(r("h4",w?"zq-okt":"zq-errt",w?"Correct":"Not quite")),s.explanation&&y.appendChild(r("p","zq-explain",s.explanation)),s.formula&&y.appendChild(r("div","zq-formula",s.formula)),s.citation&&y.appendChild(r("div","zq-cite","Source: "+s.citation));let x=r("div","zq-minilinks");if(s.calculator&&o.calcUrl){let v=r("a",null,"Run this math in the Operator Calculator");v.href=o.calcUrl+"#"+s.calculator,v.target="_blank",v.rel="noopener",x.appendChild(v)}if(o.contactEmail){let v=r("a",null,"Report a problem with this question");v.href="mailto:"+o.contactEmail+"?subject="+encodeURIComponent("Practice test question "+s.id),x.appendChild(v)}return x.childNodes.length&&y.appendChild(x),y}function X(){Y();let{correct:n,n:c,pct:s,byDomain:w,missed:y}=xe(t.qs,t.answers);if(!t.completeSent){t.completeSent=!0;try{let x=(U(u)||[]).length;re(N,{mode:t.mode,size:c,score_pct:s,passed:s>=70?"yes":"no",attempt:x+1,deep_linked:o.deepLinked?"yes":"no"})}catch{re(N)}}Le({date:new Date().toISOString().slice(0,10),mode:t.mode,size:c,scorePct:s}),Me(t.qs.map(x=>x.q.id)),Q(),Be(s,n,c,w,y)}function Be(n,c,s,w,y){V(f);let x=n>=70,v=r("div","zq-card zq-score-hero");v.appendChild(r("div","zq-score-num "+(x?"zq-pass":"zq-fail"),n+"%")),v.appendChild(r("div","zq-score-verdict "+(x?"zq-tag-ok":"zq-tag-err"),x?"Pass at the 70 percent line":"Below the 70 percent line")),v.appendChild(r("div","zq-score-sub",c+" of "+s+" correct"+(t.mode==="exam"?" on a timed exam":""))),v.appendChild(r("p","zq-passnote","Most states set the pass line at 70 percent. Your state's rules govern, so check your certification program for the real requirement.")),m("You scored "+n+" percent, "+c+" of "+s+" correct. "+(x?"That clears the 70 percent line.":"That is below the 70 percent line."));let O=r("div","zq-navrow zq-navrow-center"),B=M("Take it again (new draw)","zq-btn zq-btn-primary",{arrow:!0});B.addEventListener("click",()=>ce(t.mode,s));let L=M("Change setup","zq-btn zq-btn-secondary");L.addEventListener("click",K);let R=o.deepLinked&&o.hubUrl,I;if(R?(I=r("a","zq-btn zq-btn-quiet"),I.href=o.hubUrl,I.appendChild(r("span","zq-btn-label","All practice tests"))):(I=M("All practice tests","zq-btn zq-btn-quiet"),I.addEventListener("click",()=>{a&&a()})),O.appendChild(B),O.appendChild(L),O.appendChild(I),v.appendChild(O),f.appendChild(v),Object.keys(w).length>1){let z=r("div","zq-card zq-dombars");z.appendChild(r("h3",null,"Where you stand by topic")),Ce(w).forEach(l=>{let S=w[l],k=Math.round(100*S.ok/S.n),A=r("div","zq-dombar"+(k<70?" zq-weak":"")),j=r("div","zq-domlabel");j.appendChild(r("span",null,ae[l]||l)),j.appendChild(r("span",null,S.ok+"/"+S.n+" ("+k+"%)")),A.appendChild(j);let P=r("div","zq-track"),me=r("span","zq-fill");me.style.width=k+"%",P.appendChild(me),A.appendChild(P),z.appendChild(A)}),f.appendChild(z)}if(y.length){let z=r("div","zq-card zq-missed");z.appendChild(r("h3",null,"Review what you missed ("+y.length+")")),y.forEach(l=>{let S=r("details");S.appendChild(r("summary",null,l.item.q.text));let k=r("div","zq-missed-body"),A=["A","B","C","D"];if(l.sel!==null&&l.sel!==void 0){let P=r("p");P.appendChild(r("span","zq-tag-err","Your answer: ")),P.appendChild(document.createTextNode(A[l.sel]+". "+l.item.q.choices[l.item.order[l.sel]])),k.appendChild(P)}else{let P=r("p");P.appendChild(r("span","zq-tag-err","Skipped.")),k.appendChild(P)}let j=r("p");j.appendChild(r("span","zq-tag-ok","Correct answer: ")),j.appendChild(document.createTextNode(A[l.item.correctPos]+". "+l.item.q.choices[l.item.q.correctIndex])),k.appendChild(j),l.item.q.explanation&&k.appendChild(r("p","zq-explain",l.item.q.explanation)),l.item.q.formula&&k.appendChild(r("div","zq-formula",l.item.q.formula)),l.item.q.citation&&k.appendChild(r("div","zq-cite","Source: "+l.item.q.citation)),S.appendChild(k),z.appendChild(S)}),f.appendChild(z)}let d=r("div","zq-capture-slot");d.hidden=!0,f.appendChild(document.createComment(" soft-capture slot: reserved, ruling 2026-07-10 ")),f.appendChild(d);let g=U(u)||[];if(g.length>1){let z=r("div","zq-card zq-history");z.appendChild(r("h3",null,"Your attempts on this test"));let l=r("table"),S=r("tr");["Date","Mode","Questions","Score"].forEach(k=>S.appendChild(r("th",null,k))),l.appendChild(S),g.slice(0,8).forEach(k=>{let A=r("tr");A.appendChild(r("td",null,k.date)),A.appendChild(r("td",null,k.mode==="exam"?"Timed":"Practice")),A.appendChild(r("td",null,String(k.size))),A.appendChild(r("td",null,k.scorePct+"%")),l.appendChild(A)}),z.appendChild(l),f.appendChild(z)}}let he=!0,G=null;typeof IntersectionObserver=="function"&&(G=new IntersectionObserver(n=>{for(let c of n)he=c.isIntersecting},{threshold:0}),G.observe(e));function Pe(){if(G)return he;let n=e.getBoundingClientRect(),c=window.innerHeight||document.documentElement.clientHeight,s=window.innerWidth||document.documentElement.clientWidth;return n.bottom>0&&n.top<c&&n.right>0&&n.left<s}function fe(n){if(!t||n.target&&(n.target.tagName==="INPUT"||n.target.tagName==="TEXTAREA")||!Pe())return;let c=n.key;if(c>="1"&&c<="4"){let s=Number(c)-1;t.checked[t.idx]||(pe(s),n.preventDefault())}else if(c==="Enter"){let s=e.querySelector("[data-zq-check]"),w=e.querySelector("[data-zq-next]");s&&!s.disabled?(ue(),n.preventDefault()):w&&(w.click(),n.preventDefault())}}document.addEventListener("keydown",fe);function Re(){Y(),G&&G.disconnect(),document.removeEventListener("keydown",fe),V(e)}function _e(n){t&&(t.remainingSec=n,de())}return K(),{destroy:Re,__debugSetRemainingSec:_e}}function Te(){let e=document.getElementById("ziptility-practice");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zpt-practice-styles")){let m=document.createElement("style");m.id="zpt-practice-styles",m.textContent=ge,document.head.appendChild(m)}if(!document.getElementById("zpt-practice-fonts")){let m=document.createElement("link");m.rel="preconnect",m.href="https://fonts.googleapis.com";let t=document.createElement("link");t.rel="preconnect",t.href="https://fonts.gstatic.com",t.crossOrigin="anonymous";let N=document.createElement("link");N.id="zpt-practice-fonts",N.rel="stylesheet",N.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(m,t,N)}let i=!1,o=null;try{let m=new URLSearchParams(window.location.search);i=m.get("embed")==="app",o=m.get("test")}catch{}i||(i=e.dataset.embed==="app"),o||(o=e.dataset.test||null),i&&e.classList.add("zq-embed-app");let a=e.dataset.childPages==="1",p=e.dataset.bankBase||ze,u=e.dataset.hubUrl||J.hubUrl;e.innerHTML="";let b=document.createElement("div");b.className="zq-wrap",e.appendChild(b);let h=null;function f(){h&&(h.destroy(),h=null),ve(b,{onSelect:q,childPages:a,hubUrl:u})}function q(m,t){qe(b),be(m.id,m.bankVersion,p).then(N=>{let W={...J,embedApp:i,hubUrl:u,title:m.title,badge:m.badge,deepLinked:!!t,slug:m.slug};h=Ee(b,N,W,{onExit:t?null:f}),e.dataset.debug==="1"&&(e.__zqDebug=h)}).catch(()=>{ee(b,{message:'Could not load "'+m.title+'." Check your connection and try again.',onRetry:()=>q(m,t)})})}if(o){let m=H.find(t=>t.slug===o||t.id===o);m?q(m,!0):ee(b,{message:'This practice test is not available at "'+o+'." Pick a test from the full list instead.',hubUrl:u})}else f()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Te):Te();})();
