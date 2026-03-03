import { useState } from "react";
// Mantenha suas importações de constantes do arquivo separado
import { availableBlocks, dropMap } from "../assets/consts";

// --- MODELO REPLICÁVEL DE UPGRADES ---
// Criei esta estrutura para que você possa facilmente adicionar, balancear e alterar upgrades depois.
interface UpgradeItem {
    id: string;
    name: string;
    description: string;
    costText: string; // Ex: "50 Cobblestone"
    icon: string;     // Pode ser um emoji ou o caminho de uma imagem ex: "Anvil.webp"
}

const AVAILABLE_UPGRADES: UpgradeItem[] = [
    {
        id: "upg_1",
        name: "Picareta de Pedra",
        description: "Aumenta a chance de encontrar minérios valiosos.",
        costText: "50 Cobblestone",
        icon: "⛏️"
    },
    {
        id: "upg_2",
        name: "Pá Reforçada",
        description: "Coleta 2x mais recursos de terra e areia.",
        costText: "30 Dirt, 10 Oak Log",
        icon: "🪏"
    }
];
// --------------------------------------

export default function Game() {
    // Estados do Jogo
    const [currentBlock, setCurrentBlock] = useState<string>("Grass_Block");
    const [inventory, setInventory] = useState<Record<string, number>>({
        "Cobblestone": 0,
        "Sand": 0,
        "Oak Log": 0,
        "Dirt": 0,
        "Gravel": 0
    });

    // Estados dos Menus (Upgrades começa aberto, Crafting fechado)
    const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(true);
    const [isCraftingOpen, setIsCraftingOpen] = useState<boolean>(false);

    // Lógica de Mineração
    function handleMineBlock() {
        const drop = dropMap[currentBlock];

        if (drop) {
            setInventory(prev => ({
                ...prev,
                [drop]: (prev[drop] || 0) + 1
            }));
        }

        const randomIndex = Math.floor(Math.random() * availableBlocks.length);
        setCurrentBlock(availableBlocks[randomIndex]);
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-stone-900 text-stone-100 transition-colors duration-300 overflow-hidden">
            
            {/* LADO ESQUERDO: Gameplay e Bioma (Estilo Cookie Clicker) */}
            {/* Nota: Corrigi o nome da imagem para Background.jpg. Se a sua estiver Backgroud.jpg, lembre de renomear o arquivo para manter o inglês correto! */}
            <div className="relative flex-1 bg-[url('/Background.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 min-h-[50vh] md:min-h-screen border-b md:border-b-0 md:border-r border-stone-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
                
                {/* Overlay escuro para garantir que o bloco e os textos fiquem legíveis sobre qualquer fundo */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                {/* Conteúdo Central do Bioma */}
                <div className="relative z-10 flex flex-col items-center">
                    {/* Indicador de Localização */}
                    <div className="mb-12 px-6 py-2 bg-stone-900/80 border border-stone-700 backdrop-blur-md rounded-full shadow-lg">
                        <h2 className="text-xl md:text-2xl font-black text-stone-200 tracking-widest uppercase">
                            🌲 Overworld
                        </h2>
                    </div>

                    {/* Bloco Clicável */}
                    <button
                        onClick={handleMineBlock}
                        className="group relative cursor-pointer transform transition-all duration-100 hover:scale-110 active:scale-95 active:rotate-3"
                    >
                        {/* Brilho de fundo no hover */}
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <img
                            src={`/${currentBlock}.webp`}
                            alt={currentBlock}
                            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
                            draggable={false}
                        />
                    </button>
                    
                    <p className="mt-8 font-bold text-stone-300 text-2xl md:text-3xl capitalize drop-shadow-lg">
                        {currentBlock.replace("_", " ")}
                    </p>
                    <p className="text-stone-400 mt-2 bg-black/50 px-3 py-1 rounded-lg text-sm">
                        Clique para quebrar!
                    </p>
                </div>
            </div>


            {/* LADO DIREITO: Painel de Gerenciamento (Inventário, Upgrades, Crafting) */}
            <div className="w-full md:w-[400px] bg-stone-100 dark:bg-stone-950 flex flex-col h-[50vh] md:h-screen overflow-y-auto custom-scrollbar">
                
                {/* 1. Inventário (Sempre visível no topo da barra lateral) */}
                <div className="p-6 bg-stone-200 dark:bg-stone-900 border-b border-stone-300 dark:border-stone-800 sticky top-0 z-20 shadow-md">
                    <h3 className="text-xl font-extrabold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                        🎒 Inventário
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(inventory).map(([resourceName, amount]) => (
                            <div key={resourceName} className="flex flex-col bg-white dark:bg-stone-950 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm">
                                <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold uppercase">{resourceName}</span>
                                <span className="text-lg font-black text-stone-800 dark:text-stone-200">{amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Menu de Upgrades (Bigorna) */}
                <div className="border-b border-stone-300 dark:border-stone-800">
                    <button 
                        onClick={() => setIsUpgradesOpen(!isUpgradesOpen)}
                        className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
                    >
                        <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                            <img src="/Anvil.webp" alt="Anvil" className="w-8 h-8 rounded drop-shadow-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
                            Upgrades
                        </span>
                        <span className="text-stone-500">{isUpgradesOpen ? '▼' : '▶'}</span>
                    </button>
                    
                    {isUpgradesOpen && (
                        <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
                            {AVAILABLE_UPGRADES.map(upgrade => (
                                <button 
                                    key={upgrade.id}
                                    className="w-full text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl hover:border-amber-500 dark:hover:border-amber-500 transition-colors flex gap-3 group shadow-sm"
                                >
                                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 dark:border-stone-700 group-hover:scale-105 transition-transform">
                                        {upgrade.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-stone-800 dark:text-stone-200">{upgrade.name}</h4>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">{upgrade.description}</p>
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-500 mt-2">Custo: {upgrade.costText}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Menu de Crafting (Mesa de Trabalho) */}
                <div className="border-b border-stone-300 dark:border-stone-800">
                    <button 
                        onClick={() => setIsCraftingOpen(!isCraftingOpen)}
                        className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
                    >
                        <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                            <img src="/Crafting_Table.webp" alt="Crafting" className="w-8 h-8 rounded drop-shadow-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
                            Crafting
                        </span>
                        <span className="text-stone-500">{isCraftingOpen ? '▼' : '▶'}</span>
                    </button>
                    
                    {isCraftingOpen && (
                        <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/50">
                            <div className="text-4xl mb-3 opacity-50">🛠️</div>
                            <p className="text-stone-600 dark:text-stone-400 font-medium">A interface de construção estará disponível em breve!</p>
                            <p className="text-sm text-stone-500 dark:text-stone-500 mt-2">Reúna mais madeira e pedra.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}