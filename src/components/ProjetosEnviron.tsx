import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  Keyboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image1 from "../assets/images/oportuna.jpg";
import Image2 from "../assets/images/amorecacau.jpg";
import Image3 from "../assets/images/amorecacau2.jpg";
import Image4 from "../assets/images/amorecacau3.jpg";
import Image5 from "../assets/images/oportuna2.jpg";
import Image6 from "../assets/images/oportuna3.jpg";
import Image7 from "../assets/images/icefrost.png";
import Image8 from "../assets/images/icefrost2.png";
import Image9 from "../assets/images/icefrost3.png";
import Image10 from "../assets/images/cadastro_maquina.png";
import Image11 from "../assets/images/cadastro_maquina2.png";
import Image12 from "../assets/images/cadastro_maquina3.png";

interface Project {
  id: string;
  codeName: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  category: string;
  year: string;
  highlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  accentColor: string;
  previewGradient: string;
  previewPattern: 'grid' | 'circuit' | 'wave' | 'matrix';
  images?: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'proj-01',
    codeName: 'opor-con',
    title: 'Oportuna Conecta',
    subtitle: 'Sistema de Matching entre alunos e vagas',
    description:
      'Experiência web imersiva construída como um ambiente de controle de missão. Cada seção é um "ambiente" separado com camadas de paralaxe, efeitos cinéticos e interatividade de terminal.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    category: 'Frontend / Design de Interação',
    year: '2026',
    highlights: [
      'Efeito de paralaxe reativo ao cursor com precisão sub-pixel',
      'Scanline imersivo de 60fps sem impacto no thread principal',
      'Dock de navegação flutuante com detecção de scroll ativo',
    ],
    liveUrl: '',
    githubUrl: 'https://github.com/Santozs2/oportuna-conecta',
    accentColor: 'orange',
    previewGradient: 'from-orange-950/80 via-stone-950 to-black',
    previewPattern: 'grid',
    images: [
      Image1,
      Image5,
      Image6
    ],
  },
  {
    id: 'proj-02',
    codeName: 'amr-cacau',
    title: 'Amor e Cacau',
    subtitle: 'E-commerce de Chocolates Artesanais',
    description:
      'E-commerce completo para confeitaria artesanal, desenvolvido com React, TypeScript e Supabase. Conta com catálogo de produtos por categorias, carrinho de compras, checkout com cálculo de frete via CEP, pagamento via PIX com QR Code, histórico de pedidos e painel administrativo com dashboard de vendas, gestão de produtos e exportação de dados em CSV.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite'],
    category: 'Frontend / Backend',
    year: '2026',
    highlights: [
      'Implementação de um sistema robusto de carrinho de compras com gerenciamento de estado local e persistência em localStorage para carrinho abandonado.',
      'Integração com Correios API para cálculo preciso de frete baseado no CEP do cliente e peso/dimensões dos produtos.',
      'Geração de QR Code para pagamento instantâneo via PIX, com confirmação automática de pagamento via webhook do Mercado Pago.',
    ],
    liveUrl: 'https://amor-cacau.onrender.com',
    githubUrl: 'https://github.com/Santozs2/amor-cacau',
    accentColor: 'yellow',
    previewGradient: 'from-yellow-950/60 via-stone-950 to-black',
    previewPattern: 'circuit',
    images: [
      Image2,
      Image3,
      Image4
    ],
  },
  {
    id: 'proj-03',
    codeName: 'ice-frost',
    title: 'ICE FROST',
    subtitle: 'Sorveteria Artesanal',
    description:
      'Gestor de uma sorveteria desenvolvido com Django e MySql lite 3. O sistema inclui cadastro de sorvetes, fornecedores, etc. O projeto foi criado para uma avaliação formativa de Django do meu curso técnico.',
    stack: ['Django', 'MySql lite 3'],
    category: 'Backend / Frontend',
    year: '2026',
    highlights: [
      'Gestor de sorveteria com cadastro de produtos, fornecedores e estoque.',
      'Dashboard administrativo com relatórios de vendas e gestão de produtos.',
      'Projeto acadêmico desenvolvido para avaliação formativa de Django.',
    ],
    liveUrl: '',
    githubUrl: 'https://github.com/Santozs2/icefrost',
    accentColor: 'blue',
    previewGradient: 'from-blue-950/60 via-stone-950 to-black',
    previewPattern: 'wave',
    images: [
      Image7,
      Image8,
      Image9,
    ],
  },
  {
    id: 'proj-04',
    codeName: 'cad-maq',
    title: 'Cadastro de Máquina',
    subtitle: 'Sistema de cadastro e gerenciamento de máquinas',
    description:
      'Este projeto foi desenvolvido para um simulado da SAEP, Sistema de Avaliação de Educação Profissional, para o curso de Desenvolvimento de Sistemas, foi desenvolvido em Django e MySql lite 3',
    stack: ['Django', 'MySql lite 3'],
    category: 'Backend / Frontend',
    year: '2026',
    highlights: [
      'Desenvolvimento em Django e MySql lite 3',
      'Simulado da SAEP, Sistema de Avaliação de Educação Profissional',
      'Projeto acadêmico desenvolvido para avaliação formativa de Django.',
    ],
    liveUrl: '', 
    githubUrl: 'https://github.com/Santozs2/cadastro-maquinas',
    accentColor: 'emerald',
    previewGradient: 'from-emerald-950/60 via-stone-950 to-black',
    previewPattern: 'matrix',
    images: [
      Image10,
      Image11,
      Image12,
    ],
  },
];

