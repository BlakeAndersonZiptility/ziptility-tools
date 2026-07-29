// Practice bundle: end-to-end browser tests. Mirrors tests/browser.test.js's
// harness idioms (chromium.launch, a page.on('pageerror') listener that
// fails the run) but wraps each scenario in its own node:test test() so CI
// gets per-case pass/fail instead of one flat script.
//
// This bundle uses fetch() for its bank JSON (bank-loader.js), so unlike
// browser.test.js (which loads index.html via file://) this suite serves
// the repo root over a real local HTTP server — file:// fetch() is blocked
// by Chromium for cross-origin-looking requests and would just fail every
// test that loads a bank.
//
// Run `npm run build:practice:dev` + `node scripts/build-practice-banks.mjs`
// first (the before() hook below does this itself, so a bare
// `node tests/practice-browser.test.js` is always self-sufficient).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const BANK_ID = 'operator-math-1';
const KEY_SESSION = 'zpt-pt-session-' + BANK_ID;
const KEY_HISTORY = 'zpt-pt-history-' + BANK_ID;
const KEY_SEEN = 'zpt-pt-seen-' + BANK_ID;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

function startServer(root) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(req.url.split('?')[0]);
        const rel = urlPath === '/' ? '/practice.html' : urlPath;
        const filePath = path.join(root, rel);
        if (!filePath.startsWith(root)) { res.writeHead(403); res.end(); return; }
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      } catch (e) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found: ' + req.url);
      }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

let server, baseURL, browser;

before(async () => {
  execSync('npm run build:practice:dev', { cwd: ROOT, stdio: 'inherit' });
  execSync('node scripts/build-practice-banks.mjs', { cwd: ROOT, stdio: 'inherit' });
  server = await startServer(ROOT);
  const addr = server.address();
  baseURL = `http://127.0.0.1:${addr.port}`;
  browser = await chromium.launch();
});

after(async () => {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
});

/* Every test runs in its own browser context (own localStorage/session
   storage), so localStorage-heavy scenarios (resume, history, the
   throwing-stub guard test) never bleed into each other. A pageerror
   anywhere during the test fails it, same contract as browser.test.js's
   jsErrors tally. */
async function withPage(fn) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // main.js self-loads Archivo + Geist from Google Fonts on every boot (real
  // external network calls). Aborting them keeps this suite hermetic and
  // fast (no CDN round trip x 11 tests) without affecting anything we
  // assert on: getComputedStyle().fontFamily reflects the *declared* CSS
  // stack (styles.css, bundled inline) regardless of whether the actual
  // web font file ever loaded.
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', (e) => jsErrors.push(e.message));
  try {
    await fn(page, ctx);
    assert.deepEqual(jsErrors, [], 'page threw: ' + jsErrors.join('; '));
  } finally {
    await ctx.close();
  }
}

async function gotoPractice(page, query = '') {
  await page.goto(`${baseURL}/practice.html${query}`, { waitUntil: 'load' });
}

async function selectOperatorMathCard(page) {
  await page.waitForSelector('.zq-hubcard');
  await page.click('.zq-hubcard');
}

const SETUP_START_BTN = '.zq-card:has-text("Set up your test") .zq-btn-primary';

/* Picks a mode + the smallest available size (always first in
   sizesAvailable's output, quiz-logic.js) and starts the run. Returns the
   drawn size so callers don't have to hardcode 25. */
async function startRun(page, { mode = 'Practice' } = {}) {
  await page.waitForSelector('.zq-mode-grid');
  await page.click(`.zq-mode:has-text("${mode}")`);
  const sizeBtn = page.locator('.zq-size').first();
  await sizeBtn.click();
  const size = await sizeBtn.evaluate((el) => parseInt(el.firstChild.textContent, 10));
  await page.click(SETUP_START_BTN);
  await page.waitForSelector('.zq-topbar');
  return size;
}

/* Always clicks the first-listed choice (display position 0), checks it,
   then advances. Reading correct/wrong off THAT button after check is what
   lets callers tally their own score independent of quiz-engine.js's math. */
