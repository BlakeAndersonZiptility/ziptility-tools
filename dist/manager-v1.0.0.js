/* Ziptility Manager Tools manager-v1.0.0 (4d76838afd04250f887de72682e0a2766366420e) https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var T=`/* Ziptility Manager Toolbox - styles for the three manager-facing tools.
   Token block copied verbatim from src/ui/styles.css's DS 4.0 reskin
   section (per the build brief: "copy the token block ... rather than
   inventing values") rather than duplicated-and-drifted. Everything below
   the tokens is new markup (.zmt-* classes) built for the single-tool card
   layout these pages use, not the operator calculator's category grid. */

:root {
  --brand-navy: #0c1f30;         /* Ziptility midnight-blue (design lock) */
  --brand-red: #ff442f;          /* Ziptility tomato (design lock) - single accent */
  --brand-red-dark: #c5341f;
  --brand-font-display: 'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --brand-font-body: 'Archivo', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --brand-font-mono: 'Geist', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --bg: #fbf8f5;                 /* warm linen page */
  --card: #ffffff;
  --ink: #0c1f30;
  --muted: #6b7785;
  --line: #e5ded4;
  --line-soft: #f1ebe2;
  --accent: var(--brand-red);
  --accent-dark: var(--brand-red-dark);
  --good: #1E9E6A;
  --shadow: 0 1px 2px rgba(12, 31, 48, .05), 0 10px 28px rgba(12, 31, 48, .07);
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
.zmt-card-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
.zmt-formula { font-family: var(--brand-font-mono); font-size: 12.5px; color: var(--ink); background: #f6eee6; border: 1px solid #ece1d3; border-radius: 6px; padding: 5px 8px; }

.zmt-section { font-family: var(--brand-font-display); font-weight: 700; font-size: 12px; letter-spacing: .04em; text-transform: uppercase; color: var(--muted); margin: 16px 0 8px; }
.zmt-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; }
.zmt-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.zmt-field label { font-size: 12px; font-weight: 600; color: var(--muted); }
.zmt-field input { width: 100%; font-family: var(--brand-font-mono); font-size: 14.5px; color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 9px 10px; }
.zmt-field input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(255, 68, 47, .14); }
.zmt-field input.zmt-computed { background: #fff1ee; border-color: var(--accent); box-shadow: inset 3px 0 0 var(--accent); font-weight: 600; }
.zmt-uf { display: flex; gap: 6px; }
.zmt-uf input { flex: 1; min-width: 0; }
.zmt-uf select { flex: none; font-family: var(--brand-font-mono); font-size: 12px; color: var(--accent-dark); background: #ffe9e5; border: 1px solid var(--line); border-radius: 8px; padding: 0 6px; }
.zmt-rot { font-size: 11px; color: var(--muted); font-style: italic; }

.zmt-advanced { margin-top: 10px; }
.zmt-advanced summary { cursor: pointer; font-family: var(--brand-font-display); font-weight: 600; font-size: 12.5px; color: var(--accent-dark); }
.zmt-advanced .zmt-fields { margin-top: 10px; }

.zmt-seg { display: inline-flex; background: var(--line-soft); border: 1px solid var(--line); border-radius: 999px; padding: 3px; gap: 3px; }
.zmt-seg button { cursor: pointer; font-family: var(--brand-font-display); font-weight: 600; font-size: 12px; color: var(--muted); background: transparent; border: none; border-radius: 999px; padding: 6px 13px; }
.zmt-seg button[aria-pressed="true"] { color: #fff; background: var(--ink); }

.zmt-actions { display: flex; gap: 9px; margin-top: 16px; flex-wrap: wrap; }
.zmt-btn { cursor: pointer; font-family: var(--brand-font-display); font-weight: 600; font-size: 13.5px; border-radius: 9px; padding: 10px 16px; border: 1px solid transparent; }
.zmt-btn-calc { background: var(--accent); color: #fff; flex: 1 1 140px; box-shadow: 0 3px 10px rgba(255, 68, 47, .25); }
.zmt-btn-calc:hover { background: var(--accent-dark); }
.zmt-btn-clear, .zmt-btn-print { background: #fff; color: var(--muted); border-color: var(--line); }
.zmt-btn-clear:hover, .zmt-btn-print:hover { border-color: var(--muted); color: var(--ink); }

.zmt-msg { font-size: 12.5px; margin-top: 10px; color: var(--accent-dark); font-weight: 600; }

.zmt-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 14px; }
.zmt-stat { background: var(--line-soft); border-radius: 8px; padding: 10px 12px; }
.zmt-stat-label { display: block; font-size: 11px; color: var(--muted); font-weight: 600; margin-bottom: 3px; }
.zmt-stat-val { display: block; font-family: var(--brand-font-mono); font-weight: 700; font-size: 17px; color: var(--ink); }
/* Verdicts/flags always carry a text label alongside color - never color
   alone (accessibility rule from the neutral-lane spec). */
.zmt-chip.zmt-stat { border-left: 4px solid; }
.zmt-chip-replace.zmt-stat, .zmt-chip-alert.zmt-stat { border-color: #A12020; background: #FDECEC; }
.zmt-chip-alert .zmt-stat-val { color: #A12020; }
.zmt-chip-good.zmt-stat { border-color: #136A47; background: #E9F7F0; }
.zmt-chip-good .zmt-stat-val { color: #136A47; }
.zmt-chip-watch.zmt-stat { border-color: #8A5A00; background: #FFF6E6; }
.zmt-chip-watch .zmt-stat-val { color: #8A5A00; }

.zmt-flag.zmt-chip { display: inline-block; margin: 8px 8px 0 0; padding: 6px 11px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid; }
.zmt-flag.zmt-chip-watch { color: #8A5A00; background: #FFF6E6; border-color: #F0D08A; }

.zmt-insight { margin-top: 12px; font-size: 13px; border-radius: 8px; padding: 10px 12px; line-height: 1.55; display: none; border: 1px solid; }
.zmt-insight.zmt-show { display: block; }
.zmt-insight .zmt-lead { font-family: var(--brand-font-display); font-weight: 700; margin-right: 4px; }
.zmt-insight.zmt-good { background: #E9F7F0; border-color: #9FD8BE; color: #136A47; }
.zmt-insight.zmt-watch { background: #FFF6E6; border-color: #F0D08A; color: #8A5A00; }
.zmt-insight.zmt-alert { background: #FDECEC; border-color: #F2B5B5; color: #A12020; }
.zmt-insight.zmt-info { background: #EEF3F8; border-color: #CFDBE8; color: #3C5A74; }

.zmt-links { margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--line-soft); font-size: 12px; color: var(--muted); }
.zmt-links a { color: var(--accent); font-weight: 600; text-decoration: none; }
.zmt-links a:hover { text-decoration: underline; }

/* Soft capture: only ever reachable after a result exists (render.js
   un-hides this button). No gate anywhere in front of the answer. */
.zmt-capture-open { margin-top: 14px; cursor: pointer; background: #fff; color: var(--accent-dark); border: 1px solid var(--line); border-radius: 9px; padding: 9px 14px; font-family: var(--brand-font-display); font-weight: 600; font-size: 13px; }
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
.zmt-modal-field input { font-family: var(--brand-font-body); font-size: 14px; border: 1px solid var(--line); border-radius: 9px; padding: 10px 11px; }
.zmt-modal-field input:focus { outline: none; border-color: var(--brand-red); box-shadow: 0 0 0 3px rgba(255, 68, 47, .14); }
.zmt-modal-submit { width: 100%; background: var(--brand-red); color: #fff; border: none; border-radius: 10px; padding: 12px; font-family: var(--brand-font-display); font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 4px; }
.zmt-modal-submit:hover { background: var(--brand-red-dark); }
.zmt-modal-close { position: absolute; top: 14px; right: 14px; background: none; border: none; cursor: pointer; color: var(--muted); font-size: 22px; line-height: 1; }
.zmt-modal-fine { font-size: 11px; color: var(--muted); margin-top: 11px; line-height: 1.4; }
.zmt-modal-ok { display: none; text-align: center; padding: 12px 0; }
.zmt-modal-ok .zmt-check { width: 44px; height: 44px; border-radius: 50%; background: #E9F7F0; color: var(--good); display: grid; place-items: center; margin: 0 auto 12px; font-size: 20px; }

/* Print/PDF: legible, high contrast (>=12pt, per the neutral-lane rule) */
@media print {
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
}

@media (prefers-color-scheme: dark) {
  /* This bundle only ships on Webflow pages with the site's light chrome;
     no dark-mode host exists yet, so no override is defined here on
     purpose (nothing to test against) rather than guessing colors. */
}
`;var z={length:{in:{label:"in",f:.08333333333333333},ft:{label:"ft",f:1},yd:{label:"yd",f:3},mi:{label:"mi",f:5280},mm:{label:"mm",f:.0032808399},cm:{label:"cm",f:.032808399},m:{label:"m",f:3.2808399},km:{label:"km",f:3280.8399}},area:{sqin:{label:"in\xB2",f:.006944444444444444},sqft:{label:"ft\xB2",f:1},sqyd:{label:"yd\xB2",f:9},ac:{label:"acre",f:43560},sqm:{label:"m\xB2",f:10.7639104},ha:{label:"hectare",f:107639.104}},volume:{gal:{label:"gal",f:1},cf:{label:"cu ft",f:7.480519},L:{label:"L",f:.26417205},m3:{label:"m\xB3",f:264.17205},MG:{label:"MG",f:1e6},acft:{label:"ac-ft",f:325851},lbH2O:{label:"lb H\u2082O",f:.1198266}},mass:{lb:{label:"lb",f:1},kg:{label:"kg",f:2.2046226},g:{label:"g",f:.0022046226},ton:{label:"ton",f:2e3},galH2O:{label:"gal H\u2082O",f:8.3454}},flow:{gpm:{label:"gpm",f:1},mgd:{label:"MGD",f:694.44444},gpd:{label:"gpd",f:.0006944444444444445},cfs:{label:"cfs",f:448.8312},Lps:{label:"L/s",f:15.850323},mlmin:{label:"mL/min",f:.0002641721070710684}},power:{hp:{label:"hp",f:1},kW:{label:"kW",f:1.34102209},W:{label:"W",f:.00134102209},btuh:{label:"BTU/hr",f:.000393014779}}};function O(e,t,o,i){return e*z[i][t].f/z[i][o].f}function A(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}var D=[{id:"repair-or-replace",cat:"Asset Management",domains:["water","wastewater"],title:"Repair or Replace?",formula:"Annual repair cost vs. annualized replacement cost",note:"One water main segment: breaks per mile per year, the outlier flag, and the break-even point where replacing beats patching. One screenshot, one number, one next step.",fields:[{k:"segLen",label:"Segment length",unit:"length",units:["ft","mi"],def:"mi",section:"Outlier screen (optional)"},{k:"years",label:"Years of break history",section:"Outlier screen (optional)"},{k:"breaks",label:"Breaks in that window (count)",section:"Outlier screen (optional)"},{k:"cohortAvg",label:"Cohort avg breaks/mi/yr",def:.25,section:"Outlier screen (optional)"},{k:"breaksYr",label:"Expected breaks/yr (auto-fills from above, overridable)",section:"Break-even"},{k:"costRepair",label:"Average cost per repair ($, fully-loaded: crew OT, materials, restoration, water loss)",def:5e3,section:"Break-even"},{k:"costReplace",label:"Total replacement cost ($)",section:"Break-even"},{k:"lifeYrs",label:"Useful life (years)",def:50,section:"Break-even"},{k:"discountRate",label:"Discount rate % (advanced)",def:0,section:"Break-even",advanced:!0}],toggle:{k:"criticality",def:"Normal",options:[{v:"Normal",label:"Normal"},{v:"High",label:"High"},{v:"Critical",label:"Critical"}]},solve:e=>{let t=A(e.years),o=A(e.breaks),i=A(e.breaksYr);if(i==null&&t!=null&&t>0&&o!=null&&(i=o/t),i==null)return{values:{},computed:[],error:"Enter expected breaks/yr, or breaks and years of history."};let r=A(e.costRepair)??5e3,d=A(e.costReplace);if(d==null||d<=0)return{values:{},computed:[],error:"Enter the total replacement cost."};let c=A(e.lifeYrs)??50;if(c<=0)return{values:{},computed:[],error:"Useful life must be greater than zero."};let p=A(e.discountRate)??0,h=A(e.cohortAvg)??.25,f=e.criticality||"Normal",g=i*r,m;if(p>0){let n=p/100,s=Math.pow(1+n,c);m=s-1!==0?d*(n*s)/(s-1):d/c}else m=d/c;let b=r>0?m/r:null,v=null,w=null;if(t!=null&&t>0&&o!=null&&e.segLen!=null){let n=O(e.segLen,"ft","mi","length");n>0&&(v=o/t/n,w=v>=2*h)}let E=f==="High"||f==="Critical",a;return E||g>1.1*m?a="REPLACE":g<.9*m?a="KEEP REPAIRING":a="ON THE LINE",{values:{breaksYr:i,annualRepair:g,annualizedReplace:m,breakEvenN:b,breaksPerMileYr:v,flagOutlier:w,verdict:a,criticalityOverride:E,criticality:f,costRepair:r,costReplace:d,lifeYrs:c,discountRate:p,cohortAvg:h},computed:["breaksYr","annualRepair","annualizedReplace","breakEvenN","verdict"],error:""}},interpret:e=>{if(e.verdict==null)return null;let t=e.verdict==="REPLACE"?"alert":e.verdict==="KEEP REPAIRING"?"good":"watch",o=Math.round(e.breakEvenN*100)/100,i=Math.round(e.breaksYr*100)/100,r=e.verdict+". Replacement pays for itself once this main breaks more than "+o+" times/yr; you are at "+i+".";return e.criticalityOverride&&(r+=" Criticality is set to "+e.criticality+", so this recommends REPLACE regardless of the break-even math."),e.flagOutlier===!0&&(r+=" Outlier flag: this segment runs about "+Math.round(e.breaksPerMileYr*100)/100+" breaks/mile/yr, at least 2x the cohort average of "+e.cohortAvg+"."),r+=" This treats a repair and a replacement as buying the same service; it ignores the consequence cost of a failure unless you raise criticality.",{level:t,text:r}},links:[{label:"EPA Asset Management: A Handbook for Small Water Systems (PDF)",href:"https://www.epa.gov/system/files/documents/2022-06/FINAL%20AM%20Handbook%20for%20Small%20Water%20Systems%20STEP%20Guide_508.pdf"},{label:"See how utilities tie this number to their asset records",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["break even","main break","watchlist","2x rule","outlier","capital planning","replacement reserve","CIP"]}];function P(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}var H=[{id:"cost-of-turnover",cat:"Workforce",domains:["water","wastewater"],title:"Cost of Turnover",formula:"Operators lost/yr x (recruiting + OT backfill + ramp cost)",note:"What losing an operator actually costs, and the raise it would take to break even on keeping one instead.",fields:[{k:"operatorsLost",label:"Operators lost per year"},{k:"salary",label:"Fully-loaded salary per operator ($/yr)"},{k:"recruitCost",label:"Recruiting + training cost per hire ($)"},{k:"otWeeklyRate",label:"On-call/OT backfill cost per week vacant ($)",def:400},{k:"vacancyWeeks",label:"Weeks the position sits vacant"},{k:"rampMonths",label:"Months to full proficiency (new-hire ramp)",def:12},{k:"rampLossPct",label:"Productivity loss during ramp (% of salary, averaged over the ramp)",def:50}],solve:e=>{let t=P(e.operatorsLost),o=P(e.salary),i=P(e.recruitCost),r=P(e.vacancyWeeks);if(t==null||t<=0)return{values:{},computed:[],error:"Enter how many operators you lose in a typical year."};if(o==null||o<=0)return{values:{},computed:[],error:"Enter the fully-loaded salary per operator."};if(i==null||i<0)return{values:{},computed:[],error:"Enter the recruiting + training cost per hire (0 if none)."};if(r==null||r<0)return{values:{},computed:[],error:"Enter how many weeks the position typically sits vacant."};let d=P(e.otWeeklyRate)??400,c=P(e.rampMonths)??12,p=P(e.rampLossPct)??50,h=d*r,f=o*(c/12)*(p/100),g=i+h+f,m=t*g;return{values:{otBackfillCost:h,rampCost:f,costPerDeparture:g,annualCost:m,breakEvenRaise:g,operatorsLost:t,salary:o,recruitCost:i,vacancyWeeks:r,otWeeklyRate:d,rampMonths:c,rampLossPct:p},computed:["otBackfillCost","rampCost","costPerDeparture","annualCost","breakEvenRaise"],error:""}},interpret:e=>{if(e.annualCost==null)return null;let t=Math.round(e.annualCost),o=Math.round(e.breakEvenRaise);return{level:"info",text:"Losing "+e.operatorsLost+" operator"+(e.operatorsLost===1?"":"s")+"/yr costs about $"+t.toLocaleString("en-US")+"/yr (recruiting + OT backfill + ramp-up productivity loss). A retention raise would have to beat $"+o.toLocaleString("en-US")+" per operator per year to lose money; anything under that line is cheaper than the churn it prevents."}},links:[{label:"Field guide: staffing and turnover, it is a budget decision",href:"https://www.ziptility.com/guides/staffing-and-turnover-its-a-budget-decision"},{label:"See how utilities track this in Ziptility",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["retention","staffing","silver tsunami","overtime","on-call","recruiting cost","vacancy"]}];function x(e){let t=typeof e=="number"?e:e==null||e===""?null:parseFloat(e);return t!=null&&isFinite(t)?t:null}function F(e,t){return e==null||t==null||t===0?null:(e-t)/t*100}var q=[{id:"energy-cost",cat:"Energy",domains:["water","wastewater"],title:"Energy $ per 1,000 Gallons",formula:"kWh / (gallons / 1,000); x $/kWh = $ per 1,000 gal",note:"Energy as a number you manage: cost per 1,000 gallons pumped, plus the three preventive-maintenance triggers if you have a prior period to compare against.",fields:[{k:"kwh",label:"kWh this period"},{k:"gallons",label:"Gallons pumped this period"},{k:"rate",label:"$ / kWh",def:.1},{k:"kwhPrior",label:"kWh, prior period (optional)"},{k:"gallonsPrior",label:"Gallons pumped, prior period (optional)"},{k:"startsPerDay",label:"Pump starts/day, this period (optional)"},{k:"startsPerDayPrior",label:"Pump starts/day, prior period (optional)"},{k:"specificCapacity",label:"Specific capacity, this period, gpm/ft drawdown (optional, wells)"},{k:"specificCapacityPrior",label:"Specific capacity, prior period (optional)"}],solve:e=>{let t=x(e.kwh),o=x(e.gallons);if(t==null)return{values:{},computed:[],error:"Enter kWh for this period."};if(o==null||o<=0)return{values:{},computed:[],error:"Enter gallons pumped this period."};let i=x(e.rate)??.1,r=t/(o/1e3),d=r*i,c=x(e.kwhPrior),p=x(e.gallonsPrior),h=null,f=null,g=null;c!=null&&p!=null&&p>0&&(h=c/(p/1e3),f=F(r,h),g=f!=null&&f>=15);let m=x(e.startsPerDay),b=x(e.startsPerDayPrior),v=null,w=null;m!=null&&b!=null&&b>0&&(v=F(m,b),w=v!=null&&v>=25);let E=x(e.specificCapacity),a=x(e.specificCapacityPrior),n=null,s=null;E!=null&&a!=null&&a>0&&(n=F(E,a),s=n!=null&&n<=-20);let l=[];return g&&l.push("kWh/1,000 gal up "+Math.round(f*10)/10+"% vs prior period (>= 15% trigger)"),w&&l.push("pump starts/day up "+Math.round(v*10)/10+"% vs prior period (>= 25% trigger)"),s&&l.push("specific capacity down "+Math.round(Math.abs(n)*10)/10+"% vs prior period (>= 20% drop trigger)"),{values:{kwhPerKgal:r,costPerKgal:d,kwhPerKgalPrior:h,energyPctChange:f,flagEnergyUp:g,startsPctChange:v,flagStartsUp:w,scPctChange:n,flagCapacityDown:s,pmTriggered:l,rate:i},computed:["kwhPerKgal","costPerKgal"],error:""}},interpret:e=>{if(e.kwhPerKgal==null)return null;let t=Math.round(e.kwhPerKgal*100)/100,o=Math.round(e.costPerKgal*100)/100,i="This period: "+t+" kWh per 1,000 gal, $"+o+" per 1,000 gal.";return e.pmTriggered&&e.pmTriggered.length?(i+=" PM trigger"+(e.pmTriggered.length===1?"":"s")+" tripped: "+e.pmTriggered.join("; ")+". Schedule a pump/well check.",{level:"watch",text:i}):(e.kwhPerKgalPrior!=null&&(i+=" No PM trigger tripped vs the prior period."),{level:"good",text:i})},links:[{label:"Field guide: energy as a number you manage",href:"https://www.ziptility.com/guides/energy-as-a-number-you-manage"},{label:"See how utilities track this in Ziptility",href:"https://www.ziptility.com/solutions/financial-tracking"}],keywords:["kwh per 1000 gallons","specific energy","pump starts","specific capacity","preventive maintenance","energy audit"]}];var R=[...D,...H,...q];function y(e){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function I(e){return`
<header class="zmt-head">
  <div class="zmt-head-wrap">
    <p class="zmt-eyebrow">Manager toolbox</p>
    <h1>${y(e.title)}</h1>
    <p class="zmt-tagline">${y(e.note)}</p>
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
`}var C={hubspotPortalId:"4938013",hubspotFormId:"",fallbackEmail:"sales@ziptility.com"},M="zip-manager-energy-history";function k(e){if(e==null||!isFinite(e))return"";let t=Math.round(e*1e6)/1e6;return Math.abs(t)>=1e3?t.toLocaleString("en-US",{maximumFractionDigits:2}):String(parseFloat(t.toFixed(4)))}function L(e){if(e==null||!isFinite(e))return"";let t=e<0?"-":"",o=Math.abs(e),i=o<100?2:0;return t+"$"+o.toLocaleString("en-US",{minimumFractionDigits:i,maximumFractionDigits:i})}function G(e){try{let t=window.localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}}function $(e,t){try{window.localStorage.setItem(e,JSON.stringify(t))}catch{}}var W={"repair-or-replace":[{k:"verdict",label:"Verdict",raw:!0},{k:"breaksYr",label:"Your breaks/yr",f:k},{k:"breakEvenN",label:"Break-even breaks/yr",f:k},{k:"annualRepair",label:"Annual repair cost",f:L},{k:"annualizedReplace",label:"Annualized replacement cost",f:L}],"cost-of-turnover":[{k:"annualCost",label:"Annual cost of churn",f:L},{k:"breakEvenRaise",label:"Retention-raise break-even ($/operator/yr)",f:L},{k:"costPerDeparture",label:"Cost per departure",f:L}],"energy-cost":[{k:"kwhPerKgal",label:"kWh / 1,000 gal",f:k},{k:"costPerKgal",label:"$ / 1,000 gal",f:L}]};function K(e){let t=[],o=null;return e.fields.forEach(i=>{let r=i.section||"";(!o||o.section!==r)&&(o={section:r,fields:[]},t.push(o)),o.fields.push(i)}),t}function _(e,t){let i=(t.units||Object.keys(z[t.unit])).map(r=>'<option value="'+r+'"'+(r===t.def?" selected":"")+">"+z[t.unit][r].label+"</option>").join("");return'<select id="'+e+'__u" data-cur="'+t.def+'" aria-label="unit">'+i+"</select>"}function N(e,t){let o="zmt-"+e.id+"-"+t.k,i=!t.unit&&t.def!=null,r=i?' value="'+y(k(t.def))+'"':"",d='<input id="'+o+'" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="-"'+r+">",c=t.unit?'<div class="zmt-uf">'+d+_(o,t)+"</div>":d,p=i?'<div class="zmt-rot">Rule of thumb, use your own number.</div>':"";return'<div class="zmt-field" data-k="'+t.k+'"><label for="'+o+'">'+y(t.label)+"</label>"+c+p+"</div>"}function Z(e){if(!e.toggle)return"";let t=e.toggle;return'<div class="zmt-seg" role="group" aria-label="'+y(t.k)+'">'+t.options.map(o=>'<button type="button" data-v="'+y(o.v)+'" aria-pressed="'+(o.v===t.def)+'">'+y(o.label)+"</button>").join("")+"</div>"}function U(e,t){e.innerHTML=I(t);let o=e.querySelector("#zmt-stage"),i=K(t),r=t.toggle?t.toggle.def:null,d=i.map(a=>{let n=a.fields.filter(u=>!u.advanced),s=a.fields.filter(u=>u.advanced),l=(a.section?'<h3 class="zmt-section">'+y(a.section)+"</h3>":"")+'<div class="zmt-fields">'+n.map(u=>N(t,u)).join("")+"</div>";return s.length&&(l+='<details class="zmt-advanced"><summary>Advanced</summary><div class="zmt-fields">'+s.map(u=>N(t,u)).join("")+"</div></details>"),l}).join("");if(o.innerHTML='<div class="zmt-card"><div class="zmt-card-head"><div class="zmt-formula">'+y(t.formula)+"</div>"+Z(t)+"</div>"+d+'<div class="zmt-actions"><button class="zmt-btn zmt-btn-calc" id="zmt-calc" type="button">Calculate</button><button class="zmt-btn zmt-btn-clear" id="zmt-clear" type="button">Clear</button><button class="zmt-btn zmt-btn-print" id="zmt-print" type="button">Print / PDF</button></div><div class="zmt-msg" id="zmt-msg" aria-live="polite"></div><div class="zmt-result" id="zmt-result" aria-live="polite"></div><div class="zmt-links" id="zmt-links"></div><button class="zmt-capture-open" id="zmt-capture-open" type="button" hidden>Email or print this result</button></div>',t.links&&t.links.length){let a=e.querySelector("#zmt-links");a.innerHTML="Learn more: "+t.links.map(n=>'<a href="'+n.href+'" target="_blank" rel="noopener">'+y(n.label)+"</a>").join(" &middot; ")}let c={};t.fields.forEach(a=>{c[a.k]=e.querySelector("#zmt-"+t.id+"-"+a.k)});function p(a){if(!a)return null;let n=a.value.replace(/,/g,"").trim();if(n==="")return null;let s=parseFloat(n);return isFinite(s)?s:null}function h(a){return e.querySelector("#"+a.id+"__u")}function f(a){let n=c[a.k],s=p(n);if(s==null)return null;if(a.unit){let l=h(n);return s*z[a.unit][l.value].f}return s}function g(a,n){let s=c[a.k];if(s)if(a.unit){let l=h(s);s.value=k(n/z[a.unit][l.value].f)}else s.value=k(n)}if(t.fields.forEach(a=>{if(!a.unit)return;let n=c[a.k],s=h(n);s.addEventListener("change",()=>{let l=s.dataset.cur,u=s.value,S=p(n);S!=null&&(n.value=k(S*z[a.unit][l].f/z[a.unit][u].f)),s.dataset.cur=u})}),t.toggle&&e.querySelectorAll(".zmt-seg button").forEach(a=>a.addEventListener("click",()=>{a.dataset.v!==r&&(r=a.dataset.v,e.querySelectorAll(".zmt-seg button").forEach(n=>n.setAttribute("aria-pressed",String(n.dataset.v===r))))})),t.id==="energy-cost"){let a=G(M);if(a){let n={kwhPrior:"kwh",gallonsPrior:"gallons",startsPerDayPrior:"startsPerDay",specificCapacityPrior:"specificCapacity"};Object.keys(n).forEach(s=>{let l=c[s];l&&!l.value&&a[n[s]]!=null&&(l.value=k(a[n[s]]))})}}let m=e.querySelector("#zmt-msg"),b=e.querySelector("#zmt-result"),v=e.querySelector("#zmt-capture-open");function w(a){if(b.innerHTML="",m.textContent="",m.className="zmt-msg",a.error){m.textContent=a.error;return}t.fields.forEach(l=>{if(l.k in a.values){let u=a.values[l.k];typeof u=="number"&&isFinite(u)&&a.computed.includes(l.k)&&(g(l,u),c[l.k]&&c[l.k].classList.add("zmt-computed"))}});let s=(W[t.id]||[]).map(l=>{let u=a.values[l.k];if(u==null)return"";let S=l.raw?y(String(u)):y(l.f?l.f(u):String(u));return'<div class="zmt-stat'+(l.k==="verdict"?" zmt-chip zmt-chip-"+(u==="REPLACE"?"alert":u==="KEEP REPAIRING"?"good":"watch"):"")+'"><span class="zmt-stat-label">'+y(l.label)+'</span><span class="zmt-stat-val">'+S+"</span></div>"}).join("");if(b.innerHTML='<div class="zmt-stats">'+s+"</div>",a.values.flagOutlier===!0&&(b.innerHTML+='<div class="zmt-chip zmt-chip-watch zmt-flag">Outlier: '+k(a.values.breaksPerMileYr)+" breaks/mi/yr (>= 2x cohort avg of "+k(a.values.cohortAvg)+")</div>"),a.values.pmTriggered&&a.values.pmTriggered.length&&a.values.pmTriggered.forEach(l=>{b.innerHTML+='<div class="zmt-chip zmt-chip-watch zmt-flag">'+y(l)+"</div>"}),t.interpret){let l=t.interpret(a.values);l&&(b.innerHTML+='<div class="zmt-insight zmt-show zmt-'+l.level+'"><span class="zmt-lead">Note</span>'+y(l.text)+"</div>")}if(t.id==="energy-cost"){let l={};["kwh","gallons","startsPerDay","specificCapacity"].forEach(S=>{a.values[S]!=null&&(l[S]=a.values[S])});let u={kwh:p(c.kwh),gallons:p(c.gallons),startsPerDay:p(c.startsPerDay),specificCapacity:p(c.specificCapacity)};$(M,u)}v.hidden=!1,e.dataset.zmtResultSummary=V(t,a)}function E(){let a={};t.fields.forEach(s=>{a[s.k]=f(s)}),t.toggle&&(a[t.toggle.k]=r);let n=t.solve(a);w(n)}e.querySelector("#zmt-calc").addEventListener("click",E),e.querySelector("#zmt-clear").addEventListener("click",()=>{t.fields.forEach(a=>{let n=c[a.k];n&&(n.value=!a.unit&&a.def!=null?k(a.def):"",n.classList.remove("zmt-computed"))}),t.toggle&&(r=t.toggle.def,e.querySelectorAll(".zmt-seg button").forEach(a=>a.setAttribute("aria-pressed",String(a.dataset.v===r)))),b.innerHTML="",m.textContent="",v.hidden=!0}),e.querySelector("#zmt-print").addEventListener("click",()=>{try{window.print()}catch{}}),t.fields.forEach(a=>{let n=c[a.k];n&&(n.addEventListener("keydown",s=>{s.key==="Enter"&&E()}),n.addEventListener("input",()=>n.classList.remove("zmt-computed")))})}function V(e,t){let i=(W[e.id]||[]).map(r=>r.label+": "+(r.raw?t.values[r.k]:r.f?r.f(t.values[r.k]):t.values[r.k])).filter(Boolean);return e.title+" -- "+i.join("; ")}function B(e,t){let o=e.querySelector("#zmt-capture-open"),i=e.querySelector("#zmt-lead-modal");if(!o||!i)return;function r(){i.classList.add("zmt-show"),e.querySelector("#zmt-lead-form").style.display="block",e.querySelector("#zmt-lead-ok").style.display="none"}function d(){i.classList.remove("zmt-show")}o.addEventListener("click",r),e.querySelector("#zmt-lead-close").addEventListener("click",d),i.addEventListener("click",c=>{c.target===i&&d()}),e.querySelector("#zmt-lead-submit").addEventListener("click",()=>{let c=e.querySelector("#zmt-ld-name").value.trim(),p=e.querySelector("#zmt-ld-email").value.trim(),h=e.querySelector("#zmt-ld-util").value.trim();if(!p||!/.+@.+\..+/.test(p)){e.querySelector("#zmt-ld-email").focus();return}let f=e.dataset.zmtResultSummary||t.title+" result",g=m=>{e.querySelector("#zmt-lead-form").style.display="none";let b=e.querySelector("#zmt-lead-ok");b.style.display="block",m&&(e.querySelector("#zmt-lead-ok-msg").textContent=m)};if(C.hubspotPortalId&&C.hubspotFormId)fetch("https://api.hsforms.com/submissions/v3/integration/submit/"+C.hubspotPortalId+"/"+C.hubspotFormId,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:[{name:"email",value:p},{name:"firstname",value:c},{name:"company",value:h},{name:"message",value:f}]})}).then(()=>g()).catch(()=>g("Saved. We'll be in touch shortly."));else{let m=encodeURIComponent("Please send this "+t.title+` result.

`+f+`

Name: `+c+`
Utility: `+h+`
Email: `+p);try{window.location.href="mailto:"+C.fallbackEmail+"?subject="+encodeURIComponent(t.title+" result")+"&body="+m}catch{}g("Opening your email app to finish the request.")}})}function j(){let e=document.getElementById("ziptility-manager-tools");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zip-manager-styles")){let r=document.createElement("style");r.id="zip-manager-styles",r.textContent=T,document.head.appendChild(r)}if(!document.getElementById("zip-manager-fonts")){let r=document.createElement("link");r.rel="preconnect",r.href="https://fonts.googleapis.com";let d=document.createElement("link");d.rel="preconnect",d.href="https://fonts.gstatic.com",d.crossOrigin="anonymous";let c=document.createElement("link");c.id="zip-manager-fonts",c.rel="stylesheet",c.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(r,d,c)}let t=!1,o=null;try{let r=new URLSearchParams(window.location.search);t=r.get("embed")==="app",o=r.get("tool")}catch{}if(t||(t=e.dataset.embed==="app"),o||(o=e.dataset.tool||null),t&&e.classList.add("zmt-embed-app"),e.innerHTML="",!o){e.innerHTML='<div class="zmt-error">This page is missing its tool id. Set <code>data-tool</code> on the mount div (or add <code>?tool=</code> to the URL) to one of: '+R.map(r=>r.id).join(", ")+".</div>";return}let i=R.find(r=>r.id===o);if(!i){e.innerHTML='<div class="zmt-error">"'+o+'" is not one of the manager tools. Available: '+R.map(r=>r.id).join(", ")+".</div>";return}U(e,i),B(e,i)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",j):j();})();
