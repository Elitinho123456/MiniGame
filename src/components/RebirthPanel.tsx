// removed useState
import { motion } from 'framer-motion';
import { Infinity as InfinityIcon, Zap, Coins, Hammer, Sparkles } from 'lucide-react';

export interface RebirthUpgrade {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    costMultiplier: number;
    maxLevel: number;
    icon: React.ReactNode;
    x: number;
    y: number;
}

export const rebirthUpgrades: RebirthUpgrade[] = [
    {
        id: 'reb_coin_mult',
        name: 'Avidez Ancestral',
        description: 'Multiplica o ganho de MineCoins globalmente.',
        baseCost: 10,
        costMultiplier: 1.5,
        maxLevel: 50,
        icon: <Coins size={24} className="text-yellow-400" />,
        x: 0,
        y: -100
    },
    {
        id: 'reb_drop_chance',
        name: 'Sorte Infinita',
        description: 'Aumenta a chance base de drops extras.',
        baseCost: 25,
        costMultiplier: 1.8,
        maxLevel: 25,
        icon: <Sparkles size={24} className="text-blue-400" />,
        x: -250,
        y: 100
    },
    {
        id: 'reb_efficiency',
        name: 'Força Titânica',
        description: 'Aumenta permanentemente a velocidade de mineração.',
        baseCost: 50,
        costMultiplier: 2.0,
        maxLevel: 10,
        icon: <Hammer size={24} className="text-red-400" />,
        x: 250,
        y: 100
    }
];

interface RebirthPanelProps {
    prestigeCurrency: number;
    rebirthCount: number;
    rebirthUpgradesLevels: Record<string, number>;
    onBuyUpgrade: (upgradeId: string, cost: number) => void;
    onRebirth: () => void;
    currentDim: string;
    toolsLevel: Record<string, number>;
    inventory: Record<string, number>;
    mineCoins: number;
}

