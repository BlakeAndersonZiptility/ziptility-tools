/* Solids & Settling calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

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
    interpret:(m)=>{ if(m.svi==null) return null; if(m.svi<100) return {level:"good",text:"SVI under 100 mL/g: good, well-settling sludge."};
      if(m.svi<=150) return {level:"watch",text:"SVI 100–150 mL/g: fair settling; watch the blanket and trends."}; return {level:"alert",text:"SVI over 150 mL/g: poor settling; a common sign of filamentous bulking."}; }},
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
    interpret:(m)=>{ if(m.eff==null) return null; return m.eff>=85 ? {level:"good",text:"For BOD/TSS, at or above the 85% secondary-treatment minimum (40 CFR 133)."} : {level:"alert",text:"For BOD/TSS, below the 85% secondary-treatment minimum (40 CFR 133). Check the permit."}; }},
  { id:"volatile-solids", cat:"Solids & Settling", domains:["wastewater"], title:"Volatile Solids %", formula:"Volatile ÷ Total × 100 = % VS", note:"Same units. Enter any two values.",
    fields:[{k:"vs",label:"Volatile solids"},{k:"ts",label:"Total solids"},{k:"pct",label:"% Volatile"}],
    solve:(v)=>{ if(v.vs!=null&&v.ts!=null) return {values:{pct:v.vs/v.ts*100},computed:["pct"],error:""};
      if(v.vs!=null&&v.pct!=null) return {values:{ts:v.vs/(v.pct/100)},computed:["ts"],error:""};
      if(v.ts!=null&&v.pct!=null) return {values:{vs:v.ts*(v.pct/100)},computed:["vs"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.pct==null) return null; return {level:"info",text:"Typical municipal sludge runs ~70–80% volatile of total solids."}; }}
];
