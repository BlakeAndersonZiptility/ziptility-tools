/* Loading & Mass calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

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
    interpret:(m)=>{ if(m.rate==null) return null; return {level:"info",text:"Typical clarifier overflow ~400–800 gpd/ft² (varies by type and flow). Compare to design."}; }},
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
    interpret:(m)=>({level:"info",text:"Based on 0.17 lb BOD/day per person (domestic strength)."}),
    links:[{label:"What is inflow & infiltration?",href:"https://www.ziptility.com/resources/inflow-and-infiltration"}]}
];
