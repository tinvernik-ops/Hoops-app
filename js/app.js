import { db, auth } from './firebase-config.js';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { watchAuth, renderAuthScreen, completeEmailLinkSignInIfPresent } from './auth.js';
import { t, setLang } from './i18n.js';
import { registerRoute, startRouter, navigate } from './router.js';
import { getState, setState } from './state.js';
import { toast, openModal, escapeHtml } from './utils.js';

import { renderCourtScreen } from './court.js';
import { renderLeaguesList, renderLeagueDetail } from './leagues.js';
import { renderChatList, renderDmThread } from './chat.js';
import { renderOwnProfile, renderPlayerProfile } from './profile.js';
import { renderDrillsScreen } from './drills.js';
import { renderSettingsScreen } from './settings.js';

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
}

registerRoute('court', renderCourtScreen);
registerRoute('leagues', renderLeaguesList);
registerRoute('league', renderLeagueDetail);
registerRoute('chat', renderChatList);
registerRoute('dm', renderDmThread);
registerRoute('profile', renderOwnProfile);
registerRoute('player', renderPlayerProfile);
registerRoute('drills', renderDrillsScreen);
registerRoute('settings', renderSettingsScreen);

document.querySelectorAll('.tab').forEach((tabEl) => {
  tabEl.addEventListener('click', () => navigate(tabEl.dataset.route));
});

async function boot() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch((err) => console.warn('sw register failed', err));
  }
  await completeEmailLinkSignInIfPresent().catch((err) => console.warn('email link sign-in', err));

  watchAuth(
    async (user) => {
      const profileSnap = await getDoc(doc(db, 'users', user.uid));
      const profile = profileSnap.data();
      setState({ user, profile });
      setLang(profile?.language || 'en');
      applyTheme(profile?.theme || 'dark');
      document.getElementById('auth-screen').hidden = true;
      document.getElementById('app-shell').hidden = false;
      startRouter();
      watchIncomingInvites();
    },
    () => {
      document.getElementById('app-shell').hidden = true;
      const authScreen = document.getElementById('auth-screen');
      authScreen.hidden = false;
      renderAuthScreen(authScreen);
    }
  );

  setupInstallPrompt();
}

let deferredInstallPrompt = null;
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const banner = document.getElementById('install-banner');
    if (banner) banner.hidden = false;
  });
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    document.getElementById('install-banner').hidden = true;
  });
  document.getElementById('install-dismiss')?.addEventListener('click', () => {
    document.getElementById('install-banner').hidden = true;
  });
}

// Lightweight polling for pending court invites / game verifications so the
// bell badge stays current without a Cloud Function fan-out.
let invitesTimer = null;
function watchIncomingInvites() {
  clearInterval(invitesTimer);
  const check = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const snap = await getDocs(query(collection(db, 'courtInvites'), where('toUid', '==', uid), where('status', '==', 'pending')));
    const dot = document.getElementById('notif-dot');
    if (dot) dot.hidden = snap.empty;
  };
  check();
  invitesTimer = setInterval(check, 30000);
}

export async function openNotificationsPanel() {
  const uid = auth.currentUser.uid;
  const snap = await getDocs(query(collection(db, 'courtInvites'), where('toUid', '==', uid), where('status', '==', 'pending')));
  const rows = await Promise.all(snap.docs.map(async (d) => {
    const invite = d.data();
    const fromSnap = await getDoc(doc(db, 'publicProfiles', invite.fromUid));
    return { id: d.id, invite, from: fromSnap.data() };
  }));
  const modal = openModal(`
    <h2>🔔</h2>
    <div class="stack">
      ${rows.length ? rows.map((r) => `
        <div class="card player-row">
          <div class="player-row-main"><strong>${escapeHtml(r.from?.username || 'Hooper')}</strong>
            <span class="muted">${t('notif_hoop_sesh')}</span></div>
          <button class="btn btn-small btn-primary" data-accept="${r.id}">${t('verify_approve')}</button>
        </div>`).join('') : `<div class="empty-state">${t('common_none')}</div>`}
    </div>
  `);
  modal.querySelectorAll('[data-accept]').forEach((b) => b.addEventListener('click', async () => {
    await updateDoc(doc(db, 'courtInvites', b.dataset.accept), { status: 'accepted' });
    toast(t('verify_approve'));
    modal.close();
    navigate('court');
  }));
}

boot();
