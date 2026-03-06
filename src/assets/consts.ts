export const BASE_INVENTORY_CAPACITY = 500;
export const UPGRADE_STORAGE_BONUS = 100;

// 1. Configuração de Dimensões e seus blocos (com peso/chance)
export const dimensions: Record<
  string,
  {
    name: string;
    background: string;
    blocks: { name: string; weight: number }[];
  }
> = {
  Overworld: {
    name: '🌲 Overworld',
    background: '/Overworld_Minecraft.webp',
    blocks: [
      { name: 'Grass_Block', weight: 30 },
      { name: 'Dirt', weight: 25 },
      { name: 'Sand', weight: 10 },
      { name: 'Gravel', weight: 10 },
      { name: 'Oak_Log', weight: 20 },
      { name: 'Oak_Leaves', weight: 5 },
    ],
  },
  Caves: {
    name: '🦇 Cavernas',
    background: '/Caves_Minecraft.webp',
    blocks: [
      { name: 'Stone', weight: 60 },
      { name: 'Coal_Ore', weight: 20 },
      { name: 'Copper_Ore', weight: 15 },
      { name: 'Iron_Ore', weight: 10 },
      { name: 'Gold_Ore', weight: 5 },
      { name: 'Redstone_Ore', weight: 5 },
      { name: 'Lapis_Lazuli_Ore', weight: 4 },
      { name: 'Diamond_Ore', weight: 1 },
      { name: 'Emerald_Ore', weight: 0.5 },
    ],
  },
  Nether: {
    name: '🔥 Nether',
    background: '/Nether_Minecraft.webp',
    blocks: [
      { name: 'Netherrack', weight: 70 },
      { name: 'Nether_Quartz_Ore', weight: 20 },
      { name: 'Nether_Gold_Ore', weight: 15 },
      { name: 'Ancient_Debris', weight: 1 },
    ],
  },
  'The End': {
    name: '🌌 The End',
    background: '/End_Minecraft.webp',
    blocks: [{ name: 'End_Stone', weight: 100 }],
  },
};

// 2. Propriedades dos Blocos (Dureza e Ferramenta Necessária)
export const blockProperties: Record<
  string,
  { hardness: number; reqTool: string; reqLevel: number }
> = {
  Sand: { hardness: 5, reqTool: 'shovel', reqLevel: 0 },
  Oak_Log: { hardness: 10, reqTool: 'axe', reqLevel: 0 },
  Oak_Leaves: { hardness: 2, reqTool: 'hoe', reqLevel: 0 },
  Grass_Block: { hardness: 6, reqTool: 'shovel', reqLevel: 0 },
  Dirt: { hardness: 5, reqTool: 'shovel', reqLevel: 0 },
  Gravel: { hardness: 5, reqTool: 'shovel', reqLevel: 0 },
  Stone: { hardness: 20, reqTool: 'pickaxe', reqLevel: 1 },
  Coal_Ore: { hardness: 25, reqTool: 'pickaxe', reqLevel: 1 },
  Copper_Ore: { hardness: 30, reqTool: 'pickaxe', reqLevel: 1 },
  Iron_Ore: { hardness: 35, reqTool: 'pickaxe', reqLevel: 2 },
  Gold_Ore: { hardness: 40, reqTool: 'pickaxe', reqLevel: 3 },
  Redstone_Ore: { hardness: 35, reqTool: 'pickaxe', reqLevel: 3 },
  Lapis_Lazuli_Ore: { hardness: 35, reqTool: 'pickaxe', reqLevel: 3 },
  Diamond_Ore: { hardness: 50, reqTool: 'pickaxe', reqLevel: 3 },
  Emerald_Ore: { hardness: 60, reqTool: 'pickaxe', reqLevel: 3 },
  Netherrack: { hardness: 15, reqTool: 'pickaxe', reqLevel: 3 },
  Nether_Gold_Ore: { hardness: 20, reqTool: 'pickaxe', reqLevel: 3 },
  Nether_Quartz_Ore: { hardness: 25, reqTool: 'pickaxe', reqLevel: 3 },
  Ancient_Debris: { hardness: 100, reqTool: 'pickaxe', reqLevel: 5 },
  End_Stone: { hardness: 80, reqTool: 'pickaxe', reqLevel: 5 },
};

