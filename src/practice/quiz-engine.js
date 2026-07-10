/* Ziptility practice tests: DOM state machine, ported from
   web/practice-tests/engine/quiz.js. initQuiz(rootEl, bank, cfg, {onExit})
   is a factory: all session state lives in its closure (no window globals,
   no module-level mutable state), so multiple banks/instances can coexist
   on one page. See quiz-logic.js for the pure math/draw/score functions
   this file calls into. */
import { fmtClock, sizesAvailable, examMinutes, drawQuestions, scoreAttempt, weakestFirstDomains } from './quiz-logic.js';

/* quiz.js L58-63 */
const DOMAIN_LABELS = {
  MATH: 'Operator math', CHEM: 'Chemistry', MICRO: 'Microbiology',
  REGS: 'Regulations', SAMP: 'Sampling', SAFE: 'Safety',
  PROC: 'Process control', EQIP: 'Equipment', ADMIN: 'Administration',
  Multiple: 'Mixed topics'
};

/* quiz.js L28-41. Guarded localStorage; init must survive an environment
   where these throw (calculator sandbox rule, inherited). */
function lsGet(key) {
  try { return window.localStorage.getItem(key); } catch (e) { return null; }
}
function lsSet(key, val) {
  try { window.localStorage.setItem(key, val); } catch (e) { /* storage unavailable: degrade quietly */ }
}
function lsDel(key) {
  try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
}
function readJSON(key) {
  const raw = lsGet(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

/* quiz.js L73-79 (el/clear). No global ids: everything is looked up
   through rootEl so multiple instances never collide. */
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}
function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/* Trailing-arrow rule (sheet): primaries get this on forward-motion
   actions (Start, Next, See results) only. Label lives in its own span so
   a later relabel (the Start button's mode/size summary) can't clobber
   the arrow icon the way a raw .textContent write would. */
const ARROW_PATH = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
function btn(text, cls, { arrow = false } = {}) {
  const b = el('button', cls);
  b.type = 'button';
  const label = el('span', 'zq-btn-label', text);
  b.appendChild(label);
  if (arrow) {
    const span = document.createElement('span');
    span.className = 'zq-arrow';
    span.innerHTML = ARROW_PATH;
    b.appendChild(span);
  }
  return b;
}
function setBtnLabel(b, text) {
  const label = b.querySelector('.zq-btn-label');
  if (label) label.textContent = text;
}

export function initQuiz(rootEl, bank, cfg, { onExit } = {}) {
  const KEY_SESSION = 'zpt-pt-session-' + bank.id;
  const KEY_HISTORY = 'zpt-pt-history-' + bank.id;
  const KEY_SEEN = 'zpt-pt-seen-' + bank.id;

  const byId = {};
  for (const q of bank.questions) byId[q.id] = q;

  /* Stable chrome: the live region survives every render (renders only
     clear+rebuild `stage`), matching the original template's live region
     living outside the JS-managed #zq-root. */
  clear(rootEl);
  const stage = el('div');
  const live = el('div', 'zq-visually-hidden');
  live.setAttribute('aria-live', 'polite');
  rootEl.appendChild(stage);
  rootEl.appendChild(live);
  function announce(text) { live.textContent = text; }

  let state = null; /* { mode, size, qs:[{q, order, correctPos}], idx, answers:{}, checked:{}, remainingSec, timerId } */
  const pick = { mode: 'practice', size: null };

  /* ---------- session persistence (quiz.js L134-170) ---------- */
  function saveSession() {
    if (!state) return;
    lsSet(KEY_SESSION, JSON.stringify({
      v: 1,
      bankVersion: bank.version || '',
      mode: state.mode,
      size: state.size,
      qids: state.qs.map((it) => it.q.id),
      orders: state.qs.map((it) => it.order),
      answers: state.answers,
      checked: state.checked,
      idx: state.idx,
      remainingSec: state.remainingSec
    }));
  }
  function loadSession() {
    const s = readJSON(KEY_SESSION);
    if (!s || s.v !== 1 || s.bankVersion !== (bank.version || '')) return null;
    if (!s.qids || !s.qids.length) return null;
    for (const qid of s.qids) if (!byId[qid]) return null;
    return s;
  }
  function dropSession() { lsDel(KEY_SESSION); }
  function pushHistory(entry) {
    let h = readJSON(KEY_HISTORY) || [];
    h.unshift(entry);
    if (h.length > 25) h = h.slice(0, 25);
    lsSet(KEY_HISTORY, JSON.stringify(h));
  }
  function markSeen(qids) {
    let seen = readJSON(KEY_SEEN) || [];
    let merged = seen.concat(qids);
    if (merged.length > 600) merged = merged.slice(merged.length - 600);
    lsSet(KEY_SEEN, JSON.stringify(merged));
  }

  /* ---------- start screen (quiz.js L172-265) ---------- */
  function renderStart() {
    stopTimer();
    state = null;
    clear(stage);

    const head = el('div');
    head.appendChild(el('span', 'zq-badge', cfg.badge || bank.discipline || ''));
    head.appendChild(el('h2', 'zq-title', cfg.title || bank.title));
    stage.appendChild(head);
    /* PORT-NOTE: the old test-template.html also rendered a multi-paragraph
       .zq-intro blurb here (manifest.json's per-test "intro" prose) and a
       static .zq-note disclaimer after #zq-root. Neither has a call site in
       this bundle: .zq-intro's source data isn't part of manifest.js's
       TESTS shape, and .zq-note was page-shell copy in the old template
       (same lane as the deleted header/footer/FAQ). Both classes are still
       styled per the sheet's per-element table so Webflow page-body copy
       can adopt them, but this file renders neither. */

    const saved = loadSession();
    if (saved) {
      const box = el('div', 'zq-resume');
      const msg = el('div');
      msg.appendChild(el('strong', null, 'You have a test in progress. '));
      msg.appendChild(document.createTextNode(
        (saved.mode === 'exam' ? 'Timed exam' : 'Practice') + ', question ' +
        (saved.idx + 1) + ' of ' + saved.qids.length + '.'));
      box.appendChild(msg);
      const btns = el('div', 'zq-navrow');
      const resume = btn('Resume', 'zq-btn zq-btn-primary', { arrow: true });
      resume.addEventListener('click', () => resumeSession(saved));
      const discard = btn('Discard', 'zq-btn zq-btn-quiet');
      discard.addEventListener('click', () => { dropSession(); renderStart(); });
      btns.appendChild(resume); btns.appendChild(discard);
      box.appendChild(btns);
      stage.appendChild(box);
    }

    const card = el('div', 'zq-card');
    card.appendChild(el('h2', null, 'Set up your test'));

    const modeGrid = el('div', 'zq-mode-grid');
    const modes = [
      { id: 'practice', name: 'Practice', desc: 'Check each answer as you go. Every question shows a plain-English explanation.' },
      { id: 'exam', name: 'Timed exam', desc: 'No feedback until the end, with a clock running. The closest thing to test day.' }
    ];
    const modeBtns = {};
    modes.forEach((m) => {
      const modeBtn = el('button', 'zq-mode' + (pick.mode === m.id ? ' zq-selected' : ''));
      modeBtn.type = 'button';
      modeBtn.appendChild(el('h3', null, m.name));
      modeBtn.appendChild(el('p', null, m.desc));
      modeBtn.addEventListener('click', () => {
        pick.mode = m.id;
        for (const k in modeBtns) modeBtns[k].classList.toggle('zq-selected', k === m.id);
        syncStartLabel();
      });
      modeBtns[m.id] = modeBtn;
      modeGrid.appendChild(modeBtn);
    });
    card.appendChild(modeGrid);

    const sizes = sizesAvailable(bank.questions.length);
    if (pick.size === null || sizes.indexOf(pick.size) === -1) pick.size = sizes[0];
    const sizeRow = el('div', 'zq-size-row');
    const sizeBtns = {};
    sizes.forEach((n) => {
      const sizeBtn = el('button', 'zq-size' + (pick.size === n ? ' zq-selected' : ''));
      sizeBtn.type = 'button';
      sizeBtn.appendChild(document.createTextNode(n === bank.questions.length && sizes.length > 1 ? 'All ' + n : String(n)));
      sizeBtn.appendChild(el('small', null, 'questions'));
      sizeBtn.addEventListener('click', () => {
        pick.size = n;
        for (const k in sizeBtns) sizeBtns[k].classList.toggle('zq-selected', Number(k) === n);
        syncStartLabel();
      });
      sizeBtns[n] = sizeBtn;
      sizeRow.appendChild(sizeBtn);
    });
    card.appendChild(sizeRow);

    const startRow = el('div', 'zq-navrow');
    const startBtn = btn('', 'zq-btn zq-btn-primary', { arrow: true });
    startBtn.addEventListener('click', () => startTest(pick.mode, pick.size));
    startRow.appendChild(startBtn);
    card.appendChild(startRow);
    stage.appendChild(card);

    function syncStartLabel() {
      setBtnLabel(startBtn, pick.mode === 'exam'
        ? 'Start timed exam (' + pick.size + ' questions, ' + examMinutes(pick.size, bank.refCount, bank.questions.length, bank.durationMin) + ' min)'
        : 'Start practice (' + pick.size + ' questions)');
    }
    syncStartLabel();

    const hist = readJSON(KEY_HISTORY) || [];
    if (hist.length) {
      let best = 0;
      for (const h of hist) if (h.scorePct > best) best = h.scorePct;
      stage.appendChild(el('p', 'zq-best', 'Your best score on this test so far: ' + best + ' percent. Attempts: ' + hist.length + '.'));
    }
  }

  /* ---------- run (quiz.js L267-322) ---------- */
  function startTest(mode, size) {
    dropSession();
    const seenIds = readJSON(KEY_SEEN) || [];
    state = {
      mode, size,
      qs: drawQuestions(bank.questions, seenIds, size),
      idx: 0,
      answers: {},
      checked: {},
      remainingSec: mode === 'exam' ? examMinutes(size, bank.refCount, bank.questions.length, bank.durationMin) * 60 : 0,
      timerId: null
    };
    saveSession();
    if (mode === 'exam') startTimer();
    renderQuestion();
  }

  function resumeSession(s) {
    state = {
      mode: s.mode,
      size: s.size,
      qs: s.qids.map((qid, i) => {
        const q = byId[qid];
        const order = s.orders[i];
        return { q, order, correctPos: order.indexOf(q.correctIndex) };
      }),
      idx: s.idx || 0,
      answers: s.answers || {},
      checked: s.checked || {},
      remainingSec: s.remainingSec || 0,
      timerId: null
    };
    if (state.mode === 'exam') startTimer();
    renderQuestion();
  }

  /* Tick effects factored out of the interval callback so the debug hook
     can trigger the same path (DOM update / autosave-at-15s / auto-submit
     at 0) after forcing remainingSec, without an extra decrement. */
  function applyTick() {
    const timerEl = rootEl.querySelector('.zq-timer');
    if (timerEl) {
      timerEl.textContent = fmtClock(Math.max(0, state.remainingSec));
      timerEl.classList.toggle('zq-low', state.remainingSec <= 120);
    }
    if (state.remainingSec % 15 === 0) saveSession();
    if (state.remainingSec <= 0) {
      announce('Time is up. Scoring your exam.');
      finish();
    }
  }
  function startTimer() {
    stopTimer();
    state.timerId = setInterval(() => {
      state.remainingSec -= 1;
      applyTick();
    }, 1000);
  }
  function stopTimer() {
    if (state && state.timerId) { clearInterval(state.timerId); state.timerId = null; }
  }

  function renderQuestion() {
    clear(stage);
    const item = state.qs[state.idx];
    const q = item.q;
    const n = state.qs.length;
    const isChecked = !!state.checked[state.idx];
    const selected = (state.idx in state.answers) ? state.answers[state.idx] : null;

    const top = el('div', 'zq-topbar');
    const left = el('div');
    left.appendChild(document.createTextNode('Question ' + (state.idx + 1) + ' of ' + n + '  '));
    left.appendChild(el('span', 'zq-domchip', DOMAIN_LABELS[q.domain] || q.domain || 'General'));
    top.appendChild(left);
    if (state.mode === 'exam') {
      const timer = el('span', 'zq-timer', fmtClock(Math.max(0, state.remainingSec)));
      if (state.remainingSec <= 120) timer.classList.add('zq-low');
      top.appendChild(timer);
    }
    stage.appendChild(top);

    const bar = el('div', 'zq-progressbar');
    const fill = el('i');
    fill.style.width = Math.round(100 * state.idx / n) + '%';
    bar.appendChild(fill);
    stage.appendChild(bar);

    const card = el('div', 'zq-card');
    card.appendChild(el('div', 'zq-stem', q.text));

    const list = el('ul', 'zq-choices');
    const letters = ['A', 'B', 'C', 'D'];
    item.order.forEach((origIdx, pos) => {
      const li = el('li');
      const choiceBtn = el('button', 'zq-choice');
      choiceBtn.type = 'button';
      choiceBtn.appendChild(el('span', 'zq-letter', letters[pos]));
      choiceBtn.appendChild(el('span', null, q.choices[origIdx]));
      if (selected === pos) choiceBtn.classList.add('zq-selected');
      if (isChecked) {
        choiceBtn.disabled = true;
        if (pos === item.correctPos) { choiceBtn.classList.remove('zq-selected'); choiceBtn.classList.add('zq-correct'); }
        else if (selected === pos) { choiceBtn.classList.remove('zq-selected'); choiceBtn.classList.add('zq-wrong'); }
      } else {
        choiceBtn.addEventListener('click', () => selectChoice(pos));
      }
      li.appendChild(choiceBtn);
      list.appendChild(li);
    });
    card.appendChild(list);

    if (isChecked) card.appendChild(buildFeedback(item, selected));

    const nav = el('div', 'zq-navrow');
    if (state.mode === 'exam') {
      const prev = btn('Previous', 'zq-btn zq-btn-quiet');
      prev.disabled = state.idx === 0;
      prev.addEventListener('click', () => { state.idx -= 1; saveSession(); renderQuestion(); });
      nav.appendChild(prev);
      nav.appendChild(el('span', 'zq-spacer'));
      if (state.idx < n - 1) {
        const next = btn('Next', 'zq-btn zq-btn-primary', { arrow: true });
        next.addEventListener('click', () => { state.idx += 1; saveSession(); renderQuestion(); });
        nav.appendChild(next);
      }
      let answeredCount = 0;
      for (const a in state.answers) if (state.answers[a] !== null) answeredCount++;
      const submit = btn('Submit (' + answeredCount + '/' + n + ' answered)',
        state.idx === n - 1 ? 'zq-btn zq-btn-primary' : 'zq-btn zq-btn-secondary');
      submit.addEventListener('click', () => {
        if (answeredCount < n && !window.confirm('You have unanswered questions. Submit anyway?')) return;
        finish();
      });
      nav.appendChild(submit);
    } else {
      nav.appendChild(el('span', 'zq-spacer'));
      if (!isChecked) {
        const check = btn('Check answer', 'zq-btn zq-btn-primary');
        check.setAttribute('data-zq-check', '');
        check.disabled = selected === null;
        check.addEventListener('click', checkAnswer);
        nav.appendChild(check);
      } else {
        const fwd = btn(state.idx < n - 1 ? 'Next question' : 'See your score', 'zq-btn zq-btn-primary', { arrow: true });
        fwd.setAttribute('data-zq-next', '');
        fwd.addEventListener('click', () => {
          if (state.idx < n - 1) { state.idx += 1; saveSession(); renderQuestion(); }
          else finish();
        });
        nav.appendChild(fwd);
      }
    }
    card.appendChild(nav);
    stage.appendChild(card);

    /* must-fix 1: no window.scrollTo. Scroll the tool's own root into
       view instead (scroll-margin-top on .zq-wrap keeps it clear of a
       sticky header; see styles.css). */
    try { rootEl.scrollIntoView({ block: 'start' }); } catch (e) { /* ignore */ }
  }

  function selectChoice(pos) {
    state.answers[state.idx] = pos;
    saveSession();
    renderQuestion();
  }

  function checkAnswer() {
    if (!(state.idx in state.answers)) return;
    state.checked[state.idx] = true;
    saveSession();
    const item = state.qs[state.idx];
    announce(state.answers[state.idx] === item.correctPos ? 'Correct.' : 'Not quite. The explanation is shown below.');
    renderQuestion();
  }

  function buildFeedback(item, selected) {
    const q = item.q;
    const good = selected === item.correctPos;
    const box = el('div', 'zq-feedback ' + (good ? 'zq-ok' : 'zq-err'));
    box.appendChild(el('h4', good ? 'zq-okt' : 'zq-errt', good ? 'Correct' : 'Not quite'));
    if (q.explanation) box.appendChild(el('p', 'zq-explain', q.explanation));
    if (q.formula) box.appendChild(el('div', 'zq-formula', q.formula));
    if (q.citation) box.appendChild(el('div', 'zq-cite', 'Source: ' + q.citation));

    const links = el('div', 'zq-minilinks');
    if (q.calculator && cfg.calcUrl) {
      const run = el('a', null, 'Run this math in the Operator Calculator');
      run.href = cfg.calcUrl + '#' + q.calculator;
      run.target = '_blank'; run.rel = 'noopener';
      links.appendChild(run);
    }
    if (cfg.contactEmail) {
      const rep = el('a', null, 'Report a problem with this question');
      rep.href = 'mailto:' + cfg.contactEmail + '?subject=' + encodeURIComponent('Practice test question ' + q.id);
      links.appendChild(rep);
    }
    if (links.childNodes.length) box.appendChild(links);
    return box;
  }

  /* ---------- results (quiz.js L469-614) ---------- */
  function finish() {
    stopTimer();
    const { correct, n, pct, byDomain, missed } = scoreAttempt(state.qs, state.answers);

    pushHistory({
      date: new Date().toISOString().slice(0, 10),
      mode: state.mode, size: n, scorePct: pct
    });
    markSeen(state.qs.map((it) => it.q.id));
    dropSession();

    renderResults(pct, correct, n, byDomain, missed);
  }

  function renderResults(pct, correct, n, byDomain, missed) {
    clear(stage);
    const passed = pct >= 70;

    const hero = el('div', 'zq-card zq-score-hero');
    hero.appendChild(el('div', 'zq-score-num ' + (passed ? 'zq-pass' : 'zq-fail'), pct + '%'));
    /* Pass/fail stated in text, never color alone (sheet row 27). */
    hero.appendChild(el('div', 'zq-score-verdict ' + (passed ? 'zq-tag-ok' : 'zq-tag-err'),
      passed ? 'Pass at the 70 percent line' : 'Below the 70 percent line'));
    hero.appendChild(el('div', 'zq-score-sub', correct + ' of ' + n + ' correct' + (state.mode === 'exam' ? ' on a timed exam' : '')));
    hero.appendChild(el('p', 'zq-passnote',
      "Most states set the pass line at 70 percent. Your state's rules govern, so check your certification program for the real requirement."));
    announce('You scored ' + pct + ' percent, ' + correct + ' of ' + n + ' correct. ' +
      (passed ? 'That clears the 70 percent line.' : 'That is below the 70 percent line.'));

    const again = el('div', 'zq-navrow zq-navrow-center');
    /* Retake initiates a run, same as Start: carries the arrow (maestro
       ruling 2026-07-10, closing the port-note). */
    const retake = btn('Take it again (new draw)', 'zq-btn zq-btn-primary', { arrow: true });
    retake.addEventListener('click', () => startTest(state.mode, n));
    const changeSetup = btn('Change setup', 'zq-btn zq-btn-secondary');
    changeSetup.addEventListener('click', renderStart);
    /* must-fix 4: page navigation to CFG.hubUrl replaced with onExit().
       There is no page to navigate to, this is an in-place picker swap. */
    const allTests = btn('All practice tests', 'zq-btn zq-btn-quiet');
    allTests.addEventListener('click', () => { if (onExit) onExit(); });
    again.appendChild(retake); again.appendChild(changeSetup); again.appendChild(allTests);
    hero.appendChild(again);
    stage.appendChild(hero);

    const doms = Object.keys(byDomain);
    if (doms.length > 1) {
      const domCard = el('div', 'zq-card zq-dombars');
      domCard.appendChild(el('h3', null, 'Where you stand by topic'));
      weakestFirstDomains(byDomain).forEach((d) => {
        const r = byDomain[d];
        const p = Math.round(100 * r.ok / r.n);
        const row = el('div', 'zq-dombar' + (p < 70 ? ' zq-weak' : ''));
        const label = el('div', 'zq-domlabel');
        label.appendChild(el('span', null, (DOMAIN_LABELS[d] || d)));
        label.appendChild(el('span', null, r.ok + '/' + r.n + ' (' + p + '%)'));
        row.appendChild(label);
        const track = el('div', 'zq-track');
        const fillBar = el('span', 'zq-fill');
        fillBar.style.width = p + '%';
        track.appendChild(fillBar);
        row.appendChild(track);
        domCard.appendChild(row);
      });
      stage.appendChild(domCard);
    }

    if (missed.length) {
      const missCard = el('div', 'zq-card zq-missed');
      missCard.appendChild(el('h3', null, 'Review what you missed (' + missed.length + ')'));
      missed.forEach((m) => {
        const det = el('details');
        det.appendChild(el('summary', null, m.item.q.text));
        const body = el('div', 'zq-missed-body');
        const letters = ['A', 'B', 'C', 'D'];
        if (m.sel !== null && m.sel !== undefined) {
          const yours = el('p');
          yours.appendChild(el('span', 'zq-tag-err', 'Your answer: '));
          yours.appendChild(document.createTextNode(letters[m.sel] + '. ' + m.item.q.choices[m.item.order[m.sel]]));
          body.appendChild(yours);
        } else {
          const skip = el('p');
          skip.appendChild(el('span', 'zq-tag-err', 'Skipped.'));
          body.appendChild(skip);
        }
        const right = el('p');
        right.appendChild(el('span', 'zq-tag-ok', 'Correct answer: '));
        right.appendChild(document.createTextNode(letters[m.item.correctPos] + '. ' + m.item.q.choices[m.item.q.correctIndex]));
        body.appendChild(right);
        if (m.item.q.explanation) body.appendChild(el('p', 'zq-explain', m.item.q.explanation));
        if (m.item.q.formula) body.appendChild(el('div', 'zq-formula', m.item.q.formula));
        if (m.item.q.citation) body.appendChild(el('div', 'zq-cite', 'Source: ' + m.item.q.citation));
        det.appendChild(body);
        missCard.appendChild(det);
      });
      stage.appendChild(missCard);
    }

    /* must-fix 4 + sheet ruling 2026-07-10: the old CTA/demo band is gone.
       Reserved slot only, never rendered visible. */
    const captureSlot = el('div', 'zq-capture-slot');
    captureSlot.hidden = true;
    stage.appendChild(document.createComment(' soft-capture slot: reserved, ruling 2026-07-10 '));
    stage.appendChild(captureSlot);

    const hist = readJSON(KEY_HISTORY) || [];
    if (hist.length > 1) {
      const hCard = el('div', 'zq-card zq-history');
      hCard.appendChild(el('h3', null, 'Your attempts on this test'));
      const table = el('table');
      const thead = el('tr');
      ['Date', 'Mode', 'Questions', 'Score'].forEach((h) => thead.appendChild(el('th', null, h)));
      table.appendChild(thead);
      hist.slice(0, 8).forEach((e) => {
        const tr = el('tr');
        tr.appendChild(el('td', null, e.date));
        tr.appendChild(el('td', null, e.mode === 'exam' ? 'Timed' : 'Practice'));
        tr.appendChild(el('td', null, String(e.size)));
        tr.appendChild(el('td', null, e.scorePct + '%'));
        table.appendChild(tr);
      });
      hCard.appendChild(table);
      stage.appendChild(hCard);
    }
  }

  /* ---------- keyboard (quiz.js L618-631) ---------- */
  /* must-fix 3: guarded so an off-screen instance (multiple banks can
     coexist per page) never steals keys from whatever the visitor is
     actually looking at. */
  let inViewport = true;
  let observer = null;
  if (typeof IntersectionObserver === 'function') {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) inViewport = entry.isIntersecting;
    }, { threshold: 0 });
    observer.observe(rootEl);
  }
  function rootVisible() {
    if (observer) return inViewport;
    const r = rootEl.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
  }

  function onKeydown(ev) {
    if (!state) return;
    if (ev.target && (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA')) return;
    if (!rootVisible()) return;
    const k = ev.key;
    if (k >= '1' && k <= '4') {
      const pos = Number(k) - 1;
      if (!state.checked[state.idx]) { selectChoice(pos); ev.preventDefault(); }
    } else if (k === 'Enter') {
      const checkBtn = rootEl.querySelector('[data-zq-check]');
      const nextBtn = rootEl.querySelector('[data-zq-next]');
      if (checkBtn && !checkBtn.disabled) { checkAnswer(); ev.preventDefault(); }
      else if (nextBtn) { nextBtn.click(); ev.preventDefault(); }
    }
  }
  document.addEventListener('keydown', onKeydown);

  function destroy() {
    stopTimer();
    if (observer) observer.disconnect();
    document.removeEventListener('keydown', onKeydown);
    clear(rootEl);
  }

  /* test-only: forces remainingSec then runs the same per-tick effects a
     real interval fire would (DOM update, autosave-at-15s, auto-submit at
     0), without the extra decrement a real tick applies. */
  function __debugSetRemainingSec(n) {
    if (!state) return;
    state.remainingSec = n;
    applyTick();
  }

  renderStart();

  return { destroy, __debugSetRemainingSec };
}
