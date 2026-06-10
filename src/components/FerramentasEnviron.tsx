import { useState } from 'react';
import { motion } from 'motion/react';
import { TOOL_CATEGORIES } from '../data';
import { ToolCategory } from '../types';
import { Hammer, Lock, Eye, CheckSquare, Zap, Target } from 'lucide-react';

export default function FerramentasEnviron() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Frontend');
  const activeCategory = TOOL_CATEGORIES.find(c => c.name === selectedCategory) || TOOL_CATEGORIES[0];
  const [hoveredTool, setHoveredTool] = useState<{name: string, level: string, utility: string} | null>(null);

  return (
    <div 
      id="ambiente-ferramentas"
      className="relative min-h-screen p-6 lg:p-12 flex flex-col justify-between bg-black border-b border-white/10 tech-grid-fine"
    >
      {/* Decorative Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-1">
          // AMBIENTE 04 // ENGRENAGEM OPERACIONAL
        </span>
        <h2 className="text-4xl font-bold tracking-tight text-white font-sans">
          Ferramentas de Trabalho
        </h2>
        <p className="text-sm text-white/50 max-w-lg mt-2 font-mono">
          Nenhuma tecnologia é um troféu intelectual. São ferramentas usadas de forma tática para resolver gargalos concretos.
        </p>
      </motion.div>

      {/* Main Structural Layout (Pegboard / Grid Array) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch my-auto">
        
        {/* Left Side: Modular category navigation designed like storage racks */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-4 flex flex-col justify-center space-y-3"
        >
          <span className="font-mono text-[10px] text-white/30 tracking-wider block uppercase pl-3">
            FERRAMENTAS:
          </span>

          <div className="space-y-2 border-l border-white/10 pl-4 py-2">
            {TOOL_CATEGORIES.map((cat) => {
              const isActive = cat.name === selectedCategory;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setHoveredTool(null);
                  }}
                  className={`w-full group text-left px-4 py-3 border transition-all flex items-center justify-between select-none ${
                    isActive
                      ? 'bg-orange-500 text-black border-orange-500 font-bold'
                      : 'bg-[#0b0b0b] text-white/60 border-white/5 hover:border-white/15 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Hammer size={13} className={isActive ? 'text-black' : 'text-orange-500'} />
                    <span className="font-mono text-xs uppercase tracking-wider">{cat.name}</span>
                  </div>

                  {cat.status === 'learning' ? (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-black/10 text-black' : 'bg-orange-500/15 text-orange-500'
                    }`}>
                      COMPILANDO
                    </span>
                  ) : (
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-black/10 text-black' : 'bg-stone-800 text-white/40'
                    }`}>
                      OPERANTE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side: Active tools grid styled like technical components schematics */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
        >
          
          {/* Active grid panel */}
          <div className="border border-white/10 bg-[#0c0c0c]/80 p-6 rounded flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <span className="font-mono text-[10px] text-orange-500 tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                  <span>Estoque Ativo: {activeCategory.name}</span>
                </span>
                <span className="text-[10px] font-mono text-white/40">TOTAL: {activeCategory.items.length}</span>
              </div>

              {/* Tools display buttons array */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCategory.items.map((tool) => {
                  const isHovered = hoveredTool?.name === tool.name;
                  return (
                    <div
                      key={tool.name}
                      onMouseEnter={() => setHoveredTool(tool)}
                      onClick={() => setHoveredTool(tool)}
                      className={`p-3 border rounded transition-all cursor-pointer relative ${
                        isHovered 
                          ? 'border-orange-500 bg-orange-500/[0.03]' 
                          : 'border-white/5 bg-black hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-sm text-white tracking-wide">{tool.name}</span>
                        
                        <span className={`font-mono text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded leading-none ${
                          tool.level === 'primária'
                            ? 'text-orange-400 bg-orange-500/10'
                            : tool.level === 'avançada'
                            ? 'text-yellow-400 bg-yellow-500/10'
                            : tool.level === 'absorvendo'
                            ? 'text-blue-400 bg-blue-500/10 animate-pulse'
                            : 'text-stone-400 bg-stone-500/10'
                        }`}>
                          {tool.level}
                        </span>
                      </div>
                      
                      <p className="text-[11px] font-mono text-white/40 mt-2 truncate">
                        {tool.utility}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction tooltip */}
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-white/30 italic">
              * Clique ou passe o cursor sobre qualquer unidade de ferramenta para abrir o esquema estrutural de aplicação.
            </div>
          </div>

          {/* Interactive utility spec card on hover/click */}
          <div className="p-6 bg-[#070707] border border-white/10 rounded flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[100px] font-bold font-mono text-white/[0.01] select-none tracking-tighter leading-none pointer-events-none">
              TOOL
            </div>
            
            {hoveredTool ? (
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[9px] text-yellow-500 uppercase tracking-widest block mb-1">
                    [ ESPECIFICAÇÃO DE USO ]
                  </span>
                  <h3 className="text-2xl font-bold text-white tracking-tight pt-1">
                    {hoveredTool.name}
                  </h3>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-white/40 uppercase block">Função de Acoplamento:</span>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {hoveredTool.utility}
                  </p>
                </div>

                <div className="p-4 bg-stone-900/50 border border-white/5 rounded">
                  <span className="font-mono text-[10px] text-orange-500 uppercase block tracking-wider mb-1.5 font-bold">
                    Classificação de Controle
                  </span>
                  
                  {hoveredTool.level === 'primária' && (
                    <p className="text-xs text-white/70 leading-relaxed">
                      Linguagem/Ferramenta principal com vivência diária contínua e compreensão profunda de seus limites e ecossistemas adjacentes.
                    </p>
                  )}
                  {hoveredTool.level === 'avançada' && (
                    <p className="text-xs text-white/70 leading-relaxed">
                      Fluência nas melhores práticas e capacidade de construir fluxos produtores seguros de autoatendimento corporativos sem supervisão.
                    </p>
                  )}
                  {hoveredTool.level === 'absorvendo' && (
                    <p className="text-xs text-white/70 leading-relaxed">
                      Sendo integrado taticamente à pilha em projetos e experimentações de escala para amadurecimento lógico em ambientes de teste controlados.
                    </p>
                  )}
                  {hoveredTool.level === 'fundacional' && (
                    <p className="text-xs text-white/70 leading-relaxed">
                      Entendimento conceitual pleno do fluxo, utilizado de maneira acessória para complementar pipelines de desenvolvimento principais.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
                  <Zap size={11} />
                  <span>SISTEMA DE SEGURANÇA SEGURO</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-3">
                <Target size={36} className="text-white/20 animate-pulse" />
                <div>
                  <h4 className="font-semibold text-white/80 text-sm">Dispositivo Desconectado</h4>
                  <p className="text-xs text-white/40 mt-1 max-w-xs leading-relaxed">
                    Selecione uma especificação à esquerda para sincronizar a ficha analítica e telemetria da ferramenta.
                  </p>
                </div>
              </div>
            )}
            
            {/* Status light */}
            <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-white/40">
              <span>SITUACIONAL</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>MONITOR ESTÁVEL</span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
