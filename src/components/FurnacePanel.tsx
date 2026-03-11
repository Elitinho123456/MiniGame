import { useState } from 'react';
import { furnaceRecipes, blastFurnaceRecipes, fuelItems, nameMap } from '../assets/consts';

export type SmeltingState = {
    type: 'furnace' | 'blast_furnace';
    input: string;
    fuel: string;
    progress: number;
    totalTime: number;
    output: string;
    readyCount: number; // how many items are ready to claim
};

interface FurnacePanelProps {
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    ownedStations: Record<string, boolean>;
    furnaceState: SmeltingState | null;
    setFurnaceState: React.Dispatch<React.SetStateAction<SmeltingState | null>>;
}

export default function FurnacePanel({
    inventory,
    setInventory,
    ownedStations,
    furnaceState,
    setFurnaceState,
}: FurnacePanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<'furnace' | 'blast_furnace'>('furnace');
    
    // State for setting up a new task
    const [selectedInput, setSelectedInput] = useState<string>('');
    const [selectedFuel, setSelectedFuel] = useState<string>('');

    if (!ownedStations['Furnace'] && !ownedStations['Blast Furnace']) return null;

    const recipes = selectedType === 'furnace' ? furnaceRecipes : blastFurnaceRecipes;
    const isSmelting = furnaceState !== null;

    const startSmelting = () => {
        if (!selectedInput || !selectedFuel) return;
        if ((inventory[selectedInput] || 0) <= 0) {
            alert('Você não tem esse minério!');
            return;
        }
        if ((inventory[selectedFuel] || 0) <= 0) {
            alert('Você não tem esse combustível!');
            return;
        }
        
        const recipe = recipes[selectedInput];
        if (!recipe) return;

        // Take 1 item and 1 fuel
        setInventory(prev => ({
            ...prev,
            [selectedInput]: prev[selectedInput] - 1,
            [selectedFuel]: prev[selectedFuel] - 1
        }));

        setFurnaceState({
            type: selectedType,
            input: selectedInput,
            fuel: selectedFuel,
            progress: 0,
            totalTime: recipe.time,
            output: recipe.output,
            readyCount: 0
        });
        
        // Reset selections to default
        setSelectedInput('');
        setSelectedFuel('');
    };

    const claimOutput = () => {
        if (furnaceState && furnaceState.readyCount > 0) {
            setInventory(prev => ({
                ...prev,
                [furnaceState.output]: (prev[furnaceState.output] || 0) + furnaceState.readyCount
            }));
            
            // If still melting something, keep it running but reset readyCount
            if (furnaceState.progress > 0 && furnaceState.progress < furnaceState.totalTime) {
                setFurnaceState(prev => prev ? { ...prev, readyCount: 0 } : null);
            } else {
                setFurnaceState(null);
            }
        }
    };

    return (
        <div className="border-b border-stone-300 dark:border-stone-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
            >
                <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                    <img
                        src="/Furnace.webp"
                        alt="Furnace"
                        className="w-8 h-8 rounded drop-shadow-sm"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    Fornalha
                </span>
                <img
                    src="./src/assets/DownArrow.png"
                    alt="arrow"
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </button>

            {isOpen && (
                <div className="bg-stone-50 dark:bg-stone-900/50 p-4">
                    
                    {/* Tabs for Furnace Types */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setSelectedType('furnace')}
                            disabled={!ownedStations['Furnace'] || isSmelting}
                            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 
                                ${selectedType === 'furnace' 
                                    ? 'bg-amber-500 text-white shadow-md' 
                                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300'}
                                ${!ownedStations['Furnace'] ? 'opacity-50 cursor-not-allowed' : ''}
                                ${isSmelting && selectedType !== 'furnace' ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                            <img src="/Furnace.webp" className="w-5 h-5 drop-shadow" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            Normal
                        </button>
                        <button
                            onClick={() => setSelectedType('blast_furnace')}
                            disabled={!ownedStations['Blast Furnace'] || isSmelting}
                            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
                                ${selectedType === 'blast_furnace' 
                                    ? 'bg-amber-600 text-white shadow-md' 
                                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-300'}
                                ${!ownedStations['Blast Furnace'] ? 'opacity-50 cursor-not-allowed' : ''}
                                ${isSmelting && selectedType !== 'blast_furnace' ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                            <img src="/Blast_Furnace.webp" className="w-5 h-5 drop-shadow" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            Alto-forno
                        </button>
                    </div>

                    <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-inner relative overflow-hidden flex flex-col items-center">
                        
                        {/* Background subtle glow if melting */}
                        {isSmelting && (
                            <div className="absolute inset-0 bg-linear-to-t from-orange-500/10 to-transparent pointer-events-none animate-pulse"></div>
                        )}

                        <div className="flex w-full items-center justify-between gap-4 z-10 relative">
                            
                            {/* Inputs Column */}
                            <div className="flex flex-col gap-3 flex-1">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-wider mb-1 ml-1">Minério</label>
                                    <select 
                                        value={isSmelting ? furnaceState.input : selectedInput} 
                                        onChange={(e) => setSelectedInput(e.target.value)}
                                        disabled={isSmelting}
                                        className="bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl p-2 font-semibold text-sm outline-none w-full disabled:opacity-80"
                                    >
                                        <option value="">Selecione...</option>
                                        {Object.keys(recipes).map(ore => {
                                            const count = inventory[ore] || 0;
                                            if (!isSmelting && count <= 0) return null;
                                            return <option key={ore} value={ore}>{nameMap[ore] || ore} ({count})</option>
                                        })}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-orange-400 tracking-wider mb-1 ml-1">Combustível</label>
                                    <select 
                                        value={isSmelting ? furnaceState.fuel : selectedFuel} 
                                        onChange={(e) => setSelectedFuel(e.target.value)}
                                        disabled={isSmelting}
                                        className="bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl p-2 font-semibold text-sm outline-none w-full disabled:opacity-80"
                                    >
                                        <option value="">Selecione...</option>
                                        {Object.keys(fuelItems).map(fuel => {
                                            const count = inventory[fuel] || 0;
                                            if (!isSmelting && count <= 0) return null;
                                            return <option key={fuel} value={fuel}>{nameMap[fuel] || fuel} ({count})</option>
                                        })}
                                    </select>
                                </div>
                            </div>

                            {/* Center Animated Furnace / Progress */}
                            <div className="flex flex-col items-center justify-center px-4">
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                    {/* Circular Progress Ring */}
                                    {isSmelting ? (
                                        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                                            <path
                                                className="text-stone-200 dark:text-stone-800"
                                                strokeWidth="3"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                                className="text-orange-500 transition-all duration-100"
                                                strokeDasharray={`${(furnaceState.progress / furnaceState.totalTime) * 100}, 100`}
                                                strokeWidth="3"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                    ) : (
                                        <div className="absolute inset-0 border-4 border-stone-200 dark:border-stone-800 rounded-full"></div>
                                    )}
                                    <span className="text-3xl relative z-10 transition-transform duration-300 hover:scale-110">
                                        {isSmelting ? '🔥' : '⚙️'}
                                    </span>
                                </div>
                            </div>

                            {/* Output Box */}
                            <div className="flex flex-col items-center flex-1">
                                <label className="text-[10px] font-black uppercase text-emerald-500 tracking-wider mb-2">Pronto</label>
                                <div className={`w-20 h-20 bg-stone-100 dark:bg-stone-900 border-2 rounded-xl flex items-center justify-center relative transition-all duration-500 ${furnaceState && furnaceState.readyCount > 0 ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-dashed border-stone-300 dark:border-stone-700'}`}>
                                    {furnaceState && furnaceState.readyCount > 0 ? (
                                        <>
                                            <img src={`/${furnaceState.output.replace(/ /g, '_')}.webp`} className="w-10 h-10 object-contain drop-shadow" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                            <span className="absolute -top-3 -right-3 bg-emerald-500 text-white font-black text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-stone-900">
                                                {furnaceState.readyCount}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-stone-300 dark:text-stone-700 text-2xl">📦</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="w-full mt-6 flex gap-3 relative z-10">
                            {isSmelting ? (
                                <>
                                    <button
                                        onClick={claimOutput}
                                        disabled={furnaceState.readyCount === 0}
                                        className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-md ${furnaceState.readyCount > 0 ? 'bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg hover:-translate-y-1' : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'}`}
                                    >
                                        Coletar Items
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={startSmelting}
                                    disabled={!selectedInput || !selectedFuel}
                                    className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-md ${!selectedInput || !selectedFuel ? 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-400 hover:shadow-lg hover:-translate-y-1'}`}
                                >
                                    Derreter
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