async function answerOne(page, { trackCorrectness = false } = {}) {
  const choice0 = page.locator('.zq-choice').first();
  await choice0.click();
  await page.click('[data-zq-check]');
  let wasCorrect = null;
  if (trackCorrectness) {
    const cls = (await choice0.getAttribute('class')) || '';
    wasCorrect = cls.includes('zq-correct');
  }
  await page.click('[data-zq-next]');
  return wasCorrect;
}

async function answerAll(page, n, opts = {}) {
  let correct = 0;
  for (let i = 0; i < n; i++) {
    if (await answerOne(page, opts)) correct++;
  }
  await page.waitForSelector('.zq-score-hero');
  return correct;
}

async function captureFirstQuestion(page) {
  const stem = await page.locator('.zq-stem').innerText();
  const choices = await page.locator('.zq-choices .zq-choice span:not(.zq-letter)').allInnerTexts();
  return { stem, choices: choices.join('|') };
}

/* Serves practice.html with extra attributes baked onto the mount div
   (data-test, data-child-pages, etc). Needed for anything that has to be
   set BEFORE main.js's defer script runs boot() -- unlike ?embed=app /
   ?test=, which main.js also reads from the URL, a data-* attribute has
   no query-string equivalent, so the only way to set it before boot is to
   have it already in the served markup. Reuses the same page.route idiom
   as tests 9 and 11 above rather than inventing a new server. */
async function gotoPracticeWithMountAttrs(page, attrs) {
  await page.route(`${baseURL}/practice.html`, async (route) => {
    const html = await readFile(path.join(ROOT, 'practice.html'), 'utf8');
    const extra = Object.entries(attrs).map(([k, v]) => ` ${k}="${v}"`).join('');
    const modified = html.replace(
      '<div id="ziptility-practice" data-bank-base="./dist/practice-banks/">',
      `<div id="ziptility-practice" data-bank-base="./dist/practice-banks/"${extra}>`
    );
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: modified });
  });
  await page.goto(`${baseURL}/practice.html`, { waitUntil: 'load' });
}

// ---------------------------------------------------------------------
// 1. Boot + picker
// ---------------------------------------------------------------------
test('boot + picker renders one card per manifest test with eyebrow/title/meta, zero pageerrors', async () => {
  const { TESTS } = await import('../src/practice/manifest.js');
  await withPage(async (page) => {
    await gotoPractice(page);
    await page.waitForSelector('.zq-hubcard');
    // Manifest-driven, not hard-coded: bank additions must not break boot.
    assert.equal(await page.locator('.zq-hubcard').count(), TESTS.length);
    // textContent, not innerText: .zq-eyebrow is text-transform:uppercase
    // in CSS (styles.css), so the rendered text is "OPERATOR MATH" even
    // though the underlying data (manifest.js discipline field) is
    // title-case — assert the data, not the CSS transform.
    for (let i = 0; i < TESTS.length; i++) {
      const card = page.locator('.zq-hubcard').nth(i);
      assert.equal(await card.locator('.zq-eyebrow').textContent(), TESTS[i].discipline);
      assert.equal(await card.locator('h3').innerText(), TESTS[i].title);
      const meta = await card.locator('.zq-meta').innerText();
      assert.match(meta, new RegExp(TESTS[i].questionCount + ' questions'));
      assert.match(meta, /practice or timed exam/);
    }
  });
});

// ---------------------------------------------------------------------
// 2. Full practice flow, score math verified against our own click tally
// ---------------------------------------------------------------------
test('full practice flow: setup through results, score math matches the click tally', async () => {
  await withPage(async (page) => {
    await gotoPractice(page);
    await selectOperatorMathCard(page);
    assert.equal(await page.locator('.zq-resume').count(), 0, 'no resume prompt on a fresh run');
    const size = await startRun(page, { mode: 'Practice' });
    const correct = await answerAll(page, size, { trackCorrectness: true });
    const expectedPct = Math.round((100 * correct) / size);
    const shownPct = parseInt(await page.locator('.zq-score-num').innerText(), 10);
    assert.equal(shownPct, expectedPct,
      `tallied ${correct}/${size} correct from DOM classes -> expected ${expectedPct}%, shown ${shownPct}%`);
    const sub = await page.locator('.zq-score-sub').innerText();
    assert.match(sub, new RegExp(`${correct} of ${size} correct`));
  });
});

