/* Manager toolbox - single-tool card renderer.
   Each page mounts exactly one tool (main.js resolves it by id from
   ?tool=/data-tool), so unlike the operator calculator's grid this renders
   one fields-in / result-out card: fields (grouped into the spec's named
   sections, with an "Advanced" disclosure for discount-rate-style extras),
   a Calculate/Clear/Print row, a colored verdict/insight panel, and (only
   after a result exists) the soft "email/print my result" affordance. */
import { UNITS } from '../../units.js';
import { buildShell, escHtml } from './template.js';
import { ENERGY_HISTORY_KEY } from '../config.js';
import { trackComplete } from '../../shared/analytics.js';

function fmt(x) {
  if (x == null || !isFinite(x)) return '';
  const n = Math.round(x * 1e6) / 1e6;
  if (Math.abs(n) >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return String(parseFloat(n.toFixed(4)));
}
function money(x) {
  if (x == null || !isFinite(x)) return '';
  const sign = x < 0 ? '-' : '';
  const abs = Math.abs(x);
  const decimals = abs < 100 ? 2 : 0;
  return sign + '$' + abs.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function safeGet(key) {
  try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}
function safeSet(key, obj) {
  try { window.localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { /* sandboxed iframe: ignore */ }
}

// Secondary stats, per tool - everything EXCEPT the one number promoted to
// the hero (see HERO below). Audit finding C2: a wall of 4-5 equal-weight
// tiles made a reader do mental math to see the size of the gap; the hero
// now carries that job, so these are supporting detail, not the headline.
const HIGHLIGHTS = {
  'repair-or-replace': [
    { k: 'breaksYr', label: 'Your breaks/yr', f: fmt },
    { k: 'breakEvenN', label: 'Break-even breaks/yr', f: fmt },
    { k: 'annualRepair', label: 'Annual repair cost', f: money },
    { k: 'annualizedReplace', label: 'Annualized replacement cost', f: money }
  ],
  'cost-of-turnover': [
    { k: 'breakEvenRaise', label: 'Retention-raise break-even ($/operator/yr)', f: money },
    { k: 'costPerDeparture', label: 'Cost per departure', f: money }
  ],
  'energy-cost': [
    { k: 'kwhPerKgal', label: 'kWh / 1,000 gal', f: fmt }
  ]
};

// THE HERO NUMBER (audit finding C2): one number per tool, promoted to a
// large Geist numeral, plus a status badge standing in for "the verdict".
// Pure presentation over res.values - no solve() math is computed here
// beyond a display-only ratio/format, so the solvers stay untouched.
// repair-or-replace has a real verdict field; the other two tools don't, so
// their badge is derived the same way their own interpret() derives a level.
const HERO = {
  'repair-or-replace': (m) => {
    let numeral = '--', caption = 'break-even ratio unavailable';
    if (m.breakEvenN > 0) {
      const ratio = m.breaksYr / m.breakEvenN;
      if (isFinite(ratio)) {
        const r = Math.round(ratio * 10) / 10;
        const rel = r > 1 ? 'over' : (r < 1 ? 'under' : 'at');
        numeral = fmt(r) + 'x';
        caption = rel + ' the break-even line';
      }
    }
    return {
      numeral, caption,
      badge: m.verdict,
      badgeClass: m.verdict === 'REPLACE' ? 'alert' : (m.verdict === 'KEEP REPAIRING' ? 'good' : 'watch')
    };
  },
  'cost-of-turnover': (m) => ({
    numeral: money(m.annualCost),
    caption: 'the annual cost of churn',
    badge: null,
    badgeClass: null
  }),
  'energy-cost': (m) => {
    const tripped = m.pmTriggered && m.pmTriggered.length > 0;
    return {
      numeral: money(m.costPerKgal),
      caption: 'per 1,000 gallons',
      badge: tripped ? 'PM check advised' : 'On track',
      badgeClass: tripped ? 'watch' : 'good'
    };
  }
};

function fieldGroups(tool) {
  const groups = [];
  let cur = null;
  tool.fields.forEach((f) => {
    const sec = f.section || '';
    if (!cur || cur.section !== sec) { cur = { section: sec, fields: [] }; groups.push(cur); }
    cur.fields.push(f);
  });
  return groups;
}

function unitSelectHtml(inputId, f) {
  const list = f.units || Object.keys(UNITS[f.unit]);
  const opts = list.map((u) => '<option value="' + u + '"' + (u === f.def ? ' selected' : '') + '>' + UNITS[f.unit][u].label + '</option>').join('');
  return '<select id="' + inputId + '__u" data-cur="' + f.def + '" aria-label="unit">' + opts + '</select>';
}

function fieldHtml(tool, f) {
  const id = 'zmt-' + tool.id + '-' + f.k;
  const isDefaultValue = !f.unit && f.def != null;
  const prefill = isDefaultValue ? ' value="' + escHtml(fmt(f.def)) + '"' : '';
  const input = '<input id="' + id + '" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="-"' + prefill + '>';
  const body = f.unit ? ('<div class="zmt-uf">' + input + unitSelectHtml(id, f) + '</div>') : input;
  const note = isDefaultValue ? '<div class="zmt-rot">Rule of thumb, use your own number.</div>' : '';
  return '<div class="zmt-field" data-k="' + f.k + '"><label for="' + id + '">' + escHtml(f.label) + '</label>' + body + note + '</div>';
}

function toggleHtml(tool) {
  if (!tool.toggle) return '';
  const t = tool.toggle;
  // Audit finding C4: this toggle can single-handedly override the verdict
  // (criticality forces REPLACE) but only ever had an aria-label, no visible
  // text. caption is a real on-screen label, styled like every field label,
  // wired to the group via aria-labelledby instead of aria-label.
  const caption = t.label || (t.k.charAt(0).toUpperCase() + t.k.slice(1));
  const labelId = 'zmt-toggle-label-' + tool.id + '-' + t.k;
  return '<div class="zmt-toggle-field">' +
    '<span class="zmt-toggle-caption" id="' + labelId + '">' + escHtml(caption) + '</span>' +
    '<div class="zmt-seg" role="group" aria-labelledby="' + labelId + '">' +
    t.options.map((o) => '<button type="button" data-v="' + escHtml(o.v) + '" aria-pressed="' + (o.v === t.def) + '">' + escHtml(o.label) + '</button>').join('') +
    '</div></div>';
}

export function renderTool(mount, tool) {
  mount.innerHTML = buildShell(tool);
  const stage = mount.querySelector('#zmt-stage');

  const groups = fieldGroups(tool);
  let toggleState = tool.toggle ? tool.toggle.def : null;

  const groupsHtml = groups.map((g) => {
    const normal = g.fields.filter((f) => !f.advanced);
    const advanced = g.fields.filter((f) => f.advanced);
    // Audit finding A4: this is the only heading between the page h1 and the
    // (usually hidden) modal h3, so it must be an h2 or the outline skips a
    // level (h1 -> h3 -> h3).
    let html = (g.section ? '<h2 class="zmt-section">' + escHtml(g.section) + '</h2>' : '') +
      '<div class="zmt-fields">' + normal.map((f) => fieldHtml(tool, f)).join('') + '</div>';
    if (advanced.length) {
      html += '<details class="zmt-advanced"><summary>Advanced</summary><div class="zmt-fields">' +
        advanced.map((f) => fieldHtml(tool, f)).join('') + '</div></details>';
    }
    return html;
  }).join('');

  stage.innerHTML =
    '<div class="zmt-card">' +
    '<div class="zmt-card-head"><div class="zmt-formula">' + escHtml(tool.formula) + '</div>' + toggleHtml(tool) + '</div>' +
    groupsHtml +
    '<div class="zmt-actions">' +
    '<button class="zmt-btn zmt-btn-calc" id="zmt-calc" type="button">Calculate</button>' +
    '<button class="zmt-btn zmt-btn-clear" id="zmt-clear" type="button">Clear</button>' +
    '<button class="zmt-btn zmt-btn-print" id="zmt-print" type="button">Print / PDF</button>' +
    '</div>' +
    '<div class="zmt-msg" id="zmt-msg" aria-live="polite"></div>' +
    '<div class="zmt-result" id="zmt-result" aria-live="polite"></div>' +
    '<div class="zmt-links" id="zmt-links"></div>' +
    '<button class="zmt-capture-open" id="zmt-capture-open" type="button" hidden>Email or print this result</button>' +
    '</div>';

  if (tool.links && tool.links.length) {
    const linksEl = mount.querySelector('#zmt-links');
    linksEl.innerHTML = 'Learn more: ' + tool.links.map((l) => '<a href="' + l.href + '" target="_blank" rel="noopener">' + escHtml(l.label) + '</a>').join(' &middot; ');
  }

  const inputs = {};
  tool.fields.forEach((f) => { inputs[f.k] = mount.querySelector('#zmt-' + tool.id + '-' + f.k); });

  function rawNum(el) {
    if (!el) return null;
    const raw = el.value.replace(/,/g, '').trim();
    if (raw === '') return null;
    const n = parseFloat(raw);
    return isFinite(n) ? n : null;
  }
  function unitSelFor(el) { return mount.querySelector('#' + el.id + '__u'); }
  function readField(f) {
    const el = inputs[f.k];
    const n = rawNum(el);
    if (n == null) return null;
    if (f.unit) { const sel = unitSelFor(el); return n * UNITS[f.unit][sel.value].f; }
    return n;
  }
  function writeField(f, baseVal) {
    const el = inputs[f.k];
    if (!el) return;
    if (f.unit) { const sel = unitSelFor(el); el.value = fmt(baseVal / UNITS[f.unit][sel.value].f); }
    else el.value = fmt(baseVal);
  }

  // Unit-field rescale on unit change (same idiom as the operator calculator).
  tool.fields.forEach((f) => {
    if (!f.unit) return;
    const el = inputs[f.k]; const sel = unitSelFor(el);
    sel.addEventListener('change', () => {
      const oldU = sel.dataset.cur, newU = sel.value;
      const cur = rawNum(el);
      if (cur != null) el.value = fmt(cur * UNITS[f.unit][oldU].f / UNITS[f.unit][newU].f);
      sel.dataset.cur = newU;
    });
  });

  if (tool.toggle) {
    mount.querySelectorAll('.zmt-seg button').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.v === toggleState) return;
      toggleState = b.dataset.v;
      mount.querySelectorAll('.zmt-seg button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === toggleState)));
    }));
  }

  // energy-cost only: guarded localStorage prefill of the prior-period fields.
  if (tool.id === 'energy-cost') {
    const hist = safeGet(ENERGY_HISTORY_KEY);
    if (hist) {
      const map = { kwhPrior: 'kwh', gallonsPrior: 'gallons', startsPerDayPrior: 'startsPerDay', specificCapacityPrior: 'specificCapacity' };
      Object.keys(map).forEach((priorKey) => {
        const el = inputs[priorKey];
        if (el && !el.value && hist[map[priorKey]] != null) el.value = fmt(hist[map[priorKey]]);
      });
    }
  }

  const msgEl = mount.querySelector('#zmt-msg');
  const resultEl = mount.querySelector('#zmt-result');
  const captureBtn = mount.querySelector('#zmt-capture-open');
  let completeSent = false;

  function renderResult(res) {
    resultEl.innerHTML = ''; msgEl.textContent = ''; msgEl.className = 'zmt-msg';
    if (res.error) { msgEl.textContent = res.error; return; }

    /* COMPLETION. Emitted here and nowhere else, because this is the first
       line past the error guard: a verdict is on screen. An input change or
       a Calculate click that failed validation is NOT a completion.
       ONCE PER PAGE LOAD. These tools are built to be played with (change the
       rate, recalculate), and counting every recalculation as a completion
       would inflate the lane's primary KPI by however many times one person
       tweaked an input. Iteration depth is a real signal but a DIFFERENT one,
       and conflating the two corrupts the number that matters. */
    if (!completeSent) {
      completeSent = true;
      trackComplete(tool.id, { verdict: res.verdict && res.verdict.label });
    }

    // Write auto-filled values back into their own inputs (e.g. breaksYr).
    tool.fields.forEach((f) => {
      if (f.k in res.values) {
        const val = res.values[f.k];
        if (typeof val === 'number' && isFinite(val) && res.computed.includes(f.k)) {
          writeField(f, val);
          if (inputs[f.k]) inputs[f.k].classList.add('zmt-computed');
        }
      }
    });

    // Audit finding C2 (THE HERO NUMBER): one number per tool renders large,
    // alongside a verdict/status badge, above everything else.
    const heroFn = HERO[tool.id];
    const hero = heroFn ? heroFn(res.values) : null;
    let html = '';
    if (hero) {
      const badgeHtml = hero.badge
        ? '<div class="zmt-badge zmt-badge-' + hero.badgeClass + '">' + escHtml(hero.badge) + '</div>'
        : '';
      html += '<div class="zmt-hero">' + badgeHtml +
        '<div class="zmt-hero-num">' + escHtml(hero.numeral) + '</div>' +
        '<div class="zmt-hero-label">' + escHtml(hero.caption) + '</div>' +
        '</div>';
    }

    // Audit finding C3 (LEAD WITH MEANING): the plain-English sentence moves
    // directly under the hero, before the reader ever hits a stat tile.
    if (tool.interpret) {
      const ins = tool.interpret(res.values);
      if (ins) html += '<div class="zmt-insight zmt-show zmt-' + ins.level + '"><span class="zmt-lead">Note</span>' + escHtml(ins.text) + '</div>';
    }

    const hl = HIGHLIGHTS[tool.id] || [];
    const statsHtml = hl.map((h) => {
      const v = res.values[h.k];
      if (v == null) return '';
      const display = escHtml(h.f ? h.f(v) : String(v));
      return '<div class="zmt-stat"><span class="zmt-stat-label">' + escHtml(h.label) + '</span><span class="zmt-stat-val">' + display + '</span></div>';
    }).join('');
    html += '<div class="zmt-stats">' + statsHtml + '</div>';

    if (res.values.flagOutlier === true) {
      html += '<div class="zmt-chip zmt-chip-watch zmt-flag">Outlier: ' + fmt(res.values.breaksPerMileYr) + ' breaks/mi/yr (>= 2x cohort avg of ' + fmt(res.values.cohortAvg) + ')</div>';
    }
    if (res.values.pmTriggered && res.values.pmTriggered.length) {
      res.values.pmTriggered.forEach((t) => { html += '<div class="zmt-chip zmt-chip-watch zmt-flag">' + escHtml(t) + '</div>'; });
    }

    resultEl.innerHTML = html;

    // energy-cost only: save this period as the next period's "prior", guarded.
    if (tool.id === 'energy-cost') {
      const save = {};
      ['kwh', 'gallons', 'startsPerDay', 'specificCapacity'].forEach((k) => { if (res.values[k] != null) save[k] = res.values[k]; });
      const v2 = { kwh: rawNum(inputs.kwh), gallons: rawNum(inputs.gallons), startsPerDay: rawNum(inputs.startsPerDay), specificCapacity: rawNum(inputs.specificCapacity) };
      safeSet(ENERGY_HISTORY_KEY, v2);
    }

    // Soft capture only reveals AFTER a successful result - never a gate.
    captureBtn.hidden = false;
    mount.dataset.zmtResultSummary = summarizeResult(tool, res);
  }

  function runCalc() {
    const v = {};
    tool.fields.forEach((f) => { v[f.k] = readField(f); });
    if (tool.toggle) v[tool.toggle.k] = toggleState;
    const res = tool.solve(v);
    renderResult(res);
  }

  mount.querySelector('#zmt-calc').addEventListener('click', runCalc);
  mount.querySelector('#zmt-clear').addEventListener('click', () => {
    tool.fields.forEach((f) => {
      const el = inputs[f.k]; if (!el) return;
      el.value = (!f.unit && f.def != null) ? fmt(f.def) : '';
      el.classList.remove('zmt-computed');
    });
    if (tool.toggle) {
      toggleState = tool.toggle.def;
      mount.querySelectorAll('.zmt-seg button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.v === toggleState)));
    }
    resultEl.innerHTML = ''; msgEl.textContent = ''; captureBtn.hidden = true;
  });
  mount.querySelector('#zmt-print').addEventListener('click', () => {
    try { window.print(); } catch (e) { /* no-op if print is unavailable */ }
  });
  tool.fields.forEach((f) => {
    const el = inputs[f.k]; if (!el) return;
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') runCalc(); });
    el.addEventListener('input', () => el.classList.remove('zmt-computed'));
  });
}

function summarizeResult(tool, res) {
  const parts = [];
  const heroFn = HERO[tool.id];
  const hero = heroFn ? heroFn(res.values) : null;
  if (hero) {
    if (hero.badge) parts.push('Verdict: ' + hero.badge);
    parts.push(hero.caption.charAt(0).toUpperCase() + hero.caption.slice(1) + ': ' + hero.numeral);
  }
  const hl = HIGHLIGHTS[tool.id] || [];
  parts.push(...hl.map((h) => h.label + ': ' + (h.f ? h.f(res.values[h.k]) : res.values[h.k])).filter(Boolean));
  return tool.title + ' -- ' + parts.join('; ');
}