export default function RebirthPanel({
    prestigeCurrency,
    rebirthCount,
    rebirthUpgradesLevels,
    onBuyUpgrade,
    onRebirth,
    currentDim,
    toolsLevel,
    inventory,
    mineCoins
}: RebirthPanelProps) {
    // Requirements: Nether unlocked AND 10M Minecoins, 100 Raw Iron, 50 Gold Ingots, 10 Diamonds
    const hasNetherUnlocked = currentDim === 'Nether' || (toolsLevel.pickaxe && toolsLevel.pickaxe >= 6);
    
    const reqs = {
        coins: 100000,
        iron: 100,
        gold: 50,
        diamond: 10
    };

    const meetsReqs = hasNetherUnlocked && 
        mineCoins >= reqs.coins && 
        (inventory['Raw Iron'] || 0) >= reqs.iron &&
        (inventory['Gold Ingot'] || 0) >= reqs.gold &&
        (inventory['Diamond'] || 0) >= reqs.diamond;

    const canRebirth = meetsReqs;

    return (
        <div className="flex-1 bg-stone-950 p-6 flex flex-col h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-800">
                <div>
                    <h2 className="text-3xl font-black text-purple-400 flex items-center gap-3 tracking-wide">
                        <InfinityIcon size={32} />
                        ASCENSÃO
                    </h2>
                    <p className="text-stone-400 mt-1">Transcenda a realidade e ganhe Fragmentos do Fim.</p>
                </div>
                <div className="flex flex-col items-end bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                    <span className="text-stone-400 text-sm font-bold uppercase tracking-wider">Fragmentos do Fim</span>
                    <span className="text-4xl font-black text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.3)]">
                        {Math.floor(prestigeCurrency)}
                    </span>
                    <span className="text-xs text-stone-600 mt-1">Renascimentos: {rebirthCount}</span>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden bg-[url('/stone_brick_bg.webp')] bg-stone-950 bg-repeat bg-blend-overlay border border-stone-800 rounded-xl mb-8 cursor-grab active:cursor-grabbing">
                <motion.div 
                    drag 
                    dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                    className="absolute w-[2000px] h-[2000px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transform-gpu"
                >
                    {/* Linhas de conexão podem ser renderizadas por SVG se houver ramificações estritas,
                        ou usar setas CSS. Por enquanto posições absolutas funcionam */}

                    {rebirthUpgrades.map(upg => {
                        const currentLevel = rebirthUpgradesLevels[upg.id] || 0;
                        const cost = Math.floor(upg.baseCost * Math.pow(upg.costMultiplier, currentLevel));
                        const isMaxed = currentLevel >= upg.maxLevel;
                        const canAfford = prestigeCurrency >= cost && !isMaxed;

                        return (
                            <div 
                                key={upg.id} 
                                className="absolute bg-stone-900 border-2 border-stone-700 w-64 rounded-md p-4 flex flex-col hover:border-purple-500/50 shadow-xl transition-colors group"
                                style={{ transform: `translate(${upg.x}px, ${upg.y}px)` }}
                            >
                                <div className="absolute inset-0 bg-purple-500/5 blur-xl group-hover:bg-purple-500/10 pointer-events-none transition-colors"></div>

                                <div className="flex items-center gap-3 mb-2 relative z-10">
                                    <div className="p-2 bg-stone-950 rounded border border-stone-800 shrink-0">
                                        {upg.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-stone-100 leading-tight">{upg.name}</h3>
                                        <div className="text-[10px] text-purple-400 font-bold tracking-wider">NV. {currentLevel} / {upg.maxLevel}</div>
                                    </div>
                                </div>

                                <p className="text-xs text-stone-400 mb-3 relative z-10 leading-snug min-h-[40px]">{upg.description}</p>

                                <button
                                    onClick={() => !isMaxed && canAfford && onBuyUpgrade(upg.id, cost)}
                                    disabled={!canAfford || isMaxed}
                                    className={`
                                        relative z-10 w-full py-2 rounded text-xs font-bold transition-all duration-200
                                        ${isMaxed 
                                            ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                                            : canAfford 
                                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_4px_12px_rgba(147,51,234,0.3)] active:scale-[0.98]'
                                                : 'bg-stone-950 text-stone-500 border border-stone-800 hover:bg-stone-800'
                                        }
                                    `}
                                >
                                    {isMaxed ? 'MÁXIMO' : `${cost} FRAGMENTOS`}
                                </button>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            <div className="mt-auto bg-linear-to-r from-stone-900 to-purple-900/20 border border-purple-500/20 rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/End_Minecraft.webp')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>

                <h3 className="text-2xl font-black text-stone-100 mb-2 relative z-10">Realizar Ascensão</h3>
                <p className="text-stone-400 max-w-2xl mx-auto mb-6 relative z-10">
                    Sua jornada chegou ao limite. Renasça para converter sua glória em Fragmentos do Fim. Você perderá seus itens, moedas, níveis de ferramentas e aldeões, mas manterá seus Pets e Acessórios.
                </p>

                {canRebirth ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRebirth}
                        className="relative z-10 px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black rounded-xl shadow-[0_0_30px_rgba(192,38,211,0.4)] transition-colors flex items-center gap-3 mx-auto"
                    >
                        <Zap size={24} />
                        RENASCER AGORA
                    </motion.button>
                ) : (
                    <div className="relative z-10 flex flex-col md:flex-row gap-4 items-center justify-center">
                        <button disabled className="px-8 py-4 bg-stone-800 text-stone-500 font-black rounded-xl cursor-not-allowed border border-stone-700 uppercase tracking-wide">
                            Requisitos Não Atingidos
                        </button>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-left">
                            <div className={`px-3 py-2 rounded-lg border text-xs font-bold ${hasNetherUnlocked ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                                Acesso ao Nether
                            </div>
                            <div className={`px-3 py-2 rounded-lg border text-xs font-bold ${mineCoins >= reqs.coins ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                                {reqs.coins.toLocaleString()} MineCoins
                            </div>
                            <div className={`px-3 py-2 rounded-lg border text-xs font-bold ${inventory['Raw Iron'] >= reqs.iron ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                                {reqs.iron} Ferro Bruto
                            </div>
                            <div className={`px-3 py-2 rounded-lg border text-xs font-bold ${inventory['Gold Ingot'] >= reqs.gold ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                                {reqs.gold} Ouro Fundido
                            </div>
                            <div className={`col-span-2 md:col-span-4 px-3 py-2 rounded-lg border text-xs font-bold text-center ${inventory['Diamond'] >= reqs.diamond ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                                {reqs.diamond} Diamantes Puros
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