// ---------------------------------------------------------------------
// 3. Two consecutive draws differ (retake)
// ---------------------------------------------------------------------
test('two consecutive draws differ: retake redraws question order / choice order', async () => {
  await withPage(async (page) => {
    await gotoPractice(page);
    await selectOperatorMathCard(page);
    const size = await startRun(page, { mode: 'Practice' });
    const firstDraw = await captureFirstQuestion(page);
    await answerAll(page, size);

    let lastDraw = firstDraw;
    let differs = false;
    for (let attempt = 0; attempt < 2 && !differs; attempt++) {
      await page.click('.zq-score-hero .zq-btn-primary'); // "Take it again (new draw)"
      await page.waitForSelector('.zq-topbar');
      lastDraw = await captureFirstQuestion(page);
      differs = lastDraw.stem !== firstDraw.stem || lastDraw.choices !== firstDraw.choices;
      // retry once internally (astronomically rare identical-shuffle case):
      // finish this draw so we can hit "take it again" a second time.
      if (!differs && attempt === 0) await answerAll(page, size);
    }
    assert.ok(differs,
      `two consecutive draws were identical across retries (stem: "${firstDraw.stem}")`);
  });
});

// ---------------------------------------------------------------------
// 4. Timed exam autosubmit via the test-only debug hook
// ---------------------------------------------------------------------
test('timed exam autosubmit: forcing remainingSec to 2s fires finish() within ~3s', async () => {
  await withPage(async (page) => {
    await gotoPractice(page);
    await page.waitForSelector('.zq-hubcard');
    // set BEFORE selecting the test: selectTest's loadBank().then() reads
    // mount.dataset.debug at bank-resolve time, but setting it early keeps
    // this test-only opt-in unambiguous.
    await page.evaluate(() => { document.getElementById('ziptility-practice').dataset.debug = '1'; });
    await page.click('.zq-hubcard');
    await startRun(page, { mode: 'Timed exam' });
    await page.waitForSelector('.zq-timer');
    await page.evaluate(() => {
      document.getElementById('ziptility-practice').__zqDebug.__debugSetRemainingSec(2);
    });
    // the one sanctioned sleep: the real setInterval needs ~2 real ticks
    // (1s apart) to walk remainingSec down to 0 and call finish().
    await page.waitForTimeout(3000);
    await page.waitForSelector('.zq-score-hero', { timeout: 5000 });
  });
});

// ---------------------------------------------------------------------
// 5. localStorage keys: session while running, history+seen after finish,
//    resume restores question position
// ---------------------------------------------------------------------
test('localStorage keys exist at the right lifecycle points; resume restores position', async () => {
  await withPage(async (page) => {
    await gotoPractice(page);
    await selectOperatorMathCard(page);
    const size = await startRun(page, { mode: 'Practice' });

    const sessionRaw = await page.evaluate((k) => window.localStorage.getItem(k), KEY_SESSION);
    assert.ok(sessionRaw, 'session key should exist once a run has started');
    const session = JSON.parse(sessionRaw);
    assert.equal(session.mode, 'practice');
    assert.equal(session.qids.length, size);

    await answerAll(page, size);

    const [historyRaw, seenRaw, sessionAfterFinish] = await page.evaluate(
      ([hk, sk, ssk]) => [window.localStorage.getItem(hk), window.localStorage.getItem(sk), window.localStorage.getItem(ssk)],
      [KEY_HISTORY, KEY_SEEN, KEY_SESSION]
    );
    assert.ok(historyRaw, 'history key should exist after finishing');
    const history = JSON.parse(historyRaw);
    assert.ok(history.length >= 1);
    assert.equal(history[0].size, size);
    assert.equal(typeof history[0].scorePct, 'number');
    const seen = JSON.parse(seenRaw);
    assert.equal(seen.length, size);
    assert.equal(sessionAfterFinish, null, 'session key should be dropped once a run finishes');

    // resume: retake, advance a couple questions (idx 0 -> 2), reload,
    // reselect the same test, resume, and confirm the position stuck.
    await page.click('.zq-score-hero .zq-btn-primary'); // retake
    await page.waitForSelector('.zq-topbar');
    await answerOne(page); // idx 0 -> 1
    await answerOne(page); // idx 1 -> 2
    const topbarBefore = await page.locator('.zq-topbar').innerText();
    assert.match(topbarBefore, /Question 3 of/);

    await page.reload({ waitUntil: 'load' });
    await selectOperatorMathCard(page);
    await page.waitForSelector('.zq-resume');
    const resumeText = await page.locator('.zq-resume').innerText();
    assert.match(resumeText, /question 3 of/i);
    await page.click('.zq-resume .zq-btn-primary'); // Resume
    await page.waitForSelector('.zq-topbar');
    const topbarAfter = await page.locator('.zq-topbar').innerText();
    assert.match(topbarAfter, /Question 3 of/);
  });
});

