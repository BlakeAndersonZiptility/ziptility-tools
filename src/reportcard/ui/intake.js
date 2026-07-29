/* Utility Health Report Card: intake, one dimension per step.

   Dimensions render in rubric order, which is already T then M then F
   (tested in tests/reportcard.test.js), so this file never re-sorts
   them. Skip-and-return is the point: Next/Previous never require an
   answer, and the jump nav lets the reader land on any of the 23
   directly. Every rung is a real <input type="radio"> inside a
   role="radiogroup" (task requirement) - no clickable divs standing in
   for form controls, so keyboard and screen-reader behavior come from
   the browser rather than from JS re-implementing them. */
import { el, clear, splitGradeLabel, GRADE_COLORS, LEG_COLOR } from './util.js';
import { score, GRADES, LEGS, LEG_NAMES } from '../scoring.js';
import { RED_LINE_IDS } from '../config.js';

const RED_LINE_SET = new Set(RED_LINE_IDS);

export function renderIntake(root, opts) {
  const { dimensions, grades, idx, gradeLabels, onAnswer, onGoto, onExit, onViewResults } = opts;
  clear(root);

  const s = score(grades, dimensions);
  const dim = dimensions[idx];

  const wrap = el('div', 'zrc-intake');

  wrap.appendChild(buildTopbar(s, onExit));
  wrap.appendChild(buildLegBars(s, dim.leg));
  wrap.appendChild(buildJumpNav(dimensions, grades, idx, onGoto));
  wrap.appendChild(buildStepCard(dim, grades, gradeLabels, onAnswer));
  wrap.appendChild(buildNavRow(dimensions, idx, onGoto, onViewResults));

  const viewResultsRow = el('div', 'zrc-viewresults-row');
  const vr = el('button', 'zrc-link-btn', 'See my results so far');
  vr.type = 'button';
  vr.addEventListener('click', onViewResults);
  viewResultsRow.appendChild(vr);
  wrap.appendChild(viewResultsRow);

  root.appendChild(wrap);

  /* Move focus to the new step's heading so a screen reader announces
     the dimension that just loaded, rather than leaving focus on a
     button that no longer exists in the fresh DOM. */
  const heading = wrap.querySelector('.zrc-step-title');
  if (heading) heading.focus();
}

/* Called after an answer changes, instead of re-running renderIntake.
   Selecting a rung is a native radio "change" event; the radio itself
   already reflects the new selection without any help from us. A full
   clear+rebuild here would replace that input with a fresh DOM node and
   silently drop keyboard focus off whatever the reader just pressed -
   exactly the kind of thing that only shows up once someone tries to
   drive the flow by keyboard alone. So this only touches the progress
   text, the leg-bar fills, and the jump-nav checkmarks: everything a
   change to `grades` can affect other than the step card itself. */
export function updateAnswerFeedback(root, { dimensions, grades }) {
  const s = score(grades, dimensions);

  const countEl = root.querySelector('.zrc-topbar-count');
  if (countEl) countEl.textContent = s.answered + ' of ' + s.total + ' answered';

  LEGS.forEach((leg) => {
    const la = s.legAverages.find((l) => l.leg === leg);
    const barWrap = root.querySelector('.zrc-legbar[data-leg="' + leg + '"]');
    if (!barWrap) return;
    const pct = la.total ? Math.round((la.answered / la.total) * 100) : 0;
    const fill = barWrap.querySelector('.zrc-legbar-fill');
    if (fill) fill.style.width = pct + '%';
    const count = barWrap.querySelector('.zrc-legbar-count');
    if (count) count.textContent = la.answered + '/' + la.total;
  });

  dimensions.forEach((d) => {
    const btn = root.querySelector('.zrc-jumpbtn[data-dim-id="' + d.id + '"]');
    if (!btn) return;
    const answered = Boolean(grades[d.id]);
    btn.classList.toggle('zrc-jumpbtn-answered', answered);
    btn.textContent = d.id + (answered ? ' ✓' : '');
    btn.setAttribute(
      'aria-label',
      d.id + ', ' + d.name + (answered ? ', answered grade ' + grades[d.id] : ', not yet answered')
    );
  });
}

function buildTopbar(s, onExit) {
  const topbar = el('div', 'zrc-topbar');
  const exitBtn = el('button', 'zrc-link-btn', '← Save and exit');
  exitBtn.type = 'button';
  exitBtn.addEventListener('click', onExit);
  topbar.appendChild(exitBtn);
  topbar.appendChild(el('span', 'zrc-topbar-count', s.answered + ' of ' + s.total + ' answered'));
  return topbar;
}

