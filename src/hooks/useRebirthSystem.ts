import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { eventBus } from '../events';
import { itemPrices } from '../assets/consts';

// ═══════════════════════════════════════════════════════════
// useRebirthSystem — Lógica de Ascensão / Rebirth
// ═══════════════════════════════════════════════════════════

export function useRebirthSystem() {
  const store = useGameStore;

  const handleRebirth = useCallback(() => {
    const state = store.getState();
    const confirmRebirth = window.confirm(
      'Sua jornada atingiu o pico. Tem certeza que deseja Ascender? Você perderá todos seus itens, níveis de ferramentas, upgrades e moedas normais.',
    );
    if (!confirmRebirth) return;

    let shards = 10;
    if (state.toolsLevel.pickaxe >= 5) shards += 20;
    if (state.toolsLevel.pickaxe >= 6) shards += 50;
    shards += Math.floor(state.mineCoins / 50000);

    const invValue = Object.entries(state.inventory).reduce(
      (acc, [item, amt]) => acc + (itemPrices[item] || 0) * amt,
      0,
    );
    shards += Math.floor(invValue / 10000);

    const previousPickaxeLevel = state.toolsLevel.pickaxe;
    const previousCoins = state.mineCoins;

    state.setPrestigeCurrency((prev) => prev + shards);
    state.setRebirthCount((prev) => prev + 1);

    // Hard Reset
    state.setInventory({});
    state.setToolsLevel({ pickaxe: 0, shovel: 0, axe: 0, hoe: 0, storage: 0 });
    state.setToolDurabilities({ pickaxe: 0, shovel: 0, axe: 0, hoe: 0 });
    state.setMineCoins(0);
    state.setActiveUpgrades([]);
    state.setOwnedVillagers({});
    state.setCurrentDim('Overworld');
    state.setCurrentBlock('Grass_Block');
    state.setActiveTab('mining');

    // 🎮 Emit onRebirthPerformed
    eventBus.emit('onRebirthPerformed', {
      rebirthCount: state.rebirthCount + 1,
      shardsEarned: shards,
      previousPickaxeLevel,
      previousCoins,
    });
  }, []);

  const handleBuyRebirthUpgrade = useCallback((upgradeId: string, cost: number) => {
    const state = store.getState();
    if (state.prestigeCurrency >= cost) {
      state.setPrestigeCurrency((prev) => prev - cost);
      state.setRebirthUpgradesLevels((prev) => ({
        ...prev,
        [upgradeId]: (prev[upgradeId] || 0) + 1,
      }));
    }
  }, []);

  return { handleRebirth, handleBuyRebirthUpgrade };
}
