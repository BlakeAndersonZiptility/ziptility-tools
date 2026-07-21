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
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"op-cost", cat:"Pumps & Power", domains:["water","wastewater"], title:"Equipment Operating Cost", formula:"$/hr = hp × 0.746 × $/kWh ÷ Motor%", note:"Enter hp + power price. Motor efficiency defaults to 100%; add hours/day for a daily cost.",
    fields:[{k:"hp",label:"Horsepower"},{k:"price",label:"Price $/kWh"},{k:"meff",label:"Motor Eff %"},{k:"hrs",label:"Run hours/day"},{k:"perhr",label:"Cost $/hr"},{k:"perday",label:"Cost $/day"}],
    solve:(v)=>{ if(v.hp==null||v.price==null) return {values:{},computed:[],error:"Enter horsepower and price $/kWh."};
      const eff=(v.meff!=null&&v.meff!==0)?v.meff/100:1, values={}, computed=[];
      if(v.meff==null){ values.meff=100; computed.push("meff"); }
      values.perhr=v.hp*KW/eff*v.price; computed.push("perhr");
      if(v.hrs!=null){ values.perday=values.perhr*v.hrs; computed.push("perday"); }
      return {values,computed,error:""}; }},
  { id:"specific-energy", cat:"Pumps & Power", domains:["water","wastewater"], title:"Pump Specific Energy & Cost", formula:"kWh/MG = kWh ÷ MG pumped · $/MG = kWh/MG × $/kWh", note:"Energy per million gallons. Fill in Pump B to compare two pumps side by side.",
    fields:[{k:"kwh",label:"A: kWh used"},{k:"mg",label:"A: MG pumped"},{k:"price",label:"Price $/kWh"},{k:"kpmg",label:"A: kWh/MG"},{k:"cpmg",label:"A: $/MG"},{k:"kwhB",label:"B: kWh used"},{k:"mgB",label:"B: MG pumped"},{k:"kpmgB",label:"B: kWh/MG"},{k:"cpmgB",label:"B: $/MG"}],
    solve:(v)=>{ const values={}, computed=[];
      const side=(kwh,mg,kk,ck)=>{ if(kwh==null||mg==null||mg===0) return false;
        values[kk]=kwh/mg; computed.push(kk);
        if(v.price!=null){ values[ck]=values[kk]*v.price; computed.push(ck); } return true; };
      const a=side(v.kwh,v.mg,"kpmg","cpmg"), b=side(v.kwhB,v.mgB,"kpmgB","cpmgB");
      if(!a&&!b) return {values:{},computed:[],error:"Enter kWh used + MG pumped (at least for Pump A)."};
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.kpmg==null) return null;
      if(m.kpmgB!=null){ if(m.kpmg===m.kpmgB) return {level:"info",text:"Both pumps use the same energy per million gallons."};
        const w=m.kpmg<m.kpmgB?"A":"B", lo=Math.min(m.kpmg,m.kpmgB), hi=Math.max(m.kpmg,m.kpmgB);
        return {level:"info",text:"Pump "+w+" is more efficient: "+Math.round(lo)+" vs "+Math.round(hi)+" kWh/MG (~"+Math.round((hi-lo)/hi*100)+"% less energy per MG)."}; }
      return {level:"info",text:"Typical systems run on the order of ~1,500 kWh/MG. A rising kWh/MG over time usually means wear or efficiency loss. Trend it."}; },
    links:[{label:"EPA: Energy efficiency for water utilities",href:"https://www.epa.gov/sustainable-water-infrastructure/energy-efficiency-water-utilities"}]},
  { id:"affinity-laws", cat:"Pumps & Power", domains:["water","wastewater"], title:"Pump Affinity Laws", formula:"Flow ∝ speed · Head ∝ speed² · Power ∝ speed³", note:"Speed in rpm or %. Enter both speeds plus whichever of flow/head/power you know at speed 1. Same math applies to impeller diameter trims.",
    keywords:["affinity","vfd","speed change","impeller"], seeAlso:["hp","op-cost"],
    fields:[{k:"s1",label:"Speed 1 (rpm or %)"},{k:"s2",label:"Speed 2 (rpm or %)"},{k:"flow1",label:"Flow @1 gpm"},{k:"head1",label:"Head @1 ft"},{k:"pow1",label:"Power @1 hp"},{k:"flow2",label:"Flow @2 gpm"},{k:"head2",label:"Head @2 ft"},{k:"pow2",label:"Power @2 hp"}],
    solve:(v)=>{ if(v.s1==null||v.s1===0||v.s2==null) return {values:{},computed:[],error:"Enter both speeds."};
      const r=v.s2/v.s1, values={}, computed=[];
      if(v.flow1!=null){ values.flow2=v.flow1*r; computed.push("flow2"); }
      if(v.head1!=null){ values.head2=v.head1*r*r; computed.push("head2"); }
      if(v.pow1!=null){ values.pow2=v.pow1*r*r*r; computed.push("pow2"); }
      if(computed.length===0) return {values:{},computed:[],error:"Enter both speeds plus a flow, head, or power at speed 1."};
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.s1==null||m.s2==null||m.s1===0) return null; const r=m.s2/m.s1, dp=(Math.pow(r,3)-1)*100;
      return {level:"info",text:"Power scales with speed cubed: this "+(r<1?(Math.round((1-r)*100)+"% slow-down cuts power ~"+Math.round(-dp)+"%."):(Math.round((r-1)*100)+"% speed-up raises power ~"+Math.round(dp)+"%."))+" Small VFD trims save real energy."}; },
    links:[{label:"Pump affinity laws",href:"https://www.engineeringtoolbox.com/affinity-laws-d_408.html"}]},
  { id:"npsh", cat:"Pumps & Power", domains:["water","wastewater"], title:"NPSH: Cavitation Check", formula:"NPSHa = Atm head − Static lift − Suction friction − Vapor head", note:"All in ft. Atm head defaults 33.9 (sea level; ~32.8 @1000 ft, ~31.6 @2000 ft elev). Vapor head defaults 0.59 (60 °F). Lift is negative for a flooded suction. Add the pump's NPSHr for the margin.",
    keywords:["cavitation","suction","NPSHa","NPSHr","lift"], seeAlso:["hp","pressure-head"],
    fields:[{k:"atm",label:"Atm head ft"},{k:"lift",label:"Static lift ft"},{k:"fric",label:"Suction friction ft"},{k:"vap",label:"Vapor head ft"},{k:"npsha",label:"NPSH available ft"},{k:"npshr",label:"NPSH required ft"},{k:"margin",label:"Margin ft"}],
    solve:(v)=>{ if(v.lift==null) return {values:{},computed:[],error:"Enter static suction lift (negative if flooded)."};
      const atm=(v.atm!=null&&v.atm!==0)?v.atm:33.9, vap=(v.vap!=null)?v.vap:0.59, fric=(v.fric!=null)?v.fric:0;
      const values={}, computed=[];
      if(v.atm==null){ values.atm=33.9; computed.push("atm"); }
      if(v.vap==null){ values.vap=0.59; computed.push("vap"); }
      if(v.fric==null){ values.fric=0; computed.push("fric"); }
      values.npsha=atm-v.lift-fric-vap; computed.push("npsha");
      if(v.npshr!=null){ values.margin=values.npsha-v.npshr; computed.push("margin"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.margin!=null){ if(m.margin<2) return {level:"alert",text:"Margin under 2 ft: cavitation likely. Reduce lift, shorten/upsize the suction line, or lower the pump."};
        if(m.margin<5) return {level:"watch",text:"Margin 2–5 ft: workable but thin; hot weather or a clogged strainer can erase it."};
        return {level:"good",text:"Margin ≥ 5 ft: comfortable cavitation safety margin."}; }
      if(m.npsha!=null) return {level:"info",text:"Compare to the pump curve's NPSH required at your operating flow. Enter it above for the margin."}; return null; },
    links:[{label:"NPSH explained",href:"https://www.engineeringtoolbox.com/npsh-net-positive-suction-head-d_634.html"}]}
];
