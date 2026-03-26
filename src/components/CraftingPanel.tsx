import { useState, useEffect } from 'react';
import { toolChains, handRecipes, workbenchRecipes } from '../assets/consts';

export type CraftingTask = {
    toolCategory?: string;
    tier?: number;
    customRecipe?: any;
    name: string;
    progress: number;
    totalTime: number;
};

interface CraftingPanelProps {
    toolsLevel: Record<string, number>;
    activeCraft: CraftingTask | null;
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    ownedStations: Record<string, boolean>;
    setActiveCraft: React.Dispatch<React.SetStateAction<CraftingTask | null>>;
    activeUpgrades: string[];
    isDebugMode?: boolean;
}

export default function CraftingPanel({
    toolsLevel,
    activeCraft,
    inventory,
    setInventory,
    ownedStations,
    setActiveCraft,
    activeUpgrades,
    isDebugMode
}: CraftingPanelProps) {
    const [isCraftingOpen, setIsCraftingOpen] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<'manual' | 'bancada'>('manual');
    const [selectedToolTiers, setSelectedToolTiers] = useState<Record<string, number>>({});
    const [craftMultiplier, setCraftMultiplier] = useState<number | 'max'>(1);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
            if (e.key.toLowerCase() === 'c') {
                setIsCraftingOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    function canAfford(cost: Record<string, number>) {
        if (isDebugMode) return true;
        for (const [res, amount] of Object.entries(cost)) {
            if ((inventory[res] || 0) < amount) return false;
        }
        return true;
    }

    function deductCost(cost: Record<string, number>) {
        if (isDebugMode) return;
        setInventory(prev => {
            const next = { ...prev };
            for (const [res, amount] of Object.entries(cost)) {
                next[res] -= amount;
            }
            return next;
        });
    }

    function handleHandCraft(recipe: any) {
        if (activeCraft) {
            alert('Você já está craftando um item!');
            return;
        }
        
        let actualAmount = typeof craftMultiplier === 'number' ? craftMultiplier : 1;
        if (craftMultiplier === 'max') {
            let maxCount = Infinity;
            if (isDebugMode) {
                maxCount = 100;
            } else {
                for (const [res, count] of Object.entries(recipe.cost)) {
                    const available = inventory[res] || 0;
                    const possible = Math.floor(available / (count as number));
                    if (possible < maxCount) maxCount = possible;
                }
            }
            if (maxCount === 0 || maxCount === Infinity) {
                alert('Recursos insuficientes!');
                return;
            }
            actualAmount = maxCount;
        }

        const cost: Record<string, number> = {};
        for (const [res, count] of Object.entries(recipe.cost)) {
            cost[res] = (count as number) * actualAmount;
        }

        if (!canAfford(cost)) {
            alert('Recursos insuficientes!');
            return;
        }
        deductCost(cost);

        let timeMultiplier = 1;
        if (activeUpgrades.includes('upg_crafting_1')) timeMultiplier -= 0.2;

        const multipliedRecipe = {
            ...recipe,
            amount: recipe.amount * actualAmount,
            cost: cost,
        };

        setActiveCraft({
            customRecipe: multipliedRecipe,
            name: `${recipe.name} (x${actualAmount})`,
            progress: 0,
            totalTime: isDebugMode ? 0 : (recipe.craftTime || 2) * actualAmount * timeMultiplier,
        });
    }

    function startToolCraft(toolCategory: string, tier: number) {
        if (activeCraft) {
            alert('Você já está craftando um item!');
            return;
        }
        const tool = toolChains[toolCategory][tier];
        if (!canAfford(tool.cost)) {
            alert('Recursos insuficientes!');
            return;
        }
        deductCost(tool.cost);

        let timeMultiplier = 1;
        if (activeUpgrades.includes('upg_crafting_1')) timeMultiplier -= 0.2;

        setActiveCraft({
            toolCategory,
            tier,
            name: tool.name,
            progress: 0,
            totalTime: isDebugMode ? 0 : (tool.craftTime || 2) * timeMultiplier,
        });
    }

    return (
        <div className="border-b border-stone-300 dark:border-stone-800">
            <button
                onClick={() => setIsCraftingOpen(!isCraftingOpen)}
                className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
            >
                <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                    <img
                        src="/Crafting_Table.webp"
                        alt="Crafting"
                        className="w-8 h-8 rounded drop-shadow-sm"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    Criação
                </span>
                <img
                    src="./src/assets/DownArrow.png"
                    alt="arrow"
                    className={`w-4 h-4 transition-transform duration-300 ${isCraftingOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </button>

            {isCraftingOpen && (
                <div className="bg-stone-50 dark:bg-stone-900/50">
                    <div className="flex border-b border-stone-300 dark:border-stone-700">
                        <button
                            onClick={() => setActiveSection('manual')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeSection === 'manual' ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800/50'}`}
                        >
                            <div className="flex justify-center items-center gap-2">
                                <span className="text-xl">✋</span> Manual
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveSection('bancada')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeSection === 'bancada' ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800/50'} ${!ownedStations['Crafting Table'] && !isDebugMode ? 'opacity-50' : ''}`}
                            disabled={!ownedStations['Crafting Table'] && !isDebugMode}
                            title={!ownedStations['Crafting Table'] && !isDebugMode ? 'Crafte uma Bancada de Trabalho antes' : ''}
                        >
                            <div className="flex justify-center items-center gap-2">
                                <img src="/Crafting_Table.webp" className="w-5 h-5 drop-shadow" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                Bancada
                            </div>
                        </button>
                    </div>

                    <div className="flex bg-stone-100 dark:bg-stone-900 justify-center gap-2 py-2 border-b border-stone-300 dark:border-stone-700">
                        <span className="text-xs font-bold text-stone-500 uppercase flex items-center mr-2">Qtd:</span>
                        {[1, 5, 10, 'max'].map(val => (
                            <button
                                key={val.toString()}
                                onClick={() => setCraftMultiplier(val as number | 'max')}
                                className={`px-3 py-1 rounded font-bold text-xs transition-colors ${craftMultiplier === val ? 'bg-emerald-500 text-white shadow-sm' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-700'}`}
                            >
                                {val === 'max' ? 'MÁX' : `x${val}`}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 space-y-3 max-h-100 overflow-y-auto custom-scrollbar">
                        {activeCraft && (
                            <div className="bg-white dark:bg-stone-800 p-3 border border-emerald-500 rounded-xl mb-4 shadow-sm relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-emerald-500/10 transition-all duration-100"
                                    style={{
                                        width: `${(activeCraft.progress / activeCraft.totalTime) * 100}%`,
                                    }}
                                />
                                <div className="relative z-10">
                                    <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm mb-1">
                                        Craftando:{' '}
                                        {activeCraft.name}
                                    </h4>
                                    <p className="text-xs text-stone-500 font-bold">
                                        {Math.min(activeCraft.totalTime, activeCraft.progress).toFixed(1)}s / {activeCraft.totalTime}s
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeSection === 'manual' && (
                            <>
                                {handRecipes.map(recipe => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => handleHandCraft(recipe)}
                                        className="w-full text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl hover:border-emerald-500 transition-colors flex gap-3 group shadow-sm"
                                    >
                                        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform p-1">
                                            <img src={recipe.icon} alt={recipe.name} className="w-full h-full object-contain drop-shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-stone-800 dark:text-stone-200">
                                                {recipe.name} (x{recipe.amount})
                                            </h4>
                                            <div className="mt-2 text-xs text-stone-500">
                                                Custo:
                                                {Object.entries(recipe.cost).map(([res, amount]) => (
                                                    <span
                                                        key={res}
                                                        className={`ml-1 inline-block px-1.5 py-0.5 rounded font-bold ${inventory[res] >= (amount as number) ? 'bg-stone-200 dark:bg-stone-900 text-stone-700 dark:text-stone-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-500'}`}
                                                    >
                                                        {amount as number} {res}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}

                        {activeSection === 'bancada' && (
                            <>
                                {/* Bancada Items (Furnace, Shears, etc) */}
                                {workbenchRecipes.map(recipe => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => handleHandCraft(recipe)}
                                        className={`w-full text-left bg-white dark:bg-stone-800 border p-3 rounded-xl transition-colors flex gap-3 group shadow-sm ${ownedStations[recipe.creates] && ['Furnace', 'Blast Furnace'].includes(recipe.creates) && !isDebugMode ? 'opacity-50 border-stone-300 dark:border-stone-700 cursor-not-allowed' : 'border-stone-200 dark:border-stone-700 hover:border-amber-500 cursor-pointer'}`}
                                        disabled={ownedStations[recipe.creates] && ['Furnace', 'Blast Furnace'].includes(recipe.creates) && !isDebugMode}
                                    >
                                        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform p-1">
                                            <img src={recipe.icon} alt={recipe.name} className="w-full h-full object-contain drop-shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-stone-800 dark:text-stone-200">
                                                {recipe.name} {ownedStations[recipe.creates] && ['Furnace', 'Blast Furnace'].includes(recipe.creates) && <span className="text-emerald-500 text-[10px] uppercase font-bold ml-1">(Aberto)</span>}
                                            </h4>
                                            <div className="mt-2 text-xs text-stone-500">
                                                Custo:
                                                {Object.entries(recipe.cost).map(([res, amount]) => (
                                                    <span
                                                        key={res}
                                                        className={`ml-1 inline-block px-1.5 py-0.5 rounded font-bold ${inventory[res] >= (amount as number) ? 'bg-stone-200 dark:bg-stone-900 text-stone-700 dark:text-stone-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-500'}`}
                                                    >
                                                        {amount as number} {res}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                <div className="w-full h-px bg-stone-300 dark:bg-stone-700 my-4" />
                                <h3 className="font-black text-stone-400 uppercase text-xs tracking-wider px-2">Ferramentas Disponíveis</h3>

                                {/* Tools Selection with Dropdown */}
                                {Object.keys(toolChains).map((toolCategory) => {
                                    const highestTierUnlocked = toolsLevel[toolCategory] || 0;
                                    
                                    // We default the select to the highest tier they can craft
                                    // But if they haven't selected yet, we default to the next tier (highestTierUnlocked)
                                    const selectedTier = selectedToolTiers[toolCategory] !== undefined 
                                        ? selectedToolTiers[toolCategory] 
                                        : Math.min(highestTierUnlocked, toolChains[toolCategory].length - 1);

                                    const tool = toolChains[toolCategory][selectedTier];
                                    if (!tool) return null;

                                    return (
                                        <div key={toolCategory} className="w-full mt-2 text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl hover:border-emerald-500 transition-colors flex flex-col gap-2 group shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-stone-800 dark:text-stone-200 capitalize">
                                                    Equipamento: {toolCategory}
                                                </h4>
                                                <select 
                                                    value={selectedTier}
                                                    onChange={(e) => setSelectedToolTiers(prev => ({ ...prev, [toolCategory]: parseInt(e.target.value) }))}
                                                    className="bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-md px-2 py-1 text-sm font-bold text-stone-700 dark:text-stone-300 outline-none focus:border-emerald-500"
                                                >
                                                    {toolChains[toolCategory].slice(0, Math.min(highestTierUnlocked + 1, toolChains[toolCategory].length)).map((t, i) => (
                                                        <option key={t.id} value={i}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="relative w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform p-1">
                                                    <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain drop-shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                </div>
                                                <div className="flex-1 px-1">
                                                    <div className="flex justify-between items-center pr-2">
                                                        <h4 className="font-bold text-stone-800 dark:text-stone-200 pr-4">
                                                            {tool.name}
                                                        </h4>
                                                        <button 
                                                            onClick={() => startToolCraft(toolCategory, selectedTier)}
                                                            className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded hover:bg-emerald-200 dark:hover:bg-emerald-800/60 transition-colors border border-emerald-300 dark:border-emerald-700"
                                                        >
                                                            CRIAR
                                                        </button>
                                                    </div>
                                                    <div className="mt-2 text-xs text-stone-500">
                                                        Custo:
                                                        {Object.entries(tool.cost).map(([res, amount]) => (
                                                            <span
                                                                key={res}
                                                                className={`ml-1 mb-1 inline-block px-1.5 py-0.5 rounded font-bold ${isDebugMode || inventory[res] >= (amount as number) ? 'bg-stone-200 dark:bg-stone-900 text-stone-700 dark:text-stone-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-500'}`}
                                                            >
                                                                {amount as number} {res}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
