// Shot rating: 35-99 scale driven by shooting percentage.
// rating = 35 + percentage * 64, then pulled toward the 35 floor until the
// player has taken roughly 20 attempts, so a hot 3-for-4 doesn't read as elite.
const FLOOR = 35;
const SPAN = 64;
const CONFIDENCE_ATTEMPTS = 20;

export const SPOT_KEYS = [
  'cornerThree', 'wingThree', 'topKey',
  'deepLeft', 'deepTop', 'deepRight',
  'midElbow', 'midBaseline', 'freeThrow',
  'paint',
];

const THREE_PT_SPOTS = ['cornerThree', 'wingThree', 'topKey', 'deepLeft', 'deepTop', 'deepRight'];
const MID_RANGE_SPOTS = ['midElbow', 'midBaseline', 'freeThrow'];

function emptyTotals() {
  return { makes: 0, attempts: 0 };
}

export function sumSpots(sessions, keys) {
  const totals = emptyTotals();
  for (const session of sessions) {
    for (const key of keys) {
      const spot = session.spots?.[key];
      if (!spot) continue;
      totals.makes += spot.makes || 0;
      totals.attempts += spot.attempts || 0;
    }
  }
  return totals;
}

export function rateFromTotals({ makes, attempts }) {
  if (attempts === 0) return FLOOR;
  const pct = makes / attempts;
  const raw = FLOOR + pct * SPAN;
  const confidence = Math.min(attempts / CONFIDENCE_ATTEMPTS, 1);
  const rating = FLOOR + (raw - FLOOR) * confidence;
  return Math.round(Math.max(FLOOR, Math.min(FLOOR + SPAN, rating)));
}

// Recalculates overall / 3PT / mid-range ratings from every session a
// player has ever logged. Call this after a session is saved or deleted.
export function computeShotRatings(sessions) {
  const all = sumSpots(sessions, SPOT_KEYS);
  const three = sumSpots(sessions, THREE_PT_SPOTS);
  const mid = sumSpots(sessions, MID_RANGE_SPOTS);
  return {
    overall: rateFromTotals(all),
    threePt: rateFromTotals(three),
    midRange: rateFromTotals(mid),
    totalAttempts: all.attempts,
  };
}

export function sessionTotalAttempts(session) {
  return SPOT_KEYS.reduce((sum, key) => sum + (session.spots?.[key]?.attempts || 0), 0);
}
