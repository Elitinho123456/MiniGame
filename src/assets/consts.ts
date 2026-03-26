import { gameRegistry, type Upgrade, type Recipe } from './registry';

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
  Iron_Ore: { hardness: 175, reqTool: 'pickaxe', reqLevel: 2 },
  Gold_Ore: { hardness: 200, reqTool: 'pickaxe', reqLevel: 3 },
  Redstone_Ore: { hardness: 175, reqTool: 'pickaxe', reqLevel: 3 },
  Lapis_Lazuli_Ore: { hardness: 175, reqTool: 'pickaxe', reqLevel: 3 },
  Diamond_Ore: { hardness: 250, reqTool: 'pickaxe', reqLevel: 3 },
  Emerald_Ore: { hardness: 300, reqTool: 'pickaxe', reqLevel: 3 },
  Netherrack: { hardness: 15, reqTool: 'pickaxe', reqLevel: 3 },
  Nether_Gold_Ore: { hardness: 100, reqTool: 'pickaxe', reqLevel: 3 },
  Nether_Quartz_Ore: { hardness: 125, reqTool: 'pickaxe', reqLevel: 3 },
  Ancient_Debris: { hardness: 2000, reqTool: 'pickaxe', reqLevel: 5 },
  End_Stone: { hardness: 400, reqTool: 'pickaxe', reqLevel: 5 },
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

// 4. Tradução dos Nomes
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
  Stick: 'Graveto',
  Apple: 'Maçã',
  'Oak Planks': 'Tábuas de Carvalho',
  'Iron Ingot': 'Barra de Ferro',
  'Copper Ingot': 'Barra de Cobre',
  'Gold Ingot': 'Barra de Ouro',
  'Netherite Scrap': 'Sucata de Netherite',
  'Netherite Ingot': 'Barra de Netherite',
  Flint: 'Sílex',
  Glass: 'Vidro',
  Shears: 'Tesoura',
  'Crafting Table': 'Bancada de Trabalho',
  'Blast Furnace': 'Alto-forno',
  'Enchanting Table': 'Mesa de Encantamentos',
  
  // Sementes e Culturas
  'Wheat Seeds': 'Sementes de Trigo',
  'Wheat': 'Trigo',
  'Carrot': 'Cenoura',
  'Potato': 'Batata',
  'Beetroot Seeds': 'Sementes de Beterraba',
  'Beetroot': 'Beterraba',
  'Nether Wart': 'Fungo do Nether',
  'Chorus Fruit': 'Fruta do Coro',
  'Golden Apple Seed': 'Semente de Maçã Dourada',
  
  // Fertilizante
  'Bone Meal': 'Farinha de Osso',
  'Magic Fertilizer': 'Adubo Mágico',
};

