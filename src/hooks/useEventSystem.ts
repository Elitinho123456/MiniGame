import { useState, useEffect } from 'react';
import { randomEvents, type RandomEvent } from '../assets/events';

export function useEventSystem(setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>) {
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [eventEndTime, setEventEndTime] = useState<number>(0);

  // ═══ EVENTO ALEATÓRIO TIMER ═══
  useEffect(() => {
    const eventInterval = setInterval(() => {
      // Don't start new event if one is active
      if (activeEvent && Date.now() < eventEndTime) return;
      if (activeEvent && Date.now() >= eventEndTime) {
        setActiveEvent(null);
        setEventEndTime(0);
        return;
      }
      // 20% chance every 2 minutes
      if (Math.random() < 0.20) {
        const evt = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        setActiveEvent(evt);
        setEventEndTime(Date.now() + evt.durationMs);
      }
    }, 120_000); // Check every 2 minutes
    return () => clearInterval(eventInterval);
  }, [activeEvent, eventEndTime]);

  // Item rain event effect
  useEffect(() => {
    if (!activeEvent || activeEvent.modifier !== 'item_rain') return;
    if (Date.now() >= eventEndTime) return;
    const rainInterval = setInterval(() => {
      if (Date.now() >= eventEndTime) {
        clearInterval(rainInterval);
        return;
      }
      setInventory((prev) => {
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
  }, [activeEvent, eventEndTime, setInventory]);

  return {
    activeEvent,
    setActiveEvent,
    eventEndTime,
    setEventEndTime,
  };
}
