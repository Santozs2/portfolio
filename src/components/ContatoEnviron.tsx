import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Terminal, Mail, Linkedin, Github, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export default function ContatoEnviron() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [transmissionState, setTransmissionState] = useState<'idle' | 'transmitting' | 'done'>('idle');
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setTransmissionState('transmitting');
    setTransmissionLogs([
      'SINC-01: Abrindo canal reativo via protocolo HTTPS...',
    ]);

    try {
      // 1. Inicia o envio
      const responsePromise = fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "SUA_CHAVE_AQUI",
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `Novo Contato do Portfólio de ${form.name}`,
        }),
      });

      // 2. Animações de log para UX
      setTimeout(() => {
        setTransmissionLogs(prev => [
          ...prev,
          'SINC-02: Estabelecendo handshake com servidor seguro...',
        ]);
      }, 600);

      setTimeout(() => {
        setTransmissionLogs(prev => [
          ...prev,
          `SINC-03: Serializando remetente: <${form.name.substring(0, 15)}>...`,
        ]);
      }, 1200);

      const response = await responsePromise;
      const result = await response.json();

      setTimeout(() => {
        if (result.success) {
          setTransmissionLogs(prev => [
            ...prev,
            'SINC-04: Transmitindo bloco assíncrono (Status: 200 SUCCESS)...',
          ]);
          setTransmissionState('done');
        } else {
          setTransmissionLogs(prev => [
            ...prev,
            'SINC-ERR: Falha na transmissão. Verifique a chave de acesso.',
          ]);
          setTimeout(() => setTransmissionState('idle'), 4000);
        }
      }, 2000);

    } catch (error) {
      setTransmissionLogs(prev => [
        ...prev,
        'SINC-ERR: Falha de rede. O servidor não respondeu.',
      ]);
      setTimeout(() => setTransmissionState('idle'), 4000);
    }
  };

  const handleReset = () => {
    setForm({ name: '', email: '', message: '' });
    setTransmissionState('idle');
    setTransmissionLogs([]);
  };

  return (
    <div 
      id="ambiente-contato"
      className="relative min-h-screen p-6 lg:p-12 flex flex-col justify-between bg-black tech-grid-fine"
    >
      {/* Laser Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="font-mono text-xs text-orange-500 tracking-widest uppercase block mb-1">
          // AMBIENTE 06 // CANAL DE SINAL
        </span>
        <h2 className="text-4xl font-bold tracking-tight text-white font-sans">
          Estação de Contato
        </h2>
        <p className="text-sm text-white/50 max-w-lg mt-2 font-mono">
          Sem barreiras ou formulários frios. Vamos discutir arquitetura, produtos digitais marcantes ou propostas de evolução.
        </p>
      </motion.div>

      {/* Main split: contact details vs transmitter */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto w-full">
        
        {/* Left Side: Direct coordinates */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col justify-center space-y-8"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              Vamos construir algo juntos.
            </h3>
          </div>

          <div className="space-y-4 font-mono text-xs text-white/70">
            {/* Coordinates link */}
            <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded flex items-center gap-3">
              <Mail className="text-orange-500 shrink-0" size={16} />
              <div>
                <span className="text-white/40 block">Email</span>
                <a href="mailto:sn.luisantonio24@gmail.com" className="text-white hover:text-orange-400 transition-colors">
                  sn.luisantonio24@gmail.com
                </a>
              </div>
            </div>

            {/* Social channels */}
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="https://github.com/Santozs2" 
                target="_blank" 
                rel="noreferrer"
                className="p-3 bg-[#0a0a0a] border border-white/5 rounded flex items-center gap-2 hover:border-white/20 hover:bg-neutral-900/40 transition-all text-white/80 hover:text-white"
              >
                <Github size={14} className="text-orange-400" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/luis-antonio-dos-santos-nogueira-52980634b/" 
                target="_blank" 
                rel="noreferrer"
                className="p-3 bg-[#0a0a0a] border border-white/5 rounded flex items-center gap-2 hover:border-white/20 hover:bg-neutral-900/40 transition-all text-white/80 hover:text-white"
              >
                <Linkedin size={14} className="text-orange-400" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side: The Secure Transmitter */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 bg-[#080808] border border-white/10 p-6 sm:p-8 rounded relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-24 h-[2px] bg-yellow-500" />

          {/* Transmitter Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="font-mono text-[10px] text-yellow-500 tracking-wider uppercase flex items-center gap-1.5 font-bold">
              <Terminal size={12} className="text-orange-500 animate-pulse" />
              <span>CONTATO</span>
            </span>
            <span className="font-mono text-[9px] text-white/30 text-right uppercase">
              RELAÇÃO: ENCRYPTED
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center py-6 min-h-[300px]">
            {transmissionState === 'idle' && (
              <form onSubmit={handleTransmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] font-mono text-white/45 uppercase tracking-wide mb-1.5">Emitente (Seu Nome):</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex: Lando Norris"
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="contact-email" className="block text-[10px] font-mono text-white/45 uppercase tracking-wide mb-1.5">Endereço de Resposta (E-mail):</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Ex: lando@mclaren.com"
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="contact-message" className="block text-[10px] font-mono text-white/45 uppercase tracking-wide mb-1.5">Escopo da Mensagem:</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Descreva o problema, o escopo ou os objetivos técnicos..."
                    className="w-full bg-black border border-white/10 px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-black font-semibold font-mono text-xs px-6 py-3 rounded flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                >
                  <Send size={12} />
                  <span>ENVIAR E-MAIL</span>
                </button>
              </form>
            )}

            {transmissionState === 'transmitting' && (
              <div className="space-y-6 py-6 text-center">
                <div className="flex justify-center">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <Cpu size={28} className="text-orange-500 animate-spin" />
                  </div>
                </div>
                
                <div className="max-w-md mx-auto bg-black p-4 border border-white/10 rounded font-mono text-left text-[11px] text-yellow-400 space-y-1">
                  {transmissionLogs.map((log, idx) => (
                    <div key={idx} className="truncate">
                      <span className="text-white/40">&gt;&gt;</span> {log}
                    </div>
                  ))}
                </div>

                <p className="font-mono text-[9px] text-white/30 animate-pulse uppercase">
                  Enviando seu email... Por favor, mantenha a comunicação aberta.
                </p>
              </div>
            )}

            {transmissionState === 'done' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-6 text-center max-w-md mx-auto"
              >
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 bg-emerald-500/5 mx-auto flex items-center justify-center">
                  <Sparkles size={20} className="text-emerald-400" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">Email Enviado com Sucesso!</h4>
                  <p className="text-xs text-white/50 mt-1 font-mono">
                    Sua mensagem foi enviada. Respondo em até 24 horas úteis.
                  </p>
                </div>

                <div className="p-4 bg-stone-900/50 border border-white/5 rounded text-left font-mono text-[11px] text-emerald-400">
                  <div className="text-white/40">TRANSMISSÃO CONFIRMADA</div>
                  <div className="text-xs pt-1">Mensagem entregue com sucesso.</div>
                </div>
                
                <button
                  onClick={handleReset}
                  className="font-mono text-[16px] text-white/40 hover:text-white underline"
                >
                  Enviar Novo Email
                </button>
              </motion.div>
            )}
          </div>

          {/* Footer transmitter info */}
          <div className="border-t border-white/5 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[9px] font-mono text-white/40 gap-2">
            <span>TERMINAL CONTATO L3-TX</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>SINAL VERIFICADO CONTÍNUO</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* FOOTER GENERAL */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full mt-12 p-4 border border-white/5 bg-[#070707] flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-white/30 gap-4"
      >
        <div>NOGUEIRA // © {new Date().getFullYear()} Todos os direitos salvos em código.</div>
        <div>CRAFTED WITH SOUL AND HARD LOGIC</div>
      </motion.div>
    </div>
  );
}
