/* =========================================================
   Portfólio Nogueira — motor de cenas
   ---------------------------------------------------------
   • Lenis: rolagem suave com inércia.
   • GSAP ScrollTrigger: cada cena é uma linha do tempo cujo
     progresso é a posição da rolagem (scrub). Rolou para
     baixo, a animação avança; rolou para cima, ela volta.
   • "pin": a cena fica presa na tela enquanto a animação
     acontece, e só então a página continua.
   ========================================================= */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- utilidades que independem de animação ---------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  const toast = $('.toast');
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        toast.textContent = 'E-mail copiado ✓';
      } catch {
        toast.textContent = btn.dataset.copy;
      }
      toast.classList.add('is-on');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove('is-on'), 2200);
    });
  });

  /* ---------- divisão de texto ---------- */

  // [data-tiles] → cada letra vira: glifo + bloco (tile) por cima
  $$('[data-tiles]').forEach((el) => {
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    $$('.row', el).forEach((row) => {
      row.setAttribute('aria-hidden', 'true');
      const words = row.textContent.trim().split(/\s+/);
      row.textContent = '';
      words.forEach((w, wi) => {
        const word = document.createElement('span');
        word.className = 'word';
        for (const c of w) {
          const ch = document.createElement('span');
          ch.className = 'ch';
          const g = document.createElement('span');
          g.className = 'ch__g';
          g.textContent = c;
          const t = document.createElement('span');
          t.className = 'ch__t';
          ch.append(g, t);
          word.appendChild(ch);
        }
        row.appendChild(word);
        if (wi < words.length - 1) row.appendChild(document.createTextNode(' '));
      });
    });
  });

  // [data-scrub-words] → cada palavra em um <span> que acende com a rolagem
  $$('[data-scrub-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="sw">${w}</span>`).join(' ');
  });

  /* ---------- sem GSAP (CDN fora) ou movimento reduzido: tudo estático ---------- */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    root.classList.remove('motion');
    $$('[data-count]').forEach((el) => (el.textContent = el.dataset.count));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis: rolagem com inércia, sincronizada ao GSAP ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.4 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis; // útil para depurar no console
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#topo' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Tiles: blocos que se transformam em letras ---------- */
  function playTiles(el, delay = 0) {
    const chars = $$('.ch', el);
    const spread = Math.min(0.9, chars.length * 0.03);
    const tl = gsap.timeline({ delay });
    chars.forEach((ch) => {
      const t = ch.querySelector('.ch__t');
      const g = ch.querySelector('.ch__g');
      const d = Math.random() * spread;
      tl.fromTo(t, { scale: 0, opacity: 1 }, { scale: 1, duration: 0.42, ease: 'back.out(2.4)' }, d)
        .set(g, { opacity: 1 }, d + 0.32)
        .to(t, { scale: 0.15, opacity: 0, duration: 0.38, ease: 'power3.in' }, d + 0.32);
    });
    return tl;
  }

  /* ---------- Contadores ---------- */
  function countUp(el) {
    const end = +el.dataset.count;
    const obj = { v: 0 };
    gsap.to(obj, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(obj.v)) });
  }

  /* ---------- Inicia depois das fontes (medidas dependem delas) ---------- */
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(init);

  function init() {
    const mm = gsap.matchMedia();

    /* ===== Barra de progresso, nav e link ativo ===== */
    const bar = $('.progress span');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => gsap.set(bar, { scaleX: s.progress }) });

    const nav = $('.nav');
    let lastY = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => {
        const y = s.scroll();
        nav.classList.toggle('is-hidden', y > lastY && y > 300);
        lastY = y;
      },
    });

    /* ===== CENA 1 — Hero: zoom que mergulha numa letra ===== */
    const title = $('.hero__title');
    // Alvo do mergulho: o primeiro "I" (haste sólida no meio). Sem "I", a haste esquerda da 1ª letra.
    const heroChars = $$('.hero__title .ch');
    const iChar = heroChars.find((c) => /^[iíIÍ]$/.test(c.textContent));
    const target = iChar || heroChars[0];
    const targetX = iChar ? 0.5 : 0.22;
    const stage = $('.hero__stage');
    let origin = { x: 0, y: 0 };
    const setOrigin = () => {
      // offsetLeft/Top ignoram transforms → medida estável em qualquer ponto da rolagem
      const ox = target.offsetLeft + target.offsetWidth * targetX;
      const oy = target.offsetTop + target.offsetHeight * 0.55;
      title.style.transformOrigin = `${ox}px ${oy}px`;
      // quanto o "I" precisa andar para chegar ao centro da tela
      origin = {
        x: stage.clientWidth / 2 - (title.offsetLeft + ox),
        y: stage.clientHeight / 2 - (title.offsetTop + oy),
      };
    };
    setOrigin();
    ScrollTrigger.addEventListener('refreshInit', setOrigin);

    gsap.from('.shard', { scale: 0, rotate: -90, duration: 1.4, ease: 'expo.out', stagger: 0.1, delay: 0.6 });

    gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=230%', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
    })
      .to('[data-hero-fade]', { opacity: 0, y: -40, duration: 0.12, ease: 'none' }, 0)
      .to(title, { x: () => origin.x, y: () => origin.y, duration: 0.55, ease: 'power2.inOut' }, 0)
      .to(title, { scale: 70, duration: 1, ease: 'expo.in' }, 0)
      .to('.shard--a', { x: 420, y: -620, rotate: 140, scale: 1.8, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.shard--b', { x: -300, y: 380, rotate: -80, scale: 2.2, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.shard--c', { x: -360, y: -520, rotate: -120, scale: 1.6, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.shard--d', { x: 380, y: 520, rotate: 70, scale: 2, duration: 0.8, ease: 'power2.in' }, 0)
      .to('.hero__fill', { opacity: 1, duration: 0.1, ease: 'none' }, 0.9);

    /* ===== CENA 2 — Sobre: palavras acendem com a rolagem ===== */
    gsap.to('.about__scrub .sw', {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: '.about__scrub', start: 'top 80%', end: 'bottom 40%', scrub: true },
    });

    /* ===== CENA 3 — Projetos: palco com carrossel em foco ===== */
    mm.add('(min-width: 861px)', () => {
      const pin = $('.work__pin');
      const track = $('.work__track');
      const cards = $$('.card', track);
      const current = $('[data-current]');
      const bar = $('.work__bar i');

      pin.style.position = 'relative'; // cards medem offsetLeft a partir do palco
      const center = (c) => c.offsetLeft + c.offsetWidth / 2;
      const startX = () => pin.clientWidth * 1.02 - cards[0].offsetLeft;   // 1º card logo após a borda direita
      const endX = () => pin.clientWidth / 2 - center(cards[cards.length - 1]); // último card centralizado

      // Foco: quanto mais perto do centro, maior, reto e opaco; longe dele, menor, inclinado e esmaecido
      const focus = () => {
        const w = pin.clientWidth;
        const x = gsap.getProperty(track, 'x');
        let best = 0, bestD = Infinity;
        cards.forEach((c, i) => {
          const d = (center(c) + x - w / 2) / w;      // 0 = no centro; ±1 = uma tela de distância
          const a = Math.min(Math.abs(d), 1);
          gsap.set(c, {
            scale: 1 - a * 0.2,
            rotate: Math.max(-1, Math.min(1, d)) * 7,
            y: a * 50,
            opacity: 1 - a * 0.6,
          });
          if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
        });
        current.textContent = String(best + 1).padStart(2, '0');
        gsap.set(bar, { scaleX: (best + 1) / cards.length });
      };

      gsap.fromTo(track, { x: startX }, {
        x: endX,
        ease: 'none',
        onUpdate: focus,
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${(startX() - endX()) * 1.15}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: focus,
        },
      });
      focus();

      return () => gsap.set(cards, { clearProps: 'transform,opacity' });
    });

    mm.add('(max-width: 860px)', () => {
      $$('.card').forEach((card) => {
        gsap.fromTo(card, { opacity: 0, y: 80, scale: 0.92 }, {
          opacity: 1, y: 0, scale: 1, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 55%', scrub: 1 },
        });
      });
    });

    /* ===== CENA 4 — Jornada: plano isométrico que deita ===== */
    mm.add('(min-width: 861px)', () => {
      gsap.timeline({
        scrollTrigger: { trigger: '.journey__pin', start: 'top top', end: '+=140%', scrub: 1, pin: true, anticipatePin: 1 },
      })
        .fromTo('.iso__plane',
          { rotateX: 56, rotateZ: -36, scale: 0.72, y: 40 },
          { rotateX: 0, rotateZ: 0, scale: 1, y: 0, duration: 1, ease: 'power2.inOut' })
        .fromTo('.phase',
          { z: (i) => 160 + (i % 3) * 70 + Math.floor(i / 3) * 50, opacity: 0 },
          { z: 0, opacity: 1, duration: 0.6, stagger: 0.045, ease: 'power3.out' }, 0);
    });

    mm.add('(max-width: 860px)', () => {
      gsap.fromTo('.phase', { opacity: 0, y: 40, rotate: -4 }, {
        opacity: 1, y: 0, rotate: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: '.iso', start: 'top 80%', once: true },
      });
    });

    /* ===== CENA 5 — Stack: esteiras em sentidos opostos ===== */
    $$('[data-belt]').forEach((belt) => {
      const dir = +belt.dataset.belt;
      const span = () => Math.max(0, belt.scrollWidth - window.innerWidth) * 0.7;
      gsap.fromTo(belt,
        { x: () => (dir < 0 ? 0 : -span()) },
        {
          x: () => (dir < 0 ? -span() : 0),
          ease: 'none',
          scrollTrigger: { trigger: '.belts', start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
        });
    });

    /* ===== Gatilhos simples — criados DEPOIS das cenas presas,
       para que suas posições já considerem o espaço dos pins ===== */
    // Link ativo: após qualquer mudança, consulta o estado final de todos os gatilhos
    // (num salto rápido, entrada/saída disparam em sequência e a ordem não é confiável)
    const spies = $$('.nav__links a')
      .map((a) => ({ a, sec: $(a.getAttribute('href')) }))
      .filter((x) => x.sec);
    const syncActive = () => spies.forEach((x) => x.a.classList.toggle('is-active', !!(x.st && x.st.isActive)));
    spies.forEach((x) => {
      x.st = ScrollTrigger.create({ trigger: x.sec, start: 'top 50%', end: 'bottom 50%', onToggle: syncActive });
    });

    /* ===== Reveals simples (texto, cards, botões) ===== */
    gsap.set('[data-reveal]', { opacity: 0, y: 48 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 });
        batch.forEach((el) => $$('[data-count]', el).forEach(countUp));
      },
    });

    /* ===== Títulos em tiles ===== */
    $$('[data-tiles]').forEach((el) => {
      if (el.dataset.tiles === 'load') { playTiles(el, 0.25); return; }
      ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => playTiles(el) });
    });

    // imagens carregadas podem mudar alturas → recalcula as cenas
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();
