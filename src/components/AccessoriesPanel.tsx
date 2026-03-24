import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  type AccessorySlot,
  type Accessory,
  allAccessories,
  getAccessoriesBySlot,
  rarityColors,
} from '../assets/accessories';

interface AccessoriesPanelProps {
  ownedAccessories: Record<string, boolean>;
  equippedAccessories: Record<AccessorySlot, string | null>;
  onEquip: (accessoryId: string) => void;
  onUnequip: (slot: AccessorySlot) => void;
}

const slotConfig: { slot: AccessorySlot; label: string; emoji: string }[] = [
  { slot: 'ring', label: 'Anéis', emoji: '💍' },
  { slot: 'amulet', label: 'Amuletos', emoji: '📿' },
  { slot: 'belt', label: 'Cintos', emoji: '🎗️' },
  { slot: 'glove', label: 'Luvas', emoji: '🧤' },
];

export default function AccessoriesPanel({
  ownedAccessories,
  equippedAccessories,
  onEquip,
  onUnequip,
}: AccessoriesPanelProps) {
  const [activeSlot, setActiveSlot] = useState<AccessorySlot>('ring');
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);

  const accessories = getAccessoriesBySlot(activeSlot);
  const equippedId = equippedAccessories[activeSlot];

  const ownedCount = allAccessories.filter(a => ownedAccessories[a.id]).length;
  const totalCount = allAccessories.length;

  return (
    <div className="flex-1 flex flex-col bg-linear-to-b from-[#1a1025] via-[#0d1b2a] to-[#0a0f1a] h-full overflow-hidden">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">💍</span>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">ACESSÓRIOS</h1>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">
                {ownedCount}/{totalCount} Desbloqueados
              </p>
            </div>
          </div>
        </div>

        {/* Equipped summary */}
        <div className="mt-4 flex gap-2">
          {slotConfig.map(({ slot, emoji }) => {
            const eqId = equippedAccessories[slot];
            const eqAcc = eqId ? allAccessories.find(a => a.id === eqId) : null;
            return (
              <div
                key={slot}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${eqAcc
                  ? `${rarityColors[eqAcc.rarity].bg} ${rarityColors[eqAcc.rarity].border} ${rarityColors[eqAcc.rarity].text}`
                  : 'bg-stone-800/50 border-stone-700/30 text-stone-500'
                  }`}
                onClick={() => setActiveSlot(slot)}
              >
                <span>{eqAcc ? eqAcc.emoji : emoji}</span>
                <span className="hidden sm:inline">{eqAcc ? eqAcc.name : '—'}</span>
              </div>
            );
          })}
        </div>

        {/* Global Active Effects Summary */}
        <div className="mt-4 bg-stone-900/60 border border-stone-700/50 rounded-xl p-3 backdrop-blur-sm">
          <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 border-b border-stone-800 pb-1">Bônus Passivos Ativos</h3>
          <div className="flex flex-col gap-2">
            {Object.values(equippedAccessories).filter(id => id).length === 0 ? (
               <p className="text-xs text-stone-600 font-bold italic">Nenhum acessório equipado no momento.</p>
            ) : (
               Object.values(equippedAccessories).map(id => {
                 if (!id) return null;
                 const acc = allAccessories.find(a => a.id === id);
                 if (!acc) return null;
                 return (
                   <div key={id} className="flex flex-col bg-stone-950/40 p-1.5 rounded-lg">
                     <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1">
                       <span className="text-[10px]">{acc.emoji}</span> {acc.effectName}
                     </span>
                     <span className="text-[10px] text-stone-400 mt-0.5">{acc.effectDescription}</span>
                   </div>
                 );
               })
            )}
          </div>
        </div>
      </div>

      {/* Slot tabs */}
      <div className="px-6 flex gap-2 mb-4">
        {slotConfig.map(({ slot, label, emoji }) => (
          <button
            key={slot}
            onClick={() => { setActiveSlot(slot); setSelectedAccessory(null); }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeSlot === slot
              ? 'bg-linear-to-r from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-400/40 text-fuchsia-300'
              : 'bg-stone-800/40 border border-stone-700/30 text-stone-500 hover:text-stone-300 hover:bg-stone-800/60'
              }`}
          >
            <span>{emoji}</span>
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlot}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {accessories.map((acc) => {
              const owned = ownedAccessories[acc.id];
              const equipped = equippedId === acc.id;
              const colors = rarityColors[acc.rarity];

              return (
                <motion.div
                  key={acc.id}
                  whileHover={owned ? { scale: 1.03, y: -2 } : {}}
                  onClick={() => owned && setSelectedAccessory(acc)}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer group ${equipped
                    ? `${colors.border} shadow-lg ${colors.glow}`
                    : owned
                      ? `${colors.border.replace('/30', '/20')} hover:${colors.border}`
                      : 'border-stone-800/50 opacity-40 cursor-not-allowed'
                    }`}
                >
                  {/* BG */}
                  <div className={`absolute inset-0 ${owned ? colors.bg : 'bg-stone-900/80'}`} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                  {equipped && (
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    />
                  )}

                  <div className="relative p-4 flex flex-col items-center text-center min-h-[140px] justify-between">
                    {/* Equipped badge */}
                    {equipped && (
                      <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                        <span className="text-emerald-400 text-[9px] font-black uppercase">Equipado</span>
                      </div>
                    )}

                    {/* Rarity tag */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-[9px] font-black uppercase ${colors.text}`}>
                        {acc.rarity}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="text-3xl mt-3 mb-2 group-hover:scale-110 transition-transform">
                      {owned ? acc.emoji : '❓'}
                    </div>

                    {/* Name */}
                    <h4 className="font-bold text-white text-xs leading-tight mb-1">
                      {owned ? acc.name : '???'}
                    </h4>

                    {/* Effect */}
                    {owned && (
                      <p className="text-[10px] text-stone-400 font-medium leading-tight line-clamp-2">
                        {acc.effectDescription}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedAccessory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedAccessory(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[85%] max-w-sm"
            >
              {(() => {
                const acc = selectedAccessory;
                const colors = rarityColors[acc.rarity];
                const isEquipped = equippedId === acc.id;

                return (
                  <div className={`relative overflow-hidden rounded-3xl border-2 ${colors.border} shadow-2xl`}>
                    <div className={`absolute inset-0 bg-linear-to-br ${colors.bg}`} />
                    <div className="absolute inset-0 bg-linear-to-b from-stone-900/90 to-stone-950/95" />

                    <div className="relative p-8 flex flex-col items-center text-center">
                      <span className="text-6xl mb-4">{acc.emoji}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text} mb-2`}>
                        {acc.rarity}
                      </span>
                      <h2 className="text-xl font-black text-white mb-1">{acc.name}</h2>
                      <h3 className="text-sm font-bold text-stone-400 italic mb-4">{acc.effectName}</h3>

                      <p className="text-sm text-stone-300 leading-relaxed mb-6 max-w-[260px]">
                        {acc.effectDescription}
                      </p>

                      {acc.effectType === 'passive_placeholder' && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 mb-4">
                          <span className="text-amber-400 text-xs font-bold">🔧 Efeito em desenvolvimento</span>
                        </div>
                      )}

                      {isEquipped ? (
                        <button
                          onClick={() => { onUnequip(acc.slot); setSelectedAccessory(null); }}
                          className="w-full py-3 rounded-xl font-black text-sm bg-red-500/20 border border-red-400/40 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Desequipar
                        </button>
                      ) : (
                        <button
                          onClick={() => { onEquip(acc.id); setSelectedAccessory(null); }}
                          className={`w-full py-3 rounded-xl font-black text-sm bg-linear-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg hover:shadow-fuchsia-500/30 transition-shadow`}
                        >
                          Equipar
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedAccessory(null)}
                        className="mt-2 text-stone-500 text-xs font-bold hover:text-stone-300 transition-colors"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