// 3. Mapeamento de Drops
export const dropMap: Record<string, string | null> = {
  Sand: 'Sand',
  Oak_Log: 'Oak Log',
  Oak_Leaves: null,
  Grass_Block: 'Dirt',
  Dirt: 'Dirt',
  Gravel: 'Gravel',
  Stone: 'Cobblestone',
  Coal_Ore: 'Coal',
  Copper_Ore: 'Raw Copper',
  Iron_Ore: 'Raw Iron',
  Gold_Ore: 'Raw Gold',
  Redstone_Ore: 'Redstone Dust',
  Lapis_Lazuli_Ore: 'Lapis Lazuli',
  Diamond_Ore: 'Diamond',
  Emerald_Ore: 'Emerald',
  Netherrack: 'Netherrack',
  Nether_Gold_Ore: 'Gold Nugget',
  Nether_Quartz_Ore: 'Nether Quartz',
  Ancient_Debris: 'Ancient Debris',
  End_Stone: 'End Stone',
};

// 3. Tradução dos Nomes
export const nameMap: Record<string, string> = {
  Sand: 'Areia',
  Oak_Log: 'Tronco de Carvalho',
  Oak_Leaves: 'Folhas de Carvalho',
  Grass_Block: 'Bloco de Grama',
  Dirt: 'Terra',
  Gravel: 'Cascalho',
  Stone: 'Pedra',
  Coal_Ore: 'Minério de Carvão',
  Copper_Ore: 'Minério de Cobre',
  Iron_Ore: 'Minério de Ferro',
  Gold_Ore: 'Minério de Ouro',
  Redstone_Ore: 'Minério de Redstone',
  Lapis_Lazuli_Ore: 'Minério de Lapis Lazuli',
  Diamond_Ore: 'Minério de Diamante',
  Emerald_Ore: 'Minério de Esmeralda',
  Netherrack: 'Netherrack',
  Nether_Gold_Ore: 'Pepita de Ouro',
  Nether_Quartz_Ore: 'Quartzo',
  Ancient_Debris: 'Detrito Ancestral',
  End_Stone: 'Pedra do Fim',
};

