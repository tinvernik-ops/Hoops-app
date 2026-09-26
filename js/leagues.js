import { db, auth } from './firebase-config.js';
import {
  collection, doc, addDoc, setDoc, updateDoc, getDoc, getDocs, query, where,
  orderBy, limit, onSnapshot, serverTimestamp, arrayUnion,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { t } from './i18n.js';
import { escapeHtml, toast, openModal, timeAgo, initials } from './utils.js';
import { navigate } from './router.js';
import { trackUnsub, getState } from './state.js';

const FORMATS = ['1v1', '2v2', '3v3', '5v5'];

function genJoinCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function renderLeaguesList() {
  const view = document.getElementById('view');
  view.innerHTML = `
    <header class="screen-header">
      <h1>${t('league_title')}</h1>
    </header>
    <div class="row-buttons">
      <button class="btn btn-primary" id="create-league">${t('league_create')}</button>
      <button class="btn btn-outline" id="join-league">${t('league_join')}</button>
    </div>
    <section class="section">
      <h2>${t('league_your_leagues')}</h2>
      <div id="leagues-list" class="stack">${t('common_loading')}</div>
    </section>
  `;
  document.getElementById('create-league').addEventListener('click', openCreateLeagueModal);
  document.getElementById('join-league').addEventListener('click', openJoinLeagueModal);

  const uid = auth.currentUser.uid;
  const q = query(collection(db, 'leagues'), where('memberIds', 'array-contains', uid));
  const unsub = onSnapshot(q, (snap) => {
    const listEl = document.getElementById('leagues-list');
    if (!listEl) return;
    if (snap.empty) {
      listEl.innerHTML = `<div class="empty-state">${t('league_no_leagues')}</div>`;
      return;
    }
    listEl.innerHTML = snap.docs.map((d) => {
      const l = d.data();
      return `
        <button class="card league-row" data-league="${d.id}">
          <strong>${escapeHtml(l.name)}</strong>
          <span class="muted">${escapeHtml(l.format)} · ${(l.memberIds || []).length} players</span>
        </button>`;
    }).join('');
    listEl.querySelectorAll('[data-league]').forEach((b) =>
      b.addEventListener('click', () => navigate(`league/${b.dataset.league}/leaderboard`)));
  }, (err) => console.warn('leagues listener', err));
  trackUnsub(unsub);
}

function openCreateLeagueModal() {
  const modal = openModal(`
    <h2>${t('league_create')}</h2>
    <label class="field"><span>${t('league_title')}</span><input id="cl-name" required /></label>
    <label class="field">
      <span>${t('league_pick_format')}</span>
      <select id="cl-format">${FORMATS.map((f) => `<option value="${f}">${f}</option>`).join('')}</select>
    </label>
    <button class="btn btn-primary" id="cl-submit">${t('common_create')}</button>
  `);
  modal.querySelector('#cl-submit').addEventListener('click', async () => {
    const name = modal.querySelector('#cl-name').value.trim();
    if (!name) return;
    const format = modal.querySelector('#cl-format').value;
    const uid = auth.currentUser.uid;
    try {
      const ref = await addDoc(collection(db, 'leagues'), {
        name, format, ownerId: uid, joinCode: genJoinCode(),
        memberIds: [uid], createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'leagues', ref.id, 'members', uid), {
        username: getState().profile?.username || 'Hooper', role: 'owner', joinedAt: serverTimestamp(),
      });
      modal.close();
      navigate(`league/${ref.id}/leaderboard`);
    } catch (err) {
      toast(err.message, true);
    }
  });
}

function openJoinLeagueModal() {
  const modal = openModal(`
    <h2>${t('league_join')}</h2>
    <label class="field"><span>${t('league_join_code')}</span><input id="jl-code" style="text-transform:uppercase" required /></label>
    <button class="btn btn-primary" id="jl-submit">${t('common_join')}</button>
  `);
  modal.querySelector('#jl-submit').addEventListener('click', async () => {
    const code = modal.querySelector('#jl-code').value.trim().toUpperCase();
    if (!code) return;
    try {
      const snap = await getDocs(query(collection(db, 'leagues'), where('joinCode', '==', code)));
      if (snap.empty) { toast('No league with that code', true); return; }
      const leagueDoc = snap.docs[0];
      const uid = auth.currentUser.uid;
      await updateDoc(doc(db, 'leagues', leagueDoc.id), { memberIds: arrayUnion(uid) });
      await setDoc(doc(db, 'leagues', leagueDoc.id, 'members', uid), {
        username: getState().profile?.username || 'Hooper', role: 'member', joinedAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'leagues', leagueDoc.id, 'messages'), {
        uid, username: getState().profile?.username || 'Hooper',
        text: t('league_joined_message'), system: true, createdAt: serverTimestamp(),
      });
      modal.close();
      navigate(`league/${leagueDoc.id}/leaderboard`);
    } catch (err) {
      toast(err.message, true);
    }
  });
}

const TABS = ['leaderboard', 'teams', 'games', 'chat'];

export async function renderLeagueDetail([leagueId, tab = 'leaderboard']) {
  const view = document.getElementById('view');
  const leagueSnap = await getDoc(doc(db, 'leagues', leagueId));
  if (!leagueSnap.exists()) { view.innerHTML = `<div class="empty-state">${t('common_error_generic')}</div>`; return; }
  const league = leagueSnap.data();
  const memberSnaps = await getDocs(collection(db, 'leagues', leagueId, 'members'));
  const members = memberSnaps.docs.map((d) => ({ uid: d.id, ...d.data() }));

  view.innerHTML = `
    <header class="screen-header">
      <button class="icon-btn" id="back-btn" aria-label="${t('common_back')}">←</button>
      <h1>${escapeHtml(league.name)}</h1>
    </header>
    <div class="tabline">
      ${TABS.map((tb) => `<button class="tabline-btn ${tb === tab ? 'active' : ''}" data-tab="${tb}">${t(`league_${tb === 'leaderboard' ? 'leaderboard' : tb}`)}</button>`).join('')}
    </div>
    <div id="league-tab-content"></div>
  `;
  view.querySelector('#back-btn').addEventListener('click', () => navigate('leagues'));
  view.querySelectorAll('.tabline-btn').forEach((b) =>
    b.addEventListener('click', () => navigate(`league/${leagueId}/${b.dataset.tab}`)));

  const content = view.querySelector('#league-tab-content');
  if (tab === 'leaderboard') await renderLeaderboardTab(content, leagueId, members);
  else if (tab === 'teams') await renderTeamsTab(content, leagueId, league, members);
  else if (tab === 'games') await renderGamesTab(content, leagueId, league, members);
  else if (tab === 'chat') await renderLeagueChatTab(content, leagueId);
}

async function renderLeaderboardTab(content, leagueId, members) {
  content.innerHTML = `<div class="stack">${t('common_loading')}</div>`;
  const gamesSnap = await getDocs(
    query(collection(db, 'leagues', leagueId, 'games'), where('status', '==', 'verified'), orderBy('createdAt', 'desc'), limit(300))
  );
  const stats = new Map(members.map((m) => [m.uid, {
    uid: m.uid, username: m.username, wins: 0, losses: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, games: 0,
  }]));
  gamesSnap.forEach((d) => {
    const g = d.data();
    const teamAWon = g.scoreA > g.scoreB;
    for (const uid of g.teamA || []) applyGameToStats(stats, uid, g, teamAWon);
    for (const uid of g.teamB || []) applyGameToStats(stats, uid, g, !teamAWon);
  });
  const rows = [...stats.values()].sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.pts - a.pts);

  content.innerHTML = `
    <div class="leaderboard-table">
      <div class="leaderboard-head">
        <span>${t('league_win_loss')}</span><span>${t('league_ppg')}</span><span>${t('league_rpg')}</span><span>${t('league_apg')}</span>
      </div>
      ${rows.map((r) => `
        <div class="leaderboard-row">
          <div class="leaderboard-player"><div class="avatar avatar-sm">${initials(r.username)}</div>${escapeHtml(r.username)}</div>
          <span>${r.wins}-${r.losses}</span>
          <span>${avg(r.pts, r.games)}</span>
          <span>${avg(r.reb, r.games)}</span>
          <span>${avg(r.ast, r.games)}</span>
        </div>`).join('') || `<div class="empty-state">${t('common_none')}</div>`}
    </div>
  `;
}