// 5. Cadeia de Progressão de Ferramentas (Crafting)
export const toolChains: Record<string, any[]> = {

  //#######################################################
  // Picareta
  //#######################################################

  pickaxe: [
    {
      id: 'pick_wood',
      name: 'Picareta de Madeira',
      cost: { 'Oak Planks': 6, Stick: 4 },
      icon: './Wooden_Pickaxe.webp',
      speed: 2,
      maxDurability: 639,
      craftTime: 2,
    },
    {
      id: 'pick_stone',
      name: 'Picareta de Pedra',
      cost: { Cobblestone: 15, Stick: 10 },
      icon: './Stone_Pickaxe.webp',
      speed: 4,
      maxDurability: 1406,
      craftTime: 20,
    },
    {
      id: 'pick_copper',
      name: 'Picareta de Cobre',
      cost: { 'Copper Ingot': 30, Stick: 20 },
      icon: './Copper_Pickaxe.webp',
      speed: 6,
      maxDurability: 3093,
      craftTime: 60,
    },
    {
      id: 'pick_iron',
      name: 'Picareta de Ferro',
      cost: { 'Iron Ingot': 75, Stick: 50 },
      icon: './Iron_Pickaxe.webp',
      speed: 8,
      maxDurability: 6804,
      craftTime: 148,
    },
    {
      id: 'pick_gold',
      name: 'Picareta de Ouro',
      cost: { 'Gold Ingot': 150, Stick: 100 },
      icon: './Golden_Pickaxe.webp',
      speed: 10,
      maxDurability: 14969,
      craftTime: 271,
    },
    {
      id: 'pick_diamond',
      name: 'Picareta de Diamante',
      cost: { Diamond: 300, Stick: 200 },
      icon: './Diamond_Pickaxe.webp',
      speed: 12,
      maxDurability: 32932,
      craftTime: 578,
    },
    {
      id: 'pick_netherite',
      name: 'Picareta de Netherite',
      cost: { 'Netherite Ingot': 600, Stick: 400 },
      icon: './Netherite_Pickaxe.webp',
      speed: 14,
      maxDurability: 72450,
      craftTime: 1024,
    },
  ],

  //#######################################################
  // Machado
  //#######################################################

  axe: [
    {
      id: 'axe_wood',
      name: 'Machado de Madeira',
      cost: { 'Oak Planks': 6, Stick: 4 },
      icon: './Wooden_Axe.webp',
      speed: 2,
      maxDurability: 639,
      craftTime: 2,
    },
    {
      id: 'axe_stone',
      name: 'Machado de Pedra',
      cost: { Cobblestone: 15, Stick: 10 },
      icon: './Stone_Axe.webp',
      speed: 4,
      maxDurability: 1406,
      craftTime: 20,
    },
    {
      id: 'axe_cooper',
      name: 'Machado de Cobre',
      cost: { 'Copper Ingot': 30, Stick: 20 },
      icon: './Copper_Axe.webp',
      speed: 6,
      maxDurability: 3093,
      craftTime: 60,
    },
    {
      id: 'axe_iron',
      name: 'Machado de Ferro',
      cost: { 'Iron Ingot': 75, Stick: 50 },
      icon: './Iron_Axe.webp',
      speed: 6,
      maxDurability: 6804,
      craftTime: 148,
    },
    {
      id: 'axe_gold',
      name: 'Machado de Ouro',
      cost: { 'Gold Ingot': 150, Stick: 100 },
      icon: './Golden_Axe.webp',
      speed: 8,
      maxDurability: 14969,
      craftTime: 271,
    },
    {
      id: 'axe_diamond',
      name: 'Machado de Diamante',
      cost: { Diamond: 300, Stick: 200 },
      icon: './Diamond_Axe.webp',
      speed: 10,
      maxDurability: 32932,
      craftTime: 578,
    },
    {
      id: 'axe_netherite',
      name: 'Machado de Netherite',
      cost: { 'Netherite Ingot': 600, Stick: 400 },
      icon: './Netherite_Axe.webp',
      speed: 12,
      maxDurability: 72450,
      craftTime: 1024,
    },
  ],

  //#######################################################
  // Pá
  //#######################################################

  shovel: [
    {
      id: 'shov_wood',
      name: 'Pá de Madeira',
      cost: { 'Oak Planks': 2, Stick: 4 },
      icon: './Wooden_Shovel.webp',
      speed: 2,
      maxDurability: 639,
      craftTime: 2,
    },
    {
      id: 'shov_stone',
      name: 'Pá de Pedra',
      cost: { Cobblestone: 5, Stick: 10 },
      icon: './Stone_Shovel.webp',
      speed: 4,
      maxDurability: 1406,
      craftTime: 20,
    },
    {
      id: 'shov_cooper',
      name: 'Pá de Cobre',
      cost: { 'Copper Ingot': 10, Stick: 20 },
      icon: './Copper_Shovel.webp',
      speed: 6,
      maxDurability: 3093,
      craftTime: 60,
    },
    {
      id: 'shov_iron',
      name: 'Pá de Ferro',
      cost: { 'Iron Ingot': 25, Stick: 50 },
      icon: './Iron_Shovel.webp',
      speed: 6,
      maxDurability: 6804,
      craftTime: 148,
    },
    {
      id: 'shov_gold',
      name: 'Pá de Ouro',
      cost: { 'Gold Ingot': 50, Stick: 100 },
      icon: './Golden_Shovel.webp',
      speed: 8,
      maxDurability: 14969,
      craftTime: 271,
    },
    {
      id: 'shov_diamond',
      name: 'Pá de Diamante',
      cost: { Diamond: 100, Stick: 200 },
      icon: './Diamond_Shovel.webp',
      speed: 10,
      maxDurability: 32932,
      craftTime: 578,
    },
    {
      id: 'shov_netherite',
      name: 'Pá de Netherite',
      cost: { 'Netherite Ingot': 200, Stick: 400 },
      icon: './Netherite_Shovel.webp',
      speed: 12,
      maxDurability: 72450,
      craftTime: 1024,
    },
  ],

  //#######################################################
  // Enxada
  //#######################################################

  hoe: [
    {
      id: 'hoe_wood',
      name: 'Enxada de Madeira',
      cost: { 'Oak Planks': 4, Stick: 4 },
      icon: './Wooden_Hoe.webp',
      speed: 2,
      maxDurability: 639,
      craftTime: 2,
    },
    {
      id: 'hoe_stone',
      name: 'Enxada de Pedra',
      cost: { Cobblestone: 10, Stick: 10 },
      icon: './Stone_Hoe.webp',
      speed: 4,
      maxDurability: 1406,
      craftTime: 20,
    },
    {
      id: 'hoe_cooper',
      name: 'Enxada de Cobre',
      cost: { 'Copper Ingot': 20, Stick: 20 },
      icon: './Copper_Hoe.webp',
      speed: 6,
      maxDurability: 3093,
      craftTime: 60,
    },
    {
      id: 'hoe_iron',
      name: 'Enxada de Ferro',
      cost: { 'Iron Ingot': 50, Stick: 50 },
      icon: './Iron_Hoe.webp',
      speed: 6,
      maxDurability: 6804,
      craftTime: 148,
    },
    {
      id: 'hoe_gold',
      name: 'Enxada de Ouro',
      cost: { 'Gold Ingot': 100, Stick: 100 },
      icon: './Golden_Hoe.webp',
      speed: 8,
      maxDurability: 14969,
      craftTime: 271,
    },
    {
      id: 'hoe_diamond',
      name: 'Enxada de Diamante',
      cost: { Diamond: 200, Stick: 200 },
      icon: './Diamond_Hoe.webp',
      speed: 10,
      maxDurability: 32932,
      craftTime: 578,
    },
    {
      id: 'hoe_netherite',
      name: 'Enxada de Netherite',
      cost: { 'Netherite Ingot': 400, Stick: 400 },
      icon: './Netherite_Hoe.webp',
      speed: 12,
      maxDurability: 72450,
      craftTime: 1024,
    },
  ],

  //#######################################################
  // Armazenamento
  //#######################################################

  storage: [

    {
      id: 'stor_backpack_1',
      name: 'Mochila Pequena',
      cost: { 'Oak Planks': 40, Sand: 20 },
      icon: './Backpack_Mini.png',
      capacityBonus: 50,
      craftTime: 10,
    },

    {
      id: 'stor_backpack_2',
      name: 'Mochila Média',
      cost: { 'Oak Planks': 100, Sand: 50 },
      icon: './Backpack_Medium.png',
      capacityBonus: 50,
      craftTime: 10,
    },
    {
      id: 'stor_backpack_3',
      name: 'Mochila Grande',
      cost: { 'Oak Planks': 200, Sand: 100 },
      icon: './Backpack_Big.png',
      capacityBonus: 50,
      craftTime: 10,
    },
    {
      id: 'upgrade_backpack_cooper',
      name: 'Mochila de Cobre',
      cost: { 'Oak Planks': 400, Sand: 200 },
      icon: './Backpack_Cooper.png',
      capacityBonus: 50,
      craftTime: 10,
    },
    {
      id: 'upgrade_backpack_iron',
      name: 'Mochila de Ferro',
      cost: { 'Oak Planks': 1000, Sand: 500 },
      icon: './Backpack_Iron.png',
      capacityBonus: 50,
      craftTime: 10,
    },
    {
      id: 'upgrade_backpack_gold',
      name: 'Mochila de Ouro',
      cost: { 'Oak Planks': 2000, Sand: 1000 },
      icon: './Backpack_Gold.png',
      capacityBonus: 50,
      craftTime: 10,
    },
    {
      id: 'upgrade_backpack_diamond',
      name: 'Mochila de Diamante',
      cost: { 'Oak Planks': 4000, Sand: 2000 },
      icon: './Backpack_Diamond.png',
      capacityBonus: 50,
      craftTime: 10,
    },
    {
      id: 'upgrade_backpack_netherite',
      name: 'Mochila de Netherite',
      cost: { 'Oak Planks': 10000, Sand: 5000 },
      icon: './Backpack_Netherite.png',
      capacityBonus: 50,
      craftTime: 10,
    },
  ],
};