function buildLegBars(s, currentLeg) {
  const bars = el('div', 'zrc-legbars');
  LEGS.forEach((leg) => {
    const la = s.legAverages.find((l) => l.leg === leg);
    const pct = la.total ? Math.round((la.answered / la.total) * 100) : 0;
    const barWrap = el('div', 'zrc-legbar' + (leg === currentLeg ? ' zrc-legbar-current' : ''));
    barWrap.dataset.leg = leg;
    const label = el('div', 'zrc-legbar-label');
    label.appendChild(el('span', null, LEG_NAMES[leg]));
    label.appendChild(el('span', 'zrc-legbar-count', la.answered + '/' + la.total));
    barWrap.appendChild(label);
    const track = el('div', 'zrc-legbar-track');
    const fill = el('div', 'zrc-legbar-fill');
    fill.style.width = pct + '%';
    fill.style.background = LEG_COLOR[leg];
    track.appendChild(fill);
    barWrap.appendChild(track);
    bars.appendChild(barWrap);
  });
  return bars;
}

function buildJumpNav(dimensions, grades, idx, onGoto) {
  const nav = el('nav', 'zrc-jumpnav');
  nav.setAttribute('aria-label', 'Jump to a dimension');
  LEGS.forEach((leg) => {
    const group = el('div', 'zrc-jumpgroup');
    group.appendChild(el('span', 'zrc-jumpgroup-label', LEG_NAMES[leg]));
    const row = el('div', 'zrc-jumprow');
    dimensions.forEach((d, i) => {
      if (d.leg !== leg) return;
      const answered = Boolean(grades[d.id]);
      const cls = ['zrc-jumpbtn'];
      if (i === idx) cls.push('zrc-jumpbtn-current');
      if (answered) cls.push('zrc-jumpbtn-answered');
      const b = el('button', cls.join(' '), d.id + (answered ? ' ✓' : ''));
      b.type = 'button';
      b.dataset.dimId = d.id;
      b.setAttribute(
        'aria-label',
        d.id + ', ' + d.name + (answered ? ', answered grade ' + grades[d.id] : ', not yet answered')
      );
      if (i === idx) b.setAttribute('aria-current', 'step');
      b.addEventListener('click', () => onGoto(i));
      row.appendChild(b);
    });
    group.appendChild(row);
    nav.appendChild(group);
  });
  return nav;
}

function buildStepCard(dim, grades, gradeLabels, onAnswer) {
  const card = el('div', 'zrc-card zrc-step-card');

  const meta = el('div', 'zrc-step-meta');
  meta.appendChild(el('span', 'zrc-legbadge', LEG_NAMES[dim.leg] + ' · ' + dim.id));
  if (RED_LINE_SET.has(dim.id)) {
    meta.appendChild(el('span', 'zrc-critical-badge', 'Critical dimension'));
  }
  card.appendChild(meta);

  const headingId = 'zrc-dim-heading';
  const heading = el('h2', 'zrc-step-title', dim.name);
  heading.id = headingId;
  heading.tabIndex = -1;
  card.appendChild(heading);

  card.appendChild(el('p', 'zrc-step-def', dim.definition));
  card.appendChild(el('div', 'zrc-step-instruction', 'Pick the description that sounds most like your utility today.'));

  const group = el('div', 'zrc-ruggroup');
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-labelledby', headingId);

  GRADES.forEach((g) => {
    const { name } = splitGradeLabel(gradeLabels[g]);
    const label = el('label', 'zrc-rung');
    label.style.setProperty('--zrc-rung-fg', GRADE_COLORS[g].fg);
    label.style.setProperty('--zrc-rung-bg', GRADE_COLORS[g].bg);

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'zrc-rung-' + dim.id;
    input.value = g;
    input.className = 'zrc-rung-input';
    input.checked = grades[dim.id] === g;
    input.addEventListener('change', () => onAnswer(dim.id, g));
    label.appendChild(input);

    label.appendChild(el('span', 'zrc-rung-badge', g));

    const textWrap = el('span', 'zrc-rung-text');
    textWrap.appendChild(el('span', 'zrc-rung-name', name));
    textWrap.appendChild(el('span', 'zrc-rung-desc', dim.rungs[g]));
    label.appendChild(textWrap);

    group.appendChild(label);
  });
  card.appendChild(group);
  return card;
}

function buildNavRow(dimensions, idx, onGoto, onViewResults) {
  const isLast = idx === dimensions.length - 1;
  const navrow = el('div', 'zrc-navrow');

  const prevBtn = el('button', 'zrc-btn zrc-btn-quiet', '← Previous');
  prevBtn.type = 'button';
  prevBtn.disabled = idx === 0;
  prevBtn.addEventListener('click', () => onGoto(idx - 1));
  navrow.appendChild(prevBtn);

  const skipBtn = el('button', 'zrc-btn zrc-btn-quiet', 'Skip for now');
  skipBtn.type = 'button';
  skipBtn.addEventListener('click', () => { if (isLast) onViewResults(); else onGoto(idx + 1); });
  navrow.appendChild(skipBtn);

  const nextBtn = el('button', 'zrc-btn zrc-btn-primary', isLast ? 'See my results →' : 'Next →');
  nextBtn.type = 'button';
  nextBtn.addEventListener('click', () => { if (isLast) onViewResults(); else onGoto(idx + 1); });
  navrow.appendChild(nextBtn);

  return navrow;
}
