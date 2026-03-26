import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { toolChains, availableEnchantments, materialStats } from '../assets/consts';

export default function EnchantmentPanel() {
    const isDebugMode = useGameStore(s => s.isDebugMode);
    const ownedStations = useGameStore(s => s.ownedStations);
    const toolsLevel = useGameStore(s => s.toolsLevel);
    const toolEnchantments = useGameStore(s => s.toolEnchantments);
    const playerLevel = useGameStore(s => s.playerLevel);
    const inventory = useGameStore(s => s.inventory);
    
    const setPlayerLevel = useGameStore(s => s.setPlayerLevel);
    const setInventory = useGameStore(s => s.setInventory);
    const addToolEnchantment = useGameStore(s => s.addToolEnchantment);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedToolGroup, setSelectedToolGroup] = useState<string>('pickaxe');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
            if (e.key.toLowerCase() === 'e') {
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!ownedStations['Enchanting Table'] && !isDebugMode) return null;

    const currentToolTier = toolsLevel[selectedToolGroup] || 0;
    const hasTool = currentToolTier > 0;
    const toolData = hasTool ? toolChains[selectedToolGroup][currentToolTier - 1] : null;

    // Identify material string based on tool ID... hacky but works "pick_wood", "pick_stone", "pick_iron"
    const getMaterialFromToolId = (id: string) => {
        if (id.includes('wood')) return 'wood';
        if (id.includes('stone')) return 'stone';
        if (id.includes('iron')) return 'iron';
        if (id.includes('gold')) return 'gold';
        if (id.includes('diamond')) return 'diamond';
        if (id.includes('netherite')) return 'netherite';
        if (id.includes('cooper')) return 'copper';
        return 'stone'; // fallback
    };

    const materialKeys = toolData ? getMaterialFromToolId(toolData.id) : 'stone';
    const matStats = materialStats[materialKeys];
    const enchantability = matStats ? matStats.enchantability : 1;

    const performEnchant = (costType: 1 | 2 | 3) => {
        if (!hasTool) return;
        const lapisCost = costType;
        const levelCost = costType;

        if (!isDebugMode) {
            if (playerLevel < levelCost) {
                alert('Você não tem níveis de experiência suficientes!');
                return;
            }
            if ((inventory['Lapis Lazuli'] || 0) < lapisCost) {
                alert('Você não tem Lápis-Lazúli suficiente!');
                return;
            }

            setPlayerLevel(playerLevel - levelCost);
            setInventory(prev => ({ ...prev, 'Lapis Lazuli': prev['Lapis Lazuli'] - lapisCost }));
        }

        // Lógica de roll de encantamento baseada na enchantability e no tier escolhido.
        const numRolls = costType; // Tier 1: 1 roll, Tier 2: 2 rolls, Tier 3: 3 rolls
        const pool = [...availableEnchantments];

        let enchantsApplied = 0;
        const currentEnchants = toolEnchantments[selectedToolGroup] || {};

        for (let i = 0; i < numRolls; i++) {
            // Chance de sucesso baseada na enchantability do item
            // e ex. tier 3 tem +chance vs tier 1
            const successChance = (enchantability * 2 + costType * 20) / 100;
            if (Math.random() > successChance && i > 0) continue; // Primeiro roll é sempre garantido

            // Pesos:
            let totalWeight = pool.reduce((acc, curr) => acc + curr.weight, 0);
            let rand = Math.random() * totalWeight;

            let selectedEnchant = pool[0];
            for (const ench of pool) {
                if (rand < ench.weight) {
                    selectedEnchant = ench;
                    break;
                }
                rand -= ench.weight;
            }

            // Decide Level (1 a maxLevel) 
            // Tier 3 tem mais chance de maxLevel
            const maxLvl = selectedEnchant.maxLevel;
            let levelGranted = 1;
            if (maxLvl > 1) {
                if (costType === 3) levelGranted = maxLvl - Math.floor(Math.random() * 2); // maxLvl ou maxLvl-1
                else if (costType === 2) levelGranted = Math.max(1, maxLvl - 1 - Math.floor(Math.random() * 2)); // mid lvl
                else levelGranted = 1;

                if (levelGranted < 1) levelGranted = 1;
                if (levelGranted > maxLvl) levelGranted = maxLvl;
            }

            const currentLvl = currentEnchants[selectedEnchant.id] || 0;
            if (levelGranted > currentLvl) {
                addToolEnchantment(selectedToolGroup, selectedEnchant.id, levelGranted);
                enchantsApplied++;
            }
        }

        if (enchantsApplied === 0) {
            alert('A ferramenta absorveu a magia, mas nenhum encantamento melhor do que os atuais pôde ser aplicado!');
        } else {
            // Re-render handled by store
        }
    };

    const getEnchantLevelRoman = (level: number) => {
        const romans = ['I', 'II', 'III', 'IV', 'V'];
        return romans[level - 1] || level.toString();
    };

    return (
        <div className="border-b border-stone-300 dark:border-stone-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 bg-purple-900/10 dark:bg-purple-950/20 hover:bg-purple-900/20 dark:hover:bg-purple-900/40 transition-colors"
                title="Atalho: E"
            >
                <span className="flex items-center gap-3 text-lg font-bold text-purple-800 dark:text-purple-300">
                    <img
                        src="/Enchanting_Table.png"
                        alt="Enchanting Table"
                        className="w-8 h-8 rounded drop-shadow-md"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    Encantamentos
                </span>
                <img
                    src="./src/assets/DownArrow.png"
                    alt="arrow"
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(85%) saturate(1752%) hue-rotate(256deg) brightness(88%) contrast(92%)' }} // Purple-ish arrow
                />
            </button>

            {isOpen && (
                <div className="bg-stone-50 dark:bg-stone-900/50 p-4 relative overflow-hidden">
                    {/* Floating magical particles effect could go here */}

                    <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-2">
                        {['pickaxe', 'shovel', 'axe', 'hoe'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedToolGroup(cat)}
                                className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 capitalize min-w-[100px]
                                ${selectedToolGroup === cat
                                    ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]'
                                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tool Display */}
                        <div className="bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col items-center shadow-inner relative">
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Equipamento Atual</span>
                            
                            <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-950/30 rounded-full flex items-center justify-center relative mb-3">
                                {hasTool && toolData ? (
                                    <>
                                        <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full animate-pulse z-0"></div>
                                        <img src={toolData.icon} alt={toolData.name} className="w-12 h-12 object-contain drop-shadow-lg z-10" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </>
                                ) : (
                                    <span className="text-3xl opacity-20">🪨</span>
                                )}
                            </div>
                            
                            <h4 className="font-extrabold text-stone-800 dark:text-stone-200 text-center text-sm">
                                {hasTool && toolData ? toolData.name : 'Nenhuma Ferramenta'}
                            </h4>
                            {hasTool && (
                                <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-1 uppercase tracking-wider">
                                    Encantabilidade: {enchantability}
                                </p>
                            )}

                            {hasTool && (
                                <div className="w-full mt-4 flex flex-col gap-1">
                                    {Object.entries(toolEnchantments[selectedToolGroup] || {}).map(([enchId, lvl]) => {
                                        const enchDef = availableEnchantments.find(e => e.id === enchId);
                                        return (
                                            <div key={enchId} className="w-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1.5 rounded-md flex justify-between items-center border border-purple-200 dark:border-purple-800/50">
                                                <span>{enchDef ? enchDef.name : enchId} {getEnchantLevelRoman(lvl)}</span>
                                            </div>
                                        );
                                    })}
                                    {Object.keys(toolEnchantments[selectedToolGroup] || {}).length === 0 && (
                                        <p className="text-xs text-stone-400 font-bold italic text-center py-2">Sem encantamentos</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cost selection */}
                        <div className="flex flex-col gap-2 relative">
                            <div className="absolute top-2 right-2 flex gap-3 text-xs font-black z-10">
                                <span className="flex items-center gap-1 text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30 px-2 py-1 rounded">Exp: {playerLevel}</span>
                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">Lápis: {inventory['Lapis Lazuli'] || 0}</span>
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1 ml-1 mt-8 md:mt-0">Realizar Encantamento</span>
                            
                            {[1, 2, 3].map((tier) => (
                                <button
                                    key={tier}
                                    onClick={() => performEnchant(tier as 1 | 2 | 3)}
                                    disabled={!hasTool}
                                    className={`w-full flex justify-between items-center p-3 rounded-xl border-2 transition-all shadow-sm ${
                                        hasTool ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 group' : 'bg-stone-200 dark:bg-stone-900/50 border-stone-300 dark:border-stone-800 opacity-50 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="flex flex-col text-left">
                                        <span className={`text-sm font-black ${hasTool ? 'text-stone-700 dark:text-stone-300 group-hover:text-purple-700 dark:group-hover:text-purple-300' : "text-stone-400"}`}>
                                            Nível {tier} <span className="text-[10px] ml-1 opacity-60 uppercase font-bold">Magia {tier === 1 ? 'Fraca' : tier === 2 ? 'Média' : 'Poderosa'}</span>
                                        </span>
                                    </div>
                                    <div className="flex gap-2 text-xs font-bold">
                                        <span className={`flex items-center gap-1 bg-lime-100 dark:bg-lime-900/30 px-2 py-1 rounded ${hasTool && playerLevel < tier ? 'text-red-500' : 'text-lime-600 dark:text-lime-400'}`}>
                                            -{tier} XP
                                        </span>
                                        <span className={`flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded ${hasTool && (inventory['Lapis Lazuli'] || 0) < tier ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                                            -{tier} Lázuli
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
