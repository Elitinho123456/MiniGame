import { toolChains } from '../assets/consts';

interface EquipmentHeaderProps {
    toolsLevel: Record<string, number>;
    toolDurabilities: Record<string, number>;
}

export default function EquipmentHeader({
    toolsLevel,
    toolDurabilities,
}: EquipmentHeaderProps) {
    return (
        <div className="bg-stone-200 dark:bg-stone-800 p-4 border-b border-stone-300 dark:border-stone-700 flex justify-between">
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-stone-500 uppercase">Picareta</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    {toolsLevel.pickaxe > 0
                        ? `${toolChains.pickaxe[toolsLevel.pickaxe - 1].name}`
                        : <img src="./src/assets/ToolLess_Pickaxe.png" alt="slash" className="w-8 h-8" />}
                </span>
                {toolsLevel.pickaxe > 0 && (
                    <span className="text-xs text-amber-600">
                        {toolDurabilities.pickaxe} / {toolChains.pickaxe[toolsLevel.pickaxe - 1].maxDurability} restantes
                    </span>
                )}
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-stone-500 uppercase">Pá</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    {toolsLevel.shovel > 0
                        ? `${toolChains.shovel[toolsLevel.shovel - 1].name}`
                        : <img src="./src/assets/ToolLess_Shovel.png" alt="slash" className="w-8 h-8" />}
                </span>
                {toolsLevel.shovel > 0 && (
                    <span className="text-xs text-amber-600">
                        {toolDurabilities.shovel} / {toolChains.shovel[toolsLevel.shovel - 1].maxDurability} restantes
                    </span>
                )}
            </div>
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-stone-500 uppercase">Machado</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    {toolsLevel.axe > 0
                        ? `${toolChains.axe[toolsLevel.axe - 1].name}`
                        : <img src="./src/assets/ToolLess_Axe.png" alt="slash" className="w-8 h-8" />}
                </span>
                {toolsLevel.axe > 0 && (
                    <span className="text-xs text-amber-600">
                        {toolDurabilities.axe} / {toolChains.axe[toolsLevel.axe - 1].maxDurability} restantes
                    </span>
                )}
            </div>
            <div className="flex flex-col hidden md:flex items-center">
                <span className="text-xs font-bold text-stone-500 uppercase">Enxada</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                    {toolsLevel.hoe > 0
                        ? `${toolChains.hoe[toolsLevel.hoe - 1].name}`
                        : <img src="./src/assets/ToolLess_Hoe.png" alt="slash" className="w-8 h-8" />}
                </span>
                {toolsLevel.hoe > 0 && (
                    <span className="text-xs text-amber-600">
                        {toolDurabilities.hoe} / {toolChains.hoe[toolsLevel.hoe - 1].maxDurability} restantes
                    </span>
                )}
            </div>
        </div>
    );
}
