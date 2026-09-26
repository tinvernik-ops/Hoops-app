// Small observable store -- no framework, just enough to let screens react
// to auth/profile changes without wiring props through everything.
const state = {
  user: null,        // firebase auth user
  profile: null,      // users/{uid} doc (private)
  publicProfile: null, // publicProfiles/{uid} doc
  activeLeagueId: null,
  activeConvo: null,   // { type: 'dm'|'league', id }
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  Object.assign(state, patch);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Live Firestore listeners get tracked here so screens can tear them down
// cleanly when the router navigates away.
let activeUnsubs = [];
export function trackUnsub(fn) {
  activeUnsubs.push(fn);
}
export function clearUnsubs() {
  activeUnsubs.forEach((fn) => { try { fn(); } catch { /* noop */ } });
  activeUnsubs = [];
}
