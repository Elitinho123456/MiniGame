import { useGameStore } from '../store/useGameStore';

interface InventoryPanelProps {
    inventory: Record<string, number>;
    currentCapacity: number;
    maxCapacity: number;
}

export default function InventoryPanel({
    inventory,
    currentCapacity,
    maxCapacity,
}: InventoryPanelProps) {
    const isInventoryMinimized = useGameStore(s => s.isInventoryMinimized);
    const setIsInventoryMinimized = useGameStore(s => s.setIsInventoryMinimized);

    return (
        <div className="p-6 bg-stone-200 dark:bg-stone-900 border-b border-stone-300 dark:border-stone-800 sticky top-0 z-20 shadow-xl flex flex-col transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                    <img
                        src="/Backpack.png"
                        alt="Backpack"
                        className="w-8 h-8 drop-shadow-md"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    Inventário
                </h3>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-sm font-bold px-3 py-1 bg-stone-100 dark:bg-stone-950 rounded-full border ${currentCapacity >= maxCapacity ? 'text-red-500 border-red-500' : 'text-stone-500 border-stone-300 dark:border-stone-700'}`}
                    >
                        {currentCapacity} / {maxCapacity}
                    </span>
                    <button 
                        onClick={() => setIsInventoryMinimized(!isInventoryMinimized)}
                        className="w-8 h-8 flex items-center justify-center bg-stone-300 dark:bg-stone-800 hover:bg-stone-400 dark:hover:bg-stone-700 rounded-full transition-colors"
                    >
                        <img 
                            src="./src/assets/DownArrow.png" 
                            alt="Toggle" 
                            className={`w-4 h-4 transition-transform duration-300 ${isInventoryMinimized ? 'rotate-180' : ''}`}
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </button>
                </div>
            </div>
            
            {!isInventoryMinimized && (
                <div className="max-h-56 md:max-h-72 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-3 transition-all">
                {Object.entries(inventory).map(
                    ([resourceName, amount]) =>
                        amount > 0 && (
                            <div
                                key={resourceName}
                                className="flex items-center gap-3 bg-white dark:bg-stone-950 p-2 md:p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform shrink-0 border border-stone-200 dark:border-stone-800">
                                    <img
                                        src={`/${resourceName.replaceAll(' ', '_')}.webp`}
                                        alt={resourceName}
                                        className="w-full h-full object-contain drop-shadow-sm"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span
                                        className="text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider truncate"
                                        title={resourceName.replace(/_/g, ' ')}
                                    >
                                        {resourceName.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-lg md:text-xl font-black text-stone-800 dark:text-stone-200">
                                        {amount}
                                    </span>
                                </div>
                            </div>
                        )
                )}
            </div>
            )}
        </div>
    );
}
