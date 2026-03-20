import { motion } from 'framer-motion';
import { dimensions, dropMap } from '../assets/consts';

interface VillagersPanelProps {
    ownedVillagers: Record<string, number>;
    hireVillager: (dimId: string) => void;
    mineCoins: number;
}

const dimColors: Record<string, { gradient: string; border: string; accent: string; glow: string }> = {
    Overworld: {
        gradient: 'from-green-600/30 to-emerald-800/30',
        border: 'border-green-500/30',
        accent: 'text-green-400',
        glow: 'shadow-green-500/20',
    },
    Caves: {
        gradient: 'from-stone-600/30 to-stone-800/30',
        border: 'border-amber-500/30',
        accent: 'text-amber-400',
        glow: 'shadow-amber-500/20',
    },
    Nether: {
        gradient: 'from-red-700/30 to-orange-900/30',
        border: 'border-red-500/30',
        accent: 'text-red-400',
        glow: 'shadow-red-500/20',
    },
    'The End': {
        gradient: 'from-purple-700/30 to-indigo-900/30',
        border: 'border-purple-500/30',
        accent: 'text-purple-400',
        glow: 'shadow-purple-500/20',
    },
};

export default function VillagersPanel({
    ownedVillagers,
    hireVillager,
    mineCoins,
}: VillagersPanelProps) {
    return (
        <div className="flex-1 flex flex-col bg-linear-to-b from-[#1a1025] via-[#0d1b2a] to-[#0a0f1a] h-full overflow-hidden">
            {/* ═══ HEADER ═══ */}
            <div className="relative px-6 pt-6 pb-4">
                {/* Glow decorativo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🏠</span>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">ALDEÕES</h1>
                            <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Contrate trabalhadores</p>
                        </div>
                    </div>

                    {/* Mine Coins Badge */}
                    <motion.div
                        className="flex items-center gap-2 bg-linear-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 px-4 py-2 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                    >
                        <img src="/Emerald.webp" alt="MC" className="w-6 h-6 drop-shadow-lg" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        <span className="text-lg font-black text-amber-400">{mineCoins.toLocaleString()}</span>
                        <span className="text-xs text-amber-500/70 font-bold">MC</span>
                    </motion.div>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-500 font-medium mt-3 max-w-xl leading-relaxed">
                    Contrate aldeões para trabalhar passivamente em cada dimensão. Eles coletarão recursos automaticamente ao longo do tempo!
                </p>
            </div>

            {/* ═══ GRID DE DIMENSÕES ═══ */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
                    {Object.entries(dimensions).map(([dimId, dimData], index) => {
                        const count = ownedVillagers[dimId] || 0;
                        const baseCost = 500;
                        const cost = Math.floor(baseCost * Math.pow(1.5, count));
                        const canAfford = mineCoins >= cost;
                        const colors = dimColors[dimId] || dimColors['Overworld'];

                        // Figure out what this dimension collects
                        const collectableItems = dimData.blocks
                            .slice(0, 3)
                            .map(b => dropMap[b.name])
                            .filter(Boolean);

                        return (
                            <motion.div
                                key={dimId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className={`relative overflow-hidden rounded-2xl border-2 ${colors.border} group cursor-pointer`}
                            >
                                {/* Background image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 group-hover:scale-110 transition-all duration-500"
                                    style={{ backgroundImage: `url('${dimData.background}')` }}
                                />
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient}`} />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 p-6 flex flex-col min-h-[240px]">
                                    {/* Top: Dimension name + worker count */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className={`font-black text-2xl ${colors.accent} mb-1`}>
                                                {dimData.name}
                                            </h3>
                                            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">
                                                Dimensão ativa
                                            </p>
                                        </div>

                                        {/* Worker count badge */}
                                        <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                                            <span className="text-2xl font-black text-white">{count}</span>
                                            <span className="text-[10px] text-stone-400 font-bold uppercase">Aldeões</span>
                                        </div>
                                    </div>

                                    {/* Middle: What they collect */}
                                    <div className="mt-4 flex-1">
                                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-2">Coleta:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {collectableItems.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-lg px-2.5 py-1"
                                                >
                                                    <img
                                                        src={`/${item!.replaceAll(' ', '_')}.webp`}
                                                        alt={item!}
                                                        className="w-4 h-4 object-contain"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                    <span className="text-[11px] text-stone-300 font-bold">{item}</span>
                                                </div>
                                            ))}
                                            {dimData.blocks.length > 3 && (
                                                <div className="bg-black/30 border border-white/10 rounded-lg px-2.5 py-1">
                                                    <span className="text-[11px] text-stone-500 font-bold">+{dimData.blocks.length - 3} mais</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom: Hire button */}
                                    <motion.button
                                        onClick={() => hireVillager(dimId)}
                                        disabled={!canAfford}
                                        whileTap={canAfford ? { scale: 0.95 } : {}}
                                        className={`mt-4 w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${canAfford
                                            ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg ' + colors.glow + ' hover:shadow-xl active:scale-95'
                                            : 'bg-stone-800/80 text-stone-500 cursor-not-allowed border border-stone-700/50'
                                            }`}
                                    >
                                        <span>👷</span>
                                        Contratar Aldeão
                                        <span className="bg-black/30 px-2 py-0.5 rounded-lg text-xs ml-1">
                                            {cost.toLocaleString()} MC
                                        </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Summary footer */}
                <div className="mt-6 bg-stone-900/50 border border-stone-800/50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <p className="text-sm font-bold text-stone-400">Total de Aldeões Ativos</p>
                            <p className="text-xs text-stone-600">Gerando recursos passivamente a cada 2 segundos</p>
                        </div>
                    </div>
                    <span className="text-3xl font-black text-white">
                        {Object.values(ownedVillagers).reduce((a, b) => a + b, 0)}
                    </span>
                </div>
            </div>
        </div>
    );
}

