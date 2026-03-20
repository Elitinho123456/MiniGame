import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { itemPrices } from '../assets/consts';

interface ShopPanelProps {
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    mineCoins: number;
    setMineCoins: React.Dispatch<React.SetStateAction<number>>;
    onBuyPotion: (potionId: string, cost: number, durationMs: number) => void;
    activePotions: Record<string, number>;
}

const potions = [
    {
        id: 'pot_speed',
        name: 'Poção de Rapidez',
        emoji: '⚡',
        effect: '+50% Velocidade de Mineração',
        cost: 50,
        durationMs: 10 * 60 * 1000,
        durationLabel: '10 min',
        color: 'from-yellow-500 to-amber-600',
        borderColor: 'border-yellow-400',
        bgColor: 'bg-yellow-500/10',
        glowColor: 'shadow-yellow-500/30',
    },
    {
        id: 'pot_loot',
        name: 'Poção de Fortuna',
        emoji: '💎',
        effect: 'Drops x2 em toda mineração',
        cost: 100,
        durationMs: 10 * 60 * 1000,
        durationLabel: '10 min',
        color: 'from-purple-500 to-violet-600',
        borderColor: 'border-purple-400',
        bgColor: 'bg-purple-500/10',
        glowColor: 'shadow-purple-500/30',
    },
    {
        id: 'pot_xp',
        name: 'Poção de XP Pet',
        emoji: '🌟',
        effect: '+3x XP para pets equipados',
        cost: 75,
        durationMs: 10 * 60 * 1000,
        durationLabel: '10 min',
        color: 'from-cyan-400 to-blue-600',
        borderColor: 'border-cyan-400',
        bgColor: 'bg-cyan-500/10',
        glowColor: 'shadow-cyan-500/30',
    },
    {
        id: 'pot_durability',
        name: 'Poção de Resistência',
        emoji: '🛡️',
        effect: 'Ferramentas não perdem durabilidade',
        cost: 150,
        durationMs: 5 * 60 * 1000,
        durationLabel: '5 min',
        color: 'from-emerald-400 to-green-600',
        borderColor: 'border-emerald-400',
        bgColor: 'bg-emerald-500/10',
        glowColor: 'shadow-emerald-500/30',
    },
    {
        id: 'pot_coin',
        name: 'Poção de Riqueza',
        emoji: '💰',
        effect: '+50% valor de venda dos itens',
        cost: 200,
        durationMs: 10 * 60 * 1000,
        durationLabel: '10 min',
        color: 'from-amber-400 to-orange-600',
        borderColor: 'border-amber-400',
        bgColor: 'bg-amber-500/10',
        glowColor: 'shadow-amber-500/30',
    },
    {
        id: 'pot_magnet',
        name: 'Poção de Magnetismo',
        emoji: '🧲',
        effect: '+1 drop extra por bloco minerado',
        cost: 120,
        durationMs: 10 * 60 * 1000,
        durationLabel: '10 min',
        color: 'from-red-400 to-rose-600',
        borderColor: 'border-red-400',
        bgColor: 'bg-red-500/10',
        glowColor: 'shadow-red-500/30',
    },
];

