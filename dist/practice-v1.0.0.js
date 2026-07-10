/* Ziptility Practice Tests practice-v1.0.0 (89b5a8bf6c608550681fe8c059c1ec13ee3b4cd0) — https://github.com/BlakeAndersonZiptility/ziptility-tools */
(()=>{var se=`/* Ziptility practice tests: DS 4.0 reskin, ported from
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

#ziptility-practice .zq-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:.6rem;
  font-family:var(--font-sans); font-weight:700;
  border-radius:var(--radius);
  border:2px solid transparent;
  cursor:pointer;
  transition:background var(--dur) var(--ease), color var(--dur) var(--ease),
             border-color var(--dur) var(--ease), transform var(--dur-fast) var(--ease);
}
#ziptility-practice .zq-btn:active{ transform:scale(var(--press-scale)); }
#ziptility-practice .zq-btn[disabled]{ opacity:.5; cursor:not-allowed; }
#ziptility-practice .zq-btn .zq-arrow{ display:inline-flex; transition:transform var(--dur-fast) var(--ease); }

#ziptility-practice .zq-btn-primary{
  background:var(--tomato); color:var(--white);
  padding:1.15rem 2.4rem; font-size:20px;
}
#ziptility-practice .zq-btn-primary:hover{ background:var(--tomato-press); }
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
#ziptility-practice .zq-choice.zq-selected .zq-letter{ background:var(--tomato); color:var(--white); }
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
#ziptility-practice .zq-hubcard{
  display:block; width:100%; text-align:left;
  background:var(--white); border:none; border-radius:var(--radius);
  box-shadow:var(--shadow-sm); padding:18px; cursor:pointer;
  font-family:inherit; color:inherit;
  transition:box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}
#ziptility-practice .zq-hubcard:hover{ box-shadow:var(--shadow-md); transform:translateY(-3px); }
#ziptility-practice .zq-hubcard .zq-eyebrow{
  display:block; font-weight:700; font-size:12px; text-transform:uppercase;
  letter-spacing:.06em; color:var(--tomato); margin-bottom:6px;
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
`;var ce={calcUrl:"/tools/calculator",formulaSheetUrl:"/tools/formula-sheets",contactEmail:""};var de="https://blakeandersonziptility.github.io/ziptility-tools/dist/practice-banks/",Y=[{id:"operator-math-1",title:"Operator math practice test",badge:"Operator math \xB7 Levels 1-2 (ABC Class I-II)",discipline:"Operator Math",level:"Levels 1-2 (ABC Class I-II)",questionCount:110,durationMin:120,refCount:100,bankVersion:"1.0.0"}];function Ne(e){let r=new Set;for(let n of e){if(!n||!n.id)throw new Error("practice manifest: entry missing id");if(r.has(n.id))throw new Error('practice manifest: duplicate id "'+n.id+'"');if(r.add(n.id),!n.title||!n.badge||!n.discipline||!n.level)throw new Error('practice manifest: "'+n.id+'" is missing a required label field');if(!Number.isInteger(n.questionCount)||n.questionCount<=0)throw new Error('practice manifest: "'+n.id+'" has a bad questionCount');if(!Number.isInteger(n.durationMin)||n.durationMin<=0)throw new Error('practice manifest: "'+n.id+'" has a bad durationMin');if(!Number.isInteger(n.refCount)||n.refCount<=0)throw new Error('practice manifest: "'+n.id+'" has a bad refCount');if(!/^\d+\.\d+\.\d+$/.test(n.bankVersion||""))throw new Error('practice manifest: "'+n.id+'" has a malformed bankVersion')}return!0}Ne(Y);var K=new Map;async function le(e,r,n){let c=e+"-v"+r;if(K.has(c))return K.get(c);let f=n+c+".json",m=new AbortController,C=setTimeout(()=>m.abort(),1e4),z;try{z=await fetch(f,{signal:m.signal})}finally{clearTimeout(C)}if(!z.ok)throw new Error("practice bank fetch failed: "+f+" ("+z.status+")");let o=await z.json();return K.set(c,o),o}var Ae={"operator-math-1":"Unit conversions, flow, dosing, and the 8.34 pounds formula, worked out in plain English."};function k(e,r,n){let c=document.createElement(e);return r&&(c.className=r),n!=null&&(c.textContent=n),c}function J(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function pe(e,{onSelect:r}){J(e),e.appendChild(k("h2","zq-hub-section-title","Pick your test"));let n=k("div","zq-hub-grid");Y.forEach(c=>{let f=k("button","zq-hubcard");f.type="button",f.appendChild(k("span","zq-eyebrow",c.discipline)),f.appendChild(k("h3",null,c.title)),f.appendChild(k("p",null,Ae[c.id]||"")),f.appendChild(k("div","zq-meta",c.questionCount+" questions \xB7 practice or timed exam")),f.addEventListener("click",()=>r(c)),n.appendChild(f)}),e.appendChild(n)}function ue(e){J(e);let r=k("div","zq-loading");r.appendChild(k("span","zq-spinner")),r.appendChild(k("span",null,"Loading questions\u2026")),e.appendChild(r)}function fe(e,{message:r,onRetry:n}){J(e);let c=k("div","zq-error");c.setAttribute("role","alert"),c.appendChild(k("h3",null,"Could not load this test")),c.appendChild(k("p",null,r||"The question set did not load. Check your connection and try again."));let f=k("button","zq-btn zq-btn-secondary","Try again");f.type="button",f.addEventListener("click",n),c.appendChild(f),e.appendChild(c)}function Q(e){for(let r=e.length-1;r>0;r--){let n=Math.floor(Math.random()*(r+1)),c=e[r];e[r]=e[n],e[n]=c}return e}function W(e){let r=Math.floor(e/60),n=e%60;return r+":"+(n<10?"0":"")+n}function he(e){let r=[],n=[25,50,100];for(let c of n)c<e&&r.push(c);return r.push(e),r}function X(e,r,n,c){let f=r||n;return Math.max(10,Math.round((c||120)*e/f))}function me(e,r,n){let c=new Set(r||[]),f=[],m=[];for(let z of e)(c.has(z.id)?m:f).push(z);Q(f),Q(m);let C=f.concat(m).slice(0,n);return Q(C),C.map(z=>{let o=Q([0,1,2,3]);return{q:z,order:o,correctPos:o.indexOf(z.correctIndex)}})}function ze(e,r){let n=e.length,c=0,f={},m=[];for(let z=0;z<n;z++){let o=e[z],y=o.q.domain||"General";f[y]||(f[y]={n:0,ok:0}),f[y].n+=1;let S=z in r?r[z]:null;S===o.correctPos?(c+=1,f[y].ok+=1):m.push({item:o,sel:S})}let C=Math.round(100*c/n);return{correct:c,n,pct:C,byDomain:f,missed:m}}function ge(e){return Object.keys(e).sort((r,n)=>e[r].ok/e[r].n-e[n].ok/e[n].n)}var be={MATH:"Operator math",CHEM:"Chemistry",MICRO:"Microbiology",REGS:"Regulations",SAMP:"Sampling",SAFE:"Safety",PROC:"Process control",EQIP:"Equipment",ADMIN:"Administration",Multiple:"Mixed topics"};function Me(e){try{return window.localStorage.getItem(e)}catch{return null}}function Z(e,r){try{window.localStorage.setItem(e,r)}catch{}}function Be(e){try{window.localStorage.removeItem(e)}catch{}}function _(e){let r=Me(e);if(!r)return null;try{return JSON.parse(r)}catch{return null}}function t(e,r,n){let c=document.createElement(e);return r&&(c.className=r),n!=null&&(c.textContent=n),c}function H(e){for(;e.firstChild;)e.removeChild(e.firstChild)}var Oe='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';function T(e,r,{arrow:n=!1}={}){let c=t("button",r);c.type="button";let f=t("span","zq-btn-label",e);if(c.appendChild(f),n){let m=document.createElement("span");m.className="zq-arrow",m.innerHTML=Oe,c.appendChild(m)}return c}function Pe(e,r){let n=e.querySelector(".zq-btn-label");n&&(n.textContent=r)}function qe(e,r,n,{onExit:c}={}){let f="zpt-pt-session-"+r.id,m="zpt-pt-history-"+r.id,C="zpt-pt-seen-"+r.id,z={};for(let i of r.questions)z[i.id]=i;H(e);let o=t("div"),y=t("div","zq-visually-hidden");y.setAttribute("aria-live","polite"),e.appendChild(o),e.appendChild(y);function S(i){y.textContent=i}let a=null,E={mode:"practice",size:null};function O(){a&&Z(f,JSON.stringify({v:1,bankVersion:r.version||"",mode:a.mode,size:a.size,qids:a.qs.map(i=>i.q.id),orders:a.qs.map(i=>i.order),answers:a.answers,checked:a.checked,idx:a.idx,remainingSec:a.remainingSec}))}function xe(){let i=_(f);if(!i||i.v!==1||i.bankVersion!==(r.version||"")||!i.qids||!i.qids.length)return null;for(let l of i.qids)if(!z[l])return null;return i}function V(){Be(f)}function ye(i){let l=_(m)||[];l.unshift(i),l.length>25&&(l=l.slice(0,25)),Z(m,JSON.stringify(l))}function we(i){let s=(_(C)||[]).concat(i);s.length>600&&(s=s.slice(s.length-600)),Z(C,JSON.stringify(s))}function G(){U(),a=null,H(o);let i=t("div");i.appendChild(t("span","zq-badge",n.badge||r.discipline||"")),i.appendChild(t("h2","zq-title",n.title||r.title)),o.appendChild(i);let l=xe();if(l){let d=t("div","zq-resume"),p=t("div");p.appendChild(t("strong",null,"You have a test in progress. ")),p.appendChild(document.createTextNode((l.mode==="exam"?"Timed exam":"Practice")+", question "+(l.idx+1)+" of "+l.qids.length+".")),d.appendChild(p);let u=t("div","zq-navrow"),h=T("Resume","zq-btn zq-btn-primary",{arrow:!0});h.addEventListener("click",()=>Ce(l));let v=T("Discard","zq-btn zq-btn-quiet");v.addEventListener("click",()=>{V(),G()}),u.appendChild(h),u.appendChild(v),d.appendChild(u),o.appendChild(d)}let s=t("div","zq-card");s.appendChild(t("h2",null,"Set up your test"));let b=t("div","zq-mode-grid"),q=[{id:"practice",name:"Practice",desc:"Check each answer as you go. Every question shows a plain-English explanation."},{id:"exam",name:"Timed exam",desc:"No feedback until the end, with a clock running. The closest thing to test day."}],x={};q.forEach(d=>{let p=t("button","zq-mode"+(E.mode===d.id?" zq-selected":""));p.type="button",p.appendChild(t("h3",null,d.name)),p.appendChild(t("p",null,d.desc)),p.addEventListener("click",()=>{E.mode=d.id;for(let u in x)x[u].classList.toggle("zq-selected",u===d.id);j()}),x[d.id]=p,b.appendChild(p)}),s.appendChild(b);let g=he(r.questions.length);(E.size===null||g.indexOf(E.size)===-1)&&(E.size=g[0]);let N=t("div","zq-size-row"),A={};g.forEach(d=>{let p=t("button","zq-size"+(E.size===d?" zq-selected":""));p.type="button",p.appendChild(document.createTextNode(d===r.questions.length&&g.length>1?"All "+d:String(d))),p.appendChild(t("small",null,"questions")),p.addEventListener("click",()=>{E.size=d;for(let u in A)A[u].classList.toggle("zq-selected",Number(u)===d);j()}),A[d]=p,N.appendChild(p)}),s.appendChild(N);let L=t("div","zq-navrow"),M=T("","zq-btn zq-btn-primary",{arrow:!0});M.addEventListener("click",()=>$(E.mode,E.size)),L.appendChild(M),s.appendChild(L),o.appendChild(s);function j(){Pe(M,E.mode==="exam"?"Start timed exam ("+E.size+" questions, "+X(E.size,r.refCount,r.questions.length,r.durationMin)+" min)":"Start practice ("+E.size+" questions)")}j();let w=_(m)||[];if(w.length){let d=0;for(let p of w)p.scorePct>d&&(d=p.scorePct);o.appendChild(t("p","zq-best","Your best score on this test so far: "+d+" percent. Attempts: "+w.length+"."))}}function $(i,l){V();let s=_(C)||[];a={mode:i,size:l,qs:me(r.questions,s,l),idx:0,answers:{},checked:{},remainingSec:i==="exam"?X(l,r.refCount,r.questions.length,r.durationMin)*60:0,timerId:null},O(),i==="exam"&&te(),P()}function Ce(i){a={mode:i.mode,size:i.size,qs:i.qids.map((l,s)=>{let b=z[l],q=i.orders[s];return{q:b,order:q,correctPos:q.indexOf(b.correctIndex)}}),idx:i.idx||0,answers:i.answers||{},checked:i.checked||{},remainingSec:i.remainingSec||0,timerId:null},a.mode==="exam"&&te(),P()}function ee(){let i=e.querySelector(".zq-timer");i&&(i.textContent=W(Math.max(0,a.remainingSec)),i.classList.toggle("zq-low",a.remainingSec<=120)),a.remainingSec%15===0&&O(),a.remainingSec<=0&&(S("Time is up. Scoring your exam."),F())}function te(){U(),a.timerId=setInterval(()=>{a.remainingSec-=1,ee()},1e3)}function U(){a&&a.timerId&&(clearInterval(a.timerId),a.timerId=null)}function P(){H(o);let i=a.qs[a.idx],l=i.q,s=a.qs.length,b=!!a.checked[a.idx],q=a.idx in a.answers?a.answers[a.idx]:null,x=t("div","zq-topbar"),g=t("div");if(g.appendChild(document.createTextNode("Question "+(a.idx+1)+" of "+s+"  ")),g.appendChild(t("span","zq-domchip",be[l.domain]||l.domain||"General")),x.appendChild(g),a.mode==="exam"){let d=t("span","zq-timer",W(Math.max(0,a.remainingSec)));a.remainingSec<=120&&d.classList.add("zq-low"),x.appendChild(d)}o.appendChild(x);let N=t("div","zq-progressbar"),A=t("i");A.style.width=Math.round(100*a.idx/s)+"%",N.appendChild(A),o.appendChild(N);let L=t("div","zq-card");L.appendChild(t("div","zq-stem",l.text));let M=t("ul","zq-choices"),j=["A","B","C","D"];i.order.forEach((d,p)=>{let u=t("li"),h=t("button","zq-choice");h.type="button",h.appendChild(t("span","zq-letter",j[p])),h.appendChild(t("span",null,l.choices[d])),q===p&&h.classList.add("zq-selected"),b?(h.disabled=!0,p===i.correctPos?(h.classList.remove("zq-selected"),h.classList.add("zq-correct")):q===p&&(h.classList.remove("zq-selected"),h.classList.add("zq-wrong"))):h.addEventListener("click",()=>ie(p)),u.appendChild(h),M.appendChild(u)}),L.appendChild(M),b&&L.appendChild(ke(i,q));let w=t("div","zq-navrow");if(a.mode==="exam"){let d=T("Previous","zq-btn zq-btn-quiet");if(d.disabled=a.idx===0,d.addEventListener("click",()=>{a.idx-=1,O(),P()}),w.appendChild(d),w.appendChild(t("span","zq-spacer")),a.idx<s-1){let h=T("Next","zq-btn zq-btn-primary",{arrow:!0});h.addEventListener("click",()=>{a.idx+=1,O(),P()}),w.appendChild(h)}let p=0;for(let h in a.answers)a.answers[h]!==null&&p++;let u=T("Submit ("+p+"/"+s+" answered)",a.idx===s-1?"zq-btn zq-btn-primary":"zq-btn zq-btn-secondary");u.addEventListener("click",()=>{p<s&&!window.confirm("You have unanswered questions. Submit anyway?")||F()}),w.appendChild(u)}else if(w.appendChild(t("span","zq-spacer")),b){let d=T(a.idx<s-1?"Next question":"See your score","zq-btn zq-btn-primary",{arrow:!0});d.setAttribute("data-zq-next",""),d.addEventListener("click",()=>{a.idx<s-1?(a.idx+=1,O(),P()):F()}),w.appendChild(d)}else{let d=T("Check answer","zq-btn zq-btn-primary");d.setAttribute("data-zq-check",""),d.disabled=q===null,d.addEventListener("click",re),w.appendChild(d)}L.appendChild(w),o.appendChild(L);try{e.scrollIntoView({block:"start"})}catch{}}function ie(i){a.answers[a.idx]=i,O(),P()}function re(){if(!(a.idx in a.answers))return;a.checked[a.idx]=!0,O();let i=a.qs[a.idx];S(a.answers[a.idx]===i.correctPos?"Correct.":"Not quite. The explanation is shown below."),P()}function ke(i,l){let s=i.q,b=l===i.correctPos,q=t("div","zq-feedback "+(b?"zq-ok":"zq-err"));q.appendChild(t("h4",b?"zq-okt":"zq-errt",b?"Correct":"Not quite")),s.explanation&&q.appendChild(t("p","zq-explain",s.explanation)),s.formula&&q.appendChild(t("div","zq-formula",s.formula)),s.citation&&q.appendChild(t("div","zq-cite","Source: "+s.citation));let x=t("div","zq-minilinks");if(s.calculator&&n.calcUrl){let g=t("a",null,"Run this math in the Operator Calculator");g.href=n.calcUrl+"#"+s.calculator,g.target="_blank",g.rel="noopener",x.appendChild(g)}if(n.contactEmail){let g=t("a",null,"Report a problem with this question");g.href="mailto:"+n.contactEmail+"?subject="+encodeURIComponent("Practice test question "+s.id),x.appendChild(g)}return x.childNodes.length&&q.appendChild(x),q}function F(){U();let{correct:i,n:l,pct:s,byDomain:b,missed:q}=ze(a.qs,a.answers);ye({date:new Date().toISOString().slice(0,10),mode:a.mode,size:l,scorePct:s}),we(a.qs.map(x=>x.q.id)),V(),Se(s,i,l,b,q)}function Se(i,l,s,b,q){H(o);let x=i>=70,g=t("div","zq-card zq-score-hero");g.appendChild(t("div","zq-score-num "+(x?"zq-pass":"zq-fail"),i+"%")),g.appendChild(t("div","zq-score-verdict "+(x?"zq-tag-ok":"zq-tag-err"),x?"Pass at the 70 percent line":"Below the 70 percent line")),g.appendChild(t("div","zq-score-sub",l+" of "+s+" correct"+(a.mode==="exam"?" on a timed exam":""))),g.appendChild(t("p","zq-passnote","Most states set the pass line at 70 percent. Your state's rules govern, so check your certification program for the real requirement.")),S("You scored "+i+" percent, "+l+" of "+s+" correct. "+(x?"That clears the 70 percent line.":"That is below the 70 percent line."));let N=t("div","zq-navrow zq-navrow-center"),A=T("Take it again (new draw)","zq-btn zq-btn-primary",{arrow:!0});A.addEventListener("click",()=>$(a.mode,s));let L=T("Change setup","zq-btn zq-btn-secondary");L.addEventListener("click",G);let M=T("All practice tests","zq-btn zq-btn-quiet");if(M.addEventListener("click",()=>{c&&c()}),N.appendChild(A),N.appendChild(L),N.appendChild(M),g.appendChild(N),o.appendChild(g),Object.keys(b).length>1){let p=t("div","zq-card zq-dombars");p.appendChild(t("h3",null,"Where you stand by topic")),ge(b).forEach(u=>{let h=b[u],v=Math.round(100*h.ok/h.n),I=t("div","zq-dombar"+(v<70?" zq-weak":"")),R=t("div","zq-domlabel");R.appendChild(t("span",null,be[u]||u)),R.appendChild(t("span",null,h.ok+"/"+h.n+" ("+v+"%)")),I.appendChild(R);let B=t("div","zq-track"),oe=t("span","zq-fill");oe.style.width=v+"%",B.appendChild(oe),I.appendChild(B),p.appendChild(I)}),o.appendChild(p)}if(q.length){let p=t("div","zq-card zq-missed");p.appendChild(t("h3",null,"Review what you missed ("+q.length+")")),q.forEach(u=>{let h=t("details");h.appendChild(t("summary",null,u.item.q.text));let v=t("div","zq-missed-body"),I=["A","B","C","D"];if(u.sel!==null&&u.sel!==void 0){let B=t("p");B.appendChild(t("span","zq-tag-err","Your answer: ")),B.appendChild(document.createTextNode(I[u.sel]+". "+u.item.q.choices[u.item.order[u.sel]])),v.appendChild(B)}else{let B=t("p");B.appendChild(t("span","zq-tag-err","Skipped.")),v.appendChild(B)}let R=t("p");R.appendChild(t("span","zq-tag-ok","Correct answer: ")),R.appendChild(document.createTextNode(I[u.item.correctPos]+". "+u.item.q.choices[u.item.q.correctIndex])),v.appendChild(R),u.item.q.explanation&&v.appendChild(t("p","zq-explain",u.item.q.explanation)),u.item.q.formula&&v.appendChild(t("div","zq-formula",u.item.q.formula)),u.item.q.citation&&v.appendChild(t("div","zq-cite","Source: "+u.item.q.citation)),h.appendChild(v),p.appendChild(h)}),o.appendChild(p)}let w=t("div","zq-capture-slot");w.hidden=!0,o.appendChild(document.createComment(" soft-capture slot: reserved, ruling 2026-07-10 ")),o.appendChild(w);let d=_(m)||[];if(d.length>1){let p=t("div","zq-card zq-history");p.appendChild(t("h3",null,"Your attempts on this test"));let u=t("table"),h=t("tr");["Date","Mode","Questions","Score"].forEach(v=>h.appendChild(t("th",null,v))),u.appendChild(h),d.slice(0,8).forEach(v=>{let I=t("tr");I.appendChild(t("td",null,v.date)),I.appendChild(t("td",null,v.mode==="exam"?"Timed":"Practice")),I.appendChild(t("td",null,String(v.size))),I.appendChild(t("td",null,v.scorePct+"%")),u.appendChild(I)}),p.appendChild(u),o.appendChild(p)}}let ne=!0,D=null;typeof IntersectionObserver=="function"&&(D=new IntersectionObserver(i=>{for(let l of i)ne=l.isIntersecting},{threshold:0}),D.observe(e));function Ee(){if(D)return ne;let i=e.getBoundingClientRect(),l=window.innerHeight||document.documentElement.clientHeight,s=window.innerWidth||document.documentElement.clientWidth;return i.bottom>0&&i.top<l&&i.right>0&&i.left<s}function ae(i){if(!a||i.target&&(i.target.tagName==="INPUT"||i.target.tagName==="TEXTAREA")||!Ee())return;let l=i.key;if(l>="1"&&l<="4"){let s=Number(l)-1;a.checked[a.idx]||(ie(s),i.preventDefault())}else if(l==="Enter"){let s=e.querySelector("[data-zq-check]"),b=e.querySelector("[data-zq-next]");s&&!s.disabled?(re(),i.preventDefault()):b&&(b.click(),i.preventDefault())}}document.addEventListener("keydown",ae);function Ie(){U(),D&&D.disconnect(),document.removeEventListener("keydown",ae),H(e)}function Le(i){a&&(a.remainingSec=i,ee())}return G(),{destroy:Ie,__debugSetRemainingSec:Le}}function ve(){let e=document.getElementById("ziptility-practice");if(!e||e.dataset.zipBooted)return;if(e.dataset.zipBooted="1",!document.getElementById("zpt-practice-styles")){let o=document.createElement("style");o.id="zpt-practice-styles",o.textContent=se,document.head.appendChild(o)}if(!document.getElementById("zpt-practice-fonts")){let o=document.createElement("link");o.rel="preconnect",o.href="https://fonts.googleapis.com";let y=document.createElement("link");y.rel="preconnect",y.href="https://fonts.gstatic.com",y.crossOrigin="anonymous";let S=document.createElement("link");S.id="zpt-practice-fonts",S.rel="stylesheet",S.href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Geist:wght@400;500;600&display=swap",document.head.append(o,y,S)}let r=!1,n=null;try{let o=new URLSearchParams(window.location.search);r=o.get("embed")==="app",n=o.get("test")}catch{}r||(r=e.dataset.embed==="app"),n||(n=e.dataset.test||null),r&&e.classList.add("zq-embed-app");let c=e.dataset.bankBase||de;e.innerHTML="";let f=document.createElement("div");f.className="zq-wrap",e.appendChild(f);let m=null;function C(){m&&(m.destroy(),m=null),pe(f,{onSelect:z})}function z(o){ue(f),le(o.id,o.bankVersion,c).then(y=>{let S={...ce,embedApp:r,title:o.title,badge:o.badge};m=qe(f,y,S,{onExit:C}),e.dataset.debug==="1"&&(e.__zqDebug=m)}).catch(()=>{fe(f,{message:'Could not load "'+o.title+'." Check your connection and try again.',onRetry:()=>z(o)})})}if(n){let o=Y.find(y=>y.id===n);o?z(o):C()}else C()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ve):ve();})();
