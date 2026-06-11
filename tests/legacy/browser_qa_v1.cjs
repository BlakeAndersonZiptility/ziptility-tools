const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto('file:///tmp/qa/harness.html', { waitUntil: 'networkidle' }).catch(async () => {
    await page.goto('file:///tmp/qa/harness.html', { waitUntil: 'load' });
  });

  let pass = 0, fail = 0;
  const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log('FAIL: ' + name); } };

  // 1. brand style injected and last in cascade
  const brand = await page.evaluate(() => {
    const el = document.getElementById('zip-brand-align');
    if (!el) return null;
    const styles = [...document.querySelectorAll('style')];
    return { last: styles[styles.length - 1] === el, hasTomato: el.textContent.includes('#ff442f') };
  });
  ok('brand style injected', !!brand);
  ok('brand style is last <style>', brand && brand.last);

  // 2. computed page styles reflect new tokens
  const bodyStyle = await page.evaluate(() => {
    const cs = getComputedStyle(document.body);
    return { bg: cs.backgroundColor, font: cs.fontFamily };
  });
  ok('warm body background (#f9f5ef)', bodyStyle.bg === 'rgb(249, 245, 239)');
  console.log('body font stack:', bodyStyle.font);

  const h2font = await page.evaluate(() => getComputedStyle(document.querySelector('.card-head h2')).fontFamily);
  ok('card headings use Circular std stack', /Circular/i.test(h2font));

  // 3. cards rendered
  const cards = await page.locator('.card').count();
  ok('cards rendered (' + cards + ')', cards > 0);

  // 3b. water mode visibly selected on first paint (no clicks yet)
  const initMode = await page.evaluate(() => document.documentElement.dataset.mode);
  ok('data-mode set at init', initMode === 'water');

  // 6. Calculate button is brand tomato
  const btnBg = await page.evaluate(() => getComputedStyle(document.querySelector('.btn-calc')).backgroundColor);
  ok('Calculate button tomato #ff442f, got ' + btnBg, btnBg === 'rgb(255, 68, 47)');

  // 4. run a calculation end-to-end: Area — Rectangle 10 x 20 = 200 ft²
  await page.fill('#area-rect__L', '10');
  await page.fill('#area-rect__W', '20');
  await page.click('#calc-area-rect');
  const area = await page.inputValue('#area-rect__A');
  ok('area-rect computes 200, got ' + area, area === '200');
  const computedHl = await page.evaluate(() => document.getElementById('area-rect__A').classList.contains('computed'));
  ok('computed highlight applied', computedHl);

  // 5. unit conversion on field: switch Area units ft² -> m²
  await page.selectOption('#area-rect__A__u', 'sqm');
  const m2 = await page.inputValue('#area-rect__A');
  ok('unit switch converts to m² (~18.58), got ' + m2, Math.abs(parseFloat(m2) - 18.5806) < 0.01);

  // 7. clear works
  await page.click('#clear-area-rect');
  ok('clear empties field', (await page.inputValue('#area-rect__L')) === '');

  // 8. mode switch to wastewater
  await page.click('.mode-btn[data-m="wastewater"]');
  const mode = await page.evaluate(() => document.documentElement.dataset.mode);
  ok('mode switches to wastewater', mode === 'wastewater');
  const wwCards = await page.locator('.card').count();
  ok('wastewater cards rendered (' + wwCards + ')', wwCards > 0);

  // 9. search
  await page.fill('#search', 'svi');
  const sviCards = await page.locator('.card').count();
  ok('search "svi" finds cards (' + sviCards + ')', sviCards >= 1);
  await page.fill('#search', '');

  // 10. lead modal opens/closes
  await page.click('#openSheet');
  ok('lead modal opens', await page.evaluate(() => document.getElementById('leadModal').classList.contains('show')));
  await page.click('#leadClose');
  ok('lead modal closes', await page.evaluate(() => !document.getElementById('leadModal').classList.contains('show')));

  // 11. mojibake repaired
  const placeholder = await page.evaluate(() => document.getElementById('search').placeholder);
  ok('search placeholder repaired: "' + placeholder + '"', placeholder === 'Search calculators…');
  const mojiLeft = await page.evaluate(() => document.body.innerText.includes('‚Ä'));
  ok('no visible mojibake remains', !mojiLeft);

  // screenshots
  await page.click('.mode-btn[data-m="water"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/qa/calculator-top.png', fullPage: false });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/qa/calculator-cards.png', fullPage: false });

  console.log('\nJS errors on page:', errors.length ? errors : 'none');
  console.log(`${pass} passed, ${fail} failed`);
  await browser.close();
  const jsErrors = errors.filter(e => e.startsWith('pageerror'));
  process.exit(fail || jsErrors.length ? 1 : 0);
})();
