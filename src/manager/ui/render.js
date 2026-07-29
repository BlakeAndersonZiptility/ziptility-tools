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

// Which computed values headline the card, per tool - the "one number" the
// spec's Block 8 pattern asks for, plus enough context to not be color-alone.
const HIGHLIGHTS = {
  'repair-or-replace': [
    { k: 'verdict', label: 'Verdict', raw: true },
    { k: 'breaksYr', label: 'Your breaks/yr', f: fmt },
    { k: 'breakEvenN', label: 'Break-even breaks/yr', f: fmt },
    { k: 'annualRepair', label: 'Annual repair cost', f: money },
    { k: 'annualizedReplace', label: 'Annualized replacement cost', f: money }
  ],
  'cost-of-turnover': [
    { k: 'annualCost', label: 'Annual cost of churn', f: money },
    { k: 'breakEvenRaise', label: 'Retention-raise break-even ($/operator/yr)', f: money },
    { k: 'costPerDeparture', label: 'Cost per departure', f: money }
  ],
  'energy-cost': [
    { k: 'kwhPerKgal', label: 'kWh / 1,000 gal', f: fmt },
    { k: 'costPerKgal', label: '$ / 1,000 gal', f: money }
  ]
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
  return '<div class="zmt-seg" role="group" aria-label="' + escHtml(t.k) + '">' +
    t.options.map((o) => '<button type="button" data-v="' + escHtml(o.v) + '" aria-pressed="' + (o.v === t.def) + '">' + escHtml(o.label) + '</button>').join('') +
    '</div>';
}

export function renderTool(mount, tool) {
  mount.innerHTML = buildShell(tool);
  const stage = mount.querySelector('#zmt-stage');

  const groups = fieldGroups(tool);
  let toggleState = tool.toggle ? tool.toggle.def : null;

  const groupsHtml = groups.map((g) => {
    const normal = g.fields.filter((f) => !f.advanced);
    const advanced = g.fields.filter((f) => f.advanced);
    let html = (g.section ? '<h3 class="zmt-section">' + escHtml(g.section) + '</h3>' : '') +
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

  function renderResult(res) {
    resultEl.innerHTML = ''; msgEl.textContent = ''; msgEl.className = 'zmt-msg';
    if (res.error) { msgEl.textContent = res.error; return; }

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

    const hl = HIGHLIGHTS[tool.id] || [];
    const statsHtml = hl.map((h) => {
      const v = res.values[h.k];
      if (v == null) return '';
      const display = h.raw ? escHtml(String(v)) : escHtml(h.f ? h.f(v) : String(v));
      const isVerdict = h.k === 'verdict';
      const chipClass = isVerdict ? ' zmt-chip zmt-chip-' + (v === 'REPLACE' ? 'alert' : v === 'KEEP REPAIRING' ? 'good' : 'watch') : '';
      return '<div class="zmt-stat' + chipClass + '"><span class="zmt-stat-label">' + escHtml(h.label) + '</span><span class="zmt-stat-val">' + display + '</span></div>';
    }).join('');
    resultEl.innerHTML = '<div class="zmt-stats">' + statsHtml + '</div>';

    if (res.values.flagOutlier === true) {
      resultEl.innerHTML += '<div class="zmt-chip zmt-chip-watch zmt-flag">Outlier: ' + fmt(res.values.breaksPerMileYr) + ' breaks/mi/yr (>= 2x cohort avg of ' + fmt(res.values.cohortAvg) + ')</div>';
    }
    if (res.values.pmTriggered && res.values.pmTriggered.length) {
      res.values.pmTriggered.forEach((t) => { resultEl.innerHTML += '<div class="zmt-chip zmt-chip-watch zmt-flag">' + escHtml(t) + '</div>'; });
    }

    if (tool.interpret) {
      const ins = tool.interpret(res.values);
      if (ins) resultEl.innerHTML += '<div class="zmt-insight zmt-show zmt-' + ins.level + '"><span class="zmt-lead">Note</span>' + escHtml(ins.text) + '</div>';
    }

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
  const hl = HIGHLIGHTS[tool.id] || [];
  const parts = hl.map((h) => h.label + ': ' + (h.raw ? res.values[h.k] : (h.f ? h.f(res.values[h.k]) : res.values[h.k]))).filter(Boolean);
  return tool.title + ' -- ' + parts.join('; ');
}
