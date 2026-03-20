// ═══════════════════════════════════════════════════════════
// Sistema de Eventos Aleatórios & Baús
// ═══════════════════════════════════════════════════════════

// ─── Eventos Aleatórios ────────────────────────────────────

export type EventModifier =
  | 'mining_speed'      // Multiplica velocidade de mineração
  | 'drop_amount'       // Multiplica quantidade de drops
  | 'shop_discount'     // Desconto na loja (poções)
  | 'pet_speed'         // Velocidade de pets
  | 'pet_drop_chance'   // Chance de drop de pets
  | 'item_rain';        // Chuva de itens (adiciona itens ao inventário)

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  emoji: string;
  durationMs: number;
  modifier: EventModifier;
  modifierValue: number; // Multiplicador (ex: 2 = dobro)
  color: string;         // Tailwind gradient
  borderColor: string;
}

export const randomEvents: RandomEvent[] = [
  {
    id: 'evt_item_rain',
    name: 'Chuva de Itens',
    description: 'Itens aleatórios estão caindo do céu! +5 itens aleatórios a cada 3 segundos.',
    emoji: '🌧️',
    durationMs: 60_000,
    modifier: 'item_rain',
    modifierValue: 5,
    color: 'from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-400',
  },
  {
    id: 'evt_shop_discount',
    name: 'Liquidação Total',
    description: 'Todos os preços da loja estão com 50% de desconto!',
    emoji: '🏷️',
    durationMs: 90_000,
    modifier: 'shop_discount',
    modifierValue: 0.5,
    color: 'from-green-400 to-emerald-600',
    borderColor: 'border-green-400',
  },
  {
    id: 'evt_mining_speed',
    name: 'Frenesi de Mineração',
    description: 'Velocidade de mineração triplicada!',
    emoji: '⛏️',
    durationMs: 60_000,
    modifier: 'mining_speed',
    modifierValue: 3,
    color: 'from-amber-400 to-orange-600',
    borderColor: 'border-amber-400',
  },
  {
    id: 'evt_pet_speed',
    name: 'Instinto Selvagem',
    description: 'Pets com velocidade dobrada!',
    emoji: '🐾',
    durationMs: 90_000,
    modifier: 'pet_speed',
    modifierValue: 2,
    color: 'from-pink-400 to-rose-600',
    borderColor: 'border-pink-400',
  },
  {
    id: 'evt_pet_chance',
    name: 'Atração Animal',
    description: 'Chance de encontrar pets dobrada!',
    emoji: '🌟',
    durationMs: 120_000,
    modifier: 'pet_drop_chance',
    modifierValue: 2,
    color: 'from-violet-400 to-purple-600',
    borderColor: 'border-violet-400',
  },
  {
    id: 'evt_double_drop',
    name: 'Fortuna Suprema',
    description: 'Todos os drops de mineração em dobro!',
    emoji: '💎',
    durationMs: 60_000,
    modifier: 'drop_amount',
    modifierValue: 2,
    color: 'from-yellow-300 to-amber-500',
    borderColor: 'border-yellow-300',
  },
];

// ─── Baús ──────────────────────────────────────────────────

export interface ChestReward {
  type: 'resource' | 'minecoins' | 'accessory';
  itemId?: string;       // ID do recurso ou acessório
  amountMin: number;
  amountMax: number;
  weight: number;        // Peso pra rolagem de loot
}

export interface ChestTier {
  id: string;
  name: string;
  emoji: string;
  dropDifficulty: number; // Multiplicador de hardness necessário (1x = 100%)
  color: string;
  borderColor: string;
  glowColor: string;
  baseDropChance: number; // Chance base por bloco minerado (0-1)
  minRewards: number;
  maxRewards: number;
  possibleRewards: ChestReward[];
}

