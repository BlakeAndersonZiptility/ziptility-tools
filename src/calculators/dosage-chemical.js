/* Dosage & Chemical calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';
import { convSolve, countNN, converter } from '../calc-helpers.js';

export default [

  { id:"chlorine-dose", cat:"Dosage & Chemical", domains:["water"], title:"Chlorine Dosage", formula:"Demand + Residual = Dose", note:"Enter any two values.",
    fields:[{k:"dose",label:"Dose mg/L"},{k:"demand",label:"Demand mg/L"},{k:"residual",label:"Residual mg/L"}],
    solve:(v)=>{ if(v.demand!=null&&v.residual!=null) return {values:{dose:v.demand+v.residual},computed:["dose"],error:""};
      if(v.dose!=null&&v.residual!=null) return {values:{demand:v.dose-v.residual},computed:["demand"],error:""};
      if(v.dose!=null&&v.demand!=null) return {values:{residual:v.dose-v.demand},computed:["residual"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.residual==null) return null; if(m.residual<0.2) return {level:"watch",text:"Residual under 0.2 mg/L: may be too low to hold protection through distribution."};
      if(m.residual<=4.0) return {level:"good",text:"Residual within the usual 0.2–4.0 mg/L window (free chlorine MRDL = 4.0)."}; return {level:"alert",text:"Residual above 4.0 mg/L: exceeds the free chlorine MRDL."}; }},
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
      for(const k of ["mll","mgl","ppm","gr","pct"]) if(k!==src) computed.push(k); if(!sgGiven) computed.push("sg"); return {values,computed,error:""}; }}
];
