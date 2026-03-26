import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { availablePets, availableUpgrades } from '../assets/consts';

// ═══════════════════════════════════════════════════════════
// usePetSystem — Lógica de upgrade de pets e contratação de villagers
// ═══════════════════════════════════════════════════════════

export function usePetSystem() {
  const store = useGameStore;

  const upgradePet = useCallback((petId: string) => {
    const state = store.getState();
    const petData = state.ownedPets[petId];
    if (!petData) return;
    const petDef = availablePets.find((p) => p.id === petId);
    if (!petDef) return;
    if (petData.level >= petDef.maxLevel) return;

    const xpNeeded = petData.level * 100;
    if (petData.xp >= xpNeeded) {
      state.setOwnedPets((prev) => ({
        ...prev,
        [petId]: { level: petData.level + 1, xp: petData.xp - xpNeeded },
      }));
    } else {
      const xpMissing = xpNeeded - petData.xp;
      const costMC = xpMissing * 2;

      if (state.mineCoins >= costMC) {
        state.setMineCoins((prev) => prev - costMC);
        state.setOwnedPets((prev) => ({
          ...prev,
          [petId]: { level: petData.level + 1, xp: 0 },
        }));
      } else {
        alert(`Você não tem EXP nem MineCoins suficientes! Faltam ${costMC} MC.`);
      }
    }
  }, []);

  const hireVillager = useCallback((dimId: string) => {
    const state = store.getState();
    const count = state.ownedVillagers[dimId] || 0;
    const baseCost = 500;
    const cost = baseCost * Math.pow(1.5, count);

    if (state.mineCoins >= cost) {
      state.setMineCoins((prev) => prev - cost);
      state.setOwnedVillagers((prev) => ({
        ...prev,
        [dimId]: count + 1,
      }));
    } else {
      alert('Mine Coins insuficientes para contratar!');
    }
  }, []);

  const buyUpgrade = useCallback((upgradeId: string) => {
    const state = store.getState();
    if (state.activeUpgrades.includes(upgradeId)) return;
    const upg = availableUpgrades.find((u) => u.id === upgradeId);
    if (!upg) return;

    let canBuy = true;
    if (!state.isDebugMode) {
      for (const [res, amount] of Object.entries(upg.cost)) {
        if ((state.inventory[res] || 0) < (amount as number)) canBuy = false;
      }
      if (upg.mineCoinCost && state.mineCoins < upg.mineCoinCost) {
        canBuy = false;
      }
    }

    if (canBuy) {
      if (!state.isDebugMode) {
        state.setInventory((prev) => {
          const newInv = { ...prev };
          for (const [res, amount] of Object.entries(upg.cost)) {
            newInv[res] -= amount as number;
          }
          return newInv;
        });
        if (upg.mineCoinCost) {
          state.setMineCoins((prev) => prev - upg.mineCoinCost!);
        }
      }
      state.setActiveUpgrades((prev) => [...prev, upgradeId]);
    } else {
      alert('Recursos insuficientes para o upgrade!');
    }
  }, []);

  return { upgradePet, hireVillager, buyUpgrade };
}
