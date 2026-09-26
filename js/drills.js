import { db, auth } from './firebase-config.js';
import {
  collection, doc, addDoc, deleteDoc, updateDoc, getDocs, query, where, orderBy, limit, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { t } from './i18n.js';
import { toast, timeAgo } from './utils.js';
import { navigate as go } from './router.js';
import { SPOT_KEYS, computeShotRatings, sessionTotalAttempts } from './shot-rating.js';

const SPOT_LABEL_KEY = {
  cornerThree: 'drills_spot_corner3', wingThree: 'drills_spot_wing3', topKey: 'drills_spot_top_key',
  deepLeft: 'drills_spot_deep_left', deepTop: 'drills_spot_deep_top', deepRight: 'drills_spot_deep_right',
  midElbow: 'drills_spot_elbow', midBaseline: 'drills_spot_baseline', freeThrow: 'drills_spot_ft', paint: 'drills_spot_paint',
};

export async function renderDrillsScreen() {
  const view = document.getElementById('view');
  view.innerHTML = `
    <header class="screen-header">
      <button class="icon-btn" id="back-btn" aria-label="${t('common_back')}">←</button>
      <h1>${t('drills_title')}</h1>
    </header>
    <form id="drill-form" class="section stack">
      ${SPOT_KEYS.map((key) => `
        <div class="drill-row">
          <span>${t(SPOT_LABEL_KEY[key])}</span>
          <input type="number" min="0" placeholder="${t('drills_makes')}" data-makes="${key}" />
          <input type="number" min="0" placeholder="${t('drills_attempts')}" data-attempts="${key}" />
        </div>`).join('')}
      <button type="submit" class="btn btn-primary">${t('common_save')}</button>
    </form>
    <section class="section">
      <h2>${t('drills_history')}</h2>
      <div id="drills-history" class="stack">${t('common_loading')}</div>
    </section>
  `;
  view.querySelector('#back-btn').addEventListener('click', () => go('profile'));

  view.querySelector('#drill-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const spots = {};
    let hasAny = false;
    for (const key of SPOT_KEYS) {
      const makes = Number(view.querySelector(`[data-makes="${key}"]`).value) || 0;
      const attempts = Number(view.querySelector(`[data-attempts="${key}"]`).value) || 0;
      if (attempts > 0) { spots[key] = { makes: Math.min(makes, attempts), attempts }; hasAny = true; }
    }
    if (!hasAny) { toast(t('drills_attempts'), true); return; }
    try {
      await addDoc(collection(db, 'shootingSessions'), {
        uid: auth.currentUser.uid, spots, createdAt: serverTimestamp(),
      });
      await recomputeAndSaveRatings();
      toast(t('drills_session_saved'));
      view.querySelector('#drill-form').reset();
      await loadHistory(view.querySelector('#drills-history'));
    } catch (err) {
      toast(err.message, true);
    }
  });

  await loadHistory(view.querySelector('#drills-history'));
}

async function loadHistory(host) {
  const snap = await getDocs(query(
    collection(db, 'shootingSessions'), where('uid', '==', auth.currentUser.uid),
    orderBy('createdAt', 'desc'), limit(30)
  ));
  if (snap.empty) { host.innerHTML = `<div class="empty-state">${t('common_none')}</div>`; return; }
  host.innerHTML = snap.docs.map((d) => {
    const s = d.data();
    const attempts = sessionTotalAttempts(s);
    return `
      <div class="card session-row">
        <span>${timeAgo(s.createdAt?.toDate?.())}</span>
        <span class="muted">${attempts} ${t('drills_attempts').toLowerCase()}</span>
        <button class="icon-btn" data-delete="${d.id}" aria-label="${t('common_delete')}">🗑</button>
      </div>`;
  }).join('');
  host.querySelectorAll('[data-delete]').forEach((b) => b.addEventListener('click', async () => {
    await deleteDoc(doc(db, 'shootingSessions', b.dataset.delete));
    await recomputeAndSaveRatings();
    await loadHistory(host);
  }));
}

async function recomputeAndSaveRatings() {
  const snap = await getDocs(query(collection(db, 'shootingSessions'), where('uid', '==', auth.currentUser.uid)));
  const sessions = snap.docs.map((d) => d.data());
  const ratings = computeShotRatings(sessions);
  await updateDoc(doc(db, 'publicProfiles', auth.currentUser.uid), {
    shotRating: { overall: ratings.overall, threePt: ratings.threePt, midRange: ratings.midRange },
  });
}
