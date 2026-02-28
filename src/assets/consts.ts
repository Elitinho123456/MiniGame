export const availableBlocks = [
    "Sand",
    "Oak_Log",
    "Oak_Leaves",
    "Gravel",
    "Grass_Block",
    "Dirt"
];

// 2. Mapeamento de "Qual bloco" dá "Qual recurso"
export const dropMap: Record<string, string | null> = {
    "Sand": "Sand",
    "Oak_Log": "Oak Log",
    "Oak_Leaves": null, // Não dropa nada por enquanto
    "Grass_Block": "Dirt",
    "Dirt": "Dirt",
    "Gravel": "Gravel" // Assumindo que Gravel dropa Gravel
};