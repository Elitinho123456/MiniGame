import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { randomEvents } from '../assets/events';
import { availablePets } from '../assets/consts';
import { allAccessories } from '../assets/accessories';

// ═══════════════════════════════════════════════════════════
// useSettingsSystem — Lógica de settings, áudio e debug cheats
// ═══════════════════════════════════════════════════════════

export function useSettingsSystem() {
  const audioVolume = useGameStore((s) => s.audioVolume);
  const isMuted = useGameStore((s) => s.isMuted);

  // Sync audio element with state
  useEffect(() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement | null;
    if (audio) {
      audio.volume = audioVolume;
      audio.muted = isMuted;
    }
  }, [audioVolume, isMuted]);
}

/**
 * Funções de cheat para debug — chamadas do SettingsPanel
 */
export function useDebugCheats() {
  const store = useGameStore;

  return {
    onCheatAddCoins: (amount: number) => {
      store.getState().setMineCoins((prev) => prev + amount);
    },

    onCheatAddResources: () => {
      store.getState().setInventory((prev) => {
        const newInv = { ...prev };
        const allResources = [
          'Dirt', 'Wood', 'Cobblestone', 'Iron Ingot', 'Gold Ingot',
          'Diamond', 'Netherite Ingot', 'Oak Log', 'Sand', 'Gravel',
          'Raw Iron', 'Raw Gold', 'Ancient Debris', 'Stick', 'Oak Planks',
          'Flint', 'Apple', 'Netherite Scrap', 'Coal', 'Raw Copper',
        ];
        allResources.forEach((res) => {
          newInv[res] = (newInv[res] || 0) + 1000;
        });
        return newInv;
      });
    },

    onCheatUnlockPets: () => {
      store.getState().setOwnedPets((prev) => {
        const newPets = { ...prev };
        availablePets.forEach((pet) => {
          if (!newPets[pet.id]) newPets[pet.id] = { level: 1, xp: 0 };
        });
        return newPets;
      });
      alert('Todos os pets desbloqueados!');
    },

    onCheatTriggerEvent: () => {
      const evt = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      const state = store.getState();
      state.setActiveEvent(evt);
      state.setEventEndTime(Date.now() + evt.durationMs);
    },

    onCheatUnlockAccessories: () => {
      store.getState().setOwnedAccessories((prev) => {
        const newAcc = { ...prev };
        allAccessories.forEach((acc) => {
          newAcc[acc.id] = true;
        });
        return newAcc;
      });
      alert('Todos os acessórios desbloqueados!');
    },
  };
}
