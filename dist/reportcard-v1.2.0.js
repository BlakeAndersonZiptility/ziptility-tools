/* Ziptility Utility Health Report Card reportcard-v1.2.0 (39f352ed92dfff09cdc45f55679112f3a349e2b2) https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var K=`/* Utility Health Report Card: DS 4.0 reskin. Token block is copied 1:1
   from src/practice/styles.css (the sanctioned raw-hex site); every rule
   below it references a token or a value computed in JS (GRADE_COLORS in
   ui/util.js), never a bare hex typed twice. Everything nests under
   #ziptility-report-card: no bare *, html, or body selectors, so this
   tool can never leak style onto the host page around it. The tool
   paints no page background; the host page owns gutters/background. */
#ziptility-report-card{
  --tomato:#ff442f;
  --tomato-press:#c02100;
  --tomato-tint:#fff4f2;
  --midnight:#0c1f30;
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
  --warm-50:#fcfaf6;
  --warm-100:#f9f3ec;
  --warm-400:#e6dac9;
  --linen:#f6eee6;
  --info:#0088ff;
  --shadow-xs:0 1px 2px rgba(12,31,48,.06);
  --shadow-sm:0 2px 8px rgba(12,31,48,.08);
  --shadow-md:0 8px 24px rgba(12,31,48,.10);
  --radius:10px;
  --radius-sm:6px;
  --radius-lg:16px;
  --radius-pill:999px;
  --dur:200ms;
  --ease:cubic-bezier(.4,0,.2,1);
  --font-sans:'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-ui:'Geist', var(--font-sans);

  margin:0;
  color:var(--n600);
  font-family:var(--font-sans);
  font-size:16px;
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
#ziptility-report-card *,
#ziptility-report-card *::before,
#ziptility-report-card *::after{ box-sizing:border-box; }

#ziptility-report-card .zrc-wrap{ max-width:56rem; margin:0 auto; }
/* WIDER ON DESKTOP so the tool is not a tall narrow ribbon inside a 1185px
   page container (Blake, 2026-07-29). Only the WRAP widens: prose keeps its
   own reading measure below (.zrc-lede 620px, .zrc-section-lede 640px), so
   line length does not blow out. The height comes off the grids, which get
   to sit side by side instead of stacking. */
@media (min-width:1040px){
  #ziptility-report-card .zrc-wrap{ max-width:72rem; }
}

/* ---------- focus (C1: #0088ff site-wide) ---------- */
#ziptility-report-card button:focus-visible,
#ziptility-report-card a:focus-visible,
#ziptility-report-card input:focus-visible,
#ziptility-report-card select:focus-visible{
  outline:2px solid var(--info);
  outline-offset:2px;
}
#ziptility-report-card .zrc-rung:focus-within{
  outline:2px solid var(--info);
  outline-offset:2px;
}

/* ---------- generic type ---------- */
#ziptility-report-card .zrc-h1{
  font-family:var(--font-sans); font-weight:900; font-size:clamp(26px,3.4vw,38px);
  letter-spacing:-0.02em; line-height:1.1; color:var(--midnight); margin:0 0 14px;
}
#ziptility-report-card .zrc-h2{
  font-family:var(--font-sans); font-weight:900; font-size:clamp(20px,2.4vw,26px);
  letter-spacing:-0.01em; color:var(--midnight); margin:0 0 6px;
}
#ziptility-report-card .zrc-h2-sm{
  font-family:var(--font-sans); font-weight:800; font-size:19px; color:var(--midnight); margin:0 0 8px;
}
#ziptility-report-card .zrc-section-lede{ font-size:15px; line-height:1.55; color:var(--n600); margin:0 0 20px; max-width:640px; }
#ziptility-report-card section{ margin:40px 0; }
#ziptility-report-card section:first-of-type{ margin-top:0; }

/* ---------- buttons ---------- */
#ziptility-report-card .zrc-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
  font-family:var(--font-sans); font-weight:700; font-size:15px;
  border-radius:var(--radius); border:2px solid transparent; cursor:pointer;
  padding:.9rem 1.6rem; transition:background var(--dur) var(--ease), border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
#ziptility-report-card .zrc-btn[disabled]{ opacity:.5; cursor:not-allowed; }
/* D2: white-on-tomato measured 3.43:1. 15px/700 text does not qualify for
   the WCAG large-text carve-out (needs 18.66px bold or 24px regular), so
   4.5:1 is the real floor and tomato fails it on every primary button on
   every screen. White-on-tomato-press measures 6.07:1, so tomato-press is
   now the RESTING background, not just the old hover state. Hover darkens
   further with brightness() rather than swapping to a new named colour:
   darkening an already-passing background can only raise its contrast
   against white text, never risk it, so no new ratio needs checking. */
#ziptility-report-card .zrc-btn-primary{ background:var(--tomato-press); color:var(--white); }
#ziptility-report-card .zrc-btn-primary:hover:not([disabled]){ filter:brightness(0.85); }
#ziptility-report-card .zrc-btn-secondary{ background:transparent; color:var(--tomato-press); border-color:var(--tomato); }
#ziptility-report-card .zrc-btn-secondary:hover:not([disabled]){ background:var(--tomato-tint); }
#ziptility-report-card .zrc-btn-quiet{ background:var(--white); color:var(--midnight); border-color:var(--n200); }
#ziptility-report-card .zrc-btn-quiet:hover:not([disabled]){ border-color:var(--n300); }
#ziptility-report-card .zrc-link-btn{
  background:transparent; border:none; padding:6px 2px; cursor:pointer;
  font-family:var(--font-ui); font-weight:600; font-size:13px; color:var(--tomato-press);
  text-decoration:underline;
}

/* ---------- landing ---------- */
#ziptility-report-card .zrc-landing{ padding:8px 0 24px; }
#ziptility-report-card .zrc-eyebrow{
  display:inline-flex; align-items:center; gap:8px; background:var(--white);
  border:1px solid var(--n200); border-radius:var(--radius-pill); padding:6px 13px;
  font-family:var(--font-ui); font-size:13px; font-weight:600; color:var(--n600); margin-bottom:20px;
}
#ziptility-report-card .zrc-eyebrow-dot{ width:7px; height:7px; border-radius:999px; background:#16a34a; }
#ziptility-report-card .zrc-lede{ font-size:18px; line-height:1.6; color:var(--n600); max-width:620px; margin:0 0 28px; }
#ziptility-report-card .zrc-facts{ display:grid; grid-template-columns:1fr; gap:16px; margin-bottom:28px; }
/* Three fact cards stacked was 369px of the landing screen's 711px, measured
   on production 2026-07-29. Side by side they cost a fraction of that. */
@media (min-width:720px){
  #ziptility-report-card .zrc-facts{ grid-template-columns:1fr 1fr; }
}
@media (min-width:1040px){
  #ziptility-report-card .zrc-facts{ grid-template-columns:repeat(3,1fr); }
}
#ziptility-report-card .zrc-fact{ background:var(--warm-50); border-radius:var(--radius); padding:18px 20px; }
#ziptility-report-card .zrc-fact-label{ font-size:15px; font-weight:700; color:var(--midnight); margin:0 0 6px; }
#ziptility-report-card .zrc-fact-body{ font-size:14.5px; line-height:1.55; color:var(--n600); margin:0; }
#ziptility-report-card .zrc-actions{ display:flex; gap:12px; flex-wrap:wrap; }

/* ---------- shared top bar / progress ---------- */
#ziptility-report-card .zrc-topbar{
  display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;
  font-size:13px; color:var(--n600); margin-bottom:12px;
}
#ziptility-report-card .zrc-topbar-count{ font-family:var(--font-ui); font-weight:600; color:var(--n700); }

#ziptility-report-card .zrc-legbars{ display:flex; gap:16px; margin-bottom:22px; flex-wrap:wrap; }
#ziptility-report-card .zrc-legbar{ flex:1; min-width:140px; }
#ziptility-report-card .zrc-legbar-current .zrc-legbar-label span:first-child{ color:var(--midnight); }
#ziptility-report-card .zrc-legbar-label{
  display:flex; justify-content:space-between; font-family:var(--font-ui); font-size:12px;
  font-weight:600; color:var(--n500); margin-bottom:4px;
}
#ziptility-report-card .zrc-legbar-track{ height:7px; background:var(--n200); border-radius:var(--radius-pill); overflow:hidden; }
#ziptility-report-card .zrc-legbar-fill{ display:block; height:100%; border-radius:var(--radius-pill); transition:width var(--dur) var(--ease); }

/* ---------- jump nav ---------- */
#ziptility-report-card .zrc-jumpnav{ margin-bottom:22px; }
#ziptility-report-card .zrc-jumpgroup{ margin-bottom:8px; }
/* D4: --n400 measured 2.46-2.56:1 here, which fails 4.5:1. This eyebrow
   names WHICH dimension a chip is about - informational, not decorative -
   so it does not get a decorative-text pass. --n600 measures ~7.6:1 on
   white and stays a CSS custom property in print, so it survives there
   too (checked: this is not one of the print rules that hard-codes #000). */
#ziptility-report-card .zrc-jumpgroup-label{
  display:block; font-family:var(--font-ui); font-size:11px; font-weight:700; letter-spacing:.04em;
  text-transform:uppercase; color:var(--n600); margin-bottom:5px;
}
/* D3: chips measured 28px tall at both 500px and 1280px - below the 44px
   touch-target floor at every width, since nothing here was responsive to
   begin with. min-height (not just padding) guarantees 44px regardless of
   the short "T7"-style label, and the gap widens from 6px so a near-miss
   lands on empty space instead of the neighbouring chip. */
#ziptility-report-card .zrc-jumprow{ display:flex; flex-wrap:wrap; gap:10px; }
#ziptility-report-card .zrc-jumpbtn{
  display:inline-flex; align-items:center; justify-content:center;
  font-family:var(--font-ui); font-weight:600; font-size:12px; color:var(--n600);
  background:var(--white); border:1px solid var(--n200); border-radius:var(--radius-sm);
  padding:5px 10px; cursor:pointer; min-width:44px; min-height:44px;
}
#ziptility-report-card .zrc-jumpbtn:hover{ border-color:var(--n300); }
#ziptility-report-card .zrc-jumpbtn-answered{ color:var(--midnight); border-color:var(--n300); background:var(--n50); }
#ziptility-report-card .zrc-jumpbtn-current{ border-color:var(--tomato); background:var(--tomato-tint); color:var(--midnight); }
/* Used both as a <button> (intake.js) and an <a> (results.js's All-23
   jump nav, C4) - links get the same reset so the two look identical. */
#ziptility-report-card a.zrc-jumpbtn{ text-decoration:none; }

/* ---------- cards ---------- */
#ziptility-report-card .zrc-card{
  background:var(--white); border-radius:var(--radius-lg); box-shadow:var(--shadow-md); padding:1.75rem;
}
@media (max-width:559px){ #ziptility-report-card .zrc-card{ padding:1.25rem; } }

/* ---------- intake step ---------- */
#ziptility-report-card .zrc-step-meta{ display:flex; gap:8px; align-items:center; margin-bottom:12px; flex-wrap:wrap; }
#ziptility-report-card .zrc-legbadge{
  display:inline-block; font-family:var(--font-ui); font-size:12px; font-weight:600; letter-spacing:.03em;
  text-transform:uppercase; color:var(--n700); background:var(--n100); border-radius:var(--radius-pill); padding:4px 11px;
}
#ziptility-report-card .zrc-critical-badge{
  display:inline-block; font-family:var(--font-ui); font-size:12px; font-weight:700;
  color:#b91c1c; background:#fef2f2; border-radius:var(--radius-pill); padding:4px 11px;
}
#ziptility-report-card .zrc-step-title{
  font-size:clamp(21px,2.6vw,27px); font-weight:900; letter-spacing:-0.01em; color:var(--midnight); margin:0 0 8px;
}
#ziptility-report-card .zrc-step-def{ font-size:15.5px; line-height:1.55; color:var(--n600); margin:0 0 18px; }
#ziptility-report-card .zrc-step-instruction{
  font-family:var(--font-ui); font-size:13px; font-weight:600; color:var(--midnight); margin-bottom:12px;
}

/* ---------- radio rungs (BLIND INTAKE, Blake ruling 2026-07-29) ----------
   intake.js renders each rung as description-only, in a shuffled order,
   with no letter, no ordinal word, and no per-grade colour - all five must
   look GENUINELY IDENTICAL unselected, or the shuffle buys nothing. Every
   rule below is grade-agnostic on purpose: nothing here reads a grade or a
   position, only :checked. The old --zrc-rung-fg/--zrc-rung-bg custom
   properties this block used to key off are never set by JS any more
   (they implied a per-grade colour), so the selected state below is the
   single, neutral, brand selection treatment - a Tomato border plus a
   filled radio - used the same way regardless of which rung it is. */
#ziptility-report-card .zrc-ruggroup{ display:flex; flex-direction:column; gap:10px; }
#ziptility-report-card .zrc-rung{
  display:flex; align-items:flex-start; gap:12px; width:100%; text-align:left; cursor:pointer;
  background:var(--white); border:2px solid var(--n200); border-radius:var(--radius); padding:13px 16px;
  transition:border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}
#ziptility-report-card .zrc-rung:hover{ border-color:var(--n300); }
#ziptility-report-card .zrc-rung:has(.zrc-rung-input:checked){
  border-color:var(--tomato);
  background:var(--tomato-tint);
}
#ziptility-report-card .zrc-rung-input{ margin-top:3px; flex:0 0 auto; width:18px; height:18px; accent-color:var(--tomato); }
#ziptility-report-card .zrc-rung-text{ display:flex; flex-direction:column; gap:2px; flex:1; }
#ziptility-report-card .zrc-rung-desc{ font-size:15px; line-height:1.5; color:var(--n700); }

/* ---------- nav rows ---------- */
#ziptility-report-card .zrc-navrow{ display:flex; gap:10px; margin-top:20px; flex-wrap:wrap; align-items:center; }
#ziptility-report-card .zrc-navrow .zrc-btn-primary{ margin-left:auto; }
#ziptility-report-card .zrc-viewresults-row{ text-align:center; margin-top:16px; }

/* ---------- profile (the optional closing block, R14: not a gate) ---------- */
#ziptility-report-card .zrc-profile{ padding:8px 0 24px; }
#ziptility-report-card .zrc-profile-why{ font-size:15px; line-height:1.6; color:var(--n600); max-width:640px; margin:0 0 28px; }
#ziptility-report-card .zrc-profile-grid{
  display:grid; grid-template-columns:1fr; gap:20px; margin:0 0 24px;
}
@media (min-width:640px){ #ziptility-report-card .zrc-profile-grid{ grid-template-columns:1fr 1fr; } }
#ziptility-report-card .zrc-profile-field{ display:flex; flex-direction:column; gap:6px; }
#ziptility-report-card .zrc-profile-label{ font-family:var(--font-ui); font-size:14.5px; font-weight:700; color:var(--midnight); }
#ziptility-report-card .zrc-profile-help{ font-size:13px; line-height:1.4; color:var(--n500); margin:0 0 2px; }
#ziptility-report-card .zrc-profile-select,
#ziptility-report-card .zrc-profile-input{
  /* D5: was 15px, which iOS Safari treats as "small enough to zoom in on
     focus" (the cutoff is 16px). That zoom-and-you-have-to-zoom-back-out
     is exactly the kind of friction a "30 to 45 minute annual update"
     tool cannot afford. */
  font-family:var(--font-ui); font-size:16px; padding:12px 14px;
  border-radius:var(--radius); border:2px solid var(--n200); background:var(--white); color:var(--midnight);
}
#ziptility-report-card .zrc-profile-select:hover,
#ziptility-report-card .zrc-profile-input:hover{ border-color:var(--n300); }
#ziptility-report-card .zrc-profile-email-field{ max-width:420px; margin-bottom:28px; }
#ziptility-report-card .zrc-profile-actions{ display:flex; gap:12px; flex-wrap:wrap; }

