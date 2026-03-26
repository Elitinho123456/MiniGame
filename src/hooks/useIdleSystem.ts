import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import {
  dimensions,
  dropMap,
  toolChains,
  BASE_INVENTORY_CAPACITY,
  UPGRADE_STORAGE_BONUS,
  itemPrices,
} from '../assets/consts';

// ═══════════════════════════════════════════════════════════
// useIdleSystem — Lógica de geração passiva de recursos
// ═══════════════════════════════════════════════════════════

export function useIdleSystem() {
  const activeUpgrades = useGameStore((s) => s.activeUpgrades);
  const storageLevel = useGameStore((s) => s.toolsLevel.storage);
  const equippedPet = useGameStore((s) => s.equippedPet);
  const ownedPets = useGameStore((s) => s.ownedPets);
  const ownedVillagers = useGameStore((s) => s.ownedVillagers);
  const isDebugMode = useGameStore((s) => s.isDebugMode);

  useEffect(() => {
    const idleInterval = setInterval(() => {
      const state = useGameStore.getState();
      const {
        inventory,
        activeUpgrades: upgrades,
        toolsLevel,
        equippedPet: pet,
        ownedPets: pets,
        ownedVillagers: villagers,
      } = state;

      const { coinMult } = state.getRebirthModifiers();

      const newInv = { ...inventory };
      let updated = false;

      const maxCap =
        BASE_INVENTORY_CAPACITY +
        (toolsLevel.storage > 0
          ? toolChains.storage[toolsLevel.storage - 1].capacityBonus
          : 0) +
        (upgrades.includes('upg_storage_1') ? UPGRADE_STORAGE_BONUS : 0);

      // upg_idle_1
      if (upgrades.includes('upg_idle_1')) {
        const currentCap = Object.values(newInv).reduce((acc, val) => acc + val, 0);
        if (currentCap < maxCap) {
          const drops = ['Dirt', 'Sand', 'Oak Log'];
          const drop = drops[Math.floor(Math.random() * drops.length)];
          newInv[drop] = (newInv[drop] || 0) + 1;
          updated = true;
        }
      }

      // upg_idle_2
      if (upgrades.includes('upg_idle_2')) {
        const currentCap = Object.values(newInv).reduce((acc, val) => acc + val, 0);
        if (currentCap < maxCap) {
          const drops = ['Cobblestone', 'Raw Copper', 'Coal'];
          const drop = drops[Math.floor(Math.random() * drops.length)];
          newInv[drop] = (newInv[drop] || 0) + 1;
          updated = true;
        }
      }

      // Pet Gato
      if (pet === 'pet_cat') {
        const petData = pets['pet_cat'];
        const petLevel = petData ? petData.level : 1;
        const currentCap = Object.values(newInv).reduce((acc, val) => acc + val, 0);
        if (currentCap < maxCap) {
          if (Math.random() * 100 < 5 * petLevel) {
            const drop = 'Dirt';
            newInv[drop] = (newInv[drop] || 0) + 1;
            updated = true;
          }
        }
      }

      // upg_autosell
      if (upgrades.includes('upg_autosell')) {
        const sellable = ['Dirt', 'Sand', 'Gravel', 'Cobblestone'];
        for (const item of sellable) {
          if (newInv[item] && newInv[item] > 0) {
            const sellAmt = Math.min(newInv[item], 10);
            newInv[item] -= sellAmt;
            state.setMineCoins(prev => prev + (sellAmt * (itemPrices[item] || 1)) * coinMult);
            updated = true;
          }
        }
      }

      // Villagers
      if (upgrades.includes('upg_villagers_unlock')) {
        const currentCap = Object.values(newInv).reduce((acc, val) => acc + val, 0);
        if (currentCap < maxCap) {
          Object.entries(villagers).forEach(([dimId, count]) => {
            if (count > 0) {
              const dim = dimensions[dimId];
              if (dim && dim.blocks.length > 0) {
                const blockToFarm = dim.blocks[0];
                const dropName = dropMap[blockToFarm.name];
                if (dropName) {
                  newInv[dropName] = (newInv[dropName] || 0) + count;
                  updated = true;
                }
              }
            }
          });
        }
      }

      if (updated) {
        state.setInventory(newInv);
      }
    }, 2000);

    return () => clearInterval(idleInterval);
  }, [activeUpgrades, storageLevel, equippedPet, ownedPets, ownedVillagers, isDebugMode]);
}
