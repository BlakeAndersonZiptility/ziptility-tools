// Manager bundle: browser tests for the completion event (WW-14, item 1b).
//
// WHY THIS FILE EXISTS
// tests/manager.test.js imports the registry directly and never touches the
// DOM, so it can prove every solver's math and still say nothing about what
// the page SENDS. The 2026-09-11 defect lived exactly in that gap:
// render.js read the verdict off `res.verdict.label` while all three solvers
// return it as `res.values.verdict`, so every manager completion since
// 2026-07-30 pushed `tool_complete` with no verdict on it. The math tests
// were green the whole time. Measuring what reaches the dataLayer needs a
// real render, which needs a real browser.
//
// Harness idioms are tests/browser.test.js's (chromium.launch, file:// on the
// repo's own manager.html preview, a pageerror listener that fails the run)
// wrapped one-scenario-per-node:test like tests/practice-browser.test.js, so
// CI reports per-case pass/fail. The manager bundle fetches nothing at load
// (only the lead modal posts, and no test opens it), so file:// is enough -
// no local server, unlike the practice suite.
//
// Run `npm run build:manager:dev` first; the before() hook does it anyway, so
// a bare `node tests/manager-browser.test.js` is self-sufficient.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const PREVIEW = 'file://' + path.join(ROOT, 'manager.html');

let browser;

before(async () => {
  execSync('npm run build:manager:dev', { cwd: ROOT, stdio: 'inherit' });
  browser = await chromium.launch();
}, { timeout: 120000 });

after(async () => { if (browser) await browser.close(); });

// One page per scenario. The completion guard is per page load by design
// ("ONCE PER PAGE LOAD" in render.js), so scenarios must not share a page or
// the first one to complete would silence the rest.
async function withPage(tool, fn) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', (e) => jsErrors.push(e.message));
  try {
    await page.goto(PREVIEW + '?tool=' + tool, { waitUntil: 'load' });
    await page.waitForSelector('.zmt-card');
    await fn(page);
    assert.deepEqual(jsErrors, [], 'no page errors');
  } finally {
    await ctx.close();
  }
}

const fill = (page, tool, k, v) => page.fill('#zmt-' + tool + '-' + k, String(v));
const calc = (page) => page.click('#zmt-calc');
const events = (page) => page.evaluate(() => (window.dataLayer || []).filter((e) => e && /^tool_/.test(e.event)));
const badge = (page) => page.locator('.zmt-badge').innerText();

// ---------------------------------------------------------------------
// 1. THE REGRESSION. The verdict on the hit is the verdict on the screen.
// ---------------------------------------------------------------------
test('repair-or-replace completion carries tool_verdict equal to the rendered verdict', async () => {
  await withPage('repair-or-replace', async (page) => {
    // The worked REPLACE fixture from tests/manager.test.js: $5,000/repair x
    // 1 break/yr (annual repair $5,000) against $100k over 50 yr (annualized
    // $2,000). Same numbers here so the two suites agree on what the tool says.
    await fill(page, 'repair-or-replace', 'breaksYr', 1);
    await fill(page, 'repair-or-replace', 'costReplace', 100000);
    await calc(page);
    await page.waitForSelector('.zmt-hero');

    const shown = (await badge(page)).trim();
    assert.equal(shown, 'REPLACE', 'the fixture renders the REPLACE verdict');

    const dl = await events(page);
    const complete = dl.filter((e) => e.event === 'tool_complete');
    assert.equal(complete.length, 1, 'exactly one tool_complete');
    assert.equal(complete[0].tool_name, 'repair-or-replace');
    assert.equal(complete[0].tool_verdict, shown,
      'the verdict on the hit must be the verdict on the screen');
    // No reader input rides the payload: three flat keys and nothing else.
    assert.deepEqual(Object.keys(complete[0]).sort(), ['event', 'tool_name', 'tool_verdict']);
    for (const v of Object.values(complete[0])) assert.equal(typeof v, 'string', 'flat payload only');
  });
});