// ---------------------------------------------------------------------
// 6. localStorage throwing-stub: boot + a full round still complete
// ---------------------------------------------------------------------
test('localStorage throwing-stub: app still boots to picker and completes a full round', async () => {
  await withPage(async (page) => {
    await page.addInitScript(() => {
      // Preferred: make window.localStorage itself throw on access.
      // Fallback (some engines mark the accessor non-configurable): throw
      // from the Storage.prototype instance methods instead, which is what
      // lsGet/lsSet/lsDel (quiz-engine.js) actually call through.
      try {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get() { throw new Error('localStorage blocked (test stub)'); }
        });
      } catch (e) {
        const store = window.localStorage;
        for (const m of ['getItem', 'setItem', 'removeItem']) {
          store[m] = () => { throw new Error('localStorage blocked (test stub)'); };
        }
      }
    });
    await gotoPractice(page);
    await selectOperatorMathCard(page);
    const size = await startRun(page, { mode: 'Practice' });
    await answerAll(page, size);
    assert.equal(await page.locator('.zq-score-hero').count(), 1);
  });
});

// ---------------------------------------------------------------------
// 7. Keyboard viewport guard
// ---------------------------------------------------------------------
test('keyboard viewport guard: number keys are ignored off-screen, accepted on-screen', async () => {
  await withPage(async (page) => {
    await gotoPractice(page);
    await selectOperatorMathCard(page);
    await startRun(page, { mode: 'Practice' });

    await page.evaluate(() => {
      const before = document.createElement('div');
      before.style.height = '2000px';
      document.body.insertBefore(before, document.body.firstChild);
      const after = document.createElement('div');
      after.style.height = '2000px';
      document.body.appendChild(after);
    });

    // scroll to the very top: the mount (pushed down by the 2000px spacer
    // above it) now sits below the fold, fully out of view.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.waitForFunction(() => {
      const r = document.getElementById('ziptility-practice').getBoundingClientRect();
      return r.top >= window.innerHeight || r.bottom <= 0;
    });
    await page.keyboard.press('1');
    assert.equal(await page.locator('.zq-choice.zq-selected').count(), 0,
      'a number key press while scrolled out of view must not select a choice');

    await page.evaluate(() => document.getElementById('ziptility-practice').scrollIntoView({ block: 'center' }));
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.waitForFunction(() => {
      const r = document.getElementById('ziptility-practice').getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    });
    await page.keyboard.press('1');
    assert.equal(await page.locator('.zq-choice.zq-selected').count(), 1,
      'a number key press once back in view should select the first choice');
  });
});