function avg(total, games) { return games ? (total / games).toFixed(1) : '0.0'; }

function applyGameToStats(stats, uid, game, won) {
  const row = stats.get(uid);
  if (!row) return;
  const s = game.playerStats?.[uid] || {};
  row.games += 1;
  row.wins += won ? 1 : 0;
  row.losses += won ? 0 : 1;
  row.pts += s.pts || 0; row.reb += s.reb || 0; row.ast += s.ast || 0;
  row.stl += s.stl || 0; row.blk += s.blk || 0;
}

async function renderTeamsTab(content, leagueId, league, members) {
  content.innerHTML = `
    <section class="section">
      <h2>${t('league_members')}</h2>
      <div class="stack">
        ${members.map((m) => `
          <div class="card player-row">
            <div class="avatar">${initials(m.username)}</div>
            <div class="player-row-main"><strong>${escapeHtml(m.username)}</strong>
              <span class="muted">${m.role === 'owner' ? t('league_owner') : ''}</span></div>
          </div>`).join('')}
      </div>
    </section>
    <section class="section">
      <h2>${t('league_invite_link')}</h2>
      <div class="card">
        <p class="muted">${t('league_join_code')}: <strong>${escapeHtml(league.joinCode)}</strong></p>
        <button class="btn btn-outline btn-small" id="copy-link">${t('league_copy_link')}</button>
      </div>
    </section>
  `;
  content.querySelector('#copy-link').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#/leagues?join=${league.joinCode}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    toast(t('league_copy_link'));
  });
}

