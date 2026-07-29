/* Tool 1 of 3 in the manager toolbox - "Repair or Replace?"
   Spec: master repo, ziptility/web/field-guide/manager-track/tool-specs.md
   ("Tool 1 - /tools/repair-or-replace") + the ADEQ Block 7 / Session 1
   source doc reference/water-utility/operator-fundamentals/repair-vs-replacement.md.
   Board-ready wedge: breaks/mile/year, the 2x outlier flag, and the
   break-even point where replacing a main beats patching it forever. */
import { uConv } from '../../units.js';

function num(x) {
  const n = typeof x === 'number' ? x : (x == null || x === '' ? null : parseFloat(x));
  return n != null && isFinite(n) ? n : null;
}

export default [
  {
    id: 'repair-or-replace',
    cat: 'Asset Management',
    domains: ['water', 'wastewater'],
    title: 'Repair or Replace?',
    formula: 'Annual repair cost vs. annualized replacement cost',
    note: 'One water main segment: breaks per mile per year, the outlier flag, and the break-even point where replacing beats patching. One screenshot, one number, one next step.',
    fields: [
      { k: 'segLen', label: 'Segment length', unit: 'length', units: ['ft', 'mi'], def: 'mi', section: 'Outlier screen (optional)' },
      { k: 'years', label: 'Years of break history', section: 'Outlier screen (optional)' },
      { k: 'breaks', label: 'Breaks in that window (count)', section: 'Outlier screen (optional)' },
      { k: 'cohortAvg', label: 'Cohort avg breaks/mi/yr', def: 0.25, section: 'Outlier screen (optional)' },
      { k: 'breaksYr', label: 'Expected breaks/yr (auto-fills from above, overridable)', section: 'Break-even' },
      { k: 'costRepair', label: 'Average cost per repair ($, fully-loaded: crew OT, materials, restoration, water loss)', def: 5000, section: 'Break-even' },
      { k: 'costReplace', label: 'Total replacement cost ($)', section: 'Break-even' },
      { k: 'lifeYrs', label: 'Useful life (years)', def: 50, section: 'Break-even' },
      { k: 'discountRate', label: 'Discount rate % (advanced)', def: 0, section: 'Break-even', advanced: true }
    ],
    toggle: {
      // label is the visible caption render.js prints above the segmented
      // control (audit finding C4: this toggle can override the verdict by
      // itself and had no visible label, only an aria-label).
      k: 'criticality', def: 'Normal', label: 'Criticality',
      options: [{ v: 'Normal', label: 'Normal' }, { v: 'High', label: 'High' }, { v: 'Critical', label: 'Critical' }]
    },
    solve: (v) => {
      const years = num(v.years);
      const breaks = num(v.breaks);
      let breaksYr = num(v.breaksYr);
      if (breaksYr == null) {
        if (years != null && years > 0 && breaks != null) breaksYr = breaks / years;
      }
      if (breaksYr == null) {
        return { values: {}, computed: [], error: 'Enter expected breaks/yr, or breaks and years of history.' };
      }

      const costRepair = num(v.costRepair) ?? 5000;
      const costReplace = num(v.costReplace);
      if (costReplace == null || costReplace <= 0) {
        return { values: {}, computed: [], error: 'Enter the total replacement cost.' };
      }
      const lifeYrs = num(v.lifeYrs) ?? 50;
      if (lifeYrs <= 0) {
        return { values: {}, computed: [], error: 'Useful life must be greater than zero.' };
      }
      const discountRate = num(v.discountRate) ?? 0;
      const cohortAvg = num(v.cohortAvg) ?? 0.25;
      const criticality = v.criticality || 'Normal';

      const annualRepair = breaksYr * costRepair;

      let annualizedReplace;
      if (discountRate > 0) {
        // Capital-recovery form when a discount rate is supplied.
        const d = discountRate / 100;
        const growth = Math.pow(1 + d, lifeYrs);
        annualizedReplace = (growth - 1) !== 0 ? costReplace * (d * growth) / (growth - 1) : costReplace / lifeYrs;
      } else {
        annualizedReplace = costReplace / lifeYrs;
      }

      const breakEvenN = costRepair > 0 ? annualizedReplace / costRepair : null;

      let breaksPerMileYr = null;
      let flagOutlier = null;
      if (years != null && years > 0 && breaks != null && v.segLen != null) {
        const milesVal = uConv(v.segLen, 'ft', 'mi', 'length');
        if (milesVal > 0) {
          breaksPerMileYr = (breaks / years) / milesVal;
          flagOutlier = breaksPerMileYr >= 2 * cohortAvg;
        }
      }

      const criticalityOverride = criticality === 'High' || criticality === 'Critical';
      let verdict;
      if (criticalityOverride) verdict = 'REPLACE';
      else if (annualRepair > 1.10 * annualizedReplace) verdict = 'REPLACE';
      else if (annualRepair < 0.90 * annualizedReplace) verdict = 'KEEP REPAIRING';
      else verdict = 'ON THE LINE';

      return {
        values: {
          breaksYr, annualRepair, annualizedReplace, breakEvenN,
          breaksPerMileYr, flagOutlier, verdict, criticalityOverride, criticality,
          costRepair, costReplace, lifeYrs, discountRate, cohortAvg
        },
        computed: ['breaksYr', 'annualRepair', 'annualizedReplace', 'breakEvenN', 'verdict'],
        error: ''
      };
    },
    interpret: (m) => {
      if (m.verdict == null) return null;
      const level = m.verdict === 'REPLACE' ? 'alert' : (m.verdict === 'KEEP REPAIRING' ? 'good' : 'watch');
      const N = Math.round(m.breakEvenN * 100) / 100;
      const M = Math.round(m.breaksYr * 100) / 100;
      let text = m.verdict + '. Replacement pays for itself once this main breaks more than ' + N + ' times/yr; you are at ' + M + '.';

      // Audit finding C5: numbers alone make a reader do the division in
      // their head. Say the size of the gap in words too.
      if (m.breakEvenN > 0 && isFinite(m.breaksYr / m.breakEvenN)) {
        const ratio = Math.round((m.breaksYr / m.breakEvenN) * 10) / 10;
        const rel = ratio > 1 ? 'over' : (ratio < 1 ? 'under' : 'right at');
        text += ' You are running about ' + ratio + ' times the break-even rate, ' + rel + ' the line.';
      }

      if (m.criticalityOverride) {
        text += ' Criticality is set to ' + m.criticality + ', so this recommends REPLACE regardless of the break-even math.';
      }
      if (m.flagOutlier === true) {
        text += ' Outlier flag: this segment runs about ' + (Math.round(m.breaksPerMileYr * 100) / 100) + ' breaks/mile/yr, at least 2x the cohort average of ' + m.cohortAvg + '.';
      }
      text += ' This treats a repair and a replacement as buying the same service; it ignores the consequence cost of a failure unless you raise criticality.';

      // Audit finding C1: the tagline promises "one next step" but the tool
      // never named one. Close with the action that verdict actually implies.
      if (m.verdict === 'REPLACE') {
        text += ' Add this segment to your capital plan, or ask your engineer for a replacement estimate.';
      } else if (m.verdict === 'ON THE LINE') {
        text += ' Keep monitoring. Re-run this after the next break.';
      } else {
        text += ' No action needed yet. Re-run this after the next break.';
      }

      return { level, text };
    },
    links: [
      { label: 'EPA Asset Management: A Handbook for Small Water Systems (PDF)', href: 'https://www.epa.gov/system/files/documents/2022-06/FINAL%20AM%20Handbook%20for%20Small%20Water%20Systems%20STEP%20Guide_508.pdf' },
      { label: 'See how utilities tie this number to their asset records', href: 'https://www.ziptility.com/solutions/financial-tracking' }
    ],
    keywords: ['break even', 'main break', 'watchlist', '2x rule', 'outlier', 'capital planning', 'replacement reserve', 'CIP']
  }
];
