import { toolChains } from '../../assets/consts';

interface EquipmentHeaderProps {
    toolsLevel: Record<string, number>;
    toolDurabilities: Record<string, number>;
}

export default function EquipmentHeader({
    toolsLevel,
    toolDurabilities,
}: EquipmentHeaderProps) {
    const renderTool = (key: 'pickaxe' | 'shovel' | 'axe' | 'hoe', label: string, toolLessIcon: string) => {
        const level = toolsLevel[key] || 0;
        const durability = toolDurabilities[key] || 0;

        const hasTool = level > 0;
        const toolData = hasTool ? toolChains[key][level - 1] : null;

        let progress = 0;
        let colorClass = 'bg-stone-500';

        if (hasTool && toolData) {
            const maxDurability = toolData.maxDurability;
            progress = (durability / maxDurability) * 100;

            if (progress > 66) colorClass = 'bg-emerald-500';
            else if (progress > 33) colorClass = 'bg-yellow-500';
            else colorClass = 'bg-red-500';
        }

        return (
            <div className="flex flex-col items-center w-16">
                <span className="text-[10px] md:text-xs font-bold text-stone-500 uppercase mb-1">{label}</span>
                <div className="relative w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center p-1 shadow-inner border border-stone-300 dark:border-stone-700 group cursor-default">
                    {hasTool && toolData ? (
                        <>
                            <img src={toolData.icon} alt={toolData.name} className="w-full h-full object-contain drop-shadow-md" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <div className="absolute top-full text-center left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-stone-800 text-stone-200 text-[10px] rounded px-2 py-0.5 whitespace-nowrap z-50">
                                {toolData.name} - {durability}/{toolData.maxDurability}
                            </div>
                        </>
                    ) : (
                        <img src={toolLessIcon} alt="Sem ferramenta" className="w-full h-full object-contain opacity-30 grayscale" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    )}
                </div>
                {hasTool && toolData ? (
                    <div className="w-12 mt-2 h-1.5 bg-stone-300 dark:bg-stone-900 rounded-full overflow-hidden shadow-inner">
                        <div
                            className={`h-full ${colorClass} transition-all duration-300`}
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                        />
                    </div>
                ) : (
                    <div className="w-12 mt-2 h-1.5"></div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-stone-200 dark:bg-stone-800 p-4 border-b border-stone-300 dark:border-stone-700 flex justify-around md:justify-between px-2 md:px-6">
            {renderTool('pickaxe', 'Picareta', './src/assets/ToolLess_Pickaxe.png')}
            {renderTool('shovel', 'Pá', './src/assets/ToolLess_Shovel.png')}
            {renderTool('axe', 'Machado', './src/assets/ToolLess_Axe.png')}
            {renderTool('hoe', 'Enxada', './src/assets/ToolLess_Hoe.png')}
        </div>
    );
}
