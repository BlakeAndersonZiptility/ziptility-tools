// Browser tests: load the repo's own preview page (index.html + dev bundle)
// and exercise the full tool. Run `npm run build:dev` first (test:browser does).
// Font note: Circular Std is site-licensed and only loads on ziptility.com /
// webflow.io, so we assert font-family *declarations*, not loaded faces.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const PREVIEW = 'file://' + fileURLToPath(new URL('../index.html', import.meta.url));
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log('FAIL: ' + name); } };

const browser = await chromium.launch();
const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const jsErrors = [];
page.on('pageerror', e => jsErrors.push(e.message));
const fontReqs = [];
page.on('request', r => { if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) fontReqs.push(r.url()); });

await page.goto(PREVIEW, { waitUntil: 'load' });
await page.waitForSelector('.card');

// mount + styles
ok('shell rendered into mount div', await page.evaluate(() =>
  document.querySelector('#ziptility-calculator header') !== null));
ok('bundled stylesheet injected', await page.evaluate(() =>
  document.getElementById('zip-calc-styles') !== null));
ok('no logo in tool masthead (global nav carries brand)', await page.evaluate(() =>
  document.querySelector('#ziptility-calculator .zip-logo') === null));

// brand styling (computed)
const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
ok('warm brand background, got ' + bodyBg, bodyBg === 'rgb(249, 245, 239)');
const btnBg = await page.evaluate(() => getComputedStyle(document.querySelector('.btn-calc')).backgroundColor);
ok('Calculate button tomato #ff442f, got ' + btnBg, btnBg === 'rgb(255, 68, 47)');
const h2font = await page.evaluate(() => getComputedStyle(document.querySelector('.card-head h2')).fontFamily);
ok('heading declares Circular std stack', /Circular/i.test(h2font));

// CWV (2026-06 audit): the bundle must never fetch web fonts — swap reflow
// on this page was the site's worst CLS contributor.
ok('zero Google Fonts requests', fontReqs.length === 0);
const monofont = await page.evaluate(() => getComputedStyle(document.querySelector('.formula')).fontFamily);
ok('formula uses system mono stack (no IBM Plex)', !/plex/i.test(monofont) && /mono|menlo|consolas/i.test(monofont));

// first paint state
ok('water mode selected at init', await page.evaluate(() => document.documentElement.dataset.mode === 'water'));
const cards = await page.locator('.card').count();
ok('cards rendered (' + cards + ')', cards > 0);

// end-to-end calculation
await page.fill('#area-rect__L', '10');
await page.fill('#area-rect__W', '20');
await page.click('#calc-area-rect');
ok('area-rect computes 200', (await page.inputValue('#area-rect__A')) === '200');
ok('computed highlight applied', await page.evaluate(() =>
  document.getElementById('area-rect__A').classList.contains('computed')));

// Enter key triggers calculation
await page.click('#clear-area-rect');
await page.fill('#area-rect__L', '5');
await page.fill('#area-rect__W', '4');
await page.press('#area-rect__W', 'Enter');
ok('Enter key calculates (20)', (await page.inputValue('#area-rect__A')) === '20');

// unit switch converts in place
await page.selectOption('#area-rect__A__u', 'sqm');
const m2 = parseFloat(await page.inputValue('#area-rect__A'));
ok('unit switch ft²→m² (~1.858), got ' + m2, Math.abs(m2 - 1.8581) < 0.001);

// clear
await page.click('#clear-area-rect');
ok('clear empties fields', (await page.inputValue('#area-rect__L')) === '');

// mode switch + search
await page.click('.mode-btn[data-m="wastewater"]');
ok('mode switches to wastewater', await page.evaluate(() => document.documentElement.dataset.mode === 'wastewater'));
ok('wastewater cards rendered', (await page.locator('.card').count()) > 0);
await page.fill('#search', 'svi');
ok('search finds SVI', (await page.locator('.card').count()) >= 1);
await page.fill('#search', '');

// resource links on cards
await page.fill('#search', 'population equivalent');
const linkRow = await page.locator('.card-links a').first();
ok('resource backlink renders', await linkRow.count() === 1 &&
  (await linkRow.getAttribute('href')).startsWith('https://www.ziptility.com/'));
await page.fill('#search', '');

// lead modal
await page.click('.mode-btn[data-m="water"]');
await page.click('#openSheet');
ok('lead modal opens', await page.evaluate(() => document.getElementById('leadModal').classList.contains('show')));
await page.click('#leadClose');
ok('lead modal closes', await page.evaluate(() => !document.getElementById('leadModal').classList.contains('show')));

// no mojibake anywhere in the tool's own text
ok('clean text (no double-encoded chars)', await page.evaluate(() => !document.body.innerText.includes('‚Ä')));

// embed-app mode hides marketing CTA
const page2 = await ctx.newPage();
await page2.goto(PREVIEW + '?embed=app', { waitUntil: 'load' });
await page2.waitForSelector('.card');
ok('?embed=app hides CTA', await page2.evaluate(() => {
  const cta = document.querySelector('.cta');
  return document.body.classList.contains('embed-app') && getComputedStyle(cta).display === 'none';
}));

console.log(`\n${pass} passed, ${fail} failed; JS errors: ${jsErrors.length ? jsErrors.join('; ') : 'none'}`);
await browser.close();
process.exit(fail || jsErrors.length ? 1 : 0);