const accentMap: Record<string, { text: string; border: string; bg: string; rgb: string }> = {
  orange: { text: 'text-orange-400', border: 'border-orange-500', bg: 'bg-orange-500', rgb: '249,115,22' },
  yellow: { text: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-500', rgb: '234,179,8' },
  blue:   { text: 'text-blue-400',   border: 'border-blue-500',   bg: 'bg-blue-500',   rgb: '59,130,246' },
  emerald:{ text: 'text-emerald-400',border: 'border-emerald-500',bg: 'bg-emerald-500',rgb: '16,185,129' },
};



// ─── Carousel Preview ──────────────────────────────────────────
function ImageCarousel({ project }: { project: Project }) {
  const images = project.images;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="absolute inset-0 w-full h-full opacity-80 bg-black/20 flex items-center justify-center text-white/30 text-xs font-mono">Sem Imagens</div>;
  }

  return (
    <div className="absolute inset-0 w-full h-full group z-0">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-contain p-2"
          alt={`${project.title} Preview`}
        />
      </AnimatePresence>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-black/80 z-20"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-black/80 z-20"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/40 px-2 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {images.map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export default function ProjetosEnviron() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState<1|-1>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const total = PROJECTS.length;

  // Touch / swipe state
  const touchStartX = useRef<number | null>(null);
  const sectionRef  = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    if (isAnimating || idx === activeIndex) return;
    setDirection(idx > activeIndex ? 1 : -1);
    setIsAnimating(true);
    setActiveIndex(idx);
    setTimeout(() => setIsAnimating(false), 380);
  }, [isAnimating, activeIndex]);

  const prev = useCallback(() => goTo((activeIndex - 1 + total) % total), [activeIndex, goTo, total]);
  const next = useCallback(() => goTo((activeIndex + 1) % total), [activeIndex, goTo, total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Only trigger if the section is near viewport
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const project = PROJECTS[activeIndex];
  const accent  = accentMap[project.accentColor] ?? accentMap.orange;

  return (
    <div
      id="ambiente-laboratorio"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col bg-[#030303] border-b border-white/10 tech-grid-fine overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Accent top bar — color shifts with project */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-700 opacity-40"
        style={{ background: `linear-gradient(to right, transparent, rgb(${accent.rgb}), transparent)` }}
      />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 p-6 lg:p-12 pb-4"
      >
        <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-1">
          // AMBIENTE 03 // LABORATÓRIO DE PROJETOS
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <h2 className="text-4xl font-bold tracking-tight text-white font-sans">
            Projetos Construídos
          </h2>
          {/* Keyboard hint — desktop only */}
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-[16px] text-white/20 pb-1 select-none">
            <Keyboard size={11} />
            <span>← → para navegar</span>
          </div>
        </div>
        <p className="text-sm text-white/50 max-w-lg mt-2 font-mono">
          Cada sistema carrega uma intenção. Nenhum projeto genérico. Nenhum tutorial seguido cegamente.
        </p>
      </motion.div>

      {/* ── Mobile: horizontal tab strip ─────────────────────────── */}
      <div className="lg:hidden relative z-10 px-6 mb-4">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {PROJECTS.map((p, i) => {
            const a = accentMap[p.accentColor] ?? accentMap.orange;
            const isActive = i === activeIndex;
            return (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`shrink-0 flex flex-col gap-0.5 px-4 py-2.5 border rounded-sm transition-all cursor-pointer text-left ${
                  isActive
                    ? `${a.border} bg-white/[0.03]`
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <span className={`font-mono text-[9px] tracking-widest ${isActive ? a.text : 'text-white/30'}`}>
                  {p.codeName}
                </span>
                <span className={`font-sans text-xs font-semibold ${isActive ? 'text-white' : 'text-white/50'}`}>
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main layout: sidebar + preview + details ─────────────── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 px-6 lg:px-0 pb-10 items-stretch">

        {/* ── LEFT SIDEBAR: project list ─── (desktop only) ─────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hidden lg:flex lg:col-span-3 flex-col justify-center border-r border-white/10 pl-12 pr-6 py-4 gap-1"
        >
          <span className="font-mono text-[10px] text-white/25 tracking-wider uppercase mb-3 block">
            Selecionar Projeto:
          </span>

          {PROJECTS.map((p, i) => {
            const a       = accentMap[p.accentColor] ?? accentMap.orange;
            const isActive = i === activeIndex;

            return (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`group relative w-full text-left px-4 py-3.5 border-l-2 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `${a.border} bg-white/[0.025]`
                    : 'border-white/10 hover:border-white/25 hover:bg-white/[0.015]'
                }`}
              >
                {/* Active glow strip */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(to right, rgba(${a.rgb},0.06), transparent)` }}
                  />
                )}

                <div className="relative flex flex-col gap-1">
                  {/* Code name */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono text-[9px] tracking-widest transition-colors ${
                      isActive ? a.text : 'text-white/25 group-hover:text-white/40'
                    }`}>
                      {p.codeName}
                    </span>
                  </div>

                  {/* Project title */}
                  <span className={`font-sans text-sm font-semibold leading-snug transition-colors ${
                    isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                  }`}>
                    {p.title}
                  </span>

                  {/* Category */}
                  <span className={`font-mono text-[10px] transition-colors ${
                    isActive ? 'text-white/40' : 'text-white/20 group-hover:text-white/30'
                  }`}>
                    {p.category}
                  </span>
                </div>

                {/* Progress indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className={`absolute left-0 top-0 bottom-0 w-[2px] ${a.bg}`}
                    style={{ originY: 0 }}
                  />
                )}
              </button>
            );
          })}

          {/* Counter */}
          <div className="mt-4 font-mono text-[10px] text-white/20 pl-4">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} projetos
          </div>
        </motion.div>

        {/* ── CENTER: Canvas Preview ────────────────────────────── */}
        <div className="lg:col-span-4 flex items-center justify-center lg:p-8">
          <div className="relative w-full h-64 lg:h-[400px] overflow-hidden rounded border border-white/10">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className={`absolute inset-0 bg-gradient-to-br ${project.previewGradient}`}
              >
                <ImageCarousel project={project} />



                {/* Year */}
                <div className="absolute top-3 right-3 font-mono text-[10px] text-white/40 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  {project.year}
                </div>

                {/* Stack pills */}
                <div className="absolute bottom-8 left-3 right-3 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 3).map(tech => (
                    <span key={tech} className="font-mono text-[9px] px-2 py-0.5 bg-black/70 border border-white/10 text-white/60 rounded backdrop-blur-sm">
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 3 && (
                    <span className="font-mono text-[9px] px-2 py-0.5 bg-black/70 border border-white/10 text-white/40 rounded">
                      +{project.stack.length - 3}
                    </span>
                  )}
                </div>

                {/* Code name watermark */}
                <div className="absolute bottom-2 right-3 font-mono text-[10px] text-white/15 tracking-widest select-none">
                  {project.codeName}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: Project Details ────────────────────────────── */}
        <div className="lg:col-span-5 flex items-center lg:pr-12 lg:pl-2 mt-6 lg:mt-0">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={project.id + '-details'}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.32, ease: 'easeOut', delay: 0.04 }}
              className="w-full flex flex-col gap-5"
            >
              {/* Title */}
              <div>
                <span className={`font-mono text-[10px] tracking-widest uppercase ${accent.text}`}>
                  {project.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-white/50 font-mono mt-0.5">{project.subtitle}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed">
                {project.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider block">
                  Destaques Técnicos:
                </span>
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className={`mt-[5px] w-1 h-1 rounded-full shrink-0 ${accent.bg}`} />
                    <span className="text-xs text-white/60 leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>

              {/* Full stack */}
              <div className="flex flex-wrap gap-2">
                {project.stack.map(tech => (
                  <span
                    key={tech}
                    className={`font-mono text-[10px] px-2.5 py-1 border rounded ${accent.text} ${accent.border} opacity-60`}
                    style={{ backgroundColor: `rgba(${accent.rgb},0.04)`, borderColor: `rgba(${accent.rgb},0.2)` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action links */}
              <div className="flex items-center gap-3 flex-wrap">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-2 font-mono text-xs px-4 py-2 border rounded transition-all cursor-pointer ${accent.border} ${accent.text}`}
                    style={{ background: `rgba(${accent.rgb},0.06)` }}
                  >
                    <ExternalLink size={12} />
                    <span>VER PROJETO</span>
                    <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 font-mono text-xs px-4 py-2 border border-white/10 text-white/50 hover:border-white/30 hover:text-white rounded transition-all cursor-pointer"
                  >
                    <Github size={12} />
                    <span>ACESSÁ-LO NO GITHUB</span>
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/3 right-0 w-[500px] h-[500px] blur-3xl opacity-[0.04] transition-all duration-1000 rounded-full"
        style={{ background: `rgb(${accent.rgb})` }}
      />
    </div>
  );
}
