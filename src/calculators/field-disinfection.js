/* Field Disinfection calculators — v2.1, from operator feedback (Jeff).
   The field workflow: structure dimensions → gallons → lbs chlorine →
   how much product to add. A Liquid/Granular toggle on each card picks
   the product; only that product's fields show, and strength defaults
   to 12.5% (sod-hypo) or 65% (cal-hypo) when left blank. Doses follow
   AWWA C651 (mains, 25 mg/L continuous-feed) and C654 (wells, ~50 mg/L).
   Liquid-source math treats the solution as water-weight (8.34 lb/gal)
   — slightly conservative (over-doses) for strong hypochlorite.
   Solvers work in base units (ft, gal); unit selects convert. */
import { C, PI4, D834 } from '../constants.js';

const cylGal=(dFt,ft)=>PI4*dFt*dFt*ft*C;              // gal from dia(ft)² × length/depth(ft)
const lbsCl=(dose,gal)=>dose*(gal/1e6)*D834;          // lbs = mg/L × MG × 8.34
/* Compute product amounts. With the toggle (v.src) only the active side
   computes and its strength defaults; without it (direct solve calls)
   any side whose strength was entered computes — the pre-toggle rule. */
function addSources(v,values,computed,lbs){
  let liq=v.liqpct, dry=v.drypct;
  if(v.src==="liquid"&&liq==null){ liq=12.5; values.liqpct=12.5; computed.push("liqpct"); }
  if(v.src==="granular"&&dry==null){ dry=65; values.drypct=65; computed.push("drypct"); }
  if(v.src!=="granular"&&liq!=null&&liq!==0){ values.liqgal=lbs/(D834*liq/100); computed.push("liqgal"); }
  if(v.src!=="liquid"&&dry!=null&&dry!==0){ values.drylbs=lbs/(dry/100); computed.push("drylbs"); }
}
const DIA={k:"dia",label:"Diameter",unit:"length",def:"in",units:["in","ft","mm","cm","m"]};
const LIQ=[{k:"liqpct",label:"Liquid strength %",show:"liquid"},{k:"liqgal",label:"Liquid to add",unit:"volume",def:"gal",units:["gal","L"],show:"liquid"}];
const DRY=[{k:"drypct",label:"Granular strength %",show:"granular"},{k:"drylbs",label:"Granular product lbs",show:"granular"}];
const SRC_TOGGLE={k:"src",def:"liquid",options:[{v:"liquid",label:"Liquid (sod-hypo)"},{v:"granular",label:"Granular (cal-hypo)"}]};
const SRC_NOTE="Pick your product above the fields. Strength defaults if left blank: sodium hypochlorite 12.5% (household bleach runs 6–8%), cal-hypo 65%.";

export default [

  { id:"well-disinfection", cat:"Field Disinfection", domains:["water"], title:"Well Disinfection (AWWA C654)", formula:"Vol gal = 0.0408 × dia in² × depth ft\nlbs Cl = mg/L × MG × 8.34 · product = lbs ÷ strength%", note:"Dose defaults to 50 mg/L (C654 typical). "+SRC_NOTE,
    toggle:SRC_TOGGLE, seeAlso:["tank-volume-field"],
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
  { id:"tank-chlorination", cat:"Field Disinfection", domains:["water"], title:"Tank Chlorination", formula:"lbs Cl = mg/L × MG × 8.34 · product = lbs ÷ strength%", note:"Works both ways: target residual → amount to add, or amount added → resulting mg/L. "+SRC_NOTE,
    keywords:["bleach","HTH","shock","hypochlorite","cal-hypo"], seeAlso:["tank-volume-field"], toggle:SRC_TOGGLE,
    fields:[Object.assign({},DIA,{label:"Dia (optional)"}),{k:"depth",label:"Depth (optional)",unit:"length",def:"ft",units:["ft","in","m"]},{k:"gal",label:"Tank volume",unit:"volume",def:"gal",units:["gal","L","m3","MG"]},{k:"dose",label:"Target residual mg/L"},{k:"lbs",label:"Chlorine lbs"}].concat(LIQ,DRY),
    solve:(v)=>{ const values={}, computed=[]; let gal=v.gal;
      if(gal==null&&v.dia!=null&&v.depth!=null){ gal=cylGal(v.dia,v.depth); values.gal=gal; computed.push("gal"); }
      if(gal==null||gal===0) return {values:{},computed:[],error:"Enter tank volume (or diameter + depth)."};
      if(v.dose!=null){ const L=lbsCl(v.dose,gal); values.lbs=L; computed.push("lbs"); addSources(v,values,computed,L); return {values,computed,error:""}; }
      let lbs=v.lbs;
      if(lbs==null&&v.liqgal!=null&&v.src!=="granular"){ const p=(v.liqpct!=null)?v.liqpct:(v.src==="liquid"?12.5:null);
        if(p!=null){ lbs=v.liqgal*D834*p/100; if(v.liqpct==null){ values.liqpct=p; computed.push("liqpct"); } } }
      if(lbs==null&&v.drylbs!=null&&v.src!=="liquid"){ const p=(v.drypct!=null)?v.drypct:(v.src==="granular"?65:null);
        if(p!=null){ lbs=v.drylbs*p/100; if(v.drypct==null){ values.drypct=p; computed.push("drypct"); } } }
      if(lbs==null) return {values:{},computed:[],error:"Enter a target residual — or what you added (product amount, or chlorine lbs)."};
      values.dose=lbs/((gal/1e6)*D834); computed.push("dose"); if(v.lbs==null){ values.lbs=lbs; computed.push("lbs"); }
      return {values,computed,error:""}; }},
  { id:"main-disinfection", cat:"Field Disinfection", domains:["water"], title:"Water-Main Disinfection (AWWA C651)", formula:"Vol gal = 0.0408 × dia in² × length ft\nlbs Cl = mg/L × MG × 8.34 · product = lbs ÷ strength%", note:"New or repaired mains. Dose defaults to 25 mg/L (C651 continuous-feed, 24-hr hold). "+SRC_NOTE,
    toggle:SRC_TOGGLE, seeAlso:["pipe-volume"],
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