export const chestTiers: ChestTier[] = [
  {
    id: 'chest_common',
    name: 'Baú Comum',
    emoji: '📦',
    dropDifficulty: 1,
    color: 'from-stone-400 to-stone-600',
    borderColor: 'border-stone-400',
    glowColor: 'shadow-stone-400/30',
    baseDropChance: 0.001, // 1/1k
    minRewards: 1,
    maxRewards: 3,
    possibleRewards: [
      { type: 'resource', itemId: 'Dirt', amountMin: 10, amountMax: 50, weight: 30 },
      { type: 'resource', itemId: 'Sand', amountMin: 10, amountMax: 50, weight: 30 },
      { type: 'resource', itemId: 'Cobblestone', amountMin: 10, amountMax: 50, weight: 25 },
      { type: 'resource', itemId: 'Oak Log', amountMin: 5, amountMax: 20, weight: 20 },
      { type: 'resource', itemId: 'Coal', amountMin: 3, amountMax: 15, weight: 15 },
      { type: 'minecoins', amountMin: 10, amountMax: 50, weight: 20 },
      { type: 'accessory', itemId: 'ring_redstone', amountMin: 1, amountMax: 1, weight: 2 },
      { type: 'accessory', itemId: 'ring_slime', amountMin: 1, amountMax: 1, weight: 2 },
      { type: 'accessory', itemId: 'glove_copper', amountMin: 1, amountMax: 1, weight: 2 },
      { type: 'accessory', itemId: 'belt_hopper', amountMin: 1, amountMax: 1, weight: 2 },
    ],
  },
  {
    id: 'chest_rare',
    name: 'Baú Raro',
    emoji: '🎁',
    dropDifficulty: 2,
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400',
    glowColor: 'shadow-blue-400/30',
    baseDropChance: 0.0004, // 1/2.5k
    minRewards: 2,
    maxRewards: 4,
    possibleRewards: [
      { type: 'resource', itemId: 'Raw Iron', amountMin: 10, amountMax: 40, weight: 25 },
      { type: 'resource', itemId: 'Raw Copper', amountMin: 10, amountMax: 40, weight: 25 },
      { type: 'resource', itemId: 'Coal', amountMin: 10, amountMax: 30, weight: 20 },
      { type: 'resource', itemId: 'Oak Planks', amountMin: 20, amountMax: 60, weight: 15 },
      { type: 'minecoins', amountMin: 50, amountMax: 200, weight: 20 },
      { type: 'accessory', itemId: 'ring_skeleton', amountMin: 1, amountMax: 1, weight: 3 },
      { type: 'accessory', itemId: 'amulet_rabbit', amountMin: 1, amountMax: 1, weight: 3 },
      { type: 'accessory', itemId: 'glove_fortune', amountMin: 1, amountMax: 1, weight: 3 },
      { type: 'accessory', itemId: 'belt_chainmail', amountMin: 1, amountMax: 1, weight: 3 },
    ],
  },
  {
    id: 'chest_epic',
    name: 'Baú Épico',
    emoji: '💜',
    dropDifficulty: 3,
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-400',
    glowColor: 'shadow-purple-400/30',
    baseDropChance: 0.00015, // 1/6.6k
    minRewards: 2,
    maxRewards: 5,
    possibleRewards: [
      { type: 'resource', itemId: 'Raw Gold', amountMin: 10, amountMax: 30, weight: 20 },
      { type: 'resource', itemId: 'Iron Ingot', amountMin: 5, amountMax: 20, weight: 20 },
      { type: 'resource', itemId: 'Diamond', amountMin: 1, amountMax: 5, weight: 10 },
      { type: 'minecoins', amountMin: 200, amountMax: 500, weight: 20 },
      { type: 'accessory', itemId: 'ring_creeper', amountMin: 1, amountMax: 1, weight: 4 },
      { type: 'accessory', itemId: 'amulet_amethyst', amountMin: 1, amountMax: 1, weight: 4 },
      { type: 'accessory', itemId: 'glove_magma', amountMin: 1, amountMax: 1, weight: 4 },
      { type: 'accessory', itemId: 'belt_tnt', amountMin: 1, amountMax: 1, weight: 4 },
    ],
  },
  {
    id: 'chest_legendary',
    name: 'Baú Lendário',
    emoji: '🏆',
    dropDifficulty: 4,
    color: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-amber-400/40',
    baseDropChance: 0.00005, // 1/20k
    minRewards: 3,
    maxRewards: 5,
    possibleRewards: [
      { type: 'resource', itemId: 'Diamond', amountMin: 3, amountMax: 10, weight: 15 },
      { type: 'resource', itemId: 'Gold Ingot', amountMin: 5, amountMax: 15, weight: 15 },
      { type: 'resource', itemId: 'Emerald', amountMin: 1, amountMax: 5, weight: 10 },
      { type: 'minecoins', amountMin: 500, amountMax: 1500, weight: 20 },
      { type: 'accessory', itemId: 'ring_gold', amountMin: 1, amountMax: 1, weight: 5 },
      { type: 'accessory', itemId: 'amulet_shulker', amountMin: 1, amountMax: 1, weight: 5 },
      { type: 'accessory', itemId: 'glove_sculk', amountMin: 1, amountMax: 1, weight: 5 },
      { type: 'accessory', itemId: 'belt_lodestone', amountMin: 1, amountMax: 1, weight: 5 },
    ],
  },
  {
    id: 'chest_mythic',
    name: 'Baú Mítico',
    emoji: '🔮',
    dropDifficulty: 5,
    color: 'from-fuchsia-400 to-pink-600',
    borderColor: 'border-fuchsia-400',
    glowColor: 'shadow-fuchsia-400/40',
    baseDropChance: 0.000015, // 1/66k
    minRewards: 3,
    maxRewards: 6,
    possibleRewards: [
      { type: 'resource', itemId: 'Diamond', amountMin: 5, amountMax: 15, weight: 15 },
      { type: 'resource', itemId: 'Emerald', amountMin: 3, amountMax: 10, weight: 15 },
      { type: 'resource', itemId: 'Ancient Debris', amountMin: 1, amountMax: 3, weight: 10 },
      { type: 'minecoins', amountMin: 1000, amountMax: 3000, weight: 15 },
      { type: 'accessory', itemId: 'amulet_phantom', amountMin: 1, amountMax: 1, weight: 5 },
      { type: 'accessory', itemId: 'glove_redstone', amountMin: 1, amountMax: 1, weight: 5 },
      { type: 'accessory', itemId: 'belt_brewing', amountMin: 1, amountMax: 1, weight: 5 },
    ],
  },
  {
    id: 'chest_supreme',
    name: 'Baú Supremo',
    emoji: '👑',
    dropDifficulty: 6,
    color: 'from-red-400 to-rose-600',
    borderColor: 'border-red-400',
    glowColor: 'shadow-red-400/40',
    baseDropChance: 0.000005, // 1/200k
    minRewards: 4,
    maxRewards: 6,
    possibleRewards: [
      { type: 'resource', itemId: 'Diamond', amountMin: 10, amountMax: 25, weight: 15 },
      { type: 'resource', itemId: 'Netherite Scrap', amountMin: 1, amountMax: 5, weight: 10 },
      { type: 'minecoins', amountMin: 2000, amountMax: 5000, weight: 15 },
      { type: 'accessory', itemId: 'ring_warden', amountMin: 1, amountMax: 1, weight: 6 },
      { type: 'accessory', itemId: 'belt_sculk', amountMin: 1, amountMax: 1, weight: 6 },
    ],
  },
  {
    id: 'chest_divine',
    name: 'Baú Divino',
    emoji: '✨',
    dropDifficulty: 7,
    color: 'from-sky-300 to-cyan-500',
    borderColor: 'border-sky-300',
    glowColor: 'shadow-sky-300/40',
    baseDropChance: 0.000001, // 1/1m
    minRewards: 4,
    maxRewards: 7,
    possibleRewards: [
      { type: 'resource', itemId: 'Netherite Scrap', amountMin: 3, amountMax: 8, weight: 15 },
      { type: 'resource', itemId: 'Netherite Ingot', amountMin: 1, amountMax: 3, weight: 10 },
      { type: 'minecoins', amountMin: 5000, amountMax: 10000, weight: 15 },
      { type: 'accessory', itemId: 'ring_magma', amountMin: 1, amountMax: 1, weight: 6 },
      { type: 'accessory', itemId: 'amulet_blaze', amountMin: 1, amountMax: 1, weight: 6 },
    ],
  },
  {
    id: 'chest_celestial',
    name: 'Baú Celestial',
    emoji: '🌠',
    dropDifficulty: 8,
    color: 'from-indigo-300 to-violet-500',
    borderColor: 'border-indigo-300',
    glowColor: 'shadow-indigo-300/40',
    baseDropChance: 0.0000003, // 1/3.33m
    minRewards: 5,
    maxRewards: 7,
    possibleRewards: [
      { type: 'resource', itemId: 'Netherite Ingot', amountMin: 2, amountMax: 5, weight: 15 },
      { type: 'minecoins', amountMin: 10000, amountMax: 25000, weight: 15 },
      { type: 'accessory', itemId: 'ring_netherite', amountMin: 1, amountMax: 1, weight: 7 },
      { type: 'accessory', itemId: 'glove_nether_star', amountMin: 1, amountMax: 1, weight: 7 },
    ],
  },
  {
    id: 'chest_cosmic',
    name: 'Baú Cósmico',
    emoji: '🌌',
    dropDifficulty: 9,
    color: 'from-purple-300 to-fuchsia-600',
    borderColor: 'border-purple-300',
    glowColor: 'shadow-purple-300/50',
    baseDropChance: 0.00000005, // 1/20m
    minRewards: 5,
    maxRewards: 8,
    possibleRewards: [
      { type: 'resource', itemId: 'Netherite Ingot', amountMin: 3, amountMax: 8, weight: 15 },
      { type: 'minecoins', amountMin: 25000, amountMax: 50000, weight: 15 },
      { type: 'accessory', itemId: 'ring_notch', amountMin: 1, amountMax: 1, weight: 8 },
      { type: 'accessory', itemId: 'amulet_dragon', amountMin: 1, amountMax: 1, weight: 8 },
    ],
  },
  {
    id: 'chest_universal',
    name: 'Baú Universal',
    emoji: '🪐',
    dropDifficulty: 10,
    color: 'from-amber-200 via-yellow-400 to-orange-500',
    borderColor: 'border-amber-200',
    glowColor: 'shadow-amber-200/60',
    baseDropChance: 0.00000001, // 1/100m
    minRewards: 6,
    maxRewards: 10,
    possibleRewards: [
      { type: 'resource', itemId: 'Netherite Ingot', amountMin: 5, amountMax: 15, weight: 15 },
      { type: 'minecoins', amountMin: 50000, amountMax: 100000, weight: 15 },
      { type: 'accessory', itemId: 'ring_nether_star', amountMin: 1, amountMax: 1, weight: 10 },
      { type: 'accessory', itemId: 'amulet_recovery', amountMin: 1, amountMax: 1, weight: 10 },
      { type: 'accessory', itemId: 'glove_netherite', amountMin: 1, amountMax: 1, weight: 10 },
      { type: 'accessory', itemId: 'belt_ender', amountMin: 1, amountMax: 1, weight: 10 },
    ],
  },
];