/* ---------- results: composite ---------- */
#ziptility-report-card .zrc-composite-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:20px; }
@media (min-width:640px){ #ziptility-report-card .zrc-composite-grid{ grid-template-columns:repeat(4,1fr); } }
#ziptility-report-card .zrc-composite-card{
  background:var(--white); border:1px solid var(--n200); border-radius:var(--radius-lg); padding:18px 16px; text-align:center;
}
#ziptility-report-card .zrc-composite-card-label{ font-family:var(--font-ui); font-size:12px; font-weight:700; letter-spacing:.03em; text-transform:uppercase; color:var(--n500); margin-bottom:10px; }
#ziptility-report-card .zrc-composite-card-grade{
  display:flex; flex-direction:column; align-items:center; gap:2px; border-radius:var(--radius); padding:10px 6px;
}
#ziptility-report-card .zrc-composite-letter{ font-family:var(--font-sans); font-weight:900; font-size:32px; line-height:1; }
#ziptility-report-card .zrc-composite-name{ font-family:var(--font-ui); font-size:13px; font-weight:600; }
#ziptility-report-card .zrc-composite-card-sub{ font-family:var(--font-ui); font-size:12px; color:var(--n500); margin-top:10px; }

/* ---------- results: grouped bars ---------- */
#ziptility-report-card .zrc-bars-grid{ display:grid; grid-template-columns:1fr; gap:32px; }
@media (min-width:720px){ #ziptility-report-card .zrc-bars-grid{ grid-template-columns:repeat(3,1fr); } }
#ziptility-report-card .zrc-bars-group-title{
  display:flex; align-items:center; gap:8px; font-size:16px; font-weight:900; letter-spacing:-0.01em; color:var(--midnight); margin:0 0 14px;
}
#ziptility-report-card .zrc-swatch{ width:10px; height:10px; border-radius:3px; flex:0 0 auto; }
#ziptility-report-card .zrc-bar-row{ margin:0 0 16px; }
#ziptility-report-card .zrc-bar-head{ display:flex; justify-content:space-between; gap:10px; align-items:baseline; margin-bottom:4px; }
#ziptility-report-card .zrc-bar-name{ font-size:14px; color:var(--n700); }
#ziptility-report-card .zrc-critical-tag{ font-family:var(--font-ui); font-size:11px; font-weight:700; color:#b91c1c; }
#ziptility-report-card .zrc-bar-gradetext{ font-family:var(--font-ui); font-size:13px; font-weight:700; color:var(--n700); white-space:nowrap; }
#ziptility-report-card .zrc-bar-track{ height:8px; border-radius:var(--radius-pill); background:var(--n100); overflow:hidden; }
#ziptility-report-card .zrc-bar-fill{ display:block; height:100%; border-radius:var(--radius-pill); }
#ziptility-report-card .zrc-cite{ font-family:var(--font-ui); font-size:11.5px; color:var(--n500); margin:5px 0 0; }

/* ---------- results: wheel ---------- */
#ziptility-report-card .zrc-wheel-section{ display:flex; flex-direction:column; align-items:center; text-align:center; }
/* WIDTH RHYTHM, 2026-07-29 (design pass): a bounded, Linen-tinted "gauge" card instead of the
   wheel floating at full wrap width - a deliberately narrower measure than the bars-grid above it
   AND the second surface family (warm vs. the bars' white cards) on the same screen. */
#ziptility-report-card .zrc-wheel-card{
  background:var(--warm-100); border-radius:var(--radius-lg);
  padding:24px; max-width:340px; width:100%;
  display:flex; align-items:center; justify-content:center;
}
#ziptility-report-card .zrc-wheel-card svg{ display:block; max-width:100%; height:auto; }

/* ---------- results: red-line panel ---------- */
#ziptility-report-card .zrc-redline-section{ background:#fef2f2; border-radius:var(--radius-lg); padding:28px 26px; }
#ziptility-report-card .zrc-redline-list{ display:flex; flex-direction:column; gap:12px; }
#ziptility-report-card .zrc-redline-card{
  background:var(--white); border-radius:var(--radius); border-left:4px solid #dc2626; padding:16px 18px;
}
#ziptility-report-card .zrc-redline-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:4px; }
/* D4: same n400->n600 fix as .zrc-jumpgroup-label above; same reasoning. */
#ziptility-report-card .zrc-redline-leg{ font-family:var(--font-ui); font-size:11px; font-weight:700; letter-spacing:.03em; text-transform:uppercase; color:var(--n600); margin:0; }
#ziptility-report-card .zrc-redline-name{ font-size:17px; font-weight:800; color:var(--midnight); margin:0 0 6px; }
#ziptility-report-card .zrc-redline-grade{ font-family:var(--font-ui); font-size:13px; font-weight:700; color:#b91c1c; }
#ziptility-report-card .zrc-redline-clear{ font-size:15px; color:#15803d; font-weight:600; margin:0; }

/* ---------- results: one-rung-up / action plan ---------- */
#ziptility-report-card .zrc-onerungup-list,
#ziptility-report-card .zrc-actionplan-list{ display:grid; grid-template-columns:1fr; gap:14px; }
@media (min-width:720px){
  #ziptility-report-card .zrc-onerungup-list,
  #ziptility-report-card .zrc-actionplan-list{ grid-template-columns:1fr 1fr; }
}
#ziptility-report-card .zrc-onerungup-card,
#ziptility-report-card .zrc-actionplan-card{
  background:var(--warm-50); border-radius:var(--radius); padding:18px 20px;
}
/* D4: same n400->n600 fix as .zrc-jumpgroup-label above; same reasoning. */
#ziptility-report-card .zrc-onerungup-leg,
#ziptility-report-card .zrc-actionplan-leg{
  display:block; font-family:var(--font-ui); font-size:11px; font-weight:700; letter-spacing:.03em;
  text-transform:uppercase; color:var(--n600); margin-bottom:4px;
}
#ziptility-report-card .zrc-actionplan-head{ display:flex; justify-content:space-between; align-items:baseline; gap:10px; }
#ziptility-report-card .zrc-actionplan-grade{ font-family:var(--font-ui); font-size:12px; font-weight:700; color:var(--n700); }
#ziptility-report-card .zrc-onerungup-transition{ font-family:var(--font-ui); font-size:13px; font-weight:600; color:var(--n700); margin:2px 0 10px; }
#ziptility-report-card .zrc-action-text{ font-size:14px; line-height:1.55; color:var(--n700); white-space:pre-line; margin:8px 0 0; }

/* ---------- C1: "what this means" line (dim.rungs[grade], the reader's
   own chosen description, surfaced back on results everywhere a grade is
   shown) ---------- */
#ziptility-report-card .zrc-whatmeans{ font-size:14px; line-height:1.55; color:var(--n700); margin:8px 0 0; }
#ziptility-report-card .zrc-whatmeans-label{ font-weight:700; color:var(--midnight); }

/* ---------- C3: compact cross-reference, used in place of a repeated
   full card when a one-rung-up or action-plan entry duplicates a
   dimension already shown in full in the red-line panel above ---------- */
#ziptility-report-card .zrc-see-above{ display:flex; align-items:center; }
#ziptility-report-card .zrc-see-above-link{
  font-family:var(--font-ui); font-size:14px; font-weight:600; color:var(--tomato-press);
}

/* ---------- C4: citation collapsed behind a closed-by-default <details>
   on screen only (see the @media print override further down, which
   forces it open there instead) ---------- */
#ziptility-report-card .zrc-cite-details{ margin-top:6px; }
#ziptility-report-card .zrc-cite-summary{
  font-family:var(--font-ui); font-size:12px; font-weight:600; color:var(--n700);
  cursor:pointer; list-style:none;
}
#ziptility-report-card .zrc-cite-summary::-webkit-details-marker{ display:none; }
#ziptility-report-card .zrc-cite-summary::before{ content:'\u25B8 '; }
#ziptility-report-card .zrc-cite-details[open] > .zrc-cite-summary::before{ content:'\u25BE '; }
#ziptility-report-card .zrc-cite-details .zrc-cite{ margin:4px 0 0; }

/* ---------- THE GRADE PLAQUE (design pass, 2026-07-29) ----------
   Supersedes the old ".zrc-practical-*" rules (dead now - ui/results.js no longer builds those
   classes; recover from git history if ever needed). Renders on BOTH the capped and uncapped
   path (see buildGradePlaque in ui/results.js), where the old practical-lead treatment only
   existed when capped. Same dark surface as src/manager's gauge and src/ui's CTA band. */
#ziptility-report-card .zrc-plaque{ margin:0 0 20px; }
#ziptility-report-card .zrc-plaque-filled{
  background:linear-gradient(160deg, var(--midnight), #14365a);
  border-radius:var(--radius-lg);
  padding:28px 26px;
  color:var(--white);
}
#ziptility-report-card .zrc-plaque-row{ display:flex; align-items:center; gap:26px; flex-wrap:wrap; }
#ziptility-report-card .zrc-plaque-grade{
  flex:0 0 auto; min-width:108px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:4px;
}
#ziptility-report-card .zrc-plaque-letter{ font-family:var(--font-sans); font-weight:900; font-size:68px; line-height:1; color:var(--white); }
/* --linen full-opacity, not a translucent white: the DS's own "text-on-dark" pair
   (DESIGN_SYSTEM_HANDOFF.md --text-on-dark), MEASURED >=14:1 on this gradient's darkest stop. */
#ziptility-report-card .zrc-plaque-name{ font-family:var(--font-ui); font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:var(--linen); }
#ziptility-report-card .zrc-plaque-text{ flex:1 1 260px; min-width:0; }
@media (min-width:560px){
  #ziptility-report-card .zrc-plaque-text{ padding-left:26px; border-left:1px solid rgba(255,255,255,.18); }
}
/* Scoped to .zrc-plaque-filled: the "answer a few dimensions" empty state renders this same
   headline class with NO dark background (see buildGradePlaque's early return), so an unscoped
   white-text rule here would make that headline invisible on the page's own light background. */
#ziptility-report-card .zrc-plaque-filled .zrc-plaque-headline{ color:var(--white); margin:0 0 8px; }
#ziptility-report-card .zrc-plaque-sub{ font-size:15.5px; line-height:1.55; color:var(--linen); margin:0; max-width:640px; }

#ziptility-report-card .zrc-composite-secondary-label{
  font-family:var(--font-ui); font-size:12px; font-weight:700; text-transform:uppercase;
  letter-spacing:.03em; color:var(--n600); margin:0 0 10px;
}
/* Demoted, not hidden: the composite still needs to be seen, just clearly
   secondary to the Practical Grade above it. */
#ziptility-report-card .zrc-composite-grid-secondary .zrc-composite-letter{ font-size:22px; }
#ziptility-report-card .zrc-composite-grid-secondary .zrc-composite-card{ padding:14px 12px; }

/* ---------- landing: Start subtext (D1) ---------- */
#ziptility-report-card .zrc-start-wrap{ display:flex; flex-direction:column; align-items:flex-start; gap:6px; }
#ziptility-report-card .zrc-start-subtext{ font-size:13px; color:var(--n600); margin:0; max-width:260px; }

/* ---------- soft capture (R14: below the fully rendered result only) ---------- */
#ziptility-report-card .zrc-softcapture{ background:var(--warm-50); border-radius:var(--radius-lg); padding:26px 24px; }
#ziptility-report-card .zrc-softcapture-row{ display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
#ziptility-report-card .zrc-email-input{
  /* D5: same 15px-to-16px iOS-zoom fix as the profile inputs above. */
  flex:1; min-width:220px; font-family:var(--font-ui); font-size:16px; padding:12px 14px;
  border-radius:var(--radius); border:2px solid var(--n200); background:var(--white); color:var(--midnight);
}

/* ---------- print-only chrome (hidden on screen; a printed page has no
   page chrome of its own, so the report supplies its own logo, title,
   date, and source URL - see the @media print block below for the
   visible treatment) ---------- */
#ziptility-report-card .zrc-print-logo{ display:none; }
#ziptility-report-card .zrc-print-footer{ display:none; }

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion:reduce){
  #ziptility-report-card *{ transition:none!important; animation:none!important; }
}

/* ---------- print: the printed page is a deliverable, not an afterthought ---------- */
@media print{
  #ziptility-report-card{ font-size:12pt; line-height:1.4; color:#000; }
  #ziptility-report-card .zrc-noprint{ display:none!important; }
  #ziptility-report-card .zrc-wrap{ max-width:100%; }
  #ziptility-report-card .zrc-h1{ font-size:22pt; }
  #ziptility-report-card .zrc-h2{ font-size:16pt; }
  #ziptility-report-card .zrc-h2-sm{ font-size:14pt; }
  #ziptility-report-card .zrc-step-title{ font-size:16pt; }
  #ziptility-report-card h3{ font-size:13pt; }
  #ziptility-report-card .zrc-card,
  #ziptility-report-card .zrc-composite-card,
  #ziptility-report-card .zrc-redline-card,
  #ziptility-report-card .zrc-onerungup-card,
  #ziptility-report-card .zrc-actionplan-card{ box-shadow:none!important; border:1px solid #999; }
  /* E1: this used to also carry break-inside:avoid-page, which pushes an
     ENTIRE section to the next page rather than letting it flow, and every
     section here (e.g. "All 23 dimensions") is far taller than one page.
     Measured: 9 pages with ~40% blank on three of them. The per-card rules
     two lines down already protect the thing a board actually reads card
     by card, so the blanket section rule was pure waste. Removing it
     alone should save 2 to 3 pages. */
  #ziptility-report-card section{ margin:24px 0; }
  #ziptility-report-card .zrc-redline-card,
  #ziptility-report-card .zrc-onerungup-card,
  #ziptility-report-card .zrc-actionplan-card,
  #ziptility-report-card .zrc-composite-card{ break-inside:avoid; }
  #ziptility-report-card .zrc-redline-section{ background:#fff; border:1px solid #999; }

  /* THE GRADE PLAQUE, print (design pass, 2026-07-29): this file's print rules already convert
     every other colour-carrying surface (redline pink, card shadows) to a plain white-plus-border
     treatment rather than depending on print-color-adjust - a printed board packet is meant to be
     cheap to reproduce on any printer, dark ink fills fight that. Same call here: the dark plaque
     becomes a bordered white panel with dark text in print, so the grade and headline are still
     the first thing on the printed page, just not as a full-bleed dark fill. */
  #ziptility-report-card .zrc-plaque-filled{ background:#fff; border:2px solid #000; color:#000; }
  #ziptility-report-card .zrc-plaque-filled .zrc-plaque-headline,
  #ziptility-report-card .zrc-plaque-letter,
  #ziptility-report-card .zrc-plaque-sub{ color:#000; }
  #ziptility-report-card .zrc-plaque-name{ color:#333; }
  #ziptility-report-card .zrc-plaque-text{ border-left-color:#999; }
  /* .zrc-bars-group also carries .zrc-card (shadow, no border); this print rule matches the
     other .zrc-card-family overrides above. The 4px LEG_COLOR top edge is an inline style
     (ui/results.js), which wins over this shorthand for that one side and is left colored on
     purpose - navy/slate/amber are all dark, printer-cheap colours, not a saturated fill. */
  #ziptility-report-card .zrc-bars-group{ box-shadow:none!important; border:1px solid #999; }

  /* D6: measured .zrc-cite at ~8.6pt and .zrc-action-text at ~10.5pt in
     print, both under the 12pt floor - and these are the regulatory
     citation on all 23 cards and the actual next-step text, not
     decoration. Explicit pt overrides, with a little headroom above the
     floor rather than landing exactly on it. */
  #ziptility-report-card .zrc-cite{ font-size:12.5pt; line-height:1.4; }
  #ziptility-report-card .zrc-action-text{ font-size:12.5pt; line-height:1.4; }
  #ziptility-report-card .zrc-whatmeans{ font-size:12.5pt; line-height:1.4; }

  /* C4: the citation disclosure is a screen-only affordance (a board
     reading paper cannot click anything), so the toggle itself is always
     hidden in print. The actual opening happens in main.js's
     beforeprint/afterprint handler, which flips the real \`open\` attribute
     for the print and restores it after - verified necessary because a
     CSS-only override does not work in current Chromium (a closed
     <details>'s content sits behind an internal UA wrapper a child
     element's own \`display\` cannot reach). The rule below is defence in
     depth for any engine where the plain CSS override does work, not the
     mechanism this actually depends on. */
  #ziptility-report-card .zrc-cite-summary{ display:none!important; }
  #ziptility-report-card .zrc-cite-details:not([open]) > :not(summary){ display:block!important; }

  /* Never split one dimension's card, or a composite/red-line/action card,
     across a page break - a board handout is skimmed card by card. */
  #ziptility-report-card .zrc-bar-row{ break-inside:avoid; }

  /* The print-only logo: display:none on screen (rule above), visible here
     at the very top of the printed report, with the report title and the
     print date next to it. */
  #ziptility-report-card .zrc-print-logo{
    display:flex; align-items:center; justify-content:space-between; gap:20px;
    margin:0 0 18px; padding-bottom:12px; border-bottom:2px solid #000;
    break-after:avoid; break-inside:avoid;
  }
  #ziptility-report-card .zrc-print-logo-mark svg{ display:block; height:26px; width:auto; }
  #ziptility-report-card .zrc-print-logo-meta{ text-align:right; }
  #ziptility-report-card .zrc-print-logo-title{ font-family:var(--font-sans); font-weight:800; font-size:13pt; color:#000; }
  #ziptility-report-card .zrc-print-logo-date{ font-family:var(--font-ui); font-size:10pt; color:#333; margin-top:2px; }

  /* Print footer: the tool's URL, so a photocopied or re-printed handout
     can still be traced back to where it came from. */
  #ziptility-report-card .zrc-print-footer{
    display:block; margin-top:28px; padding-top:10px; border-top:1px solid #999;
    font-family:var(--font-ui); font-size:9pt; color:#333; text-align:center;
  }
}
`;var N={source:{workbook:"Utility_Health_Report_Card_v2.xlsx",driveFileId:"1tk-_bz9LiKnlyBNEd5GpK4DPDA20syFx",extracted:"2026-07-29"},legs:{T:"Technical",M:"Managerial",F:"Financial"},grades:["F","D","C","B","A"],gradeLabels:{F:"F \u2014 Survival",D:"D \u2014 Existing Day-to-Day",C:"C \u2014 Fairly Stable",B:"B \u2014 Very Stable",A:"A \u2014 Thriving"},dimensions:[{id:"T1",leg:"T",name:"Asset Inventory",definition:"Documented record of every physical asset (wells, tanks, mains, hydrants, valves, meters, pumps, controls) with installation date, condition, and replacement cost.",rungs:{F:"No known asset inventory documented or discussed.",D:"Possibly a few core assets documented (e.g., wells, tanks). Historical information known but not documented. Reliant on oral tradition.",C:"Primary assets (wells, tanks, mainlines) listed with installation year or approximate age. Well drawdown and production capacity monitored on an annual schedule. Pump replacement and tank coating anticipated and projected using historical data.",B:"Inventory includes primary and secondary assets (hydrants, valves, meters) with condition ratings and replacement costs. Primary and secondary assets assigned anticipated useful lifespans and repair costs; locations reviewed periodically. Assets tracked with annual replacement goals based on lifespan.",A:"Comprehensive, real-time updating of inventory with condition data, criticality rankings, and cost data all fed by daily workflows."},redLine:!1,redLineRaw:null,citation:"EPA Five Core Questions (Q1); AWWA M5 \xA73; ISO 55000 \xA73.2; AquaRating Asset Knowledge indicators.",actions:{"F->D":`(1) Walk every facility with a phone; photograph each pump, tank, valve, and control panel; capture nameplate data. (2) Interview operator, retired operator, and long-tenured board members; record install dates and history in a single spreadsheet. (3) Mark approximate locations on a printed county or service-area map.

