import { create } from 'zustand';
import type { CraftingTask } from '../components/CraftingPanel';
import type { SmeltingState } from '../components/FurnacePanel';
import type { RandomEvent } from '../assets/events';
import type { ActiveTab } from '../components/ui/Sidebar';
import type { AccessorySlot } from '../assets/accessories';
import { getAccessoryById } from '../assets/accessories';
import {
  BASE_INVENTORY_CAPACITY,
  UPGRADE_STORAGE_BONUS,
  toolChains,
} from '../assets/consts';

export interface FarmingSlot {
  id: number;
  seed: string | null;
  plantedAt: number | null;
  wateredAt: number | null;
  fertilizer: string | null;
}

// ═══════════════════════════════════════════════════════════
// Game Store — Estado global centralizado via Zustand
// ═══════════════════════════════════════════════════════════

export interface GameState {
  // ─── UI ────────────────────────────────────────────────
  activeTab: ActiveTab;
  videoQuality: 'Baixa' | 'Média' | 'Alta';
  audioVolume: number;
  isMuted: boolean;
  isDebugMode: boolean;
  isInventoryMinimized: boolean;

  // ─── Player RPG Stats ──────────────────────────────────
  playerXp: number;
  playerLevel: number;

  // ─── Mining ────────────────────────────────────────────
  currentDim: string;
  currentBlock: string;
  miningProgress: number;
  warningMessage: string;

  // ─── Inventory ─────────────────────────────────────────
  inventory: Record<string, number>;

  // ─── Tools ─────────────────────────────────────────────
  toolsLevel: Record<string, number>;
  toolDurabilities: Record<string, number>;
  toolEnchantments: Record<string, Record<string, number>>;

  // ─── Economy ───────────────────────────────────────────
  mineCoins: number;
  activePotions: Record<string, number>;

  // ─── Crafting ──────────────────────────────────────────
  activeCraft: CraftingTask | null;
  activeUpgrades: string[];
  furnaceState: SmeltingState | null;
  ownedStations: Record<string, boolean>;

  // ─── Pets ──────────────────────────────────────────────
  ownedPets: Record<string, { level: number; xp: number }>;
  equippedPet: string | null;

  // ─── Villagers ─────────────────────────────────────────
  ownedVillagers: Record<string, number>;

  // ─── Rebirth ───────────────────────────────────────────
  rebirthCount: number;
  prestigeCurrency: number;
  rebirthUpgradesLevels: Record<string, number>;

  // ─── Events ────────────────────────────────────────────
  activeEvent: RandomEvent | null;
  eventEndTime: number;

  // ─── Farming ───────────────────────────────────────────
  farmingSlots: FarmingSlot[];
  farmingLevel: number;
  farmingXp: number;

  // ─── Accessories ───────────────────────────────────────
  ownedAccessories: Record<string, boolean>;
  equippedAccessories: Record<AccessorySlot, string | null>;

  // ─── Chest ─────────────────────────────────────────────
  pendingChest: import('../assets/events').ChestTier | null;
  chestRewards: { type: string; itemId?: string; amount: number }[];
}

export interface GameActions {
  // ─── UI Actions ────────────────────────────────────────
  setActiveTab: (tab: ActiveTab) => void;
  setVideoQuality: (q: 'Baixa' | 'Média' | 'Alta') => void;
  setAudioVolume: (v: number) => void;
  setIsMuted: (m: boolean) => void;
  setIsDebugMode: (d: boolean) => void;
  setIsInventoryMinimized: (minimized: boolean) => void;

  // ─── Player RPG Actions ────────────────────────────────
  addPlayerXp: (amount: number) => void;
  setPlayerLevel: (level: number) => void; // Para uso futuro ou encantos que consomem nivel

  // ─── Mining Actions ────────────────────────────────────
  setCurrentDim: (dim: string) => void;
  setCurrentBlock: (block: string) => void;
  setMiningProgress: (p: number) => void;
  setWarningMessage: (msg: string) => void;

