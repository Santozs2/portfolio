import { useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react';
import { Cpu, Menu, X, RefreshCw, CheckCircle2, Terminal } from 'lucide-react';

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'ambiente-central',        name: 'Central',  num: '01' },
  { id: 'ambiente-proxima-versao', name: 'Sobre',    num: '02' },
  { id: 'ambiente-jornada',        name: 'Jornada',  num: '03' },
  { id: 'ambiente-laboratorio',    name: 'Projetos', num: '04' },
  { id: 'ambiente-ferramentas',    name: 'Stack',    num: '05' },
  { id: 'ambiente-contato',        name: 'Contato',  num: '06' },
] as const;

type NavId = (typeof NAV_ITEMS)[number]['id'];

/* ─────────────────────────────────────────
   Animation constants
───────────────────────────────────────── */
const EASE_PREMIUM = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Threshold before the pill morphs in.
 * 60px lets the hero top-bar breathe before the nav transforms.
 */
const SCROLL_THRESHOLD = 60;

/**
 * Animatable CSS values — Framer Motion interpolates every numeric property.
 * borderRadius, paddingX/Y, boxShadow, backgroundColor, scale, marginTop
 * are all numeric or color strings → smooth 60fps.
 *
 * backdropFilter is handled via inline style + CSS transition (see below)
 * because Framer's WAAPI path doesn't interpolate blur() reliably.
 */
const VARIANT_TOP = {
  backgroundColor: 'rgba(2, 2, 2, 0)',
  // inset shadow = 0 → no border in the transparent state
  boxShadow:       '0 0px 0px rgba(0,0,0,0), inset 0 0 0 0px rgba(255,255,255,0)',
  borderRadius:    4,
  paddingLeft:     32,
  paddingRight:    32,
  paddingTop:      18,
  paddingBottom:   18,
  marginTop:       0,
  scale:           1,
} as const;

const VARIANT_FLOAT = {
  backgroundColor: 'rgba(9, 9, 11, 0.82)',
  // inset box-shadow acts as the 1px border so borderColor doesn't need to animate
  boxShadow:       '0 16px 48px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.065)',
  borderRadius:    999,
  paddingLeft:     20,
  paddingRight:    20,
  paddingTop:      10,
  paddingBottom:   10,
  marginTop:       16,
  // 0.975 vs 0.95: visually near-identical shrink, avoids sub-pixel text blur
  scale:           0.975,
} as const;

