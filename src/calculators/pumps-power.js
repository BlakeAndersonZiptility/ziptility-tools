/* Pumps & Power calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';

export default [

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
      return {values:{},computed:[],error:"Enter any two values."}; }}
];
