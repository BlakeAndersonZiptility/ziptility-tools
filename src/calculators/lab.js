/* Lab calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

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
  { id:"conductivity-tds", cat:"Lab", domains:["water","wastewater"], title:"Conductivity ↔ TDS", formula:"TDS mg/L ≈ k × µS/cm", note:"k defaults to 0.64; typical waters run 0.55–0.7 (use your lab's ratio if known). 1 mS/cm = 1,000 µS/cm.",
    keywords:["EC","conductivity","TDS","microsiemens","specific conductance"],
    fields:[{k:"us",label:"Conductivity µS/cm"},{k:"kf",label:"k factor"},{k:"tds",label:"TDS mg/L"}],
    solve:(v)=>{ const k=(v.kf!=null&&v.kf!==0)?v.kf:0.64, values={}, computed=[];
      if(v.kf==null){ values.kf=0.64; computed.push("kf"); }
      if(v.us!=null){ values.tds=v.us*k; computed.push("tds"); return {values,computed,error:""}; }
      if(v.tds!=null){ values.us=v.tds/k; computed.push("us"); return {values,computed,error:""}; }
      return {values:{},computed:[],error:"Enter conductivity or TDS."}; }},
  { id:"do-saturation", cat:"Lab", domains:["water","wastewater"], title:"DO Saturation vs. Temperature", formula:"Cs = 14.652 − 0.41022·T + 0.0079910·T² − 0.000077774·T³  (T °C)", note:"Freshwater at sea level. Enter temp in °F or °C; add a measured DO for % saturation.",
    keywords:["dissolved oxygen","DO","saturation","aeration"], seeAlso:["bod"],
    fields:[{k:"tempf",label:"Temp °F"},{k:"tempc",label:"Temp °C"},{k:"cs",label:"Saturation DO mg/L"},{k:"meas",label:"Measured DO mg/L"},{k:"pct",label:"% of saturation"}],
    solve:(v)=>{ let tc=v.tempc, values={}, computed=[];
      if(tc==null&&v.tempf!=null){ tc=(v.tempf-32)*5/9; values.tempc=tc; computed.push("tempc"); }
      else if(tc!=null&&v.tempf==null){ values.tempf=tc*9/5+32; computed.push("tempf"); }
      if(tc==null) return {values:{},computed:[],error:"Enter water temperature (°F or °C)."};
      const cs=14.652-0.41022*tc+0.0079910*tc*tc-0.000077774*tc*tc*tc;
      values.cs=cs; computed.push("cs");
      if(v.meas!=null&&cs!==0){ values.pct=v.meas/cs*100; computed.push("pct"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.pct!=null) return {level:"info",text:m.pct.toFixed(0)+"% of saturation at this temperature. Warm water holds less oxygen — saturation is ~9.0 mg/L at 20 °C but only ~7.5 at 30 °C."};
      if(m.cs!=null) return {level:"info",text:"Maximum DO this water can hold at this temperature (sea level). Compare your aeration target against it — you can't aerate past saturation."}; return null; }}
];