  // ─── Inventory Actions ─────────────────────────────────
  setInventory: (updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  addInventoryItem: (item: string, amount: number) => void;
  removeInventoryItem: (item: string, amount: number) => void;

  // ─── Tools Actions ─────────────────────────────────────
  setToolsLevel: (updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  setToolDurabilities: (updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  addToolEnchantment: (toolType: string, enchantmentId: string, level: number) => void;

  // ─── Economy Actions ───────────────────────────────────
  setMineCoins: (updater: number | ((prev: number) => number)) => void;
  setActivePotions: (updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;

  // ─── Crafting Actions ──────────────────────────────────
  setActiveCraft: (updater: CraftingTask | null | ((prev: CraftingTask | null) => CraftingTask | null)) => void;
  setActiveUpgrades: (updater: string[] | ((prev: string[]) => string[])) => void;
  setFurnaceState: (updater: SmeltingState | null | ((prev: SmeltingState | null) => SmeltingState | null)) => void;
  setOwnedStations: (updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;

  // ─── Pets Actions ──────────────────────────────────────
  setOwnedPets: (updater: Record<string, { level: number; xp: number }> | ((prev: Record<string, { level: number; xp: number }>) => Record<string, { level: number; xp: number }>)) => void;
  setEquippedPet: (petId: string | null) => void;

  // ─── Villagers Actions ─────────────────────────────────
  setOwnedVillagers: (updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;

  // ─── Rebirth Actions ───────────────────────────────────
  setRebirthCount: (updater: number | ((prev: number) => number)) => void;
  setPrestigeCurrency: (updater: number | ((prev: number) => number)) => void;
  setRebirthUpgradesLevels: (updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;

  // ─── Event Actions ─────────────────────────────────────
  setActiveEvent: (event: RandomEvent | null) => void;
  setEventEndTime: (time: number) => void;

  // ─── Farming Actions ───────────────────────────────────
  setFarmingSlots: (updater: FarmingSlot[] | ((prev: FarmingSlot[]) => FarmingSlot[])) => void;
  unlockFarmingSlot: () => void;
  addFarmingXp: (amount: number) => void;

  // ─── Accessory Actions ─────────────────────────────────
  setOwnedAccessories: (updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  setEquippedAccessories: (updater: Record<AccessorySlot, string | null> | ((prev: Record<AccessorySlot, string | null>) => Record<AccessorySlot, string | null>)) => void;
  equipAccessory: (accessoryId: string) => void;
  unequipAccessory: (slot: AccessorySlot) => void;
  getEquippedEffect: (effectType: string) => ReturnType<typeof getAccessoryById> | null;

  // ─── Chest Actions ─────────────────────────────────────
  setPendingChest: (chest: import('../assets/events').ChestTier | null) => void;
  setChestRewards: (rewards: { type: string; itemId?: string; amount: number }[]) => void;
  handleCloseChest: () => void;

  // ─── Computed Getters ──────────────────────────────────
  getCurrentCapacity: () => number;
  getMaxCapacity: () => number;
  getRebirthModifiers: () => { coinMult: number; speedMult: number; dropBonus: number };
  getEventModifiers: () => { miningSpeedMult: number; dropMult: number; petChanceMult: number };
}

// ─── Helper: resolver updater (valor direto ou função) ───
function resolveUpdater<T>(updater: T | ((prev: T) => T), current: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
}

// ─── Helper: carregar do localStorage ────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  // ═══ INITIAL STATE ═══

  // UI
  activeTab: 'mining' as ActiveTab,
  videoQuality: 'Alta',
  audioVolume: (() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement | null;
    return audio ? audio.volume : 0.5;
  })(),
  isMuted: (() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement | null;
    return audio ? audio.muted : false;
  })(),
  isDebugMode: false,
  isInventoryMinimized: false,

  // Player RPG
  playerXp: loadFromStorage<number>('playerXp', 0),
  playerLevel: loadFromStorage<number>('playerLevel', 0),

  // Mining
  currentDim: 'Overworld',
  currentBlock: 'Grass_Block',
  miningProgress: 0,
  warningMessage: '',

  // Inventory
  inventory: {},

  // Tools
  toolsLevel: { pickaxe: 0, shovel: 0, axe: 0, hoe: 0, storage: 0 },
  toolDurabilities: { pickaxe: 0, shovel: 0, axe: 0, hoe: 0 },
  toolEnchantments: loadFromStorage<Record<string, Record<string, number>>>('toolEnchantments', { pickaxe: {}, shovel: {}, axe: {}, hoe: {} }),

  // Economy
  mineCoins: 0,
  activePotions: {},

  // Crafting
  activeCraft: null,
  activeUpgrades: [],
  furnaceState: null,
  ownedStations: {},

  // Pets
  ownedPets: {},
  equippedPet: null,

  // Villagers
  ownedVillagers: {},

  // Rebirth (persistido no localStorage)
  rebirthCount: loadFromStorage<number>('rebirthCount', 0),
  prestigeCurrency: loadFromStorage<number>('prestigeCurrency', 0),
  rebirthUpgradesLevels: loadFromStorage<Record<string, number>>('rebirthUpgradesLevels', {}),

  // Events
  activeEvent: null,
  eventEndTime: 0,

  // Farming
  farmingSlots: loadFromStorage<FarmingSlot[]>('farmingSlots', 
    Array.from({ length: 5 }).map((_, i) => ({ id: i, seed: null, plantedAt: null, wateredAt: null, fertilizer: null }))
  ),
  farmingLevel: loadFromStorage<number>('farmingLevel', 0),
  farmingXp: loadFromStorage<number>('farmingXp', 0),

  // Accessories (persistido no localStorage)
  ownedAccessories: loadFromStorage<Record<string, boolean>>('ownedAccessories', {}),
  equippedAccessories: loadFromStorage<Record<AccessorySlot, string | null>>(
    'equippedAccessories',
    { ring: null, amulet: null, belt: null, glove: null },
  ),

  // Chest
  pendingChest: null,
  chestRewards: [],

  // ═══ ACTIONS ═══

  // UI
  setActiveTab: (tab) => set({ activeTab: tab }),
  setVideoQuality: (q) => set({ videoQuality: q }),
  setAudioVolume: (v) => set({ audioVolume: v }),
  setIsMuted: (m) => set({ isMuted: m }),
  setIsDebugMode: (d) => set({ isDebugMode: d }),
  setIsInventoryMinimized: (minimized) => set({ isInventoryMinimized: minimized }),

  // Player RPG
  addPlayerXp: (amount) => set((state) => {
    let currentXp = state.playerXp + amount;
    let currentLevel = state.playerLevel;
    
    // Calcula XP necessário para o próximo nível usando a curva do Minecraft
    const getXpRequiredForNextLevel = (level: number) => {
      if (level <= 15) return 2 * level + 7;
      if (level <= 30) return 5 * level - 38;
      return 9 * level - 158;
    };

    let requiredXp = getXpRequiredForNextLevel(currentLevel);
    while (currentXp >= requiredXp) {
      currentXp -= requiredXp;
      currentLevel++;
      requiredXp = getXpRequiredForNextLevel(currentLevel);
    }

    localStorage.setItem('playerXp', currentXp.toString());
    localStorage.setItem('playerLevel', currentLevel.toString());

    return { playerXp: currentXp, playerLevel: currentLevel };
  }),
  setPlayerLevel: (level) => set({ playerLevel: level }),

  // Mining
  setCurrentDim: (dim) => set({ currentDim: dim }),
  setCurrentBlock: (block) => set({ currentBlock: block }),
  setMiningProgress: (p) => set({ miningProgress: p }),
  setWarningMessage: (msg) => set({ warningMessage: msg }),

  // Inventory
  setInventory: (updater) => set((state) => ({
    inventory: resolveUpdater(updater, state.inventory),
  })),
  addInventoryItem: (item, amount) => set((state) => ({
    inventory: { ...state.inventory, [item]: (state.inventory[item] || 0) + amount },
  })),
  removeInventoryItem: (item, amount) => set((state) => ({
    inventory: { ...state.inventory, [item]: Math.max(0, (state.inventory[item] || 0) - amount) },
  })),

  // Tools
  setToolsLevel: (updater) => set((state) => ({
    toolsLevel: resolveUpdater(updater, state.toolsLevel),
  })),
  setToolDurabilities: (updater) => set((state) => ({
    toolDurabilities: resolveUpdater(updater, state.toolDurabilities),
  })),
  addToolEnchantment: (toolType, enchantmentId, level) => set((state) => {
    const currentTools = { ...state.toolEnchantments };
    const toolEnchants = { ...(currentTools[toolType] || {}) };
    const currentLevel = toolEnchants[enchantmentId] || 0;
    
    if (level > currentLevel) {
      toolEnchants[enchantmentId] = level;
    }
    currentTools[toolType] = toolEnchants;

    // Conflito Toque de Seda / Fortuna
    if (enchantmentId === 'silk_touch' && toolEnchants['fortune']) delete toolEnchants['fortune'];
    if (enchantmentId === 'fortune' && toolEnchants['silk_touch']) delete toolEnchants['silk_touch'];

    localStorage.setItem('toolEnchantments', JSON.stringify(currentTools));
    return { toolEnchantments: currentTools };
  }),

  // Economy
  setMineCoins: (updater) => set((state) => ({
    mineCoins: resolveUpdater(updater, state.mineCoins),
  })),
  setActivePotions: (updater) => set((state) => ({
    activePotions: resolveUpdater(updater, state.activePotions),
  })),

  // Crafting
  setActiveCraft: (updater) => set((state) => ({
    activeCraft: resolveUpdater(updater, state.activeCraft),
  })),
  setActiveUpgrades: (updater) => set((state) => ({
    activeUpgrades: resolveUpdater(updater, state.activeUpgrades),
  })),
  setFurnaceState: (updater) => set((state) => ({
    furnaceState: resolveUpdater(updater, state.furnaceState),
  })),
  setOwnedStations: (updater) => set((state) => ({
    ownedStations: resolveUpdater(updater, state.ownedStations),
  })),

  // Pets
  setOwnedPets: (updater) => set((state) => ({
    ownedPets: resolveUpdater(updater, state.ownedPets),
  })),
  setEquippedPet: (petId) => set({ equippedPet: petId }),

  // Villagers
  setOwnedVillagers: (updater) => set((state) => ({
    ownedVillagers: resolveUpdater(updater, state.ownedVillagers),
  })),

  // Rebirth
  setRebirthCount: (updater) => set((state) => {
    const newVal = resolveUpdater(updater, state.rebirthCount);
    localStorage.setItem('rebirthCount', newVal.toString());
    return { rebirthCount: newVal };
  }),
  setPrestigeCurrency: (updater) => set((state) => {
    const newVal = resolveUpdater(updater, state.prestigeCurrency);
    localStorage.setItem('prestigeCurrency', newVal.toString());
    return { prestigeCurrency: newVal };
  }),
  setRebirthUpgradesLevels: (updater) => set((state) => {
    const newVal = resolveUpdater(updater, state.rebirthUpgradesLevels);
    localStorage.setItem('rebirthUpgradesLevels', JSON.stringify(newVal));
    return { rebirthUpgradesLevels: newVal };
  }),

  // Events
  setActiveEvent: (event) => set({ activeEvent: event }),
  setEventEndTime: (time) => set({ eventEndTime: time }),

  // Farming
  setFarmingSlots: (updater) => set((state) => {
    const newVal = resolveUpdater(updater, state.farmingSlots);
    localStorage.setItem('farmingSlots', JSON.stringify(newVal));
    return { farmingSlots: newVal };
  }),
  unlockFarmingSlot: () => set((state) => {
    const newSlots = [...state.farmingSlots, {
      id: state.farmingSlots.length,
      seed: null,
      plantedAt: null,
      wateredAt: null,
      fertilizer: null
    }];
    localStorage.setItem('farmingSlots', JSON.stringify(newSlots));
    return { farmingSlots: newSlots };
  }),
  addFarmingXp: (amount) => set((state) => {
    let currentXp = state.farmingXp + amount;
    let currentLevel = state.farmingLevel;
    
    let requiredXp = (currentLevel + 1) * 100; // Flat formula for farming
    while (currentXp >= requiredXp) {
      currentXp -= requiredXp;
      currentLevel++;
      requiredXp = (currentLevel + 1) * 100;
    }

    localStorage.setItem('farmingXp', currentXp.toString());
    localStorage.setItem('farmingLevel', currentLevel.toString());

    return { farmingXp: currentXp, farmingLevel: currentLevel };
  }),

  // Accessories
  setOwnedAccessories: (updater) => set((state) => {
    const newVal = resolveUpdater(updater, state.ownedAccessories);
    localStorage.setItem('ownedAccessories', JSON.stringify(newVal));
    return { ownedAccessories: newVal };
  }),
  setEquippedAccessories: (updater) => set((state) => {
    const newVal = resolveUpdater(updater, state.equippedAccessories);
    localStorage.setItem('equippedAccessories', JSON.stringify(newVal));
    return { equippedAccessories: newVal };
  }),
  equipAccessory: (accessoryId) => {
    const state = get();
    const acc = getAccessoryById(accessoryId);
    if (!acc || !state.ownedAccessories[accessoryId]) return;
    const newEquipped = { ...state.equippedAccessories, [acc.slot]: accessoryId };
    localStorage.setItem('equippedAccessories', JSON.stringify(newEquipped));
    set({ equippedAccessories: newEquipped });
  },
  unequipAccessory: (slot) => {
    const state = get();
    const newEquipped = { ...state.equippedAccessories, [slot]: null };
    localStorage.setItem('equippedAccessories', JSON.stringify(newEquipped));
    set({ equippedAccessories: newEquipped });
  },
  getEquippedEffect: (effectType) => {
    const state = get();
    for (const slotId of Object.values(state.equippedAccessories)) {
      if (!slotId) continue;
      const acc = getAccessoryById(slotId);
      if (acc && acc.effectType === effectType) return acc;
    }
    return null;
  },

  // Chest
  setPendingChest: (chest) => set({ pendingChest: chest }),
  setChestRewards: (rewards) => set({ chestRewards: rewards }),
  handleCloseChest: () => {
    const state = get();
    const newInventory = { ...state.inventory };
    let newCoins = state.mineCoins;
    const newAccessories = { ...state.ownedAccessories };

    for (const reward of state.chestRewards) {
      if (reward.type === 'resource' && reward.itemId) {
        newInventory[reward.itemId] = (newInventory[reward.itemId] || 0) + reward.amount;
      } else if (reward.type === 'minecoins') {
        newCoins += reward.amount;
      } else if (reward.type === 'accessory' && reward.itemId) {
        newAccessories[reward.itemId] = true;
      }
    }

    localStorage.setItem('ownedAccessories', JSON.stringify(newAccessories));
    set({
      inventory: newInventory,
      mineCoins: newCoins,
      ownedAccessories: newAccessories,
      pendingChest: null,
      chestRewards: [],
    });
  },

  // ═══ COMPUTED GETTERS ═══

  getCurrentCapacity: () => {
    const state = get();
    return Object.values(state.inventory).reduce((acc, val) => acc + val, 0);
  },

  getMaxCapacity: () => {
    const state = get();
    const currentStorageTier = state.toolsLevel.storage || 0;
    const storageCapacityBonus = currentStorageTier > 0
      ? toolChains.storage[currentStorageTier - 1].capacityBonus
      : 0;
    const upgradeCapacityBonus = state.activeUpgrades.includes('upg_storage_1')
      ? UPGRADE_STORAGE_BONUS
      : 0;
    const shulkerAmulet = get().getEquippedEffect('double_capacity');
    const accessoryCapacityMult = shulkerAmulet
      ? (shulkerAmulet.effectParams.multiplier || 2)
      : 1;
    return Math.floor(
      (BASE_INVENTORY_CAPACITY + storageCapacityBonus + upgradeCapacityBonus) * accessoryCapacityMult,
    );
  },

  getRebirthModifiers: () => {
    const state = get();
    return {
      coinMult: 1 + (state.rebirthUpgradesLevels['reb_coin_mult'] || 0) * 1.5,
      speedMult: 1 + (state.rebirthUpgradesLevels['reb_efficiency'] || 0) * 0.1,
      dropBonus: (state.rebirthUpgradesLevels['reb_drop_chance'] || 0) * 0.05,
    };
  },

  getEventModifiers: () => {
    const state = get();
    const isActive = state.activeEvent && Date.now() < state.eventEndTime;
    return {
      miningSpeedMult: (isActive && state.activeEvent?.modifier === 'mining_speed')
        ? state.activeEvent.modifierValue : 1,
      dropMult: (isActive && state.activeEvent?.modifier === 'drop_amount')
        ? state.activeEvent.modifierValue : 1,
      petChanceMult: (isActive && state.activeEvent?.modifier === 'pet_drop_chance')
        ? state.activeEvent.modifierValue : 1,
    };
  },
}));