import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { randomEvents } from '../assets/events';

// ═══════════════════════════════════════════════════════════
// useEventSystem — Sistema de eventos aleatórios do jogo
// Agora lê e escreve no zustand store diretamente.
// ═══════════════════════════════════════════════════════════

export function useEventSystem() {
  const activeEvent = useGameStore((s) => s.activeEvent);
  const eventEndTime = useGameStore((s) => s.eventEndTime);

  // ═══ EVENTO ALEATÓRIO TIMER ═══
  useEffect(() => {
    const eventInterval = setInterval(() => {
      const state = useGameStore.getState();
      const { activeEvent: evt, eventEndTime: endTime } = state;

      if (evt && Date.now() < endTime) return;
      if (evt && Date.now() >= endTime) {
        state.setActiveEvent(null);
        state.setEventEndTime(0);
        return;
      }
      // 20% chance every 2 minutes
      if (Math.random() < 0.20) {
        const newEvt = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        state.setActiveEvent(newEvt);
        state.setEventEndTime(Date.now() + newEvt.durationMs);
      }
    }, 120_000);
    return () => clearInterval(eventInterval);
  }, [activeEvent, eventEndTime]);

  // Item rain event effect
  useEffect(() => {
    if (!activeEvent || activeEvent.modifier !== 'item_rain') return;
    if (Date.now() >= eventEndTime) return;
    const rainInterval = setInterval(() => {
      const state = useGameStore.getState();
      if (Date.now() >= state.eventEndTime) {
        clearInterval(rainInterval);
        return;
      }
      state.setInventory((prev) => {
        const newInv = { ...prev };
        const items = ['Dirt', 'Sand', 'Cobblestone', 'Oak Log', 'Coal', 'Raw Copper', 'Raw Iron'];
        for (let i = 0; i < activeEvent.modifierValue; i++) {
          const item = items[Math.floor(Math.random() * items.length)];
          newInv[item] = (newInv[item] || 0) + 1;
        }
        return newInv;
      });
    }, 3000);
    return () => clearInterval(rainInterval);
  }, [activeEvent, eventEndTime]);
}
