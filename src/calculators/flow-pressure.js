/* Flow & Pressure calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834, Q_HYD } from '../constants.js';
import { convSolve, countNN, converter } from '../calc-helpers.js';

export default [

  { id:"gpm-mgd", cat:"Flow & Pressure", domains:["water","wastewater"], title:"Flow: gpm / MGD", formula:"gpm × 1440 ÷ 1,000,000 = MGD", note:"Enter one value.",
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
    interpret:(m)=>{ if(m.vel==null) return null; return m.vel>=2 ? {level:"good",text:"At or above 2 ft/s: meets typical self-cleansing velocity for gravity sewers."} : {level:"watch",text:"Below 2 ft/s: under typical self-cleansing velocity; solids may settle."}; },
    links:[{label:"Mapping your sewer collection system",href:"https://www.ziptility.com/blog/sewer-collection-system-mapping-small-utilities"}]},
  { id:"pressure-head", cat:"Flow & Pressure", domains:["water"], title:"Pressure / Head", formula:"psi × 2.3067 = ft of head", note:"Enter one value.",
    keywords:["head","psi"], seeAlso:["head-loss"],
    fields:[{k:"psi",label:"psi"},{k:"ft",label:"Head ft"}], solve:convSolve({psi:1, ft:PSI2FT}),
    interpret:(m)=>{ if(m.psi==null) return null; if(m.psi<20) return {level:"alert",text:"Under 20 psi: below the minimum distribution pressure most states require."};
      if(m.psi<=80) return {level:"good",text:"20–80 psi: within the normal distribution range."}; return {level:"watch",text:"Over 80 psi: high; can stress mains and fixtures (consider a PRV)."}; }},
  { id:"cycle-time", cat:"Flow & Pressure", domains:["wastewater"], title:"Lift Station Cycle Time", formula:"Storage ÷ (Pump − Inflow) = Cycle (min)", note:"Pump-down time. Enter pump, inflow, storage (gal & gpm).",
    fields:[{k:"pump",label:"Pump gpm"},{k:"inflow",label:"Inflow gpm"},{k:"stor",label:"Storage gal"},{k:"cyc",label:"Cycle min"}],
    solve:(v)=>{ if(v.pump!=null&&v.inflow!=null&&v.stor!=null){ const net=v.pump-v.inflow; return {values:{cyc:net!==0?v.stor/net:NaN},computed:["cyc"],error:""}; }
      return {values:{},computed:[],error:"Enter pump, inflow, and storage."}; }},
  { id:"hydrant-flow", cat:"Flow & Pressure", domains:["water"], title:"Hydrant Flow Test (NFPA 291)", formula:"Q = 29.83 × C × d in² × √pitot\nQ₂₀ = Q × (S−20)^0.54 ÷ (S−R)^0.54", note:"Nozzle dia defaults to 2.5\", C to 0.90 (smooth outlet; 0.80 square, 0.70 projecting). Add static + residual psi for the NFPA 20-psi rating.",
    keywords:["pitot","fire flow","NFPA","hydrant class","bonnet color"],
    fields:[{k:"d",label:"Nozzle dia",unit:"length",def:"in",units:["in","mm","cm"]},{k:"c",label:"Outlet coeff C"},{k:"pitot",label:"Pitot psi"},{k:"q",label:"Test flow gpm"},{k:"static",label:"Static psi"},{k:"resid",label:"Residual psi"},{k:"q20",label:"Rated gpm @20 psi"}],
    solve:(v)=>{ const din=(v.d!=null&&v.d!==0)?v.d*12:2.5, cc=(v.c!=null&&v.c!==0)?v.c:0.9; let q=v.q;
      if(v.pitot!=null){ if(v.pitot<0) return {values:{},computed:[],error:"Pitot psi can't be negative."}; q=Q_HYD*cc*din*din*Math.sqrt(v.pitot); }
      if(q==null) return {values:{},computed:[],error:"Enter a pitot reading (or an observed test flow)."};
      const values={}, computed=[];
      if(v.pitot!=null){ values.q=q; computed.push("q"); if(v.d==null){ values.d=2.5/12; computed.push("d"); } if(v.c==null){ values.c=0.9; computed.push("c"); } }
      if(v.static!=null&&v.resid!=null){ if(!(v.static>20&&v.static>v.resid)) return {values,computed,error:"Static psi must exceed both residual psi and 20 psi."};
        values.q20=q*Math.pow(v.static-20,0.54)/Math.pow(v.static-v.resid,0.54); computed.push("q20"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ const q=m.q20!=null?m.q20:m.q; if(q==null) return null;
      const tail=m.q20!=null?"":" (Observed at test pressure. Add static & residual psi for the NFPA 20-psi rating.)";
      if(q>=1500) return {level:"good",text:"Class AA: ≥1,500 gpm (light blue bonnet)."+tail};
      if(q>=1000) return {level:"good",text:"Class A: 1,000–1,499 gpm (green bonnet)."+tail};
      if(q>=500) return {level:"watch",text:"Class B: 500–999 gpm (orange bonnet)."+tail};
      return {level:"alert",text:"Class C: under 500 gpm (red bonnet). Check for closed valves, tuberculation, or undersized mains."+tail}; },
    links:[{label:"NFPA 291 hydrant flow testing explained",href:"https://www.mwua.org/nfpa-291-hydrant-flow-testing/"}]},
  { id:"head-loss", cat:"Flow & Pressure", domains:["water","wastewater"], title:"Friction Head Loss (Hazen-Williams)", formula:"hf ft/100ft = 0.2083 × (100/C)^1.852 × gpm^1.852 ÷ dia in^4.8655", note:"C-factor: PVC 150 · new ductile iron 140 (default) · steel 120 · old cast iron 100. Add length for total loss.",
    keywords:["hazen","williams","friction","pressure drop","pipe sizing"], seeAlso:["pressure-head","velocity"],
    fields:[{k:"flow",label:"Flow",unit:"flow",def:"gpm",units:["gpm","mgd","cfs","Lps"]},{k:"dia",label:"Pipe dia",unit:"length",def:"in",units:["in","mm","cm"]},{k:"c",label:"C-factor"},{k:"len",label:"Length",unit:"length",def:"ft",units:["ft","m","mi"]},{k:"hf100",label:"Loss ft/100 ft"},{k:"loss",label:"Total loss ft"},{k:"psi",label:"Total loss psi"},{k:"vel",label:"Velocity ft/s"}],
    solve:(v)=>{ if(v.flow==null||v.dia==null||v.dia===0) return {values:{},computed:[],error:"Enter flow + pipe diameter."};
      const cc=(v.c!=null&&v.c!==0)?v.c:140, din=v.dia*12, values={}, computed=[];
      if(v.c==null){ values.c=140; computed.push("c"); }
      values.hf100=0.2083*Math.pow(100/cc,1.852)*Math.pow(v.flow,1.852)/Math.pow(din,4.8655); computed.push("hf100");
      values.vel=0.4085*v.flow/(din*din); computed.push("vel");
      if(v.len!=null){ values.loss=values.hf100*v.len/100; values.psi=values.loss/PSI2FT; computed.push("loss","psi"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.vel==null) return null;
      if(m.vel>8) return {level:"alert",text:"Velocity over 8 ft/s: very high for distribution; expect heavy friction loss and surge risk. The pipe is likely undersized for this flow."};
      if(m.vel>5) return {level:"watch",text:"Velocity 5–8 ft/s: workable but lossy; typical distribution design targets ~2–5 ft/s."};
      return {level:"info",text:"Velocity in the normal 0–5 ft/s range. Friction loss grows with flow^1.85: doubling flow roughly 3.6×'s the loss."}; },
    links:[{label:"Hazen-Williams formula & C-factors",href:"https://www.engineeringtoolbox.com/hazen-williams-water-d_797.html"}]},
  { id:"sewer-capacity", cat:"Flow & Pressure", domains:["wastewater"], title:"Gravity Sewer Capacity (Manning)", formula:"Q = (1.486/n) × A × R^⅔ × √S   (full circular pipe)", note:"n: PVC 0.010–0.013 (default 0.013) · concrete 0.013–0.015 · clay 0.013. Slope in ft per 100 ft (%).",
    keywords:["manning","slope","gravity sewer","full pipe"], seeAlso:["velocity","cycle-time"],
    fields:[{k:"dia",label:"Pipe dia",unit:"length",def:"in",units:["in","mm","cm"]},{k:"slope",label:"Slope %"},{k:"n",label:"Manning n"},{k:"q",label:"Full-pipe flow",unit:"flow",def:"gpm",units:["gpm","mgd","cfs"]},{k:"vel",label:"Full-pipe velocity ft/s"}],
    solve:(v)=>{ if(v.dia==null||v.dia===0||v.slope==null||v.slope<=0) return {values:{},computed:[],error:"Enter pipe diameter + slope %."};
      const n=(v.n!=null&&v.n!==0)?v.n:0.013, values={}, computed=[];
      if(v.n==null){ values.n=0.013; computed.push("n"); }
      const A=PI4*v.dia*v.dia, R=v.dia/4, qcfs=(1.486/n)*A*Math.pow(R,2/3)*Math.sqrt(v.slope/100);
      values.q=qcfs*448.8312; values.vel=qcfs/A; computed.push("q","vel");
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.vel==null) return null; return m.vel>=2 ? {level:"good",text:"Full-pipe velocity ≥ 2 ft/s: meets typical self-cleansing velocity for gravity sewers."} : {level:"watch",text:"Full-pipe velocity under 2 ft/s: below typical self-cleansing velocity; solids may settle at this slope."}; },
    links:[{label:"Manning's formula for gravity flow",href:"https://www.engineeringtoolbox.com/mannings-formula-gravity-flow-d_800.html"}]},
  { id:"weir-flow", cat:"Flow & Pressure", domains:["water","wastewater"], title:"Weir Flow (V-notch / Rectangular)", formula:"90° V-notch: Q cfs = 2.49 × H^2.48\nRectangular (contracted): Q = 3.33 × (L − 0.2H) × H^1.5", note:"Measure head a few feet upstream of the weir. Fill in the head for your weir type. Only that line computes.",
    keywords:["v-notch","weir","flume","flow measurement"], seeAlso:["gpm-mgd"],
    fields:[{k:"hv",label:"V-notch head",unit:"length",def:"ft",units:["ft","in"]},{k:"qv",label:"V-notch flow",unit:"flow",def:"gpm",units:["gpm","mgd","cfs"]},{k:"crest",label:"Rect crest length",unit:"length",def:"ft",units:["ft","in"]},{k:"hr",label:"Rect head",unit:"length",def:"ft",units:["ft","in"]},{k:"qr",label:"Rect flow",unit:"flow",def:"gpm",units:["gpm","mgd","cfs"]}],
    solve:(v)=>{ const values={}, computed=[];
      if(v.hv!=null&&v.hv>0){ values.qv=2.49*Math.pow(v.hv,2.48)*448.8312; computed.push("qv"); }
      if(v.crest!=null&&v.hr!=null&&v.hr>0){ if(v.crest<=0.2*v.hr) return {values:{},computed:[],error:"Crest length must exceed 0.2 × head."};
        values.qr=3.33*(v.crest-0.2*v.hr)*Math.pow(v.hr,1.5)*448.8312; computed.push("qr"); }
      if(computed.length===0) return {values:{},computed:[],error:"Enter a V-notch head, or crest length + head for a rectangular weir."};
      return {values,computed,error:""}; },
    links:[{label:"Weir flow measurement standards",href:"https://www.engineeringtoolbox.com/weirs-flow-measurement-d_593.html"}]}
];
