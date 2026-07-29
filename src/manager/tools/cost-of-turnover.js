/* Tool 2 of 3 in the manager toolbox - "Cost of Turnover"
   Spec: master repo, ziptility/web/field-guide/manager-track/tool-specs.md
   ("Tool 2 - /tools/cost-of-turnover"). The differentiated give: nobody else
   offers this. Sourced smart default: the OT-backfill weekly rate blends the
   standby-pay tiers reported in
   ziptility/ops/research/wastewater-wiki/wastewater-wiki-oncall-comp-reference.md
   ("~$50/weekday, $75/weekend day" pattern) -> (5x50 + 2x75)/7 days x 7 = $400/wk.
   The ramp-to-proficiency inputs are named after
   ziptility/ops/research/wastewater-wiki/wastewater-wiki-life-on-the-job.md's
   "silver tsunami" framing, but that source gives no numeric ramp length or
   productivity-loss figure, so those two defaults (12 months, 50%) are this
   build's own rule-of-thumb estimate, not a sourced number. Flagged UNSURE. */

function num(x) {
  const n = typeof x === 'number' ? x : (x == null || x === '' ? null : parseFloat(x));
  return n != null && isFinite(n) ? n : null;
}

export default [
  {
    id: 'cost-of-turnover',
    cat: 'Workforce',
    domains: ['water', 'wastewater'],
    title: 'Cost of Turnover',
    formula: 'Operators lost/yr x (recruiting + OT backfill + ramp cost)',
    note: 'What losing an operator actually costs, and the raise it would take to break even on keeping one instead.',
    fields: [
      { k: 'operatorsLost', label: 'Operators lost per year' },
      { k: 'salary', label: 'Fully-loaded salary per operator ($/yr)' },
      { k: 'recruitCost', label: 'Recruiting + training cost per hire ($)' },
      { k: 'otWeeklyRate', label: 'On-call/OT backfill cost per week vacant ($)', def: 400 },
      { k: 'vacancyWeeks', label: 'Weeks the position sits vacant' },
      { k: 'rampMonths', label: 'Months to full proficiency (new-hire ramp)', def: 12 },
      { k: 'rampLossPct', label: 'Productivity loss during ramp (% of salary, averaged over the ramp)', def: 50 }
    ],
    solve: (v) => {
      const operatorsLost = num(v.operatorsLost);
      const salary = num(v.salary);
      const recruitCost = num(v.recruitCost);
      const vacancyWeeks = num(v.vacancyWeeks);
      if (operatorsLost == null || operatorsLost <= 0) {
        return { values: {}, computed: [], error: 'Enter how many operators you lose in a typical year.' };
      }
      if (salary == null || salary <= 0) {
        return { values: {}, computed: [], error: 'Enter the fully-loaded salary per operator.' };
      }
      if (recruitCost == null || recruitCost < 0) {
        return { values: {}, computed: [], error: 'Enter the recruiting + training cost per hire (0 if none).' };
      }
      if (vacancyWeeks == null || vacancyWeeks < 0) {
        return { values: {}, computed: [], error: 'Enter how many weeks the position typically sits vacant.' };
      }
      const otWeeklyRate = num(v.otWeeklyRate) ?? 400;
      const rampMonths = num(v.rampMonths) ?? 12;
      const rampLossPct = num(v.rampLossPct) ?? 50;

      const otBackfillCost = otWeeklyRate * vacancyWeeks;
      const rampCost = salary * (rampMonths / 12) * (rampLossPct / 100);
      const costPerDeparture = recruitCost + otBackfillCost + rampCost;
      const annualCost = operatorsLost * costPerDeparture;
      const breakEvenRaise = costPerDeparture;

      return {
        values: {
          otBackfillCost, rampCost, costPerDeparture, annualCost, breakEvenRaise,
          operatorsLost, salary, recruitCost, vacancyWeeks, otWeeklyRate, rampMonths, rampLossPct
        },
        computed: ['otBackfillCost', 'rampCost', 'costPerDeparture', 'annualCost', 'breakEvenRaise'],
        error: ''
      };
    },
    interpret: (m) => {
      if (m.annualCost == null) return null;
      const annual = Math.round(m.annualCost);
      const per = Math.round(m.breakEvenRaise);
      const text = 'Losing ' + m.operatorsLost + ' operator' + (m.operatorsLost === 1 ? '' : 's') + '/yr costs about $' + annual.toLocaleString('en-US') +
        '/yr (recruiting + OT backfill + ramp-up productivity loss). A retention raise would have to beat $' + per.toLocaleString('en-US') +
        ' per operator per year to lose money; anything under that line is cheaper than the churn it prevents.';
      return { level: 'info', text };
    },
    links: [
      { label: 'Field guide: staffing and turnover, it is a budget decision', href: 'https://www.ziptility.com/guides/staffing-and-turnover-its-a-budget-decision' },
      { label: 'See how utilities track this in Ziptility', href: 'https://www.ziptility.com/solutions/financial-tracking' }
    ],
    keywords: ['retention', 'staffing', 'silver tsunami', 'overtime', 'on-call', 'recruiting cost', 'vacancy']
  }
];
