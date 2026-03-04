import { useState } from "react";
import { dimensions, dropMap, nameMap, availableUpgrades, toolChains } from "../assets/consts";

export default function Game() {
    // Estado de Dimensões e Blocos
    const [currentDim, setCurrentDim] = useState<string>("Overworld");
    const [currentBlock, setCurrentBlock] = useState<string>("Grass_Block");

    // Inventário
    const [inventory, setInventory] = useState<Record<string, number>>({});

    // Equipamentos do Jogador (Controla em qual tier a ferramenta está: 0, 1, 2...)
    const [toolsLevel, setToolsLevel] = useState<Record<string, number>>({
        pickaxe: 0,
        shovel: 0
    });

    // Estados dos Menus
    const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(true);
    const [isCraftingOpen, setIsCraftingOpen] = useState<boolean>(false);

    const blockName = nameMap[currentBlock] || currentBlock;
    const currentDimData = dimensions[currentDim];

    // Lógica de Mineração
    function handleMineBlock() {
        const drop = dropMap[currentBlock];
        if (drop) {
            setInventory(prev => ({
                ...prev,
                [drop]: (prev[drop] || 0) + 1
            }));
        }

        // Sorteia o próximo bloco DENTRO DA DIMENSÃO ATUAL
        const blocksInDim = currentDimData.blocks;
        const randomIndex = Math.floor(Math.random() * blocksInDim.length);
        setCurrentBlock(blocksInDim[randomIndex]);
    }

    // Lógica para Mudar de Dimensão
    function handleDimensionChange(newDim: string) {
        setCurrentDim(newDim);
        setCurrentBlock(dimensions[newDim].blocks[0]); // Reseta pro primeiro bloco da dimensão
    }

    // Lógica de Crafting (Compra de Ferramentas)
    function buyTool(toolCategory: string) {
        const currentTier = toolsLevel[toolCategory];
        const nextTool = toolChains[toolCategory][currentTier];

        if (!nextTool) return; // Já está no nível máximo

        // Verifica se tem todos os recursos
        let canBuy = true;
        for (const [res, amount] of Object.entries(nextTool.cost)) {
            if ((inventory[res] || 0) < (amount as number)) canBuy = false;
        }

        if (canBuy) {
            // Desconta recursos
            setInventory(prev => {
                const newInv = { ...prev };
                for (const [res, amount] of Object.entries(nextTool.cost)) {
                    newInv[res] -= (amount as number);
                }
                return newInv;
            });
            // Sobe o nível da ferramenta (Aparecerá a próxima no lugar!)
            setToolsLevel(prev => ({
                ...prev,
                [toolCategory]: prev[toolCategory] + 1
            }));
        } else {
            alert("Recursos insuficientes!");
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-stone-900 text-stone-100 transition-colors duration-300 overflow-hidden">

            {/* LADO ESQUERDO: Gameplay */}
            <div
                className="relative flex-1 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 min-h-[50vh] md:min-h-screen border-b md:border-b-0 md:border-r border-stone-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] transition-all duration-700"
                style={{ backgroundImage: `url('${currentDimData.background}')` }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Seletor de Dimensões */}
                    <div className="mb-12 flex items-center gap-2">
                        <select
                            value={currentDim}
                            onChange={(e) => handleDimensionChange(e.target.value)}
                            className="px-6 py-3 bg-stone-900/80 border border-stone-600 backdrop-blur-md rounded-full shadow-lg text-xl md:text-2xl font-black text-stone-200 tracking-widest uppercase cursor-pointer outline-none hover:bg-stone-800 transition-colors"
                        >
                            {Object.keys(dimensions).map(dimKey => (
                                <option key={dimKey} value={dimKey}>{dimensions[dimKey].name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleMineBlock}
                        className="group relative cursor-pointer transform transition-all duration-100 hover:scale-110 active:scale-95 active:rotate-3"
                    >
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img
                            src={`/${currentBlock}.webp`}
                            alt={currentBlock}
                            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
                            draggable={false}
                        />
                    </button>

                    <p className="mt-8 font-bold text-stone-300 text-2xl md:text-3xl capitalize drop-shadow-lg">
                        {blockName}
                    </p>
                </div>
            </div>

            {/* LADO DIREITO: Gerenciamento */}
            <div className="w-full md:w-100 bg-stone-100 dark:bg-stone-950 flex flex-col h-[50vh] md:h-screen overflow-y-auto custom-scrollbar">

                {/* 1. Inventário */}
                <div className="p-6 bg-stone-200 dark:bg-stone-900 border-b border-stone-300 dark:border-stone-800 sticky top-0 z-20 shadow-xl flex flex-col">
                    <h3 className="text-xl font-extrabold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-3">
                        <img src="/Backpack.png" alt="Backpack" className="w-8 h-8 drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
                        Inventário
                    </h3>
                    <div className="max-h-56 md:max-h-72 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-3">
                        {Object.entries(inventory).map(([resourceName, amount]) => (
                            amount > 0 && (
                                <div key={resourceName} className="flex items-center gap-3 bg-white dark:bg-stone-950 p-2 md:p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform flex-shrink-0 border border-stone-200 dark:border-stone-800">
                                        <img src={`/${resourceName.replaceAll(' ', '_')}.webp`} alt={resourceName} className="w-full h-full object-contain drop-shadow-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider truncate" title={resourceName.replace(/_/g, ' ')}>{resourceName.replace(/_/g, ' ')}</span>
                                        <span className="text-lg md:text-xl font-black text-stone-800 dark:text-stone-200">{amount}</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                {/* 2. Menu de Upgrades */}
                <div className="border-b border-stone-300 dark:border-stone-800">
                    <button
                        onClick={() => setIsUpgradesOpen(!isUpgradesOpen)}
                        className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
                    >
                        <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                            <img src="/Anvil.webp" alt="Anvil" className="w-8 h-8 rounded drop-shadow-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
                            Upgrades
                        </span>
                        {/* Imagem da Seta com Rotação CSS */}
                        <img
                            src="/Down_Arrow.png"
                            alt="arrow"
                            className={`w-4 h-4 transition-transform duration-300 ${isUpgradesOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                    </button>

                    {isUpgradesOpen && (
                        <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
                            {availableUpgrades.map(upgrade => (
                                <button
                                    key={upgrade.id}
                                    className="w-full text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl hover:border-amber-500 transition-colors flex gap-3 group shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform">
                                        {upgrade.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-stone-800 dark:text-stone-200">{upgrade.name}</h4>
                                        <p className="text-xs text-stone-500 mt-0.5 leading-tight">{upgrade.description}</p>
                                        <p className="text-xs font-bold text-amber-700 mt-2">Custo: {upgrade.costText}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Menu de Crafting Funcional */}
                <div className="border-b border-stone-300 dark:border-stone-800">
                    <button
                        onClick={() => setIsCraftingOpen(!isCraftingOpen)}
                        className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
                    >
                        <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                            <img src="/Crafting_Table.webp" alt="Crafting" className="w-8 h-8 rounded drop-shadow-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
                            Crafting
                        </span>
                        {/* Imagem da Seta com Rotação CSS */}
                        <img
                            src="/Down_Arrow.png"
                            alt="arrow"
                            className={`w-4 h-4 transition-transform duration-300 ${isCraftingOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                    </button>

                    {isCraftingOpen && (
                        <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
                            {Object.keys(toolChains).map(toolCategory => {
                                const currentTier = toolsLevel[toolCategory];
                                const tool = toolChains[toolCategory][currentTier];

                                // Se a ferramenta já foi upada no máximo, não exibe mais nada (ou você pode exibir "MÁXIMO")
                                if (!tool) return null;

                                return (
                                    <button
                                        key={tool.id}
                                        onClick={() => buyTool(toolCategory)}
                                        className="w-full text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl hover:border-emerald-500 transition-colors flex gap-3 group shadow-sm"
                                    >
                                        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform">
                                            {tool.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-stone-800 dark:text-stone-200">{tool.name}</h4>
                                            <div className="mt-2 text-xs text-stone-500">
                                                Custo:
                                                {Object.entries(tool.cost).map(([res, amount]) => (
                                                    <span key={res} className="ml-1 inline-block bg-stone-200 dark:bg-stone-900 px-1.5 py-0.5 rounded text-stone-700 dark:text-stone-300">
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

            </div>
        </div>
    );
}