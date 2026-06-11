/* Field Disinfection calculators — v2.1, from operator feedback (Jeff).
   The field workflow: structure dimensions → gallons → lbs chlorine →
   gallons of source solution at a given strength. Doses follow AWWA
   C651 (mains, 25 mg/L continuous-feed) and C654 (wells, ~50 mg/L).
   Source-volume math treats the solution as water-weight (8.34 lb/gal) —
   slightly conservative for strong hypochlorite; noted on the cards. */
import { D834, PIPEGAL } from '../constants.js';

const cylGal=(dIn,ft)=>PIPEGAL*dIn*dIn*ft;           // gal from dia(in)² × length/depth(ft)
const lbsCl=(dose,gal)=>dose*(gal/1e6)*D834;          // lbs = mg/L × MG × 8.34
const srcGal=(lbs,strength)=>lbs/(D834*strength/100); // gal of source solution at strength %

export default [

  { id:"well-disinfection", cat:"Field Disinfection", domains:["water"], title:"Well Disinfection (AWWA C654)", formula:"Vol gal = 0.0408 × dia² × depth\nlbs Cl = mg/L × MG × 8.34 · Source gal = lbs ÷ (8.34 × strength%)", note:"Casing dia in inches, water depth in feet. Dose defaults to 50 mg/L (C654 typical).",
    fields:[{k:"dia",label:"Casing dia in"},{k:"depth",label:"Water depth ft"},{k:"vol",label:"Well volume gal"},{k:"dose",label:"Target mg/L"},{k:"strength",label:"Source strength %"},{k:"lbs",label:"Chlorine lbs"},{k:"src",label:"Source to add gal"}],
    solve:(v)=>{ const values={}, computed=[]; let vol=v.vol;
      if(vol==null&&v.dia!=null&&v.depth!=null){ vol=cylGal(v.dia,v.depth); values.vol=vol; computed.push("vol"); }
      if(vol==null) return {values:{},computed:[],error:"Enter casing diameter + water depth (or well volume)."};
      const dose=(v.dose!=null&&v.dose!==0)?v.dose:50; if(v.dose==null){ values.dose=50; computed.push("dose"); }
      const lbs=lbsCl(dose,vol); values.lbs=lbs; computed.push("lbs");
      if(v.strength!=null&&v.strength!==0){ values.src=srcGal(lbs,v.strength); computed.push("src"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.lbs==null) return null; return {level:"info",text:"AWWA C654 commonly targets ~50 mg/L. Mix through the water column, hold per your state's guidance, then pump to waste and pass bac-T before returning to service."}; },
    links:[{label:"AWWA C654 — Disinfection of Wells",href:"https://store.awwa.org/AWWA-C654-21-Disinfection-of-Wells"}]},
  { id:"tank-volume-field", cat:"Field Disinfection", domains:["water","wastewater"], title:"Tank Volume (dia + depth)", formula:"gal = 0.0408 × dia in² × depth ft", note:"Quick field volume from a tape measure. Enter any two values. For tanks measured in feet, see Volume — Cylinder.",
    fields:[{k:"dia",label:"Diameter in"},{k:"depth",label:"Water depth ft"},{k:"gal",label:"Volume gal"}],
    solve:(v)=>{ if(v.dia!=null&&v.depth!=null) return {values:{gal:cylGal(v.dia,v.depth)},computed:["gal"],error:""};
      if(v.gal!=null&&v.dia!=null&&v.dia!==0) return {values:{depth:v.gal/(PIPEGAL*v.dia*v.dia)},computed:["depth"],error:""};
      if(v.gal!=null&&v.depth!=null&&v.depth!==0) return {values:{dia:Math.sqrt(v.gal/(PIPEGAL*v.depth))},computed:["dia"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"tank-chlorination", cat:"Field Disinfection", domains:["water"], title:"Tank Chlorination", formula:"lbs Cl = mg/L × MG × 8.34 · Source gal = lbs ÷ (8.34 × strength%)", note:"Works both ways: desired mg/L → amount to add, or amount added → resulting mg/L. Source gallons assume water-weight solution (slightly conservative for strong hypochlorite).",
    fields:[{k:"dia",label:"Dia in (optional)"},{k:"depth",label:"Depth ft (optional)"},{k:"gal",label:"Tank gallons"},{k:"dose",label:"Chlorine mg/L"},{k:"strength",label:"Source strength %"},{k:"lbs",label:"Chlorine lbs"},{k:"src",label:"Source gal"}],
    solve:(v)=>{ const values={}, computed=[]; let gal=v.gal;
      if(gal==null&&v.dia!=null&&v.depth!=null){ gal=cylGal(v.dia,v.depth); values.gal=gal; computed.push("gal"); }
      if(gal==null||gal===0) return {values:{},computed:[],error:"Enter tank gallons (or diameter + depth)."};
      let lbs=v.lbs; if(lbs==null&&v.src!=null&&v.strength!=null) lbs=v.src*D834*v.strength/100;
      if(v.dose!=null){ const L=lbsCl(v.dose,gal); values.lbs=L; computed.push("lbs");
        if(v.strength!=null&&v.strength!==0){ values.src=srcGal(L,v.strength); computed.push("src"); } }
      else if(lbs!=null){ values.dose=lbs/((gal/1e6)*D834); computed.push("dose"); if(v.lbs==null){ values.lbs=lbs; computed.push("lbs"); } }
      else return {values:{},computed:[],error:"Enter a desired mg/L, or what you added (lbs, or source gal + strength)."};
      return {values,computed,error:""}; }},
  { id:"pipe-volume", cat:"Field Disinfection", domains:["water","wastewater"], title:"Pipe Volume", formula:"gal = 0.0408 × dia in² × length ft", note:"Enter any two values.",
    fields:[{k:"dia",label:"Diameter in"},{k:"len",label:"Length ft"},{k:"gal",label:"Volume gal"}],
    solve:(v)=>{ if(v.dia!=null&&v.len!=null) return {values:{gal:cylGal(v.dia,v.len)},computed:["gal"],error:""};
      if(v.gal!=null&&v.dia!=null&&v.dia!==0) return {values:{len:v.gal/(PIPEGAL*v.dia*v.dia)},computed:["len"],error:""};
      if(v.gal!=null&&v.len!=null&&v.len!==0) return {values:{dia:Math.sqrt(v.gal/(PIPEGAL*v.len))},computed:["dia"],error:""};
      return {values:{},computed:[],error:"Enter any two values."}; }},
  { id:"main-disinfection", cat:"Field Disinfection", domains:["water"], title:"Water-Main Disinfection (AWWA C651)", formula:"Vol gal = 0.0408 × dia² × length\nlbs Cl = mg/L × MG × 8.34 · Source gal = lbs ÷ (8.34 × strength%)", note:"New or repaired mains. Dose defaults to 25 mg/L (C651 continuous-feed, 24-hr hold).",
    fields:[{k:"dia",label:"Pipe dia in"},{k:"len",label:"Length ft"},{k:"vol",label:"Main volume gal"},{k:"dose",label:"Dose mg/L"},{k:"strength",label:"Source strength %"},{k:"lbs",label:"Chlorine lbs"},{k:"src",label:"Source to add gal"}],
    solve:(v)=>{ const values={}, computed=[]; let vol=v.vol;
      if(vol==null&&v.dia!=null&&v.len!=null){ vol=cylGal(v.dia,v.len); values.vol=vol; computed.push("vol"); }
      if(vol==null) return {values:{},computed:[],error:"Enter pipe diameter + length (or main volume)."};
      const dose=(v.dose!=null&&v.dose!==0)?v.dose:25; if(v.dose==null){ values.dose=25; computed.push("dose"); }
      const lbs=lbsCl(dose,vol); values.lbs=lbs; computed.push("lbs");
      if(v.strength!=null&&v.strength!==0){ values.src=srcGal(lbs,v.strength); computed.push("src"); }
      return {values,computed,error:""}; },
    interpret:(m)=>{ if(m.lbs==null) return null; return {level:"info",text:"C651 continuous-feed: hold 25 mg/L free chlorine for 24 hours with ≥10 mg/L remaining at the end, then flush to a safe residual and pass bac-T before service."}; },
    links:[{label:"EPA — Disinfecting new or repaired water mains",href:"https://www.epa.gov/sites/default/files/2015-09/documents/neworrepairedwatermains.pdf"}]}
];
