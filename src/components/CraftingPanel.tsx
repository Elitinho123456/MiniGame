import { useState } from 'react';
import { toolChains } from '../assets/consts';

export type CraftingTask = {
    toolCategory: string;
    tier: number;
    progress: number;
    totalTime: number;
};

interface CraftingPanelProps {
    toolsLevel: Record<string, number>;
    activeCraft: CraftingTask | null;
    buyTool: (category: string) => void;
}

export default function CraftingPanel({
    toolsLevel,
    activeCraft,
    buyTool,
}: CraftingPanelProps) {
    const [isCraftingOpen, setIsCraftingOpen] = useState<boolean>(false);

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
                    Crafting
                </span>
                <img
                    src="./src/assets/DownArrow.png"
                    alt="arrow"
                    className={`w-4 h-4 transition-transform duration-300 ${isCraftingOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </button>

            {isCraftingOpen && (
                <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
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
                                    {toolChains[activeCraft.toolCategory][activeCraft.tier].name}
                                </h4>
                                <p className="text-xs text-stone-500 font-bold">
                                    {Math.min(activeCraft.totalTime, activeCraft.progress).toFixed(1)}s / {activeCraft.totalTime}s
                                </p>
                            </div>
                        </div>
                    )}

                    {Object.keys(toolChains).map((toolCategory) => {
                        const currentTier = toolsLevel[toolCategory];
                        const tool = toolChains[toolCategory][currentTier];

                        if (!tool) return null;

                        return (
                            <button
                                key={tool.id}
                                onClick={() => buyTool(toolCategory)}
                                className="w-full text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl hover:border-emerald-500 transition-colors flex gap-3 group shadow-sm"
                            >
                                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform p-1">
                                    <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain drop-shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-stone-800 dark:text-stone-200">
                                        {tool.name}
                                    </h4>
                                    <div className="mt-2 text-xs text-stone-500">
                                        Custo:
                                        {Object.entries(tool.cost).map(([res, amount]) => (
                                            <span
                                                key={res}
                                                className="ml-1 inline-block bg-stone-200 dark:bg-stone-900 px-1.5 py-0.5 rounded text-stone-700 dark:text-stone-300"
                                            >
                                                {amount as number} {res}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
