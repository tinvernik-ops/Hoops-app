// Firebase v10 modular SDK, loaded straight from the CDN so this project
// needs no build step. Fill in your own project's config below --
// Firebase console -> Project settings -> General -> Your apps -> Web app.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Web Push (Settings > enable notifications) needs a VAPID key from
// Firebase console -> Project settings -> Cloud Messaging -> Web configuration.
export const VAPID_KEY = 'YOUR_VAPID_KEY';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
