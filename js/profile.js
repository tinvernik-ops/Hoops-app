import { db, auth } from './firebase-config.js';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, limit, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { t } from './i18n.js';
import { escapeHtml, initials, toast, openModal, badgeTier } from './utils.js';
import { navigate } from './router.js';
import { getState, setState } from './state.js';
import { SPOT_KEYS, sumSpots } from './shot-rating.js';

const BADGE_ICON = { bronze: '🥉', silver: '🥈', gold: '🥇', hof: '🏆' };
const SPOT_LABEL_KEY = {
  cornerThree: 'drills_spot_corner3', wingThree: 'drills_spot_wing3', topKey: 'drills_spot_top_key',
  deepLeft: 'drills_spot_deep_left', deepTop: 'drills_spot_deep_top', deepRight: 'drills_spot_deep_right',
  midElbow: 'drills_spot_elbow', midBaseline: 'drills_spot_baseline', freeThrow: 'drills_spot_ft', paint: 'drills_spot_paint',
};

export async function renderOwnProfile() {
  const uid = auth.currentUser.uid;
  await recomputeRatingsAggregate(uid);
  return renderProfileFor(uid, true);
}

export async function renderPlayerProfile([uid]) {
  return renderProfileFor(uid, uid === auth.currentUser.uid);
}

async function recomputeRatingsAggregate(uid) {
  try {
    const snap = await getDocs(query(collection(db, 'ratings'), where('ratedId', '==', uid)));
    if (snap.empty) return;
    let offense = 0, defense = 0;
    snap.forEach((d) => { offense += d.data().offense || 0; defense += d.data().defense || 0; });
    const count = snap.size;
    const offenseAvg = offense / count, defenseAvg = defense / count;
    await updateDoc(doc(db, 'publicProfiles', uid), {
      ratingsAgg: { offenseAvg, defenseAvg, count },
      badgeTier: badgeTier((offenseAvg + defenseAvg) / 2, count),
    });
  } catch (err) {
    console.warn('rating aggregate recompute failed', err);
  }
}

async function renderProfileFor(uid, isMine) {
  const view = document.getElementById('view');
  view.innerHTML = `<div class="stack" style="padding:16px">${t('common_loading')}</div>`;
  const pubSnap = await getDoc(doc(db, 'publicProfiles', uid));
  if (!pubSnap.exists()) { view.innerHTML = `<div class="empty-state">${t('common_error_generic')}</div>`; return; }
  const pub = pubSnap.data();
  const ratings = pub.ratingsAgg || { offenseAvg: 0, defenseAvg: 0, count: 0 };
  const shot = pub.shotRating || { overall: 35, threePt: 35, midRange: 35 };
  const tier = pub.badgeTier || 'bronze';

  view.innerHTML = `
    <header class="screen-header">
      ${isMine ? '' : `<button class="icon-btn" id="back-btn" aria-label="${t('common_back')}">←</button>`}
      <h1>${t('profile_title')}</h1>
      ${isMine ? `<button class="icon-btn" id="settings-btn" aria-label="${t('common_settings')}">⚙️</button>` : '<span></span>'}
    </header>
    <div class="profile-hero">
      <div class="avatar avatar-lg">${pub.photoURL ? `<img src="${pub.photoURL}" alt=""/>` : initials(pub.username)}</div>
      <h2>${escapeHtml(pub.username)} <span title="${t(`profile_${tier}`)}">${BADGE_ICON[tier]}</span></h2>
      <p class="muted">${escapeHtml(pub.playstyle || '')}</p>
      <div class="stat-row">
        <div><strong>${pub.height || '—'}</strong><span>${t('profile_height')}</span></div>
        <div><strong>${pub.vertical || '—'}</strong><span>${t('profile_vertical')}</span></div>
        <div><strong>${pub.weight || '—'}</strong><span>${t('profile_weight')}</span></div>
      </div>
      <div class="stat-row">
        <div><strong>${ratings.offenseAvg.toFixed(1)}</strong><span>${t('profile_offense')}</span></div>
        <div><strong>${ratings.defenseAvg.toFixed(1)}</strong><span>${t('profile_defense')}</span></div>
      </div>
      ${isMine ? `<button class="btn btn-outline btn-small" id="edit-profile">${t('profile_edit')}</button>`
        : `<button class="btn btn-primary btn-small" id="rate-player">${t('profile_rate_player')}</button>`}
    </div>

    <section class="section">
      <h2>${t('profile_shot_rating')}</h2>
      <div class="stat-row">
        <div><strong>${shot.overall}</strong><span>${t('profile_shot_rating')}</span></div>
        <div><strong>${shot.threePt}</strong><span>${t('profile_three_pt')}</span></div>
        <div><strong>${shot.midRange}</strong><span>${t('profile_mid_range')}</span></div>
      </div>
    </section>

    ${isMine ? `
      <section class="section">
        <div class="section-head-row"><h2>${t('profile_shot_chart')}</h2>
          <button class="btn btn-small btn-outline" id="log-drill">${t('drills_log_session')}</button></div>
        <div id="shot-chart-host"></div>
      </section>` : ''}
  `;

  if (!isMine) view.querySelector('#back-btn').addEventListener('click', () => history.back());
  if (isMine) {
    view.querySelector('#settings-btn').addEventListener('click', () => navigate('settings'));
    view.querySelector('#edit-profile').addEventListener('click', () => openEditProfileModal(pub));
    view.querySelector('#log-drill').addEventListener('click', () => navigate('drills'));
    await renderShotChart(view.querySelector('#shot-chart-host'), uid);
  } else {
    view.querySelector('#rate-player').addEventListener('click', () => openRateModal(uid, pub.username));
  }
}

