/* Treatment & Filtration calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

/* 1 gal/ft²/day in L/m²/hr: 3.78541 L/gal ÷ 0.09290304 m²/ft² ÷ 24 hr */
const LMH_PER_GFD = LITERS/0.09290304/24;

export default [

  { id:"ct-disinfection", cat:"Treatment & Filtration", domains:["water"], title:"CT: Disinfection", formula:"Residual × Contact Time = CT", note:"Enter residual + time. Add required CT for a compliance ratio.",
    fields:[{k:"conc",label:"Residual mg/L"},{k:"time",label:"Contact min"},{k:"ct",label:"CT achieved"},{k:"req",label:"CT required"},{k:"ratio",label:"CT ratio"}],
    solve:(v)=>{ const values={}, computed=[]; let ct=v.ct;
      if(v.conc!=null&&v.time!=null){ ct=v.conc*v.time; values.ct=ct; computed.push("ct"); }
      else if(v.ct==null) return {values:{},computed:[],error:"Enter residual + contact time."};
      if(v.req!=null&&ct!=null){ values.ratio=ct/v.req; computed.push("ratio"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.ratio==null) return null; return m.ratio>=1 ? {level:"good",text:"CT ratio ≥ 1: the required disinfection CT is met."} : {level:"alert",text:"CT ratio < 1: required disinfection credit not met. Increase residual or contact time."}; }},
  { id:"filtration-rate", cat:"Treatment & Filtration", domains:["water"], title:"Filtration / Backwash Rate", formula:"Flow gpm ÷ Filter area ft² = gpm/ft²", note:"Enter any two values.",
    fields:[{k:"flow",label:"Flow gpm"},{k:"area",label:"Area ft²"},{k:"rate",label:"Rate gpm/ft²"}],
    solve:(v)=>{ if(v.flow!=null&&v.area!=null) return {values:{rate:v.flow/v.area},computed:["rate"],error:""};
      if(v.flow!=null&&v.rate!=null) return {values:{area:v.flow/v.rate},computed:["area"],error:""};
      if(v.area!=null&&v.rate!=null) return {values:{flow:v.area*v.rate},computed:["flow"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; },
    interpret:(m)=>{ if(m.rate==null) return null; return {level:"info",text:"Typical filtration runs ~2–10 gpm/ft²; backwash ~15–20 gpm/ft². Compare to your filter's design."}; }},
  { id:"flux", cat:"Treatment & Filtration", domains:["water"], title:"Membrane / Filter Flux", formula:"Flux gfd = Flow gpm ÷ Area ft² × 1440\n1 gfd ≈ 1.698 LMH", note:"Enter flow + area, or a flux (gfd or LMH) to convert / back-solve.",
    keywords:["membrane","lmh","gfd"],
    fields:[{k:"flow",label:"Flow",unit:"flow",def:"gpm",units:["gpm","mgd","gpd","Lps"]},{k:"area",label:"Area",unit:"area",def:"sqft",units:["sqft","sqm"]},{k:"gfd",label:"Flux gfd"},{k:"lmh",label:"Flux LMH"}],
    solve:(v)=>{ let gfd=null, src=null;
      if(v.flow!=null&&v.area!=null){ if(v.area===0) return {values:{},computed:[],error:"Area can't be zero."}; gfd=v.flow/v.area*1440; src="fa"; }
      else if(v.gfd!=null){ gfd=v.gfd; src="gfd"; }
      else if(v.lmh!=null){ gfd=v.lmh/LMH_PER_GFD; src="lmh"; }
      else return {values:{},computed:[],error:"Enter flow + area, or a flux (gfd or LMH)."};
      const values={}, computed=[];
      if(src!=="fa"){ if(v.area!=null&&v.flow==null){ values.flow=gfd*v.area/1440; computed.push("flow"); }
        else if(v.flow!=null&&v.area==null&&gfd!==0){ values.area=v.flow*1440/gfd; computed.push("area"); } }
      if(src!=="gfd"){ values.gfd=gfd; computed.push("gfd"); }
      if(src!=="lmh"){ values.lmh=gfd*LMH_PER_GFD; computed.push("lmh"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.gfd==null) return null; return {level:"info",text:"Low-pressure membranes commonly run ~10–25 gfd; compare to the membrane's design/spec flux."}; }},
  { id:"ufrv", cat:"Treatment & Filtration", domains:["water"], title:"Unit Filter Run Volume (UFRV)", formula:"UFRV gal/ft² = Rate gpm/ft² × Run hours × 60", note:"Gallons filtered per ft² per run. Enter rate (or flow + area) + run hours.",
    keywords:["backwash","filter run"], seeAlso:["filtration-rate"],
    fields:[{k:"flow",label:"Flow",unit:"flow",def:"gpm",units:["gpm","mgd","gpd","Lps"]},{k:"area",label:"Area",unit:"area",def:"sqft",units:["sqft","sqm"]},{k:"rate",label:"Rate gpm/ft²"},{k:"hrs",label:"Run length hr"},{k:"ufrv",label:"UFRV gal/ft²"}],
    solve:(v)=>{ const values={}, computed=[]; let rate=v.rate;
      if(rate==null&&v.flow!=null&&v.area!=null&&v.area!==0){ rate=v.flow/v.area; values.rate=rate; computed.push("rate"); }
      if(rate!=null&&v.hrs!=null){ values.ufrv=rate*v.hrs*60; computed.push("ufrv"); return {values,computed,error:""}; }
      if(v.ufrv!=null&&rate!=null&&rate!==0){ values.hrs=v.ufrv/(rate*60); computed.push("hrs"); return {values,computed,error:""}; }
      if(v.ufrv!=null&&v.hrs!=null&&v.hrs!==0) return {values:{rate:v.ufrv/(v.hrs*60)},computed:["rate"],error:""};
      return {values:{},computed:[],error:"Enter rate (or flow + area) plus run hours or UFRV."}; },
    interpret:(m)=>{ if(m.ufrv==null) return null;
      if(m.ufrv>=10000) return {level:"good",text:"≥10,000 gal/ft²: excellent run volume."};
      if(m.ufrv>=5000) return {level:"good",text:"≥5,000 gal/ft²: generally acceptable. Many plants target 4,000–6,000+; compare to your filter's design."};
      if(m.ufrv>=2000) return {level:"watch",text:"2,000–5,000 gal/ft²: below the usual ≥5,000 benchmark; watch washwater use and run times. Many plants target 4,000–6,000+."};
      return {level:"alert",text:"Under 2,000 gal/ft²: short runs; investigate pretreatment, media condition, or backwash effectiveness."}; }},
  { id:"water-stability", cat:"Treatment & Filtration", domains:["water"], title:"Water Stability (Langelier & Ryznar)", formula:"LSI = pH − pHs · RSI = 2·pHs − pH\npHs = (9.3 + A + B) − (C + D)", note:"Corrosion vs. scaling tendency. Enter pH, temp, TDS, calcium hardness and alkalinity (both as CaCO₃).",
    keywords:["LSI","langelier","ryznar","RSI","corrosion","scaling","saturation index"], seeAlso:["hardness","alkalinity"],
    fields:[{k:"ph",label:"pH"},{k:"tempf",label:"Temp °F"},{k:"tds",label:"TDS mg/L"},{k:"ca",label:"Ca hardness mg/L as CaCO₃"},{k:"alk",label:"Alkalinity mg/L as CaCO₃"},{k:"phs",label:"pHs (saturation)"},{k:"lsi",label:"LSI"},{k:"rsi",label:"Ryznar RSI"}],
    solve:(v)=>{ if(v.ph==null||v.tempf==null||v.tds==null||v.ca==null||v.alk==null) return {values:{},computed:[],error:"Enter pH, temp, TDS, Ca hardness, and alkalinity."};
      if(v.tds<=0||v.ca<=0||v.alk<=0) return {values:{},computed:[],error:"TDS, Ca hardness, and alkalinity must be positive."};
      const tc=(v.tempf-32)*5/9;
      const A=(Math.log10(v.tds)-1)/10, B=-13.12*Math.log10(tc+273)+34.55, Cc=Math.log10(v.ca)-0.4, D=Math.log10(v.alk);
      const phs=(9.3+A+B)-(Cc+D);
      return {values:{phs, lsi:v.ph-phs, rsi:2*phs-v.ph},computed:["phs","lsi","rsi"],error:""}; },
    interpret:(m)=>{ if(m.lsi==null) return null;
      const ry=m.rsi>8.5?" Ryznar agrees: RSI over 8.5 is very aggressive.":(m.rsi<5.5?" Ryznar agrees: RSI under 5.5 means heavy scale.":" Ryznar RSI "+m.rsi.toFixed(1)+" (6.2–6.8 ≈ neutral).");
      if(m.lsi<-0.5) return {level:"alert",text:"LSI under −0.5: corrosive water; it will attack metal pipe and fittings. Consider pH/alkalinity adjustment."+ry};
      if(m.lsi>0.5) return {level:"watch",text:"LSI over +0.5: scale-forming water; expect CaCO₃ deposits in pipes and heaters."+ry};
      return {level:"good",text:"LSI between −0.5 and +0.5: approximately balanced water."+ry}; },
    links:[{label:"Langelier index explained",href:"https://www.lenntech.com/calculators/langelier/index/langelier.htm"}]}
];
