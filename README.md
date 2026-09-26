# Hoops

Pickup basketball, organised — courts, leagues, chat, profiles, and shooting
drills. Plain HTML/CSS/JS (no build step, no framework) with Firebase
(Auth + Firestore) for the backend. Runs entirely on Firebase's free Spark
plan — no billing account needed.

**Scope note:** this build intentionally leaves out camera-based shot-form /
pose analysis, per your instruction to drop that feature. It also leaves out
chat photo attachments — Cloud Storage now requires Firebase's paid Blaze
plan (since Feb 2026), so DMs and league chat are text-only to keep the
whole app on the free tier. Everything else from the doc is here: Court,
Leagues (create/join, leaderboard, teams, game logging + peer verification,
league chat), Chat (DMs + league chat), Profile (stats, peer ratings,
badges, shot rating, shot chart), Shooting Drills (spot-by-spot logging, no
camera), Settings (language, theme, search radius, court-alert threshold,
push notifications), 6-language i18n, and PWA install-to-home-screen. The
in-app MCP server mentioned in the original doc isn't included — that's a
server-side integration and out of scope for a static site; it would live
in a separate backend project that talks to the same Firestore data.

## 1. Create the Firebase project

1. [Firebase console](https://console.firebase.google.com) → **Add project**.
2. **Build → Authentication → Sign-in method** → enable **Email/Password**,
   **Email link (passwordless sign-in)**, and **Google**.
3. **Build → Firestore Database** → create a database (start in production
   mode — the rules file below locks it down properly).
4. **Project settings → General → Your apps → Web app (</>)** → register an
   app, copy the config object.
5. Paste that config into `js/firebase-config.js` (replace the
   `YOUR_...` placeholders).
6. (Optional, for push notifications) **Project settings → Cloud Messaging →
   Web configuration → Generate key pair**, paste it into `VAPID_KEY` in the
   same file. Push still works on the free plan.


## 2. Deploy Firestore rules & indexes

With the [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # point it at this repo, keep the existing rules/indexes files
firebase deploy --only firestore:rules,firestore:indexes
```

`firestore.rules` and `firestore.indexes.json` are already written for you —
don't let `firebase init` overwrite them.

## 3. Seed a few courts (optional)

The Court screen reads from a `courts` collection. Add a few documents by
hand in the Firestore console to get started:

```
courts/{autoId}: { name: "Downtown Courts", lat: 45.8131, lng: 15.9773, address: "..." }
```

Players can't currently add courts from the UI — that's a natural next
feature to add (a "+ add this court" button on the map using the device's
current position).

## 4. Run it locally

No build step — any static file server works:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Open it over `http://localhost`, not `file://` — Firebase Auth and
geolocation both require a proper origin.

## 5. Deploy

Firebase Hosting is the easiest match for the rest of the stack:

```bash
firebase init hosting     # public directory: "." , single-page app: No
firebase deploy --only hosting
```

Any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages) works too —
just make sure `index.html`, `manifest.json`, and `sw.js` are all served
from the same origin.

## Corrections applied from the original doc

- **Languages:** 6, not 8 — English, Croatian, Spanish, German, French,
  Italian (`js/i18n.js`).
- **Shot rating formula:** `rating = 35 + percentage × 64`, on a 35–99
  scale, weighted toward the 35 floor until a player has ~20 logged
  attempts so small samples don't spike the number (`js/shot-rating.js`).

## Data model

| Collection | Notes |
|---|---|
| `users/{uid}` | Private profile: email, settings, etc. Owner-only read. |
| `publicProfiles/{uid}` | What other players can see: username, stats, aggregated rating, shot rating, badge tier. |
| `courts/{id}` | Static court locations. |
| `courtCheckins/{id}` | "Hooping now" — a check-in counts as active for 3h. |
| `courtPresence/{uid}` | Live-ish location for "players near you"; treated as stale after 20 min client-side. |
| `courtInvites/{id}` | "Call for a hoop sesh" invites. |
| `leagues/{id}` (+ `members`, `messages`, `games` subcollections) | Leagues, rosters, league chat, logged games with per-player peer verification. |
| `ratings/{id}` | Private 1:1 offense/defense ratings; only rater + rated can read one. Aggregates get recomputed onto `publicProfiles` when the rated player opens their own profile. |
| `directMessages/{id}` (+ `messages`) | 1:1 chat threads, id = sorted uid pair. |
| `shootingSessions/{id}` | Per-spot makes/attempts logs, owner-only. |
| `pushSubscriptions/{uid}` | FCM tokens for web push. |

## Security notes / deliberate tradeoffs

- **League join codes are readable by any signed-in user** so that "join
  with a code" works without a server function. If you need the code to be
  properly private, add a Cloud Function that verifies the code
  server-side and adds the member, and lock the `leagues` read rule down to
  members only.
- **Ratings are never bulk-readable.** Only the rater and the ratee can read
  a given rating document; everyone else only ever sees the aggregated
  `ratingsAgg` / `badgeTier` fields on `publicProfiles`. Recomputation
  happens client-side, triggered when the rated player opens their own
  profile — move this into a Cloud Function trigger on `ratings` create if
  you want it to update instantly for everyone instead.
- **Push notifications** are wired up (service worker, FCM token
  collection) but actually *sending* a push still needs a small server or
  Cloud Function that calls the FCM API when something happens (a court
  surging, a game to verify, etc.) — this repo stores the tokens and shows
  local/foreground notifications, but doesn't include that sender.
- Phone numbers/emails live only in the private `users` doc, never in
  `publicProfiles`.

## Suggested next steps

- Add a Cloud Function to send real push notifications from server events.
- Let players add new courts from the map.
- Add box-score entry (pts/reb/ast/stl/blk per player) to game logging —
  the data model already supports it (`playerStats`), the log-game modal
  just doesn't collect it yet to keep the first pass simple.
- Bring back chat photo attachments if you're OK linking a card: enable the
  Blaze plan, add Cloud Storage back to `js/firebase-config.js`, and wire an
  upload button into `js/chat.js` (this is exactly what was removed to stay
  on the free plan — happy to add it back if you ever want it).
- Lock down league join codes with a Cloud Function, as noted above.
