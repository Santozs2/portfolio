/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ControlDesk from './components/ControlDesk';
import CentralEnviron from './components/CentralEnviron';
import JornadaEnviron from './components/JornadaEnviron';
import ProjetosEnviron from './components/ProjetosEnviron';
import FerramentasEnviron from './components/FerramentasEnviron';
import ProximaVersaoEnviron from './components/ProximaVersaoEnviron';
import ContatoEnviron from './components/ContatoEnviron';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 select-none relative selection:bg-orange-500 selection:text-black">
      {/* Immersive Scanline layer */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-[0.12] z-50" />

      {/* Main Experience Environments Section Stream */}
      <main className="relative z-10 w-full overflow-hidden">
        <CentralEnviron />
        <ProximaVersaoEnviron />
        <JornadaEnviron />
        <ProjetosEnviron />
        <FerramentasEnviron />
        <ContatoEnviron />
      </main>

      {/* Interactive Control Desk Dock */}
      <ControlDesk />
    </div>
  );
}

