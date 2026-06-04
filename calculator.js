/* ============================================================
   LEAD CAPTURE CONFIG — wire to HubSpot when ready.
   Fill portalId + formId to POST to HubSpot Forms; otherwise the
   form falls back to a mailto: to fallbackEmail.
   ============================================================ */
const LEAD = { hubspotPortalId:"4938013", hubspotFormId:"", fallbackEmail:"sales@ziptility.com" };
/* HubSpot portal 4938013 (confirm). To go live: create the formula-sheet form in HubSpot, paste its
   GUID into hubspotFormId above. Until BOTH are set, the opt-in safely falls back to a mailto. */

const C=7.4805, LBS=8.3454, LITERS=3.78541, PSI2FT=2.3067, GRGAL=17.1181, KW=0.746, PI4=0.7854, D834=8.34;

/* ---- Universal unit system (base units: ft, ft², gal, lb, gpm) ----
   f = base value per 1 of this unit.  base = value*f ;  value = base/f  */
const UNITS = {
  length:{ in:{label:"in",f:1/12}, ft:{label:"ft",f:1}, yd:{label:"yd",f:3}, mi:{label:"mi",f:5280},
    mm:{label:"mm",f:0.0032808399}, cm:{label:"cm",f:0.032808399}, m:{label:"m",f:3.2808399}, km:{label:"km",f:3280.8399} },
  area:{ sqin:{label:"in²",f:1/144}, sqft:{label:"ft²",f:1}, sqyd:{label:"yd²",f:9}, ac:{label:"acre",f:43560},
    sqm:{label:"m²",f:10.7639104}, ha:{label:"hectare",f:107639.104} },
  volume:{ gal:{label:"gal",f:1}, cf:{label:"cu ft",f:7.480519}, L:{label:"L",f:0.26417205}, m3:{label:"m³",f:264.17205},
    MG:{label:"MG",f:1e6}, acft:{label:"ac-ft",f:325851}, lbH2O:{label:"lb H₂O",f:0.1198266} },
  mass:{ lb:{label:"lb",f:1}, kg:{label:"kg",f:2.2046226}, g:{label:"g",f:0.0022046226}, ton:{label:"ton",f:2000}, galH2O:{label:"gal H₂O",f:8.3454} },
  flow:{ gpm:{label:"gpm",f:1}, mgd:{label:"MGD",f:694.44444}, gpd:{label:"gpd",f:1/1440}, cfs:{label:"cfs",f:448.8312}, Lps:{label:"L/s",f:15.850323}, mlmin:{label:"mL/min",f:1/3785.411} }
};
function uConv(value, from, to, group){ return value * UNITS[group][from].f / UNITS[group][to].f; }

function convSolve(units){ return (v)=>{ let src=null; for(const k in units){ if(v[k]!=null){ src=k; break; } }
  if(src==null) return {values:{},computed:[],error:"Enter one value."};
  const hub=v[src]/units[src], values={}, computed=[];
  for(const k in units){ values[k]=hub*units[k]; if(k!==src) computed.push(k); } return {values,computed,error:""}; }; }
const countNN=(arr)=>arr.filter(x=>x!=null).length;
// generic two-way unit converter calc (in/out are base-unit values)
function converter(id, cat, title, group, defFrom, defTo, unitList){
  return { id, cat, domains:["water","wastewater"], title, formula:"Convert between units", note:"Enter a value and pick units.",
    fields:[{k:"in",label:"From",unit:group,def:defFrom,units:unitList},{k:"out",label:"To",unit:group,def:defTo,units:unitList}],
    solve:(v)=>{ if(v.in!=null) return {values:{out:v.in},computed:["out"],error:""};
      if(v.out!=null) return {values:{in:v.out},computed:["in"],error:""};
      return {values:{},computed:[],error:"Enter a value."}; } };
}

