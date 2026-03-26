import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { availableCrops, nameMap, type CropDef } from '../assets/consts';

export default function FarmingPanel() {
    const farmingSlots = useGameStore(s => s.farmingSlots);
    const farmingLevel = useGameStore(s => s.farmingLevel);
    const farmingXp = useGameStore(s => s.farmingXp);
    const inventory = useGameStore(s => s.inventory);
    
    const setFarmingSlots = useGameStore(s => s.setFarmingSlots);
    const setInventory = useGameStore(s => s.setInventory);
    const addFarmingXp = useGameStore(s => s.addFarmingXp);
    const unlockFarmingSlot = useGameStore(s => s.unlockFarmingSlot);

    const [currentTime, setCurrentTime] = useState(Date.now());
    const [selectedSlotConfig, setSelectedSlotConfig] = useState<number | null>(null);
    const [selectedSeedToPlant, setSelectedSeedToPlant] = useState<string>('');

    // Force re-render every second to update growth timers
    useEffect(() => {
        const int = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(int);
    }, []);

    const cropMap = new Map<string, CropDef>();
    availableCrops.forEach(c => cropMap.set(c.seedId, c));

    // Seeds in inventory
    const seedsInInventory = Object.keys(inventory).filter(item => 
        item.includes('Seed') || item.includes('Wart') || item.includes('Fruit') // Simple heuristic, exact matching is better via cropMap
    ).filter(item => cropMap.has(item) && inventory[item] > 0);

    const handlePlant = (slotId: number) => {
        if (!selectedSeedToPlant) return;
        if ((inventory[selectedSeedToPlant] || 0) <= 0) return;

        setInventory(prev => ({ ...prev, [selectedSeedToPlant]: prev[selectedSeedToPlant] - 1 }));
        setFarmingSlots(prev => prev.map(s => 
            s.id === slotId ? { ...s, seed: selectedSeedToPlant, plantedAt: Date.now(), wateredAt: null, fertilizer: null } : s
        ));
        setSelectedSlotConfig(null);
    };

    const handleWater = (slotId: number) => {
        setFarmingSlots(prev => prev.map(s => 
            s.id === slotId ? { ...s, wateredAt: Date.now() } : s
        ));
    };

    const handleFertilize = (slotId: number, fertilizer: string) => {
        if ((inventory[fertilizer] || 0) <= 0) return;
        setInventory(prev => ({ ...prev, [fertilizer]: prev[fertilizer] - 1 }));
        setFarmingSlots(prev => prev.map(s => 
            s.id === slotId ? { ...s, fertilizer } : s
        ));
    };

    const handleHarvest = (slotId: number) => {
        const slot = farmingSlots.find(s => s.id === slotId);
        if (!slot || !slot.seed || !slot.plantedAt) return;

        const crop = cropMap.get(slot.seed);
        if (!crop) return;

        setInventory(prev => ({ ...prev, [crop.name]: (prev[crop.name] || 0) + crop.baseYield }));
        
        // XP Gain depends on rarity
        const xpGain = crop.rarity === 'Lendário' ? 100 : crop.rarity === 'Épico' ? 50 : crop.rarity === 'Raro' ? 25 : 10;
        addFarmingXp(xpGain);

        // Reset slot
        setFarmingSlots(prev => prev.map(s => 
            s.id === slotId ? { ...s, seed: null, plantedAt: null, wateredAt: null, fertilizer: null } : s
        ));
    };

    const costToUnlockNextSlot = (farmingSlots.length + 1) * 500;
    const mineCoins = useGameStore(s => s.mineCoins);
    const setMineCoins = useGameStore(s => s.setMineCoins);

    const handleUnlockSlot = () => {
        if (mineCoins >= costToUnlockNextSlot) {
            setMineCoins(prev => prev - costToUnlockNextSlot);
            unlockFarmingSlot();
        } else {
            alert('MineCoins insuficientes!');
        }
    };

    // Calculate level requirements for progress bar
    const requiredXp = (farmingLevel + 1) * 100;
    const progressFill = Math.min(100, (farmingXp / requiredXp) * 100);

    return (
        <div className="p-4 md:p-6 pb-20 max-w-7xl mx-auto w-full">
            {/* Header / Stats */}
            <div className="bg-lime-900/10 dark:bg-lime-950/20 border-2 border-lime-500/30 rounded-2xl p-6 mb-6 shadow-inner ring-1 ring-black/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                
                <div className="flex items-center gap-4 z-10 w-full md:w-auto">
                    <div className="w-16 h-16 bg-linear-to-br from-lime-400 to-green-600 rounded-xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/20">
                        🌱
                    </div>
                    <div className="flex flex-col flex-1">
                        <h2 className="text-2xl font-black text-lime-800 dark:text-lime-400 tracking-tight">Agricultura</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300 px-2 py-0.5 rounded shadow-sm">Nível {farmingLevel}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-96 flex flex-col gap-2 z-10">
                    <div className="flex justify-between text-xs font-bold text-stone-500 uppercase">
                        <span>XP Cultivo</span>
                        <span>{farmingXp} / {requiredXp}</span>
                    </div>
                    <div className="h-3 w-full bg-stone-200 dark:bg-stone-900 rounded-full overflow-hidden shadow-inner flex border border-stone-300 dark:border-stone-700">
                        <div className="h-full bg-linear-to-r from-lime-400 to-green-500 transition-all duration-500" style={{ width: `${progressFill}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Farm Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {farmingSlots.map(slot => {
                    const isPlanted = slot.seed !== null;
                    const crop = isPlanted ? cropMap.get(slot.seed!) : null;
                    
                    let growthStage = 0; // 0: new, 1: growing, 2: ready
                    let isReady = false;
                    let timeRemaining = 0;

                    if (isPlanted && crop) {
                        let totalTimeRequired = crop.baseGrowthTime * 1000;
                        if (slot.wateredAt) totalTimeRequired *= 0.8; // Água reduz 20%
                        if (slot.fertilizer === 'Bone Meal') totalTimeRequired *= 0.5; // Bone meal corta na metade
                        else if (slot.fertilizer === 'Magic Fertilizer') totalTimeRequired *= 0.2; // Corta 80%

                        const elapsed = currentTime - (slot.plantedAt || currentTime);
                        timeRemaining = Math.max(0, totalTimeRequired - elapsed);
                        isReady = timeRemaining === 0;

                        if (isReady) growthStage = 2;
                        else if (elapsed > totalTimeRequired / 2) growthStage = 1;
                    }

                    return (
                        <div key={slot.id} className="bg-[#5c4033] dark:bg-[#3e2723] rounded-xl border-4 border-[#3e2723] dark:border-[#261410] aspect-square relative shadow-lg group overflow-hidden flex flex-col items-center justify-end p-2 cursor-pointer hover:brightness-110 transition-all"
                             onClick={() => !isPlanted ? setSelectedSlotConfig(slot.id) : (isReady && handleHarvest(slot.id))}
                        >
                            {/* Visual do solo molhado vs seco */}
                            <div className={`absolute inset-0 pattern-dots ${slot.wateredAt ? 'bg-[#4e342e]' : 'bg-[#5c4033]'} opacity-50`}></div>
                            
                            {/* Plant rendering */}
                            <div className="z-10 absolute inset-0 flex flex-col items-center justify-center">
                                {isPlanted && crop ? (
                                    <>
                                        <div className={`text-5xl drop-shadow-lg transition-transform ${isReady ? 'scale-110 animate-bounce' : 'scale-75'}`}>
                                            {growthStage === 0 ? '🌱' : growthStage === 1 ? '🌿' : crop.icon}
                                        </div>
                                        {!isReady ? (
                                            <div className="absolute bottom-2 text-white font-black text-xs bg-black/50 px-2 py-0.5 rounded shadow">
                                                {Math.ceil(timeRemaining / 1000)}s
                                            </div>
                                        ) : (
                                            <div className="absolute top-2 w-full text-center">
                                                <span className="text-white font-black text-xs bg-emerald-500 px-2 py-0.5 rounded-full shadow-lg border border-white animate-pulse">COLHER</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-stone-400 dark:text-[#a1887f] font-bold text-xs opacity-50 uppercase tracking-widest">+ Plantar</span>
                                )}
                            </div>

                            {/* Fertilizer / Water indicators */}
                            {isPlanted && !isReady && (
                                <div className="absolute top-2 left-2 flex gap-1 z-20">
                                    {!slot.wateredAt && (
                                        <button onClick={(e) => { e.stopPropagation(); handleWater(slot.id); }} className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 text-xs" title="Regar">
                                            💧
                                        </button>
                                    )}
                                    {!slot.fertilizer && (
                                        <button onClick={(e) => { e.stopPropagation(); handleFertilize(slot.id, 'Bone Meal'); }} className="w-6 h-6 bg-stone-200 text-stone-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 text-xs font-bold border border-stone-400" title="Usar Bone Meal">
                                            🦴
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Unlock new slot */}
                {farmingSlots.length < 20 && (
                    <button 
                        onClick={handleUnlockSlot}
                        className="bg-stone-200 dark:bg-stone-800/50 rounded-xl border-4 border-dashed border-stone-300 dark:border-stone-700 aspect-square flex flex-col items-center justify-center gap-2 hover:border-lime-500 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-colors group cursor-pointer"
                    >
                        <span className="text-3xl text-stone-400 group-hover:text-lime-500 transition-colors">➕</span>
                        <div className="flex items-center gap-1 font-black text-stone-500 group-hover:text-lime-600 text-xs">
                            <span className="text-yellow-500">📀</span> {costToUnlockNextSlot}
                        </div>
                    </button>
                )}
            </div>

            {/* Planting Modal */}
            {selectedSlotConfig !== null && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedSlotConfig(null)}>
                    <div className="bg-stone-100 dark:bg-stone-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-300 dark:border-stone-700" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-white dark:bg-stone-950">
                            <h3 className="font-black text-lg text-stone-800 dark:text-stone-200 flex items-center gap-2">
                                <span>🌱</span> Escolha uma Semente
                            </h3>
                            <button onClick={() => setSelectedSlotConfig(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 hover:bg-red-100 hover:text-red-500 font-bold transition-colors">X</button>
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                            {seedsInInventory.length === 0 ? (
                                <div className="p-8 text-center text-stone-500 font-bold flex flex-col items-center gap-2">
                                    <span className="text-4xl opacity-50">🌾</span>
                                    Você não tem nenhuma semente ou muda no inventário.
                                </div>
                            ) : (
                                seedsInInventory.map(seedName => {
                                    const c = cropMap.get(seedName);
                                    if (!c) return null;
                                    return (
                                        <button 
                                            key={seedName}
                                            onClick={() => { setSelectedSeedToPlant(seedName); }}
                                            className={`p-3 border-2 rounded-xl flex items-center gap-3 transition-colors text-left ${selectedSeedToPlant === seedName ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20' : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-stone-300'}`}
                                        >
                                            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex flex-col items-center justify-center shrink-0 border border-stone-200">
                                                <img src={`/${seedName.replace(/ /g, '_')}.webp`} className="w-8 h-8 object-contain" alt={seedName} onError={(e) => (e.currentTarget.style.display = 'none')} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-stone-800 dark:text-stone-200">{nameMap[seedName] || seedName}</h4>
                                                <p className="text-xs text-stone-500">Cresce em {c.baseGrowthTime}s • Rende {c.baseYield} {c.name}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-black uppercase text-stone-400">Em posse</span>
                                                <span className="font-bold text-lg text-stone-700 dark:text-stone-300">{inventory[seedName]}</span>
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex justify-end gap-3">
                            <button onClick={() => setSelectedSlotConfig(null)} className="px-5 py-2 rounded-lg font-bold text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors">Cancelar</button>
                            <button onClick={() => handlePlant(selectedSlotConfig)} disabled={!selectedSeedToPlant} className="px-5 py-2 bg-lime-500 hover:bg-lime-400 text-white rounded-lg font-bold text-sm shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider">
                                Plantar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
