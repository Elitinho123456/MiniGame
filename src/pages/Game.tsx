import { useState } from "react";
import { availableBlocks, dropMap } from "../assets/consts";


export default function Game() {
    // Estado do bloco atual sendo exibido (começa com Grass_Block)
    const [currentBlock, setCurrentBlock] = useState<string>("Grass_Block");

    // Estado do inventário (começa tudo com 0)
    const [inventory, setInventory] = useState<Record<string, number>>({
        "Sand": 0,
        "Oak Log": 0,
        "Dirt": 0,
        "Gravel": 0
    });

    // Função executada APENAS quando o usuário clica no bloco
    function handleMineBlock() {
        // 1. Verifica qual recurso o bloco atual dropa
        const drop = dropMap[currentBlock];

        // 2. Se tiver um drop válido (não for null), adiciona ao inventário
        if (drop) {
            setInventory(prev => ({
                ...prev,
                [drop]: prev[drop] + 1
            }));
        }

        // 3. Sorteia o PRÓXIMO bloco que vai aparecer
        const randomIndex = Math.floor(Math.random() * availableBlocks.length);
        const nextBlock = availableBlocks[randomIndex];

        // 4. Atualiza a imagem na tela
        setCurrentBlock(nextBlock);
    }

    function toggleUpgrade() {

    }

    function toggleCrafting() {

    }

    return (
        <>
            <div className="min-h-screen bg-stone-100 dark:bg-stone-900 transition-colors duration-300">
                <div className="flex justify-between absolute top-2 left-4 right-4">
                    <img src="Crafting_Table.webp" alt="Craft" className="w-16 m-1 rounded-lg cursor-pointer" />
                    <img src="Anvil.webp" alt="Upgrades" className="w-16 m-1 rounded-lg cursor-pointer" />
                </div>
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen p-4">
                    <div className="w-full p-8 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 text-center bg-[url('/Backgroud.jpg')] bg-cover bg-center">
                        <h1 className="text-4xl font-extrabold mb-2 text-stone-800 dark:text-stone-200 bg-stone-800/50 inline-block px-4 py-2 rounded-lg">
                            Área de Mineração
                        </h1>
                        <p className="text-lg text-stone-600 dark:text-stone-400 mb-10 bg-stone-50/50 py-1 rounded-lg">
                            Clique no bloco para coletar recursos!
                        </p>

                        {/* Área do Bloco Clicável */}
                        <button
                            onClick={handleMineBlock}
                            className="p-4 rounded-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform bg-stone-200 dark:bg-stone-800 shadow-lg border border-stone-300 dark:border-stone-700"
                        >
                            <img
                                src={`/${currentBlock}.webp`}
                                alt={currentBlock}
                                className="w-40 h-40 object-contain drop-shadow-md"
                            />
                            <p className="mt-4 font-bold text-stone-700 dark:text-stone-300 text-xl capitalize">
                                {currentBlock.replace("_", " ")}
                            </p>
                        </button>
                    </div>



                    {/* Painel do Inventário */}
                    <div className="mt-12 w-full max-w-md p-6 bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700">
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-4 border-b border-stone-200 dark:border-stone-700 pb-2">
                            Seu Inventário
                        </h2>

                        <ul className="space-y-3">
                            {Object.entries(inventory).map(([resourceName, amount]) => (
                                <li
                                    key={resourceName}
                                    className="flex justify-between items-center text-stone-700 dark:text-stone-300 font-medium"
                                >
                                    <span>{resourceName}</span>
                                    <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-bold">
                                        {amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
}