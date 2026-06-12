/* Field Disinfection calculators — v2.1, from operator feedback (Jeff).
   The field workflow: structure dimensions → gallons → lbs chlorine →
   how much product to add, as liquid (bleach gal) and/or granular (lbs).
   Fill the strength field for the product you use — only that line
   computes. Doses follow AWWA C651 (mains, 25 mg/L continuous-feed) and
   C654 (wells, ~50 mg/L). Liquid-source math treats the solution as
   water-weight (8.34 lb/gal) — slightly conservative for strong
   hypochlorite. Solvers work in base units (ft, gal); the unit selects
   on each field convert for the operator. */
import { C, PI4, D834 } from '../constants.js';

const cylGal=(dFt,ft)=>PI4*dFt*dFt*ft*C;              // gal from dia(ft)² × length/depth(ft)
const lbsCl=(dose,gal)=>dose*(gal/1e6)*D834;          // lbs = mg/L × MG × 8.34
function addSources(v,values,computed,lbs){
  if(v.liqpct!=null&&v.liqpct!==0){ values.liqgal=lbs/(D834*v.liqpct/100); computed.push("liqgal"); }
  if(v.drypct!=null&&v.drypct!==0){ values.drylbs=lbs/(v.drypct/100); computed.push("drylbs"); }
}
const DIA={k:"dia",label:"Diameter",unit:"length",def:"in",units:["in","ft","mm","cm","m"]};
const LIQ=[{k:"liqpct",label:"Liquid strength %"},{k:"liqgal",label:"Liquid to add",unit:"volume",def:"gal",units:["gal","L"]}];
const DRY=[{k:"drypct",label:"Granular strength %"},{k:"drylbs",label:"Granular product lbs"}];
const SRC_NOTE="Fill the strength for your product — liquid bleach ~12.5% (household 6–8%) or granular cal-hypo ~65–68%; only that line computes.";

