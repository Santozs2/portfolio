import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useSpring, 
  useTransform, 
  useVelocity, 
  useAnimationFrame,
  useMotionValue 
} from 'motion/react';
import { Cpu, Sparkles } from 'lucide-react';
import LogoCanvasEffect from './LogoCanvasEffect'; // Importe o novo componente

export default function CentralEnviron() {
  const [currentTime, setCurrentTime] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const [inspectionActive, setInspectionActive] = useState(false);
  const [isLogoHovering, setIsLogoHovering] = useState(false);
  const [logoMousePos, setLogoMousePos] = useState({ x: -1, y: -1 });

  const [logoDimensions, setLogoDimensions] = useState({ width: 0, height: 0 });
  const logoImgRef = useRef<HTMLImageElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);

  // Lógica do Marquee Reativo ao Scroll
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  // Mapeia o valor de baseX para uma porcentagem de translação, resetando a cada 25% (pois temos 4 cópias)
  const x = useTransform(baseX, (v) => `${((v % 25) + 25) % 25 - 25}%`);
  const directionFactor = useRef<number>(1);
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * -2.5 * (delta / 1000); // Velocidade base
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1; // Inverte para a direita ao scrollar para cima
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1; // Mantém esquerda ao scrollar para baixo
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const seconds = d.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} UTF-8`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const img = logoImgRef.current;
    if (!img) return;

    const updateDimensions = () => {
      setLogoDimensions({
        width: img.offsetWidth,
        height: img.offsetHeight,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(img);
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nX = (x / rect.width) * 2 - 1;
    const nY = (y / rect.height) * 2 - 1;
    setMousePos({ x, y, normalizedX: nX, normalizedY: nY });
  };

  const handleLogoMouseMove = (e: React.MouseEvent) => {
    if (!logoImgRef.current) return; // Usar logoImgRef para posicionamento preciso em relação à imagem
    const rect = logoImgRef.current.getBoundingClientRect();
    setLogoMousePos({
      x: e.clientX - rect.left, // X do mouse relativo à imagem da logo
      y: e.clientY - rect.top, // Y do mouse relativo à imagem da logo
    });
  };

  return (
    <div
      id="ambiente-central"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden tech-grid-fine bg-[#020202] ${
        inspectionActive ? 'blueprint-outline' : ''
      }`}
    >
      {/* Background Grids and Parallax Vectors */}
      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-200 ease-out z-0"
        style={{
          transform: `translate3d(${mousePos.normalizedX * -20}px, ${mousePos.normalizedY * -20}px, 0)`,
        }}
      >
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-orange-600/[0.04] blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-yellow-500/[0.03] blur-3xl" />
      </div>

      {/* TOP DECK HEADER TILES */}
      <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-mono border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-orange-500 text-black px-1.5 py-0.5 font-bold tracking-tighter leading-none">NO-G01</span>
          <span className="text-white/40">MARCA PESSOAL DIGITAL //</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/50">
          <div className="flex items-center gap-1.5 font-mono">
            <Cpu size={12} className="text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>DP-X: {mousePos.x.toFixed(0)}</span>
          </div>


          <span className="text-yellow-400 font-bold tracking-wider">{currentTime}</span>
        </div>
      </div>

      {/* CORE ENTRANCE LAYOUT */}
      <div className="relative z-10 flex-1 flex items-center py-12">
        <div className="flex flex-col items-center justify-center w-full text-center gap-10">

          {/* NAME SECTION */}
          <div className="w-full">
            <div
              className="relative transition-transform duration-200 ease-out select-none"
              style={{
                transform: `translate3d(${mousePos.normalizedX * 12}px, ${mousePos.normalizedY * 12}px, 0)`,
              }}
            >
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 font-display text-3xl sm:text-5xl lg:text-6xl text-orange-500/15 tracking-wide -rotate-3 w-full">
                LUIS ANTONIO
              </span>
              <h1 className="text-5xl sm:text-7xl lg:text-[110px] xl:text-[130px] font-black tracking-tighter leading-[0.85] text-white my-2 uppercase">
                NOGUEIRA
              </h1>
            </div>
          </div>

          {/* LOGO SECTION (CENTRAL) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="flex justify-center items-center relative"
            style={{
              transform: `translate3d(${mousePos.normalizedX * -18}px, ${mousePos.normalizedY * -18}px, 0)`,
            }}
            // Adicionar manipuladores de eventos do mouse ao div pai
            onMouseEnter={() => setIsLogoHovering(true)}
            onMouseLeave={() => setIsLogoHovering(false)}
            onMouseMove={handleLogoMouseMove}
          >
            {/* Glow */}
            <div className="absolute w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-orange-500/[0.08] blur-[180px]" />


            {/* Shimmer sweep */}
            <motion.div
              animate={{ x: ['-150%', '150%'] }}
              transition={{ duration: 6, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
              className="absolute w-40 h-full rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl"
            />

            {/* Ambient glow pulse */}
            <motion.div
              animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.08, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-orange-500 blur-[180px]"
            />

            {/* Canvas para o efeito de partículas */}
            {logoDimensions.width > 0 && logoDimensions.height > 0 && (
              <LogoCanvasEffect
                isHovering={isLogoHovering}
                mousePosition={logoMousePos}
                logoWidth={logoDimensions.width}
                logoHeight={logoDimensions.height}
                secondaryImageSrc={icon}
              src={logo}
              alt="Nogueira"
              className="relative w-[220px] sm:w-[420px] xl:w-[520px] object-contain opacity-80 drop-shadow-[0_0_50px_rgba(255,115,0,0.25)] select-none pointer-events-none z-20" // Aumentado z-index para ficar acima do canvas
            />
          )}
          </motion.div>

          {/* DESCRIPTION SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-6 md:gap-16 text-center text-white/90 leading-snug font-light max-w-4xl"
          >
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="h-0.5 w-12 bg-orange-500/80 mb-3" />
              <p className="text-base sm:text-lg">Desenvolvendo experiências digitais marcantes hoje.</p>
              <p className="text-white/40 mt-2 text-xs font-mono max-w-xs">
                Refinando interfaces com rigor estético e lógica responsiva.
                Abominando layouts frios e corporativos.
              </p>
            </div>
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="h-0.5 w-12 bg-yellow-500/80 mb-3" />
              <p className="text-base sm:text-lg">Construindo softwares resilientes para amanhã.</p>
              <p className="text-white/40 mt-2 text-xs font-mono max-w-xs">
                A transição crua e honesta se remodelando em engenharia de
                sistemas robustos e desenvolvimento completo.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* MARQUEE BANNER */}
      <div className="relative z-10 w-full overflow-hidden border-t border-b border-white/10 py-3 bg-[#080808]">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10" />

        <motion.div 
          style={{ x }}
          className="flex font-mono text-[10px] sm:text-xs font-black uppercase text-white/50 tracking-widest gap-20 select-none whitespace-nowrap"
        >
          {Array(4).fill(
            <div className="flex gap-20 items-center">
              <span>NOGUEIRA // EVOLUÇÃO CONSTANTE</span>
              <span className="text-orange-500">*</span>
              <span>DESENVOLVEDOR WEB</span>
              <span className="text-orange-500">*</span>
              <span>ARQUITETURA FULL-STACK</span>
              <span className="text-orange-500">*</span>
              <span>ENGENHARIA DE SOFTWARE</span>
              <span className="text-yellow-500">*</span>
            </div>
          ).map((item, idx) => (
            <React.Fragment key={idx}>{item}</React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* BOTTOM TELEMETRY RAIL */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] font-mono pt-4 text-white/40">
        <div className="flex items-center gap-6">
          <div className="flex gap-1 items-center">
            <Sparkles size={11} className="text-orange-500" />
            <span>FÉ CRÍTICA // DESIGN DE ALTA FIDELIDADE</span>
          </div>
          <span>SÃO PAULO, BRASIL</span>
        </div>
      </div>
    </div>
  );
}