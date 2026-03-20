import { useState } from 'react';
import { type ChestTier } from '../assets/events';

export function useChestSystem(
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  setMineCoins: React.Dispatch<React.SetStateAction<number>>,
  setOwnedAccessories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) {
  const [pendingChest, setPendingChest] = useState<ChestTier | null>(null);
  const [chestRewards, setChestRewards] = useState<{ type: string; itemId?: string; amount: number }[]>([]);

  function handleCloseChest() {
    // Apply rewards
    for (const reward of chestRewards) {
      if (reward.type === 'resource' && reward.itemId) {
        setInventory((prev) => ({ ...prev, [reward.itemId!]: (prev[reward.itemId!] || 0) + reward.amount }));
      } else if (reward.type === 'minecoins') {
        setMineCoins((prev) => prev + reward.amount);
      } else if (reward.type === 'accessory' && reward.itemId) {
        setOwnedAccessories((prev) => ({ ...prev, [reward.itemId!]: true }));
      }
    }
    setPendingChest(null);
    setChestRewards([]);
  }

  return {
    pendingChest,
    setPendingChest,
    chestRewards,
    setChestRewards,
    handleCloseChest,
  };
}