// ---------------------------------------------------------------------
// 8. Computed styles
// ---------------------------------------------------------------------
test('computed styles: DS4 tokens (colors, radii, fonts) and focus-visible outline', async () => {
  await withPage(async (page) => {
    await gotoPractice(page);
    await selectOperatorMathCard(page);
    await page.waitForSelector('.zq-mode-grid');

    const rootColor = await page.locator('#ziptility-practice').evaluate((el) => getComputedStyle(el).color);
    assert.equal(rootColor, 'rgb(71, 85, 105)');

    const titleColor = await page.locator('.zq-title').evaluate((el) => getComputedStyle(el).color);
    assert.equal(titleColor, 'rgb(12, 31, 48)');

    const startBtn = page.locator(SETUP_START_BTN);
    assert.equal(await startBtn.evaluate((el) => getComputedStyle(el).fontSize), '20px');
    assert.equal(await startBtn.evaluate((el) => getComputedStyle(el).backgroundColor), 'rgb(255, 68, 47)');

    await page.keyboard.press('Tab');
    const focusInfo = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        cls: el.className,
        outlineColor: getComputedStyle(el).outlineColor,
        isFocusVisible: el.matches(':focus-visible')
      };
    });
    assert.ok(/zq-(mode|size|btn|hubcard)/.test(focusInfo.cls),
      `expected Tab to land inside the tool, got class="${focusInfo.cls}"`);
    assert.ok(focusInfo.isFocusVisible, 'Tab-focus should match :focus-visible');
    assert.equal(focusInfo.outlineColor, 'rgb(0, 136, 255)');

    // exam mode's question view renders .zq-timer; .zq-choice renders in
    // either mode, so this also covers the border-radius check.
    await startRun(page, { mode: 'Timed exam' });
    assert.match(await page.locator('.zq-timer').evaluate((el) => getComputedStyle(el).fontFamily), /Geist/);
    assert.equal(await page.locator('.zq-choice').first().evaluate((el) => getComputedStyle(el).borderRadius), '10px');
  });
});

// ---------------------------------------------------------------------
// 9. Scoping leak: host page never absorbs the tool's styles
// ---------------------------------------------------------------------
test('scoping leak: host body styles and an external h1 stay untouched across a full boot + flow', async () => {
  await withPage(async (page) => {
    // Gate the bundle's own script so we can read the host page's "before
    // boot" computed styles once parsing has reached <body> but before our
    // code has run a single line (waitUntil:'domcontentloaded' would hang
    // here, since a gated deferred script blocks that event entirely).
    let releaseScript;
    const gate = new Promise((resolve) => { releaseScript = resolve; });
    await page.route('**/dist/practice-dev.js', async (route) => {
      await gate;
      await route.continue();
    });

    await page.goto(`${baseURL}/practice.html`, { waitUntil: 'commit' });
    await page.waitForSelector('h1');

    const before = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return { fontFamily: cs.fontFamily, color: cs.color, margin: cs.margin };
    });
    const h1FontSizeBefore = await page.locator('h1').evaluate((el) => getComputedStyle(el).fontSize);

    releaseScript();
    await page.waitForSelector('.zq-hubcard');
    await selectOperatorMathCard(page);
    const size = await startRun(page, { mode: 'Practice' });
    await answerAll(page, size);

    const after = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return { fontFamily: cs.fontFamily, color: cs.color, margin: cs.margin };
    });
    const h1FontSizeAfter = await page.locator('h1').evaluate((el) => getComputedStyle(el).fontSize);

    assert.deepEqual(after, before, 'host body computed styles must not change across a full boot + flow');
    assert.equal(h1FontSizeAfter, h1FontSizeBefore, 'an h1 outside the mount must keep its computed font-size');
  });
});

// ---------------------------------------------------------------------
// 10. Embed variant (T51)
// ---------------------------------------------------------------------
test('embed variant: ?embed=app sets the zq-embed-app class on the mount', async () => {
  await withPage(async (page) => {
    await gotoPractice(page, '?embed=app');
    await page.waitForSelector('.zq-hubcard');
    const hasClass = await page.evaluate(() =>
      document.getElementById('ziptility-practice').classList.contains('zq-embed-app'));
    assert.ok(hasClass, 'mount should carry zq-embed-app when ?embed=app is set');
  });
});

// ---------------------------------------------------------------------
// 11. Fetch-error state
// ---------------------------------------------------------------------
test('fetch-error state: a 500 on the bank JSON shows the error alert; Try again recovers', async () => {
  await withPage(async (page) => {
    let shouldFail = true;
    await page.route('**/dist/practice-banks/*.json', async (route) => {
      if (shouldFail) await route.fulfill({ status: 500, contentType: 'text/plain', body: 'boom' });
      else await route.continue();
    });

    await gotoPractice(page);
    await selectOperatorMathCard(page);

    await page.waitForSelector('.zq-error');
    assert.match(await page.locator('.zq-error h3').innerText(), /Could not load this test/);
    assert.match(await page.locator('.zq-error p').innerText(), /Operator math practice test/);
    const retryBtn = page.locator('.zq-error button', { hasText: 'Try again' });
    assert.equal(await retryBtn.count(), 1);

    shouldFail = false;
    await retryBtn.click();
    await page.waitForSelector('.zq-mode-grid');
    assert.equal(await page.locator('.zq-error').count(), 0);
  });
});