// 5. Cadeia de Progressão de Ferramentas (Crafting)
export const toolChains: Record<string, any[]> = {
  pickaxe: [
    {
      id: 'pick_wood',
      name: 'Picareta de Madeira',
      cost: { 'Oak Log': 5 },
      icon: './Wooden_Pickaxe.webp',
      speed: 2,
      maxDurability: 60,
      craftTime: 2,
    },
    {
      id: 'pick_stone',
      name: 'Picareta de Pedra',
      cost: { Cobblestone: 20, 'Oak Log': 5 },
      icon: './Stone_Pickaxe.webp',
      speed: 4,
      maxDurability: 132,
      craftTime: 5,
    },
    {
      id: 'pick_copper',
      name: 'Picareta de Cobre',
      cost: { 'Raw Copper': 15, 'Oak Log': 5 },
      icon: './Copper_Pickaxe.webp',
      speed: 4,
      maxDurability: 290,
      craftTime: 5,
    },
    {
      id: 'pick_iron',
      name: 'Picareta de Ferro',
      cost: { 'Raw Iron': 15, 'Oak Log': 5 },
      icon: './Iron_Pickaxe.webp',
      speed: 6,
      maxDurability: 639,
      craftTime: 15,
    },
    {
      id: 'pick_gold',
      name: 'Picareta de Ouro',
      cost: { 'Raw Gold': 15, 'Oak Log': 5 },
      icon: './Gold_Pickaxe.webp',
      speed: 8,
      maxDurability: 1405,
      craftTime: 25,
    },
    {
      id: 'pick_diamond',
      name: 'Picareta de Diamante',
      cost: { Diamond: 10, 'Oak Log': 5 },
      icon: './Diamond_Pickaxe.webp',
      speed: 10,
      maxDurability: 3.092,
      craftTime: 60,
    },
    {
      id: 'pick_netherite',
      name: 'Picareta de Netherite',
      cost: { Diamond: 10, 'Oak Log': 5 },
      icon: './Netherite_Pickaxe.webp',
      speed: 10,
      maxDurability: 3.092,
      craftTime: 60,
    },
  ],
  axe: [
    {
      id: 'axe_wood',
      name: 'Machado de Madeira',
      cost: { 'Oak Log': 3 },
      icon: './Wooden_Axe.webp',
      speed: 2,
      maxDurability: 59,
      craftTime: 2,
    },
    {
      id: 'axe_stone',
      name: 'Machado de Pedra',
      cost: { Cobblestone: 10, 'Oak Log': 3 },
      icon: './Stone_Axe.webp',
      speed: 4,
      maxDurability: 131,
      craftTime: 5,
    },
    {
      id: 'axe_iron',
      name: 'Machado de Ferro',
      cost: { 'Raw Iron': 15, 'Oak Log': 3 },
      icon: './Iron_Axe.webp',
      speed: 6,
      maxDurability: 250,
      craftTime: 15,
    },
    {
      id: 'axe_gold',
      name: 'Machado de Ouro',
      cost: { 'Raw Gold': 15, 'Oak Log': 3 },
      icon: './Gold_Axe.webp',
      speed: 8,
      maxDurability: 32,
      craftTime: 25,
    },
    {
      id: 'axe_diamond',
      name: 'Machado de Diamante',
      cost: { Diamond: 10, 'Oak Log': 3 },
      icon: './Diamond_Axe.webp',
      speed: 10,
      maxDurability: 1561,
      craftTime: 60,
    },
  ],
  shovel: [
    {
      id: 'shov_wood',
      name: 'Pá de Madeira',
      cost: { 'Oak Log': 3 },
      icon: './Wooden_Shovel.webp',
      speed: 2,
      maxDurability: 59,
      craftTime: 2,
    },
    {
      id: 'shov_stone',
      name: 'Pá de Pedra',
      cost: { Cobblestone: 10, 'Oak Log': 3 },
      icon: './Stone_Shovel.webp',
      speed: 4,
      maxDurability: 131,
      craftTime: 5,
    },
    {
      id: 'shov_iron',
      name: 'Pá de Ferro',
      cost: { 'Raw Iron': 15, 'Oak Log': 3 },
      icon: './Iron_Shovel.webp',
      speed: 6,
      maxDurability: 250,
      craftTime: 15,
    },
    {
      id: 'shov_gold',
      name: 'Pá de Ouro',
      cost: { 'Raw Gold': 15, 'Oak Log': 3 },
      icon: './Gold_Shovel.webp',
      speed: 8,
      maxDurability: 32,
      craftTime: 25,
    },
    {
      id: 'shov_diamond',
      name: 'Pá de Diamante',
      cost: { Diamond: 10, 'Oak Log': 3 },
      icon: './Diamond_Shovel.webp',
      speed: 10,
      maxDurability: 1561,
      craftTime: 60,
    },
  ],
  hoe: [
    {
      id: 'hoe_wood',
      name: 'Enxada de Madeira',
      cost: { 'Oak Log': 2 },
      icon: './Wooden_Hoe.webp',
      speed: 2,
      maxDurability: 59,
      craftTime: 2,
    },
    {
      id: 'hoe_stone',
      name: 'Enxada de Pedra',
      cost: { Cobblestone: 10, 'Oak Log': 2 },
      icon: './Stone_Hoe.webp',
      speed: 4,
      maxDurability: 131,
      craftTime: 5,
    },
    {
      id: 'hoe_iron',
      name: 'Enxada de Ferro',
      cost: { 'Raw Iron': 15, 'Oak Log': 2 },
      icon: './Iron_Hoe.webp',
      speed: 6,
      maxDurability: 250,
      craftTime: 15,
    },
    {
      id: 'hoe_gold',
      name: 'Enxada de Ouro',
      cost: { 'Raw Gold': 15, 'Oak Log': 2 },
      icon: './Gold_Hoe.webp',
      speed: 8,
      maxDurability: 32,
      craftTime: 25,
    },
    {
      id: 'hoe_diamond',
      name: 'Enxada de Diamante',
      cost: { Diamond: 10, 'Oak Log': 2 },
      icon: './Diamond_Hoe.webp',
      speed: 10,
      maxDurability: 1561,
      craftTime: 60,
    },
  ],
  storage: [
    {
      id: 'stor_backpack',
      name: 'Mochila Pequena',
      cost: { 'Oak Log': 20, Sand: 10 },
      icon: '🎒',
      capacityBonus: 50,
      craftTime: 10,
    },
    {
      id: 'stor_chest',
      name: 'Baú',
      cost: { 'Oak Log': 50, Cobblestone: 20 },
      icon: '📦',
      capacityBonus: 100,
      craftTime: 20,
    },
    {
      id: 'stor_shulker',
      name: 'Caixa Shulker',
      cost: { 'End Stone': 10, Diamond: 2 },
      icon: '🧰',
      capacityBonus: 300,
      craftTime: 40,
    },
    {
      id: 'stor_end_backpack',
      name: 'Mochila do Fim',
      cost: { 'End Stone': 50, Netherrack: 50 },
      icon: '🎒',
      capacityBonus: 1000,
      craftTime: 80,
    },
  ],
};

