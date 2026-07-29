/* Ziptility Manager Tools manager-v1.1.0 (0b5ad900053a23e23d95d5024a99081c1ec1b154) https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var D=`/* Ziptility Manager Toolbox - styles for the three manager-facing tools.
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
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: var(--brand-font-body); color: var(--ink); background: var(--bg); -webkit-font-smoothing: antialiased; line-height: 1.45; }

.zmt-head { max-width: 760px; margin: 0 auto; padding: 20px 16px 6px; }
.zmt-eyebrow { font-family: var(--brand-font-mono); font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 6px; }
.zmt-head h1 { font-family: var(--brand-font-display); font-weight: 900; font-size: 24px; letter-spacing: -.02em; margin: 0 0 6px; }
.zmt-tagline { margin: 0; font-size: 14px; color: var(--muted); line-height: 1.55; max-width: 62ch; }

main { max-width: 760px; margin: 0 auto; padding: 10px 16px 20px; }
.zmt-card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; box-shadow: var(--shadow); padding: 20px 20px 18px; }
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
.zmt-btn-calc { background: var(--accent); color: #fff; flex: 1 1 140px; box-shadow: 0 3px 10px rgba(255, 68, 47, .25); }
.zmt-btn-calc:hover { background: var(--accent-dark); }
.zmt-btn-clear, .zmt-btn-print { background: #fff; color: var(--muted); border-color: var(--line); }
.zmt-btn-clear:hover, .zmt-btn-print:hover { border-color: var(--muted); color: var(--ink); }

.zmt-msg { font-size: 12.5px; margin-top: 10px; color: var(--accent-dark); font-weight: 600; }

/* THE HERO NUMBER (audit C2): one number per tool, promoted to a large
   Geist numeral, with a verdict/status badge above it. Sits ahead of the
   plain-English insight sentence and the secondary stat tiles (C3). */
.zmt-hero { margin-top: 12px; }
.zmt-hero .zmt-badge { margin-bottom: 10px; }
.zmt-hero-num { font-family: var(--brand-font-mono); font-weight: 700; font-size: 36px; line-height: 1.1; letter-spacing: -.01em; color: var(--ink); }
.zmt-hero-label { font-size: 13px; font-weight: 600; color: var(--muted-strong); margin-top: 2px; }

.zmt-badge { display: inline-block; padding: 6px 14px; border-radius: 999px; font-family: var(--brand-font-display); font-weight: 700; font-size: 12px; letter-spacing: .02em; text-transform: uppercase; border: 1px solid; }
.zmt-badge-alert { color: var(--danger-fg); background: var(--danger-bg); border-color: var(--danger-border); }
.zmt-badge-good { color: var(--success-fg); background: var(--success-bg); border-color: var(--success-border); }
.zmt-badge-watch { color: var(--warning-fg); background: var(--warning-bg); border-color: var(--warning-border); }

/* Secondary stats: supporting detail once the hero carries the headline
   number (C2). Audit A7: fewer tiles (2-4, down from 4-5) so the 500px
   grid wraps evenly instead of leaving an orphan on its own row. */
.zmt-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 14px; }
.zmt-stat { background: var(--line-soft); border-radius: 10px; padding: 10px 12px; }
/* Audit A1: label was --muted (3.85:1 / 3.99:1 on these tiles, under the
   4.5:1 floor); --muted-strong measures 6.39:1+ on every tile background
   this bundle uses (see the QAQC report for the full pair list). */
