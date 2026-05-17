/* ════════════════════════════════════════════
   Netflix Clone – main.js
════════════════════════════════════════════ */

/* ── Navbar scroll ──────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const tick = () => nav.classList.toggle('solid', window.scrollY > 60);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── Search toggle ──────────────────────── */
(function () {
  const wrap   = document.getElementById('navSearch');
  const toggle = document.getElementById('searchToggle');
  const input  = document.getElementById('searchInput');
  if (!toggle || !input) return;

  toggle.addEventListener('click', () => {
    wrap.classList.toggle('open');
    if (wrap.classList.contains('open')) input.focus();
  });

  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    if (input.value.trim().length >= 2) {
      timer = setTimeout(() => {
        window.location.href = '/search?q=' + encodeURIComponent(input.value.trim());
      }, 600);
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = '/search?q=' + encodeURIComponent(input.value.trim());
    }
    if (e.key === 'Escape') {
      wrap.classList.remove('open');
      input.value = '';
    }
  });
})();

/* ── Slider ─────────────────────────────── */
const positions = {};

function slide(rowId, dir) {
  const track = document.getElementById('track-' + rowId);
  if (!track) return;
  const cards   = track.querySelectorAll('.movie-card');
  if (!cards.length) return;
  const cw      = cards[0].offsetWidth + 4;
  const visible = Math.floor(track.parentElement.offsetWidth / cw);
  const step    = visible * cw;
  const maxPos  = track.scrollWidth - track.parentElement.offsetWidth;

  positions[rowId] = (positions[rowId] || 0) + dir * step;
  positions[rowId] = Math.max(0, Math.min(positions[rowId], maxPos));
  track.style.transform = `translateX(-${positions[rowId]}px)`;
}

/* ── Modal state ────────────────────────── */
let _modalMovieId   = null;
let _modalInMyList  = false;

function openModal(card) {
  const modal = document.getElementById('modal');
  if (!modal) return;

  _modalMovieId  = card.dataset.id;
  _modalInMyList = card.dataset.inList === '1';

  document.getElementById('modalBanner').style.backgroundImage = `url('${card.dataset.banner}')`;
  document.getElementById('modalPlay').href        = `/movies/${_modalMovieId}/watch`;
  document.getElementById('modalMoreInfo').href    = `/movies/${_modalMovieId}`;
  document.getElementById('modalYear').textContent = card.dataset.year;
  document.getElementById('modalDuration').textContent = card.dataset.duration ? card.dataset.duration + ' min' : '';
  document.getElementById('modalDesc').textContent     = card.dataset.desc;
  document.getElementById('modalCast').textContent     = card.dataset.cast     || '—';
  document.getElementById('modalGenre').textContent    = card.dataset.genre    || '—';
  document.getElementById('modalDirector').textContent = card.dataset.director || '—';

  updateModalListIcon();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
}

function updateModalListIcon() {
  const icon = document.getElementById('modalListIcon');
  if (!icon) return;
  icon.innerHTML = _modalInMyList
    ? '<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" fill="none"/>'
    : '<line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.2"/>';
}

async function modalToggleList() {
  if (!_modalMovieId) return;
  const url = _modalInMyList ? '/list/remove' : '/list/add';
  const r   = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'movie_id=' + _modalMovieId,
  });
  const d = await r.json();
  if (d.success) {
    _modalInMyList = !_modalInMyList;
    updateModalListIcon();
    showToast(_modalInMyList ? 'Added to My List' : 'Removed from My List');
  }
}

/* Quick list toggle on card buttons */
async function quickList(btn, movieId) {
  const inList = btn.dataset.inList === '1';
  const url    = inList ? '/list/remove' : '/list/add';
  const r = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    'movie_id=' + movieId,
  });
  const d = await r.json();
  if (d.success) {
    btn.dataset.inList = inList ? '0' : '1';
    btn.innerHTML = inList
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    showToast(inList ? 'Removed from My List' : 'Added to My List');
  }
}

/* ── Toast ──────────────────────────────── */
function showToast(msg) {
  const root = document.getElementById('toastRoot');
  if (!root) return;
  const el = document.createElement('div');
  el.className   = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ── Keyboard ───────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
