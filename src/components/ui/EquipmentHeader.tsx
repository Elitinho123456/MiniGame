import { toolChains } from '../../assets/consts';
import { useGameStore } from '../../store/useGameStore';

interface EquipmentHeaderProps {
    toolsLevel: Record<string, number>;
    toolDurabilities: Record<string, number>;
}

export default function EquipmentHeader({
    toolsLevel,
    toolDurabilities,
}: EquipmentHeaderProps) {
    const playerXp = useGameStore(s => s.playerXp);
    const playerLevel = useGameStore(s => s.playerLevel);

    const getXpRequiredForNextLevel = (level: number) => {
      if (level <= 15) return 2 * level + 7;
      if (level <= 30) return 5 * level - 38;
      return 9 * level - 158;
    };

    const requiredXp = getXpRequiredForNextLevel(playerLevel);
    const xpPercent = Math.min(100, Math.max(0, (playerXp / requiredXp) * 100));

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
        <div className="bg-stone-200 dark:bg-stone-800 pt-4 pb-2 border-b border-stone-300 dark:border-stone-700 flex flex-col items-center">
            <div className="flex justify-around md:justify-between px-2 md:px-6 w-full mb-3">
                {renderTool('pickaxe', 'Picareta', './src/assets/ToolLess_Pickaxe.png')}
                {renderTool('shovel', 'Pá', './src/assets/ToolLess_Shovel.png')}
                {renderTool('axe', 'Machado', './src/assets/ToolLess_Axe.png')}
                {renderTool('hoe', 'Enxada', './src/assets/ToolLess_Hoe.png')}
            </div>

            {/* XP Bar */}
            <div className="w-full px-4 flex flex-col items-center group relative cursor-default">
                <div className="absolute top-[-30px] hidden group-hover:block bg-stone-900 text-stone-200 text-xs px-2 py-1 rounded shadow-lg z-50">
                    {playerXp} / {requiredXp} XP
                </div>
                <div className="w-full h-2 bg-stone-800 rounded-full border border-stone-600/50 shadow-inner overflow-hidden flex">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-stone-900/40 last:border-0 relative h-full">
                            <div className="absolute inset-0 bg-lime-400 group-hover:brightness-110 transition-all duration-300" 
                                style={{ 
                                    width: i * 10 < xpPercent ? `${Math.min(100, (xpPercent - i * 10) * 10)}%` : '0%' 
                                }} 
                            />
                        </div>
                    ))}
                </div>
                <div className="absolute top-[8px] flex items-center justify-center pointer-events-none">
                    <span className="text-[12px] font-black font-mono tracking-tighter text-lime-400 drop-shadow-[0_1px_1px_rgba(0,0,0,1)] z-10" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                        {playerLevel}
                    </span>
                </div>
            </div>
        </div>
    );
}