export default [

  { id:"well-disinfection", cat:"Field Disinfection", domains:["water"], title:"Well Disinfection (AWWA C654)", formula:"Vol gal = 0.0408 × dia in² × depth ft\nlbs Cl = mg/L × MG × 8.34 · product = lbs ÷ strength%", note:"Dose defaults to 50 mg/L (C654 typical). "+SRC_NOTE,
    fields:[Object.assign({},DIA,{label:"Casing dia"}),{k:"depth",label:"Water depth",unit:"length",def:"ft",units:["ft","in","m"]},{k:"vol",label:"Well volume",unit:"volume",def:"gal",units:["gal","L","m3","MG"]},{k:"dose",label:"Target mg/L"},{k:"lbs",label:"Chlorine lbs"}].concat(LIQ,DRY),
    solve:(v)=>{ const values={}, computed=[]; let vol=v.vol;
      if(vol==null&&v.dia!=null&&v.depth!=null){ vol=cylGal(v.dia,v.depth); values.vol=vol; computed.push("vol"); }
      if(vol==null) return {values:{},computed:[],error:"Enter casing diameter + water depth (or well volume)."};
      const dose=(v.dose!=null&&v.dose!==0)?v.dose:50; if(v.dose==null){ values.dose=50; computed.push("dose"); }
      const lbs=lbsCl(dose,vol); values.lbs=lbs; computed.push("lbs");
      addSources(v,values,computed,lbs);
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.lbs==null) return null; return {level:"info",text:"AWWA C654 commonly targets ~50 mg/L. Mix through the water column, hold per your state's guidance, then pump to waste and pass bac-T before returning to service."}; },
    links:[{label:"AWWA C654 — Disinfection of Wells",href:"https://store.awwa.org/AWWA-C654-21-Disinfection-of-Wells"}]},
  { id:"tank-volume-field", cat:"Field Disinfection", domains:["water","wastewater"], title:"Tank Volume (dia + depth)", formula:"gal = 0.0408 × dia in² × depth ft", note:"Quick field volume from a tape measure. Enter any two values.",
    fields:[DIA,{k:"depth",label:"Water depth",unit:"length",def:"ft",units:["ft","in","m"]},{k:"gal",label:"Volume",unit:"volume",def:"gal",units:["gal","L","m3","MG"]}],
    solve:(v)=>{ if(v.dia!=null&&v.depth!=null) return {values:{gal:cylGal(v.dia,v.depth)},computed:["gal"],error:""};
      if(v.gal!=null&&v.dia!=null&&v.dia!==0) return {values:{depth:v.gal/(PI4*v.dia*v.dia*C)},computed:["depth"],error:""};
      if(v.gal!=null&&v.depth!=null&&v.depth!==0) return {values:{dia:Math.sqrt(v.gal/(PI4*v.depth*C))},computed:["dia"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"tank-chlorination", cat:"Field Disinfection", domains:["water"], title:"Tank Chlorination", formula:"lbs Cl = mg/L × MG × 8.34 · product = lbs ÷ strength%", note:"Works both ways: target residual → amount to add, or amount added → resulting mg/L. "+SRC_NOTE,
    keywords:["bleach","HTH","shock","hypochlorite","cal-hypo"], seeAlso:["tank-volume-field"],
    fields:[Object.assign({},DIA,{label:"Dia (optional)"}),{k:"depth",label:"Depth (optional)",unit:"length",def:"ft",units:["ft","in","m"]},{k:"gal",label:"Tank volume",unit:"volume",def:"gal",units:["gal","L","m3","MG"]},{k:"dose",label:"Target residual mg/L"},{k:"lbs",label:"Chlorine lbs"}].concat(LIQ,DRY),
    solve:(v)=>{ const values={}, computed=[]; let gal=v.gal;
      if(gal==null&&v.dia!=null&&v.depth!=null){ gal=cylGal(v.dia,v.depth); values.gal=gal; computed.push("gal"); }
      if(gal==null||gal===0) return {values:{},computed:[],error:"Enter tank volume (or diameter + depth)."};
      if(v.dose!=null){ const L=lbsCl(v.dose,gal); values.lbs=L; computed.push("lbs"); addSources(v,values,computed,L); return {values,computed,error:""}; }
      let lbs=v.lbs;
      if(lbs==null&&v.liqgal!=null&&v.liqpct!=null) lbs=v.liqgal*D834*v.liqpct/100;
      if(lbs==null&&v.drylbs!=null&&v.drypct!=null) lbs=v.drylbs*v.drypct/100;
      if(lbs==null) return {values:{},computed:[],error:"Enter a target residual — or what you added (liquid gal + %, granular lbs + %, or chlorine lbs)."};
      values.dose=lbs/((gal/1e6)*D834); computed.push("dose"); if(v.lbs==null){ values.lbs=lbs; computed.push("lbs"); }
      return {values,computed,error:""}; }},
  { id:"pipe-volume", cat:"Field Disinfection", domains:["water","wastewater"], title:"Pipe Volume", formula:"gal = 0.0408 × dia in² × length ft", note:"Enter any two values.",
    fields:[DIA,{k:"len",label:"Length",unit:"length",def:"ft",units:["ft","m","mi"]},{k:"gal",label:"Volume",unit:"volume",def:"gal",units:["gal","L","m3","MG"]}],
    solve:(v)=>{ if(v.dia!=null&&v.len!=null) return {values:{gal:cylGal(v.dia,v.len)},computed:["gal"],error:""};
      if(v.gal!=null&&v.dia!=null&&v.dia!==0) return {values:{len:v.gal/(PI4*v.dia*v.dia*C)},computed:["len"],error:""};
      if(v.gal!=null&&v.len!=null&&v.len!==0) return {values:{dia:Math.sqrt(v.gal/(PI4*v.len*C))},computed:["dia"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"main-disinfection", cat:"Field Disinfection", domains:["water"], title:"Water-Main Disinfection (AWWA C651)", formula:"Vol gal = 0.0408 × dia in² × length ft\nlbs Cl = mg/L × MG × 8.34 · product = lbs ÷ strength%", note:"New or repaired mains. Dose defaults to 25 mg/L (C651 continuous-feed, 24-hr hold). "+SRC_NOTE,
    fields:[Object.assign({},DIA,{label:"Pipe dia"}),{k:"len",label:"Length",unit:"length",def:"ft",units:["ft","m","mi"]},{k:"vol",label:"Main volume",unit:"volume",def:"gal",units:["gal","L","m3","MG"]},{k:"dose",label:"Dose mg/L"},{k:"lbs",label:"Chlorine lbs"}].concat(LIQ,DRY),
    solve:(v)=>{ const values={}, computed=[]; let vol=v.vol;
      if(vol==null&&v.dia!=null&&v.len!=null){ vol=cylGal(v.dia,v.len); values.vol=vol; computed.push("vol"); }
      if(vol==null) return {values:{},computed:[],error:"Enter pipe diameter + length (or main volume)."};
      const dose=(v.dose!=null&&v.dose!==0)?v.dose:25; if(v.dose==null){ values.dose=25; computed.push("dose"); }
      const lbs=lbsCl(dose,vol); values.lbs=lbs; computed.push("lbs");
      addSources(v,values,computed,lbs);
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.lbs==null) return null; return {level:"info",text:"C651 continuous-feed: hold 25 mg/L free chlorine for 24 hours with ≥10 mg/L remaining at the end, then flush to a safe residual and pass bac-T before service."}; },
    links:[{label:"EPA — Disinfecting new or repaired water mains",href:"https://www.epa.gov/sites/default/files/2015-09/documents/neworrepairedwatermains.pdf"}]}
];