// Helpers

export function rollChestDrop(pickaxeLevel: number): ChestTier | null {
  for (let i = chestTiers.length - 1; i >= 0; i--) {
    const tier = chestTiers[i];

    // Penalize heavily if pickaxe level is lower than the chest's difficulty requirement
    const difficultyPenalty = Math.max(1, (tier.dropDifficulty - pickaxeLevel) * 2);

    const boostedChance = (tier.baseDropChance / difficultyPenalty) * (1 + pickaxeLevel * 0.1);

    if (Math.random() < boostedChance) {
      return tier;
    }
  }
  return null;
}

export function rollChestRewards(chest: ChestTier): { type: string; itemId?: string; amount: number }[] {
  const rewardCount = chest.minRewards + Math.floor(Math.random() * (chest.maxRewards - chest.minRewards + 1));
  const results: { type: string; itemId?: string; amount: number }[] = [];

  const totalWeight = chest.possibleRewards.reduce((sum, r) => sum + r.weight, 0);

  for (let i = 0; i < rewardCount; i++) {
    let roll = Math.random() * totalWeight;
    for (const reward of chest.possibleRewards) {
      if (roll < reward.weight) {
        const amount = reward.amountMin + Math.floor(Math.random() * (reward.amountMax - reward.amountMin + 1));
        results.push({ type: reward.type, itemId: reward.itemId, amount });
        break;
      }
      roll -= reward.weight;
    }
  }

  return results;
}
