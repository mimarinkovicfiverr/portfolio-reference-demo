import { element } from './dom.js';

export function technologyCounts(projects, technologies) {
  return technologies.map(technology => projects.filter(project => project.tags.includes(technology)).length);
}

// Loading independently keeps a missing library from blocking the rest of the site.
function loadChartLibrary() {
  return new Promise((resolve, reject) => {
    if (window.Chart) return resolve(window.Chart);
    const script = document.createElement('script');
    script.src = new URL('../assets/vendor/chart.umd.min.js', import.meta.url).href;
    script.onload = () => window.Chart ? resolve(window.Chart) : reject(new Error('Chart.js is unavailable.'));
    script.onerror = () => reject(new Error('Chart.js failed to load.'));
    document.head.append(script);
  });
}

export async function initChart(content) {
  const labels = content.chart.technologies;
  const counts = technologyCounts(content.projects, labels);
  const table = document.querySelector('#chart-table');
  labels.forEach((label, index) => {
    const row = element('tr');
    const heading = element('th', '', label);
    heading.scope = 'row';
    row.append(heading, element('td', '', String(counts[index])));
    table.append(row);
  });

  try {
    const Chart = await loadChartLibrary();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const chart = new Chart(document.querySelector('#technology-chart'), {
      type: 'bar',
      data: { labels, datasets: [{ data: counts, backgroundColor: content.chart.colors, borderRadius: 4, barThickness: 18 }] },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: reducedMotion.matches ? false : { duration: 450 },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: context => ` ${context.raw} sample ${context.raw === 1 ? 'project' : 'projects'}` } } },
        scales: {
          x: { beginAtZero: true, suggestedMax: Math.max(1, ...counts), ticks: { stepSize: 1, color: '#a4afc2', font: { size: 12 } }, grid: { color: '#27364b' }, border: { display: false } },
          y: { ticks: { color: '#d4dfef', font: { size: 13 }, padding: 8 }, grid: { display: false }, border: { display: false } },
        },
      },
    });
    reducedMotion.addEventListener('change', event => {
      chart.options.animation = event.matches ? false : { duration: 450 };
      chart.update('none');
    });
    document.querySelector('#chart-status').textContent = 'Sample project counts · Exact values in the table below.';
  } catch {
    document.querySelector('#chart-wrapper').hidden = true;
    document.querySelector('#chart-status').textContent = 'The chart could not load. The complete data is available in this table.';
    document.querySelector('.chart-data').open = true;
  }
}
