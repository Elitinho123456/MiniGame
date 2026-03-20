import { motion, AnimatePresence } from 'framer-motion';
import { nameMap } from '../assets/consts';
import type { ChestTier } from '../assets/events';
import { type Accessory, getAccessoryById, rarityColors } from '../assets/accessories';

interface ChestRewardDisplay {
  type: string;
  itemId?: string;
  amount: number;
}

interface ChestModalProps {
  chest: ChestTier | null;
  rewards: ChestRewardDisplay[];
  onClose: () => void;
}

export default function ChestModal({ chest, rewards, onClose }: ChestModalProps) {
  if (!chest) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[90%] max-w-lg"
        >
          {/* Background card */}
          <div className={`relative overflow-hidden rounded-3xl border-2 ${chest.borderColor}/50 shadow-2xl ${chest.glowColor}`}>
            <div className={`absolute inset-0 bg-linear-to-br ${chest.color} opacity-15`} />
            <div className="absolute inset-0 bg-linear-to-b from-stone-900/95 to-stone-950/98" />

            {/* Sparkle effect */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/3 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            />

            <div className="relative p-8 flex flex-col items-center text-center">
              {/* Chest icon */}
              <motion.div
                className="text-7xl mb-4"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                {chest.emoji}
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-wider">
                {chest.name}
              </h2>
              <p className="text-xs text-stone-400 font-bold mb-6">
                Você encontrou um baú!
              </p>

              {/* Rewards */}
              <div className="w-full space-y-2 mb-6">
                <h3 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">
                  Recompensas
                </h3>
                {rewards.map((reward, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex items-center gap-3 bg-stone-800/50 border border-stone-700/40 rounded-xl p-3"
                  >
                    {reward.type === 'resource' && (
                      <>
                        <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center p-1 border border-stone-700/50">
                          <img
                            src={`/${reward.itemId?.replaceAll(' ', '_')}.webp`}
                            alt={reward.itemId || ''}
                            className="w-full h-full object-contain"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-bold text-white">
                            {nameMap[reward.itemId || ''] || reward.itemId}
                          </span>
                        </div>
                        <span className="text-emerald-400 font-black text-sm">
                          x{reward.amount}
                        </span>
                      </>
                    )}

                    {reward.type === 'minecoins' && (
                      <>
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                          <img src="/Emerald.webp" alt="MC" className="w-6 h-6" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-bold text-amber-400">MineCoins</span>
                        </div>
                        <span className="text-amber-400 font-black text-sm">
                          +{reward.amount.toLocaleString()}
                        </span>
                      </>
                    )}

                    {reward.type === 'accessory' && (() => {
                      const acc: Accessory | undefined = getAccessoryById(reward.itemId || '');
                      if (!acc) return null;
                      const colors = rarityColors[acc.rarity];
                      return (
                        <>
                          <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center border ${colors.border} text-xl`}>
                            {acc.emoji}
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-sm font-bold text-white">{acc.name}</span>
                            <span className={`ml-2 text-[10px] font-black uppercase ${colors.text}`}>
                              {acc.rarity}
                            </span>
                          </div>
                          <span className="text-fuchsia-400 font-black text-xs">NOVO!</span>
                        </>
                      );
                    })()}
                  </motion.div>
                ))}
              </div>

              {/* Collect button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`w-full py-3 rounded-xl font-black text-lg text-white bg-linear-to-r ${chest.color} shadow-lg hover:shadow-xl transition-shadow`}
              >
                Coletar! ✨
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