Resources: State RWA circuit rider; RCAP/RCAC field staff; EPA Five Core Questions Q1 guidance.`,"D->C":`(1) Add wells, tanks, and main pipe segments with installation year and approximate age. (2) Begin annual well drawdown and production-capacity monitoring. (3) Project pump replacement and tank coating cycles from historical data.

Resources: AWWA M5 \xA73; state RWA technical assistance; EFCN asset-inventory templates.`,"C->B":`(1) Extend inventory to hydrants, valves, and meters with condition ratings and replacement costs. (2) Assign anticipated useful lifespans and repair costs to all primary and secondary assets. (3) Set annual replacement goals tied to lifespan and review locations periodically.

Resources: AWWA M44 (valves); AWWA M6 (meters); AquaRating asset indicators.`,"B->A":`(1) Move inventory updating into daily workflows so work orders auto-update inventory. (2) Add criticality rankings and cost data per asset. (3) Layer in sensor or SCADA data for real-time condition tracking.

Resources: AWWA M5 \xA710; ISO 55000 \xA73.2; AquaRating Asset Performance.`}},{id:"T2",leg:"T",name:"System Map / GIS",definition:"Spatial representation of the system: source locations, treatment, storage, distribution mains, services, and service area boundary.",rungs:{F:"Hand-drawn map with only wells/tanks; limited coverage or detail.",D:"Paper or basic digital map of major facilities (sources, tanks, mains, pumps) and boundaries.",C:"Digital map (GIS/CAD) includes pipe sizes and materials; updated periodically.",B:"GIS-based; integrated with work orders and O&M practices; routinely updated and validated.",A:"GIS-based; asset management data logging automated through standard workflows. Cost associations of assets and work orders integrated to the platform. Work orders include labor, equipment, and inventory costs."},redLine:!1,redLineRaw:null,citation:"EPA Source Water Protection mapping guidance; AWWA M32; AquaRating Network Knowledge indicators.",actions:{"F->D":`(1) Convert any hand-drawn maps to scanned digital images with notes. (2) Sketch a basic map of all sources, tanks, mains, pumps, and service-area boundary on graph paper or basic CAD. (3) Catalog any historic engineering as-builts in a single binder or shared folder.

Resources: State RWA mapping support; county GIS office; RCAP/RCAC field staff.`,"D->C":`(1) Build or commission a digital map (GIS or CAD) showing pipe sizes and materials. (2) Establish a quarterly map-update routine after construction or repair events. (3) Cross-reference map with asset inventory for completeness.

Resources: AWWA M32; state RWA GIS workshops; EPA Source Water Protection mapping guidance.`,"C->B":`(1) Integrate GIS with work-order practice so repairs and inspections update the map. (2) Validate map against field reality through walk-throughs once per year. (3) Use GIS to model hydraulic, fire-flow, or pressure-zone questions.

Resources: AWWA M32; AquaRating Network Knowledge; AWWA M44.`,"B->A":`(1) Automate data logging through standard work-order workflows; ensure cost (labor, equipment, inventory) is captured per work order. (2) Build a public-facing map view for board and customer transparency. (3) Adopt GIS open-data standards for portability.

Resources: AquaRating IT integration; AWWA M5 \xA710.`}},{id:"T3",leg:"T",name:"Data Systems Maturity",definition:"Integration of CMMS, SCADA, billing, and GIS into a coherent operational data layer. Distinct from asset inventory (T1).",rungs:{F:"No digital systems; all records on paper or in single-user spreadsheets. No SCADA or remote monitoring.",D:"Disconnected single-purpose tools (a spreadsheet for billing; a paper logbook for O&M; a separate filing cabinet for compliance). Data does not move between systems without re-keying.",C:"Core digital systems exist (billing software; basic SCADA on critical assets) but operate in silos. Reports compiled manually by hand-copying.",B:"CMMS or work-order software in routine use; SCADA covers source and storage with alarms; billing integrates with GIS service points. Reports generated with minimal hand-compilation.",A:"Single integrated data platform: GIS, work orders, condition, SCADA, billing, and compliance records all linked. Decisions queryable from any role in the utility without IT intervention."},redLine:!1,redLineRaw:null,citation:"EPA Five Core Questions (Q1, Q3); AWWA M32; Teodoro 2018 on data infrastructure; AquaRating IT integration.",actions:{"F->D":`(1) Stand up at least one digital tool for the most data-intensive function (billing or work-order tracking). (2) Establish a single shared folder or cloud drive for compliance, financial, and operational records. (3) Document where each kind of record currently lives.

Resources: State RWA software demos; EFCN small-utility tech-stack guidance; RCAP/RCAC tech-assistance.`,"D->C":`(1) Connect billing software to GIS service points (even at minimum: shared customer IDs). (2) Add basic SCADA to source and storage with alarm callout for the operator. (3) Establish a monthly data-reconciliation routine between billing, work orders, and operations.

Resources: AWWA M32; state RWA SCADA support; vendor-neutral integrator referrals.`,"C->B":`(1) Adopt or upgrade CMMS / work-order software in routine use. (2) Eliminate manual hand-compilation for at least three routine reports. (3) Train every operator and clerk on direct system entry.

Resources: EPA Five Core Questions Q1/Q3 operational guidance; EFCN data-systems case studies.`,"B->A":`(1) Migrate toward a single integrated data platform across GIS, work orders, condition, SCADA, billing, and compliance. (2) Build role-based dashboards so operator, board, and clerk each have a queryable view. (3) Adopt data-validation and backup discipline (off-site, periodic restore test).

Resources: AquaRating IT integration; ISO 55000 \xA76.4.`}},{id:"T4",leg:"T",name:"Capital Asset Condition Assessment",definition:"Disciplined practice of evaluating asset condition (not just existence). Distinct from inventory (T1).",rungs:{F:"No condition assessment of any asset. Condition discovered only at failure.",D:"Informal condition awareness: operator knows which assets are 'old' or 'have always been finicky' but no formal rating.",C:"Visual condition assessment performed on a defined cycle for critical above-ground assets. Documented with photos and notes.",B:"Standardized 1\u20135 condition rubric applied to primary and secondary assets on a defined cycle. Below-ground assets proxied with age + material + break-history scoring. Condition data feeds the capital plan.",A:"Instrumented condition data (energy draw, pressure profile, leak detection, valve exercise records) drives a real-time risk model. Capital plan auto-updates as condition data accumulates."},redLine:!1,redLineRaw:null,citation:"EPA Five Core Questions (Q3); AWWA M5 condition rubric; ISO 55001 \xA79.1; AquaRating Asset Performance.",actions:{"F->D":`(1) Walk critical above-ground assets with a phone and record gut-feel condition (good, fair, poor). (2) Photograph each. (3) Note any assets the operator already considers 'live-failure risk' and prioritize them for replacement.

Resources: State RWA circuit rider; RCAP/RCAC field staff; AWWA M5 condition rubric (introductory).`,"D->C":`(1) Set a defined annual visual-condition inspection cycle for critical above-ground assets. (2) Document each inspection with photos, notes, and a date. (3) Build a simple 'critical-fix list' updated at each inspection.

Resources: AWWA M5 condition rubric; EPA Five Core Questions Q3.`,"C->B":`(1) Adopt a standardized 1\u20135 condition rubric and apply to primary and secondary assets on a defined cycle. (2) Proxy below-ground assets with age + material + break-history scoring. (3) Feed condition data into the capital plan annually.

Resources: AWWA M5; ISO 55001 \xA79.1; AquaRating Asset Performance.`,"B->A":`(1) Add instrumented condition data (energy draw, pressure profile, leak detection, valve exercise records) where ROI supports. (2) Build or adopt a risk model that auto-updates the capital plan as condition data accumulates. (3) Document risk-modeling methodology for board and audit.

Resources: AquaRating Asset Performance; AWWA M44; manufacturer condition-monitoring guides.`}},{id:"T5",leg:"T",name:"Operations & Maintenance Practices",definition:"Routine and preventive maintenance discipline, documentation, and data capture.",rungs:{F:"No known routine maintenance procedures; entirely reactive. Operator not seen beyond monthly sampling. Onsite representative not documented. Community members or board members responding to and performing repairs without communication from the operator.",D:"Informal knowledge; limited documentation; almost entirely reactive. Operator or onsite operator performs regular weekly inspection of wells only. Inspections have limited data beyond meter production read.",C:"Regular site inspections and preventative maintenance of disinfection equipment. Redundant assets allow for well inspection and maintenance during pump replacement. Valve, hydrant, meter O&M aspirational but irregularly performed and not tracked/reported on. Some O&M procedures and templates documented.",B:"Repairs logged and tracked over time. Preventive maintenance schedule exists and is tracked; documented procedures. Often logged digitally to improve efficiency and progress. Energy consumption data informs pump and motor health indicators.",A:"All staff O&M tracked digitally. Documented PM program includes standardized condition assessment collection; data used to improve schedules and performance."},redLine:!0,redLineRaw:"\u25CF",citation:"AWWA M19/M32/M44 series; EPA O&M Best Practices Guide; AquaRating Operations.",actions:{"F->D":`(1) Establish minimum weekly inspection of wells and disinfection equipment. (2) Document each inspection in a paper logbook or simple spreadsheet. (3) Define who is operator-of-record and who is onsite representative; communicate to board.

Resources: State RWA O&M support; AWWA M19; RCAP/RCAC field staff.`,"D->C":`(1) Move from inspection-only to preventative maintenance on disinfection equipment. (2) Begin valve exercise, hydrant flushing, and meter testing on an irregular but documented cycle. (3) Document procedures and templates for the most common O&M tasks.

Resources: AWWA M32/M44; EPA O&M Best Practices Guide; state RWA training.`,"C->B":`(1) Adopt a preventative maintenance schedule with calendar reminders; track completion. (2) Log repairs digitally for trend analysis. (3) Capture energy consumption data to inform pump and motor health.

Resources: AWWA M19; EPA Sustainable Water Infrastructure; CMMS vendors.`,"B->A":`(1) Move all staff O&M tracking to digital, with standardized condition assessment collection. (2) Use historical PM data to improve schedules and performance. (3) Benchmark against peers via state RWA or AquaRating analogs.

Resources: AquaRating Operations; AWWA Partnership for Safe Water analog.`}},{id:"T6",leg:"T",name:"Water Loss / Non-Revenue Water",definition:"AWWA M36 water audit methodology: real losses, apparent losses, and infrastructure leakage index (ILI).",rungs:{F:"No water audit performed. Production and billed volumes not compared.",D:"Production vs. billed comparison done informally; loss percentage estimated but not validated. >40% non-revenue water common.",C:"Annual AWWA M36 top-down audit completed. Loss percentage in the 20\u201340% range. Limited data validity grading; no leak detection program.",B:"M36 audit completed and data-validity-graded annually. Real-loss target set; loss percentage in the 10\u201320% range. Active leak detection on a defined cycle.",A:"M36 audit with high data validity (>70). Real losses below benchmark for system size. Component analysis informs capital prioritization."},redLine:!1,redLineRaw:null,citation:"AWWA M36; EPA Water Audit Manual; AquaRating Water Loss indicator.",actions:{"F->D":`(1) Compare annual production volume to billed volume; compute apparent non-revenue water percentage. (2) Investigate any account-level meter-read anomalies. (3) Educate board on the existence and rough scale of NRW.

Resources: AWWA M36; EPA Water Audit Manual; state RWA water-loss training.`,"D->C":`(1) Complete an AWWA M36 top-down water audit annually. (2) Compute infrastructure leakage index (ILI). (3) Begin tracking the audit year-over-year.

Resources: AWWA M36; AWWA Water Loss Control Committee resources.`,"C->B":`(1) Apply data-validity grading to the M36 audit. (2) Set a real-loss target appropriate for system size. (3) Build an active leak-detection program on a defined cycle.

Resources: AWWA M36; AquaRating Water Loss indicator; leak-detection vendor referrals via state RWA.`,"B->A":`(1) Raise M36 data validity score above 70. (2) Use component analysis to inform capital prioritization. (3) Benchmark against state or regional peer utilities.

