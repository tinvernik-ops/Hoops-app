import { clearUnsubs } from './state.js';

const routes = new Map(); // path -> async (params) => void

export function registerRoute(path, handler) {
  routes.set(path, handler);
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '') || 'court';
  const [path, ...rest] = raw.split('/');
  return { path, params: rest };
}

export async function navigate(path) {
  location.hash = `#/${path}`;
}

async function render() {
  const { path, params } = parseHash();
  const handler = routes.get(path) || routes.get('court');
  clearUnsubs();

  document.querySelectorAll('.tab').forEach((tabEl) => {
    tabEl.classList.toggle('tab-active', tabEl.dataset.route === path);
  });
  const shell = document.getElementById('tabbar');
  if (shell) shell.hidden = !['court', 'leagues', 'chat', 'profile'].includes(path);

  const view = document.getElementById('view');
  view.setAttribute('aria-busy', 'true');
  try {
    await handler(params);
  } catch (err) {
    console.error('Route render failed', err);
    view.innerHTML = `<div class="empty-state">Something broke loading this screen. Try again.</div>`;
  } finally {
    view.setAttribute('aria-busy', 'false');
    view.scrollTo(0, 0);
  }
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}
