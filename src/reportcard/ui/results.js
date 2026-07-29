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

/* C1: dim.rungs[grade] is the substantive rung description the reader
   actually chose during intake (e.g. T7 at F = "Multiple ongoing
   violations and/or enforcement actions."). Before this fix it never
   reappeared anywhere on results - a board member reading "Asset
   Inventory: C Fairly Stable" learned nothing dimension-specific about
   their own utility. This is the one shared line that puts it back,
   reused under every bar row and on every red-line / one-rung-up /
   action-plan card. No new copy: the text already exists in rubric.json. */
function buildWhatThisMeans(dim, grade) {
  if (!dim || !grade || !dim.rungs || !dim.rungs[grade]) return null;
  const p = el('p', 'zrc-whatmeans');
  p.appendChild(el('span', 'zrc-whatmeans-label', 'What this means: '));
  p.appendChild(document.createTextNode(dim.rungs[grade]));
  return p;
}

/* C3: the red-line panel is the one place a flagged dimension gets its
   full card (name, current grade, what it means, the next action, the
   citation). One-rung-up and Action plan cross-reference it instead of
   repeating it - see buildSeeAboveCard. Anchor id lives here, alongside
   the panel that owns it, so the two can never drift out of sync. */
function redlineAnchorId(id) {
  return 'zrc-redline-' + id;
}

/* C4: anchor for a dimension's row in "All 23 dimensions", for the
   compact jump nav at the top of that section. */
function dimRowAnchorId(id) {
  return 'zrc-allrow-' + id;
}

/* C3: compact cross-reference in place of a repeated full card. */
function buildSeeAboveCard(cardClass, leg, id, name) {
  const card = el('div', cardClass + ' zrc-see-above');
  card.appendChild(el('span', cardClass.indexOf('actionplan') > -1 ? 'zrc-actionplan-leg' : 'zrc-onerungup-leg', LEG_NAMES[leg] + ' · ' + id));
  const link = document.createElement('a');
  link.className = 'zrc-see-above-link';
  link.href = '#' + redlineAnchorId(id);
  link.textContent = 'See ' + name + ' above';
  card.appendChild(link);
  return card;
}

/* Joins names the way a person would say them out loud: "A", "A and B",
   "A, B, and C". Used only in the practical-grade sentence (C2). */
function joinNames(names) {
  if (names.length <= 1) return names.join('');
  if (names.length === 2) return names[0] + ' and ' + names[1];
  return names.slice(0, -1).join(', ') + ', and ' + names[names.length - 1];
}

/* PRINT-ONLY LOGO. On screen this tool shows no brand mark - the host
   page's own header/footer carry it (R14 neutrality, and see
   HANDOFF-WEB.md on why no tool bundle renders a logo on screen). A
   printed page has none of that chrome, and boards print these, so the
   printed report needs its own logo, title, and date at the top.
   Inlined markup (not a linked <img src>) so the bundle stays
   self-contained and printing works with no network available. Source:
   ziptility/shared/brand/design-system/assets/logo-horizontal-navy.svg
   in the master repo (copied verbatim, navy-on-white lockup - correct per
   that system's own contrast rule, since a printed page is white). */