Resources: AWWA M36; California SB 555 standards for peer benchmarking comparisons.`}},{id:"T7",leg:"T",name:"Regulatory Compliance",definition:"SDWA primary/secondary standards; monitoring schedule adherence; CCR delivery; LCR inventory; AWIA RRA cycle.",rungs:{F:"Multiple ongoing violations and/or enforcement actions.",D:"Periodic violations for missed monitoring periods; regularly struggles with sampling schedule (Lead and Copper, DBP, nitrates).",C:"Generally compliant; occasional late or missed reports.",B:"Fully compliant; proactive about meeting deadlines and addressing issues. Multiple years typically between violations, primarily for late report submission.",A:"Exceeds compliance; participates in voluntary programs; adopts best practices early. A violation would be viewed as a black eye organization-wide."},redLine:!0,redLineRaw:"\u25CF",citation:"SDWA primary/secondary regulations (40 CFR 141, 142, 143); SDWIS data; EPA enforcement guidance.",actions:{"F->D":`(1) Inventory all current violations and enforcement actions; build a corrective action plan with state primacy. (2) Establish a sampling calendar with backstop reminders. (3) Identify the single highest-risk monitoring requirement (often LCR, DBP, or nitrates) and prioritize it.

Resources: State primacy enforcement-resolution office; RCAP/RCAC compliance support.`,"D->C":`(1) Eliminate missed monitoring periods through calendar discipline and backup-operator coverage. (2) Submit reports on time. (3) Run a quarterly compliance-status review at the board.

Resources: State RWA compliance services; SDWA primary regs (40 CFR 141); state primacy guidance.`,"C->B":`(1) Eliminate late or missed reports through automated reminders and clear ownership. (2) Establish a multi-year violation-free streak as an explicit goal. (3) Document a written compliance manual.

Resources: EPA enforcement guidance; AWWA M5; state primacy compliance assistance.`,"B->A":`(1) Participate in voluntary programs (Partnership for Safe Water, Partnership for Clean Water analog). (2) Adopt best practices early in response to rule changes. (3) Establish an organization-wide standard that violation is unacceptable.

Resources: AWWA Partnership for Safe Water; EPA voluntary programs; state primacy excellence designations.`}},{id:"T8",leg:"T",name:"Emergency Preparedness",definition:"Emergency Response Plan (ERP), redundancy, backup power, SCADA alarms, mutual-aid agreements.",rungs:{F:"No known emergency plan or backups.",D:"Some redundancy of sources or storage exists, but no formal Emergency Operations Plan or alarm system.",C:"Emergency Operations Plan known to a few; not tested or discussed. Remote monitoring with alarm notification of low water levels.",B:"Backup power generation onsite. SCADA with localized programming and real-time alarms of power loss and motor start failure.",A:"Plan war-gamed annually; mutual aid agreements in place with other utilities."},redLine:!0,redLineRaw:"\u25CF",citation:"AWIA \xA72013 (42 USC 300i-2); EPA ERP guidance; WARN networks; AWWA J100.",actions:{"F->D":`(1) Inventory and document existing redundancy (sources, storage). (2) Identify single-point-of-failure assets. (3) Begin drafting a basic Emergency Response Plan.

Resources: AWIA \xA72013; EPA ERP template library; state RWA emergency planning training.`,"D->C":`(1) Complete the Emergency Response Plan; share with a minimum set of staff. (2) Install remote monitoring with alarm notification for low water levels. (3) Test the plan informally once.

Resources: AWWA J100; state RWA mutual aid coordination; WARN network.`,"C->B":`(1) Install backup power generation onsite for critical assets. (2) Expand SCADA to power-loss and motor-start-failure alarms. (3) Sign at least one mutual aid agreement with a neighboring utility.

Resources: AWWA J100; state WARN network; vendor-neutral SCADA integrators.`,"B->A":`(1) War-game the Emergency Response Plan annually with all staff and board. (2) Maintain multiple mutual aid agreements and test them. (3) Integrate AWIA RRA cycle outputs into capital planning.

Resources: AWIA \xA72013 (42 USC 300i-2); AWWA J100; state WARN; EPA ERP guidance.`}},{id:"T9",leg:"T",name:"Water Quality Practice",definition:"Treatment-optimization and water-quality management practice maturity, distinct from bare-minimum regulatory compliance (T7).",rungs:{F:"Water quality understood only as the next regulated sample. No trending of source or distribution data. No proactive optimization.",D:"Source water and distribution residuals sampled at regulatory minimum frequency. Some retention of historical data but trends not analyzed.",C:"Source and distribution sampling at frequencies above regulatory minimum. Annual review of trends. LCR inventory current and verified.",B:"Optimization practice in place (CT optimization, disinfection-byproduct minimization, distribution residual mapping). Trend analysis informs treatment changes.",A:"Online water-quality sensors with real-time alerts. Predictive treatment adjustments. Participation in AWWA Partnership for Safe Water or analogous voluntary program."},redLine:!1,redLineRaw:null,citation:"EPA SDWA primary regs; AWWA Partnership for Safe Water; AWWA M48 (Optimization); SDWA50 stream on quality-beyond-compliance.",actions:{"F->D":`(1) Build a single retention practice for all sample results (source, distribution, treatment). (2) Calendar the regulatory minimum sampling frequency and meet it without exception. (3) Inventory LCR service-line material data per the most recent rule.

Resources: EPA SDWA primary regs; state primacy lab and sampling guidance; AWWA M48.`,"D->C":`(1) Plot historical sample data; identify trends in residuals, source quality, or DBP. (2) Verify and update the LCR service line inventory annually. (3) Increase sampling frequency above regulatory minimum for at least one critical parameter.

Resources: AWWA M48; state primacy data tools; SDWA50 stream on quality-beyond-compliance.`,"C->B":`(1) Optimize CT (contact time) for current treatment process. (2) Begin disinfection-byproduct minimization practice. (3) Map distribution residuals through routine sampling and act on dead zones.

Resources: AWWA M48; AWWA Partnership for Safe Water; state primacy optimization assistance.`,"B->A":`(1) Install online water-quality sensors with real-time alerts on critical parameters. (2) Use predictive analytics to adjust treatment proactively. (3) Join AWWA Partnership for Safe Water or analogous voluntary excellence program.

Resources: AWWA Partnership for Safe Water; SDWA50 stream; vendor-neutral online-monitoring guides.`}},{id:"M1",leg:"M",name:"Board / Governance Effectiveness",definition:"Quality and discipline of the governing body (board, council, district commission). Meeting cadence, transparency, role clarity, and oversight focus.",rungs:{F:"Board does not meet regularly or lacks quorum. Decisions regularly made without meetings due to crisis or lack of formality.",D:"Meetings occur but records and transparency are weak; roles unclear. Struggles to make decisions; issues often get tabled across multiple meetings. High board member turnover due to conflict. Difficult to find community members willing to serve. Policy unclear and not revised. Majority of board focus and discussion is on actions of staff or contractors. Occasional conflict with staff due to board micromanagement.",C:"Regular meetings with agendas and minutes; roles loosely defined. Supplemental documents reviewed in advance. Board still occasionally involved with customer issues rather than strict oversight and governance. In the past 10 years a board member has resigned mid-term due to conflict. Policy exists and is updated occasionally.",B:"Clear roles and policies well established; consistent oversight of utility management. Many long-term board members. Strong trust and respect. Meetings with major problems, strong disagreement, or attendee outbursts would be unusual.",A:"Board engages in strategic planning, policy adoption, and continuous training; strong oversight. Board is heavily supported by staff development of board materials based on verbal feedback in meetings."},redLine:!1,redLineRaw:null,citation:"EPA Capacity Development Handbook \xA7M; RCAP Board Training; AWWA M37; Teodoro & Switzer on board capacity.",actions:{"F->D":`(1) Re-establish a fixed monthly meeting calendar with documented quorum. (2) Recruit at least one new board member with relevant experience (financial, technical, or community-trust). (3) Adopt a basic policy manual.

Resources: EPA Capacity Development Handbook \xA7M; RCAP Board Training; state RWA board workshops.`,"D->C":`(1) Publish agendas and minutes for every meeting. (2) Pre-circulate supplemental documents for board review before meetings. (3) Define clear board roles (oversight, not operations).

Resources: RCAP Board Governance curricula; AWWA M37; state primacy small-utility board guides.`,"C->B":`(1) Codify role boundaries between board and staff; eliminate board involvement in routine customer issues. (2) Build long-term board tenure through clear committee structure and onboarding. (3) Track meeting effectiveness with simple metrics (decisions made, items tabled).

Resources: AWWA M37; RCAP Board Training; Teodoro & Switzer on board capacity.`,"B->A":`(1) Engage board in annual strategic planning. (2) Adopt continuous board-training expectations (annual training requirement). (3) Establish staff support for board materials based on board input.

Resources: EPA Capacity Development Handbook \xA7M; AWWA Strategic Planning Toolkit; foundation-funded board development programs.`}},{id:"M2",leg:"M",name:"Training & Capacity-Building Participation",definition:"Routine operator and board participation in continuing education, certifications, and capacity-building programs (state primacy, RCAP, RCAC, NRWA, EFCN).",rungs:{F:"No training completed; most concepts unfamiliar.",D:"One operator or board member has limited training or experience; no structured approach.",C:"Regular technical training participation by the operator; limited executive-level training. Board members occasionally attend trainings. AMP reviewed annually by board or management.",B:"Defined management roles; ongoing training every cycle; expectations documented. Rates reviewed annually by board or management.",A:"Culture of continuous improvement; training is routine and integrated into governance."},redLine:!1,redLineRaw:null,citation:"EPA Capacity Development Strategy (SDWA \xA71420); NRWA training catalog; RCAP/RCAC TA; EFCN small-utility curricula.",actions:{"F->D":`(1) Identify the minimum operator certification level required by state primacy and confirm operator status. (2) Enroll operator in at least one state primacy training per year. (3) Identify the closest state RWA training calendar.

Resources: State primacy operator-certification rules; state RWA training catalog; NRWA training catalog.`,"D->C":`(1) Establish regular operator technical training participation. (2) Expand to at least one board-member training per year. (3) Begin annual AMP / Living Map review at the board level.

Resources: State RWA training; RCAP/RCAC technical assistance; EFCN small-utility curricula.`,"C->B":`(1) Define management training expectations and document them. (2) Require all board members to attend at least one training per cycle. (3) Establish an annual rate review by board and management.

Resources: AWWA M37; EFCN rate-setting handbook; RCAP board training.`,"B->A":`(1) Build a culture of continuous improvement (training routine, integrated into governance). (2) Track training participation and outcomes. (3) Mentor peer utilities to spread practice.

Resources: EPA Capacity Development Strategy (SDWA \xA71420); NRWA training catalog; EFCN.`}},{id:"M3",leg:"M",name:"Evidence-Based Decision-Making",definition:"Use of asset, condition, financial, and customer data to inform real decisions (rate-setting, capital prioritization, funding applications). The Living Map is the operational answer.",rungs:{F:"Decisions made on memory or anecdote; no data layer referenced; no AMP or condition data consulted.",D:"Data exists in pieces but is not used in board meetings or capital decisions. AMP elements occasionally referenced; not central to planning.",C:"Some data informs rate reviews and maintenance scheduling. Condition data referenced when major capital decisions arise.",B:"Asset, condition, and financial data actively drives strategic decisions, rate cases, and funding applications. Living Map / AMP maintained continuously.",A:"Predictive and proactive data-driven management embedded in governance and culture; data informs all major decisions; peer benchmarking routine."},redLine:!0,redLineRaw:"\u25CF",citation:"EPA Five Core Questions; this paper \xA75\u20137 (Living Map framework); AWWA M5 \xA710; Teodoro on evidence-based management.",actions:{"F->D":`(1) Adopt the Living Map / Report Card as the utility's reference document for all capital and rate decisions. (2) Complete a baseline self-assessment within 90 days. (3) Establish a standing board agenda item to discuss data findings.

Resources: This paper \xA75\u20137 (Living Map framework); EPA Five Core Questions; state RWA technical assistance.`,"D->C":`(1) Bring data to bear on rate reviews and maintenance scheduling. (2) Reference condition data in major capital decisions. (3) Build a simple board dashboard summarizing key metrics.

Resources: EPA Five Core Questions; AWWA M5 \xA710; this paper \xA76 (TMF-organized Report Card).`,"C->B":`(1) Use asset, condition, and financial data to drive strategic decisions, rate cases, and funding applications. (2) Maintain the Living Map continuously, not as periodic snapshots. (3) Train operator and board on data interpretation.

Resources: This paper \xA75\u20137; AWWA M5 \xA710; Teodoro on evidence-based management.`,"B->A":`(1) Embed predictive and proactive data-driven management in governance and culture. (2) Use peer benchmarking routinely. (3) Publish Living Map outputs to the board and (selectively) to customers.

Resources: AquaRating peer benchmarking; this paper \xA713 federal capacity infrastructure; foundation-funded peer-benchmarking initiatives.`}},{id:"M4",leg:"M",name:"Succession & Workforce Planning",definition:"Documented succession for operator and key administrative roles; redundant staffing; documented knowledge transfer; awareness of workforce-cliff risk.",rungs:{F:"No succession plan; critical knowledge concentrated in one person.",D:"Minimal backup; at risk if a key person departs; undocumented knowledge.",C:"Some documentation and redundant staffing; notable gaps remain.",B:"Documented succession plan; backups trained for critical positions.",A:"Active succession program with pathways, redundancy in critical roles, and documented knowledge transfer."},redLine:!1,redLineRaw:null,citation:"EFCN workforce-cliff studies; AWWA State of the Water Industry; Teodoro on operator demographics.",actions:{"F->D":`(1) Document critical knowledge currently held by a single person (operator passwords, key vendors, regulatory contacts). (2) Identify a minimum backup arrangement (neighboring utility, circuit rider, contract operator). (3) Inform the board of the workforce risk.

Resources: EFCN workforce-cliff studies; state RWA circuit rider; RCAP/RCAC field staff.`,"D->C":`(1) Establish written records for critical operational and administrative procedures. (2) Build redundant staffing arrangements (cross-trained clerk, board-member familiarity). (3) Identify remaining knowledge gaps.

Resources: AWWA State of the Water Industry workforce reports; state RWA workforce planning workshops.`,"C->B":`(1) Document a written succession plan for operator and clerk roles. (2) Train backups for critical positions. (3) Test backup arrangements through planned absences.

Resources: EFCN workforce studies; AWWA M37; state primacy operator-of-record rules.`,"B->A":`(1) Run an active succession program with documented pathways. (2) Maintain redundancy in all critical roles. (3) Document knowledge transfer through SOPs, recorded training, and apprenticeship.

Resources: EFCN workforce-cliff studies; foundation-funded apprenticeship programs; Teodoro on operator demographics.`}},{id:"M5",leg:"M",name:"Customer Communication & Engagement",definition:"Routine, accessible, two-way communication with the customer base; not just CCR delivery.",rungs:{F:"No regular customer communication. Customers do not know how to get updates through any channel.",D:"Reactive communication mainly during crises; limited outreach. Customers look to board members, neighbors, or operator for updates.",C:"Periodic notices (rate letters); basic updates provided. Customers look to correct channels.",B:"Regular newsletters and website updates; proactive outage and project notices.",A:"Two-way channels (alerts, social, surveys); responsiveness tracked and reported."},redLine:!1,redLineRaw:null,citation:"SDWA CCR requirements (40 CFR 141 Subpart O); EPA public communication guidance; Bridges trust-building.",actions:{"F->D":`(1) Establish a single primary communication channel (mail, billing-insert, simple website). (2) Inform customers how to reach the utility for any concern. (3) Send at least the SDWA-required Consumer Confidence Report annually.

Resources: SDWA CCR requirements (40 CFR 141 Subpart O); state RWA communication templates; EPA public communication guidance.`,"D->C":`(1) Send periodic notices (rate letters, project updates). (2) Establish a basic schedule for proactive customer outreach. (3) Build a simple list of trusted information channels customers should use.

Resources: EPA public communication guidance; AWWA M37; state RWA outreach support.`,"C->B":`(1) Establish regular newsletters and website updates. (2) Send proactive outage and project notices. (3) Begin tracking customer inquiries by topic.

