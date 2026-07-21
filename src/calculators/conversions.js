/* Conversions calculators — definitions moved verbatim from v1 calculator.js */
import { C, LBS, LITERS, PSI2FT, GRGAL, KW, PI4, D834 } from '../constants.js';
import { convSolve, countNN, converter } from '../calc-helpers.js';

export default [

  converter("conv-length","Conversions","Length","length","ft","m",["in","ft","yd","mi","mm","cm","m","km"]),
  converter("conv-area","Conversions","Area","area","sqft","sqm",["sqin","sqft","sqyd","ac","sqm","ha"]),
  converter("conv-volume","Conversions","Volume","volume","gal","cf",["gal","cf","L","m3","MG","acft","lbH2O"]),
  converter("conv-mass","Conversions","Weight / Mass","mass","lb","kg",["lb","kg","g","ton","galH2O"]),
  converter("conv-flow","Conversions","Flow","flow","gpm","mgd",["gpm","mgd","gpd","cfs","Lps","mlmin"]),
  Object.assign(converter("conv-power","Conversions","Power","power","hp","kW",["hp","kW","W","btuh"]), {keywords:["kilowatt","kw","watts","horsepower","btu"]}),
  { id:"gallons-acre-feet", cat:"Conversions", domains:["water","wastewater"], title:"Gallons ↔ Acre-Feet", formula:"1 acre-foot = 325,851 gal", note:"Enter one value, handy for annual pumpage / withdrawal reports filed in acre-feet.",
    keywords:["ADWR","acre feet","pumping report","withdrawal"],
    fields:[{k:"gal",label:"Gallons"},{k:"MG",label:"Million gallons"},{k:"acft",label:"Acre-feet"}], solve:convSolve({gal:1, MG:1e-6, acft:1/325851})},
  { id:"specific-gravity", cat:"Conversions", domains:["water","wastewater"], title:"Specific Gravity", formula:"Substance lb/gal ÷ 8.34 = SG", note:"Relative to water. Enter one value.",
    fields:[{k:"lbgal",label:"Weight lb/gal"},{k:"sg",label:"Specific Gravity"}], solve:convSolve({lbgal:D834, sg:1})},
  { id:"temp", cat:"Conversions", domains:["water","wastewater"], title:"Temperature", formula:"(°F − 32) × 5/9 = °C", note:"Enter one value.",
    fields:[{k:"f",label:"Fahrenheit"},{k:"c",label:"Celsius"}],
    solve:(v)=>{ if(v.f!=null) return {values:{c:(v.f-32)*5/9},computed:["c"],error:""}; if(v.c!=null) return {values:{f:v.c*9/5+32},computed:["f"],error:""};
      return {values:{},computed:[],error:"Enter °F or °C."}; }}
];
