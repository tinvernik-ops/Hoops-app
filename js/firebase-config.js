// Firebase v10 modular SDK, loaded straight from the CDN so this project
// needs no build step. Fill in your own project's config below --
// Firebase console -> Project settings -> General -> Your apps -> Web app.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

export const firebaseConfig = {
  apiKey: "AIzaSyDZLL2jmnaNo19zjARxNJf8jSbzu4xtJn8",
  authDomain: "hoops-d1cd2.firebaseapp.com",
  projectId: "hoops-d1cd2",
  storageBucket: "hoops-d1cd2.firebasestorage.app",
  messagingSenderId: "735740495032",
  appId: "1:735740495032:web:d3def81a01e2de0d36e04d",
  measurementId: "G-DYK08RGY7H"
};


// Web Push (Settings > enable notifications) needs a VAPID key from
// Firebase console -> Project settings -> Cloud Messaging -> Web configuration.
export const VAPID_KEY = 'BPncbP8vwlBBocOaZVdEH-ea0UWIallwRS0Uwz0ea4DLJZJtgXHZWzklMxldn-AjLyfaW-9RyqS4BkDkC4hJejo';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
