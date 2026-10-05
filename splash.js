/* =========================================================
   Splash — vídeo do castor na primeira visita
   ---------------------------------------------------------
   • O <head> decide antes do primeiro paint se a splash
     aparece (classe .splash-on): só na 1ª visita, sem
     "reduzir movimento".
   • Toca o vídeo uma vez e esmaece pouco antes do fim,
     revelando a abertura (que espera window.splashDone).
   • Nunca prende o visitante: pular, Esc, autoplay
     bloqueado, vídeo lento ou com erro → sai na hora.
   ========================================================= */
(() => {
  const root = document.documentElement;
  const el = document.querySelector('.splash');
  let resolveDone;
  window.splashDone = new Promise((r) => (resolveDone = r));

  if (!el || !root.classList.contains('splash-on')) {
    if (el) el.remove();
    resolveDone();
    return;
  }

  const video = el.querySelector('video');
  const skip = el.querySelector('.splash__skip');
  let done = false;
  let stallTimer = 0;

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(stallTimer);
    try { localStorage.setItem('nogueira:splash', '1'); } catch {}
    el.classList.add('is-leaving');        // esmaece (CSS)
    root.classList.remove('splash-on');    // libera a rolagem
    document.removeEventListener('keydown', onKey);
    video.pause();
    resolveDone();                          // a abertura começa por baixo do fade
    setTimeout(() => el.remove(), 1000);
  };

  const onKey = (e) => { if (e.key === 'Escape') finish(); };
  document.addEventListener('keydown', onKey);
  skip.addEventListener('click', finish);

  // o vídeo só é baixado por quem vai ver a splash
  video.src = video.dataset.src;
  video.addEventListener('ended', finish);
  video.addEventListener('error', finish);
  // o último meio segundo é quase estático: sai antes, emendando na abertura
  video.addEventListener('timeupdate', () => {
    if (video.duration && video.currentTime >= video.duration - 0.5) finish();
  });

  // Toca só com a aba visível: o Chrome pausa vídeo em aba de fundo, e quem abriu
  // o site em segundo plano deve ver a splash ao chegar na aba, não perdê-la.
  const start = () => {
    // rede lenta: se não começar a tocar em 3 s, segue para o site
    clearTimeout(stallTimer);
    stallTimer = setTimeout(finish, 3000);
    const p = video.play();
    if (p && p.catch) {
      p.catch(() => {
        if (document.visibilityState === 'hidden') clearTimeout(stallTimer); // retoma ao voltar
        else finish();                                                       // autoplay bloqueado
      });
    }
  };
  video.addEventListener('playing', () => clearTimeout(stallTimer));
  document.addEventListener('visibilitychange', () => {
    if (!done && document.visibilityState === 'visible' && video.paused) start();
  });
  if (document.visibilityState === 'visible') start();
})();
