/* Flow & Pressure calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';
import { convSolve, countNN, converter } from '../calc-helpers.js';

export default [

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
    interpret:(m)=>{ if(m.vel==null) return null; return m.vel>=2 ? {level:"good",text:"At or above 2 ft/s — meets typical self-cleansing velocity for gravity sewers."} : {level:"watch",text:"Below 2 ft/s — under typical self-cleansing velocity; solids may settle."}; },
    links:[{label:"Mapping your sewer collection system",href:"https://www.ziptility.com/blog/sewer-collection-system-mapping-small-utilities"}]},
  { id:"pressure-head", cat:"Flow & Pressure", domains:["water"], title:"Pressure / Head", formula:"psi × 2.3067 = ft of head", note:"Enter one value.",
    fields:[{k:"psi",label:"psi"},{k:"ft",label:"Head ft"}], solve:convSolve({psi:1, ft:PSI2FT}),
    interpret:(m)=>{ if(m.psi==null) return null; if(m.psi<20) return {level:"alert",text:"Under 20 psi — below the minimum distribution pressure most states require."};
      if(m.psi<=80) return {level:"good",text:"20–80 psi — within the normal distribution range."}; return {level:"watch",text:"Over 80 psi — high; can stress mains and fixtures (consider a PRV)."}; }},
  { id:"cycle-time", cat:"Flow & Pressure", domains:["wastewater"], title:"Lift Station Cycle Time", formula:"Storage ÷ (Pump − Inflow) = Cycle (min)", note:"Pump-down time. Enter pump, inflow, storage (gal & gpm).",
    fields:[{k:"pump",label:"Pump gpm"},{k:"inflow",label:"Inflow gpm"},{k:"stor",label:"Storage gal"},{k:"cyc",label:"Cycle min"}],
    solve:(v)=>{ if(v.pump!=null&&v.inflow!=null&&v.stor!=null){ const net=v.pump-v.inflow; return {values:{cyc:net!==0?v.stor/net:NaN},computed:["cyc"],error:""}; }
      return {values:{},computed:[],error:"Enter pump, inflow, and storage."}; }}
];