.zmt-stat-label { display: block; font-size: 11px; color: var(--muted-strong); font-weight: 600; margin-bottom: 3px; }
.zmt-stat-val { display: block; font-family: var(--brand-font-mono); font-weight: 700; font-size: 17px; color: var(--ink); }

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
.zmt-colophon a { color: var(--brand-red); text-decoration: none; }
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
.zmt-modal-submit { width: 100%; background: var(--brand-red); color: #fff; border: none; border-radius: 10px; padding: 12px; font-family: var(--brand-font-display); font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 4px; }
.zmt-modal-submit:hover { background: var(--brand-red-dark); }
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
`;var x={length:{in:{label:"in",f:.08333333333333333},ft:{label:"ft",f:1},yd:{label:"yd",f:3},mi:{label:"mi",f:5280},mm:{label:"mm",f:.0032808399},cm:{label:"cm",f:.032808399},m:{label:"m",f:3.2808399},km:{label:"km",f:3280.8399}},area:{sqin:{label:"in\xB2",f:.006944444444444444},sqft:{label:"ft\xB2",f:1},sqyd:{label:"yd\xB2",f:9},ac:{label:"acre",f:43560},sqm:{label:"m\xB2",f:10.7639104},ha:{label:"hectare",f:107639.104}},volume:{gal:{label:"gal",f:1},cf:{label:"cu ft",f:7.480519},L:{label:"L",f:.26417205},m3:{label:"m\xB3",f:264.17205},MG:{label:"MG",f:1e6},acft:{label:"ac-ft",f:325851},lbH2O:{label:"lb H\u2082O",f:.1198266}},mass:{lb:{label:"lb",f:1},kg:{label:"kg",f:2.2046226},g:{label:"g",f:.0022046226},ton:{label:"ton",f:2e3},galH2O:{label:"gal H\u2082O",f:8.3454}},flow:{gpm:{label:"gpm",f:1},mgd:{label:"MGD",f:694.44444},gpd:{label:"gpd",f:.0006944444444444445},cfs:{label:"cfs",f:448.8312},Lps:{label:"L/s",f:15.850323},mlmin:{label:"mL/min",f:.0002641721070710684}},power:{hp:{label:"hp",f:1},kW:{label:"kW",f:1.34102209},W:{label:"W",f:.00134102209},btuh:{label:"BTU/hr",f:.000393014779}}};function H(e,t,o,n){return e*x[n][t].f/x[n][o].f}function P(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}var I=[{id:"repair-or-replace",cat:"Asset Management",domains:["water","wastewater"],title:"Repair or Replace?",formula:"Annual repair cost vs. annualized replacement cost",note:"One water main segment: breaks per mile per year, the outlier flag, and the break-even point where replacing beats patching. One screenshot, one number, one next step.",fields:[{k:"segLen",label:"Segment length",unit:"length",units:["ft","mi"],def:"mi",section:"Outlier screen (optional)"},{k:"years",label:"Years of break history",section:"Outlier screen (optional)"},{k:"breaks",label:"Breaks in that window (count)",section:"Outlier screen (optional)"},{k:"cohortAvg",label:"Cohort avg breaks/mi/yr",def:.25,section:"Outlier screen (optional)"},{k:"breaksYr",label:"Expected breaks/yr (auto-fills from above, overridable)",section:"Break-even"},{k:"costRepair",label:"Average cost per repair ($, fully-loaded: crew OT, materials, restoration, water loss)",def:5e3,section:"Break-even"},{k:"costReplace",label:"Total replacement cost ($)",section:"Break-even"},{k:"lifeYrs",label:"Useful life (years)",def:50,section:"Break-even"},{k:"discountRate",label:"Discount rate % (advanced)",def:0,section:"Break-even",advanced:!0}],toggle:{k:"criticality",def:"Normal",label:"Criticality",options:[{v:"Normal",label:"Normal"},{v:"High",label:"High"},{v:"Critical",label:"Critical"}]},solve:e=>{let t=P(e.years),o=P(e.breaks),n=P(e.breaksYr);if(n==null&&t!=null&&t>0&&o!=null&&(n=o/t),n==null)return{values:{},computed:[],error:"Enter expected breaks/yr, or breaks and years of history."};let a=P(e.costRepair)??5e3,d=P(e.costReplace);if(d==null||d<=0)return{values:{},computed:[],error:"Enter the total replacement cost."};let l=P(e.lifeYrs)??50;if(l<=0)return{values:{},computed:[],error:"Useful life must be greater than zero."};let c=P(e.discountRate)??0,b=P(e.cohortAvg)??.25,g=e.criticality||"Normal",h=n*a,u;if(c>0){let i=c/100,s=Math.pow(1+i,l);u=s-1!==0?d*(i*s)/(s-1):d/l}else u=d/l;let y=a>0?u/a:null,v=null,A=null;if(t!=null&&t>0&&o!=null&&e.segLen!=null){let i=H(e.segLen,"ft","mi","length");i>0&&(v=o/t/i,A=v>=2*b)}let S=g==="High"||g==="Critical",r;return S||h>1.1*u?r="REPLACE":h<.9*u?r="KEEP REPAIRING":r="ON THE LINE",{values:{breaksYr:n,annualRepair:h,annualizedReplace:u,breakEvenN:y,breaksPerMileYr:v,flagOutlier:A,verdict:r,criticalityOverride:S,criticality:g,costRepair:a,costReplace:d,lifeYrs:l,discountRate:c,cohortAvg:b},computed:["breaksYr","annualRepair","annualizedReplace","breakEvenN","verdict"],error:""}},interpret:e=>{if(e.verdict==null)return null;let t=e.verdict==="REPLACE"?"alert":e.verdict==="KEEP REPAIRING"?"good":"watch",o=Math.round(e.breakEvenN*100)/100,n=Math.round(e.breaksYr*100)/100,a=e.verdict+". Replacement pays for itself once this main breaks more than "+o+" times/yr; you are at "+n+".";if(e.breakEvenN>0&&isFinite(e.breaksYr/e.breakEvenN)){let d=Math.round(e.breaksYr/e.breakEvenN*10)/10,l=d>1?"over":d<1?"under":"right at";a+=" You are running about "+d+" times the break-even rate, "+l+" the line."}return e.criticalityOverride&&(a+=" Criticality is set to "+e.criticality+", so this recommends REPLACE regardless of the break-even math."),e.flagOutlier===!0&&(a+=" Outlier flag: this segment runs about "+Math.round(e.breaksPerMileYr*100)/100+" breaks/mile/yr, at least 2x the cohort average of "+e.cohortAvg+"."),a+=" This treats a repair and a replacement as buying the same service; it ignores the consequence cost of a failure unless you raise criticality.",e.verdict==="REPLACE"?a+=" Add this segment to your capital plan, or ask your engineer for a replacement estimate.":e.verdict==="ON THE LINE"?a+=" Keep monitoring. Re-run this after the next break.":a+=" No action needed yet. Re-run this after the next break.",{level:t,text:a}},links:[{label:"EPA Asset Management: A Handbook for Small Water Systems (PDF)",href:"https://www.epa.gov/system/files/documents/2022-06/FINAL%20AM%20Handbook%20for%20Small%20Water%20Systems%20STEP%20Guide_508.pdf"},{label:"See how utilities tie this number to their asset records",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["break even","main break","watchlist","2x rule","outlier","capital planning","replacement reserve","CIP"]}];function C(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}var q=[{id:"cost-of-turnover",cat:"Workforce",domains:["water","wastewater"],title:"Cost of Turnover",formula:"Operators lost/yr x (recruiting + OT backfill + ramp cost)",note:"What losing an operator actually costs, and the raise it would take to break even on keeping one instead.",fields:[{k:"operatorsLost",label:"Operators lost per year"},{k:"salary",label:"Fully-loaded salary per operator ($/yr)"},{k:"recruitCost",label:"Recruiting + training cost per hire ($)"},{k:"otWeeklyRate",label:"On-call/OT backfill cost per week vacant ($)",def:400},{k:"vacancyWeeks",label:"Weeks the position sits vacant"},{k:"rampMonths",label:"Months to full proficiency (new-hire ramp)",def:12},{k:"rampLossPct",label:"Productivity loss during ramp (% of salary, averaged over the ramp)",def:50}],solve:e=>{let t=C(e.operatorsLost),o=C(e.salary),n=C(e.recruitCost),a=C(e.vacancyWeeks);if(t==null||t<=0)return{values:{},computed:[],error:"Enter how many operators you lose in a typical year."};if(o==null||o<=0)return{values:{},computed:[],error:"Enter the fully-loaded salary per operator."};if(n==null||n<0)return{values:{},computed:[],error:"Enter the recruiting + training cost per hire (0 if none)."};if(a==null||a<0)return{values:{},computed:[],error:"Enter how many weeks the position typically sits vacant."};let d=C(e.otWeeklyRate)??400,l=C(e.rampMonths)??12,c=C(e.rampLossPct)??50,b=d*a,g=o*(l/12)*(c/100),h=n+b+g,u=t*h;return{values:{otBackfillCost:b,rampCost:g,costPerDeparture:h,annualCost:u,breakEvenRaise:h,operatorsLost:t,salary:o,recruitCost:n,vacancyWeeks:a,otWeeklyRate:d,rampMonths:l,rampLossPct:c},computed:["otBackfillCost","rampCost","costPerDeparture","annualCost","breakEvenRaise"],error:""}},interpret:e=>{if(e.annualCost==null)return null;let t=Math.round(e.annualCost),o=Math.round(e.breakEvenRaise),n="Losing "+e.operatorsLost+" operator"+(e.operatorsLost===1?"":"s")+"/yr costs about $"+t.toLocaleString("en-US")+"/yr (recruiting + OT backfill + ramp-up productivity loss). A retention raise would have to beat $"+o.toLocaleString("en-US")+" per operator per year to lose money; anything under that line is cheaper than the churn it prevents.";if(e.salary>0){let a=Math.round(e.costPerDeparture/e.salary*100);n+=" That is about "+a+"% of one operator's fully-loaded salary, per departure."}return n+=" Next: take this number to your next budget or staffing conversation and weigh it against what a raise or bonus would actually cost.",{level:"info",text:n}},links:[{label:"Field guide: staffing and turnover, it is a budget decision",href:"https://www.ziptility.com/guides/staffing-and-turnover-its-a-budget-decision"},{label:"See how utilities track this in Ziptility",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["retention","staffing","silver tsunami","overtime","on-call","recruiting cost","vacancy"]}];function E(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}function O(e,t){return e==null||t==null||t===0?null:(e-t)/t*100}var j=[{id:"energy-cost",cat:"Energy",domains:["water","wastewater"],title:"Energy $ per 1,000 Gallons",formula:"kWh / (gallons / 1,000); x $/kWh = $ per 1,000 gal",note:"Energy as a number you manage: cost per 1,000 gallons pumped, plus the three preventive-maintenance triggers if you have a prior period to compare against.",fields:[{k:"kwh",label:"kWh this period"},{k:"gallons",label:"Gallons pumped this period"},{k:"rate",label:"$ / kWh",def:.1},{k:"kwhPrior",label:"kWh, prior period (optional)"},{k:"gallonsPrior",label:"Gallons pumped, prior period (optional)"},{k:"startsPerDay",label:"Pump starts/day, this period (optional)"},{k:"startsPerDayPrior",label:"Pump starts/day, prior period (optional)"},{k:"specificCapacity",label:"Specific capacity, this period, gpm/ft drawdown (optional, wells)"},{k:"specificCapacityPrior",label:"Specific capacity, prior period (optional)"}],solve:e=>{let t=E(e.kwh),o=E(e.gallons);if(t==null)return{values:{},computed:[],error:"Enter kWh for this period."};if(o==null||o<=0)return{values:{},computed:[],error:"Enter gallons pumped this period."};let n=E(e.rate)??.1,a=t/(o/1e3),d=a*n,l=E(e.kwhPrior),c=E(e.gallonsPrior),b=null,g=null,h=null;l!=null&&c!=null&&c>0&&(b=l/(c/1e3),g=O(a,b),h=g!=null&&g>=15);let u=E(e.startsPerDay),y=E(e.startsPerDayPrior),v=null,A=null;u!=null&&y!=null&&y>0&&(v=O(u,y),A=v!=null&&v>=25);let S=E(e.specificCapacity),r=E(e.specificCapacityPrior),i=null,s=null;S!=null&&r!=null&&r>0&&(i=O(S,r),s=i!=null&&i<=-20);let p=[];return h&&p.push("kWh/1,000 gal up "+Math.round(g*10)/10+"% vs prior period (>= 15% trigger)"),A&&p.push("pump starts/day up "+Math.round(v*10)/10+"% vs prior period (>= 25% trigger)"),s&&p.push("specific capacity down "+Math.round(Math.abs(i)*10)/10+"% vs prior period (>= 20% drop trigger)"),{values:{kwhPerKgal:a,costPerKgal:d,kwhPerKgalPrior:b,energyPctChange:g,flagEnergyUp:h,startsPctChange:v,flagStartsUp:A,scPctChange:i,flagCapacityDown:s,pmTriggered:p,rate:n},computed:["kwhPerKgal","costPerKgal"],error:""}},interpret:e=>{if(e.kwhPerKgal==null)return null;let t=Math.round(e.kwhPerKgal*100)/100,o=Math.round(e.costPerKgal*100)/100,n="This period: "+t+" kWh per 1,000 gal, $"+o+" per 1,000 gal.";if(e.pmTriggered&&e.pmTriggered.length)return n+=" PM trigger"+(e.pmTriggered.length===1?"":"s")+" tripped: "+e.pmTriggered.join("; ")+". Schedule a pump/well check.",{level:"watch",text:n};if(e.kwhPerKgalPrior!=null){let a=Math.round(e.energyPctChange*10)/10,d=a>0?"higher":a<0?"lower":"the same as";n+=" That is about "+Math.abs(a)+"% "+d+" the prior period. No PM trigger tripped.",n+=" Keep tracking each period so a real change stands out early."}else n+=" No prior period to compare yet. Enter this period again next time you run the numbers, and you will see the trend and catch a change early.";return{level:"good",text:n}},links:[{label:"Field guide: energy as a number you manage",href:"https://www.ziptility.com/guides/energy-as-a-number-you-manage"},{label:"See how utilities track this in Ziptility",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["kwh per 1000 gallons","specific energy","pump starts","specific capacity","preventive maintenance","energy audit"]}];var N=[...I,...q,...j];function f(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function W(e){return`
<header class="zmt-head">
  <div class="zmt-head-wrap">
    <p class="zmt-eyebrow">Manager toolbox</p>
    <h1>${f(e.title)}</h1>
    <p class="zmt-tagline">${f(e.note)}</p>
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
`}var L={hubspotPortalId:"4938013",hubspotFormId:"",fallbackEmail:"sales@ziptility.com"},F="zip-manager-energy-history";function k(e){if(e==null||!isFinite(e))return"";let t=Math.round(e*1e6)/1e6;return Math.abs(t)>=1e3?t.toLocaleString("en-US",{maximumFractionDigits:2}):String(parseFloat(t.toFixed(4)))}function R(e){if(e==null||!isFinite(e))return"";let t=e<0?"-":"",o=Math.abs(e),n=o<100?2:0;return t+"$"+o.toLocaleString("en-US",{minimumFractionDigits:n,maximumFractionDigits:n})}function Q(e){try{let t=window.localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}}function Z(e,t){try{window.localStorage.setItem(e,JSON.stringify(t))}catch{}}var Y={"repair-or-replace":[{k:"breaksYr",label:"Your breaks/yr",f:k},{k:"breakEvenN",label:"Break-even breaks/yr",f:k},{k:"annualRepair",label:"Annual repair cost",f:R},{k:"annualizedReplace",label:"Annualized replacement cost",f:R}],"cost-of-turnover":[{k:"breakEvenRaise",label:"Retention-raise break-even ($/operator/yr)",f:R},{k:"costPerDeparture",label:"Cost per departure",f:R}],"energy-cost":[{k:"kwhPerKgal",label:"kWh / 1,000 gal",f:k}]},G={"repair-or-replace":e=>{let t="--",o="break-even ratio unavailable";if(e.breakEvenN>0){let n=e.breaksYr/e.breakEvenN;if(isFinite(n)){let a=Math.round(n*10)/10,d=a>1?"over":a<1?"under":"at";t=k(a)+"x",o=d+" the break-even line"}}return{numeral:t,caption:o,badge:e.verdict,badgeClass:e.verdict==="REPLACE"?"alert":e.verdict==="KEEP REPAIRING"?"good":"watch"}},"cost-of-turnover":e=>({numeral:R(e.annualCost),caption:"the annual cost of churn",badge:null,badgeClass:null}),"energy-cost":e=>{let t=e.pmTriggered&&e.pmTriggered.length>0;return{numeral:R(e.costPerKgal),caption:"per 1,000 gallons",badge:t?"PM check advised":"On track",badgeClass:t?"watch":"good"}}};function J(e){let t=[],o=null;return e.fields.forEach(n=>{let a=n.section||"";(!o||o.section!==a)&&(o={section:a,fields:[]},t.push(o)),o.fields.push(n)}),t}function V(e,t){let n=(t.units||Object.keys(x[t.unit])).map(a=>'<option value="'+a+'"'+(a===t.def?" selected":"")+">"+x[t.unit][a].label+"</option>").join("");return'<select id="'+e+'__u" data-cur="'+t.def+'" aria-label="unit">'+n+"</select>"}function U(e,t){let o="zmt-"+e.id+"-"+t.k,n=!t.unit&&t.def!=null,a=n?' value="'+f(k(t.def))+'"':"",d='<input id="'+o+'" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="-"'+a+">",l=t.unit?'<div class="zmt-uf">'+d+V(o,t)+"</div>":d,c=n?'<div class="zmt-rot">Rule of thumb, use your own number.</div>':"";return'<div class="zmt-field" data-k="'+t.k+'"><label for="'+o+'">'+f(t.label)+"</label>"+l+c+"</div>"}function X(e){if(!e.toggle)return"";let t=e.toggle,o=t.label||t.k.charAt(0).toUpperCase()+t.k.slice(1),n="zmt-toggle-label-"+e.id+"-"+t.k;return'<div class="zmt-toggle-field"><span class="zmt-toggle-caption" id="'+n+'">'+f(o)+'</span><div class="zmt-seg" role="group" aria-labelledby="'+n+'">'+t.options.map(a=>'<button type="button" data-v="'+f(a.v)+'" aria-pressed="'+(a.v===t.def)+'">'+f(a.label)+"</button>").join("")+"</div></div>"}function B(e,t){e.innerHTML=W(t);let o=e.querySelector("#zmt-stage"),n=J(t),a=t.toggle?t.toggle.def:null,d=n.map(r=>{let i=r.fields.filter(z=>!z.advanced),s=r.fields.filter(z=>z.advanced),p=(r.section?'<h2 class="zmt-section">'+f(r.section)+"</h2>":"")+'<div class="zmt-fields">'+i.map(z=>U(t,z)).join("")+"</div>";return s.length&&(p+='<details class="zmt-advanced"><summary>Advanced</summary><div class="zmt-fields">'+s.map(z=>U(t,z)).join("")+"</div></details>"),p}).join("");if(o.innerHTML='<div class="zmt-card"><div class="zmt-card-head"><div class="zmt-formula">'+f(t.formula)+"</div>"+X(t)+"</div>"+d+'<div class="zmt-actions"><button class="zmt-btn zmt-btn-calc" id="zmt-calc" type="button">Calculate</button><button class="zmt-btn zmt-btn-clear" id="zmt-clear" type="button">Clear</button><button class="zmt-btn zmt-btn-print" id="zmt-print" type="button">Print / PDF</button></div><div class="zmt-msg" id="zmt-msg" aria-live="polite"></div><div class="zmt-result" id="zmt-result" aria-live="polite"></div><div class="zmt-links" id="zmt-links"></div><button class="zmt-capture-open" id="zmt-capture-open" type="button" hidden>Email or print this result</button></div>',t.links&&t.links.length){let r=e.querySelector("#zmt-links");r.innerHTML="Learn more: "+t.links.map(i=>'<a href="'+i.href+'" target="_blank" rel="noopener">'+f(i.label)+"</a>").join(" &middot; ")}let l={};t.fields.forEach(r=>{l[r.k]=e.querySelector("#zmt-"+t.id+"-"+r.k)});function c(r){if(!r)return null;let i=r.value.replace(/,/g,"").trim();if(i==="")return null;let s=parseFloat(i);return isFinite(s)?s:null}function b(r){return e.querySelector("#"+r.id+"__u")}function g(r){let i=l[r.k],s=c(i);if(s==null)return null;if(r.unit){let p=b(i);return s*x[r.unit][p.value].f}return s}function h(r,i){let s=l[r.k];if(s)if(r.unit){let p=b(s);s.value=k(i/x[r.unit][p.value].f)}else s.value=k(i)}if(t.fields.forEach(r=>{if(!r.unit)return;let i=l[r.k],s=b(i);s.addEventListener("change",()=>{let p=s.dataset.cur,z=s.value,M=c(i);M!=null&&(i.value=k(M*x[r.unit][p].f/x[r.unit][z].f)),s.dataset.cur=z})}),t.toggle&&e.querySelectorAll(".zmt-seg button").forEach(r=>r.addEventListener("click",()=>{r.dataset.v!==a&&(a=r.dataset.v,e.querySelectorAll(".zmt-seg button").forEach(i=>i.setAttribute("aria-pressed",String(i.dataset.v===a))))})),t.id==="energy-cost"){let r=Q(F);if(r){let i={kwhPrior:"kwh",gallonsPrior:"gallons",startsPerDayPrior:"startsPerDay",specificCapacityPrior:"specificCapacity"};Object.keys(i).forEach(s=>{let p=l[s];p&&!p.value&&r[i[s]]!=null&&(p.value=k(r[i[s]]))})}}let u=e.querySelector("#zmt-msg"),y=e.querySelector("#zmt-result"),v=e.querySelector("#zmt-capture-open");function A(r){if(y.innerHTML="",u.textContent="",u.className="zmt-msg",r.error){u.textContent=r.error;return}t.fields.forEach(m=>{if(m.k in r.values){let w=r.values[m.k];typeof w=="number"&&isFinite(w)&&r.computed.includes(m.k)&&(h(m,w),l[m.k]&&l[m.k].classList.add("zmt-computed"))}});let i=G[t.id],s=i?i(r.values):null,p="";if(s){let m=s.badge?'<div class="zmt-badge zmt-badge-'+s.badgeClass+'">'+f(s.badge)+"</div>":"";p+='<div class="zmt-hero">'+m+'<div class="zmt-hero-num">'+f(s.numeral)+'</div><div class="zmt-hero-label">'+f(s.caption)+"</div></div>"}if(t.interpret){let m=t.interpret(r.values);m&&(p+='<div class="zmt-insight zmt-show zmt-'+m.level+'"><span class="zmt-lead">Note</span>'+f(m.text)+"</div>")}let M=(Y[t.id]||[]).map(m=>{let w=r.values[m.k];if(w==null)return"";let T=f(m.f?m.f(w):String(w));return'<div class="zmt-stat"><span class="zmt-stat-label">'+f(m.label)+'</span><span class="zmt-stat-val">'+T+"</span></div>"}).join("");if(p+='<div class="zmt-stats">'+M+"</div>",r.values.flagOutlier===!0&&(p+='<div class="zmt-chip zmt-chip-watch zmt-flag">Outlier: '+k(r.values.breaksPerMileYr)+" breaks/mi/yr (>= 2x cohort avg of "+k(r.values.cohortAvg)+")</div>"),r.values.pmTriggered&&r.values.pmTriggered.length&&r.values.pmTriggered.forEach(m=>{p+='<div class="zmt-chip zmt-chip-watch zmt-flag">'+f(m)+"</div>"}),y.innerHTML=p,t.id==="energy-cost"){let m={};["kwh","gallons","startsPerDay","specificCapacity"].forEach(T=>{r.values[T]!=null&&(m[T]=r.values[T])});let w={kwh:c(l.kwh),gallons:c(l.gallons),startsPerDay:c(l.startsPerDay),specificCapacity:c(l.specificCapacity)};Z(F,w)}v.hidden=!1,e.dataset.zmtResultSummary=ee(t,r)}function S(){let r={};t.fields.forEach(s=>{r[s.k]=g(s)}),t.toggle&&(r[t.toggle.k]=a);let i=t.solve(r);A(i)}e.querySelector("#zmt-calc").addEventListener("click",S),e.querySelector("#zmt-clear").addEventListener("click",()=>{t.fields.forEach(r=>{let i=l[r.k];i&&(i.value=!r.unit&&r.def!=null?k(r.def):"",i.classList.remove("zmt-computed"))}),t.toggle&&(a=t.toggle.def,e.querySelectorAll(".zmt-seg button").forEach(r=>r.setAttribute("aria-pressed",String(r.dataset.v===a)))),y.innerHTML="",u.textContent="",v.hidden=!0}),e.querySelector("#zmt-print").addEventListener("click",()=>{try{window.print()}catch{}}),t.fields.forEach(r=>{let i=l[r.k];i&&(i.addEventListener("keydown",s=>{s.key==="Enter"&&S()}),i.addEventListener("input",()=>i.classList.remove("zmt-computed")))})}function ee(e,t){let o=[],n=G[e.id],a=n?n(t.values):null;a&&(a.badge&&o.push("Verdict: "+a.badge),o.push(a.caption.charAt(0).toUpperCase()+a.caption.slice(1)+": "+a.numeral));let d=Y[e.id]||[];return o.push(...d.map(l=>l.label+": "+(l.f?l.f(t.values[l.k]):t.values[l.k])).filter(Boolean)),e.title+" -- "+o.join("; ")}function $(e,t){let o=e.querySelector("#zmt-capture-open"),n=e.querySelector("#zmt-lead-modal");if(!o||!n)return;function a(){n.classList.add("zmt-show"),e.querySelector("#zmt-lead-form").style.display="block",e.querySelector("#zmt-lead-ok").style.display="none"}function d(){n.classList.remove("zmt-show")}o.addEventListener("click",a),e.querySelector("#zmt-lead-close").addEventListener("click",d),n.addEventListener("click",l=>{l.target===n&&d()}),e.querySelector("#zmt-lead-submit").addEventListener("click",()=>{let l=e.querySelector("#zmt-ld-name").value.trim(),c=e.querySelector("#zmt-ld-email").value.trim(),b=e.querySelector("#zmt-ld-util").value.trim();if(!c||!/.+@.+\..+/.test(c)){e.querySelector("#zmt-ld-email").focus();return}let g=e.dataset.zmtResultSummary||t.title+" result",h=u=>{e.querySelector("#zmt-lead-form").style.display="none";let y=e.querySelector("#zmt-lead-ok");y.style.display="block",u&&(e.querySelector("#zmt-lead-ok-msg").textContent=u)};if(L.hubspotPortalId&&L.hubspotFormId)fetch("https://api.hsforms.com/submissions/v3/integration/submit/"+L.hubspotPortalId+"/"+L.hubspotFormId,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:[{name:"email",value:c},{name:"firstname",value:l},{name:"company",value:b},{name:"message",value:g}]})}).then(()=>h()).catch(()=>h("Saved. We'll be in touch shortly."));else{let u=encodeURIComponent("Please send this "+t.title+` result.

`+g+`

Name: `+l+`
Utility: `+b+`
Email: `+c);try{window.location.href="mailto:"+L.fallbackEmail+"?subject="+encodeURIComponent(t.title+" result")+"&body="+u}catch{}h("Opening your email app to finish the request.")}})}function K(){let e=document.getElementById("ziptility-manager-tools");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zip-manager-styles")){let a=document.createElement("style");a.id="zip-manager-styles",a.textContent=D,document.head.appendChild(a)}if(!document.getElementById("zip-manager-fonts")){let a=document.createElement("link");a.rel="preconnect",a.href="https://fonts.googleapis.com";let d=document.createElement("link");d.rel="preconnect",d.href="https://fonts.gstatic.com",d.crossOrigin="anonymous";let l=document.createElement("link");l.id="zip-manager-fonts",l.rel="stylesheet",l.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(a,d,l)}let t=!1,o=null;try{let a=new URLSearchParams(window.location.search);t=a.get("embed")==="app",o=a.get("tool")}catch{}if(t||(t=e.dataset.embed==="app"),o||(o=e.dataset.tool||null),t&&e.classList.add("zmt-embed-app"),e.innerHTML="",!o){e.innerHTML='<div class="zmt-error">This page is missing its tool id. Set <code>data-tool</code> on the mount div (or add <code>?tool=</code> to the URL) to one of: '+N.map(a=>a.id).join(", ")+".</div>";return}let n=N.find(a=>a.id===o);if(!n){e.innerHTML='<div class="zmt-error">"'+o+'" is not one of the manager tools. Available: '+N.map(a=>a.id).join(", ")+".</div>";return}B(e,n),$(e,n)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",K):K();})();
