/* Solver helpers (verbatim from v1) */
export function convSolve(units){ return (v)=>{ let src=null; for(const k in units){ if(v[k]!=null){ src=k; break; } }
  if(src==null) return {values:{},computed:[],error:"Enter one value."};
  const hub=v[src]/units[src], values={}, computed=[];
  for(const k in units){ values[k]=hub*units[k]; if(k!==src) computed.push(k); } return {values,computed,error:""}; }; }
export const countNN=(arr)=>arr.filter(x=>x!=null).length;
// generic two-way unit converter calc (in/out are base-unit values)
export function converter(id, cat, title, group, defFrom, defTo, unitList){
  return { id, cat, domains:["water","wastewater"], title, formula:"Convert between units", note:"Enter a value and pick units.",
    fields:[{k:"in",label:"From",unit:group,def:defFrom,units:unitList},{k:"out",label:"To",unit:group,def:defTo,units:unitList}],
    solve:(v)=>{ if(v.in!=null) return {values:{out:v.in},computed:["out"],error:""};
      if(v.out!=null) return {values:{in:v.out},computed:["in"],error:""};
      return {values:{},computed:[],error:"Enter a value."}; } };
}
