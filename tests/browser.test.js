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

// completion events (WW-14): two successful runs of the same card are ONE
// completion; the payload carries the page slug and the card id, no input.
const completes = () => page.evaluate(() => (window.dataLayer || []).filter(e => e && e.event === 'tool_complete'));
let dl = await completes();
ok('tool_complete fired once for two area-rect runs', dl.length === 1);
ok('tool_complete payload = calculator / area-rect / water',
  dl[0] && dl[0].tool_name === 'calculator' && dl[0].tool_calc === 'area-rect' && dl[0].tool_mode === 'water');
ok('tool_complete carries no reader input', dl[0] && Object.keys(dl[0]).every(k => ['event', 'tool_name', 'tool_calc', 'tool_mode'].includes(k)));

// unit switch converts in place
await page.selectOption('#area-rect__A__u', 'sqm');
const m2 = parseFloat(await page.inputValue('#area-rect__A'));
ok('unit switch ft²→m² (~1.858), got ' + m2, Math.abs(m2 - 1.8581) < 0.001);

// clear
await page.click('#clear-area-rect');
ok('clear empties fields', (await page.inputValue('#area-rect__L')) === '');

// a run that fails validation is NOT a completion
await page.fill('#area-rect__L', '7');
await page.click('#calc-area-rect');
ok('missing input shows an error', (await page.textContent('#msg-area-rect')).trim().length > 0);
dl = await completes();
ok('no tool_complete on a validation error', dl.length === 1);

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
// WW-02: the small liquid units for dosing from a jug
ok('liquid-to-add computes 4 gal', Math.abs(parseFloat(await page.inputValue('#tank-chlorination__liqgal')) - 4) < 1e-6);
const liqUnits = await page.evaluate(() => Array.from(document.querySelectorAll('#tank-chlorination__liqgal__u option')).map(o => o.value));
ok('liquid-to-add offers gal, fl oz, L, mL in that order', liqUnits.join(',') === 'gal,floz,L,mL');
await page.selectOption('#tank-chlorination__liqgal__u', 'floz');
ok('4 gal reads 512 fl oz', Math.abs(parseFloat(await page.inputValue('#tank-chlorination__liqgal')) - 512) < 1e-6);
await page.selectOption('#tank-chlorination__liqgal__u', 'mL');
const mlVal = parseFloat((await page.inputValue('#tank-chlorination__liqgal')).replace(/,/g, ''));
ok('4 gal reads ~15,141.65 mL, got ' + mlVal, Math.abs(mlVal - 15141.65) < 0.1);
await page.selectOption('#tank-chlorination__liqgal__u', 'gal');
await page.click('.seg button[data-v="granular"]');
ok('toggle switches sides', await page.evaluate(() =>
  document.getElementById('tank-chlorination__liqpct').closest('.field').style.display === 'none'
  && document.getElementById('tank-chlorination__drypct').closest('.field').style.display !== 'none'));
await page.click('#calc-tank-chlorination');
ok('granular side computes with default 65%', (await page.inputValue('#tank-chlorination__drypct')) === '65');
dl = await completes();
ok('a second calculator is a second completion (tank-chlorination), and its two runs are one',
  dl.length === 2 && dl[1].tool_calc === 'tank-chlorination');
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

