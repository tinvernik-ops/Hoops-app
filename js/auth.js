import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  GoogleAuthProvider, signInWithPopup,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { t, LANGUAGES, setLang } from './i18n.js';
import { toast, badgeTier } from './utils.js';

const EMAIL_LINK_STORAGE_KEY = 'hoops-email-for-link';

export function watchAuth(onSignedIn, onSignedOut) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await ensureUserDocs(user);
      onSignedIn(user);
    } else {
      onSignedOut();
    }
  });
}

async function ensureUserDocs(user) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return;

  const displayName = user.displayName || user.email?.split('@')[0] || 'Hooper';
  const base = {
    uid: user.uid,
    email: user.email || null,
    username: displayName,
    photoURL: user.photoURL || null,
    playstyle: '',
    height: null, vertical: null, weight: null,
    language: navigator.language?.slice(0, 2) || 'en',
    theme: 'dark',
    radiusKm: 15,
    alertThreshold: 4,
    location: null,
    createdAt: serverTimestamp(),
  };
  const pub = {
    uid: user.uid,
    username: displayName,
    photoURL: user.photoURL || null,
    playstyle: '',
    height: null, vertical: null, weight: null,
    ratingsAgg: { offenseAvg: 0, defenseAvg: 0, count: 0 },
    shotRating: { overall: 35, threePt: 35, midRange: 35 },
    badgeTier: badgeTier(0, 0),
    createdAt: serverTimestamp(),
  };
  await Promise.all([
    setDoc(userRef, base),
    setDoc(doc(db, 'publicProfiles', user.uid), pub),
  ]);
}

export function renderAuthScreen(container) {
  const langOptions = LANGUAGES.map((l) => `<option value="${l.code}">${l.label}</option>`).join('');
  container.innerHTML = `
    <div class="auth-screen">
      <div class="auth-hero">
        <div class="auth-ball" aria-hidden="true"></div>
        <h1>${t('auth_welcome_title')}</h1>
        <p>${t('auth_welcome_sub')}</p>
      </div>

      <label class="field">
        <span>${t('auth_choose_language')}</span>
        <select id="auth-lang">${langOptions}</select>
      </label>

      <form id="auth-form" class="auth-form">
        <label class="field">
          <span>${t('auth_email')}</span>
          <input id="auth-email" type="email" required autocomplete="email" />
        </label>
        <label class="field">
          <span>${t('auth_password')}</span>
          <input id="auth-password" type="password" required autocomplete="current-password" minlength="6" />
        </label>
        <button type="submit" class="btn btn-primary" id="auth-submit">${t('auth_sign_in')}</button>
        <button type="button" class="btn btn-ghost" id="auth-toggle">${t('auth_sign_up')}</button>
      </form>

      <div class="auth-divider"><span>${t('auth_or')}</span></div>

      <button class="btn btn-outline" id="auth-google">${t('auth_continue_google')}</button>
      <button class="btn btn-outline" id="auth-email-link">${t('auth_email_link')}</button>
      <p id="auth-status" class="auth-status"></p>
    </div>
  `;

  const langSelect = container.querySelector('#auth-lang');
  langSelect.value = navigator.language?.slice(0, 2) in { en: 1, hr: 1, es: 1, de: 1, fr: 1, it: 1 }
    ? navigator.language.slice(0, 2) : 'en';
  langSelect.addEventListener('change', () => {
    setLang(langSelect.value);
    renderAuthScreen(container);
  });

  let mode = 'signin';
  const submitBtn = container.querySelector('#auth-submit');
  const toggleBtn = container.querySelector('#auth-toggle');
  toggleBtn.addEventListener('click', () => {
    mode = mode === 'signin' ? 'signup' : 'signin';
    submitBtn.textContent = mode === 'signin' ? t('auth_sign_in') : t('auth_sign_up');
    toggleBtn.textContent = mode === 'signin' ? t('auth_sign_up') : t('auth_sign_in');
  });

  container.querySelector('#auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#auth-email').value.trim();
    const password = container.querySelector('#auth-password').value;
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      toast(err.message.replace('Firebase: ', ''), true);
    }
  });

  container.querySelector('#auth-google').addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      toast(err.message.replace('Firebase: ', ''), true);
    }
  });

  container.querySelector('#auth-email-link').addEventListener('click', async () => {
    const email = container.querySelector('#auth-email').value.trim();
    if (!email) { toast(t('auth_email'), true); return; }
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: location.href,
        handleCodeInApp: true,
      });
      window.localStorage.setItem(EMAIL_LINK_STORAGE_KEY, email);
      container.querySelector('#auth-status').textContent = t('auth_email_link_sent');
    } catch (err) {
      toast(err.message.replace('Firebase: ', ''), true);
    }
  });
}

// Call once on boot: completes sign-in if the user arrived via an email link.
export async function completeEmailLinkSignInIfPresent() {
  if (!isSignInWithEmailLink(auth, location.href)) return false;
  let email = window.localStorage.getItem(EMAIL_LINK_STORAGE_KEY);
  if (!email) {
    email = window.prompt('Confirm your email to finish signing in');
  }
  if (!email) return false;
  await signInWithEmailLink(auth, email, location.href);
  window.localStorage.removeItem(EMAIL_LINK_STORAGE_KEY);
  history.replaceState(null, '', location.pathname);
  return true;
}

export async function signOutUser() {
  await signOut(auth);
}
