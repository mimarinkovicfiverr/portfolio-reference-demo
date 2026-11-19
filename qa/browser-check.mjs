/** Optional QA only. Requires Node 22+ and an existing Chrome installation.
 * Run from the project root: node qa/browser-check.mjs
 * No packages, installs, commits, deployment or production backend.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { once } from 'node:events';
import assert from 'node:assert/strict';

const root = process.cwd();
const output = resolve(root, 'qa/artifacts');
await mkdir(output, { recursive: true });
const prefix = '/portfolio-reference/';
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.md': 'text/plain' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(prefix)) { response.writeHead(404).end(); return; }
    const relative = pathname.slice(prefix.length) || 'index.html';
    const path = resolve(root, relative);
    if (!path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(body);
  } catch { response.writeHead(404).end(); }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}${prefix}`;
const chromePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
assert(chromePath, 'Install Chrome or adapt chromePath to your existing browser.');
const profile = resolve(output, `profile-${Date.now()}`);
const browser = spawn(chromePath, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--force-color-profile=srgb', 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
const delay = milliseconds => new Promise(resolveDelay => setTimeout(resolveDelay, milliseconds));
let socket;
const results = [];
async function test(name, fn) {
  await fn();
  results.push(name);
  console.log(`PASS ${name}`);
}

try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { port = Number((await readFile(resolve(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); break; } catch { await delay(100); }
  }
  assert(port, 'Chrome did not expose its debugging port.');
  const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then(response => response.json());
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await once(socket, 'open');
  let nextId = 1;
  const pending = new Map();
  const events = new Map();
  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolveResult, reject) => {
      pending.set(id, { resolve: resolveResult, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) task?.reject(new Error(JSON.stringify(message.error)));
      else task?.resolve(message.result);
    } else events.get(message.method)?.(message.params);
  });
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function until(expression, timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await evaluate(`Boolean(${expression})`)) return;
      await delay(80);
    }
    throw new Error(`Timed out: ${expression}`);
  }
  const errors = [];
  const networkRequests = [];
  const failedLocalRequests = [];
  events.set('Network.requestWillBeSent', event => networkRequests.push(event.request.url));
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text));
  events.set('Log.entryAdded', event => {
    if (event.entry.level === 'error' && event.entry.url?.startsWith(base)) failedLocalRequests.push(event.entry.text);
  });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  await send('Network.enable');
  let mode = 'success';
  let requests = 0;
  const sample = [
    { name: 'a-public-repository', description: 'A useful example', language: 'JavaScript', stargazers_count: 42, html_url: 'https://github.com/github/docs' },
    { name: '<img src=x onerror=alert(1)>', description: '<script>window.injected=true</script>', language: 'CSS', stargazers_count: 8, html_url: 'javascript:alert(1)' },
    { name: 'another-repository', description: null, language: null, stargazers_count: 5, html_url: 'https://evil.example/repo' },
  ];
  events.set('Fetch.requestPaused', async event => {
    requests++;
    if (mode === 'network-error') return send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'InternetDisconnected' });
    if (mode === 'timeout') return; // Aborted by the application's timeout.
    if (mode === 'loading') { await delay(650); }
    const status = mode === 'rate-limit' ? 429 : mode === 'forbidden' ? 403 : mode === 'error' ? 500 : 200;
    const body = mode === 'empty' ? [] : mode === 'malformed' ? { unexpected: true } : sample;
    await send('Fetch.fulfillRequest', { requestId: event.requestId, responseCode: status, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }], body: Buffer.from(JSON.stringify(body)).toString('base64') });
  });
  await send('Fetch.enable', { patterns: [{ urlPattern: 'https://api.github.com/*', requestStage: 'Request' }] });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: base });
  await until("document.querySelectorAll('.project-card').length === 3 && document.querySelector('#api-status').dataset.state === 'live' && window.Chart");

  if (process.argv.includes('--editability')) {
    const { checkContentEditing } = await import('./content-edit-check.mjs');
    await checkContentEditing({ send, evaluate, until, delay, base, output });
  }

  // Optional development-only audit. axe-core is never a production asset.
  if (process.argv.includes('--accessibility') || process.argv.includes('--accessibility-baseline')) {
    const { runAccessibilityAudit } = await import('./accessibility-check.mjs');
    await runAccessibilityAudit({ send, evaluate, until, delay, base, output,
      baseline: process.argv.includes('--accessibility-baseline'),
      getRequestCount: () => requests,
      setMode: value => { mode = value; } });
  }

  await test('All assets and ES modules load under a GitHub Pages style subdirectory', async () => {
    assert.equal(await evaluate('document.title'), 'Alex Morgan — Front-end Developer · Reference Portfolio');
    assert.equal(await evaluate("document.querySelectorAll('.timeline-item').length"), 3);
    assert.deepEqual(failedLocalRequests, []);
  });
  await test('Untrusted repository text stays text; unsafe links are discarded', async () => {
    assert.equal(await evaluate("document.querySelectorAll('.repository')[1].querySelectorAll('img, script, a').length"), 0);
    assert.equal(await evaluate("document.querySelectorAll('.repository')[2].querySelectorAll('a').length"), 0);
    assert.equal(await evaluate('window.injected === undefined'), true);
    assert.equal(await evaluate("document.querySelectorAll('.repository h4')[1].textContent"), sample[1].name);
  });
  await test('Chart.js renders exact computed counts with an accessible table', async () => {
    assert.equal(await evaluate("Boolean(Chart.getChart(document.querySelector('#technology-chart')))"), true);
    assert.deepEqual(await evaluate("[...document.querySelectorAll('#chart-table td')].map(td => Number(td.textContent))"), [3, 3, 2, 1]);
    assert.equal(await evaluate("Chart.getChart(document.querySelector('#technology-chart')).options.animation"), false);
  });

  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await test(`Responsive layout at ${width}px: no horizontal overflow or overlapping cards`, async () => {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await delay(150);
      assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
      const overlaps = await evaluate(`(() => {
        const cards = [...document.querySelectorAll('.project-card')].map(el => el.getBoundingClientRect());
        return cards.some((a,i) => cards.some((b,j) => i < j && Math.min(a.right,b.right) > Math.max(a.left,b.left)+1 && Math.min(a.bottom,b.bottom) > Math.max(a.top,b.top)+1));
      })()`);
      assert.equal(overlaps, false);
      const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      await writeFile(resolve(output, `viewport-${width}.png`), Buffer.from(screenshot.data, 'base64'));
      for(const [selector, label] of [['#home','hero'],['#education','education'],['#skills','skills'],['#projects','work'],['#contact','contact']]) {
        await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({behavior:'instant'})`);
        await delay(80);
        const detail=await send('Page.captureScreenshot',{format:'png'});
        await writeFile(resolve(output,`review-${label}-${width}.png`),Buffer.from(detail.data,'base64'));
      }
      await evaluate("scrollTo({top:0,behavior:'instant'})");
    });
  }

  await test('Technology filters, All filter, live count and unmatched empty state', async () => {
    await evaluate("[...document.querySelectorAll('.filter-button')].find(b => b.textContent === 'API').click()");
    assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), 1);
    assert.equal(await evaluate("document.querySelector('[aria-pressed=true]').textContent"), 'API');
    await evaluate("[...document.querySelectorAll('.filter-button')].find(b => b.textContent === 'All').click()");
    assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), 3);
    await evaluate(`(async () => {
      const {initProjects} = await import('./js/projects.js');
      const {content} = await import('./js/content.js');
      document.querySelector('#project-filters').replaceChildren();
      initProjects({...content, projectFilters:['All','No matches']});
      [...document.querySelectorAll('.filter-button')].find(b=>b.textContent==='No matches').click();
    })()`);
    assert.equal(await evaluate("document.querySelector('#project-empty').hidden"), false);
    assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), 0);
    await evaluate("document.querySelector('.filter-button').click()");
  });

  // The editorial hierarchy needs to remain usable when filters change the grid.
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await test(`Editorial project states at ${width}px: zero, one, two and all matches`, async () => {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      await evaluate(`(async()=>{
        const {initProjects}=await import('./js/projects.js');
        const {content}=await import('./js/content.js');
        document.querySelector('#project-filters').replaceChildren();
        initProjects({...content,projectFilters:[...content.projectFilters,'No matches']});
      })()`);
      for (const [filter, count] of [['All',3],['JavaScript',2],['API',1],['No matches',0]]) {
        await evaluate(`[...document.querySelectorAll('.filter-button')].find(b=>b.textContent===${JSON.stringify(filter)}).click()`);
        await delay(100);
        assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), count);
        assert.equal(await evaluate("document.querySelector('#project-grid').dataset.count"), String(count));
        assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
        assert.deepEqual(await evaluate(`(() => {
          const problems=[];
          const cards=[...document.querySelectorAll('.project-card')];
          const rects=cards.map(n=>n.getBoundingClientRect());
          if(rects.some((a,i)=>rects.some((b,j)=>i<j&&Math.min(a.right,b.right)>Math.max(a.left,b.left)+1&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top)+1))) problems.push('overlapping studies');
          for(const art of document.querySelectorAll('.project-art')) {
            const bounds=art.getBoundingClientRect();
            for(const node of art.querySelectorAll('.preview-header,.preview-title,.preview-detail,.preview-caption,.preview-index')) {
              const box=node.getBoundingClientRect();
              if(box.left<bounds.left-1||box.right>bounds.right+1||node.scrollWidth>node.clientWidth+1) problems.push('clipped miniature');
            }
          }
          return problems;
        })()`), []);
        if(count===1) assert.equal(await evaluate("Math.abs(document.querySelector('.project-card').getBoundingClientRect().width-document.querySelector('#project-grid').getBoundingClientRect().width)<2"),true);
        if(count===0) assert.equal(await evaluate("document.querySelector('#project-empty').hidden"),false);
        if(filter==='API'||filter==='No matches') {
          await evaluate("document.querySelector('#projects').scrollIntoView({behavior:'instant'})");
          await delay(80);
          const capture=await send('Page.captureScreenshot',{format:'png'});
          await writeFile(resolve(output,`projects-${count}-${width}.png`),Buffer.from(capture.data,'base64'));
        }
      }
      await evaluate("document.querySelector('.filter-button').click()");
    });
  }
  await test('Additional studies retain hierarchy and editable miniature text stays safe', async () => {
    await evaluate(`(async()=>{
      const {initProjects}=await import('./js/projects.js');
      const {content}=await import('./js/content.js');
      document.querySelector('#project-filters').replaceChildren();
      initProjects({...content,projects:[...content.projects,...[4,5].map(n=>({...content.projects[1],id:'additional-'+n,previewContent:{...content.projects[1].previewContent,title:'<img src=x onerror=alert(1)>'}}))]});
    })()`);
    assert.equal(await evaluate("document.querySelectorAll('.project-card').length"),5);
    assert.equal(await evaluate("document.querySelectorAll('.project-card--featured').length"),1);
    assert.equal(await evaluate("document.querySelectorAll('.project-art img').length"),0);
    assert.equal(await evaluate("document.querySelectorAll('.preview-title')[3].textContent"),'<img src=x onerror=alert(1)>');
    await evaluate(`(async()=>{
      const {initProjects}=await import('./js/projects.js');
      const {content}=await import('./js/content.js');
      document.querySelector('#project-filters').replaceChildren();initProjects(content);
    })()`);
  });

  await test('Form validation: required, email, short/long values, inline errors, focus, valid demo and zero sending', async () => {
    const previousRequests = requests;
    const previousNetworkRequests = networkRequests.length;
    await evaluate("document.querySelector('#contact-form').requestSubmit()");
    assert.equal(await evaluate("document.querySelectorAll('[aria-invalid=true]').length"), 3);
    assert.equal(await evaluate('document.activeElement.id'), 'contact-name');
    await evaluate("document.querySelector('#contact-name').value = 'Learner'; document.querySelector('#contact-email').value = 'wrong'; document.querySelector('#contact-message').value = 'short'; document.querySelector('#contact-form').requestSubmit()");
    assert.equal(await evaluate('document.activeElement.id'), 'contact-email');
    await evaluate("document.querySelector('#contact-email').value='learner@example.com'; document.querySelector('#contact-message').value='A fictional message with enough detail for validation.'; document.querySelector('#contact-form').requestSubmit()");
    assert.match(await evaluate("document.querySelector('#form-status').textContent"), /nothing was sent or saved/);
    assert.equal(await evaluate("document.querySelectorAll('[aria-invalid=true]').length"), 0);
    assert.equal(requests, previousRequests);
    assert.equal(networkRequests.length, previousNetworkRequests);
    assert.equal(await evaluate('location.search'), '');
    assert.deepEqual(await evaluate("(async()=>{const {validateField}=await import('./js/main.js');return ['name','email','message'].map((n,i)=>Boolean(validateField(n,'x'.repeat([81,255,2001][i]))));})()"), [true,true,true]);
  });

  await test('Keyboard menu: Enter, Tab, Escape, destination focus and close on navigation', async () => {
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: false });
    await delay(200); // Let the breakpoint's matchMedia change handler finish.
    await evaluate("scrollTo(0,0); document.querySelector('#menu-toggle').focus()");
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineStyle"), 'solid');
    assert.equal(await evaluate("document.querySelector('#menu-toggle').getAttribute('aria-expanded')"), 'true');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    assert.equal(await evaluate('document.activeElement.hash'), '#home');
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    assert.equal(await evaluate('document.activeElement.id'), 'menu-toggle');
    assert.equal(await evaluate("document.querySelector('#menu-toggle').getAttribute('aria-expanded')"), 'false');
    await evaluate("document.querySelector('#menu-toggle').click(); document.querySelector('#main-nav a[href=\"#about\"]').click()");
    assert.equal(await evaluate('document.activeElement.id'), 'about');
    assert.equal(await evaluate("document.querySelector('#menu-toggle').getAttribute('aria-expanded')"), 'false');
  });

  for (const scenario of ['loading', 'empty', 'rate-limit', 'forbidden', 'error', 'network-error', 'malformed', 'timeout']) {
    await test(`GitHub API state: ${scenario}`, async () => {
      mode = scenario;
      await evaluate("document.querySelector('#api-refresh').click()");
      if (scenario === 'loading') assert.equal(await evaluate("document.querySelector('#repository-list').getAttribute('aria-busy')"), 'true');
      await until("document.querySelector('#api-refresh').getAttribute('aria-disabled') === 'false'", 11000);
      const expected = scenario === 'loading' ? 'live' : scenario === 'empty' ? 'empty' : 'fallback';
      assert.equal(await evaluate("document.querySelector('#api-status').dataset.state"), expected);
      if (expected === 'fallback') assert.match(await evaluate("document.querySelector('#api-status').textContent"), /invented demo data/);
      if(scenario==='rate-limit') {
        for(const width of [375,1440]) {
          await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false});
          await delay(100);
          assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
          await evaluate("document.querySelector('.api-demo').scrollIntoView({behavior:'instant'})");
          await delay(80);
          const capture=await send('Page.captureScreenshot',{format:'png'});
          await writeFile(resolve(output,`api-fallback-${width}.png`),Buffer.from(capture.data,'base64'));
        }
      }
      if (scenario === 'empty') assert.equal(await evaluate("document.querySelectorAll('.repository').length"), 0);
    });
  }
  await test('Offline fallback is immediate and makes no GitHub request', async () => {
    const previousRequests = requests;
    await send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await evaluate("document.querySelector('#api-refresh').click()");
    await until("document.querySelector('#api-refresh').getAttribute('aria-disabled') === 'false'");
    assert.match(await evaluate("document.querySelector('#api-status').textContent"), /offline/);
    assert.equal(requests, previousRequests);
    await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  });
  await test('Successful responses are cached briefly; Refresh bypasses cache', async () => {
    mode = 'success';
    await evaluate("document.querySelector('#api-refresh').click()");
    await until("document.querySelector('#api-status').dataset.state === 'live'");
    const previousRequests = requests;
    await send('Page.reload', { ignoreCache: true });
    await until("document.querySelector('#api-status')?.dataset.state === 'cached'");
    assert.equal(requests, previousRequests);
  });
  await test('Malformed cache timestamps are ignored instead of being treated as fresh', async () => {
    const previousRequests = requests;
    await evaluate("sessionStorage.setItem('portfolio-github-v1:github:3', JSON.stringify({rows:[],savedAt:'invalid'}))");
    await send('Page.reload', { ignoreCache: true });
    await until("document.querySelector('#api-status')?.dataset.state === 'live'");
    assert.equal(requests, previousRequests + 1);
  });
  await test('Disabled session storage does not break the live API demonstration', async () => {
    const script = await send('Page.addScriptToEvaluateOnNewDocument', { source: "Storage.prototype.getItem = Storage.prototype.setItem = function(){throw new DOMException('Storage is disabled','SecurityError');}" });
    await send('Page.reload', { ignoreCache: true });
    await until("document.querySelector('#api-status')?.dataset.state === 'live'");
    assert.equal(await evaluate("document.querySelectorAll('.repository').length"), 3);
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: script.identifier });
  });
  await test('Chart library failure preserves the complete, visible text alternative', async () => {
    await send('Network.setBlockedURLs', { urls: ['*chart.umd.min.js*'] });
    await send('Page.reload', { ignoreCache: true });
    await until("document.querySelector('#chart-wrapper')?.hidden === true");
    assert.equal(await evaluate("document.querySelector('.chart-data').open"), true);
    assert.equal(await evaluate("document.querySelectorAll('#chart-table tr').length"), 4);
    await evaluate("document.querySelector('.chart-layout').scrollIntoView({behavior:'instant'})");
    await delay(80);
    const capture=await send('Page.captureScreenshot',{format:'png'});
    await writeFile(resolve(output,'chart-table-fallback.png'),Buffer.from(capture.data,'base64'));
    await send('Network.setBlockedURLs', { urls: [] });
  });
  await test('Reduced motion leaves all content visible with instant anchor navigation', async () => {
    assert.equal(await evaluate("document.querySelectorAll('.is-pending').length"), 0);
    assert.equal(await evaluate("getComputedStyle(document.documentElement).scrollBehavior"), 'auto');
  });
  await test('Duplicate IDs, unlabeled form controls and uncaught JavaScript exceptions are absent', async () => {
    assert.equal(await evaluate("(()=>{const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);return new Set(ids).size===ids.length;})()"), true);
    assert.equal(await evaluate("[...document.querySelectorAll('input,textarea')].every(n=>document.querySelector('label[for=\"'+n.id+'\"]'))"), true);
    assert.deepEqual(errors, []);
  });
  await test('Primary text, muted text, accent, errors and primary buttons meet 4.5:1 contrast', async () => {
    const ratios = await evaluate(`(() => {
      const style = getComputedStyle(document.documentElement);
      const color = name => style.getPropertyValue(name).trim();
      const luminance = hex => {
        const parts = hex.match(/[a-f\\d]{2}/gi).map(p=>parseInt(p,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
        return parts[0]*.2126+parts[1]*.7152+parts[2]*.0722;
      };
      return [['--text','--bg'],['--muted','--bg'],['--muted','--surface'],['--accent','--bg'],['--error','--surface']].map(([a,b])=>{
        const x=luminance(color(a)),y=luminance(color(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
      }).concat((luminance(color('--accent'))+.05)/(luminance('#0b1827')+.05));
    })()`);
    assert.equal(ratios.every(ratio => ratio >= 4.5), true, JSON.stringify(ratios));
  });
  await test('Without JavaScript, navigation remains visible and demo submission stays disabled', async () => {
    await send('Emulation.setScriptExecutionDisabled', { value: true });
    await send('Page.reload', { ignoreCache: true });
    await delay(400);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('#main-nav')).display !== 'none'"), true);
    assert.equal(await evaluate("document.querySelector('#contact-form [type=submit]').disabled"), true);
    await send('Emulation.setScriptExecutionDisabled', { value: false });
  });
  // Restore and capture the final normal-motion desktop and mobile page.
  mode = 'success';
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await send('Page.reload', { ignoreCache: true });
  await until('window.Chart && document.querySelectorAll(".project-card").length === 3');
  await test('Scroll reveals appear on entry and active navigation follows the reading section', async () => {
    await evaluate("document.querySelector('#skills').scrollIntoView({behavior:'instant'})");
    await delay(650);
    assert.equal(await evaluate("document.querySelector('#skills .reveal').classList.contains('is-pending')"), false);
    assert.equal(await evaluate("document.querySelector('#main-nav [aria-current]').hash"), '#skills');
  });
  for (const width of [375, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    await delay(500);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    await writeFile(resolve(output, `hero-${width}.png`), Buffer.from(screenshot.data, 'base64'));
  }
  await writeFile(resolve(output, 'results.json'), JSON.stringify({ date: new Date().toISOString(), url: base, browser: await send('Browser.getVersion'), passed: results }, null, 2));
  console.log(`\n${results.length} checks passed. Screenshots and report: qa/artifacts/`);
  // Try the real public endpoint separately. Its availability is not a deterministic test.
  await send('Fetch.disable');
  await evaluate("sessionStorage.clear(); document.querySelector('#api-refresh').click()");
  await until("document.querySelector('#api-refresh').getAttribute('aria-disabled') === 'false'", 11000);
  const liveAttempt = await evaluate("document.querySelector('#api-status').textContent");
  await writeFile(resolve(output, 'live-api-result.txt'), liveAttempt);
  console.log(`Real GitHub attempt: ${liveAttempt}`);
} finally {
  socket?.close();
  // Close the process we started, including its browser children, using CDP.
  try {
    const port = Number((await readFile(resolve(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
    const version = await fetch(`http://127.0.0.1:${port}/json/version`).then(response => response.json());
    const cleanupSocket = new WebSocket(version.webSocketDebuggerUrl);
    await once(cleanupSocket, 'open');
    cleanupSocket.send(JSON.stringify({ id: 1, method: 'Browser.close' }));
    cleanupSocket.close();
  } catch { browser.kill(); }
  server.closeAllConnections();
  server.close();
}
