/* Tool 3 of 3 in the manager toolbox - "Energy $ per 1,000 Gallons"
   Spec: master repo, ziptility/web/field-guide/manager-track/tool-specs.md
   ("Tool 3 - /tools/energy-cost"), from ADEQ Block 5 / Session 2.
   Single-session calc with an optional saved prior period (localStorage,
   wired in ui/render.js, guarded per the sandboxed-iframe lesson). */

function num(x) {
  const n = typeof x === 'number' ? x : (x == null || x === '' ? null : parseFloat(x));
  return n != null && isFinite(n) ? n : null;
}
function pctChange(now, prior) {
  if (now == null || prior == null || prior === 0) return null;
  return (now - prior) / prior * 100;
}

export default [
  {
    id: 'energy-cost',
    cat: 'Energy',
    domains: ['water', 'wastewater'],
    title: 'Energy $ per 1,000 Gallons',
    formula: 'kWh / (gallons / 1,000); x $/kWh = $ per 1,000 gal',
    note: 'Energy as a number you manage: cost per 1,000 gallons pumped, plus the three preventive-maintenance triggers if you have a prior period to compare against.',
    fields: [
      { k: 'kwh', label: 'kWh this period' },
      { k: 'gallons', label: 'Gallons pumped this period' },
      { k: 'rate', label: '$ / kWh', def: 0.10 },
      { k: 'kwhPrior', label: 'kWh, prior period (optional)' },
      { k: 'gallonsPrior', label: 'Gallons pumped, prior period (optional)' },
      { k: 'startsPerDay', label: 'Pump starts/day, this period (optional)' },
      { k: 'startsPerDayPrior', label: 'Pump starts/day, prior period (optional)' },
      { k: 'specificCapacity', label: 'Specific capacity, this period, gpm/ft drawdown (optional, wells)' },
      { k: 'specificCapacityPrior', label: 'Specific capacity, prior period (optional)' }
    ],
    solve: (v) => {
      const kwh = num(v.kwh);
      const gallons = num(v.gallons);
      if (kwh == null) return { values: {}, computed: [], error: 'Enter kWh for this period.' };
      if (gallons == null || gallons <= 0) return { values: {}, computed: [], error: 'Enter gallons pumped this period.' };
      const rate = num(v.rate) ?? 0.10;

      const kwhPerKgal = kwh / (gallons / 1000);
      const costPerKgal = kwhPerKgal * rate;

      const kwhPrior = num(v.kwhPrior), gallonsPrior = num(v.gallonsPrior);
      let kwhPerKgalPrior = null, energyPctChange = null, flagEnergyUp = null;
      if (kwhPrior != null && gallonsPrior != null && gallonsPrior > 0) {
        kwhPerKgalPrior = kwhPrior / (gallonsPrior / 1000);
        energyPctChange = pctChange(kwhPerKgal, kwhPerKgalPrior);
        flagEnergyUp = energyPctChange != null && energyPctChange >= 15;
      }

      const startsPerDay = num(v.startsPerDay), startsPerDayPrior = num(v.startsPerDayPrior);
      let startsPctChange = null, flagStartsUp = null;
      if (startsPerDay != null && startsPerDayPrior != null && startsPerDayPrior > 0) {
        startsPctChange = pctChange(startsPerDay, startsPerDayPrior);
        flagStartsUp = startsPctChange != null && startsPctChange >= 25;
      }

      const specificCapacity = num(v.specificCapacity), specificCapacityPrior = num(v.specificCapacityPrior);
      let scPctChange = null, flagCapacityDown = null;
      if (specificCapacity != null && specificCapacityPrior != null && specificCapacityPrior > 0) {
        scPctChange = pctChange(specificCapacity, specificCapacityPrior);
        flagCapacityDown = scPctChange != null && scPctChange <= -20;
      }

      const pmTriggered = [];
      if (flagEnergyUp) pmTriggered.push('kWh/1,000 gal up ' + (Math.round(energyPctChange * 10) / 10) + '% vs prior period (>= 15% trigger)');
      if (flagStartsUp) pmTriggered.push('pump starts/day up ' + (Math.round(startsPctChange * 10) / 10) + '% vs prior period (>= 25% trigger)');
      if (flagCapacityDown) pmTriggered.push('specific capacity down ' + (Math.round(Math.abs(scPctChange) * 10) / 10) + '% vs prior period (>= 20% drop trigger)');

      return {
        values: {
          kwhPerKgal, costPerKgal, kwhPerKgalPrior, energyPctChange, flagEnergyUp,
          startsPctChange, flagStartsUp, scPctChange, flagCapacityDown, pmTriggered,
          rate
        },
        computed: ['kwhPerKgal', 'costPerKgal'],
        error: ''
      };
    },
    interpret: (m) => {
      if (m.kwhPerKgal == null) return null;
      const kpg = Math.round(m.kwhPerKgal * 100) / 100;
      const cpg = Math.round(m.costPerKgal * 100) / 100;
      let text = 'This period: ' + kpg + ' kWh per 1,000 gal, $' + cpg + ' per 1,000 gal.';
      if (m.pmTriggered && m.pmTriggered.length) {
        text += ' PM trigger' + (m.pmTriggered.length === 1 ? '' : 's') + ' tripped: ' + m.pmTriggered.join('; ') + '. Schedule a pump/well check.';
        return { level: 'watch', text };
      }
      if (m.kwhPerKgalPrior != null) {
        // Audit finding C5: say the size of the change, not just "no
        // trigger tripped" (a pass/fail with no felt magnitude).
        const pct = Math.round(m.energyPctChange * 10) / 10;
        const dir = pct > 0 ? 'higher' : (pct < 0 ? 'lower' : 'the same as');
        text += ' That is about ' + Math.abs(pct) + '% ' + dir + ' the prior period. No PM trigger tripped.';
        text += ' Keep tracking each period so a real change stands out early.';
      } else {
        text += ' No prior period to compare yet. Enter this period again next time you run the numbers, and you will see the trend and catch a change early.';
      }
      return { level: 'good', text };
    },
    links: [
      { label: 'Field guide: energy as a number you manage', href: 'https://www.ziptility.com/guides/energy-as-a-number-you-manage' },
      { label: 'See how utilities track this in Ziptility', href: 'https://www.ziptility.com/solutions/financial-tracking' }
    ],
    keywords: ['kwh per 1000 gallons', 'specific energy', 'pump starts', 'specific capacity', 'preventive maintenance', 'energy audit']
  }
];