// 6. Upgrades (Melhorias com Categorias e Custos)
export const availableUpgrades = [
  {
    id: 'upg_idle_1',
    category: 'idle',
    name: 'Villager Coletador',
    description: 'Coleta alguns blocos simples do Overworld a cada 2 segs.',
    cost: { Dirt: 50, 'Oak Log': 10 },
    icon: '👨‍🌾',
  },
  {
    id: 'upg_idle_2',
    category: 'idle',
    name: 'Mineiro Anão',
    description: 'Coleta pedras e minérios simples das Cavernas a cada 2 segs.',
    cost: { Cobblestone: 100, 'Raw Iron': 20 },
    icon: '⛏️',
  },
  {
    id: 'upg_mining_1',
    category: 'mining',
    name: 'Fortuna I',
    description: 'Aumenta todos os drops de mineração manual em +1.',
    cost: { Cobblestone: 50, 'Raw Copper': 15 },
    icon: '✨',
  },
  {
    id: 'upg_crafting_1',
    category: 'crafting',
    name: 'Bancada Eficiente',
    description: 'Reduz o tempo de todos os crafts em 20%.',
    cost: { 'Oak Log': 50, 'Raw Iron': 10 },
    icon: '🪚',
  },
  {
    id: 'upg_storage_1',
    category: 'storage',
    name: 'Bolsos Profundos',
    description: 'Aumenta permanentemente o espaço do inventário em +100.',
    cost: { 'Oak Log': 100, 'Raw Copper': 50 },
    icon: '👖',
  },
  {
    id: 'upg_autosell',
    category: 'idle',
    name: 'Comerciante Automático',
    description: 'Vende recursos do inventário automaticamente a cada 5 segundos.',

    cost: {},
    mineCoinCost: 100000,
    icon: '🤝',
  },
  {
    id: 'upg_villagers_unlock',
    category: 'idle',
    name: 'Taverna Local',
    description: 'Desbloqueia a contratação de aldeões para coletar recursos passivamente.',
    cost: { 'Oak Log': 500, Cobblestone: 500, 'Raw Iron': 100 },
    icon: '🏠',
  },
];

// 7. Sistema de Pets
export type PetCategory = 'Comum' | 'Raro' | 'Épico' | 'Lendário';

export interface Pet {
  id: string;
  name: string;
  category: string;
  baseBonusStr: string;
  dropChance: number; // 0 a 100
  icon: string;
  maxLevel: number;
  effect: {
    type: 'speed' | 'drop' | 'special';
    baseValue: number;
    valuePerLevel: number; // Quanto o bonus aumenta por level
  };
}

export const availablePets: Pet[] = [
  {
    id: 'pet_dog',
    name: 'Cachorrinho',
    category: 'Comum',
    baseBonusStr: '+1 Velocidade/Nv',
    dropChance: 0.05,
    icon: '🐶',
    maxLevel: 10,
    effect: { type: 'speed', baseValue: 1, valuePerLevel: 1 },
  },
  {
    id: 'pet_cat',
    name: 'Gatinho',
    category: 'Comum',
    baseBonusStr: 'Drops Passivos/Nv',
    dropChance: 0.05,
    icon: '🐱',
    maxLevel: 10,
    effect: { type: 'special', baseValue: 0, valuePerLevel: 0 },
  },
  {
    id: 'pet_pig',
    name: 'Porquinho',
    category: 'Incomum',
    baseBonusStr: '+1 Drop/Nv',
    dropChance: 0.025,
    icon: '🐷',
    maxLevel: 15,
    effect: { type: 'drop', baseValue: 1, valuePerLevel: 1 },
  },
  {
    id: 'pet_dragon',
    name: 'Dragão Bebê',
    category: 'Raro',
    baseBonusStr: '+5 Vel. & +0.5 Drop/Nv',
    dropChance: 0.005,
    icon: '🐉',
    maxLevel: 30,
    effect: { type: 'speed', baseValue: 5, valuePerLevel: 2 },
  },
  {
    id: 'pet_unicorn',
    name: 'Unicórnio Estelar',
    category: 'Lendário',
    baseBonusStr: '+10 Vel. & +2 Drops/Nv',
    dropChance: 0.0001,
    icon: '🦄',
    maxLevel: 50,
    effect: { type: 'drop', baseValue: 2, valuePerLevel: 2 },
  },
];

export const getPetXpRequired = (level: number) => level * 100;

// 8. Tabela de Preços dos Itens
export const itemPrices: Record<string, number> = {
  Sand: 1,
  'Oak Log': 2,
  Dirt: 1,
  Gravel: 1,
  Cobblestone: 2,
  Coal: 5,
  'Raw Copper': 8,
  'Raw Iron': 12,
  'Raw Gold': 20,
  'Redstone Dust': 15,
  'Lapis Lazuli': 20,
  Diamond: 100,
  Emerald: 150,
  Netherrack: 3,
  'Gold Nugget': 5,
  'Nether Quartz': 10,
  'Ancient Debris': 250,
  'End Stone': 15,
};

