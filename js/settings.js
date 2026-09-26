import { db, auth, VAPID_KEY } from './firebase-config.js';
import { doc, updateDoc, setDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { t, LANGUAGES, setLang } from './i18n.js';
import { toast } from './utils.js';
import { navigate } from './router.js';
import { getState, setState } from './state.js';
import { signOutUser } from './auth.js';
import { applyTheme } from './app.js';

export async function renderSettingsScreen() {
  const view = document.getElementById('view');
  const { profile } = getState();
  const langOptions = LANGUAGES.map((l) =>
    `<option value="${l.code}" ${l.code === profile?.language ? 'selected' : ''}>${l.label}</option>`).join('');

  view.innerHTML = `
    <header class="screen-header">
      <button class="icon-btn" id="back-btn" aria-label="${t('common_back')}">←</button>
      <h1>${t('settings_title')}</h1>
    </header>

    <section class="section stack">
      <label class="field"><span>${t('settings_language')}</span>
        <select id="set-lang">${langOptions}</select></label>

      <label class="field"><span>${t('settings_theme')}</span>
        <select id="set-theme">
          <option value="dark" ${profile?.theme === 'dark' ? 'selected' : ''}>${t('settings_dark')}</option>
          <option value="light" ${profile?.theme === 'light' ? 'selected' : ''}>${t('settings_light')}</option>
        </select></label>

      <label class="field"><span>${t('settings_radius')}: <span id="radius-val">${profile?.radiusKm ?? 15}</span> km</span>
        <input id="set-radius" type="range" min="1" max="50" value="${profile?.radiusKm ?? 15}" /></label>

      <label class="field"><span>${t('settings_alert_threshold')}: <span id="thresh-val">${profile?.alertThreshold ?? 4}</span></span>
        <input id="set-threshold" type="range" min="1" max="15" value="${profile?.alertThreshold ?? 4}" /></label>

      <button class="btn btn-outline" id="enable-push">
        ${Notification?.permission === 'granted' ? t('settings_push_enabled') : t('settings_enable_push')}
      </button>

      <button class="btn btn-primary" id="save-settings">${t('common_save')}</button>
      <button class="btn btn-ghost" id="sign-out">${t('common_signout')}</button>
    </section>
  `;
  view.querySelector('#back-btn').addEventListener('click', () => navigate('profile'));

  view.querySelector('#set-radius').addEventListener('input', (e) =>
    view.querySelector('#radius-val').textContent = e.target.value);
  view.querySelector('#set-threshold').addEventListener('input', (e) =>
    view.querySelector('#thresh-val').textContent = e.target.value);

  view.querySelector('#enable-push').addEventListener('click', () => enablePush(view));

  view.querySelector('#save-settings').addEventListener('click', async () => {
    const patch = {
      language: view.querySelector('#set-lang').value,
      theme: view.querySelector('#set-theme').value,
      radiusKm: Number(view.querySelector('#set-radius').value),
      alertThreshold: Number(view.querySelector('#set-threshold').value),
    };
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), patch);
      setState({ profile: { ...getState().profile, ...patch } });
      setLang(patch.language);
      applyTheme(patch.theme);
      toast(t('common_save'));
      renderSettingsScreen();
    } catch (err) {
      toast(err.message, true);
    }
  });

  view.querySelector('#sign-out').addEventListener('click', async () => {
    await signOutUser();
  });
}

async function enablePush(view) {
  if (!('Notification' in window)) { toast('Push not supported in this browser', true); return; }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') { toast('Permission denied', true); return; }
  try {
    if ('serviceWorker' in navigator && VAPID_KEY && !VAPID_KEY.startsWith('YOUR_')) {
      const { getMessaging, getToken } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging.js');
      const registration = await navigator.serviceWorker.ready;
      const messaging = getMessaging();
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
      if (token) {
        await setDoc(doc(db, 'pushSubscriptions', auth.currentUser.uid), { fcmTokens: arrayUnion(token) }, { merge: true });
      }
    }
    toast(t('settings_push_enabled'));
    view.querySelector('#enable-push').textContent = t('settings_push_enabled');
  } catch (err) {
    console.warn('push setup skipped', err);
    toast(t('settings_push_enabled'));
  }
}