// ---------------------------------------------------------------------
// 12. Deep link by slug: skips the picker (Q-12 split)
// ---------------------------------------------------------------------
test('deep link by slug: ?test=water-treatment boots straight into the Water Treatment bank, skipping the picker', async () => {
  const { TESTS } = await import('../src/practice/manifest.js');
  const wt = TESTS.find((t) => t.slug === 'water-treatment');
  await withPage(async (page) => {
    await gotoPractice(page, '?test=water-treatment');
    await page.waitForSelector('.zq-card:has-text("Set up your test")');
    assert.equal(await page.locator('.zq-hub-grid').count(), 0, 'deep link must skip the six-card picker');
    assert.equal(await page.locator('.zq-title').innerText(), wt.title);
  });
});

// ---------------------------------------------------------------------
// 13. Deep link by id: back-compat for embeds written before the split
// ---------------------------------------------------------------------
test('deep link by id: ?test=wt-1 does the same thing as the slug form (back-compat)', async () => {
  const { TESTS } = await import('../src/practice/manifest.js');
  const wt = TESTS.find((t) => t.id === 'wt-1');
  await withPage(async (page) => {
    await gotoPractice(page, '?test=wt-1');
    await page.waitForSelector('.zq-card:has-text("Set up your test")');
    assert.equal(await page.locator('.zq-hub-grid').count(), 0, 'deep link must skip the six-card picker');
    assert.equal(await page.locator('.zq-title').innerText(), wt.title);
  });
});

// ---------------------------------------------------------------------
// 14. Deep link via data-test attribute (embed form, not just query string)
// ---------------------------------------------------------------------
test('deep link via data-test attribute: data-test="wt-1" works the same as ?test=wt-1', async () => {
  const { TESTS } = await import('../src/practice/manifest.js');
  const wt = TESTS.find((t) => t.id === 'wt-1');
  await withPage(async (page) => {
    await gotoPracticeWithMountAttrs(page, { 'data-test': 'wt-1' });
    await page.waitForSelector('.zq-card:has-text("Set up your test")');
    assert.equal(await page.locator('.zq-hub-grid').count(), 0, 'deep link must skip the six-card picker');
    assert.equal(await page.locator('.zq-title').innerText(), wt.title);
  });
});

// ---------------------------------------------------------------------
// 15. Unresolvable deep link: error state, never a silent hub fallback
// ---------------------------------------------------------------------
test('unresolvable deep link: ?test=not-a-real-test renders the error state, never the hub picker', async () => {
  await withPage(async (page) => {
    await gotoPractice(page, '?test=not-a-real-test');
    await page.waitForSelector('.zq-error[role="alert"]');
    // The old (pre-fix) behavior silently rendered the six-card hub here
    // instead of failing loud: this is the regression guard for that.
    assert.equal(await page.locator('.zq-hub-grid').count(), 0);
    assert.match(await page.locator('.zq-error p').innerText(), /not-a-real-test/);
    // Not retryable: retrying a bad slug/id just fails again, so there is
    // no Try again button, only a way out to the hub.
    assert.equal(await page.locator('.zq-error button', { hasText: 'Try again' }).count(), 0);
    const hubLink = page.locator('.zq-error a', { hasText: 'All practice tests' });
    assert.equal(await hubLink.count(), 1);
    assert.equal(await hubLink.getAttribute('href'), '/tools/practice');
  });
});

