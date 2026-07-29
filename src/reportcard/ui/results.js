/* Utility Health Report Card: results screen.

   Every number a board would act on comes from score() - this file
   never averages a grade, never re-ranks one-rung-up, and never decides
   what caps the composite. It only lays the score() output out as text
   and bars. Per-dimension current grade is the one thing NOT computed:
   it is literally the reader's own answer (grades[d.id]), so reading it
   straight off the answer map is not "recomputing a grade," it is
   displaying the input. */
import { el, clear, gradeText, gradeName, GRADE_COLORS, LEG_COLOR } from './util.js';
import { score, actionFor, GRADES, LEGS, LEG_NAMES } from '../scoring.js';
import { RED_LINE_IDS } from '../config.js';

const RED_LINE_SET = new Set(RED_LINE_IDS);

/* Plain operator-voice headline per overall grade. Wording is written
   fresh here, not lifted from the prototype (house rule: structure and
   visual ideas from the prototype, zero content). */
const HEADLINE = {
  F: 'This system needs help now.',
  D: 'This system is carrying real risk.',
  C: 'This system is getting by.',
  B: 'This system is in solid shape.',
  A: 'This system is thriving.'
};

export function renderResults(root, opts) {
  const { dimensions, grades, gradeLabels, onBack, onEdit } = opts;
  clear(root);

  const byId = {};
  dimensions.forEach((d) => { byId[d.id] = d; });

  const s = score(grades, dimensions);

  const wrap = el('div', 'zrc-results');

  const topbar = el('div', 'zrc-topbar zrc-noprint');
  const backBtn = el('button', 'zrc-link-btn', '← Back to the questions');
  backBtn.type = 'button';
  backBtn.addEventListener('click', onBack);
  topbar.appendChild(backBtn);
  topbar.appendChild(el('span', 'zrc-topbar-count', s.answered + ' of ' + s.total + ' dimensions answered'));
  wrap.appendChild(topbar);

  wrap.appendChild(buildComposite(s, gradeLabels));
  wrap.appendChild(buildGroupedBars(dimensions, grades, gradeLabels));
  wrap.appendChild(buildWheelSection(dimensions, grades, s.overall.grade));
  wrap.appendChild(buildRedLinePanel(s, gradeLabels));
  wrap.appendChild(buildOneRungUp(s, byId, gradeLabels));
  wrap.appendChild(buildActionPlan(dimensions, grades, gradeLabels, onEdit));
  wrap.appendChild(buildSoftCapture());

  root.appendChild(wrap);

  const heading = wrap.querySelector('.zrc-h1');
  if (heading) { heading.tabIndex = -1; heading.focus(); }
}

function buildComposite(s, gradeLabels) {
  const section = el('section', 'zrc-composite');
  section.appendChild(el('h1', 'zrc-h1', s.overall.grade ? HEADLINE[s.overall.grade] : 'Answer a few dimensions to see your picture'));

  const grid = el('div', 'zrc-composite-grid');
  s.legAverages.forEach((la) => {
    grid.appendChild(compositeCard(LEG_NAMES[la.leg], la.grade, la.answered, la.total, gradeLabels));
  });
  grid.appendChild(compositeCard('Overall', s.overall.grade, s.answered, s.total, gradeLabels));
  section.appendChild(grid);

  if (s.practical.capped) {
    const capNote = el('div', 'zrc-cap-note');
    capNote.appendChild(el('p', 'zrc-cap-descriptive', 'Descriptive composite: ' + gradeText(s.practical.descriptiveGrade, gradeLabels) + '.'));
    capNote.appendChild(el('p', 'zrc-cap-practical', 'Practical Grade: ' + s.practical.grade + ' (capped by diagnostic flags)'));
    capNote.appendChild(el(
      'p',
      'zrc-cap-explain',
      'Two or more critical dimensions scored F. When that happens the practical grade is capped at D no ' +
      'matter how high the composite reads above. Both numbers are shown here on purpose: the composite ' +
      'still reflects the average condition, the practical grade reflects the condition that matters most.'
    ));
    section.appendChild(capNote);
  }
  return section;
}

