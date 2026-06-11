/* Treatment & Filtration calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

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
    interpret:(m)=>{ if(m.rate==null) return null; return {level:"info",text:"Typical filtration runs ~2–10 gpm/ft²; backwash ~15–20 gpm/ft². Compare to your filter's design."}; }}
];