const calculators = [
  /* ===== Geometry & Volume ===== */
  { id:"area-rect", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Area — Rectangle", formula:"Length × Width = Area", note:"Enter any two values.",
    fields:[{k:"L",label:"Length",unit:"length",def:"ft"},{k:"W",label:"Width",unit:"length",def:"ft"},{k:"A",label:"Area",unit:"area",def:"sqft"}],
    solve:(v)=>{ if(v.L!=null&&v.W!=null) return {values:{A:v.L*v.W},computed:["A"],error:""};
      if(v.A!=null&&v.L!=null) return {values:{W:v.A/v.L},computed:["W"],error:""};
      if(v.A!=null&&v.W!=null) return {values:{L:v.A/v.W},computed:["L"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"area-triangle", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Area — Triangle", formula:"½ × Base × Height = Area", note:"Enter any two values.",
    fields:[{k:"b",label:"Base",unit:"length",def:"ft"},{k:"h",label:"Height",unit:"length",def:"ft"},{k:"A",label:"Area",unit:"area",def:"sqft"}],
    solve:(v)=>{ if(v.b!=null&&v.h!=null) return {values:{A:0.5*v.b*v.h},computed:["A"],error:""};
      if(v.A!=null&&v.b!=null) return {values:{h:2*v.A/v.b},computed:["h"],error:""};
      if(v.A!=null&&v.h!=null) return {values:{b:2*v.A/v.h},computed:["b"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"area-circle", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Area — Circle", formula:"0.785 × D²  (or)  π × R² = Area", note:"Enter one value.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"A",label:"Area",unit:"area",def:"sqft"}],
    solve:(v)=>{ let D=v.D,R=v.R,A=v.A,computed=[];
      if(D!=null){ R=D/2; A=PI4*D*D; computed=["R","A"]; } else if(R!=null){ D=2*R; A=Math.PI*R*R; computed=["D","A"]; }
      else if(A!=null){ R=Math.sqrt(A/Math.PI); D=2*R; computed=["D","R"]; } else return {values:{},computed:[],error:"Enter diameter, radius, or area."};
      return {values:{D,R,A},computed,error:""}; }},
  { id:"circumference", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Circumference", formula:"π × D = Circumference", note:"Enter one value.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"c",label:"Circumference",unit:"length",def:"ft"}],
    solve:(v)=>{ let D=v.D,R=v.R,c=v.c,computed=[];
      if(D!=null){ R=D/2; c=Math.PI*D; computed=["R","c"]; } else if(R!=null){ D=2*R; c=Math.PI*D; computed=["D","c"]; }
      else if(c!=null){ D=c/Math.PI; R=D/2; computed=["D","R"]; } else return {values:{},computed:[],error:"Enter one value."};
      return {values:{D,R,c},computed,error:""}; }},
  { id:"vol-box", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Rectangular Tank", formula:"L × W × H = Volume", note:"Enter 3 lengths — or a volume to back-solve.",
    fields:[{k:"L",label:"Length",unit:"length",def:"ft"},{k:"W",label:"Width",unit:"length",def:"ft"},{k:"H",label:"Height",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ if(v.L!=null&&v.W!=null&&v.H!=null) return {values:{V:v.L*v.W*v.H*C},computed:["V"],error:""};
      const cf=v.V!=null? v.V/C : null;
      if(cf!=null&&v.L!=null&&v.W!=null) return {values:{H:cf/(v.L*v.W)},computed:["H"],error:""};
      if(cf!=null&&v.L!=null&&v.H!=null) return {values:{W:cf/(v.L*v.H)},computed:["W"],error:""};
      if(cf!=null&&v.W!=null&&v.H!=null) return {values:{L:cf/(v.W*v.H)},computed:["L"],error:""};
      return {values:{},computed:[],error:"Enter 3 lengths, or a volume + 2 lengths."}; }},
  { id:"vol-cyl", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Cylinder", formula:"0.785 × D² × H = Volume", note:"Enter D (or R) + height — or a volume.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"H",label:"Height",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ let D=v.D,R=v.R,computed=[]; if(D!=null&&R==null){ R=D/2; computed.push("R"); } else if(R!=null&&D==null){ D=2*R; computed.push("D"); }
      const cf=v.V!=null? v.V/C : null;
      if(D!=null&&v.H!=null&&v.V==null){ computed.push("V"); return {values:{D,R,V:PI4*D*D*v.H*C},computed,error:""}; }
      if(cf!=null&&D!=null&&v.H==null){ computed.push("H"); return {values:{D,R,H:cf/(PI4*D*D)},computed,error:""}; }
      if(cf!=null&&v.H!=null&&D==null){ const d=Math.sqrt(cf/(PI4*v.H)); return {values:{D:d,R:d/2},computed:["D","R"],error:""}; }
      return {values:{},computed:[],error:"Enter D (or R) + H, or a volume."}; }},
  { id:"vol-cone", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Cone / Hopper", formula:"⅓ × 0.785 × D² × H = Volume", note:"Enter D (or R) + height.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"H",label:"Height",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ let D=v.D,R=v.R,computed=[]; if(D!=null&&R==null){ R=D/2; computed.push("R"); } else if(R!=null&&D==null){ D=2*R; computed.push("D"); }
      if(D!=null&&v.H!=null){ computed.push("V"); return {values:{D,R,V:(1/3)*PI4*D*D*v.H*C},computed,error:""}; }
      if(v.V!=null&&D!=null){ computed.push("H"); return {values:{D,R,H:(v.V/C)/((1/3)*PI4*D*D)},computed,error:""}; }
      return {values:{},computed:[],error:"Enter D (or R) + height."}; }},
  { id:"vol-sphere", cat:"Geometry & Volume", domains:["water","wastewater"], title:"Volume — Sphere", formula:"(π ÷ 6) × D³ = Volume", note:"Enter diameter or radius.",
    fields:[{k:"D",label:"Diameter",unit:"length",def:"ft"},{k:"R",label:"Radius",unit:"length",def:"ft"},{k:"V",label:"Volume",unit:"volume",def:"gal"}],
    solve:(v)=>{ let D=v.D,R=v.R,computed=[]; if(D!=null&&R==null){ R=D/2; computed.push("R"); } else if(R!=null&&D==null){ D=2*R; computed.push("D"); }
      if(D!=null){ computed.push("V"); return {values:{D,R,V:(Math.PI/6)*D*D*D*C},computed,error:""}; }
      if(v.V!=null){ const d=Math.cbrt((v.V/C)*6/Math.PI); return {values:{D:d,R:d/2},computed:["D","R"],error:""}; }
      return {values:{},computed:[],error:"Enter diameter or radius."}; }},

  /* ===== Flow & Pressure ===== */
  { id:"gpm-mgd", cat:"Flow & Pressure", domains:["water","wastewater"], title:"Flow — gpm / MGD", formula:"gpm × 1440 ÷ 1,000,000 = MGD", note:"Enter one value.",
    fields:[{k:"gpm",label:"gpm"},{k:"mgd",label:"MGD"},{k:"ml",label:"mL/min"}], solve:convSolve({gpm:1, mgd:0.00144, ml:3785.41})},
  { id:"detention", cat:"Flow & Pressure", domains:["water","wastewater"], title:"Detention Time", formula:"Volume ÷ Flow = Time", note:"Enter any two. Units must be compatible.",
    fields:[{k:"vol",label:"Volume"},{k:"flow",label:"Flow / time"},{k:"t",label:"Detention Time"}],
    solve:(v)=>{ if(v.vol!=null&&v.flow!=null) return {values:{t:v.vol/v.flow},computed:["t"],error:""};
      if(v.vol!=null&&v.t!=null) return {values:{flow:v.vol/v.t},computed:["flow"],error:""};
      if(v.flow!=null&&v.t!=null) return {values:{vol:v.flow*v.t},computed:["vol"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"velocity", cat:"Flow & Pressure", domains:["water","wastewater"], title:"Velocity (Q = V × A)", formula:"Flow rate ÷ Area = Velocity", note:"Enter any two. Keep units consistent.",
    fields:[{k:"q",label:"Flow ft³/s"},{k:"a",label:"Area ft²"},{k:"vel",label:"Velocity ft/s"}],
    solve:(v)=>{ if(v.a!=null&&v.vel!=null) return {values:{q:v.a*v.vel},computed:["q"],error:""};
      if(v.q!=null&&v.a!=null) return {values:{vel:v.q/v.a},computed:["vel"],error:""};
      if(v.q!=null&&v.vel!=null) return {values:{a:v.q/v.vel},computed:["a"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.vel==null) return null; return m.vel>=2 ? {level:"good",text:"At or above 2 ft/s — meets typical self-cleansing velocity for gravity sewers."} : {level:"watch",text:"Below 2 ft/s — under typical self-cleansing velocity; solids may settle."}; }},
  { id:"pressure-head", cat:"Flow & Pressure", domains:["water"], title:"Pressure / Head", formula:"psi × 2.3067 = ft of head", note:"Enter one value.",
    fields:[{k:"psi",label:"psi"},{k:"ft",label:"Head ft"}], solve:convSolve({psi:1, ft:PSI2FT}),
    interpret:(m)=>{ if(m.psi==null) return null; if(m.psi<20) return {level:"alert",text:"Under 20 psi — below the minimum distribution pressure most states require."};
      if(m.psi<=80) return {level:"good",text:"20–80 psi — within the normal distribution range."}; return {level:"watch",text:"Over 80 psi — high; can stress mains and fixtures (consider a PRV)."}; }},
  { id:"cycle-time", cat:"Flow & Pressure", domains:["wastewater"], title:"Lift Station Cycle Time", formula:"Storage ÷ (Pump − Inflow) = Cycle (min)", note:"Pump-down time. Enter pump, inflow, storage (gal & gpm).",
    fields:[{k:"pump",label:"Pump gpm"},{k:"inflow",label:"Inflow gpm"},{k:"stor",label:"Storage gal"},{k:"cyc",label:"Cycle min"}],
    solve:(v)=>{ if(v.pump!=null&&v.inflow!=null&&v.stor!=null){ const net=v.pump-v.inflow; return {values:{cyc:net!==0?v.stor/net:NaN},computed:["cyc"],error:""}; }
      return {values:{},computed:[],error:"Enter pump, inflow, and storage."}; }},

  /* ===== Treatment & Filtration (water) ===== */
  { id:"ct-disinfection", cat:"Treatment & Filtration", domains:["water"], title:"CT — Disinfection", formula:"Residual × Contact Time = CT", note:"Enter residual + time. Add required CT for a compliance ratio.",
    fields:[{k:"conc",label:"Residual mg/L"},{k:"time",label:"Contact min"},{k:"ct",label:"CT achieved"},{k:"req",label:"CT required"},{k:"ratio",label:"CT ratio"}],
    solve:(v)=>{ const values={}, computed=[]; let ct=v.ct;
      if(v.conc!=null&&v.time!=null){ ct=v.conc*v.time; values.ct=ct; computed.push("ct"); }
      else if(v.ct==null) return {values:{},computed:[],error:"Enter residual + contact time."};
      if(v.req!=null&&ct!=null){ values.ratio=ct/v.req; computed.push("ratio"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.ratio==null) return null; return m.ratio>=1 ? {level:"good",text:"CT ratio ≥ 1 — the required disinfection CT is met."} : {level:"alert",text:"CT ratio < 1 — required disinfection credit not met. Increase residual or contact time."}; }},
  { id:"filtration-rate", cat:"Treatment & Filtration", domains:["water"], title:"Filtration / Backwash Rate", formula:"Flow gpm ÷ Filter area ft² = gpm/ft²", note:"Enter any two values.",
    fields:[{k:"flow",label:"Flow gpm"},{k:"area",label:"Area ft²"},{k:"rate",label:"Rate gpm/ft²"}],
    solve:(v)=>{ if(v.flow!=null&&v.area!=null) return {values:{rate:v.flow/v.area},computed:["rate"],error:""};
      if(v.flow!=null&&v.rate!=null) return {values:{area:v.flow/v.rate},computed:["area"],error:""};
      if(v.area!=null&&v.rate!=null) return {values:{flow:v.area*v.rate},computed:["flow"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.rate==null) return null; return {level:"info",text:"Typical filtration runs ~2–10 gpm/ft²; backwash ~15–20 gpm/ft². Compare to your filter's design."}; }},

  /* ===== Loading & Mass (wastewater) ===== */
  { id:"loading", cat:"Loading & Mass", domains:["wastewater"], title:"Loading Rate", formula:"Flow MGD × Conc mg/L × 8.34 = lbs/day", note:"Enter any two values.",
    fields:[{k:"mgd",label:"Flow MGD"},{k:"conc",label:"Conc mg/L"},{k:"lbs",label:"Loading lbs/day"}],
    solve:(v)=>{ if(v.mgd!=null&&v.conc!=null) return {values:{lbs:v.mgd*v.conc*D834},computed:["lbs"],error:""};
      if(v.lbs!=null&&v.mgd!=null) return {values:{conc:v.lbs/(v.mgd*D834)},computed:["conc"],error:""};
      if(v.lbs!=null&&v.conc!=null) return {values:{mgd:v.lbs/(v.conc*D834)},computed:["mgd"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"mass", cat:"Loading & Mass", domains:["wastewater"], title:"Mass in Process", formula:"Volume MG × Conc mg/L × 8.34 = lbs", note:"Enter any two values.",
    fields:[{k:"mg",label:"Volume MG"},{k:"conc",label:"Conc mg/L"},{k:"lbs",label:"Mass lbs"}],
    solve:(v)=>{ if(v.mg!=null&&v.conc!=null) return {values:{lbs:v.mg*v.conc*D834},computed:["lbs"],error:""};
      if(v.lbs!=null&&v.mg!=null) return {values:{conc:v.lbs/(v.mg*D834)},computed:["conc"],error:""};
      if(v.lbs!=null&&v.conc!=null) return {values:{mg:v.lbs/(v.conc*D834)},computed:["mg"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"surface-loading", cat:"Loading & Mass", domains:["wastewater"], title:"Surface / Overflow Rate", formula:"Flow gpd ÷ Area ft² = gpd/ft²", note:"Clarifier overflow rate. Enter any two values.",
    fields:[{k:"flow",label:"Flow gpd"},{k:"area",label:"Area ft²"},{k:"rate",label:"Rate gpd/ft²"}],
    solve:(v)=>{ if(v.flow!=null&&v.area!=null) return {values:{rate:v.flow/v.area},computed:["rate"],error:""};
      if(v.flow!=null&&v.rate!=null) return {values:{area:v.flow/v.rate},computed:["area"],error:""};
      if(v.area!=null&&v.rate!=null) return {values:{flow:v.area*v.rate},computed:["flow"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.rate==null) return null; return {level:"info",text:"Typical clarifier overflow ~400–800 gpd/ft² (varies by type and flow) — compare to design."}; }},
  { id:"weir-overflow", cat:"Loading & Mass", domains:["wastewater"], title:"Weir Overflow Rate", formula:"Flow gpd ÷ Weir length ft = gpd/ft", note:"Enter any two values.",
    fields:[{k:"flow",label:"Flow gpd"},{k:"len",label:"Weir length ft"},{k:"rate",label:"Rate gpd/ft"}],
    solve:(v)=>{ if(v.flow!=null&&v.len!=null) return {values:{rate:v.flow/v.len},computed:["rate"],error:""};
      if(v.flow!=null&&v.rate!=null) return {values:{len:v.flow/v.rate},computed:["len"],error:""};
      if(v.len!=null&&v.rate!=null) return {values:{flow:v.len*v.rate},computed:["flow"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"solids-loading", cat:"Loading & Mass", domains:["wastewater"], title:"Solids Loading Rate", formula:"Solids lbs/day ÷ Area ft² = lbs/day/ft²", note:"Enter Flow + MLSS (or solids load) plus area.",
    fields:[{k:"mgd",label:"Flow MGD"},{k:"conc",label:"MLSS mg/L"},{k:"load",label:"Solids lbs/day"},{k:"area",label:"Area ft²"},{k:"rate",label:"lbs/day/ft²"}],
    solve:(v)=>{ const values={}, computed=[]; let load=v.load;
      if(load==null&&v.mgd!=null&&v.conc!=null){ load=v.mgd*v.conc*D834; values.load=load; computed.push("load"); }
      if(load!=null&&v.area!=null&&v.rate==null){ values.rate=load/v.area; computed.push("rate"); }
      else if(load!=null&&v.rate!=null&&v.area==null){ values.area=load/v.rate; computed.push("area"); }
      else if(load==null&&v.area!=null&&v.rate!=null){ values.load=v.area*v.rate; computed.push("load"); }
      else if(load==null) return {values:{},computed:[],error:"Enter Flow + MLSS (or load) plus area."};
      else if(v.area==null&&v.rate==null) return {values:{},computed:[],error:"Add area or a rate."};
      return {values,computed,error:""}; }},
  { id:"organic-loading", cat:"Loading & Mass", domains:["wastewater"], title:"Organic Loading Rate", formula:"BOD lbs/day ÷ Volume (1000 ft³)", note:"Enter Flow + BOD (or load) plus volume in 1000 ft³.",
    fields:[{k:"mgd",label:"Flow MGD"},{k:"bod",label:"BOD mg/L"},{k:"load",label:"BOD lbs/day"},{k:"vol",label:"Volume 1000 ft³"},{k:"rate",label:"lbs/day·1000 ft³"}],
    solve:(v)=>{ const values={}, computed=[]; let load=v.load;
      if(load==null&&v.mgd!=null&&v.bod!=null){ load=v.mgd*v.bod*D834; values.load=load; computed.push("load"); }
      if(load!=null&&v.vol!=null&&v.rate==null){ values.rate=load/v.vol; computed.push("rate"); }
      else if(load!=null&&v.rate!=null&&v.vol==null){ values.vol=load/v.rate; computed.push("vol"); }
      else if(load==null&&v.vol!=null&&v.rate!=null){ values.load=v.vol*v.rate; computed.push("load"); }
      else if(load==null) return {values:{},computed:[],error:"Enter Flow + BOD (or load) plus volume."};
      else if(v.vol==null&&v.rate==null) return {values:{},computed:[],error:"Add volume (1000 ft³) or a rate."};
      return {values,computed,error:""}; }},
  { id:"pop-equiv", cat:"Loading & Mass", domains:["wastewater"], title:"Population Equivalent", formula:"(Flow MGD × BOD × 8.34) ÷ 0.17 = people", note:"Domestic-strength basis. Enter any two values.",
    fields:[{k:"mgd",label:"Flow MGD"},{k:"bod",label:"BOD mg/L"},{k:"pe",label:"Pop. equivalent"}],
    solve:(v)=>{ if(v.mgd!=null&&v.bod!=null) return {values:{pe:(v.mgd*v.bod*D834)/0.17},computed:["pe"],error:""};
      if(v.pe!=null&&v.bod!=null) return {values:{mgd:v.pe*0.17/(v.bod*D834)},computed:["mgd"],error:""};
      if(v.pe!=null&&v.mgd!=null) return {values:{bod:v.pe*0.17/(v.mgd*D834)},computed:["bod"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>({level:"info",text:"Based on 0.17 lb BOD/day per person (domestic strength)."})},

  /* ===== Process Control (wastewater) ===== */
  { id:"fm-ratio", cat:"Process Control", domains:["wastewater"], title:"F / M Ratio", formula:"(BOD × Flow) ÷ (MLVSS × Volume)", note:"Food-to-microorganism ratio. Enter all but one.",
    fields:[{k:"bod",label:"BOD mg/L"},{k:"mgd",label:"Flow MGD"},{k:"mlvss",label:"MLVSS mg/L"},{k:"mg",label:"Aeration MG"},{k:"fm",label:"F/M Ratio"}],
    solve:(v)=>{ const blanks=["bod","mgd","mlvss","mg","fm"].filter(k=>v[k]==null); if(blanks.length!==1) return {values:{},computed:[],error:"Enter all but one value."};
      const b=blanks[0], values={};
      if(b==="fm") values.fm=(v.bod*v.mgd)/(v.mlvss*v.mg); else if(b==="bod") values.bod=v.fm*v.mlvss*v.mg/v.mgd;
      else if(b==="mgd") values.mgd=v.fm*v.mlvss*v.mg/v.bod; else if(b==="mlvss") values.mlvss=(v.bod*v.mgd)/(v.fm*v.mg);
      else if(b==="mg") values.mg=(v.bod*v.mgd)/(v.fm*v.mlvss); return {values,computed:[b],error:""}; },
    interpret:(m)=>{ if(m.fm==null) return null; return {level:"info",text:"Typical: conventional 0.2–0.5; extended aeration 0.05–0.15; high-rate >0.5 lb BOD/lb MLVSS·day."}; }},
  { id:"mcrt", cat:"Process Control", domains:["wastewater"], title:"MCRT / Sludge Age (SRT)", formula:"Aeration TSS lb ÷ (Wasted + Effluent TSS lb/day)", note:"Mean cell residence time. Enter all but one.",
    fields:[{k:"mlss",label:"MLSS mg/L"},{k:"aer",label:"Aeration MG"},{k:"was",label:"WAS mg/L"},{k:"wasq",label:"WAS MGD"},{k:"ess",label:"Effl TSS mg/L"},{k:"essq",label:"Effl MGD"},{k:"mcrt",label:"MCRT days"}],
    solve:(v)=>{ const keys=["mlss","aer","was","wasq","ess","essq","mcrt"]; const blanks=keys.filter(k=>v[k]==null); if(blanks.length!==1) return {values:{},computed:[],error:"Enter all but one value."};
      const b=blanks[0], values={}; const num=(v.mlss!=null&&v.aer!=null)? v.mlss*v.aer*D834 : null;
      const den=(v.was!=null&&v.wasq!=null&&v.ess!=null&&v.essq!=null)? (v.was*v.wasq*D834 + v.ess*v.essq*D834) : null;
      if(b==="mcrt"){ values.mcrt=num/den; } else if(b==="mlss"){ values.mlss=(v.mcrt*den)/(v.aer*D834); } else if(b==="aer"){ values.aer=(v.mcrt*den)/(v.mlss*D834); }
      else { const Dn=num/v.mcrt; if(b==="was") values.was=(Dn - v.ess*v.essq*D834)/(v.wasq*D834);
        else if(b==="wasq") values.wasq=(Dn - v.ess*v.essq*D834)/(v.was*D834); else if(b==="ess") values.ess=(Dn - v.was*v.wasq*D834)/(v.essq*D834);
        else if(b==="essq") values.essq=(Dn - v.was*v.wasq*D834)/(v.ess*D834); }
      return {values,computed:[b],error:""}; },
    interpret:(m)=>{ if(m.mcrt==null) return null; return {level:"info",text:"Typical SRT: conventional ~5–15 days; extended aeration ~20–30. Nitrification usually needs a longer SRT, especially when cold."}; }},
  { id:"ras-rate", cat:"Process Control", domains:["wastewater"], title:"Return (RAS) Rate", formula:"Return flow ÷ Influent flow × 100 = %", note:"Enter any two values.",
    fields:[{k:"ras",label:"Return MGD"},{k:"inf",label:"Influent MGD"},{k:"pct",label:"Return %"}],
    solve:(v)=>{ if(v.ras!=null&&v.inf!=null) return {values:{pct:v.ras/v.inf*100},computed:["pct"],error:""};
      if(v.ras!=null&&v.pct!=null) return {values:{inf:v.ras/(v.pct/100)},computed:["inf"],error:""};
      if(v.inf!=null&&v.pct!=null) return {values:{ras:v.inf*(v.pct/100)},computed:["ras"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"recirculation", cat:"Process Control", domains:["wastewater"], title:"Recirculation Ratio", formula:"Recirculated flow ÷ Influent flow = Ratio", note:"Trickling filter. Enter any two values.",
    fields:[{k:"rec",label:"Recirc MGD"},{k:"inf",label:"Influent MGD"},{k:"ratio",label:"Ratio"}],
    solve:(v)=>{ if(v.rec!=null&&v.inf!=null) return {values:{ratio:v.rec/v.inf},computed:["ratio"],error:""};
      if(v.rec!=null&&v.ratio!=null) return {values:{inf:v.rec/v.ratio},computed:["inf"],error:""};
      if(v.inf!=null&&v.ratio!=null) return {values:{rec:v.inf*v.ratio},computed:["rec"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},

  /* ===== Solids & Settling (wastewater) ===== */
  { id:"svi", cat:"Solids & Settling", domains:["wastewater"], title:"Sludge Volume Index (SVI)", formula:"(SSV mL/L × 1000) ÷ MLSS = SVI\nSDI = 100 ÷ SVI", note:"Enter two of SSV, MLSS, SVI. SSV % auto-converts (×10).",
    fields:[{k:"ssv",label:"SSV mL/L"},{k:"ssvpct",label:"SSV %"},{k:"mlss",label:"MLSS mg/L"},{k:"svi",label:"SVI mL/g"},{k:"sdi",label:"SDI"}],
    solve:(v)=>{ const values={}, computed=[]; let ssv=v.ssv, svi=v.svi, mlss=v.mlss;
      if(ssv==null && v.ssvpct!=null){ ssv=v.ssvpct*10; values.ssv=ssv; computed.push("ssv"); }
      if(ssv!=null && mlss!=null){ svi=ssv*1000/mlss; values.svi=svi; computed.push("svi"); }
      else if(svi!=null && mlss!=null){ ssv=svi*mlss/1000; values.ssv=ssv; if(!computed.includes("ssv"))computed.push("ssv"); }
      else if(svi!=null && ssv!=null){ mlss=ssv*1000/svi; values.mlss=mlss; computed.push("mlss"); }
      else return {values:{},computed:[],error:"Enter two of SSV, MLSS, SVI."};
      if(v.ssvpct==null && ssv!=null){ values.ssvpct=ssv/10; computed.push("ssvpct"); }
      if(svi!=null){ values.sdi=100/svi; if(!computed.includes("sdi"))computed.push("sdi"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.svi==null) return null; if(m.svi<100) return {level:"good",text:"SVI under 100 mL/g — good, well-settling sludge."};
      if(m.svi<=150) return {level:"watch",text:"SVI 100–150 mL/g — fair settling; watch the blanket and trends."}; return {level:"alert",text:"SVI over 150 mL/g — poor settling; a common sign of filamentous bulking."}; }},
  { id:"susp-solids", cat:"Solids & Settling", domains:["wastewater"], title:"Suspended / Total Solids", formula:"Dry solids g × 1,000,000 ÷ Sample mL = mg/L", note:"Enter dry solids + sample, or a concentration.",
    fields:[{k:"dry",label:"Dry solids g"},{k:"ml",label:"Sample mL"},{k:"mgl",label:"Solids mg/L"},{k:"ppm",label:"ppm"},{k:"pct",label:"Percent %"}],
    solve:(v)=>{ let mgl=null,src=null;
      if(v.dry!=null&&v.ml!=null){ mgl=v.dry*1e6/v.ml; src="pair"; } else if(v.mgl!=null){ mgl=v.mgl; src="mgl"; }
      else if(v.ppm!=null){ mgl=v.ppm; src="ppm"; } else if(v.pct!=null){ mgl=v.pct*10000; src="pct"; }
      else return {values:{},computed:[],error:"Enter dry solids + sample mL, or a concentration."};
      const values={mgl,ppm:mgl,pct:mgl/10000}, computed=[]; for(const k of ["mgl","ppm","pct"]) if(src!==k) computed.push(k);
      if(src!=="pair"){ if(v.dry!=null&&v.ml==null&&mgl!==0){ values.ml=v.dry*1e6/mgl; computed.push("ml"); } else if(v.ml!=null&&v.dry==null){ values.dry=mgl*v.ml/1e6; computed.push("dry"); } }
      return {values,computed,error:""}; }},
  { id:"removal", cat:"Solids & Settling", domains:["wastewater"], title:"% Removal / Efficiency", formula:"(In − Out) ÷ In × 100 = % removal", note:"Same units in & out. Enter any two values.",
    fields:[{k:"in",label:"Influent (In)"},{k:"out",label:"Effluent (Out)"},{k:"eff",label:"Removal %"}],
    solve:(v)=>{ if(v.in!=null&&v.out!=null) return {values:{eff:(v.in-v.out)/v.in*100},computed:["eff"],error:""};
      if(v.in!=null&&v.eff!=null) return {values:{out:v.in*(1-v.eff/100)},computed:["out"],error:""};
      if(v.out!=null&&v.eff!=null) return {values:{in:v.out/(1-v.eff/100)},computed:["in"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.eff==null) return null; return m.eff>=85 ? {level:"good",text:"For BOD/TSS, at or above the 85% secondary-treatment minimum (40 CFR 133)."} : {level:"alert",text:"For BOD/TSS, below the 85% secondary-treatment minimum (40 CFR 133) — check the permit."}; }},
  { id:"volatile-solids", cat:"Solids & Settling", domains:["wastewater"], title:"Volatile Solids %", formula:"Volatile ÷ Total × 100 = % VS", note:"Same units. Enter any two values.",
    fields:[{k:"vs",label:"Volatile solids"},{k:"ts",label:"Total solids"},{k:"pct",label:"% Volatile"}],
    solve:(v)=>{ if(v.vs!=null&&v.ts!=null) return {values:{pct:v.vs/v.ts*100},computed:["pct"],error:""};
      if(v.vs!=null&&v.pct!=null) return {values:{ts:v.vs/(v.pct/100)},computed:["ts"],error:""};
      if(v.ts!=null&&v.pct!=null) return {values:{vs:v.ts*(v.pct/100)},computed:["vs"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.pct==null) return null; return {level:"info",text:"Typical municipal sludge runs ~70–80% volatile of total solids."}; }},

  /* ===== Wells & Distribution (water) ===== */
  { id:"drawdown", cat:"Wells & Distribution", domains:["water"], title:"Drawdown / Specific Capacity", formula:"Depth = Airline − (psi × 2.3067)\nSC = Yield ÷ Drawdown", note:"Airline method. Enter airline + psi readings + yield.",
    fields:[{k:"air",label:"Air line ft"},{k:"poff",label:"psi pump OFF"},{k:"pon",label:"psi pump ON"},{k:"gpm",label:"GPM yield"},{k:"stat",label:"Static depth ft"},{k:"pump",label:"Pumping depth ft"},{k:"dd",label:"Drawdown ft"},{k:"sc",label:"GPM/ft (SC)"}],
    solve:(v)=>{ const values={}, computed=[]; let stat=v.stat, pump=v.pump;
      if(v.air!=null&&v.poff!=null){ stat=v.air-(v.poff*PSI2FT); values.stat=stat; computed.push("stat"); }
      if(v.air!=null&&v.pon!=null){ pump=v.air-(v.pon*PSI2FT); values.pump=pump; computed.push("pump"); }
      if(stat==null||pump==null) return {values:{},computed:[],error:"Need static & pumping depth (or airline + psi)."};
      const dd=pump-stat; values.dd=dd; computed.push("dd"); if(v.gpm!=null){ values.sc=dd!==0?v.gpm/dd:NaN; computed.push("sc"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.sc==null) return null; return {level:"info",text:"Track specific capacity over time — a steady decline usually signals well screen or pump fouling."}; }},
  { id:"water-loss", cat:"Wells & Distribution", domains:["water"], title:"Water Loss Summary", formula:"Pumped − Accounted = Lost", note:"Same units. Enter total pumped + the parts you know.",
    fields:[{k:"pump",label:"Total pumped"},{k:"met",label:"Metered"},{k:"unmet",label:"Unmetered"},{k:"leak",label:"Leaked"},{k:"other",label:"Other"},{k:"acct",label:"Accounted"},{k:"lost",label:"Amount lost"},{k:"pct",label:"% lost"}],
    solve:(v)=>{ if(v.pump==null) return {values:{},computed:[],error:"Enter total pumped."};
      const acct=(v.met||0)+(v.unmet||0)+(v.leak||0)+(v.other||0); const lost=v.pump-acct, pct=v.pump!==0?lost/v.pump*100:NaN;
      return {values:{acct,lost,pct},computed:["acct","lost","pct"],error:""}; },
    interpret:(m)=>{ if(m.pct==null||!isFinite(m.pct)) return null; if(m.pct<10) return {level:"good",text:"Under 10% — generally considered low, well-controlled loss."};
      if(m.pct<=20) return {level:"watch",text:"10–20% — worth investigating; check metering accuracy and known leaks."}; return {level:"alert",text:"Over 20% — high loss. Prioritize leak detection and meter testing."}; }},
  { id:"water-use", cat:"Wells & Distribution", domains:["water"], title:"Water Use (gpcd)", formula:"Water produced gpd ÷ Population = gpcd", note:"Gallons per capita per day. Enter any two values.",
    fields:[{k:"gpd",label:"Produced gpd"},{k:"pop",label:"Population"},{k:"gpcd",label:"gpcd"}],
    solve:(v)=>{ if(v.gpd!=null&&v.pop!=null) return {values:{gpcd:v.gpd/v.pop},computed:["gpcd"],error:""};
      if(v.gpd!=null&&v.gpcd!=null) return {values:{pop:v.gpd/v.gpcd},computed:["pop"],error:""};
      if(v.pop!=null&&v.gpcd!=null) return {values:{gpd:v.pop*v.gpcd},computed:["gpd"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.gpcd==null) return null; return {level:"info",text:"U.S. residential average is roughly 80–100 gpcd; whole-system numbers vary with industry and losses."}; }},

  /* ===== Dosage & Chemical ===== */
  { id:"chlorine-dose", cat:"Dosage & Chemical", domains:["water"], title:"Chlorine Dosage", formula:"Demand + Residual = Dose", note:"Enter any two values.",
    fields:[{k:"dose",label:"Dose mg/L"},{k:"demand",label:"Demand mg/L"},{k:"residual",label:"Residual mg/L"}],
    solve:(v)=>{ if(v.demand!=null&&v.residual!=null) return {values:{dose:v.demand+v.residual},computed:["dose"],error:""};
      if(v.dose!=null&&v.residual!=null) return {values:{demand:v.dose-v.residual},computed:["demand"],error:""};
      if(v.dose!=null&&v.demand!=null) return {values:{residual:v.dose-v.demand},computed:["residual"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.residual==null) return null; if(m.residual<0.2) return {level:"watch",text:"Residual under 0.2 mg/L — may be too low to hold protection through distribution."};
      if(m.residual<=4.0) return {level:"good",text:"Residual within the usual 0.2–4.0 mg/L window (free chlorine MRDL = 4.0)."}; return {level:"alert",text:"Residual above 4.0 mg/L — exceeds the free chlorine MRDL."}; }},
  { id:"chem-feed", cat:"Dosage & Chemical", domains:["water","wastewater"], title:"Chemical Feed Rate", formula:"(Dose × Flow MGD × 8.34) ÷ Purity = lbs/day", note:"Enter dose + flow. Purity defaults to 100%.",
    fields:[{k:"dose",label:"Dose mg/L"},{k:"mgd",label:"Flow MGD"},{k:"pur",label:"Purity %"},{k:"feed",label:"Feed lbs/day"}],
    solve:(v)=>{ const p=(v.pur!=null&&v.pur!==0)?v.pur:100, pGiven=v.pur!=null; const K=D834*100/p; const values={}, computed=[];
      if(!pGiven){ values.pur=100; computed.push("pur"); }
      if(v.dose!=null&&v.mgd!=null&&v.feed==null){ values.feed=v.dose*v.mgd*K; computed.push("feed"); }
      else if(v.feed!=null&&v.mgd!=null&&v.dose==null){ values.dose=v.feed/(v.mgd*K); computed.push("dose"); }
      else if(v.feed!=null&&v.dose!=null&&v.mgd==null){ values.mgd=v.feed/(v.dose*K); computed.push("mgd"); }
      else return {values:{},computed:[],error:"Enter two of dose, flow, feed rate."}; return {values,computed,error:""}; }},
  { id:"dilution", cat:"Dosage & Chemical", domains:["water","wastewater"], title:"Dilution (C₁V₁ = C₂V₂)", formula:"C₁ × V₁ = C₂ × V₂", note:"Stock cutting / dilution. Enter any three values.",
    fields:[{k:"c1",label:"C₁ (stock)"},{k:"v1",label:"V₁"},{k:"c2",label:"C₂ (final)"},{k:"v2",label:"V₂"}],
    solve:(v)=>{ if(countNN([v.c1,v.v1,v.c2,v.v2])!==3) return {values:{},computed:[],error:"Enter any three values."};
      if(v.c1==null) return {values:{c1:v.c2*v.v2/v.v1},computed:["c1"],error:""}; if(v.v1==null) return {values:{v1:v.c2*v.v2/v.c1},computed:["v1"],error:""};
      if(v.c2==null) return {values:{c2:v.c1*v.v1/v.v2},computed:["c2"],error:""}; return {values:{v2:v.c1*v.v1/v.c2},computed:["v2"],error:""}; }},
  { id:"concentration", cat:"Dosage & Chemical", domains:["water"], title:"Concentration", formula:"mg/L = ppm × SG · 1 gr/gal = 17.1181 mg/L", note:"Enter one value. SG defaults to 1.00.",
    fields:[{k:"mll",label:"mL/L"},{k:"mgl",label:"mg/L"},{k:"ppm",label:"ppm"},{k:"gr",label:"gr/gal"},{k:"pct",label:"Percent %"},{k:"sg",label:"Specific Gravity"}],
    solve:(v)=>{ const sg=(v.sg!=null&&v.sg!==0)?v.sg:1, sgGiven=v.sg!=null; let mgl=null,src=null;
      if(v.mgl!=null){ mgl=v.mgl; src="mgl"; } else if(v.ppm!=null){ mgl=v.ppm*sg; src="ppm"; } else if(v.mll!=null){ mgl=v.mll*1000*sg; src="mll"; }
      else if(v.gr!=null){ mgl=v.gr*GRGAL; src="gr"; } else if(v.pct!=null){ mgl=v.pct*10000; src="pct"; } else return {values:{},computed:[],error:"Enter one concentration value."};
      const values={mgl,ppm:mgl/sg,mll:mgl/(1000*sg),gr:mgl/GRGAL,pct:mgl/10000,sg}; const computed=[];
      for(const k of ["mll","mgl","ppm","gr","pct"]) if(k!==src) computed.push(k); if(!sgGiven) computed.push("sg"); return {values,computed,error:""}; }},

  /* ===== Pumps & Power ===== */
  { id:"hp", cat:"Pumps & Power", domains:["water","wastewater"], title:"Brake Horsepower & Cost", formula:"hp = (gpm × head × SG) ÷ (3960 × Eff%)", note:"Enter two of gpm/head/hp + efficiency. SG defaults to 1.",
    fields:[{k:"gpm",label:"gpm"},{k:"head",label:"Head ft"},{k:"sg",label:"SG"},{k:"eff",label:"Pump Eff %"},{k:"hp",label:"Brake hp"},{k:"price",label:"Price $/kWh"},{k:"hrs",label:"Hours"},{k:"cost",label:"Total cost $"}],
    solve:(v)=>{ const sg=(v.sg!=null&&v.sg!==0)?v.sg:1; if(v.eff==null||v.eff===0) return {values:{},computed:[],error:"Enter pump efficiency %."};
      const K=3960*(v.eff/100), values={}, computed=[]; if(v.sg==null){ values.sg=1; computed.push("sg"); } let hp=v.hp;
      if(v.gpm!=null&&v.head!=null){ hp=(v.gpm*v.head*sg)/K; values.hp=hp; computed.push("hp"); }
      else if(v.hp!=null&&v.head!=null){ values.gpm=(v.hp*K)/(v.head*sg); computed.push("gpm"); }
      else if(v.hp!=null&&v.gpm!=null){ values.head=(v.hp*K)/(v.gpm*sg); computed.push("head"); }
      else return {values:{},computed:[],error:"Enter two of gpm, head, horsepower."};
      if(hp!=null&&v.price!=null&&v.hrs!=null){ values.cost=hp*KW*v.hrs*v.price; computed.push("cost"); } return {values,computed,error:""}; }},
  { id:"water-hp", cat:"Pumps & Power", domains:["water","wastewater"], title:"Water Horsepower", formula:"whp = (gpm × head) ÷ 3960", note:"Theoretical hp (no losses). Enter two values.",
    fields:[{k:"gpm",label:"gpm"},{k:"head",label:"Head ft"},{k:"whp",label:"Water hp"}],
    solve:(v)=>{ if(v.gpm!=null&&v.head!=null) return {values:{whp:v.gpm*v.head/3960},computed:["whp"],error:""};
      if(v.whp!=null&&v.head!=null) return {values:{gpm:v.whp*3960/v.head},computed:["gpm"],error:""};
      if(v.whp!=null&&v.gpm!=null) return {values:{head:v.whp*3960/v.gpm},computed:["head"],error:""};
      return {values:{},computed:[],error:"Enter two of gpm, head, water hp."}; }},
  { id:"motor-hp", cat:"Pumps & Power", domains:["water","wastewater"], title:"Motor Horsepower", formula:"mhp = (gpm × head) ÷ (3960 × Pump% × Motor%)", note:"Enter gpm, head, pump & motor efficiency.",
    fields:[{k:"gpm",label:"gpm"},{k:"head",label:"Head ft"},{k:"peff",label:"Pump Eff %"},{k:"meff",label:"Motor Eff %"},{k:"mhp",label:"Motor hp"}],
    solve:(v)=>{ if(v.gpm!=null&&v.head!=null&&v.peff!=null&&v.meff!=null){ const mhp=(v.gpm*v.head)/(3960*(v.peff/100)*(v.meff/100)); return {values:{mhp},computed:["mhp"],error:""}; }
      return {values:{},computed:[],error:"Enter gpm, head, pump %, motor %."}; }},
  { id:"wire-to-water", cat:"Pumps & Power", domains:["water","wastewater"], title:"Wire-to-Water Efficiency", formula:"Water hp ÷ Motor hp × 100 = %", note:"Overall pump+motor efficiency. Enter any two.",
    fields:[{k:"whp",label:"Water hp"},{k:"mhp",label:"Motor hp"},{k:"eff",label:"Efficiency %"}],
    solve:(v)=>{ if(v.whp!=null&&v.mhp!=null) return {values:{eff:v.whp/v.mhp*100},computed:["eff"],error:""};
      if(v.whp!=null&&v.eff!=null) return {values:{mhp:v.whp/(v.eff/100)},computed:["mhp"],error:""};
      if(v.mhp!=null&&v.eff!=null) return {values:{whp:v.mhp*(v.eff/100)},computed:["whp"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.eff==null) return null; return {level:"info",text:"Wire-to-water = pump × motor efficiency; ~60–75% is common for healthy stations."}; }},
  { id:"ohms-law", cat:"Pumps & Power", domains:["water","wastewater"], title:"Ohm's Law", formula:"Volts = Amps × Ohms", note:"Enter any two values.",
    fields:[{k:"v",label:"Volts"},{k:"a",label:"Amps"},{k:"r",label:"Ohms"}],
    solve:(v)=>{ if(v.a!=null&&v.r!=null) return {values:{v:v.a*v.r},computed:["v"],error:""};
      if(v.v!=null&&v.r!=null) return {values:{a:v.v/v.r},computed:["a"],error:""};
      if(v.v!=null&&v.a!=null) return {values:{r:v.v/v.a},computed:["r"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"elec-power", cat:"Pumps & Power", domains:["water","wastewater"], title:"Electrical Power", formula:"Watts = Volts × Amps", note:"Enter any two values.",
    fields:[{k:"w",label:"Watts"},{k:"v",label:"Volts"},{k:"a",label:"Amps"}],
    solve:(v)=>{ if(v.v!=null&&v.a!=null) return {values:{w:v.v*v.a},computed:["w"],error:""};
      if(v.w!=null&&v.v!=null) return {values:{a:v.w/v.v},computed:["a"],error:""};
      if(v.w!=null&&v.a!=null) return {values:{v:v.w/v.a},computed:["v"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},

  /* ===== Lab ===== */
  { id:"alkalinity", cat:"Lab", domains:["water","wastewater"], title:"Alkalinity (as CaCO₃)", formula:"(Titrant × Normality × 50,000) ÷ Sample mL", note:"Enter all but one.",
    fields:[{k:"tit",label:"Titrant mL"},{k:"norm",label:"Acid Normality"},{k:"samp",label:"Sample mL"},{k:"alk",label:"Alkalinity mg/L"}],
    solve:(v)=>{ const blanks=["tit","norm","samp","alk"].filter(k=>v[k]==null); if(blanks.length!==1) return {values:{},computed:[],error:"Enter all but one value."};
      const b=blanks[0], values={};
      if(b==="alk") values.alk=(v.tit*v.norm*50000)/v.samp; else if(b==="tit") values.tit=v.alk*v.samp/(v.norm*50000);
      else if(b==="norm") values.norm=v.alk*v.samp/(v.tit*50000); else if(b==="samp") values.samp=(v.tit*v.norm*50000)/v.alk;
      return {values,computed:[b],error:""}; }},
  { id:"hardness", cat:"Lab", domains:["water","wastewater"], title:"Hardness (as CaCO₃)", formula:"(Titrant mL × 1000) ÷ Sample mL", note:"EDTA titration factor 1.0. Enter any two values.",
    fields:[{k:"tit",label:"Titrant mL"},{k:"samp",label:"Sample mL"},{k:"hard",label:"Hardness mg/L"}],
    solve:(v)=>{ if(v.tit!=null&&v.samp!=null) return {values:{hard:v.tit*1000/v.samp},computed:["hard"],error:""};
      if(v.hard!=null&&v.samp!=null) return {values:{tit:v.hard*v.samp/1000},computed:["tit"],error:""};
      if(v.hard!=null&&v.tit!=null) return {values:{samp:v.tit*1000/v.hard},computed:["samp"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"bod", cat:"Lab", domains:["wastewater"], title:"BOD (unseeded)", formula:"(Initial DO − Final DO) × 300 ÷ Sample mL", note:"Enter DO readings + sample volume.",
    fields:[{k:"ido",label:"Initial DO mg/L"},{k:"fdo",label:"Final DO mg/L"},{k:"samp",label:"Sample mL"},{k:"bod",label:"BOD mg/L"}],
    solve:(v)=>{ if(v.ido!=null&&v.fdo!=null&&v.samp!=null) return {values:{bod:(v.ido-v.fdo)*300/v.samp},computed:["bod"],error:""};
      return {values:{},computed:[],error:"Enter initial DO, final DO, and sample mL."}; }},

  /* ===== Conversions ===== */
  converter("conv-length","Conversions","Length","length","ft","m",["in","ft","yd","mi","mm","cm","m","km"]),
  converter("conv-area","Conversions","Area","area","sqft","sqm",["sqin","sqft","sqyd","ac","sqm","ha"]),
  converter("conv-volume","Conversions","Volume","volume","gal","cf",["gal","cf","L","m3","MG","acft","lbH2O"]),
  converter("conv-mass","Conversions","Weight / Mass","mass","lb","kg",["lb","kg","g","ton","galH2O"]),
  converter("conv-flow","Conversions","Flow","flow","gpm","mgd",["gpm","mgd","gpd","cfs","Lps","mlmin"]),
  { id:"specific-gravity", cat:"Conversions", domains:["water","wastewater"], title:"Specific Gravity", formula:"Substance lb/gal ÷ 8.34 = SG", note:"Relative to water. Enter one value.",
    fields:[{k:"lbgal",label:"Weight lb/gal"},{k:"sg",label:"Specific Gravity"}], solve:convSolve({lbgal:D834, sg:1})},
  { id:"temp", cat:"Conversions", domains:["water","wastewater"], title:"Temperature", formula:"(°F − 32) × 5/9 = °C", note:"Enter one value.",
    fields:[{k:"f",label:"Fahrenheit"},{k:"c",label:"Celsius"}],
    solve:(v)=>{ if(v.f!=null) return {values:{c:(v.f-32)*5/9},computed:["c"],error:""}; if(v.c!=null) return {values:{f:v.c*9/5+32},computed:["f"],error:""};
      return {values:{},computed:[],error:"Enter °F or °C."}; }}
];

const CAT_ORDER = ["Geometry & Volume","Flow & Pressure","Treatment & Filtration","Loading & Mass","Process Control","Solids & Settling","Wells & Distribution","Dosage & Chemical","Pumps & Power","Lab","Conversions"];

const grid=document.getElementById('grid'), catSelect=document.getElementById('catSelect'), countEl=document.getElementById('count'), searchEl=document.getElementById('search'), catWrap=document.getElementById('catWrap');
const state={ mode:'water', cat:null, query:'' };

function fmt(x){ if(x==null||!isFinite(x)) return ''; let n=Math.round(x*1e6)/1e6;
  if(Math.abs(n)>=1000) return n.toLocaleString('en-US',{maximumFractionDigits:2}); return String(parseFloat(n.toFixed(4))); }
function rawNum(el){ const raw=el.value.replace(/,/g,'').trim(); if(raw==='') return null; const n=parseFloat(raw); return isFinite(n)?n:null; }
function selFor(inputEl){ return document.getElementById(inputEl.id+'__u'); }
function readField(f, inputEl){ const n=rawNum(inputEl); if(n==null) return null;
  if(f.unit){ const u=selFor(inputEl).value; return n*UNITS[f.unit][u].f; } return n; }
function writeField(f, inputEl, baseVal){ if(f.unit){ const u=selFor(inputEl).value; inputEl.value=fmt(baseVal/UNITS[f.unit][u].f); } else inputEl.value=fmt(baseVal); }
function availableCats(mode){ return CAT_ORDER.filter(c=>calculators.some(k=>k.cat===c && k.domains.includes(mode))); }
function buildSelect(){ const cats=availableCats(state.mode); if(!cats.includes(state.cat)) state.cat=cats[0];
  catSelect.innerHTML=cats.map(c=>'<option value="'+c+'">'+c+'</option>').join(''); catSelect.value=state.cat; }
function setMode(m){ if(state.mode===m) return; state.mode=m; document.documentElement.dataset.mode=m;
  document.querySelectorAll('.mode-btn').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.m===m))); buildSelect(); renderGrid(); }
function visibleItems(){ const q=state.query.trim().toLowerCase();
  if(q) return calculators.filter(c=>c.domains.includes(state.mode) && (c.title+' '+c.note+' '+c.formula+' '+c.cat).toLowerCase().includes(q));
  return calculators.filter(c=>c.cat===state.cat && c.domains.includes(state.mode)); }

function unitSelectHtml(c, f){
  const list=f.units||Object.keys(UNITS[f.unit]);
  const opts=list.map(u=>'<option value="'+u+'"'+(u===f.def?' selected':'')+'>'+UNITS[f.unit][u].label+'</option>').join('');
  return '<select id="'+c.id+'__'+f.k+'__u" data-cur="'+f.def+'" aria-label="unit">'+opts+'</select>';
}
function renderGrid(){
  grid.innerHTML='';
  const searching=state.query.trim()!=='';
  catWrap.style.opacity=searching?'.5':'1';
  const items=visibleItems();
  countEl.innerHTML='<b>'+items.length+'</b> '+(searching?('match'+(items.length===1?'':'es')):('calculator'+(items.length===1?'':'s')));
  if(items.length===0){ const other=state.mode==='water'?'wastewater':'water', otherLbl=other==='water'?'Water':'Wastewater';
    const q=state.query.trim().toLowerCase();
    const otherN=calculators.filter(c=>c.domains.includes(other) && (c.title+' '+c.note+' '+c.formula+' '+c.cat).toLowerCase().includes(q)).length;
    grid.innerHTML='<div class="empty">No matches in '+(state.mode==='water'?'Water':'Wastewater')+' mode.'+(otherN>0?(' Found <b>'+otherN+'</b> in '+otherLbl+' — <button type="button" id="switchMode" class="linkbtn">switch to '+otherLbl+'</button>.'):' Try clearing the search.')+'</div>';
    if(otherN>0) document.getElementById('switchMode').onclick=()=>setMode(other); return; }
  items.forEach(c=>{
    const card=document.createElement('div'); card.className='card';
    let fieldsHtml='';
    c.fields.forEach(f=>{ const inp='<input id="'+c.id+'__'+f.k+'" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="—">';
      const body=f.unit? ('<div class="uf">'+inp+unitSelectHtml(c,f)+'</div>') : inp;
      fieldsHtml+='<div class="field"><label for="'+c.id+'__'+f.k+'">'+f.label+'</label>'+body+'</div>'; });
    card.innerHTML='<div class="card-head">'+(searching?'<span class="card-tag">'+c.cat+'</span>':'')+'<h2>'+c.title+'</h2><div class="formula">'+c.formula+'</div><p class="note">'+c.note+'</p></div>'
      +'<div class="fields '+(c.fields.length<=2?'one-col':'')+'">'+fieldsHtml+'</div>'
      +'<div class="actions"><button class="btn btn-calc" id="calc-'+c.id+'" type="button">Calculate</button><button class="btn btn-clear" id="clear-'+c.id+'" type="button">Clear</button><button class="btn btn-copy" id="copy-'+c.id+'" type="button">Copy</button></div>'
      +'<div class="msg" id="msg-'+c.id+'" aria-live="polite"></div><div class="insight" id="ins-'+c.id+'" aria-live="polite"></div>';
    grid.appendChild(card);

    const inputs=c.fields.map(f=>document.getElementById(c.id+'__'+f.k));
    const run=()=>runCalc(c, inputs);
    document.getElementById('calc-'+c.id).onclick=run;
    document.getElementById('clear-'+c.id).onclick=()=>{ inputs.forEach(i=>{i.value=''; i.classList.remove('computed');});
      document.getElementById('msg-'+c.id).textContent=''; const ins=document.getElementById('ins-'+c.id); ins.className='insight'; ins.textContent=''; };
    document.getElementById('copy-'+c.id).onclick=()=>copyResult(c, inputs);
    c.fields.forEach((f,idx)=>{ const i=inputs[idx];
      i.addEventListener('keydown',e=>{ if(e.key==='Enter') run(); });
      i.addEventListener('input',()=>i.classList.remove('computed'));
      if(f.unit){ const sel=selFor(i); sel.addEventListener('change',()=>{ const oldU=sel.dataset.cur, newU=sel.value;
        const cur=rawNum(i); if(cur!=null){ i.value=fmt(cur*UNITS[f.unit][oldU].f/UNITS[f.unit][newU].f); } sel.dataset.cur=newU; }); }
    });
  });
}
function runCalc(c, inputs){
  const v={}; c.fields.forEach((f,idx)=>{ v[f.k]=readField(f, inputs[idx]); });
  const res=c.solve(v), msg=document.getElementById('msg-'+c.id), insEl=document.getElementById('ins-'+c.id);
  inputs.forEach(i=>i.classList.remove('computed')); msg.className='msg'; insEl.className='insight'; insEl.textContent='';
  if(res.error){ msg.textContent=res.error; return; }
  msg.textContent=''; let bad=false;
  c.fields.forEach((f,idx)=>{ if(f.k in res.values){ const val=res.values[f.k]; if(val==null||!isFinite(val)){ bad=true; return; }
    writeField(f, inputs[idx], val); if(res.computed.includes(f.k)) inputs[idx].classList.add('computed'); } });
  if(bad){ msg.textContent='Check inputs — result is undefined (divide by zero?).'; return; }
  if(c.interpret){ const merged=Object.assign({}, v, res.values); const ins=c.interpret(merged);
    if(ins){ insEl.className='insight show '+ins.level; insEl.innerHTML='<span class="lead">Note</span>'+ins.text; } }
}
function copyResult(c, inputs){
  const parts=[]; c.fields.forEach((f,idx)=>{ const val=inputs[idx].value.trim(); if(val!==''){ let u=''; if(f.unit){ u=' '+UNITS[f.unit][selFor(inputs[idx]).value].label; } parts.push(f.label+': '+val+u); } });
  const msg=document.getElementById('msg-'+c.id);
  if(parts.length===0){ msg.className='msg'; msg.textContent='Nothing to copy yet — run a calculation first.'; return; }
  const text=c.title+' — '+parts.join('; ');
  const done=()=>{ msg.className='msg ok'; msg.textContent='Copied to clipboard.'; setTimeout(()=>{ if(msg.textContent==='Copied to clipboard.'){msg.textContent='';msg.className='msg';} },1800); };
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done,()=>fallbackCopy(text,done)); } else fallbackCopy(text,done);
}
function fallbackCopy(text,done){ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); done(); }catch(e){} document.body.removeChild(ta); }

document.querySelectorAll('.mode-btn').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.m)));
catSelect.addEventListener('change',()=>{ state.cat=catSelect.value; renderGrid(); });
searchEl.addEventListener('input',()=>{ state.query=searchEl.value; renderGrid(); });

/* ---- Lead capture ---- */
const leadModal=document.getElementById('leadModal');
function openLead(){ leadModal.classList.add('show'); document.getElementById('leadForm').style.display='block'; document.getElementById('leadOk').style.display='none'; }
function closeLead(){ leadModal.classList.remove('show'); }
document.getElementById('openSheet').onclick=openLead;
document.getElementById('leadClose').onclick=closeLead;
leadModal.addEventListener('click',e=>{ if(e.target===leadModal) closeLead(); });
document.getElementById('leadSubmit').onclick=()=>{
  const name=document.getElementById('ld-name').value.trim(), email=document.getElementById('ld-email').value.trim(), util=document.getElementById('ld-util').value.trim();
  if(!email||!/.+@.+\..+/.test(email)){ document.getElementById('ld-email').focus(); return; }
  const showOk=(m)=>{ document.getElementById('leadForm').style.display='none'; const ok=document.getElementById('leadOk'); ok.style.display='block'; if(m) document.getElementById('leadOkMsg').textContent=m; };
  if(LEAD.hubspotPortalId && LEAD.hubspotFormId){
    fetch('https://api.hsforms.com/submissions/v3/integration/submit/'+LEAD.hubspotPortalId+'/'+LEAD.hubspotFormId,{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ fields:[{name:'email',value:email},{name:'firstname',value:name},{name:'company',value:util}] })
    }).then(r=>showOk()).catch(()=>showOk('Saved. We\u2019ll be in touch shortly.'));
  } else {
    const body=encodeURIComponent('Please send the operator formula sheet.\n\nName: '+name+'\nUtility: '+util+'\nEmail: '+email);
    window.location.href='mailto:'+LEAD.fallbackEmail+'?subject=Formula%20sheet%20request&body='+body;
    showOk('Opening your email app to finish the request.');
  }
};

/* Initialize the tool FIRST so nothing below can block it. */
buildSelect(); renderGrid();

/* ?embed=app → in-app/gated build: hide marketing CTA + SEO copy, just the tool.
   Guarded: reading location can throw inside a sandboxed iframe; if so, default to the public build. */
try {
  if (new URLSearchParams(window.location.search).get('embed') === 'app') {
    document.body.classList.add('embed-app');
  }
} catch (e) { /* sandboxed location — keep the full public build */ }