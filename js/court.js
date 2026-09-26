import { db, auth } from './firebase-config.js';
import {
  collection, doc, addDoc, deleteDoc, getDoc, getDocs, query, where, onSnapshot,
  serverTimestamp, setDoc, Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { t } from './i18n.js';
import { distanceKm, timeAgo, toast, initials, escapeHtml } from './utils.js';
import { getState, trackUnsub } from './state.js';

const ACTIVE_WINDOW_MS = 3 * 60 * 60 * 1000; // a check-in counts as "hooping now" for 3h
const PRESENCE_STALE_MS = 20 * 60 * 1000;    // a player counts as "nearby" for 20 min
let map, markersLayer, watchId;
let myCheckinDocId = null;
let notifiedSurge = new Set();

async function loadLeaflet() {
  if (window.L) return window.L;
  await new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return window.L;
}

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('no geolocation')); return; }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000 });
  });
}

export async function renderCourtScreen() {
  const view = document.getElementById('view');
  const { profile } = getState();
  const radiusKm = profile?.radiusKm ?? 15;
  const alertThreshold = profile?.alertThreshold ?? 4;

  view.innerHTML = `
    <header class="screen-header">
      <h1>${t('court_title')}</h1>
      <button class="icon-btn" id="notif-bell" aria-label="Notifications">🔔<span id="notif-dot" class="dot" hidden></span></button>
    </header>
    <div id="court-map" class="court-map"></div>
    <section class="section">
      <h2>${t('court_courts_near')}</h2>
      <div id="courts-list" class="stack">${t('common_loading')}</div>
    </section>
    <section class="section">
      <h2>${t('court_players_near')}</h2>
      <div id="players-list" class="stack">${t('common_loading')}</div>
    </section>
  `;

  document.getElementById('notif-bell').addEventListener('click', () => {
    import('./app.js').then((m) => m.openNotificationsPanel());
  });

  let center = { lat: 45.815, lng: 15.9819 }; // Zagreb fallback so the map isn't empty offline/denied
  try {
    const pos = await getPosition();
    center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    await setDoc(doc(db, 'courtPresence', auth.currentUser.uid), {
      uid: auth.currentUser.uid, lat: center.lat, lng: center.lng, updatedAt: serverTimestamp(),
    });
    watchId = navigator.geolocation.watchPosition((p) => {
      setDoc(doc(db, 'courtPresence', auth.currentUser.uid), {
        uid: auth.currentUser.uid, lat: p.coords.latitude, lng: p.coords.longitude, updatedAt: serverTimestamp(),
      }).catch(() => {});
    }, () => {}, { enableHighAccuracy: false, maximumAge: 60000 });
    trackUnsub(() => watchId && navigator.geolocation.clearWatch(watchId));
  } catch {
    toast('Location unavailable - showing a default area.', true);
  }

  const L = await loadLeaflet();
  map = L.map('court-map', { zoomControl: true }).setView([center.lat, center.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  L.circleMarker([center.lat, center.lng], { radius: 7, color: '#3E7CFF', fillColor: '#3E7CFF', fillOpacity: 1 })
    .addTo(map).bindPopup('You');

  const courtsSnap = await getDocs(collection(db, 'courts'));
  const allCourts = courtsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const nearbyCourts = allCourts
    .map((c) => ({ ...c, distance: distanceKm(center.lat, center.lng, c.lat, c.lng) }))
    .filter((c) => c.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);

  const checkinsCol = collection(db, 'courtCheckins');
  const cutoff = Timestamp.fromMillis(Date.now() - ACTIVE_WINDOW_MS);
  const unsubCheckins = onSnapshot(query(checkinsCol, where('checkinAt', '>', cutoff)), (snap) => {
    const byCourtCount = new Map();
    const mine = new Map();
    snap.forEach((d) => {
      const data = d.data();
      byCourtCount.set(data.courtId, (byCourtCount.get(data.courtId) || 0) + 1);
      if (data.uid === auth.currentUser.uid) mine.set(data.courtId, d.id);
    });
    renderCourts(nearbyCourts, byCourtCount, mine, alertThreshold);
    renderMapMarkers(nearbyCourts, byCourtCount);
  }, (err) => console.warn('checkins listener', err));
  trackUnsub(unsubCheckins);

  const presenceCutoff = Timestamp.fromMillis(Date.now() - PRESENCE_STALE_MS);
  const unsubPresence = onSnapshot(
    query(collection(db, 'courtPresence'), where('updatedAt', '>', presenceCutoff)),
    async (snap) => {
      const rows = snap.docs
        .map((d) => d.data())
        .filter((p) => p.uid !== auth.currentUser?.uid)
        .map((p) => ({ ...p, distance: distanceKm(center.lat, center.lng, p.lat, p.lng) }))
        .filter((p) => p.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20);
      await renderPlayers(rows);
    },
    (err) => console.warn('presence listener', err)
  );
  trackUnsub(unsubPresence);
}

function renderMapMarkers(courts, counts) {
  if (!markersLayer) return;
  markersLayer.clearLayers();
  const L = window.L;
  courts.forEach((c) => {
    const count = counts.get(c.id) || 0;
    const color = count >= 6 ? '#FF5D6C' : count >= 1 ? '#FF6A1A' : '#5B6472';
    L.circleMarker([c.lat, c.lng], { radius: 8 + Math.min(count, 10), color, fillColor: color, fillOpacity: 0.55 })
      .bindPopup(`<strong>${escapeHtml(c.name)}</strong><br/>${count} ${t('court_hoopers_now')}`)
      .addTo(markersLayer);
  });
}

function renderCourts(courts, counts, mine, alertThreshold) {
  const listEl = document.getElementById('courts-list');
  if (!listEl) return;
  if (!courts.length) {
    listEl.innerHTML = `<div class="empty-state">${t('court_no_courts')}</div>`;
    return;
  }
  listEl.innerHTML = courts.map((c) => {
    const count = counts.get(c.id) || 0;
    const checkedIn = mine.has(c.id);
    const surging = count >= alertThreshold;
    if (surging && !notifiedSurge.has(c.id)) {
      notifiedSurge.add(c.id);
      maybeNativeNotify(`${c.name} ${t('notif_court_surge')}`, `${count} ${t('court_hoopers_now')}`);
    }
    if (count < alertThreshold) notifiedSurge.delete(c.id);
    return `
      <div class="card court-row">
        <div class="court-row-main">
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted">${c.distance.toFixed(1)} ${t('court_away_km')}</span>
        </div>
        <div class="court-row-meta">
          <span class="badge ${surging ? 'badge-hot' : ''}">${count} ${t('court_hoopers_now')}</span>
          <button class="btn btn-small ${checkedIn ? 'btn-outline' : 'btn-primary'}" data-court="${c.id}" data-checkedin="${checkedIn}">
            ${checkedIn ? t('court_checkout') : t('court_checkin')}
          </button>
        </div>
      </div>`;
  }).join('');

  listEl.querySelectorAll('button[data-court]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const courtId = btn.dataset.court;
      const checkedIn = btn.dataset.checkedin === 'true';
      btn.disabled = true;
      try {
        if (checkedIn) {
          const docId = mine.get(courtId);
          if (docId) await deleteDoc(doc(db, 'courtCheckins', docId));
        } else {
          await addDoc(collection(db, 'courtCheckins'), {
            courtId, uid: auth.currentUser.uid, checkinAt: serverTimestamp(),
          });
        }
      } catch (err) {
        toast(err.message, true);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

async function renderPlayers(rows) {
  const listEl = document.getElementById('players-list');
  if (!listEl) return;
  if (!rows.length) {
    listEl.innerHTML = `<div class="empty-state">${t('common_none')}</div>`;
    return;
  }
  const profiles = await Promise.all(rows.map((p) => getDoc(doc(db, 'publicProfiles', p.uid))));
  listEl.innerHTML = rows.map((p, i) => {
    const prof = profiles[i]?.data();
    if (!prof) return '';
    return `
      <div class="card player-row">
        <div class="avatar">${prof.photoURL ? `<img src="${prof.photoURL}" alt="" />` : initials(prof.username)}</div>
        <div class="player-row-main">
          <strong>${escapeHtml(prof.username)}</strong>
          <span class="muted">${p.distance.toFixed(1)} ${t('court_away_km')}</span>
        </div>
        <button class="btn btn-small btn-outline" data-invite="${p.uid}">${t('court_call_sesh')}</button>
      </div>`;
  }).join('');

  listEl.querySelectorAll('button[data-invite]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try {
        await addDoc(collection(db, 'courtInvites'), {
          fromUid: auth.currentUser.uid, toUid: btn.dataset.invite,
          status: 'pending', createdAt: serverTimestamp(),
        });
        toast(t('court_invite_sent'));
      } catch (err) {
        toast(err.message, true);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function maybeNativeNotify(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try { new Notification(title, { body, icon: 'icons/icon-192.png' }); } catch { /* noop */ }
}