Resources: EPA Sustainable Water Infrastructure; AWWA M5; state RWA digital tools.`,"B->A":`(1) Build two-way channels (alerts, social, surveys). (2) Track responsiveness and report metrics to the board. (3) Use customer feedback to improve service.

Resources: Bridges Out of Poverty trust-building framing; AWWA customer-experience resources; EFCN customer-engagement studies.`}},{id:"M6",leg:"M",name:"Regional Cooperation & System Integration",definition:"Openness to interconnection, satellite management arrangements, shared services, joint procurement, and consolidation. Tracks both formal arrangements and cultural posture.",rungs:{F:"No formal or informal partnership with any other utility. Posture is defensive: 'we run our own system.' Interconnection or shared services not considered.",D:"One-off mutual aid agreement exists on paper but has not been exercised. Joint procurement not pursued. Consolidation viewed as loss of local control.",C:"Active mutual aid; occasional joint procurement (chemicals, locates); routine but limited communication with neighboring systems. Open to satellite management discussion if state-supported.",B:"Formal satellite management or shared services agreement in place for at least one function (operator, billing, engineering). Joint procurement routine. Consolidation studied where viability requires it.",A:"Active multi-system regional cooperation; integrated operations across multiple boards; consolidation pursued where viability requires it."},redLine:!1,redLineRaw:null,citation:"WA DOH satellite mgmt (RCW 70A.125 / WAC 246-295); EPA Restructuring guidance; Scotland Water consolidation; AWWA M37.",actions:{"F->D":`(1) Identify the three closest peer utilities and their contact information. (2) Call each at least once a year to compare operational notes. (3) Discuss with the board what shared-services or cooperative arrangements might be feasible.

Resources: State RWA peer-utility directory; WA DOH satellite mgmt resources; RCAP/RCAC regionalization studies.`,"D->C":`(1) Sign and test a mutual aid agreement with at least one neighboring utility. (2) Begin joint procurement for one input (chemicals, locates, lab work). (3) Engage state primacy on satellite-management options.

Resources: WA DOH satellite mgmt; EPA Restructuring guidance; AWWA M37; state WARN network.`,"C->B":`(1) Move to formal satellite management or shared services for at least one function (operator, billing, engineering). (2) Make joint procurement routine. (3) Study consolidation viability where the math supports it.

Resources: WA DOH satellite mgmt; Scotland Water consolidation precedent; EPA Restructuring.`,"B->A":`(1) Build active multi-system regional cooperation. (2) Integrate operations across multiple boards where governance allows. (3) Pursue consolidation where viability requires it.

Resources: Scotland Water precedent; NZ Three Waters lessons; EPA Restructuring; foundation-funded regionalization studies.`}},{id:"M7",leg:"M",name:"Source Water & Watershed Stewardship",definition:"Source water assessment, wellhead/intake protection plan, drought planning, watershed coordination with non-utility actors.",rungs:{F:"No source water assessment on file. No wellhead or intake protection program. Drought planning absent.",D:"State-completed source water assessment on file but not used. No active protection or watershed engagement.",C:"Wellhead/intake protection plan adopted; some routine inspection of vulnerability points. Drought plan exists.",B:"Active source water protection program; ordinances or land-use coordination with local government; drought triggers tied to operations.",A:"Embedded in watershed-scale stewardship: multi-stakeholder coordination, conservation easements, source-water funding mechanisms, climate-adaptation planning."},redLine:!1,redLineRaw:null,citation:"EPA Source Water Protection program; SDWA \xA71453; AWWA G300; state primacy SWAP guidance.",actions:{"F->D":`(1) Request the state-completed Source Water Assessment from primacy. (2) Identify the highest-risk vulnerability point (wellhead, intake, surface watershed). (3) Document drought-trigger thresholds for the system.

Resources: EPA Source Water Protection program; SDWA \xA71453; state primacy SWAP guidance.`,"D->C":`(1) Adopt a wellhead or intake protection plan. (2) Inspect vulnerability points on a defined cycle. (3) Document a basic drought plan with operational triggers.

Resources: AWWA G300; EPA SWP guidance; state RWA SWP support.`,"C->B":`(1) Establish an active source water protection program. (2) Coordinate with local government on land-use ordinances near sources. (3) Tie drought triggers to operations (conservation messaging, rate signals, intertie use).

Resources: AWWA G300; EPA SWP guidance; state primacy SWP grant programs.`,"B->A":`(1) Embed source protection in watershed-scale stewardship (multi-stakeholder coordination, conservation easements). (2) Establish source-water funding mechanisms (fees, partnerships). (3) Integrate climate-adaptation planning.

Resources: EPA SWP; AWWA G300; foundation-funded source-water programs (Walton, Kresge).`}},{id:"M8",leg:"M",name:"Workforce / Operator Bench",definition:"Operator workforce depth distinct from board-level succession (M4): operator certifications, hours-on-system, contract vs. employee structure, certification redundancy, age.",rungs:{F:"Single operator; minimum certification level; <8 hours/week onsite; no documented backup operator. Workforce-cliff risk acute.",D:"Single operator with appropriate certification level; 8\u201320 hours/week onsite; informal backup arrangement with neighboring utility or circuit rider.",C:"Operator certified at appropriate or higher class; \u226520 hours/week onsite; one documented backup operator with reciprocal arrangement.",B:"Operator certified above minimum class; full-time onsite; documented apprentice or relief operator in place; participation in NRWA / state RWA operator network.",A:"Operator with succession pathway (apprentice, journeyman, lead operator). Multiple staff certified above minimum. Active recruitment pipeline through state RWA or community college program."},redLine:!0,redLineRaw:"\u25CF",citation:"EFCN workforce-cliff studies; AWWA State of the Water Industry workforce reports; state primacy operator-certification rules; Teodoro on workforce demographics.",actions:{"F->D":`(1) Confirm operator-of-record is certified at the minimum class required by state primacy. (2) Document hours onsite (target 8+ per week minimum). (3) Identify a backup operator arrangement (neighboring utility, circuit rider, contract).

Resources: State primacy operator-certification rules; state RWA circuit rider; RCAP/RCAC.`,"D->C":`(1) Move toward 20+ hours onsite per week. (2) Formalize the backup operator arrangement with a reciprocal agreement. (3) Begin certification upgrades for the operator-of-record.

Resources: EFCN workforce studies; state RWA operator training; NRWA training catalog.`,"C->B":`(1) Upgrade operator certification above minimum class. (2) Move toward full-time onsite presence. (3) Document an apprentice or relief operator with a written agreement.

Resources: EFCN workforce-cliff studies; AWWA workforce reports; state RWA apprenticeship programs.`,"B->A":`(1) Build a multi-staff operator team with succession pathway (apprentice, journeyman, lead). (2) Maintain certification redundancy above minimum class across multiple staff. (3) Engage active recruitment pipeline through state RWA, community college, or apprenticeship programs.

Resources: EFCN; AWWA State of the Water Industry; foundation-funded workforce programs.`}},{id:"F1",leg:"F",name:"Financial Reserves",definition:"Cash on hand and reserve accounts available for unbudgeted repair, emergency, or rate-stabilization needs.",rungs:{F:"Under $25,000.",D:"Under $50,000 or 4 months operating expense (whichever is greater).",C:"Under $100,000 or 9 months operating expense (whichever is greater). Reserves in an interest-bearing money market account.",B:"Under $250,000 or 18 months operating expense (whichever is greater). Reserves held in rolling interest-bearing CDs.",A:"Over $250,000 or 5 years of income on hand (whichever is greater)."},redLine:!0,redLineRaw:"\u25CF",citation:"GFOA Reserve Policy Guidance; EPA AWIA ERP reserve guidance; Teodoro 2018 small-utility reserves data.",actions:{"F->D":`(1) Set up a separate reserve account (interest-bearing savings or money market). (2) Establish a monthly transfer from operating to reserves, however small. (3) Inform the board that reserves are now tracked separately from operating cash.

Resources: GFOA Reserve Policy Guidance; EPA AWIA ERP reserve guidance; state RWA financial workshops.`,"D->C":`(1) Build reserves to at least 9 months operating expense or $100,000 (whichever is greater). (2) Move reserves to an interest-bearing money market account. (3) Adopt a formal reserve policy.

Resources: GFOA Reserve Policy; EFCN small-utility reserve guidance; state RWA.`,"C->B":`(1) Build reserves to at least 18 months operating expense or $250,000 (whichever is greater). (2) Hold reserves in rolling interest-bearing CDs. (3) Stress-test reserves against largest single-asset replacement cost.

Resources: GFOA; EPA AWIA ERP guidance; Teodoro 2018 small-utility reserves data.`,"B->A":`(1) Build reserves to 5 years of income on hand or $250,000+ (whichever is greater). (2) Diversify reserve instruments. (3) Adopt a written reserve-use policy with board approval requirements.

Resources: GFOA Long-Range Financial Planning; foundation grants for reserve seeding.`}},{id:"F2",leg:"F",name:"Rate Adequacy",definition:"Rate structure relative to true cost of service (O&M + capital + reserves + affordability program). Review cadence and depreciation accounting.",rungs:{F:"Rates unchanged for many years; cannot cover O&M reliably.",D:"O&M \xB17.5%. Rates updated every 8\u201310 years; increases not done with any real analysis of need. Goal to meet break-even budgeting plus limited reserves. Rate increases seen as the enemy to avoid at all cost. Heavy concern about rates being affordable and burdensome on community.",C:"O&M + 10\u201320%. Rates reviewed every 3\u20135 years; rates meet O&M comfortably but struggle to generate enough to progress through capital replacement goals. Depreciation of assets not considered. Rates viewed as a headache likely to cause conflict and are kept low as a result.",B:"O&M + 20\u201330%. Rates reviewed annually compared to previous year budgets but updated every 3 years. Depreciation of minor and major assets accounted for. Rates sufficient to meet needs, but hesitancy to be 'overly aggressive' in asset replacement. Reluctant to raise rates or commit proactively for significant infrastructure projects that would provide water security decades into the future. Rate increases seen as a necessary evil; smaller increases every few years are recognized as better for the utility and easier on lower-income customers.",A:"O&M + 30\u201350%. Rates proactively adjusted with increases planned over five-year periods with accounting for anticipated inflation. Strong reserves. Rates viewed as amoral: they represent the full cost of service to sustainably operate the utility. Affordability concerns addressed through customer assistance programs. Willing to make substantial investment in capital projects to meet projected supply needs of the future."},redLine:!0,redLineRaw:"\u25CF",citation:"EPA Financial Capability Assessment; EFCN rate-setting handbook; Teodoro & Saywitz; AWWA M1.",actions:{"F->D":`(1) Conduct any rate review at all (last review may have been 8+ years ago). (2) Compute O&M cost coverage as a ratio of revenue to expense. (3) Begin a rate-change board education series.

Resources: EFCN rate-setting handbook; state RWA rate workshops; AWWA M1.`,"D->C":`(1) Move rate reviews to a 3\u20135 year cycle with documented analysis. (2) Target rates at O&M + 10\u201320% to begin capital replacement. (3) Begin tracking depreciation of assets even if not yet considered in rate-setting.

Resources: EFCN rate-setting handbook; AWWA M1; state primacy rate-review guidance.`,"C->B":`(1) Move to annual rate review with budget comparison; update every 3 years. (2) Account for asset depreciation in rate calculations. (3) Build rates to O&M + 20\u201330% to support proactive replacement.

Resources: AWWA M1; EFCN; EPA Financial Capability Assessment; Teodoro & Saywitz.`,"B->A":`(1) Plan rate increases over 5-year periods with anticipated inflation accounting. (2) Build rates to O&M + 30\u201350% with strong reserves. (3) Treat rates as 'amoral': the cost of service. Address affordability through CAP, not rate suppression.

Resources: EFCN; Teodoro & Saywitz; AWWA M1 affordability chapter.`}},{id:"F3",leg:"F",name:"Financial Planning / CIP",definition:"Multi-year operating budget, capital improvement plan, debt management, and integration of asset depreciation into financial forecasting.",rungs:{F:"No formal budget; entirely reactive spending.",D:"Annual O&M budget only; no capital plan or projections. No assets listed on balance sheet.",C:"Multi-year budget acknowledges replacement needs; basic projections. Assets included on balance sheet.",B:"Capital Improvement Plan with life-cycle costing; capital plan adequately funded and reviewed. Asset depreciation accounted for. CIP identifies internal and external funding sources.",A:"Long-term financial plan aligned with asset renewal; proactive adjustments; affordability strategies in place. Customer assistance program regularly communicated and established."},redLine:!1,redLineRaw:null,citation:"GASB 34 and 51; EPA AMP guidance; AWWA M5; GFOA Long-Range Financial Planning.",actions:{"F->D":`(1) Build a formal annual operating budget. (2) Track actual-vs-budget monthly. (3) Begin documenting major anticipated capital needs in a simple list.

Resources: GFOA budget standards; state RWA financial workshops; RCAP/RCAC.`,"D->C":`(1) Add a multi-year budget with basic capital replacement projections. (2) Place assets on the balance sheet per GASB 34. (3) Identify which capital projects are funded internally vs. externally.

Resources: GASB 34/51; GFOA Long-Range Financial Planning; EPA AMP guidance.`,"C->B":`(1) Build a Capital Improvement Plan with life-cycle costing. (2) Confirm CIP is adequately funded and reviewed. (3) Identify internal and external funding sources for each CIP item.

Resources: AWWA M5; EPA AMP guidance; SRF IUP processes; GFOA.`,"B->A":`(1) Align long-term financial plan with asset renewal. (2) Build affordability strategies into the plan. (3) Establish CAP communication routine.

Resources: GFOA Long-Range Financial Planning; Teodoro & Saywitz; AWWA M5.`}},{id:"F4",leg:"F",name:"Financial Recordkeeping & Audit",definition:"Accuracy, timeliness, and independent review of financial records. Internal controls.",rungs:{F:"No reliable financial records or tracking.",D:"Records exist but are inaccurate, late, or incomplete.",C:"Financial statements and annual budgets produced; basic reporting and tracking.",B:"External audit or review conducted; timely reports to board and stakeholders.",A:"Transparent, audited financials with strong internal controls and forecasting tools."},redLine:!1,redLineRaw:null,citation:"GFOA budget standards; state local-government audit requirements; GASB GAAP; Government Auditing Standards.",actions:{"F->D":`(1) Establish basic monthly financial reporting (income, expense, cash position). (2) Reconcile bank statements monthly. (3) Inventory all financial records and consolidate.

Resources: GFOA budget standards; state RWA bookkeeping support; RCAP/RCAC.`,"D->C":`(1) Produce annual financial statements and budgets. (2) Establish basic internal controls (separation of duties, approval authority). (3) Begin board financial review at every meeting.

Resources: GFOA; state local-government audit requirements; AICPA small-entity guidance.`,"C->B":`(1) Engage external audit or review annually. (2) Provide timely reports to board and stakeholders. (3) Document internal control procedures.

Resources: Government Auditing Standards (Yellow Book); GFOA; state primacy audit requirements.`,"B->A":`(1) Maintain transparent, audited financials with strong internal controls. (2) Adopt forecasting tools beyond annual budget. (3) Publish financial reports to the board and customers.

Resources: GFOA; GASB GAAP; foundation-funded financial-systems pilots.`}},{id:"F5",leg:"F",name:"Affordability Measurement",definition:"Routine measurement of customer affordability burden using a defined methodology. Distinct from CAP implementation (F6).",rungs:{F:"Affordability not measured. No methodology applied. Hardship known only through shut-off and complaint patterns.",D:"Affordability informally discussed at board meetings. No defined methodology; comparisons drawn from neighboring-utility rates rather than household-level data.",C:"Affordability measured annually using a defined methodology (% of MHI, AR, or HBI). Results reported to board but do not yet inform rate design.",B:"Affordability measured annually; results inform rate design and capital planning trade-offs. Tracking of % households above the 4.5%-MHI threshold or equivalent.",A:"Affordability integrated into rate-setting and capital planning at every cycle. Census-tract-level analysis. Cross-class subsidy mechanisms in rate structure."},redLine:!1,redLineRaw:null,citation:"EPA Financial Capability Assessment \xA73; Teodoro & Saywitz affordability methodology; AWWA M1 affordability chapter.",actions:{"F->D":`(1) Begin board-level discussion of affordability using available indicators (shut-off rates, complaints). (2) Identify the EPA-recommended affordability methodology (% of MHI, AR, HBI). (3) Estimate the percentage of households above 4.5% MHI using basic demographic data.

