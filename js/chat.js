import { db, auth } from './firebase-config.js';
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs, query, where, orderBy, limit,
  onSnapshot, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { t } from './i18n.js';
import { escapeHtml, toast, initials, timeAgo, dmConvoId, openModal, debounce } from './utils.js';
import { navigate } from './router.js';
import { trackUnsub, getState } from './state.js';

export async function renderChatList() {
  const view = document.getElementById('view');
  view.innerHTML = `
    <header class="screen-header">
      <h1>${t('chat_title')}</h1>
      <button class="icon-btn" id="new-dm" aria-label="${t('chat_new_message')}">+</button>
    </header>
    <section class="section">
      <h2>${t('league_title')}</h2>
      <div id="league-shortcuts" class="stack"></div>
    </section>
    <section class="section">
      <h2>${t('chat_direct')}</h2>
      <div id="dm-list" class="stack">${t('common_loading')}</div>
    </section>
  `;
  document.getElementById('new-dm').addEventListener('click', openNewDmModal);

  const uid = auth.currentUser.uid;
  const leaguesSnap = await getDocs(query(collection(db, 'leagues'), where('memberIds', 'array-contains', uid)));
  document.getElementById('league-shortcuts').innerHTML = leaguesSnap.empty
    ? `<div class="empty-state">${t('league_no_leagues')}</div>`
    : leaguesSnap.docs.map((d) => `
        <button class="card league-row" data-league="${d.id}">
          <strong>💬 ${escapeHtml(d.data().name)}</strong>
        </button>`).join('');
  document.querySelectorAll('#league-shortcuts [data-league]').forEach((b) =>
    b.addEventListener('click', () => navigate(`league/${b.dataset.league}/chat`)));

  const unsub = onSnapshot(
    query(collection(db, 'directMessages'), where('participants', 'array-contains', uid), orderBy('updatedAt', 'desc')),
    async (snap) => {
      const listEl = document.getElementById('dm-list');
      if (!listEl) return;
      if (snap.empty) { listEl.innerHTML = `<div class="empty-state">${t('chat_no_messages')}</div>`; return; }
      const rows = await Promise.all(snap.docs.map(async (d) => {
        const convo = d.data();
        const otherUid = convo.participants.find((p) => p !== uid);
        const otherSnap = await getDoc(doc(db, 'publicProfiles', otherUid));
        const other = otherSnap.data();
        return { id: d.id, convo, other };
      }));
      listEl.innerHTML = rows.filter((r) => r.other).map((r) => `
        <button class="card player-row" data-convo="${r.id}">
          <div class="avatar">${r.other.photoURL ? `<img src="${r.other.photoURL}" alt=""/>` : initials(r.other.username)}</div>
          <div class="player-row-main">
            <strong>${escapeHtml(r.other.username)}</strong>
            <span class="muted">${escapeHtml(r.convo.lastMessage || '')}</span>
          </div>
          <span class="muted">${timeAgo(r.convo.updatedAt?.toDate?.())}</span>
        </button>`).join('');
      listEl.querySelectorAll('[data-convo]').forEach((b) =>
        b.addEventListener('click', () => navigate(`dm/${b.dataset.convo}`)));
    },
    (err) => console.warn('dm list listener', err)
  );
  trackUnsub(unsub);
}

function openNewDmModal() {
  const modal = openModal(`
    <h2>${t('chat_new_message')}</h2>
    <label class="field"><span>${t('common_search')}</span><input id="dm-search" autocomplete="off" /></label>
    <div id="dm-results" class="stack"></div>
  `);
  const search = debounce(async (text) => {
    const resultsEl = modal.querySelector('#dm-results');
    if (!text) { resultsEl.innerHTML = ''; return; }
    const snap = await getDocs(query(
      collection(db, 'publicProfiles'),
      where('username', '>=', text), where('username', '<=', text + '\uf8ff'), limit(15)
    ));
    resultsEl.innerHTML = snap.docs
      .filter((d) => d.id !== auth.currentUser.uid)
      .map((d) => `<button class="card player-row" data-uid="${d.id}">
        <div class="avatar">${initials(d.data().username)}</div>
        <div class="player-row-main"><strong>${escapeHtml(d.data().username)}</strong></div>
      </button>`).join('') || `<div class="empty-state">${t('common_none')}</div>`;
    resultsEl.querySelectorAll('[data-uid]').forEach((b) =>
      b.addEventListener('click', async () => {
        const convoId = dmConvoId(auth.currentUser.uid, b.dataset.uid);
        await setDoc(doc(db, 'directMessages', convoId), {
          participants: [auth.currentUser.uid, b.dataset.uid],
          updatedAt: serverTimestamp(),
        }, { merge: true });
        modal.close();
        navigate(`dm/${convoId}`);
      }));
  }, 300);
  modal.querySelector('#dm-search').addEventListener('input', (e) => search(e.target.value.trim()));
}

export async function renderDmThread([convoId]) {
  const view = document.getElementById('view');
  const uid = auth.currentUser.uid;
  const convoSnap = await getDoc(doc(db, 'directMessages', convoId));
  const otherUid = convoSnap.data()?.participants?.find((p) => p !== uid);
  const otherSnap = otherUid ? await getDoc(doc(db, 'publicProfiles', otherUid)) : null;
  const other = otherSnap?.data();

  view.innerHTML = `
    <header class="screen-header">
      <button class="icon-btn" id="back-btn" aria-label="${t('common_back')}">←</button>
      <h1>${other ? escapeHtml(other.username) : t('chat_title')}</h1>
    </header>
    <div id="dm-messages" class="chat-messages">${t('common_loading')}</div>
    <form id="dm-form" class="chat-input-row">
      <input id="dm-input" placeholder="${t('chat_new_message')}" autocomplete="off" />
      <button type="submit" class="btn btn-primary btn-small">${t('common_send')}</button>
    </form>
  `;
  view.querySelector('#back-btn').addEventListener('click', () => navigate('chat'));

  const msgsEl = view.querySelector('#dm-messages');
  const unsub = onSnapshot(
    query(collection(db, 'directMessages', convoId, 'messages'), orderBy('createdAt', 'asc'), limit(200)),
    (snap) => {
      msgsEl.innerHTML = snap.docs.map((d) => {
        const m = d.data();
        const mine = m.senderId === uid;
        return `<div class="chat-bubble ${mine ? 'chat-bubble-mine' : ''}">${escapeHtml(m.text || '')}</div>`;
      }).join('') || `<div class="empty-state">${t('chat_no_messages')}</div>`;
      msgsEl.scrollTop = msgsEl.scrollHeight;
    },
    (err) => console.warn('dm thread listener', err)
  );
  trackUnsub(unsub);

  view.querySelector('#dm-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = view.querySelector('#dm-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    try {
      await addDoc(collection(db, 'directMessages', convoId, 'messages'), {
        senderId: uid, text, createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'directMessages', convoId), {
        lastMessage: text, updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      toast(err.message, true);
    }
  });
}
