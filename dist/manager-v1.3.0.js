/* Ziptility Manager Tools manager-v1.3.0 (39f352ed92dfff09cdc45f55679112f3a349e2b2) https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var I=`/* Ziptility Manager Toolbox - styles for the three manager-facing tools.
   Token block copied verbatim from src/ui/styles.css's DS 4.0 reskin
   section (per the build brief: "copy the token block ... rather than
   inventing values") rather than duplicated-and-drifted. Everything below
   the tokens is new markup (.zmt-* classes) built for the single-tool card
   layout these pages use, not the operator calculator's category grid.

   2026-07-29 design-audit fixes (Look Bar FAIL -> pass): DS token binding
   (A5), 4.5:1 label/status contrast (A1), 44px tap targets (A2), 16px
   input font (A3), h1->h2 heading outline (A4, in ui/render.js), print
   color-adjust (A6), plus the hero-number/lead-with-meaning/visible-label
   comprehension fixes (C1-C5, in ui/render.js and tools/*.js interpret()). */

:root {
  --brand-navy: #0c1f30;         /* Ziptility midnight-blue (design lock) */
  --brand-red: #ff442f;          /* Ziptility tomato (design lock) - single accent */
  --brand-red-dark: #c02100;     /* DS --tomato-press (was a bespoke #c5341f - audit A5) */
  --brand-font-display: 'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --brand-font-body: 'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --brand-font-mono: 'Geist', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --bg: #fbf8f5;                 /* warm linen page */
  --card: #ffffff;
  --ink: #0c1f30;
  --muted: #6b7785;
  /* DS --neutral-600 ("body text" per DESIGN_SYSTEM_HANDOFF.md). --muted
     measures 3.85:1 on the tan tile background and 3.99:1 on the pink alert
     tile - both under the 4.5:1 text floor (audit A1). This is the same
     grey family, just dark enough to clear it on every tinted surface this
     bundle uses; see the manager-tools QAQC report for the measured pairs. */
  --muted-strong: #475569;
  --line: #e5ded4;
  --line-soft: #f1ebe2;
  --accent: var(--brand-red);
  --accent-dark: var(--brand-red-dark);
  --good: #1E9E6A;
  --shadow: 0 1px 2px rgba(12, 31, 48, .05), 0 10px 28px rgba(12, 31, 48, .07);

  /* DS 4.0 semantic status set, bound verbatim from DESIGN_SYSTEM_HANDOFF.md
     (audit A5: this bundle previously invented #A12020/#136A47/#8A5A00).
     -fg is the text-safe variant: the raw --danger/--success/--warning
     tokens measure 4.41:1 / 3.15:1 / 3.07:1 on their own -bg tint, i.e. two
     of the three fail the 4.5:1 text floor outright, so -fg is what runs as
     TEXT here. The raw token is used only for the non-text border accent,
     which only needs to clear the ~3:1 non-text floor (it does, on every
     background in this file). Measured pairs are in the QAQC report. */
  --danger: #dc2626;  --danger-bg: #fef2f2;  --danger-border: #fca5a5;  --danger-fg: #b91c1c;
  --success: #16a34a; --success-bg: #f0fdf4; --success-border: #86efac; --success-fg: #15803d;
  --warning: #d97706; --warning-bg: #fffbeb; --warning-border: #fcd34d; --warning-fg: #b45309;

  /* SIGNATURE, 2026-07-29 (design pass): the DS's own dark surface + text-on-dark pair
     (DESIGN_SYSTEM_HANDOFF.md --gradient-dark and --text-on-dark), used below for the result
     "gauge" panel. Same gradient angle/stops as src/ui's .cta-inner, so a dark band means the
     same thing in every bundle rather than a bespoke dark for each. */
  --gauge-dark: linear-gradient(160deg, var(--brand-navy), #14365a);
  --linen: #f6eee6;
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: var(--brand-font-body); color: var(--ink); background: var(--bg); -webkit-font-smoothing: antialiased; line-height: 1.45; }

.zmt-head { max-width: 760px; margin: 0 auto; padding: 20px 16px 6px; }
.zmt-eyebrow { font-family: var(--brand-font-mono); font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; }
.zmt-head h1 { font-family: var(--brand-font-display); font-weight: 900; font-size: 24px; letter-spacing: -.02em; margin: 0 0 6px; }
.zmt-tagline { margin: 0; font-size: 14px; color: var(--muted); line-height: 1.55; max-width: 62ch; }

main { max-width: 760px; margin: 0 auto; padding: 10px 16px 20px; }
/* DS consistency, 2026-07-29 design pass: DESIGN_SYSTEM_HANDOFF.md \xA74 - "Cards: white surface,
   10px radius, soft navy-tinted shadow ... no hard borders." This card kept a 1px border the
   calculator's own card dropped in its G4 fix; removed here so all four bundles' cards match. */
.zmt-card { background: var(--card); border-radius: 10px; box-shadow: var(--shadow); padding: 20px 20px 18px; }
.zmt-card-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
.zmt-formula { font-family: var(--brand-font-mono); font-size: 12.5px; color: var(--ink); background: #f6eee6; border: 1px solid #ece1d3; border-radius: 6px; padding: 5px 8px; }

.zmt-section { font-family: var(--brand-font-display); font-weight: 700; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); margin: 16px 0 8px; }
.zmt-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; }
.zmt-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.zmt-field label { font-size: 12px; font-weight: 600; color: var(--muted); }
/* Audit A3: 14.5px input text triggers iOS Safari's auto-zoom on focus. */
.zmt-field input { width: 100%; font-family: var(--brand-font-mono); font-size: 16px; color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 9px 10px; }
.zmt-field input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(255, 68, 47, .14); }
.zmt-field input.zmt-computed { background: #fff1ee; border-color: var(--accent); box-shadow: inset 3px 0 0 var(--accent); font-weight: 600; }
.zmt-uf { display: flex; gap: 8px; }
.zmt-uf input { flex: 1; min-width: 0; }
/* Audit A2: 27px tall, under the 44px tap-target floor. */
.zmt-uf select { flex: none; height: 44px; min-height: 44px; font-family: var(--brand-font-mono); font-size: 12px; color: var(--accent-dark); background: #ffe9e5; border: 1px solid var(--line); border-radius: 10px; padding: 0 10px; }
.zmt-rot { font-size: 11px; color: var(--muted); font-style: italic; }

.zmt-advanced { margin-top: 10px; }
.zmt-advanced summary { cursor: pointer; font-family: var(--brand-font-display); font-weight: 600; font-size: 12.5px; color: var(--accent-dark); }
.zmt-advanced .zmt-fields { margin-top: 10px; }

/* Audit C4: the criticality toggle can single-handedly override the
   verdict but had only an aria-label, no visible text. zmt-toggle-caption
   is styled to match .zmt-field label exactly. */
.zmt-toggle-field { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
.zmt-toggle-caption { font-size: 12px; font-weight: 600; color: var(--muted); }

/* Audit A2: segmented buttons measured 27px tall; gap/padding widened too
   ("miss-safe spacing") so 44px targets sitting side by side don't invite
   a mis-tap between them. */
.zmt-seg { display: inline-flex; background: var(--line-soft); border: 1px solid var(--line); border-radius: 999px; padding: 4px; gap: 4px; }
.zmt-seg button { cursor: pointer; font-family: var(--brand-font-display); font-weight: 600; font-size: 12px; color: var(--muted); background: transparent; border: none; border-radius: 999px; padding: 6px 16px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; }
.zmt-seg button[aria-pressed="true"] { color: #fff; background: var(--ink); }

.zmt-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
/* Audit A2: buttons measured 38px tall. */
.zmt-btn { cursor: pointer; font-family: var(--brand-font-display); font-weight: 600; font-size: 13.5px; border-radius: 10px; padding: 10px 16px; min-height: 44px; border: 1px solid transparent; display: inline-flex; align-items: center; justify-content: center; }
/* PRIMARY-ACTION FIX, 2026-07-29 (design pass, Blake ruling): this button's fill was raw tomato
   (--accent, #ff442f) with white text - MEASURED 3.43:1, failing 4.5:1, and simply unflagged by
   the earlier accessibility-only audit (A-series above) because that pass never re-checked this
   file's OWN calculate button, only the shared status/label tokens. --accent-dark is already
   DS tomato-press (#c02100, MEASURED white-on-press = 6.07:1), so this is a one-line fill swap,
   not a new token - and it is now the SAME fill/text pairing src/ui and src/practice use for
   their primary action, which is the point: one primary-action treatment across all four bundles. */
.zmt-btn-calc { background: var(--accent-dark); color: #fff; flex: 1 1 140px; box-shadow: 0 3px 10px rgba(192, 33, 0, .22); }
.zmt-btn-calc:hover { filter: brightness(0.85); }
.zmt-btn-clear, .zmt-btn-print { background: #fff; color: var(--muted); border-color: var(--line); }
.zmt-btn-clear:hover, .zmt-btn-print:hover { border-color: var(--muted); color: var(--ink); }

.zmt-msg { font-size: 12.5px; margin-top: 10px; color: var(--accent-dark); font-weight: 600; }

/* THE GAUGE (design pass, 2026-07-29 - supersedes the earlier plain-text hero, audit C2's
   original fix). Verdict says "generic, competent, describable only as clean... the default
   shape of every SaaS calculator on the internet" of this exact screen. The fix is not another
   tile: the one number a reader acts on now sits in its own dark instrument-panel band - the
   same --gauge-dark surface as src/ui's CTA - INSIDE the white input card, so the page still
   reads as one tool but the answer is unmistakably a different kind of thing than a form field.
   "Never beautify the subject, always beautify the craft" (DS thesis): the subject is still a
   plain number, but it is presented like a reading on a piece of equipment, not a stat card. */
.zmt-hero {
  margin-top: 16px;
  background: var(--gauge-dark);
  border-radius: 10px; /* DS "THE radius" for chrome, not imagery - DESIGN_SYSTEM_HANDOFF.md \xA70.3 */
  padding: 20px 22px 22px;
  color: #fff;
}
.zmt-hero .zmt-badge { margin-bottom: 12px; }
.zmt-hero-num { font-family: var(--brand-font-mono); font-weight: 800; font-size: 42px; line-height: 1.05; letter-spacing: -.01em; color: #fff; }
/* --linen is the DS's own "text-on-dark" pair (DESIGN_SYSTEM_HANDOFF.md --text-on-dark), full
   opacity rather than a translucent white, so it stays readable at any render engine's AA gamma. */
.zmt-hero-label { font-size: 13.5px; font-weight: 600; color: var(--linen); margin-top: 4px; }

.zmt-badge { display: inline-block; padding: 6px 14px; border-radius: 999px; font-family: var(--brand-font-display); font-weight: 700; font-size: 12px; letter-spacing: .02em; text-transform: uppercase; border: 1px solid; }
.zmt-badge-alert { color: var(--danger-fg); background: var(--danger-bg); border-color: var(--danger-border); }
.zmt-badge-good { color: var(--success-fg); background: var(--success-bg); border-color: var(--success-border); }
.zmt-badge-watch { color: var(--warning-fg); background: var(--warning-bg); border-color: var(--warning-border); }

/* THE SPEC SHEET (design pass, 2026-07-29 - supersedes the "5 same-size gray tiles" shape audit
   C2/A7 left in place). Secondary stats read as a gauge cluster's spec plate now - a single list
   of label/value rows with a rule between them (DS 9.11: "tables are a legitimate and often
   superior format... beats prose and beats a chart" for anything a reader compares) - rather than
   N identical boxes repeating the same shape. Same HTML as before (render.js untouched); this is
   a CSS-only reshape. */
.zmt-stats { display: flex; flex-direction: column; gap: 0; margin-top: 16px; border-top: 1px solid var(--line); }
.zmt-stat { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; background: none; border-radius: 0; border-bottom: 1px solid var(--line-soft); padding: 11px 2px; }
/* Audit A1: label was --muted (3.85:1 / 3.99:1), under the 4.5:1 floor; --muted-strong measures
   6.39:1+ on the page background this list now sits on (see the QAQC report for the pair list). */
.zmt-stat-label { display: block; font-size: 12.5px; color: var(--muted-strong); font-weight: 600; margin-bottom: 0; }
.zmt-stat-val { display: block; font-family: var(--brand-font-mono); font-weight: 700; font-size: 16px; color: var(--ink); text-align: right; white-space: nowrap; }

.zmt-flag.zmt-chip { display: inline-block; margin: 8px 8px 0 0; padding: 6px 11px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid; }
.zmt-flag.zmt-chip-watch { color: var(--warning-fg); background: var(--warning-bg); border-color: var(--warning-border); }

.zmt-insight { margin-top: 12px; font-size: 13px; border-radius: 8px; padding: 10px 12px; line-height: 1.55; display: none; border: 1px solid; }
.zmt-insight.zmt-show { display: block; }
.zmt-insight .zmt-lead { font-family: var(--brand-font-display); font-weight: 700; margin-right: 4px; }
.zmt-insight.zmt-good { background: var(--success-bg); border-color: var(--success-border); color: var(--success-fg); }
.zmt-insight.zmt-watch { background: var(--warning-bg); border-color: var(--warning-border); color: var(--warning-fg); }
.zmt-insight.zmt-alert { background: var(--danger-bg); border-color: var(--danger-border); color: var(--danger-fg); }
/* Not named in audit A5 (which scoped danger/success/warning only); this
   pair measures 6.5:1+ already, so it is left as-is on purpose. */
.zmt-insight.zmt-info { background: #EEF3F8; border-color: #CFDBE8; color: #3C5A74; }

.zmt-links { margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--line-soft); font-size: 12px; color: var(--muted); }
.zmt-links a { color: var(--accent); font-weight: 600; text-decoration: none; }
.zmt-links a:hover { text-decoration: underline; }

/* Soft capture: only ever reachable after a result exists (render.js
   un-hides this button). No gate anywhere in front of the answer.
   Audit A2: measured 34px tall. */
.zmt-capture-open { margin-top: 14px; cursor: pointer; background: #fff; color: var(--accent-dark); border: 1px solid var(--line); border-radius: 10px; padding: 9px 14px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; font-family: var(--brand-font-display); font-weight: 600; font-size: 13px; }
.zmt-capture-open:hover { border-color: var(--accent); }
.zmt-capture-open[hidden] { display: none; }

.zmt-error { background: #fff; border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: 10px; padding: 16px; margin: 20px auto; max-width: 700px; font-size: 13.5px; line-height: 1.5; }

.zmt-foot { max-width: 760px; margin: 8px auto 0; padding: 16px 16px 40px; color: var(--muted); font-size: 12px; }
.zmt-disclaimer { background: #fff; border: 1px solid var(--line); border-left: 3px solid var(--accent); border-radius: 10px; padding: 14px 16px; line-height: 1.55; }
.zmt-disclaimer strong { color: var(--ink); }
.zmt-colophon { margin-top: 12px; }
/* Same raw-tomato text failure as .zmt-btn-calc above (3.43:1 on white), also missed by the
   earlier accessibility-only audit. --brand-red-dark is DS tomato-press (6.07:1). */
.zmt-colophon a { color: var(--brand-red-dark); text-decoration: none; }
.zmt-colophon a:hover { text-decoration: underline; }

/* Modal (soft capture) */
.zmt-modal { position: fixed; inset: 0; z-index: 60; display: none; align-items: center; justify-content: center; padding: 18px; background: rgba(14, 42, 71, .55); backdrop-filter: blur(3px); }
.zmt-modal.zmt-show { display: flex; }
.zmt-modal-card { background: #fff; border-radius: 16px; max-width: 420px; width: 100%; padding: 24px; box-shadow: 0 24px 60px rgba(14, 42, 71, .3); position: relative; }
.zmt-modal-card h3 { font-family: var(--brand-font-display); font-weight: 700; font-size: 18px; margin: 0 0 6px; }
.zmt-modal-card p { margin: 0 0 14px; font-size: 13px; color: var(--muted); line-height: 1.5; }
.zmt-modal-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 11px; }
.zmt-modal-field label { font-size: 12px; font-weight: 600; color: var(--muted); }
.zmt-modal-field input { font-family: var(--brand-font-body); font-size: 14px; border: 1px solid var(--line); border-radius: 10px; padding: 10px 11px; }
.zmt-modal-field input:focus { outline: none; border-color: var(--brand-red); box-shadow: 0 0 0 3px rgba(255, 68, 47, .14); }
/* Same primary-action fix as .zmt-btn-calc: raw tomato + white text measured 3.43:1. Resting fill
   moves to tomato-press; hover darkens further with brightness() rather than a third named token. */
.zmt-modal-submit { width: 100%; background: var(--brand-red-dark); color: #fff; border: none; border-radius: 10px; padding: 12px; font-family: var(--brand-font-display); font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 4px; }
.zmt-modal-submit:hover { filter: brightness(0.85); }
.zmt-modal-close { position: absolute; top: 14px; right: 14px; background: none; border: none; cursor: pointer; color: var(--muted); font-size: 22px; line-height: 1; }
.zmt-modal-fine { font-size: 11px; color: var(--muted); margin-top: 11px; line-height: 1.4; }
.zmt-modal-ok { display: none; text-align: center; padding: 12px 0; }
.zmt-modal-ok .zmt-check { width: 44px; height: 44px; border-radius: 50%; background: var(--success-bg); color: var(--good); display: grid; place-items: center; margin: 0 auto 12px; font-size: 20px; }

/* Print/PDF: legible, high contrast (>=12pt, per the neutral-lane rule).
   Audit A6: without print-color-adjust, Chrome/Safari strip background
   colors by default on print, so the verdict badge and the flag/insight
   tints rendered as plain white - the board-packet purpose depends on
   those tints surviving onto paper. */
@media print {
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .zmt-actions, .zmt-capture-open, .zmt-modal { display: none !important; }
  body { background: #fff; }
  .zmt-card { box-shadow: none; border: 1px solid #000; }
  .zmt-field input, .zmt-stat-val { font-size: 13pt; color: #000; }
  .zmt-disclaimer { border-color: #000; }
}

/* Gated/in-app embed: nothing extra to hide here (no CTA band exists in
   this bundle to begin with), kept for parity with the calculator/practice
   idiom in case a future embed wants a hook. */
body.zmt-embed-app .zmt-foot { display: none; }

@media (max-width: 560px) {
  .zmt-fields { grid-template-columns: 1fr; }
  .zmt-hero-num { font-size: 32px; }
}

@media (prefers-color-scheme: dark) {
  /* This bundle only ships on Webflow pages with the site's light chrome;
     no dark-mode host exists yet, so no override is defined here on
     purpose (nothing to test against) rather than guessing colors. */
}
`;var w={length:{in:{label:"in",f:.08333333333333333},ft:{label:"ft",f:1},yd:{label:"yd",f:3},mi:{label:"mi",f:5280},mm:{label:"mm",f:.0032808399},cm:{label:"cm",f:.032808399},m:{label:"m",f:3.2808399},km:{label:"km",f:3280.8399}},area:{sqin:{label:"in\xB2",f:.006944444444444444},sqft:{label:"ft\xB2",f:1},sqyd:{label:"yd\xB2",f:9},ac:{label:"acre",f:43560},sqm:{label:"m\xB2",f:10.7639104},ha:{label:"hectare",f:107639.104}},volume:{gal:{label:"gal",f:1},cf:{label:"cu ft",f:7.480519},L:{label:"L",f:.26417205},m3:{label:"m\xB3",f:264.17205},MG:{label:"MG",f:1e6},acft:{label:"ac-ft",f:325851},lbH2O:{label:"lb H\u2082O",f:.1198266}},mass:{lb:{label:"lb",f:1},kg:{label:"kg",f:2.2046226},g:{label:"g",f:.0022046226},ton:{label:"ton",f:2e3},galH2O:{label:"gal H\u2082O",f:8.3454}},flow:{gpm:{label:"gpm",f:1},mgd:{label:"MGD",f:694.44444},gpd:{label:"gpd",f:.0006944444444444445},cfs:{label:"cfs",f:448.8312},Lps:{label:"L/s",f:15.850323},mlmin:{label:"mL/min",f:.0002641721070710684}},power:{hp:{label:"hp",f:1},kW:{label:"kW",f:1.34102209},W:{label:"W",f:.00134102209},btuh:{label:"BTU/hr",f:.000393014779}}};function H(e,t,i,n){return e*w[n][t].f/w[n][i].f}function C(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}var j=[{id:"repair-or-replace",cat:"Asset Management",domains:["water","wastewater"],title:"Repair or Replace?",formula:"Annual repair cost vs. annualized replacement cost",note:"One water main segment: breaks per mile per year, the outlier flag, and the break-even point where replacing beats patching. One screenshot, one number, one next step.",fields:[{k:"segLen",label:"Segment length",unit:"length",units:["ft","mi"],def:"mi",section:"Outlier screen (optional)"},{k:"years",label:"Years of break history",section:"Outlier screen (optional)"},{k:"breaks",label:"Breaks in that window (count)",section:"Outlier screen (optional)"},{k:"cohortAvg",label:"Cohort avg breaks/mi/yr",def:.25,section:"Outlier screen (optional)"},{k:"breaksYr",label:"Expected breaks/yr (auto-fills from above, overridable)",section:"Break-even"},{k:"costRepair",label:"Average cost per repair ($, fully-loaded: crew OT, materials, restoration, water loss)",def:5e3,section:"Break-even"},{k:"costReplace",label:"Total replacement cost ($)",section:"Break-even"},{k:"lifeYrs",label:"Useful life (years)",def:50,section:"Break-even"},{k:"discountRate",label:"Discount rate % (advanced)",def:0,section:"Break-even",advanced:!0}],toggle:{k:"criticality",def:"Normal",label:"Criticality",options:[{v:"Normal",label:"Normal"},{v:"High",label:"High"},{v:"Critical",label:"Critical"}]},solve:e=>{let t=C(e.years),i=C(e.breaks),n=C(e.breaksYr);if(n==null&&t!=null&&t>0&&i!=null&&(n=i/t),n==null)return{values:{},computed:[],error:"Enter expected breaks/yr, or breaks and years of history."};let a=C(e.costRepair)??5e3,d=C(e.costReplace);if(d==null||d<=0)return{values:{},computed:[],error:"Enter the total replacement cost."};let s=C(e.lifeYrs)??50;if(s<=0)return{values:{},computed:[],error:"Useful life must be greater than zero."};let c=C(e.discountRate)??0,b=C(e.cohortAvg)??.25,g=e.criticality||"Normal",h=n*a,p;if(c>0){let r=c/100,o=Math.pow(1+r,s);p=o-1!==0?d*(r*o)/(o-1):d/s}else p=d/s;let y=a>0?p/a:null,v=null,E=null;if(t!=null&&t>0&&i!=null&&e.segLen!=null){let r=H(e.segLen,"ft","mi","length");r>0&&(v=i/t/r,E=v>=2*b)}let P=g==="High"||g==="Critical",k;return P||h>1.1*p?k="REPLACE":h<.9*p?k="KEEP REPAIRING":k="ON THE LINE",{values:{breaksYr:n,annualRepair:h,annualizedReplace:p,breakEvenN:y,breaksPerMileYr:v,flagOutlier:E,verdict:k,criticalityOverride:P,criticality:g,costRepair:a,costReplace:d,lifeYrs:s,discountRate:c,cohortAvg:b},computed:["breaksYr","annualRepair","annualizedReplace","breakEvenN","verdict"],error:""}},interpret:e=>{if(e.verdict==null)return null;let t=e.verdict==="REPLACE"?"alert":e.verdict==="KEEP REPAIRING"?"good":"watch",i=Math.round(e.breakEvenN*100)/100,n=Math.round(e.breaksYr*100)/100,a=e.verdict+". Replacement pays for itself once this main breaks more than "+i+" times/yr; you are at "+n+".";if(e.breakEvenN>0&&isFinite(e.breaksYr/e.breakEvenN)){let d=Math.round(e.breaksYr/e.breakEvenN*10)/10,s=d>1?"over":d<1?"under":"right at";a+=" You are running about "+d+" times the break-even rate, "+s+" the line."}return e.criticalityOverride&&(a+=" Criticality is set to "+e.criticality+", so this recommends REPLACE regardless of the break-even math."),e.flagOutlier===!0&&(a+=" Outlier flag: this segment runs about "+Math.round(e.breaksPerMileYr*100)/100+" breaks/mile/yr, at least 2x the cohort average of "+e.cohortAvg+"."),a+=" This treats a repair and a replacement as buying the same service; it ignores the consequence cost of a failure unless you raise criticality.",e.verdict==="REPLACE"?a+=" Add this segment to your capital plan, or ask your engineer for a replacement estimate.":e.verdict==="ON THE LINE"?a+=" Keep monitoring. Re-run this after the next break.":a+=" No action needed yet. Re-run this after the next break.",{level:t,text:a}},links:[{label:"EPA Asset Management: A Handbook for Small Water Systems (PDF)",href:"https://www.epa.gov/system/files/documents/2022-06/FINAL%20AM%20Handbook%20for%20Small%20Water%20Systems%20STEP%20Guide_508.pdf"},{label:"See how utilities tie this number to their asset records",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["break even","main break","watchlist","2x rule","outlier","capital planning","replacement reserve","CIP"]}];function L(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}var q=[{id:"cost-of-turnover",cat:"Workforce",domains:["water","wastewater"],title:"Cost of Turnover",formula:"Operators lost/yr x (recruiting + OT backfill + ramp cost)",note:"What losing an operator actually costs, and the raise it would take to break even on keeping one instead.",fields:[{k:"operatorsLost",label:"Operators lost per year"},{k:"salary",label:"Fully-loaded salary per operator ($/yr)"},{k:"recruitCost",label:"Recruiting + training cost per hire ($)"},{k:"otWeeklyRate",label:"On-call/OT backfill cost per week vacant ($)",def:400},{k:"vacancyWeeks",label:"Weeks the position sits vacant"},{k:"rampMonths",label:"Months to full proficiency (new-hire ramp)",def:12},{k:"rampLossPct",label:"Productivity loss during ramp (% of salary, averaged over the ramp)",def:50}],solve:e=>{let t=L(e.operatorsLost),i=L(e.salary),n=L(e.recruitCost),a=L(e.vacancyWeeks);if(t==null||t<=0)return{values:{},computed:[],error:"Enter how many operators you lose in a typical year."};if(i==null||i<=0)return{values:{},computed:[],error:"Enter the fully-loaded salary per operator."};if(n==null||n<0)return{values:{},computed:[],error:"Enter the recruiting + training cost per hire (0 if none)."};if(a==null||a<0)return{values:{},computed:[],error:"Enter how many weeks the position typically sits vacant."};let d=L(e.otWeeklyRate)??400,s=L(e.rampMonths)??12,c=L(e.rampLossPct)??50,b=d*a,g=i*(s/12)*(c/100),h=n+b+g,p=t*h;return{values:{otBackfillCost:b,rampCost:g,costPerDeparture:h,annualCost:p,breakEvenRaise:h,operatorsLost:t,salary:i,recruitCost:n,vacancyWeeks:a,otWeeklyRate:d,rampMonths:s,rampLossPct:c},computed:["otBackfillCost","rampCost","costPerDeparture","annualCost","breakEvenRaise"],error:""}},interpret:e=>{if(e.annualCost==null)return null;let t=Math.round(e.annualCost),i=Math.round(e.breakEvenRaise),n="Losing "+e.operatorsLost+" operator"+(e.operatorsLost===1?"":"s")+"/yr costs about $"+t.toLocaleString("en-US")+"/yr (recruiting + OT backfill + ramp-up productivity loss). A retention raise would have to beat $"+i.toLocaleString("en-US")+" per operator per year to lose money; anything under that line is cheaper than the churn it prevents.";if(e.salary>0){let a=Math.round(e.costPerDeparture/e.salary*100);n+=" That is about "+a+"% of one operator's fully-loaded salary, per departure."}return n+=" Next: take this number to your next budget or staffing conversation and weigh it against what a raise or bonus would actually cost.",{level:"info",text:n}},links:[{label:"Field guide: staffing and turnover, it is a budget decision",href:"https://www.ziptility.com/guides/staffing-and-turnover-its-a-budget-decision"},{label:"See how utilities track this in Ziptility",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["retention","staffing","silver tsunami","overtime","on-call","recruiting cost","vacancy"]}];function A(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}function O(e,t){return e==null||t==null||t===0?null:(e-t)/t*100}var _=[{id:"energy-cost",cat:"Energy",domains:["water","wastewater"],title:"Energy $ per 1,000 Gallons",formula:"kWh / (gallons / 1,000); x $/kWh = $ per 1,000 gal",note:"Energy as a number you manage: cost per 1,000 gallons pumped, plus the three preventive-maintenance triggers if you have a prior period to compare against.",fields:[{k:"kwh",label:"kWh this period"},{k:"gallons",label:"Gallons pumped this period"},{k:"rate",label:"$ / kWh",def:.1},{k:"kwhPrior",label:"kWh, prior period (optional)"},{k:"gallonsPrior",label:"Gallons pumped, prior period (optional)"},{k:"startsPerDay",label:"Pump starts/day, this period (optional)"},{k:"startsPerDayPrior",label:"Pump starts/day, prior period (optional)"},{k:"specificCapacity",label:"Specific capacity, this period, gpm/ft drawdown (optional, wells)"},{k:"specificCapacityPrior",label:"Specific capacity, prior period (optional)"}],solve:e=>{let t=A(e.kwh),i=A(e.gallons);if(t==null)return{values:{},computed:[],error:"Enter kWh for this period."};if(i==null||i<=0)return{values:{},computed:[],error:"Enter gallons pumped this period."};let n=A(e.rate)??.1,a=t/(i/1e3),d=a*n,s=A(e.kwhPrior),c=A(e.gallonsPrior),b=null,g=null,h=null;s!=null&&c!=null&&c>0&&(b=s/(c/1e3),g=O(a,b),h=g!=null&&g>=15);let p=A(e.startsPerDay),y=A(e.startsPerDayPrior),v=null,E=null;p!=null&&y!=null&&y>0&&(v=O(p,y),E=v!=null&&v>=25);let P=A(e.specificCapacity),k=A(e.specificCapacityPrior),r=null,o=null;P!=null&&k!=null&&k>0&&(r=O(P,k),o=r!=null&&r<=-20);let l=[];return h&&l.push("kWh/1,000 gal up "+Math.round(g*10)/10+"% vs prior period (>= 15% trigger)"),E&&l.push("pump starts/day up "+Math.round(v*10)/10+"% vs prior period (>= 25% trigger)"),o&&l.push("specific capacity down "+Math.round(Math.abs(r)*10)/10+"% vs prior period (>= 20% drop trigger)"),{values:{kwhPerKgal:a,costPerKgal:d,kwhPerKgalPrior:b,energyPctChange:g,flagEnergyUp:h,startsPctChange:v,flagStartsUp:E,scPctChange:r,flagCapacityDown:o,pmTriggered:l,rate:n},computed:["kwhPerKgal","costPerKgal"],error:""}},interpret:e=>{if(e.kwhPerKgal==null)return null;let t=Math.round(e.kwhPerKgal*100)/100,i=Math.round(e.costPerKgal*100)/100,n="This period: "+t+" kWh per 1,000 gal, $"+i+" per 1,000 gal.";if(e.pmTriggered&&e.pmTriggered.length)return n+=" PM trigger"+(e.pmTriggered.length===1?"":"s")+" tripped: "+e.pmTriggered.join("; ")+". Schedule a pump/well check.",{level:"watch",text:n};if(e.kwhPerKgalPrior!=null){let a=Math.round(e.energyPctChange*10)/10,d=a>0?"higher":a<0?"lower":"the same as";n+=" That is about "+Math.abs(a)+"% "+d+" the prior period. No PM trigger tripped.",n+=" Keep tracking each period so a real change stands out early."}else n+=" No prior period to compare yet. Enter this period again next time you run the numbers, and you will see the trend and catch a change early.";return{level:"good",text:n}},links:[{label:"Field guide: energy as a number you manage",href:"https://www.ziptility.com/guides/energy-as-a-number-you-manage"},{label:"See how utilities track this in Ziptility",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["kwh per 1000 gallons","specific energy","pump starts","specific capacity","preventive maintenance","energy audit"]}];var D=[...j,...q,..._];function m(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function G(e){return`
<header class="zmt-head">
  <div class="zmt-head-wrap">
    <p class="zmt-eyebrow">Manager toolbox</p>
    <h1>${m(e.title)}</h1>
    <p class="zmt-tagline">${m(e.note)}</p>
  </div>
</header>

<main><div class="zmt-stage" id="zmt-stage"></div></main>

<!-- Soft capture - opt-in only, and only reachable after a result exists
     (render.js unhides #zmt-capture-open; never a gate in front of the answer). -->
<div class="zmt-modal" id="zmt-lead-modal" role="dialog" aria-modal="true" aria-labelledby="zmt-lead-title">
  <div class="zmt-modal-card">
    <button class="zmt-modal-close" id="zmt-lead-close" type="button" aria-label="Close">&times;</button>
    <div id="zmt-lead-form">
      <h3 id="zmt-lead-title">Email or print this result</h3>
      <p>We will send the numbers you just calculated, formatted for a board packet or a work order. No result is shared until you ask for it.</p>
      <div class="zmt-modal-field"><label for="zmt-ld-name">Name</label><input id="zmt-ld-name" autocomplete="name"></div>
      <div class="zmt-modal-field"><label for="zmt-ld-email">Work email</label><input id="zmt-ld-email" type="email" autocomplete="email"></div>
      <div class="zmt-modal-field"><label for="zmt-ld-util">Utility / system (optional)</label><input id="zmt-ld-util" autocomplete="organization"></div>
      <button class="zmt-modal-submit" id="zmt-lead-submit" type="button">Send it to me</button>
      <p class="zmt-modal-fine">We will send this result and the occasional Ziptility note for utility managers. Unsubscribe anytime. No spam.</p>
    </div>
    <div class="zmt-modal-ok" id="zmt-lead-ok">
      <div class="zmt-check">&#10003;</div>
      <h3>On its way</h3>
      <p id="zmt-lead-ok-msg">Check your inbox. Thanks!</p>
    </div>
  </div>
</div>

<footer class="zmt-foot">
  <div class="zmt-disclaimer">
    <strong>Always verify before you act on this.</strong> This is a working aid for common manager math, not a substitute for your board packet, your engineer's estimate, or your utility's own numbers. Every default value on this page is a rule of thumb; use your own number wherever you have one.
  </div>
  <div class="zmt-colophon"><a href="https://www.ziptility.com" target="_blank" rel="noopener">ziptility.com</a></div>
</footer>
`}var T={hubspotPortalId:"4938013",hubspotFormId:"",fallbackEmail:"sales@ziptility.com"},F="zip-manager-energy-history";var V="tool_complete";function J(e){try{if(typeof window>"u")return;window.dataLayer=window.dataLayer||[],window.dataLayer.push(e)}catch{}}function W(e,t){if(!e)return;let i={event:V,tool_name:String(e)};t&&typeof t=="object"&&Object.keys(t).forEach(n=>{let a=t[n];a==null||a===""||typeof a!="object"&&(i["tool_"+n]=typeof a=="number"?a:String(a))}),J(i)}function x(e){if(e==null||!isFinite(e))return"";let t=Math.round(e*1e6)/1e6;return Math.abs(t)>=1e3?t.toLocaleString("en-US",{maximumFractionDigits:2}):String(parseFloat(t.toFixed(4)))}function R(e){if(e==null||!isFinite(e))return"";let t=e<0?"-":"",i=Math.abs(e),n=i<100?2:0;return t+"$"+i.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function X(e){try{let t=window.localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}}function ee(e,t){try{window.localStorage.setItem(e,JSON.stringify(t))}catch{}}var U={"repair-or-replace":[{k:"breaksYr",label:"Your breaks/yr",f:x},{k:"breakEvenN",label:"Break-even breaks/yr",f:x},{k:"annualRepair",label:"Annual repair cost",f:R},{k:"annualizedReplace",label:"Annualized replacement cost",f:R}],"cost-of-turnover":[{k:"breakEvenRaise",label:"Retention-raise break-even ($/operator/yr)",f:R},{k:"costPerDeparture",label:"Cost per departure",f:R}],"energy-cost":[{k:"kwhPerKgal",label:"kWh / 1,000 gal",f:x}]},B={"repair-or-replace":e=>{let t="--",i="break-even ratio unavailable";if(e.breakEvenN>0){let n=e.breaksYr/e.breakEvenN;if(isFinite(n)){let a=Math.round(n*10)/10,d=a>1?"over":a<1?"under":"at";t=x(a)+"x",i=d+" the break-even line"}}return{numeral:t,caption:i,badge:e.verdict,badgeClass:e.verdict==="REPLACE"?"alert":e.verdict==="KEEP REPAIRING"?"good":"watch"}},"cost-of-turnover":e=>({numeral:R(e.annualCost),caption:"the annual cost of churn",badge:null,badgeClass:null}),"energy-cost":e=>{let t=e.pmTriggered&&e.pmTriggered.length>0;return{numeral:R(e.costPerKgal),caption:"per 1,000 gallons",badge:t?"PM check advised":"On track",badgeClass:t?"watch":"good"}}};function te(e){let t=[],i=null;return e.fields.forEach(n=>{let a=n.section||"";(!i||i.section!==a)&&(i={section:a,fields:[]},t.push(i)),i.fields.push(n)}),t}function ae(e,t){let n=(t.units||Object.keys(w[t.unit])).map(a=>'<option value="'+a+'"'+(a===t.def?" selected":"")+">"+w[t.unit][a].label+"</option>").join("");return'<select id="'+e+'__u" data-cur="'+t.def+'" aria-label="unit">'+n+"</select>"}function Y(e,t){let i="zmt-"+e.id+"-"+t.k,n=!t.unit&&t.def!=null,a=n?' value="'+m(x(t.def))+'"':"",d='<input id="'+i+'" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="-"'+a+">",s=t.unit?'<div class="zmt-uf">'+d+ae(i,t)+"</div>":d,c=n?'<div class="zmt-rot">Rule of thumb, use your own number.</div>':"";return'<div class="zmt-field" data-k="'+t.k+'"><label for="'+i+'">'+m(t.label)+"</label>"+s+c+"</div>"}function re(e){if(!e.toggle)return"";let t=e.toggle,i=t.label||t.k.charAt(0).toUpperCase()+t.k.slice(1),n="zmt-toggle-label-"+e.id+"-"+t.k;return'<div class="zmt-toggle-field"><span class="zmt-toggle-caption" id="'+n+'">'+m(i)+'</span><div class="zmt-seg" role="group" aria-labelledby="'+n+'">'+t.options.map(a=>'<button type="button" data-v="'+m(a.v)+'" aria-pressed="'+(a.v===t.def)+'">'+m(a.label)+"</button>").join("")+"</div></div>"}function $(e,t){e.innerHTML=G(t);let i=e.querySelector("#zmt-stage"),n=te(t),a=t.toggle?t.toggle.def:null,d=n.map(r=>{let o=r.fields.filter(z=>!z.advanced),l=r.fields.filter(z=>z.advanced),f=(r.section?'<h2 class="zmt-section">'+m(r.section)+"</h2>":"")+'<div class="zmt-fields">'+o.map(z=>Y(t,z)).join("")+"</div>";return l.length&&(f+='<details class="zmt-advanced"><summary>Advanced</summary><div class="zmt-fields">'+l.map(z=>Y(t,z)).join("")+"</div></details>"),f}).join("");if(i.innerHTML='<div class="zmt-card"><div class="zmt-card-head"><div class="zmt-formula">'+m(t.formula)+"</div>"+re(t)+"</div>"+d+'<div class="zmt-actions"><button class="zmt-btn zmt-btn-calc" id="zmt-calc" type="button">Calculate</button><button class="zmt-btn zmt-btn-clear" id="zmt-clear" type="button">Clear</button><button class="zmt-btn zmt-btn-print" id="zmt-print" type="button">Print / PDF</button></div><div class="zmt-msg" id="zmt-msg" aria-live="polite"></div><div class="zmt-result" id="zmt-result" aria-live="polite"></div><div class="zmt-links" id="zmt-links"></div><button class="zmt-capture-open" id="zmt-capture-open" type="button" hidden>Email or print this result</button></div>',t.links&&t.links.length){let r=e.querySelector("#zmt-links");r.innerHTML="Learn more: "+t.links.map(o=>'<a href="'+o.href+'" target="_blank" rel="noopener">'+m(o.label)+"</a>").join(" &middot; ")}let s={};t.fields.forEach(r=>{s[r.k]=e.querySelector("#zmt-"+t.id+"-"+r.k)});function c(r){if(!r)return null;let o=r.value.replace(/,/g,"").trim();if(o==="")return null;let l=parseFloat(o);return isFinite(l)?l:null}function b(r){return e.querySelector("#"+r.id+"__u")}function g(r){let o=s[r.k],l=c(o);if(l==null)return null;if(r.unit){let f=b(o);return l*w[r.unit][f.value].f}return l}function h(r,o){let l=s[r.k];if(l)if(r.unit){let f=b(l);l.value=x(o/w[r.unit][f.value].f)}else l.value=x(o)}if(t.fields.forEach(r=>{if(!r.unit)return;let o=s[r.k],l=b(o);l.addEventListener("change",()=>{let f=l.dataset.cur,z=l.value,N=c(o);N!=null&&(o.value=x(N*w[r.unit][f].f/w[r.unit][z].f)),l.dataset.cur=z})}),t.toggle&&e.querySelectorAll(".zmt-seg button").forEach(r=>r.addEventListener("click",()=>{r.dataset.v!==a&&(a=r.dataset.v,e.querySelectorAll(".zmt-seg button").forEach(o=>o.setAttribute("aria-pressed",String(o.dataset.v===a))))})),t.id==="energy-cost"){let r=X(F);if(r){let o={kwhPrior:"kwh",gallonsPrior:"gallons",startsPerDayPrior:"startsPerDay",specificCapacityPrior:"specificCapacity"};Object.keys(o).forEach(l=>{let f=s[l];f&&!f.value&&r[o[l]]!=null&&(f.value=x(r[o[l]]))})}}let p=e.querySelector("#zmt-msg"),y=e.querySelector("#zmt-result"),v=e.querySelector("#zmt-capture-open"),E=!1;function P(r){if(y.innerHTML="",p.textContent="",p.className="zmt-msg",r.error){p.textContent=r.error;return}E||(E=!0,W(t.id,{verdict:r.verdict&&r.verdict.label})),t.fields.forEach(u=>{if(u.k in r.values){let S=r.values[u.k];typeof S=="number"&&isFinite(S)&&r.computed.includes(u.k)&&(h(u,S),s[u.k]&&s[u.k].classList.add("zmt-computed"))}});let o=B[t.id],l=o?o(r.values):null,f="";if(l){let u=l.badge?'<div class="zmt-badge zmt-badge-'+l.badgeClass+'">'+m(l.badge)+"</div>":"";f+='<div class="zmt-hero">'+u+'<div class="zmt-hero-num">'+m(l.numeral)+'</div><div class="zmt-hero-label">'+m(l.caption)+"</div></div>"}if(t.interpret){let u=t.interpret(r.values);u&&(f+='<div class="zmt-insight zmt-show zmt-'+u.level+'"><span class="zmt-lead">Note</span>'+m(u.text)+"</div>")}let N=(U[t.id]||[]).map(u=>{let S=r.values[u.k];if(S==null)return"";let M=m(u.f?u.f(S):String(S));return'<div class="zmt-stat"><span class="zmt-stat-label">'+m(u.label)+'</span><span class="zmt-stat-val">'+M+"</span></div>"}).join("");if(f+='<div class="zmt-stats">'+N+"</div>",r.values.flagOutlier===!0&&(f+='<div class="zmt-chip zmt-chip-watch zmt-flag">Outlier: '+x(r.values.breaksPerMileYr)+" breaks/mi/yr (>= 2x cohort avg of "+x(r.values.cohortAvg)+")</div>"),r.values.pmTriggered&&r.values.pmTriggered.length&&r.values.pmTriggered.forEach(u=>{f+='<div class="zmt-chip zmt-chip-watch zmt-flag">'+m(u)+"</div>"}),y.innerHTML=f,t.id==="energy-cost"){let u={};["kwh","gallons","startsPerDay","specificCapacity"].forEach(M=>{r.values[M]!=null&&(u[M]=r.values[M])});let S={kwh:c(s.kwh),gallons:c(s.gallons),startsPerDay:c(s.startsPerDay),specificCapacity:c(s.specificCapacity)};ee(F,S)}v.hidden=!1,e.dataset.zmtResultSummary=ne(t,r)}function k(){let r={};t.fields.forEach(l=>{r[l.k]=g(l)}),t.toggle&&(r[t.toggle.k]=a);let o=t.solve(r);P(o)}e.querySelector("#zmt-calc").addEventListener("click",k),e.querySelector("#zmt-clear").addEventListener("click",()=>{t.fields.forEach(r=>{let o=s[r.k];o&&(o.value=!r.unit&&r.def!=null?x(r.def):"",o.classList.remove("zmt-computed"))}),t.toggle&&(a=t.toggle.def,e.querySelectorAll(".zmt-seg button").forEach(r=>r.setAttribute("aria-pressed",String(r.dataset.v===a)))),y.innerHTML="",p.textContent="",v.hidden=!0}),e.querySelector("#zmt-print").addEventListener("click",()=>{try{window.print()}catch{}}),t.fields.forEach(r=>{let o=s[r.k];o&&(o.addEventListener("keydown",l=>{l.key==="Enter"&&k()}),o.addEventListener("input",()=>o.classList.remove("zmt-computed")))})}function ne(e,t){let i=[],n=B[e.id],a=n?n(t.values):null;a&&(a.badge&&i.push("Verdict: "+a.badge),i.push(a.caption.charAt(0).toUpperCase()+a.caption.slice(1)+": "+a.numeral));let d=U[e.id]||[];return i.push(...d.map(s=>s.label+": "+(s.f?s.f(t.values[s.k]):t.values[s.k])).filter(Boolean)),e.title+" -- "+i.join("; ")}function K(e,t){let i=e.querySelector("#zmt-capture-open"),n=e.querySelector("#zmt-lead-modal");if(!i||!n)return;function a(){n.classList.add("zmt-show"),e.querySelector("#zmt-lead-form").style.display="block",e.querySelector("#zmt-lead-ok").style.display="none"}function d(){n.classList.remove("zmt-show")}i.addEventListener("click",a),e.querySelector("#zmt-lead-close").addEventListener("click",d),n.addEventListener("click",s=>{s.target===n&&d()}),e.querySelector("#zmt-lead-submit").addEventListener("click",()=>{let s=e.querySelector("#zmt-ld-name").value.trim(),c=e.querySelector("#zmt-ld-email").value.trim(),b=e.querySelector("#zmt-ld-util").value.trim();if(!c||!/.+@.+\..+/.test(c)){e.querySelector("#zmt-ld-email").focus();return}let g=e.dataset.zmtResultSummary||t.title+" result",h=p=>{e.querySelector("#zmt-lead-form").style.display="none";let y=e.querySelector("#zmt-lead-ok");y.style.display="block",p&&(e.querySelector("#zmt-lead-ok-msg").textContent=p)};if(T.hubspotPortalId&&T.hubspotFormId)fetch("https://api.hsforms.com/submissions/v3/integration/submit/"+T.hubspotPortalId+"/"+T.hubspotFormId,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:[{name:"email",value:c},{name:"firstname",value:s},{name:"company",value:b},{name:"message",value:g}]})}).then(()=>h()).catch(()=>h("Saved. We'll be in touch shortly."));else{let p=encodeURIComponent("Please send this "+t.title+` result.

`+g+`

Name: `+s+`
Utility: `+b+`
Email: `+c);try{window.location.href="mailto:"+T.fallbackEmail+"?subject="+encodeURIComponent(t.title+" result")+"&body="+p}catch{}h("Opening your email app to finish the request.")}})}function Q(){let e=document.getElementById("ziptility-manager-tools");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zip-manager-styles")){let a=document.createElement("style");a.id="zip-manager-styles",a.textContent=I,document.head.appendChild(a)}if(!document.getElementById("zip-manager-fonts")){let a=document.createElement("link");a.rel="preconnect",a.href="https://fonts.googleapis.com";let d=document.createElement("link");d.rel="preconnect",d.href="https://fonts.gstatic.com",d.crossOrigin="anonymous";let s=document.createElement("link");s.id="zip-manager-fonts",s.rel="stylesheet",s.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(a,d,s)}let t=!1,i=null;try{let a=new URLSearchParams(window.location.search);t=a.get("embed")==="app",i=a.get("tool")}catch{}if(t||(t=e.dataset.embed==="app"),i||(i=e.dataset.tool||null),t&&e.classList.add("zmt-embed-app"),e.innerHTML="",!i){e.innerHTML='<div class="zmt-error">This page is missing its tool id. Set <code>data-tool</code> on the mount div (or add <code>?tool=</code> to the URL) to one of: '+D.map(a=>a.id).join(", ")+".</div>";return}let n=D.find(a=>a.id===i);if(!n){e.innerHTML='<div class="zmt-error">"'+i+'" is not one of the manager tools. Available: '+D.map(a=>a.id).join(", ")+".</div>";return}$(e,n),K(e,n)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Q):Q();})();
