/* Universal unit system (verbatim from v1) */
export const UNITS = {
  length:{ in:{label:"in",f:1/12}, ft:{label:"ft",f:1}, yd:{label:"yd",f:3}, mi:{label:"mi",f:5280},
    mm:{label:"mm",f:0.0032808399}, cm:{label:"cm",f:0.032808399}, m:{label:"m",f:3.2808399}, km:{label:"km",f:3280.8399} },
  area:{ sqin:{label:"in²",f:1/144}, sqft:{label:"ft²",f:1}, sqyd:{label:"yd²",f:9}, ac:{label:"acre",f:43560},
    sqm:{label:"m²",f:10.7639104}, ha:{label:"hectare",f:107639.104} },
  volume:{ gal:{label:"gal",f:1}, cf:{label:"cu ft",f:7.480519}, L:{label:"L",f:0.26417205}, m3:{label:"m³",f:264.17205},
    MG:{label:"MG",f:1e6}, acft:{label:"ac-ft",f:325851}, lbH2O:{label:"lb H₂O",f:0.1198266} },
  mass:{ lb:{label:"lb",f:1}, kg:{label:"kg",f:2.2046226}, g:{label:"g",f:0.0022046226}, ton:{label:"ton",f:2000}, galH2O:{label:"gal H₂O",f:8.3454} },
  flow:{ gpm:{label:"gpm",f:1}, mgd:{label:"MGD",f:694.44444}, gpd:{label:"gpd",f:1/1440}, cfs:{label:"cfs",f:448.8312}, Lps:{label:"L/s",f:15.850323}, mlmin:{label:"mL/min",f:1/3785.411} },
  power:{ hp:{label:"hp",f:1}, kW:{label:"kW",f:1.34102209}, W:{label:"W",f:0.00134102209}, btuh:{label:"BTU/hr",f:0.000393014779} }
};
export function uConv(value, from, to, group){ return value * UNITS[group][from].f / UNITS[group][to].f; }