// ---------------------------------------------------------------------
// 16. Picker descriptions: all six non-empty (regression guard)
// ---------------------------------------------------------------------
test('picker cards: all six render a non-empty description (regression guard for the 5-of-6 blank bug)', async () => {
  const { TESTS } = await import('../src/practice/manifest.js');
  await withPage(async (page) => {
    await gotoPractice(page);
    await page.waitForSelector('.zq-hubcard');
    const descriptions = await page.locator('.zq-hubcard p').allInnerTexts();
    assert.equal(descriptions.length, TESTS.length);
    for (let i = 0; i < descriptions.length; i++) {
      assert.ok(descriptions[i].trim().length > 0,
        'card ' + i + ' (' + TESTS[i].id + ') rendered an empty description');
    }
  });
});

// ---------------------------------------------------------------------
// 17. childPages off (default): cards stay buttons
// ---------------------------------------------------------------------
test('childPages off (default): picker cards are buttons, not links', async () => {
  await withPage(async (page) => {
    await gotoPractice(page);
    await page.waitForSelector('.zq-hubcard');
    const tags = await page.locator('.zq-hubcard').evaluateAll((els) => els.map((e) => e.tagName));
    assert.ok(tags.length > 0 && tags.every((t) => t === 'BUTTON'),
      `expected all cards to be BUTTON, got ${tags.join(',')}`);
  });
});

// ---------------------------------------------------------------------
// 18. childPages on (data-child-pages="1"): cards become real anchors
// ---------------------------------------------------------------------
test('childPages on (data-child-pages="1"): picker cards are anchors to /tools/practice/<slug>, and clicking navigates instead of launching a bank in place', async () => {
  const { TESTS } = await import('../src/practice/manifest.js');
  await withPage(async (page) => {
    await gotoPracticeWithMountAttrs(page, { 'data-child-pages': '1' });
    await page.waitForSelector('.zq-hubcard');
    const cards = page.locator('.zq-hubcard');
    assert.equal(await cards.count(), TESTS.length);
    const tags = await cards.evaluateAll((els) => els.map((e) => e.tagName));
    assert.ok(tags.every((t) => t === 'A'), `expected all cards to be A, got ${tags.join(',')}`);
    const hrefs = await cards.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    assert.deepEqual(hrefs, TESTS.map((t) => '/tools/practice/' + t.slug));

    // Real navigation, not an in-place launch: stub the child page's route
    // and confirm clicking the first card actually navigates the browser
    // there. If picker.js still wired a click handler (childPages=true
    // path), onSelect would fire instead and no navigation would happen.
    await page.route(`${baseURL}/tools/practice/**`, (route) =>
      route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<h1>child page stub</h1>' }));
    await Promise.all([
      page.waitForURL(`${baseURL}/tools/practice/${TESTS[0].slug}`),
      cards.first().click()
    ]);
    assert.equal(await page.locator('.zq-mode-grid').count(), 0, 'a childPages card click must not start a run in place');
  });
});

// ---------------------------------------------------------------------
// 19. Results screen: "All practice tests" is a link when deep-linked,
//     stays an in-place button when the run started from the hub
// ---------------------------------------------------------------------
test('results screen: "All practice tests" is a link on a deep-linked run, a button on a hub-started run', async () => {
  await withPage(async (page) => {
    await gotoPractice(page, '?test=water-treatment');
    await page.waitForSelector('.zq-card:has-text("Set up your test")');
    const size = await startRun(page, { mode: 'Practice' });
    await answerAll(page, size);
    await page.waitForSelector('.zq-score-hero');
    const allTests = page.locator('.zq-score-hero .zq-btn-quiet', { hasText: 'All practice tests' });
    assert.equal(await allTests.evaluate((el) => el.tagName), 'A',
      'deep-linked run: "All practice tests" must be a real link, not an in-place picker swap');
    assert.equal(await allTests.getAttribute('href'), '/tools/practice');
  });

  await withPage(async (page) => {
    await gotoPractice(page);
    await selectOperatorMathCard(page);
    const size = await startRun(page, { mode: 'Practice' });
    await answerAll(page, size);
    await page.waitForSelector('.zq-score-hero');
    const allTests = page.locator('.zq-score-hero .zq-btn-quiet', { hasText: 'All practice tests' });
    assert.equal(await allTests.evaluate((el) => el.tagName), 'BUTTON',
      'hub-started run: "All practice tests" must stay an in-place picker swap, not a link');
  });
});
