/** Optional source-edit exercises: node qa/browser-check.mjs --editability
 * Uses fictional test copy, saves the original bytes and restores them in finally.
 * Do not edit content.js yourself while this optional check is running.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

export async function checkContentEditing({ send, evaluate, until, delay, base, output }) {
  const path = resolve('js/content.js');
  const original = await readFile(path);
  const report = { date: new Date().toISOString(), passed: [], screenshots: [], restored: false };
  const hash = value => createHash('sha256').update(value).digest('hex');
  report.originalSha256 = hash(original);
  // Retain a recovery copy even if the Node process is externally terminated.
  await writeFile(resolve(output, 'content-before-editability.txt'), original);
  let source = original.toString('utf8');
  function replace(before, after) {
    assert.equal(source.split(before).length, 2, `Expected one editing target: ${before}`);
    source = source.replace(before, after);
  }
  function emptyArray(name) {
    const start = source.indexOf(`  ${name}: [`);
    const end = source.indexOf('\n  ],', start) + '\n  ],'.length;
    assert.ok(start >= 0 && end > start);
    source = source.slice(0, start) + `  ${name}: [],` + source.slice(end);
  }
  async function saveAndReload() {
    await writeFile(path, source, 'utf8');
    await reload();
  }
  async function reload() {
    const previous = await evaluate('performance.timeOrigin');
    await send('Page.reload', { ignoreCache: true });
    await until(`performance.timeOrigin !== ${previous} && document.readyState === 'complete'`);
    await until("window.Chart?.getChart(document.querySelector('#technology-chart')) && document.querySelector('#api-refresh')?.getAttribute('aria-disabled')==='false'");
  }
  async function capture(name, selector) {
    if (selector) await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({behavior:'instant'})`);
    await delay(100);
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `editing-${name}.png`;
    await writeFile(resolve(output, filename), Buffer.from(data, 'base64'));
    report.screenshots.push(filename);
  }
  async function check(name, fn) {
    await fn();
    report.passed.push(name);
    console.log(`EDIT PASS ${name}`);
  }
  try {
    await check('Name, branding, biography and browser title edited only in content.js', async () => {
      replace("  name: 'Alex Morgan',", "  name: 'Jordan Example',");
      replace("  brand: 'am',", "  brand: 'je',");
      replace("pageTitle: 'Alex Morgan —", "pageTitle: 'Jordan Example —");
      replace('I’m Alex, a fictional', 'I’m Jordan, a fictional');
      await saveAndReload();
      assert.equal(await evaluate("document.querySelector('[data-content=name]').textContent"), 'Jordan Example');
      assert.equal(await evaluate("[...document.querySelectorAll('[data-content=brand]')].every(n=>n.textContent==='je')"), true);
      assert.match(await evaluate('document.title'), /^Jordan Example/);
      assert.match(await evaluate("document.querySelector('[data-content=\"about.lead\"]').textContent"), /I’m Jordan/);
      assert.equal(await evaluate("new DOMParser().parseFromString(decodeURIComponent(document.querySelector('link[rel=icon]').getAttribute('href').split(',')[1]),'image/svg+xml').querySelector('text').textContent"), 'je');
      await capture('name-brand', '#home');
    });
    await check('Added a complete fourth project and edited its miniature and introduction', async () => {
      replace("  projects: [\n", `  projects: [
    {
      id: 'practice-notes', name: 'Practice notes', category: 'Learning experiments',
      description: 'A fictional fourth study used only to check content editing.',
      tags: ['CSS'], preview: 'portfolio',
      previewLabel: 'Illustrative Practice notes index with a single fictional entry.',
      previewContent: {
        brand: 'notes.', eyebrow: 'FICTIONAL PRACTICE', title: 'Notes from practice.',
        caption: 'A temporary editing exercise.', detail: 'Learning index',
        items: [{ label: 'First experiment', value: 'CSS' }],
      },
      link: '', linkLabel: 'View practice notes',
    },
`);
      replace("projectsIntro: 'Three approaches", "projectsIntro: 'Four approaches");
      await saveAndReload();
      assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), 4);
      assert.equal(await evaluate("document.querySelectorAll('.project-card--featured').length"), 1);
      assert.match(await evaluate("document.querySelector('.project-card .preview-title').textContent"), /Notes from practice/);
      assert.equal(await evaluate("document.querySelector('.project-card .project-body h3').textContent"), 'Practice notes');
      // Inserting at the beginning intentionally demonstrates how to feature it.
      await capture('added-project', '.project-card');
    });
    await check('Changed a category, added its matching filter and retained focus/pressed state', async () => {
      replace("category: 'Public data & interaction'", "category: 'Practice studies'");
      replace("projectFilters: ['All',", "projectFilters: ['Practice studies', 'All',");
      await saveAndReload();
      await evaluate("[...document.querySelectorAll('.filter-button')].find(n=>n.textContent==='Practice studies').focus();document.activeElement.click()");
      assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), 1);
      assert.equal(await evaluate("document.querySelector('.project-body h3').textContent"), 'Weatherly');
      assert.equal(await evaluate("document.activeElement.getAttribute('aria-pressed')"), 'true');
      assert.match(await evaluate("document.querySelector('#project-status').textContent"), /1 sample project shown/);
      await capture('category-filter', '#project-filters');
    });
    await check('Changed project tags: both chart and table recomputed 3, 4, 3, 2', async () => {
      replace("tags: ['HTML', 'CSS'], preview: 'focus'", "tags: ['HTML', 'CSS', 'JavaScript', 'API'], preview: 'focus'");
      await saveAndReload();
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#chart-table td')].map(n=>Number(n.textContent))"), [3, 4, 3, 2]);
      assert.deepEqual(await evaluate("Chart.getChart(document.querySelector('#technology-chart')).data.datasets[0].data"), [3, 4, 3, 2]);
      await evaluate("document.querySelector('.chart-data').open=true");
      await capture('chart-tags', '.chart-layout');
    });
    await check('Removed one complete experience record and retained the other two', async () => {
      const start = source.indexOf('    {\n', source.indexOf('  experience: ['));
      const end = source.indexOf('    },\n', start) + '    },\n'.length;
      assert.ok(start > 0 && end > start);
      source = source.slice(0, start) + source.slice(end);
      await saveAndReload();
      assert.equal(await evaluate("document.querySelectorAll('.timeline-item').length"), 2);
      assert.equal(await evaluate("document.querySelector('.timeline-content h3').textContent"), 'Web Development Intern');
      await capture('removed-experience', '#experience');
    });
    await check('Edited hero, About, skills, contact and the newly centralized section copy', async () => {
      replace("title: 'Building for the browser.'", "title: 'Learning through small projects.'");
      replace("lead: 'I’m Jordan,", "lead: 'I’m Jordan, studying interfaces as");
      replace("items: ['HTML5', 'CSS3',", "items: ['Semantic HTML', 'Modern CSS',");
      replace("value: 'hello@example.com'", "value: 'practice@example.com'");
      replace("experienceNote: 'Sample roles and responsibilities. Fictional employers throughout.'", "experienceNote: 'Temporary fictional learning history.'");
      replace("educationNote: 'Fictional qualifications and courses.'", "educationNote: 'Temporary fictional courses.'");
      replace("certificationsHeading: 'Certifications & learning'", "certificationsHeading: 'Practice certificates'");
      replace("skillsNote: 'A practical toolkit for the sample work below.'", "skillsNote: 'Temporary practice toolkit.'");
      await saveAndReload();
      for (const [property, expected] of Object.entries({
        'hero.title': 'Learning through small projects.', experienceNote: 'Temporary fictional learning history.',
        educationNote: 'Temporary fictional courses.', certificationsHeading: 'Practice certificates', skillsNote: 'Temporary practice toolkit.',
      })) {
        assert.equal(await evaluate(`document.querySelector('[data-content="${property}"]').textContent`), expected);
      }
      assert.match(await evaluate("document.querySelector('#skills-list').textContent"), /Semantic HTML/);
      assert.match(await evaluate("document.querySelector('#contact-details').textContent"), /practice@example.com/);
    });
    await check('Education/certifications add and remove without touching rendering code', async () => {
      replace('  education: [\n', "  education: [\n    { period: '2026', qualification: 'Practice course', institution: 'Example School', description: 'Fictional addition.' },\n");
      replace('  certifications: [\n', "  certifications: [\n    { name: 'Practice award', issuer: 'Example School', year: '2026', note: 'Fictional addition' },\n");
      await saveAndReload();
      assert.equal(await evaluate("document.querySelectorAll('.education-entry').length"), 2);
      assert.equal(await evaluate("document.querySelectorAll('#certification-list > li').length"), 3);
      emptyArray('education');
      emptyArray('certifications');
      await saveAndReload();
      assert.equal(await evaluate("document.querySelectorAll('.education-entry, #certification-list > li').length"), 0);
    });
    await check('Empty experience, skills and project lists remain usable with zero chart counts', async () => {
      emptyArray('experience'); emptyArray('skills'); emptyArray('projects');
      await saveAndReload();
      assert.equal(await evaluate("document.querySelectorAll('.timeline-item,.skill-group,.project-card').length"), 0);
      assert.equal(await evaluate("document.querySelector('#project-empty').hidden"), false);
      assert.deepEqual(await evaluate("Chart.getChart(document.querySelector('#technology-chart')).data.datasets[0].data"), [0, 0, 0, 0]);
      assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'), true);
    });
  } finally {
    await writeFile(path, original);
    report.restored = hash(await readFile(path)) === report.originalSha256;
    await writeFile(resolve(output, 'content-editability.json'), JSON.stringify(report, null, 2));
    assert.equal(report.restored, true, 'Original content.js bytes must be restored');
    await reload();
    await evaluate("scrollTo({top:0,behavior:'instant'})");
  }
  assert.equal(await evaluate("document.querySelector('[data-content=name]').textContent"), 'Alex Morgan');
  assert.equal(await evaluate("document.querySelectorAll('.project-card').length"), 3);
  assert.equal(await evaluate("document.querySelectorAll('.timeline-item').length"), 3);
  assert.deepEqual(await evaluate("[...document.querySelectorAll('#chart-table td')].map(n=>Number(n.textContent))"), [3, 3, 2, 1]);
}
