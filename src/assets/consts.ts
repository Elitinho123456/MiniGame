// 1. Configuração de Dimensões e seus blocos
export const dimensions: Record<string, { name: string, background: string, blocks: string[] }> = {
    "Overworld": {
        name: "🌲 Overworld",
        background: "/Overworld_Minecraft.webp", // ou /Overworld.webp dependendo da sua imagem
        blocks: ["Sand", "Oak_Log", "Oak_Leaves", "Gravel", "Grass_Block", "Dirt"]
    },
    "Caves": {
        name: "🦇 Cavernas",
        background: "/Caves_Minecraft.webp",
        blocks: ["Stone", "Coal_Ore", "Copper_Ore", "Iron_Ore", "Gold_Ore", "Redstone_Ore", "Lapis_Lazuli_Ore", "Diamond_Ore", "Emerald_Ore"]
    },
    "Nether": {
        name: "🔥 Nether",
        background: "/Nether_Minecraft.webp",
        blocks: ["Netherrack", "Nether_Gold_Ore", "Nether_Quartz_Ore"] // Adicione os blocos reais depois
    },
    "The End": {
        name: "🌌 The End",
        background: "/End_Minecraft.webp",
        blocks: ["End_Stone"] // Adicione os blocos reais depois
    }
};

// 2. Mapeamento de Drops
export const dropMap: Record<string, string | null> = {
    "Sand": "Sand",
    "Oak_Log": "Oak Log",
    "Oak_Leaves": null,
    "Grass_Block": "Dirt",
    "Dirt": "Dirt",
    "Gravel": "Gravel",
    "Stone": "Cobblestone",
    "Coal_Ore": "Coal",
    "Copper_Ore": "Raw Copper",
    "Iron_Ore": "Raw Iron",
    "Gold_Ore": "Raw Gold",
    "Redstone_Ore": "Redstone Dust",
    "Lapis_Lazuli_Ore": "Lapis Lazuli",
    "Diamond_Ore": "Diamond",
    "Emerald_Ore": "Emerald",
    "Netherrack": "Netherrack",
    "End_Stone": "End Stone"
};

// 3. Tradução dos Nomes
export const nameMap: Record<string, string> = {
    "Sand": "Areia",
    "Oak_Log": "Tronco de Carvalho",
    "Oak_Leaves": "Folhas de Carvalho",
    "Grass_Block": "Bloco de Grama",
    "Dirt": "Terra",
    "Gravel": "Cascalho",
    "Stone": "Pedra",
    "Coal_Ore": "Minério de Carvão",
    "Copper_Ore": "Minério de Cobre",
    "Iron_Ore": "Minério de Ferro",
    "Gold_Ore": "Minério de Ouro",
    "Redstone_Ore": "Minério de Redstone",
    "Lapis_Lazuli_Ore": "Minério de Lapis Lazuli",
    "Diamond_Ore": "Minério de Diamante",
    "Emerald_Ore": "Minério de Esmeralda",
    "Netherrack": "Netherrack",
    "End_Stone": "Pedra do Fim"
};

// 4. Cadeia de Progressão de Ferramentas (Crafting)
export const toolChains: Record<string, any[]> = {
    pickaxe: [
        { id: "pick_wood", name: "Picareta de Madeira", cost: { "Oak Log": 5 }, icon: "⛏️" },
        { id: "pick_stone", name: "Picareta de Pedra", cost: { "Cobblestone": 20, "Oak Log": 5 }, icon: "⛏️" },
        { id: "pick_iron", name: "Picareta de Ferro", cost: { "Raw Iron": 15, "Oak Log": 5 }, icon: "⛏️" }
    ],
    shovel: [
        { id: "shov_wood", name: "Pá de Madeira", cost: { "Oak Log": 3 }, icon: "🪏" },
        { id: "shov_stone", name: "Pá de Pedra", cost: { "Cobblestone": 10, "Oak Log": 3 }, icon: "🪏" }
    ]
};

// 5. Upgrades (Bigorna - Mantido o seu modelo)
export const availableUpgrades = [
    {
        id: "upg_idle_1",
        name: "Villager Coletador",
        description: "Coleta recursos vagarosamente para você.",
        costText: "100 Dirt's",
        icon: "👨‍🌾"
    }
];