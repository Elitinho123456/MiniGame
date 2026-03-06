import { useState } from 'react';
import { Link } from 'react-router';
import {
  BookOpen,
  Pickaxe,
  Map as MapIcon,
  Package,
  Sparkles,
  PawPrint,
  ShoppingBag,
  Info,
  ArrowRight
} from 'lucide-react';

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('introducao');

  const menuItems = [
    { id: 'introducao', label: 'Introdução', icon: BookOpen },
    { id: 'dimensoes', label: 'Dimensões', icon: MapIcon },
    { id: 'ferramentas', label: 'Ferramentas', icon: Pickaxe },
    { id: 'itens', label: 'Itens & Drops', icon: Package },
    { id: 'upgrades', label: 'Upgrades', icon: Sparkles },
    { id: 'pets', label: 'Pets', icon: PawPrint },
    { id: 'loja', label: 'Loja & Coins', icon: ShoppingBag },
    { id: 'galeria', label: 'Galeria de Itens', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-stone-300 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-stone-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              MINIGAME <span className="text-emerald-500 font-medium ml-1">DOCS</span>
            </h1>
          </div>
          <Link
            to="/"
            className="group flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-md font-bold text-sm transition-all border-b-4 border-black active:border-b-0 active:translate-y-1 shadow-lg"
          >
            VOLTAR AO JOGO
            <img src="./src/assets/DownArrow.png" alt="" className="w-3 h-3 -rotate-90 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-6 md:p-10">
        {/* Sidebar Mini */}
        <aside className="md:w-64 flex-shrink-0">
          <nav className="sticky top-28 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-left group
                  ${activeTab === item.id
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_4px_15px_rgba(16,185,129,0.1)]'
                    : 'hover:bg-white/5 text-stone-500 hover:text-white border border-transparent'
                  }`}
              >
                <item.icon size={18} className={`${activeTab === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-stone-900/40 border border-stone-800 rounded-3xl p-8 md:p-12 shadow-2xl min-h-[70vh]">
          {activeTab === 'introducao' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Bem-vindo ao MiniGame</h2>
              <p className="text-lg text-stone-400 mb-8 leading-relaxed">
                Um simulador de mineração inspirado no universo de blocos mais famoso do mundo.
                Sua jornada começa com um simples clique e termina onde sua ambição permitir.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-stone-800/50 rounded-2xl border border-stone-700/50">
                  <h3 className="text-emerald-400 font-bold mb-2">Objetivo</h3>
                  <p className="text-sm">Minerar recursos, evoluir ferramentas e desbloquear novas dimensões.</p>
                </div>
                <div className="p-6 bg-stone-800/50 rounded-2xl border border-stone-700/50">
                  <h3 className="text-emerald-400 font-bold mb-2">Comandos</h3>
                  <p className="text-sm">Use o mouse para interagir com os menus e clicar no bloco central para minerar.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dimensoes' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
              <h2 className="text-4xl font-black text-white mb-6">Dimensões</h2>
              {[
                { name: 'Overworld', desc: 'O começo de tudo. Grama, terra e madeira.', img: './Overworld_Minecraft.webp' },
                { name: 'Cavernas', desc: 'Rico em minérios preciosos como ferro e diamante.', img: './Caves_Minecraft.webp' },
                { name: 'Nether', desc: 'Um inferno de chamas com recursos raros e perigosos.', img: './Nether_Minecraft.webp' },
                { name: 'The End', desc: 'O vazio final. Onde apenas os mais fortes sobrevivem.', img: './End_Minecraft.webp' }
              ].map(dim => (
                <div key={dim.name} className="group relative overflow-hidden rounded-2xl bg-stone-800/30 border border-stone-700/50 hover:border-emerald-500/50 transition-all">
                  <div className="flex flex-col md:flex-row items-center">
                    <img src={dim.img} alt={dim.name} className="w-full md:w-48 h-32 object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="p-6">
                      <h3 className="text-xl font-black text-white">{dim.name}</h3>
                      <p className="text-sm text-stone-400">{dim.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ferramentas' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black text-white mb-8">Ferramentas</h2>
              <div className="space-y-12">
                {['pickaxe', 'axe', 'shovel', 'hoe'].map(type => (
                  <div key={type} className="border-t border-stone-800 pt-8 mt-8 first:border-0 first:pt-0">
                    <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-widest mb-6">{type === 'pickaxe' ? 'Picaretas' : type === 'axe' ? 'Machados' : type === 'shovel' ? 'Pás' : 'Enxadas'}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                      {['Wood', 'Stone', 'Copper', 'Iron', 'Gold', 'Diamond', 'Netherite'].map(material => (
                        <div key={material} className="flex flex-col items-center p-3 bg-stone-800/20 rounded-xl border border-stone-700/30 hover:bg-stone-800/50 transition-all">
                          <img
                            src={`./${material === 'Wood' ? 'Wooden' : material === 'Gold' ? 'Golden' : material}_${type.charAt(0).toUpperCase() + type.slice(1)}.webp`}
                            className="w-12 h-12 mb-2 drop-shadow-[0_4px_8px_rgba(255,255,255,0.1)]"
                            alt={material}
                          />
                          <span className="text-[10px] font-bold text-center uppercase text-stone-500">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'itens' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black text-white mb-6">Drops de Blocos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { b: 'Stone', d: 'Cobblestone' },
                  { b: 'Coal_Ore', d: 'Coal' },
                  { b: 'Iron_Ore', d: 'Raw Iron' },
                  { b: 'Gold_Ore', d: 'Raw Gold' },
                  { b: 'Diamond_Ore', d: 'Diamond' },
                  { b: 'Nether_Quartz_Ore', d: 'Quartzo' },
                ].map(item => (
                  <div key={item.b} className="flex items-center justify-between p-4 bg-stone-800/40 border border-stone-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={`./${item.b}.webp`} className="w-10 h-10" alt={item.b} />
                      <span className="font-bold text-stone-300">{item.b.replace('_', ' ')}</span>
                    </div>
                    <ArrowRight className="text-stone-600" size={16} />
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-400">{item.d}</span>
                      <img src={`./${item.d.replace(' ', '_')}.webp`} className="w-10 h-10" alt={item.d} onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black text-white mb-6">Melhorias</h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { n: 'Fortuna I', d: 'Aumenta todos os drops de mineração em +1.', i: '✨' },
                  { n: 'Bancada Eficiente', d: 'Reduz o tempo de todos os crafts em 20%.', i: '🪚' },
                  { n: 'Bolsos Profundos', d: 'Aumenta permanentemente o inventário em +100.', i: '👖' },
                  { n: 'Comerciante Automático', d: 'Vende recursos automaticamente a cada 5s.', i: '🤝' }
                ].map(upg => (
                  <div key={upg.n} className="p-6 bg-stone-800/40 border border-stone-700/50 rounded-2xl flex items-center gap-6">
                    <div className="text-4xl bg-stone-700/30 p-4 rounded-xl shadow-inner">{upg.i}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{upg.n}</h3>
                      <p className="text-stone-400 text-sm">{upg.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pets' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black text-white mb-6">Sistema de Pets</h2>
              <p className="text-stone-400 mb-8">Companheiros que concedem bônus passivos únicos. Podem ser encontrados minerando raramente.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { n: 'Cachorrinho', r: 'Comum', b: '+Velocidade', i: '🐶' },
                  { n: 'Gatinho', r: 'Comum', b: 'Drops Passivos', i: '🐱' },
                  { n: 'Dragão Bebê', r: 'Raro', b: '++Tudo', i: '🐉' },
                  { n: 'Unicórnio', r: 'Lendário', b: '+++Drops', i: '🦄' }
                ].map(pet => (
                  <div key={pet.n} className="p-6 bg-stone-800/40 border border-stone-700/50 rounded-2xl text-center group hover:bg-emerald-500/5 transition-all">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{pet.i}</div>
                    <div className="font-black text-white">{pet.n}</div>
                    <div className="text-[10px] font-bold uppercase text-emerald-500/70 mb-2">{pet.r}</div>
                    <div className="text-xs text-stone-500">{pet.b}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'loja' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center text-center py-20">
              <div className="bg-amber-500/10 p-6 rounded-full border border-amber-500/20 mb-6">
                <ShoppingBag size={64} className="text-amber-500" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4">Economia & Loja</h2>
              <p className="text-stone-400 max-w-sm mb-8">
                Ganhe Mine Coins vendendo recursos ou completando objetivos.
                Use-os para comprar blocos raros, novos biomas e pets exclusivos.
              </p>
              <div className="bg-stone-800/50 px-6 py-3 rounded-full border border-stone-700 text-xs font-bold text-stone-500 uppercase tracking-widest">
                Em breve: Sistema de Leilão entre Jogadores
              </div>
            </div>
          )}

          {activeTab === 'galeria' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-4xl font-black text-white mb-6">Galeria de Assets</h2>
              <p className="text-stone-400 mb-10 text-sm">Visualização de todos os ícones registrados no projeto, incluindo itens em desenvolvimento.</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-4">
                {[
                  'Ancient_Debris', 'Anvil', 'Beacon', 'Block_of_Diamond', 'Block_of_Netherite',
                  'Copper_Ingot', 'Iron_Ingot', 'Gold_Ingot', 'Diamond', 'Emerald',
                  'Backpack_Big', 'Backpack_Netherite', 'Obsidian', 'TNT', 'Redstone_Dust',
                  'Glass', 'Glowstone', 'Mossy_Cobblestone', 'Nether_Wart', 'Torch'
                ].map(asset => (
                  <div key={asset} className="group relative flex flex-col items-center gap-1 p-2 bg-stone-800/20 rounded-lg border border-transparent hover:border-stone-700 hover:bg-stone-800 transition-all">
                    <img src={`./${asset}.webp`} className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" alt={asset} onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.src.endsWith('.png')) img.src = img.src.replace('.webp', '.png');
                    }} />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-[8px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {asset}
                    </div>
                  </div>
                ))}
                {/* Itens Disponíveis em Breve */}
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-2 bg-stone-800/10 rounded-lg border border-dashed border-stone-800/50 opacity-30">
                    <div className="w-8 h-8 flex items-center justify-center text-[8px] font-black text-stone-600">?</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  Disponível em breve: 50 novos itens
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer Minimalista */}
      <footer className="max-w-7xl mx-auto p-10 text-center border-t border-stone-900 mt-20">
        <p className="text-stone-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          Desenvolvido com amor por <a href="https://github.com/Elitinho123456" className="text-emerald-500 hover:text-emerald-400 transition-colors">Elitinho</a> &copy; 2026
        </p>
      </footer>
    </div>
  );
}
