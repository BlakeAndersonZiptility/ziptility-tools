/* Process Control calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

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
      return {values:{},computed:[],error:"Enter any two values."}; }}
];
