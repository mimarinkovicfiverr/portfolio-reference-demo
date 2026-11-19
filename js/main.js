import { content } from './content.js';
import { element, externalLink, safeWebUrl } from './dom.js';
import { initProjects } from './projects.js';
import { initApi } from './api.js';
import { initChart } from './chart.js';

function renderContent() {
  document.title = content.pageTitle;
  document.querySelector('meta[name="description"]').content = content.pageDescription;
  document.querySelectorAll('[data-content]').forEach(node => {
    const value = node.dataset.content.split('.').reduce((object, key) => object?.[key], content);
    if (typeof value === 'string') node.textContent = value;
  });
  // Reuse the existing SVG design; changing brand also updates the tab icon.
  // A replacement image-file favicon is left as supplied in index.html.
  const icon = document.querySelector('link[rel="icon"]');
  const iconUrl = icon?.getAttribute('href') || '';
  if (iconUrl.startsWith('data:image/svg+xml,')) {
    const svg = new DOMParser().parseFromString(decodeURIComponent(iconUrl.split(',')[1]), 'image/svg+xml');
    const mark = svg.querySelector('text');
    if (mark) {
      mark.textContent = content.brand;
      icon.href = `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    }
  }
  content.hero.notes.forEach(note => {
    const group = element('div');
    group.append(element('dt', '', note.label), element('dd', '', note.detail));
    document.querySelector('#hero-notes').append(group);
  });
  content.about.paragraphs.forEach(text => document.querySelector('#about-paragraphs').append(element('p', '', text)));
  const facts = document.querySelector('#about-facts');
  content.about.facts.forEach(fact => {
    const group = element('div');
    group.append(element('dt', '', fact.label), element('dd', '', fact.value));
    facts.append(group);
  });

  content.experience.forEach(job => {
    const item = element('li', 'timeline-item');
    const date = element('div', 'timeline-date', job.period);
    date.append(element('span', 'timeline-type', job.type));
    const body = element('div', 'timeline-content');
    const highlights = element('ul');
    job.highlights.forEach(text => highlights.append(element('li', '', text)));
    body.append(element('h3', '', job.role), element('p', 'timeline-organization', job.organization), element('p', '', job.description), highlights);
    item.append(date, body);
    document.querySelector('#experience-list').append(item);
  });

  content.education.forEach(education => {
    const article = element('article', 'education-entry');
    article.append(element('span', 'small-label', education.period), element('h3', '', education.qualification), element('p', 'institution', education.institution), element('p', '', education.description));
    document.querySelector('#education-list').append(article);
  });
  content.certifications.forEach(certification => {
    const item = element('li');
    item.append(element('h4', '', certification.name), element('p', '', `${certification.issuer} · ${certification.year}`), element('p', '', certification.note));
    document.querySelector('#certification-list').append(item);
  });

  content.skills.forEach(skill => {
    const group = element('div', 'skill-group');
    const list = element('ul');
    skill.items.forEach(text => list.append(element('li', '', text)));
    group.append(element('h3', '', skill.title), element('p', '', skill.description), list);
    document.querySelector('#skills-list').append(group);
  });
  content.contact.details.forEach(detail => {
    const group = element('div');
    const value = element('dd');
    const url = safeWebUrl(detail.url);
    value.append(url ? externalLink(detail.value, url) : document.createTextNode(detail.value));
    group.append(element('dt', '', detail.label), value);
    document.querySelector('#contact-details').append(group);
  });
}

function initNavigation() {
  const button = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#main-nav');
  const label = document.querySelector('#menu-label');
  const mobile = window.matchMedia('(max-width: 900px)');
  function setOpen(open, returnFocus = false) {
    const restoreFocus = returnFocus || (!open && mobile.matches && nav.contains(document.activeElement));
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close menu' : 'Open menu';
    if (restoreFocus) button.focus();
  }
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    setOpen(false);
    // The activated link becomes hidden on mobile. Move focus to its destination.
    if (mobile.matches) {
      const target = document.querySelector(link.hash);
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (mobile.matches && !event.target.closest('.site-header')) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusWasInNav = nav.contains(document.activeElement);
    setOpen(false, mobile.matches && focusWasInNav);
  });

  if ('IntersectionObserver' in window) {
    // Pick the section crossing a reading band below the sticky header.
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section').forEach(section => activeObserver.observe(section));
  }
  document.documentElement.classList.add('js-enabled');
}

export function validateField(name, value) {
  const text = value.trim();
  if (name === 'name') {
    if (text.length < 2) return 'Enter a name with at least 2 characters.';
    if (text.length > 80) return 'Keep the name to 80 characters or fewer.';
  }
  if (name === 'email') {
    if (!text) return 'Enter an example email address, such as learner@example.com.';
    if (text.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'Enter an email in the format learner@example.com.';
  }
  if (name === 'message') {
    if (text.length < 20) return 'Write at least 20 characters so the example message has some detail.';
    if (text.length > 2000) return 'Keep the message to 2000 characters or fewer.';
  }
  return '';
}

function initForm() {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const fields = [...form.querySelectorAll('input, textarea')];
  function check(input) {
    const error = validateField(input.name, input.value);
    document.querySelector(`#${input.name}-error`).textContent = error;
    input.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  }
  fields.forEach(input => {
    input.addEventListener('blur', () => {
      // The description explains the error on return; the polite status also
      // reports a new error when the visitor leaves the field.
      if (!check(input)) status.textContent = document.querySelector(`#${input.name}-error`).textContent;
    });
    input.addEventListener('input', () => {
      status.textContent = '';
      if (input.hasAttribute('aria-invalid')) check(input);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault(); // DEMO ONLY: no fetch(), email service, storage or sending.
    const results = fields.map(check);
    const firstInvalid = results.indexOf(false);
    if (firstInvalid !== -1) {
      status.textContent = 'Please fix the highlighted fields. No message has been sent.';
      fields[firstInvalid].focus();
      return;
    }
    status.textContent = 'Your example message passed validation. This is a demo: nothing was sent or saved.';
  });
  // Keep the button disabled until the no-send handler is attached. With JS off,
  // visitors cannot accidentally submit the form using the browser's default GET.
  form.querySelector('button[type="submit"]').disabled = false;
}

function initReveals() {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(node => {
    node.classList.add('is-pending');
    observer.observe(node);
  });
  document.addEventListener('focusin', event => {
    // Keyboard focus must never wait for an offscreen entrance animation.
    const pending = event.target.closest('.reveal.is-pending');
    if (pending) {
      pending.classList.remove('is-pending');
      observer.unobserve(pending);
    }
  });
  document.documentElement.classList.add('reveal-ready');
  motion.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.is-pending').forEach(node => node.classList.remove('is-pending'));
    }
  });
}

renderContent();
initNavigation();
initProjects(content);
initForm();
initReveals();
initChart(content);
initApi(content.demo);