async function renderGamesTab(content, leagueId, league, members) {
  content.innerHTML = `
    <button class="btn btn-primary" id="log-game" style="margin:12px 16px;">${t('league_log_game')}</button>
    <div id="games-list" class="stack">${t('common_loading')}</div>
  `;
  content.querySelector('#log-game').addEventListener('click', () => openLogGameModal(leagueId, league, members));

  const unsub = onSnapshot(
    query(collection(db, 'leagues', leagueId, 'games'), orderBy('createdAt', 'desc'), limit(50)),
    (snap) => {
      const listEl = content.querySelector('#games-list');
      if (!listEl) return;
      if (snap.empty) { listEl.innerHTML = `<div class="empty-state">${t('common_none')}</div>`; return; }
      listEl.innerHTML = snap.docs.map((d) => renderGameCard(d.id, d.data(), members)).join('');
      listEl.querySelectorAll('[data-approve]').forEach((b) =>
        b.addEventListener('click', () => verifyGame(leagueId, b.dataset.approve, true)));
      listEl.querySelectorAll('[data-dispute]').forEach((b) =>
        b.addEventListener('click', () => {
          const note = window.prompt(t('verify_dispute_note')) || '';
          verifyGame(leagueId, b.dataset.dispute, false, note);
        }));
    },
    (err) => console.warn('games listener', err)
  );
  trackUnsub(unsub);
}

function nameFor(members, uid) { return members.find((m) => m.uid === uid)?.username || 'Hooper'; }

function renderGameCard(id, g, members) {
  const uid = auth.currentUser.uid;
  const myVerification = g.verifications?.[uid];
  const needsMe = (g.involvedUids || []).includes(uid) && (!myVerification || myVerification.approved === null);
  const teamNames = (arr) => (arr || []).map((u) => nameFor(members, u)).join(', ');
  const statusLabel = g.status === 'verified' ? '✓' : g.status === 'disputed' ? '⚠︎' : '…';
  return `
    <div class="card game-card">
      <div class="game-card-top">
        <span>${teamNames(g.teamA)} <strong>${g.scoreA}</strong> — <strong>${g.scoreB}</strong> ${teamNames(g.teamB)}</span>
        <span class="muted">${statusLabel} ${timeAgo(g.createdAt?.toDate?.())}</span>
      </div>
      ${needsMe ? `
        <div class="game-card-actions">
          <span class="muted">${t('verify_score_required')}</span>
          <button class="btn btn-small btn-primary" data-approve="${id}">${t('verify_approve')}</button>
          <button class="btn btn-small btn-outline" data-dispute="${id}">${t('common_dispute')}</button>
        </div>` : g.status !== 'verified' ? `<p class="muted">${t('verify_pending')}</p>` : ''}
    </div>`;
}

