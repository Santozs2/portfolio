import { useState, useEffect } from 'react';
import { Settings, Cpu, RefreshCw, Layers, CheckCircle2, Terminal } from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  num: string;
}

export default function ControlDesk() {
  const [activeTab, setActiveTab] = useState('ambiente-central');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagStep, setDiagStep] = useState<number>(0);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const ids = [
        'ambiente-central',
        'ambiente-jornada',
        'ambiente-laboratorio',
        'ambiente-ferramentas',
        'ambiente-proxima-versao',
        'ambiente-contato'
      ];
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { id: 'ambiente-central', name: 'Central', num: '01' },
    { id: 'ambiente-proxima-versao', name: 'Sobre Mim', num: '02' },
    { id: 'ambiente-jornada', name: 'Jornada', num: '03' },
    { id: 'ambiente-laboratorio', name: 'Projetos', num: '04' },
    { id: 'ambiente-ferramentas', name: 'Ferramentas', num: '05' },
    { id: 'ambiente-contato', name: 'Contato', num: '07' }
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
    }
  };

  const triggerDiagnosticCycle = () => {
    setShowDiagnostics(true);
    setDiagStep(1);
    setSystemLogs(['[MESA_CONTROLE] Inicializando diagnósticos integrados...']);

    setTimeout(() => {
      setDiagStep(2);
      setSystemLogs(prev => [
        ...prev,
        '[GPU] Calculando latência de animações... Perfeito (60.0 fps)',
        '[BROWSER] Verificando suporte OpenGL/CSS Grid... Conforme'
      ]);
    }, 600);

    setTimeout(() => {
      setDiagStep(3);
      setSystemLogs(prev => [
        ...prev,
        '[DATABASE] Sincronização offline ativa local storage',
        '[WAL ENGINE] Diário de transações idempotente montado!'
      ]);
    }, 1250);

    setTimeout(() => {
      setDiagStep(4);
      setSystemLogs(prev => [
        ...prev,
        '[SISTEMA_DNG] Todos os parâmetros operacionais estão verdes! Pronto para navegação.'
      ]);
    }, 2000);
  };

  return (
    <>
      {/* Bottom Floating Control Panel - Subtle Technical Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#090909]/90 border border-white/10 px-3 py-2.5 rounded-full flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur max-w-[95%] overflow-x-auto whitespace-nowrap">
        
        {/* Diagnostics Trigger Switch */}
        <button
          onClick={triggerDiagnosticCycle}
          title="Verificar Integridade do Sistema"
          className="p-2 border border-white/10 rounded-full hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-400 cursor-pointer transition-colors"
        >
          <Cpu size={14} className="animate-pulse" />
        </button>

        <span className="w-[1px] h-4 bg-white/15" />

        {/* Dynamic Nav Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 rounded-full font-mono text-[10px] sm:text-xs transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                  isActive 
                    ? 'bg-orange-500 text-black font-bold' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`text-[8px] ${isActive ? 'text-black/50' : 'text-orange-500/80 font-bold'}`}>{item.num}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagnostics Modal Window */}
      {showDiagnostics && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-stone-950 border-2 border-white/15 p-6 rounded max-w-md w-full relative overflow-hidden">
            {/* Design detail ribbons */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-yellow-500" />

            <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
              <span className="font-mono text-[10px] text-yellow-500 flex items-center gap-1.5 font-bold uppercase">
                <Terminal size={12} className="text-orange-500" />
                <span>DIAGNÓSTICOS GERAIS : EXECUÇÃO</span>
              </span>
              <button 
                onClick={() => { setShowDiagnostics(false); setDiagStep(0); }}
                className="font-mono text-[10px] text-white/50 hover:text-white cursor-pointer"
              >
                FECHAR [X]
              </button>
            </div>

            {/* Simulated Live Output Stream */}
            <div className="bg-black border border-white/10 p-4 font-mono text-[11px] text-orange-500 rounded min-h-[160px] space-y-1.5 max-h-[220px] overflow-y-auto">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-white/30">&gt;&gt;</span> {log}
                </div>
              ))}
              
              {diagStep > 0 && diagStep < 4 && (
                <div className="flex items-center gap-2 text-yellow-400 mt-2 text-[10px] animate-pulse">
                  <RefreshCw size={10} className="animate-spin" />
                  <span>ANALISANDO COMPILADORES ADJACENTES...</span>
                </div>
              )}
            </div>

            {/* Diagnostic Completion Message */}
            {diagStep === 4 && (
              <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2.5 rounded">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Navegador, Renderização e APIs aprovadas com 100% de integridade estrutural.</span>
              </div>
            )}

            {/* Foot note */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/40">
              <span>NOGUEIRA_CONSOLE</span>
              <span>BUFFER_A1_STABLE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
