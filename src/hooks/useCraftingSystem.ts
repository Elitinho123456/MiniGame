import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { eventBus } from '../events';
import { toolChains } from '../assets/consts';

// ═══════════════════════════════════════════════════════════
// useCraftingSystem — Lógica de progresso de crafting/furnace
// ═══════════════════════════════════════════════════════════

export function useCraftingSystem() {
  const activeCraft = useGameStore((s) => s.activeCraft);
  const furnaceState = useGameStore((s) => s.furnaceState);

  // Crafting progress timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeCraft) {
      interval = setInterval(() => {
        useGameStore.getState().setActiveCraft((prev) => {
          if (!prev) return null;
          return { ...prev, progress: prev.progress + 0.1 };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeCraft?.toolCategory, activeCraft?.tier, activeCraft?.totalTime, activeCraft?.customRecipe]);

  // Crafting completion
  useEffect(() => {
    if (activeCraft && activeCraft.progress >= activeCraft.totalTime) {
      const state = useGameStore.getState();

      if (activeCraft.customRecipe) {
        const recipe = activeCraft.customRecipe;
        if (
          recipe.creates === 'Crafting Table' ||
          recipe.creates === 'Furnace' ||
          recipe.creates === 'Blast Furnace'
        ) {
          state.setOwnedStations((prev) => ({ ...prev, [recipe.creates]: true }));
        } else {
          state.setInventory((prev) => ({
            ...prev,
            [recipe.creates]: (prev[recipe.creates] || 0) + recipe.amount,
          }));
        }

        // 🎮 Emit onCraftCompleted
        eventBus.emit('onCraftCompleted', {
          itemName: recipe.creates,
          amount: recipe.amount,
          isToolUpgrade: false,
        });
      } else if (activeCraft.toolCategory && activeCraft.tier !== undefined) {
        const category = activeCraft.toolCategory;
        const nextToolIndex = activeCraft.tier;
        const nextTool = toolChains[category][nextToolIndex];

        state.setToolsLevel((prev) => {
          const currentTier = prev[category] || 0;
          if (currentTier <= nextToolIndex) {
            state.setToolDurabilities((dPrev) => ({
              ...dPrev,
              [category]: nextTool.maxDurability,
            }));
          }
          return {
            ...prev,
            [category]: Math.max(currentTier, nextToolIndex + 1),
          };
        });

        // 🎮 Emit onCraftCompleted
        eventBus.emit('onCraftCompleted', {
          itemName: nextTool.name,
          amount: 1,
          isToolUpgrade: true,
          toolCategory: category,
          toolTier: nextToolIndex + 1,
        });
      }

      state.setActiveCraft(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCraft?.progress]);

  // Furnace progress timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (furnaceState && furnaceState.progress < furnaceState.totalTime) {
      interval = setInterval(() => {
        useGameStore.getState().setFurnaceState((prev) => {
          if (!prev) return null;
          const newProgress = prev.progress + 0.1;
          if (newProgress >= prev.totalTime) {
            const state = useGameStore.getState();
            const inv = state.inventory;
            
            // Se ainda tem minério e combustível no inventário, consome mais 1 de cada e continua contínuo
            if ((inv[prev.input] || 0) >= 1 && (inv[prev.fuel] || 0) >= 1) {
              state.setInventory(iPrev => ({
                ...iPrev,
                [prev.input]: iPrev[prev.input] - 1,
                [prev.fuel]: iPrev[prev.fuel] - 1
              }));
              return {
                ...prev,
                progress: 0,
                readyCount: prev.readyCount + 1,
              };
            }

            // Senão, para no final
            return {
              ...prev,
              progress: prev.totalTime,
              readyCount: prev.readyCount + 1,
            };
          }
          return { ...prev, progress: newProgress };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [furnaceState?.progress, furnaceState?.totalTime]);
}