async function verifyGame(leagueId, gameId, approved, note = '') {
  const uid = auth.currentUser.uid;
  const ref = doc(db, 'leagues', leagueId, 'games', gameId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const g = snap.data();
  const verifications = { ...(g.verifications || {}), [uid]: { approved, note } };
  const allApproved = (g.involvedUids || []).every((u) => verifications[u]?.approved === true);
  const anyDisputed = Object.values(verifications).some((v) => v.approved === false);
  await updateDoc(ref, {
    verifications,
    status: anyDisputed ? 'disputed' : allApproved ? 'verified' : 'pending',
  });
}

function openLogGameModal(leagueId, league, members) {
  const options = members.map((m) => `<option value="${m.uid}">${escapeHtml(m.username)}</option>`).join('');
  const modal = openModal(`
    <h2>${t('league_log_game')}</h2>
    <label class="field"><span>${t('league_pick_teams')} - Team A</span>
      <select id="lg-teamA" multiple size="4">${options}</select></label>
    <label class="field"><span>${t('league_pick_teams')} - Team B</span>
      <select id="lg-teamB" multiple size="4">${options}</select></label>
    <div class="score-row">
      <label class="field"><span>${t('league_score')} A</span><input id="lg-scoreA" type="number" min="0" value="0" /></label>
      <label class="field"><span>${t('league_score')} B</span><input id="lg-scoreB" type="number" min="0" value="0" /></label>
    </div>
    <button class="btn btn-primary" id="lg-submit">${t('common_save')}</button>
  `);
  modal.querySelector('#lg-submit').addEventListener('click', async () => {
    const teamA = [...modal.querySelector('#lg-teamA').selectedOptions].map((o) => o.value);
    const teamB = [...modal.querySelector('#lg-teamB').selectedOptions].map((o) => o.value);
    const scoreA = Number(modal.querySelector('#lg-scoreA').value) || 0;
    const scoreB = Number(modal.querySelector('#lg-scoreB').value) || 0;
    if (!teamA.length || !teamB.length) { toast(t('league_pick_teams'), true); return; }
    const uid = auth.currentUser.uid;
    const involvedUids = [...new Set([...teamA, ...teamB])];
    const verifications = Object.fromEntries(involvedUids.map((u) => [u, u === uid ? { approved: true, note: '' } : { approved: null, note: '' }]));
    try {
      await addDoc(collection(db, 'leagues', leagueId, 'games'), {
        format: league.format, teamA, teamB, scoreA, scoreB,
        playerStats: {}, loggedBy: uid, involvedUids, verifications,
        status: involvedUids.length === 1 ? 'verified' : 'pending', createdAt: serverTimestamp(),
      });
      modal.close();
    } catch (err) {
      toast(err.message, true);
    }
  });
}

async function renderLeagueChatTab(content, leagueId) {
  content.innerHTML = `
    <div id="league-chat-messages" class="chat-messages">${t('common_loading')}</div>
    <form id="league-chat-form" class="chat-input-row">
      <input id="league-chat-input" placeholder="${t('chat_new_message')}" autocomplete="off" />
      <button type="submit" class="btn btn-primary btn-small">${t('common_send')}</button>
    </form>
  `;
  const uid = auth.currentUser.uid;
  const msgsEl = content.querySelector('#league-chat-messages');
  const unsub = onSnapshot(
    query(collection(db, 'leagues', leagueId, 'messages'), orderBy('createdAt', 'asc'), limit(200)),
    (snap) => {
      msgsEl.innerHTML = snap.docs.map((d) => {
        const m = d.data();
        if (m.system) return `<div class="chat-system">${escapeHtml(m.username)} ${escapeHtml(m.text)}</div>`;
        return `<div class="chat-bubble ${m.uid === uid ? 'chat-bubble-mine' : ''}">
          <span class="chat-bubble-author">${escapeHtml(m.username)}</span>${escapeHtml(m.text)}</div>`;
      }).join('') || `<div class="empty-state">${t('chat_no_messages')}</div>`;
      msgsEl.scrollTop = msgsEl.scrollHeight;
    },
    (err) => console.warn('league chat listener', err)
  );
  trackUnsub(unsub);

  content.querySelector('#league-chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = content.querySelector('#league-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    await addDoc(collection(db, 'leagues', leagueId, 'messages'), {
      uid, username: getState().profile?.username || 'Hooper', text, createdAt: serverTimestamp(),
    });
  });
}