function compositeCard(label, grade, answered, total, gradeLabels) {
  const card = el('div', 'zrc-composite-card');
  card.appendChild(el('div', 'zrc-composite-card-label', label));
  const big = el('div', 'zrc-composite-card-grade');
  if (grade) {
    const colors = GRADE_COLORS[grade];
    big.style.color = colors.fg;
    big.style.background = colors.bg;
    big.appendChild(el('span', 'zrc-composite-letter', grade));
    big.appendChild(el('span', 'zrc-composite-name', gradeName(grade, gradeLabels)));
  } else {
    big.appendChild(el('span', 'zrc-composite-name', 'Not yet gradable'));
  }
  card.appendChild(big);
  card.appendChild(el('div', 'zrc-composite-card-sub', answered + ' of ' + total + ' answered'));
  return card;
}

function buildGroupedBars(dimensions, grades, gradeLabels) {
  const section = el('section', 'zrc-bars-section');
  section.appendChild(el('h2', 'zrc-h2', 'All 23 dimensions'));
  section.appendChild(el(
    'p',
    'zrc-section-lede',
    'Grouped by Technical, Managerial, and Financial capacity. Every bar carries its letter and its name as text; colour is never the only signal.'
  ));

  const grid = el('div', 'zrc-bars-grid');
  LEGS.forEach((leg) => {
    const group = el('div', 'zrc-bars-group');
    const title = el('h3', 'zrc-bars-group-title');
    const swatch = el('span', 'zrc-swatch');
    swatch.style.background = LEG_COLOR[leg];
    title.appendChild(swatch);
    title.appendChild(document.createTextNode(LEG_NAMES[leg] + ' capacity'));
    group.appendChild(title);

    dimensions.filter((d) => d.leg === leg).forEach((d) => {
      group.appendChild(buildBarRow(d, grades[d.id], gradeLabels));
    });
    grid.appendChild(group);
  });
  section.appendChild(grid);
  return section;
}

function buildBarRow(d, grade, gradeLabels) {
  const row = el('div', 'zrc-bar-row');

  const head = el('div', 'zrc-bar-head');
  const nameSpan = el('span', 'zrc-bar-name', d.name + ' ');
  if (RED_LINE_SET.has(d.id)) nameSpan.appendChild(el('span', 'zrc-critical-tag', 'critical'));
  head.appendChild(nameSpan);
  head.appendChild(el('span', 'zrc-bar-gradetext', gradeText(grade, gradeLabels)));
  row.appendChild(head);

  const track = el('div', 'zrc-bar-track');
  const fill = el('div', 'zrc-bar-fill');
  const value = grade ? GRADES.indexOf(grade) : -1;
  fill.style.width = value >= 0 ? Math.round(((value + 1) / GRADES.length) * 100) + '%' : '0%';
  fill.style.background = grade ? GRADE_COLORS[grade].fg : '#cbd5e1';
  track.appendChild(fill);
  row.appendChild(track);

  row.appendChild(el('p', 'zrc-cite', d.citation));
  return row;
}

/* Decorative supplement, not a second source of information: everything
   the wheel shows is already text in buildGroupedBars above, so it is
   marked aria-hidden rather than given its own parallel accessible
   description that could drift out of sync with the bars. */
function buildWheelSection(dimensions, grades, overallGrade) {
  const section = el('section', 'zrc-wheel-section zrc-noprint');
  section.appendChild(el('h2', 'zrc-h2', 'The same picture, as a wheel'));
  section.appendChild(el('p', 'zrc-section-lede', 'A picture only. The bars above carry the same information as text.'));
  const svg = buildWheelSvg(dimensions, grades, overallGrade);
  section.appendChild(svg);
  return section;
}

