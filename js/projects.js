import { element, externalLink, safeWebUrl } from './dom.js';

// One small editorial layout, styled in three ways. All its labels are editable
// in content.js; these are illustrations, not working project applications.
function createPreview(project) {
  const variants = ['focus', 'weather', 'portfolio'];
  const variant = variants.includes(project.preview) ? project.preview : 'portfolio';
  const preview = element('div', `project-preview preview-${variant}`);
  preview.setAttribute('role', 'img');
  preview.setAttribute('aria-label', project.previewLabel);
  const art = element('div', 'project-art');
  art.setAttribute('aria-hidden', 'true');
  const copy = project.previewContent || {};
  const header = element('div', 'preview-header');
  header.append(element('span', 'preview-brand', copy.brand || project.name), element('span', 'preview-eyebrow', copy.eyebrow || project.category));
  const title = element('div', 'preview-title', copy.title || project.name);
  const detail = element('div', 'preview-detail', copy.detail || '');
  const caption = element('p', 'preview-caption', copy.caption || '');
  const items = element('div', 'preview-index');
  (copy.items || []).forEach(item => {
    const row = element('div');
    row.append(element('span', '', item.label), element('span', '', item.value));
    items.append(row);
  });
  art.append(header, title, detail, caption, items);
  preview.append(art);
  return preview;
}

function projectCard(project, featured, featuredLabel) {
  const article = element('article', featured ? 'project-card project-card--featured' : 'project-card');
  const body = element('div', 'project-body');
  const tags = element('ul', 'tag-list');
  tags.setAttribute('aria-label', 'Technologies');
  project.tags.forEach(tag => tags.append(element('li', '', tag)));
  if (featured) body.append(element('p', 'featured-label', featuredLabel));
  body.append(element('p', 'small-label', project.category), element('h3', '', project.name), element('p', 'project-description', project.description), tags);
  const url = safeWebUrl(project.link);
  body.append(url ? externalLink(project.linkLabel, url) : element('p', 'project-concept', 'Fictional concept · Preview only'));
  article.append(createPreview(project), body);
  return article;
}

export function initProjects(content) {
  const filters = document.querySelector('#project-filters');
  const grid = document.querySelector('#project-grid');
  const buttons = [];
  const filterNames = ['All', ...new Set(content.projectFilters.filter(name => name !== 'All'))];
  function render(filter) {
    const matching = content.projects.filter(project => filter === 'All' || project.tags.includes(filter) || project.category === filter);
    // The first content record is the featured study, even after filtering.
    // A single remaining project uses the full row; additional records flow below.
    grid.dataset.count = String(matching.length);
    grid.replaceChildren(...matching.map(project => projectCard(project, project.id === content.projects[0]?.id, content.featuredProjectLabel)));
    document.querySelector('#project-empty').hidden = matching.length !== 0;
    document.querySelector('#project-status').textContent = `${matching.length} sample ${matching.length === 1 ? 'project' : 'projects'} shown. Filter: ${filter}.`;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.textContent === filter)));
  }
  filterNames.forEach(name => {
    const button = element('button', 'filter-button', name);
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => render(name));
    buttons.push(button);
    filters.append(button);
  });
  render('All');
}
