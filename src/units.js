/* Unit groups. Every group is anchored to ONE member at f:1 (the anchor);
   f is "how many anchor units one of this unit is". uConv() is the single
   conversion in the app.

   WW-01 (Blake ruling 2026-09-10, shape a): each imperial unit names its
   metric partner (`met`) and each metric unit its imperial partner (`imp`),
   so one global flip can move every field on screen to the other system
   at once. The math never moves: solvers keep computing in US customary
   (imperial canonical), the display converts at the edge. New groups for
   the fields that used to bake a unit into their label: pressure,
   velocity, mass rate, areal and linear loading, temperature (affine). */
export const UNITS = {
  length:{ in:{label:"in",f:1/12,met:"mm"}, ft:{label:"ft",f:1,met:"m"}, yd:{label:"yd",f:3,met:"m"}, mi:{label:"mi",f:5280,met:"km"},
    mm:{label:"mm",f:0.0032808399,imp:"in"}, cm:{label:"cm",f:0.032808399,imp:"in"}, m:{label:"m",f:3.2808399,imp:"ft"}, km:{label:"km",f:3280.8399,imp:"mi"} },
  area:{ sqin:{label:"in²",f:1/144,met:"sqm"}, sqft:{label:"ft²",f:1,met:"sqm"}, sqyd:{label:"yd²",f:9,met:"sqm"}, ac:{label:"acre",f:43560,met:"ha"},
    sqm:{label:"m²",f:10.7639104,imp:"sqft"}, ha:{label:"hectare",f:107639.104,imp:"ac"} },
  volume:{ gal:{label:"gal",f:1,met:"m3"}, cf:{label:"cu ft",f:7.480519,met:"m3"}, L:{label:"L",f:0.26417205,imp:"gal"}, m3:{label:"m³",f:264.17205,imp:"gal"},
    MG:{label:"MG",f:1e6,met:"ML"}, ML:{ext:true,label:"ML",f:264172.05,imp:"MG"}, acft:{label:"ac-ft",f:325851,met:"m3"}, lbH2O:{label:"lb H₂O",f:0.1198266},
    /* WW-02 (Blake ruling 2026-09-10): the small liquid units operators asked for when dosing
       from a jug. US fluid ounce = 1/128 gal; millilitre = 1/1000 L. No cups, by ruling. */
    floz:{label:"fl oz",f:1/128,met:"mL"}, mL:{label:"mL",f:0.26417205/1000,imp:"floz"},
    /* The exam sheet's "1000 ft³" for organic loading. 1000 ft³ = 7,480.5 gal = 28.317 m³. */
    kcf:{ext:true,label:"1000 ft³",f:7480.519,met:"m3"} },
  mass:{ lb:{label:"lb",f:1,met:"kg"}, kg:{label:"kg",f:2.2046226,imp:"lb"}, g:{label:"g",f:0.0022046226,imp:"lb"}, ton:{label:"ton",f:2000,met:"t"}, t:{ext:true,label:"tonne",f:2204.6226,imp:"ton"}, galH2O:{label:"gal H₂O",f:8.3454} },
  flow:{ gpm:{label:"gpm",f:1,met:"Lps"}, mgd:{label:"MGD",f:694.44444,met:"MLd"}, gpd:{label:"gpd",f:1/1440,met:"m3d"}, cfs:{label:"cfs",f:448.8312,met:"m3s"},
    Lps:{label:"L/s",f:15.850323,imp:"gpm"}, Lpm:{ext:true,label:"L/min",f:0.26417205,imp:"gpm"}, mlmin:{label:"mL/min",f:1/3785.411,imp:"gpd"},
    m3h:{ext:true,label:"m³/h",f:4.4028675,imp:"gpm"}, m3d:{ext:true,label:"m³/d",f:0.18345281,imp:"gpd"}, MLd:{ext:true,label:"ML/d",f:183.45281,imp:"mgd"}, m3s:{ext:true,label:"m³/s",f:15850.323,imp:"cfs"} },
  power:{ hp:{label:"hp",f:1,met:"kW"}, kW:{label:"kW",f:1.34102209,imp:"hp"}, W:{label:"W",f:0.00134102209,imp:"hp"}, btuh:{label:"BTU/hr",f:0.000393014779,met:"kW"} },
  pressure:{ psi:{label:"psi",f:1,met:"kPa"}, kPa:{label:"kPa",f:0.14503774,imp:"psi"}, bar:{label:"bar",f:14.503774,imp:"psi"} },
  velocity:{ fps:{label:"ft/s",f:1,met:"mps"}, fpm:{label:"ft/min",f:1/60,met:"mps"}, mps:{label:"m/s",f:3.2808399,imp:"fps"} },
  massrate:{ lbd:{label:"lb/day",f:1,met:"kgd"}, kgd:{label:"kg/day",f:2.2046226,imp:"lbd"} },
  /* Areal hydraulic loading (surface overflow rate, filtration rate). 1 m³/m²·d = 24.5424 gpd/ft². */
  arealflow:{ gpdft2:{label:"gpd/ft²",f:1,met:"m3m2d"}, gpmft2:{label:"gpm/ft²",f:1440,met:"m3m2h"},
    m3m2d:{label:"m³/m²·d",f:24.542388,imp:"gpdft2"}, m3m2h:{label:"m³/m²·h",f:589.01731,imp:"gpmft2"} },
  /* Linear loading (weir overflow). 1 m³/m·d = 80.5196 gpd/ft. */
  linearflow:{ gpdft:{label:"gpd/ft",f:1,met:"m3md"}, m3md:{label:"m³/m·d",f:80.519638,imp:"gpdft"} },
  /* Volume per area (unit filter run volume). 1 m³/m² = 24.5424 gal/ft². */
  arealvolume:{ galft2:{label:"gal/ft²",f:1,met:"m3m2"}, m3m2:{label:"m³/m²",f:24.542388,imp:"galft2"} },
  /* Well specific capacity. 1 L/s per m = 4.8312 gpm per ft. */
  speccap:{ gpmft:{label:"gpm/ft",f:1,met:"Lsm"}, Lsm:{label:"L/s·m",f:4.8312,imp:"gpmft"} },
  /* Solids flux on a clarifier. 1 kg/m²·d = 0.20482 lb/ft²·d. */
  massflux:{ lbdft2:{label:"lb/day·ft²",f:1,met:"kgm2d"}, kgm2d:{label:"kg/m²·d",f:0.20481614,imp:"lbdft2"} },
  /* Organic loading per volume. 1 kg/m³·d = 62.428 lb/day per 1000 ft³. */
  volloading:{ lbdkcf:{label:"lb/day·1000 ft³",f:1,met:"kgm3d"}, kgm3d:{label:"kg/m³·d",f:62.427961,imp:"lbdkcf"} },
  /* Per-capita demand. 1 L/cap·d = 0.26417 gal/cap·d. */
  percap:{ gpcd:{label:"gpcd",f:1,met:"Lcd"}, Lcd:{label:"L/cap·d",f:0.26417205,imp:"gpcd"} },
  /* Pumping energy intensity. 1 kWh/ML = 3.7854 kWh/MG. */
  energyint:{ kwhMG:{label:"kWh/MG",f:1,met:"kwhML"}, kwhML:{label:"kWh/ML",f:3.7854118,imp:"kwhMG"} },
  /* Density. 1 kg/L = 8.3454 lb/gal (water at 8.3454 is the anchor's own value). */
  density:{ lbgal:{label:"lb/gal",f:1,met:"kgL"}, kgL:{label:"kg/L",f:8.3454,imp:"lbgal"} },
  /* Affine: a temperature is not a multiple of the anchor, so these members
     carry toBase/fromBase and uConv() uses them instead of f. */
  temperature:{ F:{label:"°F",f:1,met:"C"}, C:{label:"°C",f:1,imp:"F",toBase:(c)=>c*9/5+32,fromBase:(f)=>(f-32)*5/9} }
};