const PRINT_LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="595.995" height="71.933" viewBox="0 0 595.995 71.933" fill="none">' +
  '<path d="M 217.668 50.734 L 188.205 50.734 L 217.245 20.29 L 217.245 7.002 L 164.076 7.002 L 164.076 21.299 L 193.2 21.299 L 163.653 52.248 L 163.653 65.872 L 217.668 65.872 L 217.668 50.734 Z" fill="#0c1f30"></path>' +
  '<path d="M 242.616 65.872 L 242.616 7.002 L 224.498 7.002 L 224.498 65.872 L 242.616 65.872 Z" fill="#0c1f30"></path>' +
  '<path d="M 249.861 7.002 L 249.861 65.872 L 267.809 65.872 L 267.809 47.875 L 301.675 47.875 C 303.707 42.576 304.723 35.933 304.723 27.943 C 304.723 19.449 303.538 12.469 301.336 7.002 L 249.861 7.002 Z M 267.809 20.711 L 285.927 20.711 C 286.435 22.477 286.774 24.831 286.774 27.691 C 286.774 30.718 286.435 33.073 285.927 34.755 L 267.809 34.755 L 267.809 20.711 Z" fill="#0c1f30"></path>' +
  '<path d="M 364.67 21.804 L 364.67 7.002 L 309.808 7.002 L 309.808 21.804 L 328.265 21.804 L 328.265 65.872 L 346.213 65.872 L 346.213 21.804 L 364.67 21.804 Z" fill="#0c1f30"></path>' +
  '<path d="M 390.031 65.872 L 390.031 7.002 L 371.913 7.002 L 371.913 65.872 L 390.031 65.872 Z" fill="#0c1f30"></path>' +
  '<path d="M 415.217 51.154 L 415.217 7.002 L 397.268 7.002 L 397.268 65.872 L 442.817 65.872 L 442.817 51.154 L 415.217 51.154 Z" fill="#0c1f30"></path>' +
  '<path d="M 468.149 65.872 L 468.149 7.002 L 450.031 7.002 L 450.031 65.872 L 468.149 65.872 Z" fill="#0c1f30"></path>' +
  '<path d="M 530.249 21.801 L 530.249 7 L 475.386 7 L 475.386 21.801 L 493.843 21.801 L 493.843 65.869 L 511.792 65.869 L 511.792 21.801 L 530.249 21.801 Z" fill="#0c1f30"></path>' +
  '<path d="M 574.518 44.991 L 595.995 7.002 L 576.691 7.002 L 565.543 30.118 L 554.565 7.002 L 535.092 7.002 L 556.569 44.991 L 556.569 65.872 L 574.518 65.872 L 574.518 44.991 Z" fill="#0c1f30"></path>' +
  '<path d="M 76.447 60.312 C 74.624 62.221 75.977 65.384 78.616 65.384 L 106.198 65.384 C 107.018 65.384 107.802 65.048 108.368 64.455 L 133.902 37.709 C 135.724 35.8 134.371 32.637 131.732 32.637 L 104.15 32.637 C 103.331 32.637 102.547 32.973 101.98 33.566 L 76.447 60.312 Z" fill="#0c1f30"></path>' +
  '<path d="M 0.836 34.224 C -0.986 36.133 0.367 39.296 3.006 39.296 L 30.588 39.296 C 31.407 39.296 32.191 38.96 32.758 38.367 L 58.291 11.621 C 60.114 9.712 58.761 6.549 56.121 6.549 L 28.54 6.549 C 27.72 6.549 26.936 6.885 26.37 7.478 L 0.836 34.224 Z" fill="#0c1f30"></path>' +
  '<path d="M 118.221 5.072 C 120.043 3.163 118.69 0 116.051 0 L 81.645 0 C 80.825 0 80.041 0.335 79.475 0.928 L 16.519 66.861 C 14.696 68.77 16.049 71.933 18.688 71.933 L 53.094 71.933 C 53.914 71.933 54.698 71.598 55.264 71.005 L 118.221 5.072 Z" fill="#0c1f30"></path>' +
  '</svg>';

/* Human-readable, guarded: a printed page must never blank out because
   Intl formatting threw in some odd embed context. */
function printDate() {
  try {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    try { return new Date().toDateString(); } catch (e2) { return ''; }
  }
}

function buildPrintLogo() {
  const wrap = el('div', 'zrc-print-logo');
  wrap.setAttribute('aria-hidden', 'true');

  const mark = el('div', 'zrc-print-logo-mark');
  mark.innerHTML = PRINT_LOGO_SVG;
  wrap.appendChild(mark);

  const meta = el('div', 'zrc-print-logo-meta');
  meta.appendChild(el('div', 'zrc-print-logo-title', 'Utility Health Report Card'));
  meta.appendChild(el('div', 'zrc-print-logo-date', printDate()));
  wrap.appendChild(meta);

  return wrap;
}

function buildPrintFooter() {
  const footer = el('div', 'zrc-print-footer');
  footer.setAttribute('aria-hidden', 'true');
  footer.textContent = 'ziptility.com/tools/report-card';
  return footer;
}

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
  /* C3: the set of dimensions the red-line panel already shows in full.
     One-rung-up and Action plan check membership here rather than
     re-deriving it, so "already covered" always means exactly what the
     red-line panel rendered - never a second, slightly different rule. */
  const redLineCovered = new Set(s.flags.map((f) => f.id));

  const wrap = el('div', 'zrc-results');

  wrap.appendChild(buildPrintLogo());

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
  wrap.appendChild(buildRedLinePanel(s, byId, gradeLabels, dimensions, onEdit));
  wrap.appendChild(buildOneRungUp(s, byId, gradeLabels, redLineCovered));
  wrap.appendChild(buildActionPlan(dimensions, grades, gradeLabels, onEdit, redLineCovered));
  wrap.appendChild(buildSoftCapture());
  wrap.appendChild(buildPrintFooter());

  root.appendChild(wrap);

  const heading = wrap.querySelector('.zrc-h1');
  if (heading) { heading.tabIndex = -1; heading.focus(); }
}