// 6. Upgrades (Melhorias com Categorias e Custos)
export const availableUpgrades = [
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
    cost: { 'Oak Planks': 50, 'Raw Iron': 10 },
    icon: '🪚',
  },
  {
    id: 'upg_storage_1',
    category: 'storage',
    name: 'Bolsos Profundos',
    description: 'Aumenta permanentemente o espaço do inventário em +100.',
    cost: { 'Oak Planks': 100, 'Raw Copper': 50 },
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
    cost: { 'Oak Planks': 50, Cobblestone: 50, 'Raw Iron': 10 },
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
  dropChance: number;
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
  Stick: 1,
  Apple: 5,
  'Oak Planks': 1,
  'Iron Ingot': 25,
  'Copper Ingot': 15,
  'Gold Ingot': 40,
  'Netherite Scrap': 300,
  'Netherite Ingot': 1500,
  Flint: 2,
  Glass: 3,
  Shears: 30,
  'Crafting Table': 10,
  'Blast Furnace': 150,
  
  // Sementes & Crops
  'Wheat Seeds': 2,
  'Wheat': 5,
  'Carrot': 8,
  'Potato': 8,
  'Beetroot Seeds': 4,
  'Beetroot': 10,
  'Nether Wart': 30,
  'Chorus Fruit': 50,
  'Golden Apple Seed': 500,
  
  // Insumos
  'Bone Meal': 10,
  'Magic Fertilizer': 100,
};

