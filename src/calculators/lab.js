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
      return {values:{},computed:[],error:"Enter initial DO, final DO, and sample mL."}; }}
];