async function renderShotChart(host, uid) {
  const snap = await getDocs(query(collection(db, 'shootingSessions'), where('uid', '==', uid), orderBy('createdAt', 'desc'), limit(200)));
  const sessions = snap.docs.map((d) => d.data());
  if (!sessions.length) {
    host.innerHTML = `<div class="empty-state">${t('common_none')}</div>`;
    return;
  }
  const zones = SPOT_KEYS.map((key) => {
    const { makes, attempts } = sumSpots(sessions, [key]);
    const pct = attempts ? Math.round((makes / attempts) * 100) : null;
    return { key, makes, attempts, pct };
  });
  host.innerHTML = `<div class="shot-chart">${zones.map((z) => `
    <div class="shot-zone" style="--pct:${z.pct ?? 0}">
      <span class="shot-zone-label">${t(SPOT_LABEL_KEY[z.key])}</span>
      <span class="shot-zone-pct">${z.pct === null ? '—' : z.pct + '%'}</span>
      <span class="shot-zone-attempts muted">${z.makes}/${z.attempts}</span>
    </div>`).join('')}</div>`;
}

function openEditProfileModal(pub) {
  const modal = openModal(`
    <h2>${t('profile_edit')}</h2>
    <label class="field"><span>${t('nav_profile')}</span><input id="ep-username" value="${escapeHtml(pub.username)}" /></label>
    <label class="field"><span>${t('profile_playstyle')}</span><input id="ep-playstyle" value="${escapeHtml(pub.playstyle || '')}" /></label>
    <div class="score-row">
      <label class="field"><span>${t('profile_height')} (cm)</span><input id="ep-height" type="number" value="${pub.height || ''}" /></label>
      <label class="field"><span>${t('profile_vertical')} (cm)</span><input id="ep-vertical" type="number" value="${pub.vertical || ''}" /></label>
      <label class="field"><span>${t('profile_weight')} (kg)</span><input id="ep-weight" type="number" value="${pub.weight || ''}" /></label>
    </div>
    <button class="btn btn-primary" id="ep-submit">${t('common_save')}</button>
  `);
  modal.querySelector('#ep-submit').addEventListener('click', async () => {
    const uid = auth.currentUser.uid;
    const patch = {
      username: modal.querySelector('#ep-username').value.trim() || pub.username,
      playstyle: modal.querySelector('#ep-playstyle').value.trim(),
      height: Number(modal.querySelector('#ep-height').value) || null,
      vertical: Number(modal.querySelector('#ep-vertical').value) || null,
      weight: Number(modal.querySelector('#ep-weight').value) || null,
    };
    try {
      await updateDoc(doc(db, 'publicProfiles', uid), patch);
      await updateDoc(doc(db, 'users', uid), patch);
      setState({ profile: { ...getState().profile, ...patch } });
      modal.close();
      renderOwnProfile();
    } catch (err) {
      toast(err.message, true);
    }
  });
}

function openRateModal(ratedUid, username) {
  const modal = openModal(`
    <h2>${t('profile_rate_player')}</h2>
    <p>${escapeHtml(username)}</p>
    <label class="field"><span>${t('profile_offense')}: <span id="off-val">5</span>/10</span>
      <input id="rate-offense" type="range" min="0" max="10" value="5" /></label>
    <label class="field"><span>${t('profile_defense')}: <span id="def-val">5</span>/10</span>
      <input id="rate-defense" type="range" min="0" max="10" value="5" /></label>
    <button class="btn btn-primary" id="rate-submit">${t('common_confirm')}</button>
  `);
  const offInput = modal.querySelector('#rate-offense');
  const defInput = modal.querySelector('#rate-defense');
  offInput.addEventListener('input', () => modal.querySelector('#off-val').textContent = offInput.value);
  defInput.addEventListener('input', () => modal.querySelector('#def-val').textContent = defInput.value);
  modal.querySelector('#rate-submit').addEventListener('click', async () => {
    try {
      await addDoc(collection(db, 'ratings'), {
        raterId: auth.currentUser.uid, ratedId: ratedUid,
        offense: Number(offInput.value), defense: Number(defInput.value),
        createdAt: serverTimestamp(),
      });
      modal.close();
      toast(t('common_confirm'));
    } catch (err) {
      toast(err.message, true);
    }
  });
}