// 9. Hand & Workbench Recipes 
export const handRecipes = [
  { id: 'craft_planks', name: 'Tábuas de Carvalho', creates: 'Oak Planks', amount: 4, cost: { 'Oak Log': 1 }, craftTime: 1, icon: '/Oak_Planks.webp' },
  { id: 'craft_sticks', name: 'Graveto', creates: 'Stick', amount: 4, cost: { 'Oak Planks': 2 }, craftTime: 1, icon: '/Stick.webp' },
  { id: 'craft_workbench', name: 'Bancada de Trabalho', creates: 'Crafting Table', amount: 1, cost: { 'Oak Planks': 4 }, craftTime: 2, icon: '/Crafting_Table.webp' },
];

export const workbenchRecipes = [
  { id: 'craft_furnace', name: 'Fornalha', creates: 'Furnace', amount: 1, cost: { Cobblestone: 8 }, craftTime: 3, icon: '/Furnace.webp' },
  { id: 'craft_blast_furnace', name: 'Alto-forno', creates: 'Blast Furnace', amount: 1, cost: { 'Iron Ingot': 5, Furnace: 1, Cobblestone: 3 }, craftTime: 5, icon: '/Blast_Furnace.webp' },
  { id: 'craft_shears', name: 'Tesoura', creates: 'Shears', amount: 1, cost: { 'Iron Ingot': 2 }, craftTime: 2, icon: '/Shears.webp' },
  { id: 'craft_netherite_ingot', name: 'Barra de Netherite', creates: 'Netherite Ingot', amount: 1, cost: { 'Netherite Scrap': 4, 'Gold Ingot': 4 }, craftTime: 5, icon: '/Netherite_Ingot.webp' },
  { id: 'craft_enchanting_table', name: 'Mesa de Encantamentos', creates: 'Enchanting Table', amount: 1, cost: { Diamond: 2, Stone: 4, 'Oak Planks': 4 }, craftTime: 10, icon: '/Enchanting_Table.png' },
];

export const furnaceRecipes: Record<string, { output: string; time: number; icon: string; exp: number }> = {
  'Raw Copper': { output: 'Copper Ingot', time: 5, icon: '/Copper_Ingot.webp', exp: 1 },
  'Raw Iron': { output: 'Iron Ingot', time: 5, icon: '/Iron_Ingot.webp', exp: 2 },
  'Raw Gold': { output: 'Gold Ingot', time: 5, icon: '/Gold_Ingot.webp', exp: 3 },
  'Sand': { output: 'Glass', time: 3, icon: '/Glass.webp', exp: 1 },
  'Cobblestone': { output: 'Stone', time: 3, icon: '/Stone.webp', exp: 1 },
};

export const blastFurnaceRecipes: Record<string, { output: string; time: number; icon: string; exp: number }> = {
  'Ancient Debris': { output: 'Netherite Scrap', time: 10, icon: '/Netherite_Scrap.webp', exp: 10 },
  'Raw Gold': { output: 'Gold Ingot', time: 2.5, icon: '/Gold_Ingot.webp', exp: 3 },
  'Raw Iron': { output: 'Iron Ingot', time: 2.5, icon: '/Iron_Ingot.webp', exp: 2 },
  'Raw Copper': { output: 'Copper Ingot', time: 2.5, icon: '/Copper_Ingot.webp', exp: 1 },
};

export const fuelItems: Record<string, number> = {
  'Coal': 80,
  'Oak Log': 15,
  'Oak Planks': 15,
  'Stick': 5,
};