function buildWheelSvg(dimensions, grades, overallGrade) {
  const cx = 150, cy = 150, rin = 58, rout = 128, gapDeg = 6;
  const n = dimensions.length;
  const totalGap = gapDeg * LEGS.length;
  const segDeg = (360 - totalGap) / n;
  const polar = (r, deg) => {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const arcPath = (a0, a1) => {
    const [x0, y0] = polar(rout, a0);
    const [x1, y1] = polar(rout, a1);
    const [x2, y2] = polar(rin, a1);
    const [x3, y3] = polar(rin, a0);
    const large = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + x0 + ',' + y0 + ' A' + rout + ',' + rout + ' 0 ' + large + ' 1 ' + x1 + ',' + y1 +
      ' L' + x2 + ',' + y2 + ' A' + rin + ',' + rin + ' 0 ' + large + ' 0 ' + x3 + ',' + y3 + ' Z';
  };

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 300 300');
  svg.setAttribute('width', '260');
  svg.setAttribute('height', '260');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  let ang = 0;
  let prevLeg = dimensions.length ? dimensions[0].leg : 'T';
  dimensions.forEach((d, i) => {
    if (i > 0 && d.leg !== prevLeg) { ang += gapDeg; prevLeg = d.leg; }
    const a0 = ang, a1 = ang + segDeg;
    const grade = grades[d.id];
    const color = grade ? GRADE_COLORS[grade].fg : '#e2e8f0';
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', arcPath(a0, a1));
    path.setAttribute('fill', color);
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', '1.5');
    svg.appendChild(path);
    ang = a1;
  });

  const centerCircle = document.createElementNS(svgNS, 'circle');
  centerCircle.setAttribute('cx', String(cx));
  centerCircle.setAttribute('cy', String(cy));
  centerCircle.setAttribute('r', String(rin - 6));
  centerCircle.setAttribute('fill', '#fcfaf6');
  svg.appendChild(centerCircle);

  const gradeTextEl = document.createElementNS(svgNS, 'text');
  gradeTextEl.setAttribute('x', String(cx));
  gradeTextEl.setAttribute('y', String(cy + 2));
  gradeTextEl.setAttribute('text-anchor', 'middle');
  gradeTextEl.setAttribute('dominant-baseline', 'middle');
  gradeTextEl.setAttribute('font-family', 'Archivo, sans-serif');
  gradeTextEl.setAttribute('font-weight', '900');
  gradeTextEl.setAttribute('font-size', '42');
  gradeTextEl.setAttribute('fill', '#0c1f30');
  gradeTextEl.textContent = overallGrade || '';
  svg.appendChild(gradeTextEl);

  const labelTextEl = document.createElementNS(svgNS, 'text');
  labelTextEl.setAttribute('x', String(cx));
  labelTextEl.setAttribute('y', String(cy + 28));
  labelTextEl.setAttribute('text-anchor', 'middle');
  labelTextEl.setAttribute('font-family', 'Geist, sans-serif');
  labelTextEl.setAttribute('font-size', '11');
  labelTextEl.setAttribute('fill', '#94a3b8');
  labelTextEl.textContent = 'overall';
  svg.appendChild(labelTextEl);

  return svg;
}

function buildRedLinePanel(s, gradeLabels) {
  const section = el('section', 'zrc-redline-section');
  section.appendChild(el('h2', 'zrc-h2', 'These need attention first'));
  section.appendChild(el(
    'p',
    'zrc-section-lede',
    'A small set of dimensions where a failing grade is treated as an emergency, regardless of the rest of the picture.'
  ));

  if (s.flags.length === 0) {
    section.appendChild(el('p', 'zrc-redline-clear', 'None of the critical dimensions are failing right now.'));
    return section;
  }

  const list = el('div', 'zrc-redline-list');
  s.flags.forEach((f) => {
    const card = el('div', 'zrc-redline-card');
    card.appendChild(el('div', 'zrc-redline-leg', LEG_NAMES[f.leg] + ' · ' + f.id));
    card.appendChild(el('h3', 'zrc-redline-name', f.name));
    card.appendChild(el('div', 'zrc-redline-grade', 'Currently: ' + gradeText(f.grade, gradeLabels)));
    list.appendChild(card);
  });
  section.appendChild(list);
  return section;
}

function buildOneRungUp(s, byId, gradeLabels) {
  const section = el('section', 'zrc-onerungup-section');
  section.appendChild(el('h2', 'zrc-h2', 'Your next move: one rung up'));
  section.appendChild(el('p', 'zrc-section-lede', 'The three dimensions where moving up one letter would help the most.'));

  if (s.oneRungUp.length === 0) {
    section.appendChild(el('p', null, 'Not enough is answered yet to rank a next move, or every graded dimension is already at A.'));
    return section;
  }

  const list = el('div', 'zrc-onerungup-list');
  s.oneRungUp.forEach((r) => {
    const dim = byId[r.id];
    const card = el('div', 'zrc-onerungup-card');
    card.appendChild(el('div', 'zrc-onerungup-leg', LEG_NAMES[r.leg] + ' · ' + r.id));
    card.appendChild(el('h3', null, r.name));
    card.appendChild(el(
      'div',
      'zrc-onerungup-transition',
      'Currently ' + gradeText(r.current, gradeLabels) + '. Target: ' + gradeText(r.target, gradeLabels) + '.'
    ));
    const action = actionFor(dim, r.current);
    if (action) card.appendChild(el('p', 'zrc-action-text', action));
    list.appendChild(card);
  });
  section.appendChild(list);
  return section;
}

function buildActionPlan(dimensions, grades, gradeLabels, onEdit) {
  const section = el('section', 'zrc-actionplan-section');
  section.appendChild(el('h2', 'zrc-h2', 'Action plan'));
  section.appendChild(el('p', 'zrc-section-lede', 'Every graded dimension below A, with the specific next step and its source.'));

  const items = dimensions.filter((d) => {
    const g = grades[d.id];
    return g && g !== 'A';
  });

  if (items.length === 0) {
    section.appendChild(el('p', null, 'Nothing here yet. Either nothing is graded below A, or nothing has been answered.'));
    return section;
  }

  const list = el('div', 'zrc-actionplan-list');
  items.forEach((d) => {
    const g = grades[d.id];
    const card = el('div', 'zrc-actionplan-card');

    const head = el('div', 'zrc-actionplan-head');
    head.appendChild(el('span', 'zrc-actionplan-leg', LEG_NAMES[d.leg] + ' · ' + d.id));
    head.appendChild(el('span', 'zrc-actionplan-grade', gradeText(g, gradeLabels)));
    card.appendChild(head);

    card.appendChild(el('h3', null, d.name));

    const action = actionFor(d, g);
    if (action) card.appendChild(el('p', 'zrc-action-text', action));
    card.appendChild(el('p', 'zrc-cite', d.citation));

    const editBtn = el('button', 'zrc-link-btn zrc-noprint', 'Revisit this dimension');
    editBtn.type = 'button';
    editBtn.addEventListener('click', () => onEdit(dimensions.indexOf(d)));
    card.appendChild(editBtn);

    list.appendChild(card);
  });
  section.appendChild(list);
  return section;
}

/* R14: this is the only place in the results screen that mentions email,
   it sits below the fully rendered result, and it is not a gate - the
   score above renders with or without it. */
function buildSoftCapture() {
  const section = el('section', 'zrc-softcapture zrc-noprint');
  section.appendChild(el('h2', 'zrc-h2-sm', 'Bring this to your next board meeting'));
  section.appendChild(el(
    'p',
    null,
    'The result is already on the screen above. If it is useful, email yourself a copy or print it. No account, no follow-up call.'
  ));

  const row = el('div', 'zrc-softcapture-row');
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'you@utility.gov';
  emailInput.className = 'zrc-email-input';
  emailInput.setAttribute('aria-label', 'Your email address, optional');
  row.appendChild(emailInput);

  const emailBtn = el('button', 'zrc-btn zrc-btn-secondary', 'Email it to myself');
  emailBtn.type = 'button';
  emailBtn.addEventListener('click', () => {
    try {
      const addr = emailInput.value.trim();
      const subject = encodeURIComponent('My Utility Health Report Card result');
      const body = encodeURIComponent('Print this page (or save as PDF) for the full result.');
      window.location.href = 'mailto:' + addr + '?subject=' + subject + '&body=' + body;
    } catch (e) { /* mail client unavailable: this is optional, nothing else to do */ }
  });
  row.appendChild(emailBtn);

  const printBtn = el('button', 'zrc-btn zrc-btn-quiet', 'Print this Report Card');
  printBtn.type = 'button';
  printBtn.addEventListener('click', () => {
    try { window.print(); } catch (e) { /* print unavailable */ }
  });
  row.appendChild(printBtn);

  section.appendChild(row);
  return section;
}