/* C2 + C5: when capped, the Practical Grade leads - larger, first, and
   naming which dimensions triggered it - with the descriptive composite
   demoted below it as secondary context. Before this fix the order was
   four cheerful "C" cards THEN a smaller box naming the cap, so cropping
   the top of the screen (or a phone that never scrolls that far) handed a
   board four C's and lost the D entirely. "Critical dimension" is the one
   term used everywhere here (D7/C5): no more "diagnostic flags". */
function buildComposite(s, gradeLabels) {
  const section = el('section', 'zrc-composite');
  const capped = s.practical.capped;
  const leadGrade = capped ? s.practical.grade : s.overall.grade;

  section.appendChild(buildGradePlaque(s, leadGrade, gradeLabels, capped));

  section.appendChild(el(
    'p',
    'zrc-composite-secondary-label',
    capped ? 'Descriptive composite (the plain average, before the cap)' : 'By capacity'
  ));

  const grid = el('div', 'zrc-composite-grid' + (capped ? ' zrc-composite-grid-secondary' : ''));
  s.legAverages.forEach((la) => {
    grid.appendChild(compositeCard(LEG_NAMES[la.leg], la.grade, la.answered, la.total, gradeLabels));
  });
  grid.appendChild(compositeCard('Overall', s.overall.grade, s.answered, s.total, gradeLabels));
  section.appendChild(grid);

  return section;
}

/* THE GRADE PLAQUE (design pass, 2026-07-29 - supersedes the plain-text headline plus, only when
   capped, a small colored box). Two audits scored this bundle's results screen as "competent,
   generic... interchangeable with any competitor" on Signature. The one number a utility's board
   actually needs (the Practical or Overall grade) now runs as a real instrument-panel plaque -
   dark surface, oversized letter, the headline sentence next to it - so the page has a moment
   before it ever gets to a bar chart, on BOTH the capped and uncapped path (the old version only
   built anything grade-shaped here when capped; most results are not capped, and got no plaque at
   all). Same dark surface token (--gauge-dark) as src/manager's result gauge and src/ui's CTA
   band, so a dark plaque means the same "here is the number that matters" thing everywhere in the
   tool suite. C2's naming rule is unchanged: s.flags already carries exactly which dimensions
   tripped the cap (scoring.js); this only reads that list out loud. */