// The other two verdict branches, so a future refactor that hard-codes one
// string or reads the wrong field still fails here.
test('repair-or-replace: the KEEP REPAIRING branch reports its own verdict', async () => {
  await withPage('repair-or-replace', async (page) => {
    // 0.1 breaks/yr x $5,000 = $500/yr repair against $2,000/yr annualized.
    await fill(page, 'repair-or-replace', 'breaksYr', 0.1);
    await fill(page, 'repair-or-replace', 'costReplace', 100000);
    await calc(page);
    await page.waitForSelector('.zmt-hero');
    const shown = (await badge(page)).trim();
    assert.equal(shown, 'KEEP REPAIRING');
    const complete = (await events(page)).filter((e) => e.event === 'tool_complete');
    assert.equal(complete.length, 1);
    assert.equal(complete[0].tool_verdict, 'KEEP REPAIRING');
  });
});

test('repair-or-replace: criticality override reports the verdict it forced', async () => {
  await withPage('repair-or-replace', async (page) => {
    // Criticality can single-handedly flip the verdict to REPLACE (audit
    // finding C4). The same inputs that read KEEP REPAIRING above must report
    // REPLACE once Critical is selected - the event follows the override,
    // not the arithmetic.
    await fill(page, 'repair-or-replace', 'breaksYr', 0.1);
    await fill(page, 'repair-or-replace', 'costReplace', 100000);
    await page.click('.zmt-seg button[data-v="Critical"]');
    await calc(page);
    await page.waitForSelector('.zmt-hero');
    const shown = (await badge(page)).trim();
    assert.equal(shown, 'REPLACE');
    const complete = (await events(page)).filter((e) => e.event === 'tool_complete');
    assert.equal(complete.length, 1);
    assert.equal(complete[0].tool_verdict, 'REPLACE');
  });
});

// ---------------------------------------------------------------------
// 2. The guards the completion event already promised
// ---------------------------------------------------------------------
test('one completion per page load, however many times the reader recalculates', async () => {
  await withPage('repair-or-replace', async (page) => {
    await fill(page, 'repair-or-replace', 'breaksYr', 1);
    await fill(page, 'repair-or-replace', 'costReplace', 100000);
    await calc(page);
    await page.waitForSelector('.zmt-hero');
    assert.equal((await badge(page)).trim(), 'REPLACE');

    // Play with it: same session, different answer on screen.
    await fill(page, 'repair-or-replace', 'breaksYr', 0.1);
    await calc(page);
    await page.waitForFunction(() =>
      document.querySelector('.zmt-badge') && document.querySelector('.zmt-badge').textContent.trim() === 'KEEP REPAIRING');

    const complete = (await events(page)).filter((e) => e.event === 'tool_complete');
    assert.equal(complete.length, 1, 'a recalculation is iteration, not a second completion');
    assert.equal(complete[0].tool_verdict, 'REPLACE', 'the first verdict is the one that was sent');
  });
});

test('no completion on a validation error', async () => {
  await withPage('repair-or-replace', async (page) => {
    await calc(page); // breaksYr and costReplace both blank
    await page.waitForFunction(() => document.querySelector('#zmt-msg').textContent.trim().length > 0);
    assert.equal(await page.locator('.zmt-hero').count(), 0, 'no result on screen');
    assert.deepEqual(await events(page), [], 'a failed Calculate is not a completion');
  });
});

// ---------------------------------------------------------------------
// 3. The two tools that have no verdict must not invent one
// ---------------------------------------------------------------------
test('cost-of-turnover completes with no tool_verdict key at all', async () => {
  await withPage('cost-of-turnover', async (page) => {
    await fill(page, 'cost-of-turnover', 'operatorsLost', 2);
    await fill(page, 'cost-of-turnover', 'salary', 65000);
    await fill(page, 'cost-of-turnover', 'recruitCost', 8000);
    await fill(page, 'cost-of-turnover', 'vacancyWeeks', 12);
    await calc(page);
    await page.waitForSelector('.zmt-hero');
    const complete = (await events(page)).filter((e) => e.event === 'tool_complete');
    assert.equal(complete.length, 1);
    assert.equal(complete[0].tool_name, 'cost-of-turnover');
    assert.ok(!('tool_verdict' in complete[0]),
      'a tool with no verdict sends no verdict - never the string "undefined"');
  });
});