Resources: EPA Financial Capability Assessment; Teodoro & Saywitz affordability methodology; state primacy.`,"D->C":`(1) Adopt a defined affordability methodology and compute the indicator annually. (2) Report results to the board. (3) Begin documenting household-level affordability proxies (not yet rate design input).

Resources: EPA FCA; Teodoro & Saywitz; AWWA M1 affordability chapter.`,"C->B":`(1) Use affordability measurements to inform rate design. (2) Track percentage of households above the 4.5% MHI threshold or equivalent. (3) Connect affordability data to CAP enrollment (F6).

Resources: EPA FCA \xA73; Teodoro & Saywitz; foundation-funded affordability studies.`,"B->A":`(1) Integrate affordability into every rate-setting and capital-planning cycle. (2) Conduct census-tract-level analysis. (3) Adopt cross-class subsidy mechanisms.

Resources: Teodoro & Saywitz; AWWA M1; EFCN affordability resources.`}},{id:"F6",leg:"F",name:"Customer Assistance Program Implementation",definition:"Active provision of customer assistance for households above the affordability threshold. Distinct from affordability measurement (F5).",rungs:{F:"No customer assistance program. Shut-offs proceed without consideration of household financial state.",D:"Hardship handled case-by-case by the operator or clerk. No documented CAP.",C:"LIHWAP or equivalent customer assistance program available but not actively promoted. Limited enrollment; no tracking.",B:"Customer assistance program actively promoted; enrollment tracked; multiple assistance tools available (payment plans, leak forgiveness, conservation kits).",A:"Mature CAP with cross-subsidy, income-based rates, payment plans, leak forgiveness. External funding (state, LIHWAP, foundation) sustains the program. Annual reporting of enrollment, retention, and outcomes."},redLine:!1,redLineRaw:null,citation:"LIHWAP authorizing statute (42 USC 4571 et seq.); EPA Financial Capability Assessment; AWWA Customer Assistance Programs guidance.",actions:{"F->D":`(1) Stop processing routine shut-offs without first attempting payment arrangement. (2) Identify state or federal CAP programs (LIHWAP, state assistance funds). (3) Designate one staff member as CAP point of contact.

Resources: LIHWAP authorizing statute (42 USC 4571 et seq.); state LIHWAP administrator; community action agencies.`,"D->C":`(1) Adopt a written CAP with hardship criteria. (2) Train clerk on CAP eligibility and processing. (3) Begin tracking case-by-case hardship resolutions.

Resources: EPA Financial Capability Assessment; AWWA Customer Assistance Programs guidance.`,"C->B":`(1) Actively promote LIHWAP and any state-funded CAP through bills, mailers, and community channels. (2) Track enrollment and retention. (3) Expand assistance tools (payment plans, leak forgiveness, conservation kits).

Resources: LIHWAP; AWWA CAP guidance; state RWA outreach.`,"B->A":`(1) Build mature CAP with cross-subsidy, income-based rates, payment plans, leak forgiveness. (2) Secure external sustaining funding (state, LIHWAP, foundation). (3) Annual reporting of enrollment, retention, and outcomes to board and (selectively) customers.