function buildGradePlaque(s, leadGrade, gradeLabels, capped) {
  const plaque = el('div', 'zrc-plaque' + (leadGrade ? ' zrc-plaque-filled' : ''));

  /* D7: h2, not h1 - the host page owns the one true H1. Kept as the FIRST .zrc-h1 in the DOM
     either way, so renderResults' post-render focus() still lands here unchanged. */
  const headline = el('h2', 'zrc-h1 zrc-plaque-headline',
    leadGrade ? HEADLINE[leadGrade] : 'Answer a few dimensions to see your picture');

  if (!leadGrade) { plaque.appendChild(headline); return plaque; }

  const row = el('div', 'zrc-plaque-row');

  const big = el('div', 'zrc-plaque-grade');
  big.appendChild(el('span', 'zrc-plaque-letter', leadGrade));
  big.appendChild(el('span', 'zrc-plaque-name', gradeName(leadGrade, gradeLabels)));
  row.appendChild(big);

  const text = el('div', 'zrc-plaque-text');
  text.appendChild(headline);
  if (capped) {
    /* C2: named per the brief's own example - "Two of your critical dimensions scored F:
       Regulatory Compliance and Rate Adequacy. Your Practical Grade is D, and that is the one to
       act on." */
    const names = joinNames(s.flags.map((f) => f.name));
    text.appendChild(el('p', 'zrc-plaque-sub',
      s.flags.length + ' of your critical dimensions scored F: ' + names + '. ' +
      'Your Practical Grade is ' + leadGrade + ', and that is the one to act on.'));
  } else {
    text.appendChild(el('p', 'zrc-plaque-sub', s.answered + ' of ' + s.total + ' dimensions answered.'));
  }
  row.appendChild(text);
  plaque.appendChild(row);

  return plaque;
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
  /* C4: nine screen-heights of identical rows with no way to jump, on
     mobile especially. Reuses the exact jump-nav pattern from intake.js
     (same classes, so the D3 touch-target fix applies to both at once),
     as real in-page anchors rather than a JS click handler - nothing to
     wire up, and it degrades to nothing (rather than breaking) anywhere
     anchors don't work. Screen only: there is nothing to "jump" to on a
     printed page. */
  section.appendChild(buildAllDimsJumpNav(dimensions, grades));

  /* RHYTHM, 2026-07-29 (design pass): the audit's exact words were "23 identical bar-rows with no
     width or surface variation anywhere on the screen." Each capacity group now sits in its own
     card surface (reusing .zrc-card - the same white/shadow panel the intake step and composite
     cards already use, so this is one more application of an existing surface, not a new one)
     with a coloured top edge in that group's own LEG_COLOR - the same colour the small swatch
     dot already carries, just given somewhere to read as a shape rather than a 10px dot. Three
     visually distinct panels reads as grouped information; one flat list of 23 rows does not. */
  const grid = el('div', 'zrc-bars-grid');
  LEGS.forEach((leg) => {
    const group = el('div', 'zrc-bars-group zrc-card');
    group.style.borderTop = '4px solid ' + LEG_COLOR[leg];
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

/* C4: a compact per-leg anchor row at the top of "All 23 dimensions",
   built the same way as intake.js's buildJumpNav. Real anchors (<a
   href="#...">), not buttons with a click handler: there is no screen to
   change here, just a scroll within the same one, and an anchor degrades
   safely if scripting or CSS somehow fails. */
function buildAllDimsJumpNav(dimensions, grades) {
  const nav = el('nav', 'zrc-jumpnav zrc-noprint');
  nav.setAttribute('aria-label', 'Jump to a dimension below');
  LEGS.forEach((leg) => {
    const group = el('div', 'zrc-jumpgroup');
    group.appendChild(el('span', 'zrc-jumpgroup-label', LEG_NAMES[leg]));
    const row = el('div', 'zrc-jumprow');
    dimensions.forEach((d) => {
      if (d.leg !== leg) return;
      const answered = Boolean(grades[d.id]);
      const a = document.createElement('a');
      a.className = 'zrc-jumpbtn' + (answered ? ' zrc-jumpbtn-answered' : '');
      a.href = '#' + dimRowAnchorId(d.id);
      a.textContent = d.id + (answered ? ' ✓' : '');
      a.setAttribute('aria-label', d.id + ', ' + d.name);
      row.appendChild(a);
    });
    group.appendChild(row);
    nav.appendChild(group);
  });
  return nav;
}

function buildBarRow(d, grade, gradeLabels) {
  const row = el('div', 'zrc-bar-row');
  row.id = dimRowAnchorId(d.id);

  const head = el('div', 'zrc-bar-head');
  const nameSpan = el('span', 'zrc-bar-name', d.name + ' ');
  /* C5: "critical dimension" everywhere - this badge used to just say
     "critical", the cap note said "diagnostic flags", and nothing tied
     the two together. */
  if (RED_LINE_SET.has(d.id)) nameSpan.appendChild(el('span', 'zrc-critical-tag', 'critical dimension'));
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

  /* C1: the reader's own chosen description, put back in front of them. */
  const meaning = buildWhatThisMeans(d, grade);
  if (meaning) row.appendChild(meaning);

  /* C4: the citation collapses behind a closed-by-default <details> on
     screen (23 of these is most of the mobile wall this fixes), and the
     @media print rule above forces it open with the toggle hidden, since
     a printed page can't be clicked. */
  const details = document.createElement('details');
  details.className = 'zrc-cite-details';
  const summary = document.createElement('summary');
  summary.className = 'zrc-cite-summary';
  summary.textContent = 'Citation';
  details.appendChild(summary);
  details.appendChild(el('p', 'zrc-cite', d.citation));
  row.appendChild(details);

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
  /* WIDTH RHYTHM, 2026-07-29 (design pass): the full-width bars grid above sits right next to
     this, so the wheel gets its own bounded, Linen-tinted "gauge" card instead of floating free
     at the same width - a deliberate narrower measure (DS 9.7: "distinct widths down the page ...
     is the single most common look defect" when missing), and a second surface family (warm
     Linen vs. the bars' white cards) in the same screenful. */
  const card = el('div', 'zrc-wheel-card');
  const svg = buildWheelSvg(dimensions, grades, overallGrade);
  card.appendChild(svg);
  section.appendChild(card);
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
  /* MUTED-TEXT AUDIT, 2026-07-29: this was --n400 (#94a3b8), which DESIGN_SYSTEM_HANDOFF.md
     documents as "muted text" with no caveat about where it is legible. It sits on the wheel's
     near-white center circle (fill #fcfaf6 just above), where it MEASURES ~2.6:1 and fails 4.5:1
     - the same defect fixed everywhere else in this file (see the D4 comments in styles.css).
     --n600 (#475569) measures ~7.4:1 on that same fill and is the token this codebase already
     uses for every other "quiet but readable" label. */
  labelTextEl.setAttribute('fill', '#475569');
  labelTextEl.textContent = 'overall';
  svg.appendChild(labelTextEl);

  return svg;
}

/* C1/C3: the red-line panel is now the FULL card - name, current grade,
   what it means, the next action, the citation - because it is the one
   this section's callers (one-rung-up, action plan) defer to instead of
   repeating themselves. byId and dimensions/onEdit let it show and link
   exactly what those other cards show, so "the full card" really is
   full, not a reason to look elsewhere. */
function buildRedLinePanel(s, byId, gradeLabels, dimensions, onEdit) {
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
    const dim = byId[f.id];
    const card = el('div', 'zrc-redline-card');
    card.id = redlineAnchorId(f.id);

    const head = el('div', 'zrc-redline-head');
    head.appendChild(el('div', 'zrc-redline-leg', LEG_NAMES[f.leg] + ' · ' + f.id));
    head.appendChild(el('span', 'zrc-critical-tag', 'critical dimension'));
    card.appendChild(head);

    card.appendChild(el('h3', 'zrc-redline-name', f.name));
    card.appendChild(el('div', 'zrc-redline-grade', 'Currently: ' + gradeText(f.grade, gradeLabels)));

    if (dim) {
      const meaning = buildWhatThisMeans(dim, f.grade);
      if (meaning) card.appendChild(meaning);
      const action = actionFor(dim, f.grade);
      if (action) card.appendChild(el('p', 'zrc-action-text', action));
      card.appendChild(el('p', 'zrc-cite', dim.citation));
    }

    if (onEdit && dimensions) {
      const editBtn = el('button', 'zrc-link-btn zrc-noprint', 'Revisit this dimension');
      editBtn.type = 'button';
      editBtn.addEventListener('click', () => onEdit(dimensions.findIndex((d) => d.id === f.id)));
      card.appendChild(editBtn);
    }

    list.appendChild(card);
  });
  section.appendChild(list);
  return section;
}

function buildOneRungUp(s, byId, gradeLabels, redLineCovered) {
  const section = el('section', 'zrc-onerungup-section');
  section.appendChild(el('h2', 'zrc-h2', 'Your next move: one rung up'));
  section.appendChild(el('p', 'zrc-section-lede', 'The three dimensions where moving up one letter would help the most.'));

  if (s.oneRungUp.length === 0) {
    section.appendChild(el('p', null, 'Not enough is answered yet to rank a next move, or every graded dimension is already at A.'));
    return section;
  }

  const list = el('div', 'zrc-onerungup-list');
  s.oneRungUp.forEach((r) => {
    /* C3: this dimension already has a full card in the red-line panel
       above - repeating it here read as three overlapping lists rather
       than one diagnosis, so this cross-references instead. */
    if (redLineCovered.has(r.id)) {
      list.appendChild(buildSeeAboveCard('zrc-onerungup-card', r.leg, r.id, r.name));
      return;
    }
    const dim = byId[r.id];
    const card = el('div', 'zrc-onerungup-card');
    card.appendChild(el('div', 'zrc-onerungup-leg', LEG_NAMES[r.leg] + ' · ' + r.id));
    card.appendChild(el('h3', null, r.name));
    card.appendChild(el(
      'div',
      'zrc-onerungup-transition',
      'Currently ' + gradeText(r.current, gradeLabels) + '. Target: ' + gradeText(r.target, gradeLabels) + '.'
    ));
    const meaning = buildWhatThisMeans(dim, r.current);
    if (meaning) card.appendChild(meaning);
    const action = actionFor(dim, r.current);
    if (action) card.appendChild(el('p', 'zrc-action-text', action));
    list.appendChild(card);
  });
  section.appendChild(list);
  return section;
}

function buildActionPlan(dimensions, grades, gradeLabels, onEdit, redLineCovered) {
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
    /* C3: same cross-reference rule as one-rung-up above, against the
       same red-line coverage set, so "already shown above" means one
       thing everywhere on this screen. */
    if (redLineCovered.has(d.id)) {
      list.appendChild(buildSeeAboveCard('zrc-actionplan-card', d.leg, d.id, d.name));
      return;
    }
    const g = grades[d.id];
    const card = el('div', 'zrc-actionplan-card');

    const head = el('div', 'zrc-actionplan-head');
    head.appendChild(el('span', 'zrc-actionplan-leg', LEG_NAMES[d.leg] + ' · ' + d.id));
    head.appendChild(el('span', 'zrc-actionplan-grade', gradeText(g, gradeLabels)));
    card.appendChild(head);

    card.appendChild(el('h3', null, d.name));

    const meaning = buildWhatThisMeans(d, g);
    if (meaning) card.appendChild(meaning);
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