// ---- WW-01 global unit system (2026-09-16) ----------------------------------
// One flip moves every visible unit select to the other system and converts the
// typed value in place; the choice persists across a reload; the strip is compact.
{
  await page.evaluate(() => { try { localStorage.removeItem('zip-units'); } catch (e) {} });
  await page.goto(PREVIEW, { waitUntil: 'load' });
  await page.waitForSelector('.card');
  ok('unit strip renders two buttons with US customary pressed', await page.evaluate(() => {
    const b = [...document.querySelectorAll('.sys-seg button')];
    return b.length === 2 && b[0].getAttribute('aria-pressed') === 'true' && b[1].getAttribute('aria-pressed') === 'false';
  }));
  ok('unit strip buttons meet the 36px tap floor', await page.evaluate(() =>
    [...document.querySelectorAll('.sys-seg button')].every(b => b.getBoundingClientRect().height >= 36)));
  ok('header stays compact with the strip in it (<= 80px desktop)', await page.evaluate(() =>
    document.querySelector('#ziptility-calculator header').getBoundingClientRect().height <= 80));
  ok('interim US-customary note is visible', await page.evaluate(() => {
    const n = document.querySelector('.sys-note .long'); return n && getComputedStyle(n).display !== 'none' && /US customary/.test(n.textContent);
  }));
  // Geometry & Volume is the first category; every unit select there starts imperial.
  const before = await page.evaluate(() => [...document.querySelectorAll('.card select[id$="__u"]')].map(s => s.value));
  ok('every visible unit select starts on an imperial unit', before.length > 0 && before.every(u => ['in','ft','yd','mi','sqin','sqft','sqyd','ac','gal','cf','MG','acft','floz','lb','ton','gpm','mgd','gpd','cfs','hp','psi','fps','fpm','lbd','gpdft2','gpmft2','gpdft','F','galft2','gpmft','lbgal','btuh','galH2O','lbH2O'].includes(u)));
  // Type a value, flip, and check the value converted in place (10 ft -> 3.048 m).
  const firstLen = await page.evaluate(() => { const s = [...document.querySelectorAll('.card select[id$="__u"]')].find(x => x.value === 'ft'); if (!s) return null; const i = document.getElementById(s.id.replace(/__u$/, '')); i.value = '10'; return s.id; });
  ok('found a ft field to flip', !!firstLen);
  await page.click('.sys-seg button[data-sys="metric"]');
  const after = await page.evaluate(() => [...document.querySelectorAll('.card select[id$="__u"]')].map(s => s.value));
  ok('after the flip every visible unit select is metric', after.length === before.length && after.every(u => ['mm','cm','m','km','sqcm','sqm','ha','L','m3','ML','mL','kg','g','t','Lps','Lpm','mlmin','m3h','m3d','MLd','m3s','kW','W','kPa','bar','mps','kgd','m3m2d','m3m2h','m3md','C','m3m2','Lsm','kgL','kgH2O','LH2O'].includes(u)));
  ok('typed 10 ft became 3.048 m in place', firstLen ? await page.evaluate((id) => { const s = document.getElementById(id); const i = document.getElementById(id.replace(/__u$/, '')); return s.value === 'm' && Math.abs(parseFloat(i.value) - 3.048) < 1e-3; }, firstLen) : false);
  ok('metric reference constants show, imperial hide', await page.evaluate(() => {
    const m = document.querySelector('.ref-grid[data-sys="metric"]'), i = document.querySelector('.ref-grid[data-sys="imperial"]');
    return getComputedStyle(m).display !== 'none' && getComputedStyle(i).display === 'none';
  }));
  ok('metric button now pressed', await page.evaluate(() => document.querySelector('.sys-seg button[data-sys="metric"]').getAttribute('aria-pressed') === 'true'));
  await page.reload({ waitUntil: 'load' }); await page.waitForSelector('.card');
  ok('the choice survives a reload (selects paint metric first)', await page.evaluate(() => {
    const b = document.querySelector('.sys-seg button[data-sys="metric"]').getAttribute('aria-pressed') === 'true';
    const sel = [...document.querySelectorAll('.card select[id$="__u"]')]; return b && sel.length > 0 && sel.every(s => !['in','ft','gal','cf','lb','gpm','mgd','hp','psi'].includes(s.value));
  }));
  // A liquid dose declared gal/fl oz/L/mL lands on L, never on m3 (WW-02 interplay).
  await page.fill('#search', 'well disinfection'); await page.waitForSelector('#well-disinfection');
  ok('liquid-to-add lands on L in metric, list unchanged', await page.evaluate(() => {
    const s = document.getElementById('well-disinfection__liqgal__u'); return s && s.value === 'L' && [...s.options].map(o => o.value).join(',') === 'gal,floz,L,mL';
  }));
  await page.click('.sys-seg button[data-sys="imperial"]');
  ok('flip back returns liquid-to-add to gal', await page.evaluate(() => document.getElementById('well-disinfection__liqgal__u').value === 'gal'));
  await page.fill('#search', '');
  // Mobile: the short note shows, the long one hides, buttons still >= 36px.
  await page.setViewportSize({ width: 375, height: 740 });
  ok('375px: short note visible, long hidden, header under 100px', await page.evaluate(() => {
    const l = document.querySelector('.sys-note .long'), s = document.querySelector('.sys-note .short');
    const h = document.querySelector('#ziptility-calculator header').getBoundingClientRect().height;
    return getComputedStyle(l).display === 'none' && getComputedStyle(s).display !== 'none' && h < 100;
  }));
  ok('375px: strip buttons >= 36px tall', await page.evaluate(() => [...document.querySelectorAll('.sys-seg button')].every(b => b.getBoundingClientRect().height >= 36)));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate(() => { try { localStorage.removeItem('zip-units'); } catch (e) {} });
}

console.log(`\n${pass} passed, ${fail} failed; JS errors: ${jsErrors.length ? jsErrors.join('; ') : 'none'}`);
await browser.close();
process.exit(fail || jsErrors.length ? 1 : 0);
