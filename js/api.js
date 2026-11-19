import { element, externalLink, safeWebUrl } from './dom.js';

// Normalize untrusted network/storage data before it reaches the interface.
export function normalizeRepositories(rows, limit) {
  if (!Array.isArray(rows)) throw new Error('Unexpected GitHub response.');
  return rows.slice(0, limit).map(repo => {
    if (!repo || typeof repo.name !== 'string') throw new Error('Invalid repository record.');
    return {
      name: repo.name.slice(0, 160),
      description: typeof repo.description === 'string' ? repo.description.slice(0, 320) : 'No description provided.',
      language: typeof repo.language === 'string' ? repo.language.slice(0, 50) : 'Not specified',
      stars: Number.isFinite(repo.stargazers_count) ? Math.max(0, Math.floor(repo.stargazers_count)) : 0,
      url: safeWebUrl(repo.html_url, 'github.com') || '',
    };
  });
}

function renderRepositories(repositories) {
  const list = document.querySelector('#repository-list');
  list.replaceChildren();
  repositories.forEach(repo => {
    const article = element('article', 'repository');
    const heading = element('h4');
    const url = safeWebUrl(repo.url, 'github.com');
    heading.append(url ? externalLink(repo.name, url) : document.createTextNode(repo.name));
    const meta = element('p', 'repository-meta');
    meta.append(element('span', '', repo.language || 'Not specified'), element('span', '', `${Number(repo.stars).toLocaleString('en')} stars`));
    article.append(heading, element('p', '', repo.description), meta);
    list.append(article);
  });
}

export function initApi(settings) {
  const status = document.querySelector('#api-status');
  const list = document.querySelector('#repository-list');
  const refresh = document.querySelector('#api-refresh');
  const organization = settings.githubOrganization;
  const limit = Math.min(6, Math.max(1, Math.floor(Number(settings.repositoryLimit) || 3)));
  const ttl = Math.max(0, Number(settings.cacheMinutes) || 0) * 60000;
  const cacheKey = `portfolio-github-v1:${organization}:${limit}`;
  let busy = false;

  document.querySelector('#api-description').textContent = `A separate, read-only API demonstration: public repositories from ${organization}. These repositories are not my work.`;

  function readCache() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey));
      if (!cached || !Number.isFinite(cached.savedAt) || Date.now() - cached.savedAt >= ttl || cached.savedAt > Date.now()) return null;
      // Store the original API records and run the same validation again on read.
      return normalizeRepositories(cached.rows, limit);
    } catch {
      return null; // Storage may be disabled; the API still works without it.
    }
  }

  function fallback(reason) {
    renderRepositories(settings.fallbackRepositories.slice(0, limit));
    status.textContent = `${reason} Showing invented demo data, including illustrative star counts; this is not live GitHub data.`;
    status.dataset.state = 'fallback';
  }

  async function load({ force = false } = {}) {
    if (busy) return;
    busy = true;
    // Keep the initiating button in the keyboard focus order while loading.
    // The busy guard above also prevents activation by click, Enter or Space.
    refresh.setAttribute('aria-disabled', 'true');
    list.setAttribute('aria-busy', 'true');
    status.dataset.state = 'loading';
    status.textContent = `Loading public repositories from ${organization}…`;
    const controller = new AbortController();
    let timeout;
    try {
      if (!navigator.onLine) {
        fallback('You appear to be offline.');
        return;
      }
      if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(organization)) {
        fallback('The demo organization setting is invalid.');
        return;
      }
      const cached = !force && readCache();
      if (cached) {
        renderRepositories(cached);
        status.textContent = cached.length ? `Cached public GitHub data from ${organization} · Saved in this tab for up to ${settings.cacheMinutes} minutes.` : `Cached GitHub response: no public repositories were returned for ${organization}.`;
        status.dataset.state = 'cached';
        return;
      }
      timeout = setTimeout(() => controller.abort(), Math.min(30000, Math.max(1000, Number(settings.timeoutMs) || 8000)));
      const url = `https://api.github.com/orgs/${encodeURIComponent(organization)}/repos?type=public&sort=updated&per_page=${limit}`;
      const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      if (response.status === 403 || response.status === 429) {
        fallback('GitHub has limited or denied this unauthenticated request. Please try later.');
        return;
      }
      if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}.`);
      const rows = await response.json();
      const repositories = normalizeRepositories(rows, limit);
      renderRepositories(repositories);
      status.dataset.state = repositories.length ? 'live' : 'empty';
      status.textContent = repositories.length ? `Live public GitHub data from ${organization} · ${repositories.length} repositories · Not portfolio work.` : `GitHub returned no public repositories for ${organization}. The response is empty; no projects are hidden.`;
      try {
        if (ttl > 0) sessionStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), rows: rows.slice(0, limit) }));
      } catch { /* No persistent storage is required. */ }
    } catch (error) {
      fallback(error.name === 'AbortError' ? 'The GitHub request timed out.' : 'Live GitHub data is unavailable. Check the connection or organization setting and try again.');
    } finally {
      clearTimeout(timeout);
      busy = false;
      refresh.setAttribute('aria-disabled', 'false');
      list.setAttribute('aria-busy', 'false');
    }
  }

  refresh.addEventListener('click', () => load({ force: true }));
  // No automatic retries or polling: avoid spending the public API rate allowance.
  load();
}
