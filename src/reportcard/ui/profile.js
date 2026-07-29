/* Utility Health Report Card: the optional closing block.

   Sits between the last dimension and the results screen (main.js's
   goProfile). It is NOT a gate (Blake ruling R14: no email for the
   score). Skipping shows the identical full report - that has to be
   said in plain words on screen, not left for the reader to guess or
   discover by trial.

   Every field is optional. Connections, employees, and revenue are
   SELECTS with bands rather than free-number inputs, on purpose: bands
   are what makes one utility's answer comparable to another's, and a
   free number field just invites a guess dressed up as precision.

   Nothing here computes anything. The object handed to onSubmit carries
   exactly the five keys submit.js already expects (connections,
   employees, revenue, systemType, email); a field left blank is left out
   of that object rather than sent as an empty string, matching how
   submit.js's own field() helper treats blanks. */
import { el, clear } from './util.js';

const CONNECTIONS_OPTIONS = [
  ['Under 500', 'Under 500'],
  ['500 to 1,000', '500 to 1,000'],
  ['1,000 to 3,300', '1,000 to 3,300'],
  ['3,300 to 10,000', '3,300 to 10,000'],
  ['Over 10,000', 'Over 10,000']
];

const EMPLOYEES_OPTIONS = [
  ['1 or fewer', '1 or fewer'],
  ['2 to 4', '2 to 4'],
  ['5 to 9', '5 to 9'],
  ['10 to 24', '10 to 24'],
  ['25 or more', '25 or more']
];

const REVENUE_OPTIONS = [
  ['Under $250k', 'Under $250k'],
  ['$250k to $500k', '$250k to $500k'],
  ['$500k to $1M', '$500k to $1M'],
  ['$1M to $2.5M', '$1M to $2.5M'],
  ['$2.5M to $5M', '$2.5M to $5M'],
  ['Over $5M', 'Over $5M'],
  ['Not sure', 'Not sure']
];

const SYSTEM_TYPE_OPTIONS = [
  ['Water', 'Water'],
  ['Wastewater', 'Wastewater'],
  ['Both', 'Both']
];

export function renderProfile(root, opts) {
  const { profile, onSubmit, onSkip, onBack } = opts;
  clear(root);

  const p = profile || {};
  const wrap = el('div', 'zrc-profile');

  const topbar = el('div', 'zrc-topbar');
  const backBtn = el('button', 'zrc-link-btn', '← Back to the questions');
  backBtn.type = 'button';
  backBtn.addEventListener('click', onBack);
  topbar.appendChild(backBtn);
  wrap.appendChild(topbar);

  const heading = el('h1', 'zrc-h1', 'A few optional questions');
  heading.tabIndex = -1;
  wrap.appendChild(heading);

  wrap.appendChild(el(
    'p',
    'zrc-lede',
    'Every question below is optional. Skip this and you get the exact same full report on the ' +
    'next screen. Nothing here changes your score.'
  ));

  wrap.appendChild(el(
    'p',
    'zrc-profile-why',
    'Here is why we ask. There is very little data anywhere on how small water and wastewater ' +
    'systems are actually doing day to day. Answers like yours help build a real picture of that, ' +
    'one that gets shared back rather than locked away. Answer as many or as few as you want.'
  ));

  const grid = el('div', 'zrc-profile-grid');
  grid.appendChild(selectField(
    'zrc-profile-connections',
    'Service connections',
    'How many service connections does your system have?',
    CONNECTIONS_OPTIONS,
    p.connections
  ));
  grid.appendChild(selectField(
    'zrc-profile-employees',
    'Staff',
    'How many full-time-equivalent staff work on the utility?',
    EMPLOYEES_OPTIONS,
    p.employees
  ));
  grid.appendChild(selectField(
    'zrc-profile-revenue',
    'Annual operating revenue',
    'Your best estimate is fine.',
    REVENUE_OPTIONS,
    p.revenue
  ));
  grid.appendChild(selectField(
    'zrc-profile-systemtype',
    'System type',
    'Water, wastewater, or both?',
    SYSTEM_TYPE_OPTIONS,
    p.systemType
  ));
  wrap.appendChild(grid);

  const emailField = el('div', 'zrc-profile-field zrc-profile-email-field');
  const emailLabel = el('label', 'zrc-profile-label', 'Email');
  emailLabel.htmlFor = 'zrc-profile-email';
  emailField.appendChild(emailLabel);
  /* DO NOT promise to send them anything here unless something actually
     sends it. The first draft read "only if you want a copy of this report
     sent to you", and nothing in this tool or in HubSpot mails a report:
     that promise needed a follow-up workflow nobody has built. Small lie,
     easy to ship, and precisely the kind that costs an operator's trust on
     a page whose whole pitch is honesty.
     What IS true: the report is on the very next screen, and they can
     print or save it themselves. If a "mail me a copy" workflow is ever
     added, this copy changes back in the same commit.
     See HUBSPOT-FORM-SPEC.md. */
  emailField.appendChild(el(
    'p',
    'zrc-profile-help',
    'Only if you want us to be able to reach you about your results. Not a newsletter signup. ' +
    'Your report is on the next screen either way, and you can print or save it from there.'
  ));
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'zrc-profile-email';
  emailInput.className = 'zrc-profile-input';
  emailInput.placeholder = 'you@utility.gov';
  emailInput.value = p.email || '';
  emailField.appendChild(emailInput);
  wrap.appendChild(emailField);

  const selects = {
    connections: grid.querySelector('#zrc-profile-connections'),
    employees: grid.querySelector('#zrc-profile-employees'),
    revenue: grid.querySelector('#zrc-profile-revenue'),
    systemType: grid.querySelector('#zrc-profile-systemtype')
  };

  const actions = el('div', 'zrc-profile-actions');

  const skipBtn = el('button', 'zrc-btn zrc-btn-secondary', 'Skip, just show me my report');
  skipBtn.type = 'button';
  skipBtn.addEventListener('click', onSkip);
  actions.appendChild(skipBtn);

  const submitBtn = el('button', 'zrc-btn zrc-btn-primary', 'Submit and see my report');
  submitBtn.type = 'button';
  submitBtn.addEventListener('click', () => {
    const answers = {};
    if (selects.connections.value) answers.connections = selects.connections.value;
    if (selects.employees.value) answers.employees = selects.employees.value;
    if (selects.revenue.value) answers.revenue = selects.revenue.value;
    if (selects.systemType.value) answers.systemType = selects.systemType.value;
    const email = emailInput.value.trim();
    if (email) answers.email = email;
    onSubmit(answers);
  });
  actions.appendChild(submitBtn);

  wrap.appendChild(actions);

  root.appendChild(wrap);
  heading.focus();
}

function selectField(id, labelText, helpText, options, value) {
  const field = el('div', 'zrc-profile-field');

  const label = el('label', 'zrc-profile-label', labelText);
  label.htmlFor = id;
  field.appendChild(label);

  if (helpText) field.appendChild(el('p', 'zrc-profile-help', helpText));

  const select = document.createElement('select');
  select.id = id;
  select.className = 'zrc-profile-select';

  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = 'Prefer not to say';
  select.appendChild(blank);

  options.forEach(([optValue, optText]) => {
    const o = document.createElement('option');
    o.value = optValue;
    o.textContent = optText;
    if (optValue === value) o.selected = true;
    select.appendChild(o);
  });

  field.appendChild(select);
  return field;
}
