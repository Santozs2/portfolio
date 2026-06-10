import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MILESTONES } from '../data';
import { Milestone } from '../types';
import { Calendar, Layers, ShieldCheck, Cpu, Code2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function JornadaEnviron() {
  const [selectedId, setSelectedId] = useState<string>('react');
  const activeMilestone = MILESTONES.find(m => m.id === selectedId) || MILESTONES[3];

  return (
    <div 
      id="ambiente-jornada"
      className="relative min-h-screen p-6 lg:p-12 flex flex-col justify-between border-y border-white/10 tech-grid-fine bg-black"
    >
      {/* Decorative Technical Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:flex md:justify-between md:items-end mb-10"
      >
        <div>
          <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-1">
            // AMBIENTE 02 // LINHA REATIVA DO TEMPO
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-white font-sans">
            Jornada de Evolução
          </h2>
          <p className="text-sm text-white/50 max-w-lg mt-2 font-mono">
            Acompanhe a metamorfose: do domínio da interface semântica ao desenho de engenharia de software distribuído.
          </p>
        </div>
        
        {/* Status Indicator Map */}
        <div className="mt-4 md:mt-0 flex gap-4 font-mono text-[10px] text-white/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
            <span>ESTÁVEL (COMPLETO)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm animate-pulse" />
            <span>ESTUDANDO</span>
          </div>
        </div>
      </motion.div>

      {/* Main Experience Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto">
        
        {/* Left Side: Milestones list/selector (Radial or Technical Flow) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col justify-center space-y-2"
        >
          <div className="font-mono text-[11px] text-white/30 uppercase tracking-widest mb-3 pl-3">
            Selecione uma fase evolutiva:
          </div>
          
          <div className="relative border-l border-white/10 pl-3 sm:pl-6 space-y-3 py-4">
            {MILESTONES.map((milestone, idx) => {
              const isActive = milestone.id === selectedId;
              const isFuture = milestone.status === 'futuro';
              const isFocus = milestone.status === 'foco';
              
              return (
                <div 
                  key={milestone.id}
                  onClick={() => setSelectedId(milestone.id)}
                  className={`group relative text-left py-2 px-3 rounded-md transition-all cursor-pointer select-none flex items-center justify-between ${
                    isActive 
                      ? 'bg-orange-500/10 border border-orange-500/30' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {/* Glowing vertical slider block */}
                  {isActive && (
                    <div className="absolute left-[-15px] sm:left-[-27px] top-1/2 -translate-y-1/2 w-[5px] h-[30px] bg-orange-500 glow-orange" />
                  )}

                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs w-5 text-right ${isActive ? 'text-orange-500 font-bold' : 'text-white/30 group-hover:text-white/60'}`}>
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className={`text-sm font-semibold tracking-wide transition-colors ${
                        isActive ? 'text-orange-400' : 'text-white/70 group-hover:text-white'
                      }`}>
                        {milestone.title}
                      </h4>
                      <p className="text-[10px] font-mono text-white/30 group-hover:text-white/40">
                        {milestone.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-white/30 bg-white/5 group-hover:bg-white/10 px-1.5 py-0.5 rounded leading-none">
                      {milestone.year}
                    </span>
                    {isFocus ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
                    ) : milestone.status === 'completo' ? (
                      <CheckCircle2 size={12} className="text-emerald-500" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-700" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side: Detailed card for selected Milestone */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-between bg-stone-900/30 border border-white/5 p-6 lg:p-8 relative overflow-hidden flex-1"
        >
          {/* Subtle decor markings */}
          <div className="absolute top-0 right-0 text-[60px] font-bold font-sans text-white/[0.015] leading-none select-none select-none pl-4 pt-1">
            {activeMilestone.year}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-yellow-500 border border-yellow-500/30 bg-yellow-500/5 px-2 py-0.5 rounded uppercase">
                      FASE: {activeMilestone.category}
                    </span>
                    <span className={`font-mono text-[10px] uppercase border px-2 py-0.5 rounded ${
                      activeMilestone.status === 'completo' 
                        ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' 
                        : 'text-orange-400 border-orange-500/20 bg-orange-500/5'
                    }`}>
                      {activeMilestone.status === 'completo' ? 'SISTEMA COMPILADO' : 'FOCO DE EVOLUÇÃO'}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                    {activeMilestone.title}
                    <span className="text-orange-500 font-light text-xl">//</span>
                    <span className="text-white/60 text-base font-light">{activeMilestone.subtitle}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded">
                  <Calendar size={13} className="text-orange-500" />
                  <span>INTEGRADO EM {activeMilestone.year}</span>
                </div>
              </div>

              {/* Description Statement */}
              <p className="text-sm sm:text-base leading-relaxed text-white/80">
                {activeMilestone.description}
              </p>

              {/* Problem/Challenge & Physical Impact Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Desafio Superado */}
                <div className="p-4 bg-black/40 border border-white/5 rounded">
                  <span className="font-mono text-[10px] text-orange-500 uppercase tracking-widest block mb-1">
                    [ DESAFIO SUPERADO ]
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {activeMilestone.challengeSolved}
                  </p>
                </div>

                {/* Impacto Técnico */}
                <div className="p-4 bg-black/40 border border-white/5 rounded">
                  <span className="font-mono text-[10px] text-yellow-500 uppercase tracking-widest block mb-1">
                    [ RETORNO ESTÁVEL ]
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {activeMilestone.technicalImpact}
                  </p>
                </div>
              </div>

              {/* Code Snippet Box IF available */}
              {activeMilestone.codeSnippet && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                    <Code2 size={12} className="text-orange-500" />
                    <span>Visualização de Registro Técnico:</span>
                  </span>
                  <div className="w-full bg-black border border-white/10 rounded p-4 font-mono text-[11px] text-orange-400 overflow-x-auto select-all leading-normal">
                    <pre className="whitespace-pre">{activeMilestone.codeSnippet}</pre>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* FOOTER DIAL TRACK */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full mt-10 p-4 border border-white/5 bg-[#090909] text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40"
      >
        <div className="flex items-center gap-2">
          <Layers size={13} className="text-orange-500" />
          <span>EVOLUÇÃO CONTÍNUA</span>
        </div>
        <div>
          <span>RECURSOS COMPLETOS: 7</span>
          <span className="text-orange-500 ml-2">//</span>
          <span className="text-white/60 ml-2">EM CONDUÇÃO: 2</span>
        </div>
      </motion.div>
    </div>
  );
}