/* The anchor of a group: the member at f:1 with no affine hooks. */
export function anchorOf(group){
  const g=UNITS[group]; for(const k in g){ if(g[k].f===1 && !g[k].toBase) return k; } return null;
}

export function uConv(value, from, to, group){
  const g=UNITS[group], a=g[from], b=g[to];
  const base = a.toBase ? a.toBase(value) : value*a.f;
  return b.fromBase ? b.fromBase(base) : base/b.f;
}

/* Which system a unit belongs to: imperial units carry `met`, metric ones
   carry `imp`; a unit with neither is neutral and never flips. */
export function systemOf(group, u){ const m=UNITS[group][u]; return m.met ? 'imperial' : (m.imp ? 'metric' : 'neutral'); }

/* The same quantity's unit in the other system, or the unit itself when
   it has no partner (neutral) or is already in the requested system. */
export function partner(group, u, system){
  const m=UNITS[group][u]; if(!m) return u;
  if(system==='metric') return m.met || u;
  return m.imp || u;
}

/* The dropdown list for a field: its declared list (or the whole group)
   plus every partner of every listed unit, so a flip always has somewhere
   to land. Order: declared units first, partners appended in order. */
export function unitList(field, system){
  const g=UNITS[field.unit];
  /* Base list: the field's declared units, or the group as it stood before WW-01
     (members added for the flip carry ext:true and never appear here), so an
     imperial reader sees exactly the options they always had. */
  const base = field.units ? field.units.slice() : Object.keys(g).filter(u=>!g[u].ext);
  const out=[]; const add=(u)=>{ if(u && g[u] && !out.includes(u)) out.push(u); };
  base.forEach(add);
  if(system!=='metric') return out;
  /* Metric reader: every landing partner joins the list so the flip has
     somewhere to go. A list that already offers both systems gains nothing. */
  if(field.met) add(field.met);
  base.forEach(u=>{ add(targetUnit(field, u, 'metric')); add(targetUnit(field, u, 'imperial')); });
  return out;
}

