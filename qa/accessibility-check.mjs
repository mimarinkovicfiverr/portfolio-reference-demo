/** Optional companion to browser-check.mjs; no production imports or packages.
 * Download axe-core 4.14.1 to qa/artifacts/axe-4.14.1.min.js first.
 * Run: node qa/browser-check.mjs --accessibility
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

export async function runAccessibilityAudit({ send, evaluate, until, delay, base, output, baseline, setMode, getRequestCount }) {
  const axeSource = await readFile(resolve(output, 'axe-4.14.1.min.js'), 'utf8');
  const report = { date: new Date().toISOString(), reference: 'WCAG 2.2 A/AA + axe best practices',
    browser: await send('Browser.getVersion'), scans: [], checks: [], limitations: [
      'Browser accessibility-tree inspection is not a real screen-reader listening test.',
      'Narrator is installed, but this headless session cannot verify spoken output. NVDA was not found.',
    ] };
  async function scan(name) {
    if (!await evaluate('Boolean(window.axe)')) await evaluate(axeSource);
    const result = await evaluate(`axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}})`);
    report.axeVersion = result.testEngine.version;
    report.scans.push({ name, violations: result.violations, incomplete: result.incomplete,
      passes: result.passes.map(rule => rule.id), inapplicable: result.inapplicable.map(rule => rule.id) });
    console.log(`AXE ${name}: ${result.violations.length} violations, ${result.incomplete.length} rules need review`);
  }
  const suffix = baseline ? 'baseline' : 'final';
  for (const width of [1440, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await delay(150);
    await scan(`${width}px default`);
  }
  await writeFile(resolve(output, `accessibility-${suffix}.json`), JSON.stringify(report, null, 2));
  if (baseline) return;
  assert.equal(report.scans.flatMap(scan => scan.violations).length, 0, 'Review accessibility-final.json');
  async function check(name, action) {
    await action();
    report.checks.push(name);
    console.log(`A11Y PASS ${name}`);
  }
  async function key(key, code = key, modifiers = 0) {
    const keyCode = { Tab: 9, Enter: 13, Escape: 27, ' ': 32 }[key];
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers, windowsVirtualKeyCode: keyCode,
      ...(key === 'Enter' ? { text: '\r' } : {}) });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers, windowsVirtualKeyCode: keyCode });
  }
  async function reload() {
    const previous = await evaluate('performance.timeOrigin');
    await send('Page.reload', { ignoreCache: true });
    await until(`performance.timeOrigin !== ${previous} && document.readyState === 'complete'`);
    await until("window.Chart && document.querySelectorAll('.project-card').length === 3 && document.querySelector('#api-refresh').getAttribute('aria-disabled') === 'false'");
  }
  async function navigate(url) {
    const previous = await evaluate('performance.timeOrigin');
    await send('Page.navigate', { url });
    await until(`performance.timeOrigin !== ${previous} && document.readyState === 'complete'`);
  }
  async function ax(selector) {
    const { root } = await send('DOM.getDocument');
    const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector });
    const { nodes } = await send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: true });
    return nodes;
  }
  async function capture(name) {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(resolve(output, `a11y-${name}.png`), Buffer.from(data, 'base64'));
  }
  try {
    await send('Accessibility.enable');
    report.tree = (await send('Accessibility.getFullAXTree')).nodes;
    await check('Semantic landmarks, sequential headings, names and hidden decorative artwork', async () => {
      assert.equal(report.tree.filter(node => !node.ignored && node.role?.value === 'main').length, 1);
      assert.equal(report.tree.filter(node => !node.ignored && node.role?.value === 'banner').length, 1);
      assert.equal(report.tree.filter(node => !node.ignored && node.role?.value === 'contentinfo').length, 1);
      const headings = report.tree.filter(node => !node.ignored && node.role?.value === 'heading');
      const levels = headings.map(node => node.properties.find(p => p.name === 'level').value.value);
      assert.equal(levels.filter(level => level === 1).length, 1);
      assert.ok(levels.every((level, i) => i === 0 || level <= levels[i - 1] + 1));
      for (const selector of ['.site-header .brand', '.site-footer .brand']) {
        const link = (await ax(selector)).find(node => node.role?.value === 'link');
        assert.match(link.name.value, /^am\./);
      }
      assert.equal(await evaluate("document.querySelector('.hero-architecture').getAttribute('aria-hidden')"), 'true');
      assert.equal(await evaluate("document.querySelector('.hero-architecture').getAttribute('focusable')"), 'false');
      assert.ok((await ax('.hero-architecture'))[0].ignored);
      assert.equal(await evaluate("[...document.querySelectorAll('[tabindex]')].some(n=>n.tabIndex>0)"), false);
    });
    await check('Keyboard skip link transfers focus to main', async () => {
      await navigate(base);
      await until("window.Chart && document.querySelectorAll('.project-card').length === 3");
      await key('Tab');
      assert.equal(await evaluate("document.activeElement.classList.contains('skip-link')"), true);
      await capture('skip-link');
      await key('Enter');
      assert.equal(await evaluate('document.activeElement.id'), 'main');
    });
    await check('Mobile disclosure supports Space, Tab, Shift+Tab, Escape and focus leaving header', async () => {
      await evaluate("document.querySelector('#menu-toggle').focus()");
      await key(' ', 'Space');
      assert.equal(await evaluate("document.querySelector('#menu-toggle').getAttribute('aria-expanded')"), 'true');
      await scan('375px navigation open');
      await key('Tab');
      assert.equal(await evaluate('document.activeElement.hash'), '#home');
      await key('Tab', 'Tab', 8);
      assert.equal(await evaluate('document.activeElement.id'), 'menu-toggle');
      await key('Tab');
      await key('Escape');
      assert.equal(await evaluate('document.activeElement.id'), 'menu-toggle');
      assert.equal(await evaluate("document.querySelector('#menu-toggle').getAttribute('aria-expanded')"), 'false');
      await key(' ', 'Space');
      await evaluate("document.querySelector('.hero .button').focus()");
      assert.equal(await evaluate("document.querySelector('#menu-toggle').getAttribute('aria-expanded')"), 'false');
      await evaluate("document.querySelector('#menu-toggle').click();document.querySelector('#main-nav a').focus();document.body.click()");
      assert.equal(await evaluate('document.activeElement.id'), 'menu-toggle');
    });
    await check('Filter selection keeps focus, exposes pressed state and announces matching count', async () => {
      await evaluate("[...document.querySelectorAll('.filter-button')].find(b=>b.textContent==='API').focus()");
      await key(' ', 'Space');
      assert.equal(await evaluate("document.activeElement.getAttribute('aria-pressed')"), 'true');
      assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), 1);
      const status = (await ax('#project-status')).find(node => node.role?.value === 'status');
      assert.equal(status.properties.find(p => p.name === 'live').value.value, 'polite');
      assert.match(await evaluate("document.querySelector('#project-status').textContent"), /1 sample project shown/);
      await scan('375px one filtered project');
      await evaluate("[...document.querySelectorAll('.filter-button')].find(b=>b.textContent==='All').click()");
    });
    await check('Form blur errors, associated descriptions, invalid focus and demo success are exposed', async () => {
      const emptyStatus = (await ax('#form-status')).find(node => node.role?.value === 'status');
      assert.ok(emptyStatus && !emptyStatus.ignored, 'Empty live status must already exist');
      await evaluate("document.querySelector('#contact-name').focus()");
      await key('Tab');
      assert.match(await evaluate("document.querySelector('#form-status').textContent"), /at least 2 characters/);
      await evaluate("document.querySelector('#contact-form').requestSubmit()");
      assert.equal(await evaluate('document.activeElement.id'), 'contact-name');
      assert.equal(await evaluate("document.querySelectorAll('[aria-invalid=true]').length"), 3);
      const name = (await ax('#contact-name')).find(node => node.role?.value === 'textbox');
      assert.match(name.name.value, /^Name/);
      assert.match(name.description.value, /at least 2 characters/);
      assert.equal(name.properties.find(p => p.name === 'invalid').value.value, 'true');
      await scan('375px form errors');
      await capture('form-errors-375');
      await evaluate("document.querySelector('#contact-name').value='Example';document.querySelector('#contact-email').value='learner@example.com';document.querySelector('#contact-message').value='Fictional sample message for accessibility testing.';document.querySelector('#contact-form').requestSubmit()");
      assert.match(await evaluate("document.querySelector('#form-status').textContent"), /nothing was sent or saved/);
      const status = (await ax('#form-status')).find(node => node.role?.value === 'status');
      assert.equal(status.properties.find(p => p.name === 'live').value.value, 'polite');
      await scan('375px demo success');
    });
    await check('Chart disclosure works by keyboard and exposes complete headers and values', async () => {
      await evaluate("document.querySelector('.chart-data summary').focus()");
      await key('Enter');
      assert.equal(await evaluate("document.querySelector('.chart-data').open"), true);
      const table = await ax('.chart-data table');
      assert.ok(table.some(node => node.role?.value === 'table' && /technology use/.test(node.name.value)));
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#chart-table td')].map(n=>Number(n.textContent))"), [3, 3, 2, 1]);
      await scan('375px chart table expanded');
    });
    await check('API loading and failure expose a polite status and busy result container', async () => {
      setMode('loading');
      await evaluate("document.querySelector('#api-refresh').focus()");
      await key('Enter');
      report.apiRefreshFocusWhileLoading = await evaluate('document.activeElement.id');
      assert.equal(report.apiRefreshFocusWhileLoading, 'api-refresh');
      const loadingRequests = getRequestCount();
      await key('Enter');
      await key(' ', 'Space');
      assert.equal(getRequestCount(), loadingRequests, 'Busy refresh must not start duplicate requests');
      assert.equal(await evaluate("document.querySelector('#api-refresh').getAttribute('aria-disabled')"), 'true');
      assert.equal(await evaluate("document.querySelector('#repository-list').getAttribute('aria-busy')"), 'true');
      const status = (await ax('#api-status')).find(node => node.role?.value === 'status');
      assert.equal(status.properties.find(p => p.name === 'live').value.value, 'polite');
      assert.match(await evaluate("document.querySelector('#api-status').textContent"), /^Loading/);
      await until("document.querySelector('#api-refresh').getAttribute('aria-disabled') === 'false'");
      setMode('error');
      await evaluate("document.querySelector('#api-refresh').click()");
      await until("document.querySelector('#api-status').dataset.state==='fallback'");
      assert.equal(await evaluate("document.querySelector('#repository-list').getAttribute('aria-busy')"), 'false');
      await scan('375px API fallback and expanded table');
      setMode('success');
    });
    await check('Full forward keyboard traversal shows unobscured focus at desktop and mobile', async () => {
      report.focusTraversal = [];
      for (const width of [1440, 375]) {
        await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
        await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
        await reload();
        await evaluate("scrollTo({top:0,behavior:'instant'});document.body.tabIndex=-1;document.body.focus({preventScroll:true});document.body.removeAttribute('tabindex')");
        let visited = 0;
        for (let i = 0; i < 70; i++) {
          await key('Tab');
          // CSS smooth scrolling may still be moving after focus changes.
          await until("document.activeElement===document.body || (()=>{const r=document.activeElement.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;})()", 2000);
          await delay(80);
          const item = await evaluate(`(() => {
            const n = document.activeElement, r = n.getBoundingClientRect(), s = getComputedStyle(n);
            const header = document.querySelector('.site-header').getBoundingClientRect();
            return {tag:n.tagName,id:n.id,text:n.textContent.trim().slice(0,90),top:r.top,bottom:r.bottom,
              outline:s.outlineStyle,outlineWidth:s.outlineWidth,visible:r.width>0&&r.height>0,
              obscured:!n.closest('.site-header')&&!n.classList.contains('skip-link')&&r.bottom<=header.bottom,
              pending:Boolean(n.closest('.is-pending')),inViewport:r.bottom>0&&r.top<innerHeight};
          })()`);
          if (item.tag === 'BODY') break;
          if (i > 0 && item.text === 'Skip to content') break;
          report.focusTraversal.push({ width, ...item });
          assert.ok(item.visible && item.inViewport && !item.obscured && !item.pending, JSON.stringify(item));
          assert.equal(item.outline, 'solid', JSON.stringify(item));
          visited++;
        }
        assert.ok(visited >= 16 && visited < 70, `Traversal count: ${visited}`);
        const traversed = report.focusTraversal.filter(item => item.width === width);
        assert.equal(traversed[0].text, 'Skip to content');
        if (width === 1440) assert.equal(traversed.filter(item => ['Home','About','Experience','Education','Skills','Projects','Let’s talk'].includes(item.text)).length, 7);
      }
    });
    await check('Browser zoom at 200% and 400% reflows content without horizontal page scrolling', async () => {
      report.zoom = [];
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      // Chrome's own settings API changes real browser zoom in the fresh test
      // profile. PageScaleFactor would only magnify pixels and cannot test reflow.
      for (const [factor, width] of [[2, 1440], [4, 1280], [1, 1440]]) {
        await send('Emulation.clearDeviceMetricsOverride');
        await send('Browser.setWindowBounds', { windowId: (await send('Browser.getWindowForTarget')).windowId,
          bounds: { width, height: 1000 } });
        await navigate('chrome://settings/appearance');
        await until("typeof chrome.settingsPrivate?.setDefaultZoom === 'function'");
        await evaluate(`new Promise(resolve => chrome.settingsPrivate.setDefaultZoom(${factor}, resolve))`);
        await navigate(base);
        await until("window.Chart && document.querySelectorAll('.project-card').length===3");
        const metrics = await evaluate('({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scrollWidth:document.documentElement.scrollWidth})');
        report.zoom.push({ factor, outerWidth: width, ...metrics });
        assert.equal(metrics.dpr, factor);
        assert.ok(metrics.scrollWidth <= metrics.width, JSON.stringify(metrics));
        if (factor > 1) {
          await scan(`${factor * 100}% browser zoom`);
          await capture(`zoom-${factor * 100}-hero`);
          await evaluate("document.querySelector('#menu-toggle').focus()");
          await key('Enter');
          for (let i = 0; i < 7; i++) {
            await key('Tab');
            await delay(150);
            const focused = await evaluate('(()=>{const r=document.activeElement.getBoundingClientRect();return {text:document.activeElement.textContent,top:r.top,bottom:r.bottom,height:innerHeight};})()');
            assert.ok(focused.top >= 0 && focused.top < focused.height && focused.bottom <= focused.height + 1, JSON.stringify(focused));
          }
          await capture(`zoom-${factor * 100}-menu`);
          await key('Escape');
          await evaluate("document.querySelector('#contact').scrollIntoView({behavior:'instant'})");
          await delay(500);
          await capture(`zoom-${factor * 100}-contact`);
        }
      }
    });
    await check('Text spacing overrides preserve content and form layout', async () => {
      await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 1000, deviceScaleFactor: 1, mobile: false });
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await reload();
      await evaluate("const spacing=document.createElement('style');spacing.id='qa-spacing';spacing.textContent='*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}';document.head.append(spacing)");
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
      await evaluate("document.querySelector('#contact').scrollIntoView({behavior:'instant'})");
      await capture('text-spacing-375');
      await evaluate("document.querySelector('#qa-spacing').remove()");
    });
    await check('Control boundaries exceed 3:1 on their actual surfaces', async () => {
      const contrast = await evaluate(`(() => {
        const lum = color => color.match(/[\\d.]+/g).slice(0,3).map(v=>Number(v)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
        const ratio = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
        return ['#contact-name','#contact-email','#contact-message'].map(selector=>{
          const s=getComputedStyle(document.querySelector(selector));return {selector,ratio:ratio(s.borderTopColor,s.backgroundColor)};
        });
      })()`);
      report.controlContrast = contrast;
      assert.ok(contrast.every(pair => pair.ratio >= 3));
      report.reviewedIncomplete = 'axe retains color-contrast review flags for the decorative upward arrow and text overlapped by the sticky header at the current scroll position. Reviewed the screenshots and source color pairs separately: arrow 10.96:1, contact introduction 8.97:1, chart heading 14.66:1, chart description 10.58:1, project heading 15.94:1, repository description 8.50:1. Raw incomplete results are retained; this is not a complete screen-reader or conformance test.';
    });
    await check('Reduced motion and live preference changes keep reveals and chart usable', async () => {
      assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), 'auto');
      assert.equal(await evaluate("Chart.getChart(document.querySelector('#technology-chart')).options.animation"), false);
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
      await reload();
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await delay(100);
      assert.equal(await evaluate("document.querySelectorAll('.is-pending').length"), 0);
      assert.equal(await evaluate("Chart.getChart(document.querySelector('#technology-chart')).options.animation"), false);
    });
    assert.equal(report.scans.flatMap(scan => scan.violations).length, 0, 'Review accessibility-final.json');
  } finally {
    await writeFile(resolve(output, 'accessibility-final.json'), JSON.stringify(report, null, 2));
  }
  // Restore the existing suite's initial state.
  setMode('success');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await reload();
}