const MORPH_TRANSITION = {
  duration: 0.7,
  ease:     EASE_PREMIUM,
};

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function ControlDesk() {
  const [isScrolled,  setIsScrolled]  = useState(false);
  const [activeTab,   setActiveTab]   = useState<NavId>('ambiente-central');
  const [mobileOpen,  setMobileOpen]  = useState(false);

  // Diagnostics (preserved from original)
  const [showDiag, setShowDiag] = useState(false);
  const [diagStep, setDiagStep] = useState(0);
  const [diagLogs, setDiagLogs] = useState<string[]>([]);

  const { scrollY } = useScroll();

  /* ── Scroll → morph trigger ────────────────────── */
  useMotionValueEvent(scrollY, 'change', (y) => {
    setIsScrolled(y > SCROLL_THRESHOLD);
    // Dismiss mobile menu if user scrolls away
    if (y > 40 && mobileOpen) setMobileOpen(false);
  });

  /* ── Active section detection ───────────────────── */
  useEffect(() => {
    const detectActive = () => {
      const pivot = window.scrollY + window.innerHeight / 3;
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && pivot >= el.offsetTop && pivot < el.offsetTop + el.offsetHeight) {
          setActiveTab(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', detectActive, { passive: true });
    detectActive();
    return () => window.removeEventListener('scroll', detectActive);
  }, []);

  /* ── Navigation helper ───────────────────────────── */
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab(id as NavId);
    setMobileOpen(false);
  }, []);

  /* ── Diagnostics sequence ───────────────────────── */
  const runDiagnostics = () => {
    setShowDiag(true);
    setDiagStep(1);
    setDiagLogs(['[NG_SYS] Inicializando diagnósticos integrados...']);

    [
      {
        delay: 600, step: 2,
        logs: [
          '[GPU] Calculando latência de animações... 60 fps ✓',
          '[BROWSER] Verificando suporte CSS Grid / WebGL... Conforme',
        ],
      },
      {
        delay: 1250, step: 3,
        logs: [
          '[MOTION] Checando Framer Motion runtime... Estável',
          '[WAL] Diário de transações idempotente montado!',
        ],
      },
      {
        delay: 2000, step: 4,
        logs: ['[SISTEMA] Todos os parâmetros verdes. Pronto para navegação.'],
      },
    ].forEach(({ delay, step, logs }) => {
      setTimeout(() => {
        setDiagStep(step);
        setDiagLogs((prev) => [...prev, ...logs]);
      }, delay);
    });
  };

  /* ─────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────── */
  return (
    <>
      {/*
        ╔══════════════════════════════════════════════╗
        ║  Full-width fixed shell — pointer-events-none ║
        ║  Only the inner <nav> is interactive          ║
        ╚══════════════════════════════════════════════╝
        NOTE: Add `pt-16 lg:pt-20` to CentralEnviron's
        outer div to prevent the transparent nav from
        covering the TOP DECK HEADER TILES. Alternatively,
        remove that inner header block and let this nav
        own the top chrome entirely.
      */}
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none">
        <motion.nav
          aria-label="Navegação principal"
          animate={isScrolled ? VARIANT_FLOAT : VARIANT_TOP}
          transition={MORPH_TRANSITION}
          className="pointer-events-auto flex items-center gap-3"
          style={{
            /*
              backdropFilter via CSS transition — Framer's WAAPI path
              doesn't reliably interpolate blur() across all browsers.
              CSS transition with the same cubic-bezier matches perfectly.
            */
            backdropFilter:         isScrolled ? 'blur(20px) saturate(1.6)' : 'blur(0px)',
            WebkitBackdropFilter:   isScrolled ? 'blur(20px) saturate(1.6)' : 'blur(0px)',
            transition: `
              backdrop-filter       0.7s cubic-bezier(0.22, 1, 0.36, 1),
              -webkit-backdrop-filter 0.7s cubic-bezier(0.22, 1, 0.36, 1)
            `.trim(),
            willChange: 'transform, background-color, box-shadow, border-radius',
          }}
        >
          {/* ────── Brand ────── */}
          <button
            onClick={() => scrollTo('ambiente-central')}
            className="flex items-center gap-2 group shrink-0 cursor-pointer"
            aria-label="Ir para o início"
          >
            <span className="font-mono font-black text-orange-500 text-sm tracking-tight leading-none select-none group-hover:text-orange-400 transition-colors duration-150">
              NO-G
            </span>

            {/* "MARCA PESSOAL" label fades out when pill is floating */}
            <AnimatePresence>
              {!isScrolled && (
                <motion.span
                  key="brand-label"
                  initial={{ opacity: 0, maxWidth: 0 }}
                  animate={{ opacity: 1, maxWidth: 140 }}
                  exit={{ opacity: 0, maxWidth: 0 }}
                  transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                  className="hidden sm:block overflow-hidden font-mono text-[9px] text-white/25 tracking-[0.2em] uppercase whitespace-nowrap select-none"
                >
                  MARCA PESSOAL
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* ────── Divider ────── */}
          <div className="hidden md:block h-4 w-px bg-white/10 shrink-0 mx-1" />

          {/* ────── Desktop nav links ────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={[
                    'relative px-3.5 py-1.5 rounded-full',
                    'font-mono text-xs tracking-wide leading-none',
                    'transition-colors duration-150 group select-none cursor-pointer',
                    isActive ? 'text-white' : 'text-white/40 hover:text-white/75',
                  ].join(' ')}
                >
                  {/* Shared sliding active pill (layoutId drives the FLIP animation) */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-orange-500/10 border border-orange-500/20"
                      transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                    />
                  )}

                  <span className="relative flex items-center gap-1.5">
                    <span
                      className={[
                        'text-[7px] font-bold transition-colors duration-150',
                        isActive
                          ? 'text-orange-500'
                          : 'text-orange-500/35 group-hover:text-orange-500/60',
                      ].join(' ')}
                    >
                      {item.num}
                    </span>
                    {item.name}
                  </span>

                  {/* Animated underline for inactive items */}
                  {!isActive && (
                    <span className="absolute bottom-1 left-3.5 right-3.5 h-px bg-white/20 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ────── Right controls ────── */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {/* Diagnostics button */}
            <motion.button
              onClick={runDiagnostics}
              title="Diagnósticos do sistema"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
              className="p-2 rounded-full border border-white/10 hover:border-orange-500/35 hover:bg-orange-500/8 text-orange-400/60 hover:text-orange-400 transition-colors duration-200 cursor-pointer group"
            >
              <Cpu
                size={12}
                className="group-hover:animate-spin"
                style={{ animationDuration: '2s' }}
              />
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen((v) => !v)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 rounded-full border border-white/10 hover:border-white/20 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{ rotate: 90,    opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    <X size={12} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90,  opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{ rotate: -90,   opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    <Menu size={12} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/*
        ╔═══════════════════════════╗
        ║  Mobile dropdown menu     ║
        ╚═══════════════════════════╝
      */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dimming backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="mobile-panel"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE_PREMIUM }}
              className="md:hidden fixed top-[68px] left-4 right-4 z-[45] bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
            >
              {/* Orange top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />

              <nav aria-label="Menu mobile">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = activeTab === item.id;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0  }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                      >
                        <button
                          onClick={() => scrollTo(item.id)}
                          className={[
                            'w-full text-left px-4 py-3 rounded-xl',
                            'flex items-center justify-between font-mono',
                            'transition-all duration-150 cursor-pointer',
                            isActive
                              ? 'bg-orange-500/8 border border-orange-500/15 text-white'
                              : 'text-white/40 hover:text-white hover:bg-white/4 border border-transparent',
                          ].join(' ')}
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-[9px] text-orange-500/60 font-bold">{item.num}</span>
                            <span className="text-sm tracking-wide">{item.name}</span>
                          </span>
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-dot"
                              className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"
                            />
                          )}
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between font-mono text-[9px] text-white/20">
                <span>NOGUEIRA // NAVEGAÇÃO</span>
                <span>v2.0</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/*
        ╔═══════════════════════════╗
        ║  Diagnostics modal        ║
        ╚═══════════════════════════╝
      */}
      <AnimatePresence>
        {showDiag && (
          <motion.div
            key="diag-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDiag(false);
                setDiagStep(0);
              }
            }}
          >
            <motion.div
              key="diag-panel"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              className="bg-stone-950 border border-white/12 p-6 rounded-lg max-w-md w-full relative overflow-hidden"
            >
              {/* Yellow top ribbon */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-500" />

              <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
                <span className="font-mono text-[10px] text-yellow-500 flex items-center gap-1.5 font-bold uppercase">
                  <Terminal size={12} className="text-orange-500" />
                  DIAGNÓSTICOS GERAIS: EXECUÇÃO
                </span>
                <button
                  onClick={() => { setShowDiag(false); setDiagStep(0); }}
                  className="font-mono text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  FECHAR [X]
                </button>
              </div>

              {/* Live log stream */}
              <div className="bg-black border border-white/8 p-4 font-mono text-[11px] text-orange-400 rounded min-h-[140px] space-y-1.5 max-h-[200px] overflow-y-auto">
                {diagLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-white/25">&gt;&gt;</span> {log}
                  </div>
                ))}
                {diagStep > 0 && diagStep < 4 && (
                  <div className="flex items-center gap-2 text-yellow-400 mt-2 text-[10px] animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    <span>ANALISANDO COMPILADORES ADJACENTES...</span>
                  </div>
                )}
              </div>

              {diagStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2.5 rounded"
                >
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>Navegador, Renderização e APIs: 100% de integridade estrutural.</span>
                </motion.div>
              )}

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-[9px] font-mono text-white/30">
                <span>NOGUEIRA_CONSOLE</span>
                <span>BUFFER_A1_STABLE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}