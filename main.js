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

  /* ---------- Nav: pílula → botão flutuante do castor ---------- */
  // Fica fora do bloco de animação: funciona mesmo sem GSAP ou com movimento reduzido.
  const nav = $('.nav');
  const brand = $('.nav__brand');
  const mobile = matchMedia('(max-width: 760px)');
  const COMPACT_AT = 140;   // px rolados até a pílula se recolher
  const CLOSE_AFTER = 80;   // px rolados com o menu aberto até ele se fechar sozinho
  let openedAt = 0;

  // o castor abre o menu quando os links não estão à vista (recolhido ou celular)
  const isToggle = () => nav.classList.contains('is-compact') || mobile.matches;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    brand.setAttribute('aria-expanded', String(open));
    openedAt = scrollY;
    syncLabel();
  };
  const syncLabel = () => {
    brand.setAttribute('aria-label',
      !isToggle() ? 'Voltar ao início' : nav.classList.contains('is-open') ? 'Fechar menu' : 'Abrir menu');
  };

  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-compact', y > COMPACT_AT);
    if (nav.classList.contains('is-open') && Math.abs(y - openedAt) > CLOSE_AFTER) setOpen(false);
    syncLabel();
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll(); });
  }, { passive: true });
  mobile.addEventListener('change', syncLabel);
  onScroll();

  brand.addEventListener('click', () => {
    if (isToggle()) return setOpen(!nav.classList.contains('is-open'));
    if (window.lenis) window.lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // fecha ao escolher um link, ao clicar fora ou com Esc
  $$('.nav__menu a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); brand.focus(); }
  });

  /* ---------- Castor olhando para o mouse ---------- */
  // A cabeça gira na direção do cursor; o botão fica parado (continua fácil de clicar).
  // Com WebGL, é o modelo 3D (castor3d.js + assets/castor.glb) que gira de verdade;
  // sem ele, a <img> PNG faz uma inclinação em CSS no lugar.
  // A rotação do botão (hover/recolher) fica no <button>, então um não briga com o outro.
  const beaver = $('img', brand);
  const canvas3d = $('canvas', brand);
  let beaver3d = null;
  const canLook = matchMedia('(hover: hover) and (pointer: fine)').matches
    && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_YAW = 0.75, MAX_PITCH = 0.5; // radianos (≈ 43° e 29°) no modelo 3D
  // sem mouse (toque) ou com movimento reduzido: pose fixa levemente de lado, para mostrar o volume
  const REST = canLook ? { x: 0, y: 0 } : { x: -0.35, y: 0.15 };
  const look = { ...REST }, aim = { ...REST };

  const pose = () => {
    if (beaver3d) return beaver3d.look(look.x * MAX_YAW, look.y * MAX_PITCH);
    if (canLook) beaver.style.transform =
      `perspective(160px) translate(${look.x * 4}px, ${look.y * 4}px) ` +
      `rotateY(${look.x * 38}deg) rotateX(${-look.y * 28}deg)`;
  };

  // o modelo (~145 KB) só é baixado depois que a página terminou de carregar
  addEventListener('load', () => {
    if (!window.Castor3D || !canvas3d) return;
    Castor3D.mount(canvas3d, 'assets/castor.glb')
      .then((c) => { beaver3d = c; beaver.style.transform = ''; pose(); brand.classList.add('has-3d'); })
      .catch(() => {}); // fica a imagem PNG
  });

  if (canLook) {
    const REACH = 420; // px de distância em que o olhar atinge o máximo
    let raf = 0;

    const render = () => {
      // aproxima suavemente do alvo (inércia), e para o loop quando chega
      look.x += (aim.x - look.x) * 0.14;
      look.y += (aim.y - look.y) * 0.14;
      pose();
      raf = Math.abs(aim.x - look.x) + Math.abs(aim.y - look.y) > 0.002 ? requestAnimationFrame(render) : 0;
    };
    const aimAt = (x, y) => {
      aim.x = x; aim.y = y;
      if (!raf) raf = requestAnimationFrame(render);
    };

    addEventListener('pointermove', (e) => {
      const r = brand.getBoundingClientRect(); // o botão, não a img/canvas, que já estão girados
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      aimAt(clamp(dx / REACH), clamp(dy / REACH));
    }, { passive: true });
    // mouse saiu da janela → volta a olhar para frente
    document.documentElement.addEventListener('pointerleave', () => aimAt(0, 0));
  }

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

    // expo.in "normalizado": vale exatamente 0 no início. O expo.in do GSAP salta para ~0.001
    // logo após 0, e como o pin começa em -0.001 o título carregava com escala 1.07 em vez de 1.
    const dive = (p) => (2 ** (10 * p) - 1) / 1023;
    // Valores iniciais explícitos (fromTo): com .to() a linha do tempo gravava o estado da
    // entrada dos shards (escala 0) como ponto de partida, e eles sumiam ao voltar ao topo.
    const rest = { x: 0, y: 0, rotate: 0, scale: 1 };
    const fly = (to) => ({ ...to, duration: 0.8, ease: 'power2.in', immediateRender: false });

    gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=150%', scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
    })
      .fromTo('[data-hero-fade]', { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.12, ease: 'none', immediateRender: false }, 0)
      // force3D: false → transform 2D, sem camada de GPU gigante (ver .hero__title no CSS).
      // A escala para em 40: a haste do "I" já passa da altura da tela e a faixa lima completa o mergulho.
      .fromTo(title, { x: 0, y: 0 }, { x: () => origin.x, y: () => origin.y, duration: 0.55, ease: 'power2.inOut', force3D: false, immediateRender: false }, 0)
      .fromTo(title, { scale: 1 }, { scale: 40, duration: 1, ease: dive, force3D: false, immediateRender: false }, 0)
      .fromTo('.shard--a', rest, fly({ x: 420, y: -620, rotate: 140, scale: 1.8 }), 0)
      .fromTo('.shard--b', rest, fly({ x: -300, y: 380, rotate: -80, scale: 2.2 }), 0)
      .fromTo('.shard--c', rest, fly({ x: -360, y: -520, rotate: -120, scale: 1.6 }), 0)
      .fromTo('.shard--d', rest, fly({ x: 380, y: 520, rotate: 70, scale: 2 }), 0)
      .fromTo('.hero__fill', { clipPath: 'inset(0% 50%)' }, { clipPath: 'inset(0% 0%)', duration: 0.12, ease: 'power2.in', immediateRender: false }, 0.88);

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
      const startX = () => pin.clientWidth * 0.62 - cards[0].offsetLeft;   // 1º card já entrando pela direita
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
          end: () => `+=${startX() - endX()}`,
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
        scrollTrigger: { trigger: '.journey__pin', start: 'top top', end: '+=90%', scrub: 1, pin: true, anticipatePin: 1 },
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
