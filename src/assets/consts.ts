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
    "Gravel": "Gravel", // Assumindo que Gravel dropa Gravel
};

export const nameMap: Record<string, string | null> = {
    "Sand": "Areia",
    "Oak_Log": "Tronco de Carvalho",
    "Oak_Leaves": "Folhas de Carvalho",
    "Grass_Block": "Bloco de Grama",
    "Dirt": "Terra",
    "Gravel": "Cascalho"
};

export const availableUpgrades = [
    {
        id: "upg_pickaxe_1",
        name: "Picareta de Pedra",
        description: "Aumenta a chance de encontrar minérios valiosos.",
        costText: "50 Cobblestone's",
        icon: "⛏️"
    },
    {
        id: "upg_idle_1",
        name: "Villager Coletador",
        description: "Coleta recursos vagarosamente para você.",
        costText: "100 Dirt's",
        icon: "👨‍⚖️"
    }
];

export const availableCrafts = []