Resources: LIHWAP; Teodoro & Saywitz; Kresge water-equity programs; AWWA CAP guidance.`}}],methodology:{raw:`Methodology & How to Use
What this is
The Utility Health Report Card v2.1 is a self-administered TMF (Technical / Managerial / Financial) diagnostic for community water systems under 10,000 connections. It is designed to replace the $10K\u2013$50K commissioned consultant report for the long-tail of small systems that cannot economically support recurring bespoke deliverables.
Who completes it
At minimum, the licensed operator, the board chair, and the financial clerk (or equivalents) jointly. Each role sees different parts of the system. Solo completion biases the results toward whichever leg of TMF the assessor knows best.
How long it takes
First-time completion: 90\u2013120 minutes if records are nearby. Annual update once the system is in routine use: 30\u201345 minutes.
Cadence
Annual. The Living claim depends on routine updating; an out-of-date report card is no better than a paper AMP.
Scoring \u2014 descriptive composite
Each dimension is graded F (Survival) through A (Thriving). Within each TMF leg, dimension grades convert to numeric values (F=0, D=1, C=2, B=3, A=4), average, and round to the nearest letter. The Overall grade is the mean of the three leg averages.
Scoring \u2014 diagnostic flag panel
Some dimensions are designated red-line \u2014 an F grade in any one indicates existential risk regardless of composite performance. The diagnostic flag panel on the Dashboard surfaces any red-line F's. The red-line set is determined by the author during workbook calibration (Phase 2).
Practical-grade cap
When 2 or more red-line F's are flagged, the Overall grade is annotated 'Practical Grade: D (capped by diagnostic flags)' even if the descriptive composite is higher. This is the only place the descriptive and diagnostic tracks merge.
Action Plan Library
Sheet 6 holds 22 dimensions \xD7 4 transition cells (F\u2192D, D\u2192C, C\u2192B, B\u2192A). Each cell contains specific actions plus resource pointers. The Dashboard's Personalized Action Plan section pulls the appropriate transition cell for each dimension based on the utility's current grade. Phase 11 of the prompts doc can produce a richer, personalized PDF report from completed grades.
One rung up
The Dashboard generates a list of the three dimensions where moving up one letter would be the highest-leverage next step. The rule is: largest gap to the next grade \xD7 red-line weighting. Use this to focus the next year's effort.
Updating the rubric
Dimensions and thresholds should not be modified in routine use \u2014 comparability across years and across utilities depends on stability. Calibration changes belong to the author and should be versioned (v2.1 \u2192 v2.2) with a written change log.
Bridges Out of Poverty lens
Each dimension's 'A \u2014 Thriving' column is the organization's future story. Capacity-building interventions that move a utility from F toward A should be evaluated by whether they add resources or impose requirements. This is the additive-versus-subtractive test described in the accompanying white paper \xA74 and \xA78.`}};var q=["T5","T7","T8","M3","M8","F1","F2"],V=["F"];var F={portalId:"4938013",formId:""};var B={F:0,D:1,C:2,B:3,A:4},z=["F","D","C","B","A"],W=["T","M","F"],k={T:"Technical",M:"Managerial",F:"Financial"},Q=4;function I(e){return Object.prototype.hasOwnProperty.call(B,e)}function ee(e){if(e==null||!isFinite(e))return null;let t=Math.round(e);return z[Math.max(0,Math.min(z.length-1,t))]||null}function te(){return new Set(q)}function Pe(e,t,n){let i=t.filter(o=>o.leg===n),a=i.map(o=>e[o.id]).filter(o=>I(o)).map(o=>B[o]);if(!a.length)return{leg:n,value:null,grade:null,answered:0,total:i.length};let s=a.reduce((o,c)=>o+c,0)/a.length;return{leg:n,value:s,grade:ee(s),answered:a.length,total:i.length}}function Le(e){let t=e.map(i=>i.value).filter(i=>i!=null&&isFinite(i));if(!t.length)return{value:null,grade:null,legsCounted:0};let n=t.reduce((i,a)=>i+a,0)/t.length;return{value:n,grade:ee(n),legsCounted:t.length}}function Me(e,t){let n=te(),i=new Set(V);return t.filter(a=>n.has(a.id)&&i.has(e[a.id])).map(a=>({id:a.id,name:a.name,leg:a.leg,grade:e[a.id]}))}function De(e,t){if(!(t.length>=2)||e.grade==null)return{capped:!1,grade:e.grade,descriptiveGrade:e.grade,flagCount:t.length};let i=B["D"]<B[e.grade];return{capped:i,grade:i?"D":e.grade,descriptiveGrade:e.grade,flagCount:t.length}}function Be(e,t){let n=te();return t.map((i,a)=>({d:i,index:a})).filter(({d:i})=>I(e[i.id])&&B[e[i.id]]<Q).map(({d:i,index:a})=>{let s=B[e[i.id]],o=Q-s,c=n.has(i.id);return{id:i.id,name:i.name,leg:i.leg,current:e[i.id],target:z[s+1],isRedLine:c,score:o*(c?2:1),index:a}}).sort((i,a)=>a.score-i.score||i.index-a.index).slice(0,3)}function G(e,t){if(!I(t))return null;let n=B[t];return n>=Q?null:e.actions[t+"->"+z[n+1]]||null}function P(e,t){let n=W.map(s=>Pe(e,t,s)),i=Le(n),a=Me(e,t);return{legAverages:n,overall:i,flags:a,practical:De(i,a),oneRungUp:Be(e,t),answered:t.filter(s=>I(e[s.id])).length,total:t.length,complete:t.every(s=>I(e[s.id]))}}var re="zip-reportcard-v1";function j(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}function ie(){try{let e=window.localStorage.getItem(re);if(!e)return null;let t=JSON.parse(e);return!j(t)||!j(t.grades)?null:{grades:t.grades,idx:typeof t.idx=="number"?t.idx:0,orders:j(t.orders)?t.orders:null,profile:j(t.profile)?t.profile:null,submitted:t.submitted===!0}}catch{return null}}function ae(e){try{window.localStorage.setItem(re,JSON.stringify({grades:e.grades||{},idx:typeof e.idx=="number"?e.idx:0,orders:e.orders||{},profile:e.profile||null,submitted:e.submitted===!0}))}catch{}}function ne(e){let t=e.slice();for(let n=t.length-1;n>0;n--){let i=Math.floor(Math.random()*(n+1)),a=t[n];t[n]=t[i],t[i]=a}return t}function oe(e){let t={};for(let n of e)t[n.id]=ne(z);return t}function Te(e){if(!Array.isArray(e)||e.length!==z.length)return!1;let t=new Set(e);return t.size!==z.length?!1:z.every(n=>t.has(n))}function se(e,t){let n={};for(let i of e){let a=t&&t[i.id];n[i.id]=Te(a)?a:ne(z)}return n}var Fe="https://api.hsforms.com/submissions/v3/integration/submit/";function C(e,t){return t==null||t===""?null:{name:e,value:String(t)}}function Ie({grades:e,profile:t,dimensions:n}){let i=P(e,n),a=t||{},s=W.map(c=>{let l=i.legAverages.find(d=>d.leg===c);return C("rc_leg_"+c.toLowerCase(),l&&l.grade)});return{fields:[C("email",a.email),C("rc_overall_grade",i.overall.grade),C("rc_practical_grade",i.practical.grade),C("rc_practical_capped",i.practical.capped?"yes":"no"),...s,C("rc_redline_count",String(i.flags.length)),C("rc_redline_ids",i.flags.map(c=>c.id).join(",")),C("rc_answered",String(i.answered)),C("rc_complete",i.complete?"yes":"no"),C("rc_connections",a.connections),C("rc_employees",a.employees),C("rc_revenue_band",a.revenue),C("rc_system_type",a.systemType),C("rc_grades_json",JSON.stringify(e))].filter(Boolean),context:{pageUri:Oe(),pageName:"Utility Health Report Card"}}}function Oe(){try{return window.location.href}catch{return""}}function ce({grades:e,profile:t,dimensions:n}){if(!F.portalId||!F.formId)return Promise.resolve({sent:!1,reason:"not-configured"});let i;try{i=JSON.stringify(Ie({grades:e,profile:t,dimensions:n}))}catch{return Promise.resolve({sent:!1,reason:"payload-error"})}return fetch(Fe+F.portalId+"/"+F.formId,{method:"POST",headers:{"Content-Type":"application/json"},body:i}).then(a=>({sent:a.ok,status:a.status}))}function r(e,t,n){let i=document.createElement(e);return t&&(i.className=t),n!=null&&(i.textContent=n),i}function D(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function Ne(e){let t=e.indexOf("\u2014");return t===-1?{letter:e.trim(),name:""}:{letter:e.slice(0,t).trim(),name:e.slice(t+1).trim()}}function _(e,t){return!e||!t[e]?"":Ne(t[e]).name}function T(e,t){return e?e+" "+_(e,t):"Not yet gradable"}var U={F:{fg:"#b91c1c",bg:"#fef2f2"},D:{fg:"#c2410c",bg:"#fff7ed"},C:{fg:"#b45309",bg:"#fffbeb"},B:{fg:"#4d7c0f",bg:"#f7fee7"},A:{fg:"#15803d",bg:"#f0fdf4"}};var O={T:"#0c1f30",M:"#475569",F:"#b45309"};function le(e,{hasSaved:t,savedCount:n,total:i,onStart:a,onResume:s}){D(e);let o=r("div","zrc-landing"),c=r("div","zrc-eyebrow");c.appendChild(r("span","zrc-eyebrow-dot")),c.appendChild(r("span",null,"Free. Ungated. Nothing sold.")),o.appendChild(c),o.appendChild(r("h2","zrc-h1","An honest picture of your utility")),o.appendChild(r("p","zrc-lede","Answer 23 questions about your system and get back a plain read on where you are strong, where you are at risk, and the specific next step for each weak spot."));let l=r("div","zrc-facts");l.appendChild(J("How long it takes","About 90 to 120 minutes the first time, if your records are nearby. About 30 to 45 minutes for an annual update once the system is in routine use.")),l.appendChild(J("Who should be in the room","At minimum, the licensed operator, the board chair, and the financial clerk, together if you can manage it. Each of them sees a different part of the system. One person answering alone tends to skew the result toward whichever part they know best.")),l.appendChild(J("What happens to your answers","There is no account and no signup, and you never have to give us your email to see your score. Your answers save in this browser so you can stop and come back, and nothing is sent anywhere. If that changes, this paragraph changes with it.")),o.appendChild(l);let d=r("div","zrc-actions"),p=r("div","zrc-start-wrap"),u=r("button","zrc-btn zrc-btn-primary","Start the Report Card");if(u.type="button",u.addEventListener("click",a),p.appendChild(u),t&&p.appendChild(r("p","zrc-start-subtext","Starts over from question 1 and clears your saved answers.")),d.appendChild(p),t){let h=r("button","zrc-btn zrc-btn-secondary","Resume where you left off ("+n+"/"+i+")");h.type="button",h.addEventListener("click",s),d.appendChild(h)}o.appendChild(d),e.appendChild(o)}function J(e,t){let n=r("div","zrc-fact");return n.appendChild(r("h3","zrc-fact-label",e)),n.appendChild(r("p","zrc-fact-body",t)),n}function de(e,t){let{dimensions:n,grades:i,idx:a,gradeLabels:s,rungOrders:o,onAnswer:c,onGoto:l,onExit:d,onViewResults:p}=t;D(e);let u=P(i,n),h=n[a],f=r("div","zrc-intake");f.appendChild(qe(u,d)),f.appendChild(Ge(u,h.leg)),f.appendChild(je(n,i,a,l)),f.appendChild(_e(h,i,s,c,o&&o[h.id])),f.appendChild(Ue(n,a,l,p));let g=r("div","zrc-viewresults-row"),y=r("button","zrc-link-btn","See my results so far");y.type="button",y.addEventListener("click",p),g.appendChild(y),f.appendChild(g),e.appendChild(f);let R=f.querySelector(".zrc-step-title");R&&R.focus()}function pe(e,{dimensions:t,grades:n}){let i=P(n,t),a=e.querySelector(".zrc-topbar-count");a&&(a.textContent=i.answered+" of "+i.total+" answered"),W.forEach(s=>{let o=i.legAverages.find(u=>u.leg===s),c=e.querySelector('.zrc-legbar[data-leg="'+s+'"]');if(!c)return;let l=o.total?Math.round(o.answered/o.total*100):0,d=c.querySelector(".zrc-legbar-fill");d&&(d.style.width=l+"%");let p=c.querySelector(".zrc-legbar-count");p&&(p.textContent=o.answered+"/"+o.total)}),t.forEach(s=>{let o=e.querySelector('.zrc-jumpbtn[data-dim-id="'+s.id+'"]');if(!o)return;let c=!!n[s.id];o.classList.toggle("zrc-jumpbtn-answered",c),o.textContent=s.id+(c?" \u2713":""),o.setAttribute("aria-label",s.id+", "+s.name+(c?", answered":", not yet answered"))})}function qe(e,t){let n=r("div","zrc-topbar"),i=r("button","zrc-link-btn","\u2190 Save and exit");return i.type="button",i.addEventListener("click",t),n.appendChild(i),n.appendChild(r("span","zrc-topbar-count",e.answered+" of "+e.total+" answered")),n}function Ge(e,t){let n=r("div","zrc-legbars");return W.forEach(i=>{let a=e.legAverages.find(p=>p.leg===i),s=a.total?Math.round(a.answered/a.total*100):0,o=r("div","zrc-legbar"+(i===t?" zrc-legbar-current":""));o.dataset.leg=i;let c=r("div","zrc-legbar-label");c.appendChild(r("span",null,k[i])),c.appendChild(r("span","zrc-legbar-count",a.answered+"/"+a.total)),o.appendChild(c);let l=r("div","zrc-legbar-track"),d=r("div","zrc-legbar-fill");d.style.width=s+"%",d.style.background=O[i],l.appendChild(d),o.appendChild(l),n.appendChild(o)}),n}function je(e,t,n,i){let a=r("nav","zrc-jumpnav");return a.setAttribute("aria-label","Jump to a dimension"),W.forEach(s=>{let o=r("div","zrc-jumpgroup");o.appendChild(r("span","zrc-jumpgroup-label",k[s]));let c=r("div","zrc-jumprow");e.forEach((l,d)=>{if(l.leg!==s)return;let p=!!t[l.id],u=["zrc-jumpbtn"];d===n&&u.push("zrc-jumpbtn-current"),p&&u.push("zrc-jumpbtn-answered");let h=r("button",u.join(" "),l.id+(p?" \u2713":""));h.type="button",h.dataset.dimId=l.id,h.setAttribute("aria-label",l.id+", "+l.name+(p?", answered":", not yet answered")),d===n&&h.setAttribute("aria-current","step"),h.addEventListener("click",()=>i(d)),c.appendChild(h)}),o.appendChild(c),a.appendChild(o)}),a}function _e(e,t,n,i,a){let s=r("div","zrc-card zrc-step-card"),o=r("div","zrc-step-meta");o.appendChild(r("span","zrc-legbadge",k[e.leg]+" \xB7 "+e.id)),s.appendChild(o);let c="zrc-dim-heading",l=r("h2","zrc-step-title",e.name);l.id=c,l.tabIndex=-1,s.appendChild(l),s.appendChild(r("p","zrc-step-def",e.definition)),s.appendChild(r("div","zrc-step-instruction","Pick the description that sounds most like your utility today."));let d=r("div","zrc-ruggroup zrc-ruggroup-blind");d.setAttribute("role","radiogroup"),d.setAttribute("aria-labelledby",c);let p=a&&a.length===z.length?a:z;return p.forEach((u,h)=>{let f=r("label","zrc-rung"),g=document.createElement("input");g.type="radio",g.name="zrc-rung-"+e.id,g.value=u,g.className="zrc-rung-input",g.checked=t[e.id]===u,g.setAttribute("aria-label","Option "+(h+1)+" of "+p.length+": "+e.rungs[u]),g.addEventListener("change",()=>i(e.id,u)),f.appendChild(g);let y=r("span","zrc-rung-text");y.appendChild(r("span","zrc-rung-desc",e.rungs[u])),f.appendChild(y),d.appendChild(f)}),s.appendChild(d),s}function Ue(e,t,n,i){let a=t===e.length-1,s=r("div","zrc-navrow"),o=r("button","zrc-btn zrc-btn-quiet","\u2190 Previous");o.type="button",o.disabled=t===0,o.addEventListener("click",()=>n(t-1)),s.appendChild(o);let c=r("button","zrc-btn zrc-btn-quiet","Skip for now");c.type="button",c.addEventListener("click",()=>{a?i():n(t+1)}),s.appendChild(c);let l=r("button","zrc-btn zrc-btn-primary",a?"See my results \u2192":"Next \u2192");return l.type="button",l.addEventListener("click",()=>{a?i():n(t+1)}),s.appendChild(l),s}var He=[["Under 500","Under 500"],["500 to 1,000","500 to 1,000"],["1,000 to 3,300","1,000 to 3,300"],["3,300 to 10,000","3,300 to 10,000"],["Over 10,000","Over 10,000"]],$e=[["1 or fewer","1 or fewer"],["2 to 4","2 to 4"],["5 to 9","5 to 9"],["10 to 24","10 to 24"],["25 or more","25 or more"]],Qe=[["Under $250k","Under $250k"],["$250k to $500k","$250k to $500k"],["$500k to $1M","$500k to $1M"],["$1M to $2.5M","$1M to $2.5M"],["$2.5M to $5M","$2.5M to $5M"],["Over $5M","Over $5M"],["Not sure","Not sure"]],Je=[["Water","Water"],["Wastewater","Wastewater"],["Both","Both"]];function ue(e,t){let{profile:n,onSubmit:i,onSkip:a,onBack:s}=t;D(e);let o=n||{},c=r("div","zrc-profile"),l=r("div","zrc-topbar"),d=r("button","zrc-link-btn","\u2190 Back to the questions");d.type="button",d.addEventListener("click",s),l.appendChild(d),c.appendChild(l);let p=r("h2","zrc-h1","A few optional questions");p.tabIndex=-1,c.appendChild(p),c.appendChild(r("p","zrc-lede","Every question below is optional. Skip this and you get the exact same full report on the next screen. Nothing here changes your score.")),c.appendChild(r("p","zrc-profile-why","Here is why we ask. There is very little data anywhere on how small water and wastewater systems are actually doing day to day. Answers like yours help build a real picture of that, one that gets shared back rather than locked away. Answer as many or as few as you want."));let u=r("div","zrc-profile-grid");u.appendChild(H("zrc-profile-connections","Service connections","How many service connections does your system have?",He,o.connections)),u.appendChild(H("zrc-profile-employees","Staff","How many full-time-equivalent staff work on the utility?",$e,o.employees)),u.appendChild(H("zrc-profile-revenue","Annual operating revenue","Your best estimate is fine.",Qe,o.revenue)),u.appendChild(H("zrc-profile-systemtype","System type","Water, wastewater, or both?",Je,o.systemType)),c.appendChild(u);let h=r("div","zrc-profile-field zrc-profile-email-field"),f=r("label","zrc-profile-label","Email");f.htmlFor="zrc-profile-email",h.appendChild(f),h.appendChild(r("p","zrc-profile-help","Only if you want us to be able to reach you about your results. Not a newsletter signup. Your report is on the next screen either way, and you can print or save it from there."));let g=document.createElement("input");g.type="email",g.id="zrc-profile-email",g.className="zrc-profile-input",g.placeholder="you@utility.gov",g.value=o.email||"",h.appendChild(g),c.appendChild(h);let y={connections:u.querySelector("#zrc-profile-connections"),employees:u.querySelector("#zrc-profile-employees"),revenue:u.querySelector("#zrc-profile-revenue"),systemType:u.querySelector("#zrc-profile-systemtype")},R=r("div","zrc-profile-actions"),x=r("button","zrc-btn zrc-btn-secondary","Skip, just show me my report");x.type="button",x.addEventListener("click",a),R.appendChild(x);let b=r("button","zrc-btn zrc-btn-primary","Submit and see my report");b.type="button",b.addEventListener("click",()=>{let v={};y.connections.value&&(v.connections=y.connections.value),y.employees.value&&(v.employees=y.employees.value),y.revenue.value&&(v.revenue=y.revenue.value),y.systemType.value&&(v.systemType=y.systemType.value);let A=g.value.trim();A&&(v.email=A),i(v)}),R.appendChild(b),c.appendChild(R),e.appendChild(c),p.focus()}function H(e,t,n,i,a){let s=r("div","zrc-profile-field"),o=r("label","zrc-profile-label",t);o.htmlFor=e,s.appendChild(o),n&&s.appendChild(r("p","zrc-profile-help",n));let c=document.createElement("select");c.id=e,c.className="zrc-profile-select";let l=document.createElement("option");return l.value="",l.textContent="Prefer not to say",c.appendChild(l),i.forEach(([d,p])=>{let u=document.createElement("option");u.value=d,u.textContent=p,d===a&&(u.selected=!0),c.appendChild(u)}),s.appendChild(c),s}var Ze=new Set(q);function $(e,t){if(!e||!t||!e.rungs||!e.rungs[t])return null;let n=r("p","zrc-whatmeans");return n.appendChild(r("span","zrc-whatmeans-label","What this means: ")),n.appendChild(document.createTextNode(e.rungs[t])),n}function ge(e){return"zrc-redline-"+e}function he(e){return"zrc-allrow-"+e}function fe(e,t,n,i){let a=r("div",e+" zrc-see-above");a.appendChild(r("span",e.indexOf("actionplan")>-1?"zrc-actionplan-leg":"zrc-onerungup-leg",k[t]+" \xB7 "+n));let s=document.createElement("a");return s.className="zrc-see-above-link",s.href="#"+ge(n),s.textContent="See "+i+" above",a.appendChild(s),a}function Ye(e){return e.length<=1?e.join(""):e.length===2?e[0]+" and "+e[1]:e.slice(0,-1).join(", ")+", and "+e[e.length-1]}var Ke='<svg xmlns="http://www.w3.org/2000/svg" width="595.995" height="71.933" viewBox="0 0 595.995 71.933" fill="none"><path d="M 217.668 50.734 L 188.205 50.734 L 217.245 20.29 L 217.245 7.002 L 164.076 7.002 L 164.076 21.299 L 193.2 21.299 L 163.653 52.248 L 163.653 65.872 L 217.668 65.872 L 217.668 50.734 Z" fill="#0c1f30"></path><path d="M 242.616 65.872 L 242.616 7.002 L 224.498 7.002 L 224.498 65.872 L 242.616 65.872 Z" fill="#0c1f30"></path><path d="M 249.861 7.002 L 249.861 65.872 L 267.809 65.872 L 267.809 47.875 L 301.675 47.875 C 303.707 42.576 304.723 35.933 304.723 27.943 C 304.723 19.449 303.538 12.469 301.336 7.002 L 249.861 7.002 Z M 267.809 20.711 L 285.927 20.711 C 286.435 22.477 286.774 24.831 286.774 27.691 C 286.774 30.718 286.435 33.073 285.927 34.755 L 267.809 34.755 L 267.809 20.711 Z" fill="#0c1f30"></path><path d="M 364.67 21.804 L 364.67 7.002 L 309.808 7.002 L 309.808 21.804 L 328.265 21.804 L 328.265 65.872 L 346.213 65.872 L 346.213 21.804 L 364.67 21.804 Z" fill="#0c1f30"></path><path d="M 390.031 65.872 L 390.031 7.002 L 371.913 7.002 L 371.913 65.872 L 390.031 65.872 Z" fill="#0c1f30"></path><path d="M 415.217 51.154 L 415.217 7.002 L 397.268 7.002 L 397.268 65.872 L 442.817 65.872 L 442.817 51.154 L 415.217 51.154 Z" fill="#0c1f30"></path><path d="M 468.149 65.872 L 468.149 7.002 L 450.031 7.002 L 450.031 65.872 L 468.149 65.872 Z" fill="#0c1f30"></path><path d="M 530.249 21.801 L 530.249 7 L 475.386 7 L 475.386 21.801 L 493.843 21.801 L 493.843 65.869 L 511.792 65.869 L 511.792 21.801 L 530.249 21.801 Z" fill="#0c1f30"></path><path d="M 574.518 44.991 L 595.995 7.002 L 576.691 7.002 L 565.543 30.118 L 554.565 7.002 L 535.092 7.002 L 556.569 44.991 L 556.569 65.872 L 574.518 65.872 L 574.518 44.991 Z" fill="#0c1f30"></path><path d="M 76.447 60.312 C 74.624 62.221 75.977 65.384 78.616 65.384 L 106.198 65.384 C 107.018 65.384 107.802 65.048 108.368 64.455 L 133.902 37.709 C 135.724 35.8 134.371 32.637 131.732 32.637 L 104.15 32.637 C 103.331 32.637 102.547 32.973 101.98 33.566 L 76.447 60.312 Z" fill="#0c1f30"></path><path d="M 0.836 34.224 C -0.986 36.133 0.367 39.296 3.006 39.296 L 30.588 39.296 C 31.407 39.296 32.191 38.96 32.758 38.367 L 58.291 11.621 C 60.114 9.712 58.761 6.549 56.121 6.549 L 28.54 6.549 C 27.72 6.549 26.936 6.885 26.37 7.478 L 0.836 34.224 Z" fill="#0c1f30"></path><path d="M 118.221 5.072 C 120.043 3.163 118.69 0 116.051 0 L 81.645 0 C 80.825 0 80.041 0.335 79.475 0.928 L 16.519 66.861 C 14.696 68.77 16.049 71.933 18.688 71.933 L 53.094 71.933 C 53.914 71.933 54.698 71.598 55.264 71.005 L 118.221 5.072 Z" fill="#0c1f30"></path></svg>';function Ve(){try{return new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}catch{try{return new Date().toDateString()}catch{return""}}}function Xe(){let e=r("div","zrc-print-logo");e.setAttribute("aria-hidden","true");let t=r("div","zrc-print-logo-mark");t.innerHTML=Ke,e.appendChild(t);let n=r("div","zrc-print-logo-meta");return n.appendChild(r("div","zrc-print-logo-title","Utility Health Report Card")),n.appendChild(r("div","zrc-print-logo-date",Ve())),e.appendChild(n),e}function et(){let e=r("div","zrc-print-footer");return e.setAttribute("aria-hidden","true"),e.textContent="ziptility.com/tools/report-card",e}var tt={F:"This system needs help now.",D:"This system is carrying real risk.",C:"This system is getting by.",B:"This system is in solid shape.",A:"This system is thriving."};function ye(e,t){let{dimensions:n,grades:i,gradeLabels:a,onBack:s,onEdit:o}=t;D(e);let c={};n.forEach(g=>{c[g.id]=g});let l=P(i,n),d=new Set(l.flags.map(g=>g.id)),p=r("div","zrc-results");p.appendChild(Xe());let u=r("div","zrc-topbar zrc-noprint"),h=r("button","zrc-link-btn","\u2190 Back to the questions");h.type="button",h.addEventListener("click",s),u.appendChild(h),u.appendChild(r("span","zrc-topbar-count",l.answered+" of "+l.total+" dimensions answered")),p.appendChild(u),p.appendChild(rt(l,a)),p.appendChild(at(n,i,a)),p.appendChild(st(n,i,l.overall.grade)),p.appendChild(lt(l,c,a,n,o)),p.appendChild(dt(l,c,a,d)),p.appendChild(pt(n,i,a,o,d)),p.appendChild(ut()),p.appendChild(et()),e.appendChild(p);let f=p.querySelector(".zrc-h1");f&&(f.tabIndex=-1,f.focus())}function rt(e,t){let n=r("section","zrc-composite"),i=e.practical.capped,a=i?e.practical.grade:e.overall.grade;n.appendChild(it(e,a,t,i)),n.appendChild(r("p","zrc-composite-secondary-label",i?"Descriptive composite (the plain average, before the cap)":"By capacity"));let s=r("div","zrc-composite-grid"+(i?" zrc-composite-grid-secondary":""));return e.legAverages.forEach(o=>{s.appendChild(me(k[o.leg],o.grade,o.answered,o.total,t))}),s.appendChild(me("Overall",e.overall.grade,e.answered,e.total,t)),n.appendChild(s),n}function it(e,t,n,i){let a=r("div","zrc-plaque"+(t?" zrc-plaque-filled":"")),s=r("h2","zrc-h1 zrc-plaque-headline",t?tt[t]:"Answer a few dimensions to see your picture");if(!t)return a.appendChild(s),a;let o=r("div","zrc-plaque-row"),c=r("div","zrc-plaque-grade");c.appendChild(r("span","zrc-plaque-letter",t)),c.appendChild(r("span","zrc-plaque-name",_(t,n))),o.appendChild(c);let l=r("div","zrc-plaque-text");if(l.appendChild(s),i){let d=Ye(e.flags.map(p=>p.name));l.appendChild(r("p","zrc-plaque-sub",e.flags.length+" of your critical dimensions scored F: "+d+". Your Practical Grade is "+t+", and that is the one to act on."))}else l.appendChild(r("p","zrc-plaque-sub",e.answered+" of "+e.total+" dimensions answered."));return o.appendChild(l),a.appendChild(o),a}function me(e,t,n,i,a){let s=r("div","zrc-composite-card");s.appendChild(r("div","zrc-composite-card-label",e));let o=r("div","zrc-composite-card-grade");if(t){let c=U[t];o.style.color=c.fg,o.style.background=c.bg,o.appendChild(r("span","zrc-composite-letter",t)),o.appendChild(r("span","zrc-composite-name",_(t,a)))}else o.appendChild(r("span","zrc-composite-name","Not yet gradable"));return s.appendChild(o),s.appendChild(r("div","zrc-composite-card-sub",n+" of "+i+" answered")),s}function at(e,t,n){let i=r("section","zrc-bars-section");i.appendChild(r("h2","zrc-h2","All 23 dimensions")),i.appendChild(r("p","zrc-section-lede","Grouped by Technical, Managerial, and Financial capacity. Every bar carries its letter and its name as text; colour is never the only signal.")),i.appendChild(nt(e,t));let a=r("div","zrc-bars-grid");return W.forEach(s=>{let o=r("div","zrc-bars-group zrc-card");o.style.borderTop="4px solid "+O[s];let c=r("h3","zrc-bars-group-title"),l=r("span","zrc-swatch");l.style.background=O[s],c.appendChild(l),c.appendChild(document.createTextNode(k[s]+" capacity")),o.appendChild(c),e.filter(d=>d.leg===s).forEach(d=>{o.appendChild(ot(d,t[d.id],n))}),a.appendChild(o)}),i.appendChild(a),i}function nt(e,t){let n=r("nav","zrc-jumpnav zrc-noprint");return n.setAttribute("aria-label","Jump to a dimension below"),W.forEach(i=>{let a=r("div","zrc-jumpgroup");a.appendChild(r("span","zrc-jumpgroup-label",k[i]));let s=r("div","zrc-jumprow");e.forEach(o=>{if(o.leg!==i)return;let c=!!t[o.id],l=document.createElement("a");l.className="zrc-jumpbtn"+(c?" zrc-jumpbtn-answered":""),l.href="#"+he(o.id),l.textContent=o.id+(c?" \u2713":""),l.setAttribute("aria-label",o.id+", "+o.name),s.appendChild(l)}),a.appendChild(s),n.appendChild(a)}),n}function ot(e,t,n){let i=r("div","zrc-bar-row");i.id=he(e.id);let a=r("div","zrc-bar-head"),s=r("span","zrc-bar-name",e.name+" ");Ze.has(e.id)&&s.appendChild(r("span","zrc-critical-tag","critical dimension")),a.appendChild(s),a.appendChild(r("span","zrc-bar-gradetext",T(t,n))),i.appendChild(a);let o=r("div","zrc-bar-track"),c=r("div","zrc-bar-fill"),l=t?z.indexOf(t):-1;c.style.width=l>=0?Math.round((l+1)/z.length*100)+"%":"0%",c.style.background=t?U[t].fg:"#cbd5e1",o.appendChild(c),i.appendChild(o);let d=$(e,t);d&&i.appendChild(d);let p=document.createElement("details");p.className="zrc-cite-details";let u=document.createElement("summary");return u.className="zrc-cite-summary",u.textContent="Citation",p.appendChild(u),p.appendChild(r("p","zrc-cite",e.citation)),i.appendChild(p),i}function st(e,t,n){let i=r("section","zrc-wheel-section zrc-noprint");i.appendChild(r("h2","zrc-h2","The same picture, as a wheel")),i.appendChild(r("p","zrc-section-lede","A picture only. The bars above carry the same information as text."));let a=r("div","zrc-wheel-card"),s=ct(e,t,n);return a.appendChild(s),i.appendChild(a),i}function ct(e,t,n){let l=e.length,p=(360-6*W.length)/l,u=(A,L)=>{let M=(L-90)*Math.PI/180;return[150+A*Math.cos(M),150+A*Math.sin(M)]},h=(A,L)=>{let[M,E]=u(128,A),[m,S]=u(128,L),[w,Ae]=u(58,L),[Ce,xe]=u(58,A),Y=L-A>180?1:0;return"M"+M+","+E+" A128,128 0 "+Y+" 1 "+m+","+S+" L"+w+","+Ae+" A58,58 0 "+Y+" 0 "+Ce+","+xe+" Z"},f="http://www.w3.org/2000/svg",g=document.createElementNS(f,"svg");g.setAttribute("viewBox","0 0 300 300"),g.setAttribute("width","260"),g.setAttribute("height","260"),g.setAttribute("aria-hidden","true"),g.setAttribute("focusable","false");let y=0,R=e.length?e[0].leg:"T";e.forEach((A,L)=>{L>0&&A.leg!==R&&(y+=6,R=A.leg);let M=y,E=y+p,m=t[A.id],S=m?U[m].fg:"#e2e8f0",w=document.createElementNS(f,"path");w.setAttribute("d",h(M,E)),w.setAttribute("fill",S),w.setAttribute("stroke","#ffffff"),w.setAttribute("stroke-width","1.5"),g.appendChild(w),y=E});let x=document.createElementNS(f,"circle");x.setAttribute("cx",String(150)),x.setAttribute("cy",String(150)),x.setAttribute("r",String(52)),x.setAttribute("fill","#fcfaf6"),g.appendChild(x);let b=document.createElementNS(f,"text");b.setAttribute("x",String(150)),b.setAttribute("y",String(152)),b.setAttribute("text-anchor","middle"),b.setAttribute("dominant-baseline","middle"),b.setAttribute("font-family","Archivo, sans-serif"),b.setAttribute("font-weight","900"),b.setAttribute("font-size","42"),b.setAttribute("fill","#0c1f30"),b.textContent=n||"",g.appendChild(b);let v=document.createElementNS(f,"text");return v.setAttribute("x",String(150)),v.setAttribute("y",String(178)),v.setAttribute("text-anchor","middle"),v.setAttribute("font-family","Geist, sans-serif"),v.setAttribute("font-size","11"),v.setAttribute("fill","#475569"),v.textContent="overall",g.appendChild(v),g}function lt(e,t,n,i,a){let s=r("section","zrc-redline-section");if(s.appendChild(r("h2","zrc-h2","These need attention first")),s.appendChild(r("p","zrc-section-lede","A small set of dimensions where a failing grade is treated as an emergency, regardless of the rest of the picture.")),e.flags.length===0)return s.appendChild(r("p","zrc-redline-clear","None of the critical dimensions are failing right now.")),s;let o=r("div","zrc-redline-list");return e.flags.forEach(c=>{let l=t[c.id],d=r("div","zrc-redline-card");d.id=ge(c.id);let p=r("div","zrc-redline-head");if(p.appendChild(r("div","zrc-redline-leg",k[c.leg]+" \xB7 "+c.id)),p.appendChild(r("span","zrc-critical-tag","critical dimension")),d.appendChild(p),d.appendChild(r("h3","zrc-redline-name",c.name)),d.appendChild(r("div","zrc-redline-grade","Currently: "+T(c.grade,n))),l){let u=$(l,c.grade);u&&d.appendChild(u);let h=G(l,c.grade);h&&d.appendChild(r("p","zrc-action-text",h)),d.appendChild(r("p","zrc-cite",l.citation))}if(a&&i){let u=r("button","zrc-link-btn zrc-noprint","Revisit this dimension");u.type="button",u.addEventListener("click",()=>a(i.findIndex(h=>h.id===c.id))),d.appendChild(u)}o.appendChild(d)}),s.appendChild(o),s}function dt(e,t,n,i){let a=r("section","zrc-onerungup-section");if(a.appendChild(r("h2","zrc-h2","Your next move: one rung up")),a.appendChild(r("p","zrc-section-lede","The three dimensions where moving up one letter would help the most.")),e.oneRungUp.length===0)return a.appendChild(r("p",null,"Not enough is answered yet to rank a next move, or every graded dimension is already at A.")),a;let s=r("div","zrc-onerungup-list");return e.oneRungUp.forEach(o=>{if(i.has(o.id)){s.appendChild(fe("zrc-onerungup-card",o.leg,o.id,o.name));return}let c=t[o.id],l=r("div","zrc-onerungup-card");l.appendChild(r("div","zrc-onerungup-leg",k[o.leg]+" \xB7 "+o.id)),l.appendChild(r("h3",null,o.name)),l.appendChild(r("div","zrc-onerungup-transition","Currently "+T(o.current,n)+". Target: "+T(o.target,n)+"."));let d=$(c,o.current);d&&l.appendChild(d);let p=G(c,o.current);p&&l.appendChild(r("p","zrc-action-text",p)),s.appendChild(l)}),a.appendChild(s),a}function pt(e,t,n,i,a){let s=r("section","zrc-actionplan-section");s.appendChild(r("h2","zrc-h2","Action plan")),s.appendChild(r("p","zrc-section-lede","Every graded dimension below A, with the specific next step and its source."));let o=e.filter(l=>{let d=t[l.id];return d&&d!=="A"});if(o.length===0)return s.appendChild(r("p",null,"Nothing here yet. Either nothing is graded below A, or nothing has been answered.")),s;let c=r("div","zrc-actionplan-list");return o.forEach(l=>{if(a.has(l.id)){c.appendChild(fe("zrc-actionplan-card",l.leg,l.id,l.name));return}let d=t[l.id],p=r("div","zrc-actionplan-card"),u=r("div","zrc-actionplan-head");u.appendChild(r("span","zrc-actionplan-leg",k[l.leg]+" \xB7 "+l.id)),u.appendChild(r("span","zrc-actionplan-grade",T(d,n))),p.appendChild(u),p.appendChild(r("h3",null,l.name));let h=$(l,d);h&&p.appendChild(h);let f=G(l,d);f&&p.appendChild(r("p","zrc-action-text",f)),p.appendChild(r("p","zrc-cite",l.citation));let g=r("button","zrc-link-btn zrc-noprint","Revisit this dimension");g.type="button",g.addEventListener("click",()=>i(e.indexOf(l))),p.appendChild(g),c.appendChild(p)}),s.appendChild(c),s}function ut(){let e=r("section","zrc-softcapture zrc-noprint");e.appendChild(r("h2","zrc-h2-sm","Bring this to your next board meeting")),e.appendChild(r("p",null,"The result is already on the screen above. If it is useful, email yourself a copy or print it. No account, no follow-up call."));let t=r("div","zrc-softcapture-row"),n=document.createElement("input");n.type="email",n.placeholder="you@utility.gov",n.className="zrc-email-input",n.setAttribute("aria-label","Your email address, optional"),t.appendChild(n);let i=r("button","zrc-btn zrc-btn-secondary","Email it to myself");i.type="button",i.addEventListener("click",()=>{try{let s=n.value.trim(),o=encodeURIComponent("My Utility Health Report Card result"),c=encodeURIComponent("Print this page (or save as PDF) for the full result.");window.location.href="mailto:"+s+"?subject="+o+"&body="+c}catch{}}),t.appendChild(i);let a=r("button","zrc-btn zrc-btn-quiet","Print this Report Card");return a.type="button",a.addEventListener("click",()=>{try{window.print()}catch{}}),t.appendChild(a),e.appendChild(t),e}var mt="tool_complete",gt="tool_progress";function be(e){try{if(typeof window>"u")return;window.dataLayer=window.dataLayer||[],window.dataLayer.push(e)}catch{}}function Z(e,t){if(!e)return;let n={event:mt,tool_name:String(e)};t&&typeof t=="object"&&Object.keys(t).forEach(i=>{let a=t[i];a==null||a===""||typeof a!="object"&&(n["tool_"+i]=typeof a=="number"?a:String(a))}),be(n)}function ve(e,t,n){!e||!n||be({event:gt,tool_name:String(e),tool_answered:Number(t),tool_total:Number(n),tool_percent:Math.round(Number(t)/Number(n)*100)})}function we(e){let t={},n=(e||[25,50,75]).slice().sort((i,a)=>i-a);return function(a,s){if(!s)return null;let o=a/s*100;for(let c=n.length-1;c>=0;c--){let l=n[c];if(o>=l&&!t[l])return t[l]=!0,l}return null}}function ze(){let e=document.getElementById("ziptility-report-card");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zrc-styles")){let m=document.createElement("style");m.id="zrc-styles",m.textContent=K,document.head.appendChild(m)}if(!document.getElementById("zrc-fonts")){let m=document.createElement("link");m.rel="preconnect",m.href="https://fonts.googleapis.com";let S=document.createElement("link");S.rel="preconnect",S.href="https://fonts.gstatic.com",S.crossOrigin="anonymous";let w=document.createElement("link");w.id="zrc-fonts",w.rel="stylesheet",w.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(m,S,w)}window.addEventListener("beforeprint",()=>{e.querySelectorAll(".zrc-cite-details").forEach(m=>{m.dataset.zrcWasOpen=m.open?"1":"0",m.open=!0})}),window.addEventListener("afterprint",()=>{e.querySelectorAll(".zrc-cite-details").forEach(m=>{m.open=m.dataset.zrcWasOpen==="1"})});let t=N.dimensions,n=N.gradeLabels,i=null;try{i=ie()}catch{i=null}let a=i&&i.grades||{},s=i&&typeof i.idx=="number"?i.idx:0,o=se(t,i&&i.orders),c=i&&i.profile||null,l=!!(i&&i.submitted),d="landing";e.innerHTML="";let p=document.createElement("div");p.className="zrc-wrap",e.appendChild(p);function u(){try{ae({grades:a,idx:s,orders:o,profile:c,submitted:l})}catch{}}function h(m){return Math.max(0,Math.min(t.length-1,m))}function f(){d="landing",E()}function g(m){d="intake",typeof m=="number"&&(s=h(m)),u(),E()}function y(){s=0,a={},o=oe(t),g(0)}function R(){if(c||l){b();return}d="profile",E()}let x=!1;function b(){if(d="results",!x){x=!0;try{let m=P(a,N.dimensions);Z("report-card",{practical_grade:m.practical&&m.practical.grade,overall_grade:m.overall&&m.overall.grade,capped:m.practical&&m.practical.capped?"yes":"no",redline_count:m.flags?m.flags.length:0,answered:m.answered,complete:m.complete?"yes":"no"})}catch{Z("report-card")}}E()}function v(m){c=m||{},u(),ce({grades:a,profile:c,dimensions:t}).then(()=>{l=!0,u()}).catch(()=>{}),b()}let A=we([25,50,75]);function L(m,S){a=Object.assign({},a,{[m]:S}),u();try{let w=Object.keys(a).length;A(w,t.length)&&ve("report-card",w,t.length)}catch{}pe(p,{dimensions:t,grades:a})}function M(){return{dimensions:t,grades:a,idx:s,gradeLabels:n,rungOrders:o,onAnswer:L,onGoto:g,onExit:f,onViewResults:R}}function E(){if(d==="landing"){let m=P(a,t);le(p,{hasSaved:m.answered>0,savedCount:m.answered,total:m.total,onStart:y,onResume:()=>g(s)})}else d==="intake"?de(p,M()):d==="profile"?ue(p,{profile:c,onSubmit:v,onSkip:b,onBack:()=>g(s)}):ye(p,{dimensions:t,grades:a,gradeLabels:n,profile:c,onBack:()=>g(s),onEdit:m=>g(m)})}E()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ze):ze();})();
