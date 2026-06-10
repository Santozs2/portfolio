import { useState } from 'react';
import { motion } from 'motion/react';
import { FUTURE_GOALS } from '../data';
import { ArrowRight, Cpu, Compass, Milestone, Rocket } from 'lucide-react';

export default function ProximaVersaoEnviron() {
  const [activeGoalIdx, setActiveGoalIdx] = useState<number>(0);
  const currentGoal = FUTURE_GOALS[activeGoalIdx];

  return (
    <div 
      id="ambiente-proxima-versao"
      className="relative min-h-screen p-6 lg:p-12 flex flex-col justify-between bg-stone-950 border-b border-white/10 tech-grid-fine"
    >
      {/* Target Dot Accent decor */}
      <div className="absolute top-10 right-10 flex items-center gap-1.5 font-mono text-[9px] text-orange-500/80">
        <Cpu size={12} className="animate-spin text-orange-500" style={{ animationDuration: '4s' }} />
        <span>COMPILADOR_FUTURO_LINKED</span>
      </div>

      {/* Main visual manifesto & text block */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        
        {/* Left Side: Bold Big Quote (Cinematic/Poster Style) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 space-y-6"
        >
          <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block">
            // AMBIENTE 05 // SOBRE MIM
          </span>
          
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
            Não estou tentando chegar ao próximo nível.
            <span className="block mt-1 text-orange-500 glow-orange-text">Estou construindo ele.</span>
          </h2>
          
          <p className="text-base text-white/60 max-w-lg leading-relaxed font-light">
            Meu nome é <span className='text-orange-500 font-bold'>Luis Antonio dos Santos Nogueira</span>, tenho 17 anos, curso Desenvolvimento de Sistemas no SENAI-SP, sou uma pessoa criativa, comunicativa e estudiosa, procuro sempre aprender coisas novas e me desenvolver como pessoa e como profissional.
          </p>

          <div className="border border-white/10 p-4 bg-black rounded max-w-sm flex items-center gap-4">
            <Compass className="text-yellow-500 shrink-0" size={24} />
            <div className="font-mono text-xs">
              <span className="text-white font-semibold">Sistemas Distribuídos & Clean Tech</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Interactive Objectives / Build Targets */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col justify-between bg-black border border-white/10 p-6 sm:p-8 rounded relative overflow-hidden"
        >
          {/* Hex top ribbon index */}
          <div className="absolute top-0 left-0 w-24 h-[2px] bg-yellow-500" />
          
          <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
            <span className="font-mono text-[10px] text-yellow-500 tracking-wider uppercase flex items-center gap-1.5 font-bold">
              <Rocket size={12} className="text-orange-500" />
              <span>Metas para 2026-2027</span>
            </span>
            <span className="font-mono text-[9px] text-white/30">TARGET: V2.PROD</span>
          </div>

          {/* Goals Mini Switcher */}
          <div className="flex gap-2 mb-6">
            {FUTURE_GOALS.map((goal, idx) => {
              const isActive = idx === activeGoalIdx;
              return (
                <button
                  key={goal.codeName}
                  onClick={() => setActiveGoalIdx(idx)}
                  className={`font-mono text-[11px] px-3.5 py-1.5 border transition-all ${
                    isActive 
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-bold' 
                      : 'border-white/5 bg-stone-900/40 text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {goal.codeName}
                </button>
              );
            })}
          </div>

          {/* Goal Content */}
          <div className="space-y-6">
            <div>
              <span className="font-mono text-[9px] text-white/40 block uppercase">OBJETIVO:</span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1">{currentGoal.title}</h3>
              <p className="font-mono text-[10px] text-orange-500 mt-1">CRONOGRAMA ESTIMADO: {currentGoal.timeframe}</p>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              {currentGoal.description}
            </p>

            {/* Steps checklists */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <span className="font-mono text-[9px] text-white/40 block uppercase">MILÉSIMOS DE CONSTRUÇÃO (BLINDADOS):</span>
              
              <div className="space-y-2">
                {currentGoal.milestones.map((ms, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center rounded border border-white/10 bg-stone-900 font-mono text-[9px] text-yellow-500 shrink-0">
                      0{idx + 1}
                    </div>
                    <p className="text-xs text-white/80 leading-snug">
                      {ms}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom interactive action card */}
          <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] font-mono text-white/40">
            <div className="flex items-center gap-1">
              <Milestone size={11} className="text-orange-500" />
              <span>META ATIVA: {currentGoal.codeName}</span>
            </div>
            <span>CONFORMIDADE: AGUARDANDO REQUISITOS</span>
          </div>
        </motion.div>

      </div>

      {/* FOOTER METRIC BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full mt-10 p-4 border border-white/5 bg-black flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-white/40"
      >
        <div className="flex gap-4">
          <span>ALCANCE: SISTEMAS AGNOS</span>
          <span className="text-orange-500">//</span>
          <span>ARQUITETURA RESILIENTE</span>
        </div>
      </motion.div>
    </div>
  );
}
