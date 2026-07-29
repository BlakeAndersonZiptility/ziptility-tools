// Browser tests: load the repo's own preview page (index.html + dev bundle)
// and exercise the full tool. Run `npm run build:dev` first (test:browser does).
// Font note: Circular Std is site-licensed and only loads on ziptility.com /
// webflow.io, so we assert font-family *declarations*, not loaded faces.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const PREVIEW = 'file://' + fileURLToPath(new URL('../index.html', import.meta.url));
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log('FAIL: ' + name); } };

// WCAG relative-luminance contrast, for computed rgb(...) strings. Used below so a primary-action
// colour swap is checked against the actual floor (4.5:1), not just pinned to one literal value -
// design-pass 2026-07-29, replacing the raw-tomato assertion this test used to encode.
function rgbToNums(rgb) {
  const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/.exec(rgb);
  if (!m) throw new Error('not an rgb() string: ' + rgb);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
function relLuminance([r, g, b]) {
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrastRatio(rgbA, rgbB) {
  const LA = relLuminance(rgbToNums(rgbA));
  const LB = relLuminance(rgbToNums(rgbB));
  const [hi, lo] = LA > LB ? [LA, LB] : [LB, LA];
  return (hi + 0.05) / (lo + 0.05);
}

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
ok('warm linen background DS 4.0 (#fbf8f5), got ' + bodyBg, bodyBg === 'rgb(251, 248, 245)');
// Design pass, 2026-07-29 (Blake ruling: design-system rules, not the superseded calculator-only
// "Calculate buttons = brand red" call): this used to pin the raw-tomato fill by literal value,
// which is exactly what forced the navy-text workaround the ruling retires. Assert the DS-correct
// treatment instead - tomato-press fill, white text, AND that the pair actually clears 4.5:1 -
// so a future regression back to raw tomato (which measures 3.43:1 and fails) is still caught,
// without re-encoding one specific fill as the only acceptable answer.
const btnStyle = await page.evaluate(() => {
  const cs = getComputedStyle(document.querySelector('.btn-calc'));
  return { bg: cs.backgroundColor, color: cs.color };
});
ok('Calculate button uses the DS text-bearing tomato (tomato-press #c02100), got ' + btnStyle.bg,
  btnStyle.bg === 'rgb(192, 33, 0)');
ok('Calculate button text is white (matches the CTA/modal primary buttons elsewhere in this file), got ' + btnStyle.color,
  btnStyle.color === 'rgb(255, 255, 255)');
const btnContrast = contrastRatio(btnStyle.bg, btnStyle.color);
ok('Calculate button fill/text contrast clears 4.5:1, got ' + btnContrast.toFixed(2) + ':1', btnContrast >= 4.5);
const h2font = await page.evaluate(() => getComputedStyle(document.querySelector('.card-head h2')).fontFamily);
ok('heading declares Archivo stack, got ' + h2font, /Archivo/i.test(h2font));

// DS 4.0 (2026-06-22): the bundle now loads its brand type (Archivo + Geist)
// so the tool renders correctly on any host — this deliberately reverses the
// 2026-06 "no web fonts" CWV rule. preconnect + display=swap limit the swap
// CLS; re-check CrUX after deploy, fall back to display=optional / self-host.
ok('loads Archivo + Geist web fonts (' + fontReqs.length + ' reqs)',
  fontReqs.length > 0 && /Archivo/.test(fontReqs.join(' ')) && /Geist/.test(fontReqs.join(' ')));
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

// keyword synonyms reach cards whose titles don't contain them (v2.3)
await page.click('.mode-btn[data-m="water"]');
await page.fill('#search', 'kilowatt');
ok('keyword search surfaces power converter', await page.evaluate(() =>
  document.getElementById('conv-power__in') !== null));

// seeAlso cross-link navigates via search (v2.3)
await page.fill('#search', 'hazen');
ok('head-loss card found by keyword', await page.evaluate(() =>
  document.getElementById('head-loss__flow') !== null));
await page.click('.seealso');
ok('see-also click navigates to related card', await page.evaluate(() =>
  document.getElementById('pressure-head__psi') !== null));
// liquid/granular toggle on disinfection cards (v2.3)
await page.fill('#search', 'tank chlorination');
ok('toggle renders with liquid active', await page.evaluate(() =>
  document.querySelector('.seg button[data-v="liquid"]').getAttribute('aria-pressed') === 'true'));
ok('granular fields hidden on liquid side', await page.evaluate(() =>
  document.getElementById('tank-chlorination__drypct').closest('.field').style.display === 'none'));
await page.fill('#tank-chlorination__gal', '50000');
await page.fill('#tank-chlorination__dose', '10');
await page.click('#calc-tank-chlorination');
ok('liquid side computes with default 12.5%', (await page.inputValue('#tank-chlorination__liqpct')) === '12.5');
await page.click('.seg button[data-v="granular"]');
ok('toggle switches sides', await page.evaluate(() =>
  document.getElementById('tank-chlorination__liqpct').closest('.field').style.display === 'none'
  && document.getElementById('tank-chlorination__drypct').closest('.field').style.display !== 'none'));
await page.click('#calc-tank-chlorination');
ok('granular side computes with default 65%', (await page.inputValue('#tank-chlorination__drypct')) === '65');
await page.fill('#search', '');
await page.click('.mode-btn[data-m="wastewater"]');

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

// deep links: every calculator id a practice question links to must land
// ON its card. Two things had to be true and neither was: the card needs
// an id, and the grid needs to switch to that calculator's mode+category
// first, since it renders only one category at a time and the target is
// otherwise not in the DOM at all. Checked against the real set of ids the
// banks emit, not a sample, because the two bundles ship on separate
// release trains and nothing else would notice a rename.
const { readFileSync, readdirSync } = await import('node:fs');
const banksDir = fileURLToPath(new URL('../banks-src', import.meta.url));
const linkedIds = new Set();
for (const f of readdirSync(banksDir).filter(n => n.endsWith('.json'))) {
  for (const q of JSON.parse(readFileSync(banksDir + '/' + f, 'utf8')).questions) {
    if (q.calculator) linkedIds.add(q.calculator);
  }
}
const deepPage = await ctx.newPage();
const badLinks = [];
for (const id of [...linkedIds].sort()) {
  await deepPage.goto(PREVIEW + '#' + id, { waitUntil: 'load' });
  await deepPage.waitForSelector('.card');
  const landed = await deepPage.evaluate((i) => {
    const el = document.getElementById(i);
    return !!el && el.classList.contains('card');
  }, id);
  if (!landed) badLinks.push(id);
}
ok('practice cross-links resolve: ' + linkedIds.size + ' deep links land on their card'
   + (badLinks.length ? ' (broken: ' + badLinks.join(', ') + ')' : ''),
   linkedIds.size > 0 && badLinks.length === 0);

console.log(`\n${pass} passed, ${fail} failed; JS errors: ${jsErrors.length ? jsErrors.join('; ') : 'none'}`);
await browser.close();
process.exit(fail || jsErrors.length ? 1 : 0);