/* The unit a field shows in a system, honouring the field's own defaults:
   `def` is its imperial unit, `met` (optional) its metric unit. Given the
   unit currently selected, return where a flip to `system` lands: the
   partner when the field offers it, else the field's own unit of that
   system nearest in size (a jug dose declared in gal/fl oz/L/mL lands on
   L, never on m³), else the partner itself. */
export function targetUnit(field, currentU, system){
  const g=UNITS[field.unit], declared=field.units||Object.keys(g);
  const sysNow=systemOf(field.unit, currentU);
  if(sysNow===system || sysNow==='neutral') return currentU;
  if(system==='metric' && field.met && currentU===field.def) return field.met;
  if(system==='imperial' && field.met && currentU===field.met) return field.def;
  const p=partner(field.unit, currentU, system);
  if(declared.includes(p)) return p;
  const cands=declared.filter(u=>systemOf(field.unit,u)===system);
  if(!cands.length) return p;
  const lf=Math.log(g[p].f); let best=cands[0], bd=Infinity;
  for(const u of cands){ const d=Math.abs(Math.log(g[u].f)-lf); if(d<bd){ bd=d; best=u; } }
  return best;
}

/* Edge conversions for a field. A field's solver expects values in
   `field.base` when set (the unit its label used to bake in, e.g. mgd),
   else in the group anchor. Existing fields declare no base, so nothing
   they compute changes. */
export function fieldToBase(field, value, u){ return uConv(value, u, field.base || anchorOf(field.unit), field.unit); }
export function fieldFromBase(field, value, u){ return uConv(value, field.base || anchorOf(field.unit), u, field.unit); }
