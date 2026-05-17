/* ════ player.js ════ */
(function () {
  'use strict';

  const wrap     = document.getElementById('playerWrap');
  const video    = document.getElementById('mainVideo');
  const playBtn  = document.getElementById('playBtn');
  const playIco  = document.getElementById('playIco');
  const pauseIco = document.getElementById('pauseIco');
  const skipBack = document.getElementById('skipBackBtn');
  const skipFwd  = document.getElementById('skipFwdBtn');
  const muteBtn  = document.getElementById('muteBtn');
  const volHigh  = document.getElementById('volHigh');
  const volMute  = document.getElementById('volMute');
  const volSlider= document.getElementById('volSlider');
  const progBar  = document.getElementById('progressBar');
  const progFill = document.getElementById('progressFill');
  const progThumb= document.getElementById('progressThumb');
  const curTime  = document.getElementById('currentTime');
  const totTime  = document.getElementById('totalTime');
  const fsBtn    = document.getElementById('fsBtn');
  const fsIn     = document.getElementById('fsIn');
  const fsOut    = document.getElementById('fsOut');

  if (!video) return;   // YouTube embed or placeholder – no native controls

  /* ── Auto show / hide controls ────────── */
  let hideTimer;
  function show() {
    wrap.classList.add('active');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!video.paused) wrap.classList.remove('active');
    }, 3200);
  }
  wrap.addEventListener('mousemove', show);
  wrap.addEventListener('touchstart', show, { passive: true });

  /* ── Play / Pause ────────────────────── */
  function setPlayState(playing) {
    playIco.style.display  = playing ? 'none'  : 'block';
    pauseIco.style.display = playing ? 'block' : 'none';
  }

  function togglePlay() {
    video.paused ? video.play() : video.pause();
  }

  if (playBtn)       playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  video.addEventListener('play',  () => setPlayState(true));
  video.addEventListener('pause', () => { setPlayState(false); wrap.classList.add('active'); });
  video.addEventListener('ended', () => { setPlayState(false); wrap.classList.add('active'); });

  /* ── Skip ────────────────────────────── */
  if (skipBack) skipBack.addEventListener('click', () => { video.currentTime -= 10; hint('↺ 10s'); });
  if (skipFwd)  skipFwd.addEventListener('click',  () => { video.currentTime += 10; hint('↻ 10s'); });

  /* ── Volume ──────────────────────────── */
  function syncVolIcons() {
    if (!volHigh || !volMute) return;
    const muted = video.muted || video.volume === 0;
    volHigh.style.display = muted ? 'none'  : 'block';
    volMute.style.display = muted ? 'block' : 'none';
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (volSlider) volSlider.value = video.muted ? 0 : video.volume;
      syncVolIcons();
    });
  }
  if (volSlider) {
    volSlider.addEventListener('input', () => {
      video.volume = parseFloat(volSlider.value);
      video.muted  = video.volume === 0;
      syncVolIcons();
    });
  }

  /* ── Progress ────────────────────────── */
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progFill)  progFill.style.width = pct + '%';
    if (progThumb) progThumb.style.left = pct + '%';
    if (curTime)   curTime.textContent  = fmt(video.currentTime);
  });

  video.addEventListener('loadedmetadata', () => {
    if (totTime) totTime.textContent = fmt(video.duration);
  });

  if (progBar) {
    progBar.addEventListener('click', e => {
      const rect = progBar.getBoundingClientRect();
      video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration;
    });
  }

  /* ── Fullscreen ──────────────────────── */
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      document.fullscreenElement ? document.exitFullscreen() : wrap.requestFullscreen().catch(() => {});
    });
    document.addEventListener('fullscreenchange', () => {
      const fs = !!document.fullscreenElement;
      if (fsIn)  fsIn.style.display  = fs ? 'none'  : 'block';
      if (fsOut) fsOut.style.display = fs ? 'block' : 'none';
    });
  }

  /* ── Keyboard ────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault(); togglePlay(); break;
      case 'ArrowLeft':
        video.currentTime -= 10; hint('↺ 10s'); break;
      case 'ArrowRight':
        video.currentTime += 10; hint('↻ 10s'); break;
      case 'ArrowUp':
        video.volume = Math.min(1, video.volume + .1);
        if (volSlider) volSlider.value = video.volume;
        syncVolIcons(); break;
      case 'ArrowDown':
        video.volume = Math.max(0, video.volume - .1);
        if (volSlider) volSlider.value = video.volume;
        syncVolIcons(); break;
      case 'm':
        video.muted = !video.muted;
        if (volSlider) volSlider.value = video.muted ? 0 : video.volume;
        syncVolIcons(); break;
      case 'f':
        fsBtn && fsBtn.click(); break;
    }
  });

  /* ── Helpers ─────────────────────────── */
  function fmt(s) {
    if (!isFinite(s)) return '--:--';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${m}:${String(sec).padStart(2,'0')}`;
  }

  function hint(text) {
    document.querySelector('.key-hint')?.remove();
    const el = document.createElement('div');
    el.className   = 'key-hint';
    el.textContent = text;
    wrap.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  /* ── Autoplay ────────────────────────── */
  video.play().catch(() => { wrap.classList.add('active'); setPlayState(false); });
  syncVolIcons();

})();