function formatTimer(endTime: number): string {
    const diff = Math.max(0, endTime - Date.now());
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ShopPanel({
    inventory,
    setInventory,
    mineCoins,
    setMineCoins,
    onBuyPotion,
    activePotions,
}: ShopPanelProps) {
    const [activeTab, setActiveTab] = useState<'ofertas' | 'vender' | 'pocoes'>('ofertas');
    const [sellAmount, setSellAmount] = useState<Record<string, number>>({});
    const [, forceUpdate] = useState(0);
    const [purchaseFlash, setPurchaseFlash] = useState<string | null>(null);

    // Timer tick every second to update countdowns
    useEffect(() => {
        const hasActive = Object.values(activePotions).some(t => t > Date.now());
        if (!hasActive) return;
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
        return () => clearInterval(interval);
    }, [activePotions]);

    const hasCoinPotion = activePotions['pot_coin'] && activePotions['pot_coin'] > Date.now();

    const handleSell = (itemName: string, amount: number) => {
        const amountToSell = amount || 1;
        const currentAmount = inventory[itemName] || 0;
        if (amountToSell <= 0 || currentAmount < amountToSell) return;

        let price = itemPrices[itemName] || 0;
        if (price === 0) return;

        // Aplica bônus da poção de riqueza
        if (hasCoinPotion) {
            price = Math.floor(price * 1.5);
        }

        setInventory(prev => ({
            ...prev,
            [itemName]: prev[itemName] - amountToSell
        }));
        setMineCoins(prev => prev + (price * amountToSell));
        setSellAmount(prev => ({ ...prev, [itemName]: 1 }));
    };

    const handleBuyPotion = (potion: typeof potions[0]) => {
        if (mineCoins < potion.cost) return;
        onBuyPotion(potion.id, potion.cost, potion.durationMs);
        setPurchaseFlash(potion.id);
        setTimeout(() => setPurchaseFlash(null), 600);
    };

    const hasSellableItems = Object.keys(itemPrices).some(key => inventory[key] > 0);

    // Active potions for "ofertas" display
    const activePotionsList = potions.filter(p => activePotions[p.id] && activePotions[p.id] > Date.now());

    const tabs = [
        { id: 'ofertas' as const, label: 'OFERTAS', icon: '🏷️' },
        { id: 'vender' as const, label: 'VENDER', icon: '💸' },
        { id: 'pocoes' as const, label: 'POÇÕES', icon: '🧪' },
    ];

    return (
        <div className="flex-1 flex flex-col bg-linear-to-b from-[#1a1035] via-[#0d1b2a] to-[#0a0f1a] h-full overflow-hidden">
            {/* ═══ HEADER da Loja ═══ */}
            <div className="relative px-6 pt-6 pb-4">
                {/* Glow decorativo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🛒</span>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">LOJA</h1>
                            <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Brawl Mine Shop</p>
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

                {/* Active Potions Bar */}
                {activePotionsList.length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                        {activePotionsList.map(p => (
                            <div
                                key={p.id}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${p.bgColor} border ${p.borderColor}/30 text-xs font-bold`}
                            >
                                <span>{p.emoji}</span>
                                <span className="text-white/80">{formatTimer(activePotions[p.id])}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══ CONTEÚDO PRINCIPAL ═══ */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-24">
                <AnimatePresence mode="wait">
                    {/* ──── ABA OFERTAS ──── */}
                    {activeTab === 'ofertas' && (
                        <motion.div
                            key="ofertas"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-black text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-2xl">🔥</span> Ofertas Especiais
                            </h2>

                            {/* Daily Featured Potions (Brawl Stars style large cards) */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {potions.slice(0, 3).map((potion) => {
                                    const isActive = activePotions[potion.id] && activePotions[potion.id] > Date.now();
                                    return (
                                        <motion.div
                                            key={potion.id}
                                            whileHover={{ scale: 1.03, y: -4 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`relative overflow-hidden rounded-2xl border-2 ${isActive ? 'border-green-400/50' : potion.borderColor + '/30'} cursor-pointer group`}
                                        >
                                            {/* Card background gradient */}
                                            <div className={`absolute inset-0 bg-linear-to-br ${potion.color} opacity-20`} />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                                            {/* Glow effect on hover */}
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${potion.color} blur-xl scale-150`} style={{ opacity: 0.1 }} />

                                            <div className="relative p-5 flex flex-col items-center text-center min-h-[220px] justify-between">
                                                {/* Duration tag */}
                                                <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded-full text-[10px] font-bold text-white/60">
                                                    {potion.durationLabel}
                                                </div>

                                                {/* Emoji Icon */}
                                                <div className="text-5xl mt-4 mb-3 drop-shadow-lg group-hover:scale-110 transition-transform">
                                                    {potion.emoji}
                                                </div>

                                                {/* Name & Effect */}
                                                <div>
                                                    <h3 className="font-black text-white text-sm mb-1">{potion.name}</h3>
                                                    <p className="text-[11px] text-stone-400 font-medium leading-tight">{potion.effect}</p>
                                                </div>

                                                {/* Price / Timer */}
                                                {isActive ? (
                                                    <div className="mt-3 bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-2 w-full">
                                                        <span className="text-green-400 font-black text-sm">⏱ {formatTimer(activePotions[potion.id])}</span>
                                                    </div>
                                                ) : (
                                                    <motion.button
                                                        onClick={() => handleBuyPotion(potion)}
                                                        disabled={mineCoins < potion.cost}
                                                        className={`mt-3 w-full py-2 rounded-xl font-black text-sm transition-all ${mineCoins >= potion.cost
                                                            ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95'
                                                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                                            }`}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {potion.cost} MC
                                                    </motion.button>
                                                )}
                                            </div>

                                            {/* Flash on purchase */}
                                            {purchaseFlash === potion.id && (
                                                <motion.div
                                                    initial={{ opacity: 0.8 }}
                                                    animate={{ opacity: 0 }}
                                                    transition={{ duration: 0.6 }}
                                                    className="absolute inset-0 bg-white z-20 pointer-events-none"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* More potions row */}
                            <h2 className="text-lg font-black text-white/60 uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
                                <span className="text-2xl">⭐</span> Poções Premium
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {potions.slice(3).map((potion) => {
                                    const isActive = activePotions[potion.id] && activePotions[potion.id] > Date.now();
                                    return (
                                        <motion.div
                                            key={potion.id}
                                            whileHover={{ scale: 1.03, y: -4 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`relative overflow-hidden rounded-2xl border-2 ${isActive ? 'border-green-400/50' : potion.borderColor + '/30'} cursor-pointer group`}
                                        >
                                            <div className={`absolute inset-0 bg-linear-to-br ${potion.color} opacity-20`} />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                                            <div className="relative p-5 flex flex-col items-center text-center min-h-[220px] justify-between">
                                                <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded-full text-[10px] font-bold text-white/60">
                                                    {potion.durationLabel}
                                                </div>

                                                <div className="text-5xl mt-4 mb-3 drop-shadow-lg group-hover:scale-110 transition-transform">
                                                    {potion.emoji}
                                                </div>

                                                <div>
                                                    <h3 className="font-black text-white text-sm mb-1">{potion.name}</h3>
                                                    <p className="text-[11px] text-stone-400 font-medium leading-tight">{potion.effect}</p>
                                                </div>

                                                {isActive ? (
                                                    <div className="mt-3 bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-2 w-full">
                                                        <span className="text-green-400 font-black text-sm">⏱ {formatTimer(activePotions[potion.id])}</span>
                                                    </div>
                                                ) : (
                                                    <motion.button
                                                        onClick={() => handleBuyPotion(potion)}
                                                        disabled={mineCoins < potion.cost}
                                                        className={`mt-3 w-full py-2 rounded-xl font-black text-sm transition-all ${mineCoins >= potion.cost
                                                            ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95'
                                                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                                            }`}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {potion.cost} MC
                                                    </motion.button>
                                                )}
                                            </div>

                                            {purchaseFlash === potion.id && (
                                                <motion.div
                                                    initial={{ opacity: 0.8 }}
                                                    animate={{ opacity: 0 }}
                                                    transition={{ duration: 0.6 }}
                                                    className="absolute inset-0 bg-white z-20 pointer-events-none"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ──── ABA VENDER ──── */}
                    {activeTab === 'vender' && (
                        <motion.div
                            key="vender"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                                    <span className="text-2xl">💸</span> Vender Itens
                                </h2>
                                {hasCoinPotion && (
                                    <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                                        <span>💰</span>
                                        <span className="text-amber-400 text-xs font-black">+50% VALOR ATIVO</span>
                                    </div>
                                )}
                            </div>

                            {hasSellableItems ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    {Object.entries(itemPrices).map(([itemName, basePrice]) => {
                                        const inInventory = inventory[itemName] || 0;
                                        const toSell = sellAmount[itemName] !== undefined ? sellAmount[itemName] : 1;
                                        if (inInventory === 0) return null;

                                        const effectivePrice = hasCoinPotion ? Math.floor(basePrice * 1.5) : basePrice;

                                        return (
                                            <motion.div
                                                key={itemName}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="relative overflow-hidden bg-linear-to-br from-stone-800/80 to-stone-900/80 border border-stone-700/50 p-3 rounded-xl group hover:border-emerald-500/40 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Item icon */}
                                                    <div className="w-12 h-12 bg-stone-900/80 rounded-lg flex items-center justify-center p-1.5 border border-stone-700/50 shrink-0">
                                                        <img
                                                            src={`/${itemName.replaceAll(' ', '_')}.webp`}
                                                            alt={itemName}
                                                            className="w-full h-full object-contain drop-shadow-md"
                                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                                        />
                                                    </div>

                                                    {/* Item info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-white text-sm truncate">{itemName.replace(/_/g, ' ')}</h4>
                                                        <p className="text-xs text-stone-400 font-bold">
                                                            Qtd: <span className="text-white">{inInventory}</span>
                                                            <span className="mx-1 text-stone-600">|</span>
                                                            <span className={hasCoinPotion ? 'text-amber-400' : 'text-emerald-400'}>
                                                                {effectivePrice} MC
                                                            </span>
                                                            {hasCoinPotion && (
                                                                <span className="text-stone-600 line-through ml-1">{basePrice}</span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Controls */}
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={inInventory}
                                                            value={toSell}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 1;
                                                                setSellAmount(prev => ({ ...prev, [itemName]: Math.min(Math.max(1, val), inInventory) }));
                                                            }}
                                                            className="w-14 px-2 py-1.5 text-xs rounded-lg bg-stone-900 border border-stone-600 text-white text-center outline-none focus:border-emerald-500 transition-colors"
                                                        />
                                                        <motion.button
                                                            onClick={() => handleSell(itemName, toSell)}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="bg-linear-to-r from-emerald-500 to-green-600 text-white font-bold py-1.5 px-3 rounded-lg shadow-lg shadow-emerald-500/20 text-xs hover:shadow-emerald-500/40 transition-shadow"
                                                        >
                                                            Vender
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => {
                                                                const currentAmount = inventory[itemName] || 0;
                                                                if (currentAmount > 0) {
                                                                    setTimeout(() => handleSell(itemName, currentAmount), 100);
                                                                }
                                                            }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 font-bold py-1.5 px-2.5 rounded-lg text-xs transition-colors"
                                                        >
                                                            Tudo
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="text-6xl mb-4 opacity-30">📦</span>
                                    <p className="text-stone-500 font-bold text-lg">Inventário Vazio</p>
                                    <p className="text-stone-600 text-sm mt-1">Minere alguns blocos e volte aqui para vender!</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ──── ABA POÇÕES ──── */}
                    {activeTab === 'pocoes' && (
                        <motion.div
                            key="pocoes"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-black text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-2xl">🧪</span> Todas as Poções
                            </h2>

                            <div className="space-y-3">
                                {potions.map((potion) => {
                                    const isActive = activePotions[potion.id] && activePotions[potion.id] > Date.now();
                                    return (
                                        <motion.div
                                            key={potion.id}
                                            whileHover={{ x: 4 }}
                                            className={`relative overflow-hidden rounded-xl border ${isActive ? 'border-green-400/40' : 'border-stone-700/50'} bg-linear-to-r from-stone-800/80 to-stone-900/50 group`}
                                        >
                                            {/* Color accent bar */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b ${potion.color}`} />

                                            <div className="flex items-center gap-4 p-4 pl-5">
                                                {/* Emoji */}
                                                <div className={`w-14 h-14 rounded-xl ${potion.bgColor} border ${potion.borderColor}/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform`}>
                                                    {potion.emoji}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-black text-white text-base">{potion.name}</h3>
                                                    <p className="text-xs text-stone-400 font-medium">{potion.effect}</p>
                                                    <p className="text-[10px] text-stone-600 font-bold mt-0.5">Duração: {potion.durationLabel}</p>
                                                </div>

                                                {/* Action */}
                                                {isActive ? (
                                                    <div className="bg-green-500/15 border border-green-400/30 rounded-xl px-4 py-2 shrink-0">
                                                        <span className="text-green-400 font-black text-sm flex items-center gap-1">
                                                            ⏱ {formatTimer(activePotions[potion.id])}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <motion.button
                                                        onClick={() => handleBuyPotion(potion)}
                                                        disabled={mineCoins < potion.cost}
                                                        whileTap={{ scale: 0.9 }}
                                                        className={`shrink-0 py-2.5 px-5 rounded-xl font-black text-sm transition-all ${mineCoins >= potion.cost
                                                            ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40'
                                                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {potion.cost} MC
                                                    </motion.button>
                                                )}
                                            </div>

                                            {purchaseFlash === potion.id && (
                                                <motion.div
                                                    initial={{ opacity: 0.8 }}
                                                    animate={{ opacity: 0 }}
                                                    transition={{ duration: 0.6 }}
                                                    className="absolute inset-0 bg-white z-20 pointer-events-none"
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ═══ BOTTOM TABS (Brawl Stars Style) ═══ */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-[#0a0f1a] via-[#0a0f1a] to-transparent pt-6">
                <div className="flex bg-[#111827] border-t border-stone-700/50 rounded-t-2xl overflow-hidden mx-2 shadow-2xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all relative ${activeTab === tab.id
                                ? 'text-white bg-linear-to-t from-emerald-500/20 to-transparent'
                                : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="shopTabIndicator"
                                    className="absolute top-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full"
                                />
                            )}
                            <span className="text-lg">{tab.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