// Initialize Registry
Object.entries(dimensions).forEach(([k, v]) => gameRegistry.registerDimension(k, v));
Object.entries(blockProperties).forEach(([k, v]) => gameRegistry.registerBlockProperty(k, v));
Object.entries(dropMap).forEach(([k, v]) => gameRegistry.registerDrop(k, v));
Object.entries(nameMap).forEach(([k, v]) => gameRegistry.registerName(k, v));
Object.entries(toolChains).forEach(([k, v]) => gameRegistry.registerToolChain(k, v));
availableUpgrades.forEach(u => gameRegistry.registerUpgrade(u as unknown as Upgrade));
availablePets.forEach(p => gameRegistry.registerPet(p));
Object.entries(itemPrices).forEach(([k, v]) => gameRegistry.registerItemPrice(k, v));
handRecipes.forEach(r => gameRegistry.registerHandRecipe(r as unknown as Recipe));
workbenchRecipes.forEach(r => gameRegistry.registerWorkbenchRecipe(r as unknown as Recipe));
Object.entries(furnaceRecipes).forEach(([k, v]) => gameRegistry.registerFurnaceRecipe(k, v));
Object.entries(blastFurnaceRecipes).forEach(([k, v]) => gameRegistry.registerBlastFurnaceRecipe(k, v));
Object.entries(fuelItems).forEach(([k, v]) => gameRegistry.registerFuel(k, v));

// 10. Sistema de Encantamentos e Estatísticas de Materiais
export const materialStats: Record<string, { damage: number, maxDurability: number, enchantability: number }> = {
  wood: { damage: 2, maxDurability: 639, enchantability: 15 },
  stone: { damage: 3, maxDurability: 1406, enchantability: 5 },
  copper: { damage: 5, maxDurability: 3093, enchantability: 12 },
  iron: { damage: 6, maxDurability: 6804, enchantability: 14 },
  gold: { damage: 4, maxDurability: 14969, enchantability: 22 },
  diamond: { damage: 7, maxDurability: 32932, enchantability: 10 },
  netherite: { damage: 8, maxDurability: 72450, enchantability: 15 },
};

export const availableEnchantments = [
  { id: 'fortune', name: 'Fortuna', maxLevel: 3, desc: 'Aumenta as chances de drops extras ao minerar.', weight: 20 },
  { id: 'efficiency', name: 'Eficiência', maxLevel: 5, desc: 'Aumenta a velocidade de mineração.', weight: 30 },
  { id: 'unbreaking', name: 'Inquebrável', maxLevel: 3, desc: 'Aumenta a resistência do item, reduzindo o gasto de durabilidade.', weight: 25 },
  { id: 'silk_touch', name: 'Toque de Seda', maxLevel: 1, desc: 'Permite coletar o bloco em si, em vez dos seus drops regulares.', weight: 5 },
  { id: 'mending', name: 'Remendo', maxLevel: 1, desc: 'Usa a XP coletada para consertar a ferramenta em vez de aumentar seu nível.', weight: 2 },
];

// 11. Farming System
export type CropRarity = 'Comum' | 'Raro' | 'Épico' | 'Lendário';

export interface CropDef {
  id: string;
  name: string;
  seedId: string;
  baseGrowthTime: number; // in seconds
  rarity: CropRarity;
  baseYield: number;
  icon: string;
}

export const availableCrops: CropDef[] = [
  { id: 'crop_wheat', name: 'Trigo', seedId: 'Wheat Seeds', baseGrowthTime: 60, rarity: 'Comum', baseYield: 1, icon: '🌾' },
  { id: 'crop_carrot', name: 'Cenoura', seedId: 'Carrot', baseGrowthTime: 120, rarity: 'Comum', baseYield: 2, icon: '🥕' },
  { id: 'crop_potato', name: 'Batata', seedId: 'Potato', baseGrowthTime: 120, rarity: 'Comum', baseYield: 2, icon: '🥔' },
  { id: 'crop_beetroot', name: 'Beterraba', seedId: 'Beetroot Seeds', baseGrowthTime: 150, rarity: 'Raro', baseYield: 1, icon: '🧶' },
  { id: 'crop_nether_wart', name: 'Fungo do Nether', seedId: 'Nether Wart', baseGrowthTime: 300, rarity: 'Épico', baseYield: 1, icon: '🍄' },
  { id: 'crop_chorus', name: 'Fruta do Coro', seedId: 'Chorus Fruit', baseGrowthTime: 600, rarity: 'Lendário', baseYield: 1, icon: '🍇' },
  // Semente Dimensional Customizada
  { id: 'crop_golden_apple', name: 'Maçã Dourada', seedId: 'Golden Apple Seed', baseGrowthTime: 1800, rarity: 'Lendário', baseYield: 1, icon: '🍎' },
];
