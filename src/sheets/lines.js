/* GENERATED DATA, the single list both unit systems of /tools/formula-sheets render from
   (Blake ruling 2026-09-10, WW-11 + WW-01 step 2). `imp` is the exact text of the live page's
   formula line (server-rendered, unchanged); `si` is the same relationship in SI, authored
   2026-09-16 through the content pipeline and checked by tests/sheets.test.js (no US-customary
   conversion constant or unit word survives into an SI line). A line whose SI form equals its
   US form is unit-invariant. Edit both sides here; the page is a rendering of this list. */
export const SHEETS = [
 {
  "id": "water-treatment",
  "title": "Water treatment formula sheet",
  "blocks": [
   {
    "h": "Conversions and constants",
    "lines": [
     {
      "imp": "1 cubic foot = 7.48 gallons",
      "si": "1 cubic meter = 1,000 liters"
     },
     {
      "imp": "1 gallon of water = 8.34 pounds",
      "si": "1 liter of water = 1 kilogram"
     },
     {
      "imp": "1 MGD = 694 gallons per minute = 1.55 cubic feet per second",
      "si": "1 ML/d = 11.57 L/s = 0.01157 m³/s"
     },
     {
      "imp": "1 cubic foot per second = 448.8 gallons per minute",
      "si": "1 m³/s = 1,000 L/s"
     },
     {
      "imp": "1 day = 1,440 minutes",
      "si": "1 day = 1,440 minutes"
     },
     {
      "imp": "1 psi = 2.31 feet of water; 1 foot of water = 0.433 psi",
      "si": "1 kPa = 0.102 m of water; 1 m of water = 9.81 kPa"
     },
     {
      "imp": "1 percent = 10,000 mg/L; 1 grain per gallon = 17.1 mg/L",
      "si": "1 percent = 10,000 mg/L"
     },
     {
      "imp": "0.785 = pi divided by 4; 8.34 = pounds per gallon",
      "si": "0.785 = pi divided by 4"
     }
    ]
   },
   {
    "h": "Geometry, flow, and detention",
    "lines": [
     {
      "imp": "Area of a circle = 0.785 × diameter squared",
      "si": "Area of a circle = 0.785 × diameter squared"
     },
     {
      "imp": "Volume of a cylinder in gallons = 0.785 × diameter squared × depth × 7.48",
      "si": "Volume of a cylinder in cubic meters = 0.785 × diameter squared × depth"
     },
     {
      "imp": "Volume of a rectangle in gallons = length × width × depth × 7.48",
      "si": "Volume of a rectangle in cubic meters = length × width × depth"
     },
     {
      "imp": "Flow = area × velocity",
      "si": "Flow = area × velocity"
     },
     {
      "imp": "Detention or contact time = volume ÷ flow",
      "si": "Detention or contact time = volume ÷ flow"
     }
    ]
   },
   {
    "h": "Dosage and chemical feed",
    "lines": [
     {
      "imp": "Pounds per day = concentration (mg/L) × flow (MGD) × 8.34",
      "si": "Kilograms per day = concentration (mg/L) × flow (ML/d)"
     },
     {
      "imp": "Chlorine dose = demand + residual",
      "si": "Chlorine dose = demand + residual"
     },
     {
      "imp": "Dry chemical pounds per day = pounds needed ÷ (available percent ÷ 100)",
      "si": "Dry chemical kilograms per day = kilograms needed ÷ (available percent ÷ 100)"
     },
     {
      "imp": "Liquid gallons per day = pounds needed ÷ (strength fraction × weight in pounds per gallon)",
      "si": "Liquid liters per day = kilograms needed ÷ (strength fraction × density in kilograms per liter)"
     },
     {
      "imp": "Blending: concentration one × volume one = concentration two × volume two",
      "si": "Blending: concentration one × volume one = concentration two × volume two"
     }
    ]
   },
   {
    "h": "Sedimentation and filtration",
    "lines": [
     {
      "imp": "Surface overflow rate = flow in gallons per day ÷ surface area in square feet",
      "si": "Surface overflow rate = flow in cubic meters per day ÷ surface area in square meters"
     },
     {
      "imp": "Weir overflow rate = flow in gallons per day ÷ weir length in feet",
      "si": "Weir overflow rate = flow in cubic meters per day ÷ weir length in meters"
     },
     {
      "imp": "Filtration rate = flow in gallons per minute ÷ filter area in square feet",
      "si": "Filtration rate = flow in cubic meters per hour ÷ filter area in square meters"
     },
     {
      "imp": "Percent removal = (influent minus effluent) ÷ influent × 100",
      "si": "Percent removal = (influent minus effluent) ÷ influent × 100"
     }
    ]
   },
   {
    "h": "Disinfection and CT",
    "lines": [
     {
      "imp": "CT = chlorine residual (mg/L) × contact time (minutes)",
      "si": "CT = chlorine residual (mg/L) × contact time (minutes)"
     },
     {
      "imp": "Inactivation ratio = actual CT ÷ required CT; at or above 1.0 the requirement is met",
      "si": "Inactivation ratio = actual CT ÷ required CT; at or above 1.0 the requirement is met"
     }
    ]
   },
   {
    "h": "Wells, pressure, and pumps",
    "lines": [
     {
      "imp": "Drawdown = pumping level minus static level",
      "si": "Drawdown = pumping level minus static level"
     },
     {
      "imp": "Specific capacity = well yield in gallons per minute ÷ drawdown in feet",
      "si": "Specific capacity = well yield in liters per second ÷ drawdown in meters"
     },
     {
      "imp": "Water horsepower = (gallons per minute × head in feet) ÷ 3,960",
      "si": "Water power (kW) = flow (L/s) × head (m) × 9.81 ÷ 1,000"
     },
     {
      "imp": "Brake horsepower = water horsepower ÷ pump efficiency",
      "si": "Brake power (kW) = water power (kW) ÷ pump efficiency"
     },
     {
      "imp": "Motor horsepower = brake horsepower ÷ motor efficiency",
      "si": "Motor power (kW) = brake power (kW) ÷ motor efficiency"
     }
    ]
   }
  ]
 },
 {
  "id": "water-distribution",
  "title": "Water distribution formula sheet",
  "blocks": [
   {
    "h": "Conversions and constants",
    "lines": [
     {
      "imp": "1 cubic foot = 7.48 gallons; 1 gallon of water = 8.34 pounds",
      "si": "1 cubic meter = 1,000 liters; 1 liter of water = 1 kilogram"
     },
     {
      "imp": "1 MGD = 694 gallons per minute = 1.547 cubic feet per second",
      "si": "1 ML/d = 11.57 L/s = 0.01157 m³/s"
     },
     {
      "imp": "1 cubic foot per second = 448.8 gallons per minute",
      "si": "1 m³/s = 1,000 L/s"
     },
     {
      "imp": "1 mile = 5,280 feet; 1 day = 1,440 minutes",
      "si": "1 km = 1,000 m; 1 day = 1,440 minutes"
     },
     {
      "imp": "1 psi = 2.31 feet of water; 1 foot of water = 0.433 psi",
      "si": "1 kPa = 0.102 m of water; 1 m of water = 9.81 kPa"
     },
     {
      "imp": "0.785 = pi divided by 4; 8.34 = pounds per gallon",
      "si": "0.785 = pi divided by 4"
     }
    ]
   },
   {
    "h": "Pressure, head, and storage",
    "lines": [
     {
      "imp": "Pressure to head: feet = psi × 2.31",
      "si": "Pressure to head: meters = kPa × 0.102"
     },
     {
      "imp": "Head to pressure: psi = feet × 0.433",
      "si": "Head to pressure: kPa = meters × 9.81"
     },
     {
      "imp": "Per-capita demand = total use in gallons per day ÷ population",
      "si": "Per-capita demand = total use in liters per day ÷ population"
     },
     {
      "imp": "Water loss percent = (produced minus billed) ÷ produced × 100",
      "si": "Water loss percent = (produced minus billed) ÷ produced × 100"
     },
     {
      "imp": "Tank volume in gallons = 0.785 × diameter squared × height × 7.48",
      "si": "Tank volume in cubic meters = 0.785 × diameter squared × height"
     },
     {
      "imp": "Storage turnover = volume ÷ flow",
      "si": "Storage turnover = volume ÷ flow"
     }
    ]
   },
   {
    "h": "Velocity and flow",
    "lines": [
     {
      "imp": "Flow = area × velocity, where pipe area = 0.785 × diameter squared, diameter in feet",
      "si": "Flow = area × velocity, where pipe area = 0.785 × diameter squared, diameter in meters"
     },
     {
      "imp": "Velocity = flow ÷ area",
      "si": "Velocity = flow ÷ area"
     },
     {
      "imp": "Travel time = distance ÷ velocity",
      "si": "Travel time = distance ÷ velocity"
     }
    ]
   },
   {
    "h": "Wells",
    "lines": [
     {
      "imp": "Drawdown = pumping level minus static level",
      "si": "Drawdown = pumping level minus static level"
     },
     {
      "imp": "Specific capacity = well yield in gallons per minute ÷ drawdown in feet",
      "si": "Specific capacity = well yield in liters per second ÷ drawdown in meters"
     }
    ]
   },
   {
    "h": "Disinfection and dosage",
    "lines": [
     {
      "imp": "Pounds per day = concentration (mg/L) × flow (MGD) × 8.34",
      "si": "Kilograms per day = concentration (mg/L) × flow (ML/d)"
     },
     {
      "imp": "Dose = demand + residual",
      "si": "Dose = demand + residual"
     },
     {
      "imp": "CT = residual (mg/L) × contact time (minutes)",
      "si": "CT = residual (mg/L) × contact time (minutes)"
     }
    ]
   },
   {
    "h": "Pumps and power",
    "lines": [
     {
      "imp": "Water horsepower = (gallons per minute × head) ÷ 3,960",
      "si": "Water power (kW) = flow (L/s) × head (m) × 9.81 ÷ 1,000"
     },
     {
      "imp": "Brake horsepower = water horsepower ÷ pump efficiency",
      "si": "Brake power (kW) = water power (kW) ÷ pump efficiency"
     },
     {
      "imp": "Motor horsepower = brake horsepower ÷ motor efficiency",
      "si": "Motor power (kW) = brake power (kW) ÷ motor efficiency"
     },
     {
      "imp": "Energy cost = horsepower × 0.746 × hours × cost per kilowatt-hour",
      "si": "Energy cost = power (kW) × hours × cost per kilowatt-hour"
     },
     {
      "imp": "Ohm's law: volts = amps × ohms; power = volts × amps",
      "si": "Ohm's law: volts = amps × ohms; power = volts × amps"
     }
    ]
   }
  ]
 },
 {
  "id": "wastewater-treatment",
  "title": "Wastewater treatment formula sheet",
  "blocks": [
   {
    "h": "Conversions and constants",
    "lines": [
     {
      "imp": "1 cubic foot = 7.48 gallons; 1 gallon of water = 8.34 pounds",
      "si": "1 cubic meter = 1,000 liters; 1 liter of water = 1 kilogram"
     },
     {
      "imp": "1 MGD = 694 gallons per minute = 1.547 cubic feet per second",
      "si": "1 ML/d = 11.57 L/s = 0.01157 m³/s"
     },
     {
      "imp": "1 percent = 10,000 mg/L; in water, mg/L equals ppm",
      "si": "1 percent = 10,000 mg/L; in water, mg/L equals ppm"
     },
     {
      "imp": "0.785 = pi divided by 4; 8.34 = pounds per gallon",
      "si": "0.785 = pi divided by 4"
     }
    ]
   },
   {
    "h": "Geometry, flow, and detention",
    "lines": [
     {
      "imp": "Area of a circle = 0.785 × diameter squared",
      "si": "Area of a circle = 0.785 × diameter squared"
     },
     {
      "imp": "Volume of a cylinder in gallons = 0.785 × diameter squared × depth × 7.48",
      "si": "Volume of a cylinder in cubic meters = 0.785 × diameter squared × depth"
     },
     {
      "imp": "Flow = area × velocity; detention time = volume ÷ flow",
      "si": "Flow = area × velocity; detention time = volume ÷ flow"
     }
    ]
   },
   {
    "h": "Pounds, dosage, and loading",
    "lines": [
     {
      "imp": "Pounds per day = concentration (mg/L) × flow (MGD) × 8.34",
      "si": "Kilograms per day = concentration (mg/L) × flow (ML/d)"
     },
     {
      "imp": "Organic loading = BOD (mg/L) × flow (MGD) × 8.34, in pounds per day",
      "si": "Organic loading = BOD (mg/L) × flow (ML/d), in kilograms per day"
     },
     {
      "imp": "Surface overflow rate = flow in gallons per day ÷ surface area in square feet",
      "si": "Surface overflow rate = flow in cubic meters per day ÷ surface area in square meters"
     },
     {
      "imp": "Weir overflow rate = flow in gallons per day ÷ weir length in feet",
      "si": "Weir overflow rate = flow in cubic meters per day ÷ weir length in meters"
     },
     {
      "imp": "Solids loading rate = pounds of solids per day ÷ surface area in square feet",
      "si": "Solids loading rate = kilograms of solids per day ÷ surface area in square meters"
     },
     {
      "imp": "Percent removal = (influent minus effluent) ÷ influent × 100",
      "si": "Percent removal = (influent minus effluent) ÷ influent × 100"
     }
    ],
    "hSI": "Kilograms, dosage, and loading"
   },
   {
    "h": "Activated-sludge process control",
    "lines": [
     {
      "imp": "Food to microorganism ratio = pounds of BOD per day ÷ pounds of volatile solids under aeration",
      "si": "Food to microorganism ratio = kilograms of BOD per day ÷ kilograms of volatile solids under aeration"
     },
     {
      "imp": "Pounds of volatile solids = volatile solids (mg/L) × aeration volume (MG) × 8.34",
      "si": "Kilograms of volatile solids = volatile solids (mg/L) × aeration volume (ML)"
     },
     {
      "imp": "Mean cell residence time = pounds of solids in the system ÷ pounds of solids leaving per day",
      "si": "Mean cell residence time = kilograms of solids in the system ÷ kilograms of solids leaving per day"
     },
     {
      "imp": "Sludge volume index = (30-minute settled mL/L ÷ solids mg/L) × 1,000",
      "si": "Sludge volume index = (30-minute settled mL/L ÷ solids mg/L) × 1,000"
     },
     {
      "imp": "Percent volatile = volatile solids ÷ total solids × 100",
      "si": "Percent volatile = volatile solids ÷ total solids × 100"
     }
    ]
   },
   {
    "h": "Pumps, power, and lab",
    "lines": [
     {
      "imp": "Water horsepower = (gallons per minute × head) ÷ 3,960",
      "si": "Water power (kW) = flow (L/s) × head (m) × 9.81 ÷ 1,000"
     },
     {
      "imp": "Brake horsepower = water horsepower ÷ pump efficiency; motor horsepower = brake horsepower ÷ motor efficiency",
      "si": "Brake power (kW) = water power (kW) ÷ pump efficiency; motor power (kW) = brake power (kW) ÷ motor efficiency"
     },
     {
      "imp": "BOD = (initial DO minus final DO) × (bottle mL ÷ sample mL)",
      "si": "BOD = (initial DO minus final DO) × (bottle mL ÷ sample mL)"
     }
    ]
   }
  ]
 },
 {
  "id": "wastewater-collection",
  "title": "Wastewater collection formula sheet",
  "blocks": [
   {
    "h": "Conversions and constants",
    "lines": [
     {
      "imp": "1 cubic foot = 7.48 gallons; 1 gallon of water = 8.34 pounds",
      "si": "1 cubic meter = 1,000 liters; 1 liter of water = 1 kilogram"
     },
     {
      "imp": "1 MGD = 694 gallons per minute = 1.547 cubic feet per second",
      "si": "1 ML/d = 11.57 L/s = 0.01157 m³/s"
     },
     {
      "imp": "1 cubic foot per second = 448.8 gallons per minute",
      "si": "1 m³/s = 1,000 L/s"
     },
     {
      "imp": "0.785 = pi divided by 4; convert pipe diameter from inches to feet first, where 12 inches = 1 foot",
      "si": "0.785 = pi divided by 4; convert pipe diameter from millimeters to meters first, where 1,000 millimeters = 1 meter"
     }
    ]
   },
   {
    "h": "Slope, velocity, and pipe",
    "lines": [
     {
      "imp": "Slope percent = (drop in feet ÷ run in feet) × 100",
      "si": "Slope percent = (drop in meters ÷ run in meters) × 100"
     },
     {
      "imp": "Flow = area × velocity, where pipe area = 0.785 × diameter squared, diameter in feet",
      "si": "Flow = area × velocity, where pipe area = 0.785 × diameter squared, diameter in meters"
     },
     {
      "imp": "Velocity = flow ÷ area; the self-cleansing target is about 2 feet per second",
      "si": "Velocity = flow ÷ area; the self-cleansing target is about 0.6 meters per second"
     },
     {
      "imp": "Pipe volume in gallons = 0.785 × diameter squared × length × 7.48",
      "si": "Pipe volume in cubic meters = 0.785 × diameter squared × length"
     },
     {
      "imp": "Travel time = length ÷ velocity",
      "si": "Travel time = length ÷ velocity"
     }
    ]
   },
   {
    "h": "Lift stations and wet wells",
    "lines": [
     {
      "imp": "Wet-well volume in gallons = length × width × depth × 7.48",
      "si": "Wet-well volume in cubic meters = length × width × depth"
     },
     {
      "imp": "Pump capacity = volume pumped down ÷ time, with inflow isolated",
      "si": "Pump capacity = volume pumped down ÷ time, with inflow isolated"
     },
     {
      "imp": "Run time = working volume ÷ (pump rate minus inflow); fill time = working volume ÷ inflow",
      "si": "Run time = working volume ÷ (pump rate minus inflow); fill time = working volume ÷ inflow"
     },
     {
      "imp": "Cycle time = run time + fill time",
      "si": "Cycle time = run time + fill time"
     }
    ]
   },
   {
    "h": "Capacity and infiltration",
    "lines": [
     {
      "imp": "Manning's equation: flow in cubic feet per second = (1.49 ÷ roughness) × area × hydraulic radius to the two-thirds power × slope to the one-half power",
      "si": "Manning's equation: flow in cubic meters per second = (1 ÷ roughness) × area × hydraulic radius to the two-thirds power × slope to the one-half power"
     },
     {
      "imp": "Infiltration and inflow = wet-weather flow minus dry-weather flow",
      "si": "Infiltration and inflow = wet-weather flow minus dry-weather flow"
     }
    ]
   },
   {
    "h": "Dosing",
    "lines": [
     {
      "imp": "Pounds per day = concentration (mg/L) × flow (MGD) × 8.34, for odor and corrosion control",
      "si": "Kilograms per day = concentration (mg/L) × flow (ML/d), for odor and corrosion control"
     }
    ]
   }
  ]
 }
];
