export function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function el(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstElementChild;
}

export function debounce(fn, ms = 300) {
  let handle;
  return (...args) => {
    clearTimeout(handle);
    handle = setTimeout(() => fn(...args), ms);
  };
}

// Great-circle distance in km between two lat/lng points.
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function timeAgo(date) {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const steps = [
    [60, 's'], [60, 'm'], [24, 'h'], [7, 'd'], [4.345, 'w'], [12, 'mo'], [Infinity, 'y'],
  ];
  let value = seconds;
  let unit = 's';
  for (const [factor, label] of steps) {
    if (value < factor) { unit = label; break; }
    value = Math.floor(value / factor);
    unit = label;
  }
  return unit === 's' && value < 5 ? 'now' : `${value}${unit}`;
}

// Deterministic id for a 1:1 DM thread between two uids.
export function dmConvoId(uidA, uidB) {
  return [uidA, uidB].sort().join('_');
}

// Badge tier from a player's average peer rating (0-10) and how many
// ratings they've received. Both thresholds must be met.
export function badgeTier(avgRating = 0, ratingCount = 0) {
  if (avgRating >= 9 && ratingCount >= 50) return 'hof';
  if (avgRating >= 8 && ratingCount >= 25) return 'gold';
  if (avgRating >= 6 && ratingCount >= 10) return 'silver';
  return 'bronze';
}

export function toast(message, isError = false) {
  const host = document.getElementById('toast-host');
  if (!host) return;
  const node = el(`<div class="toast ${isError ? 'toast-error' : ''}">${escapeHtml(message)}</div>`);
  host.appendChild(node);
  requestAnimationFrame(() => node.classList.add('toast-show'));
  setTimeout(() => {
    node.classList.remove('toast-show');
    setTimeout(() => node.remove(), 250);
  }, 3000);
}

export function openModal(innerHtml) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal-card" role="dialog" aria-modal="true">
        <button class="icon-btn modal-close" aria-label="Close">✕</button>
        <div class="modal-body">${innerHtml}</div>
      </div>
    </div>
  `);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('modal-show'));
  const close = () => {
    overlay.classList.remove('modal-show');
    setTimeout(() => overlay.remove(), 200);
  };
  overlay.querySelector('.modal-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.close = close;
  return overlay;
}

export function initials(name = '?') {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
}
