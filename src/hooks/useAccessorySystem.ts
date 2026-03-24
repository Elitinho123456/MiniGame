import { useState, useEffect } from 'react';
import { type AccessorySlot, getAccessoryById } from '../assets/accessories';

export function useAccessorySystem() {
  const [ownedAccessories, setOwnedAccessories] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('ownedAccessories') || '{}');
    } catch { return {}; }
  });

  const [equippedAccessories, setEquippedAccessories] = useState<Record<AccessorySlot, string | null>>(() => {
    try {
      return JSON.parse(localStorage.getItem('equippedAccessories') || '{"ring":null,"amulet":null,"belt":null,"glove":null}');
    } catch {
      return { ring: null, amulet: null, belt: null, glove: null };
    }
  });

  useEffect(() => {
    localStorage.setItem('ownedAccessories', JSON.stringify(ownedAccessories));
    localStorage.setItem('equippedAccessories', JSON.stringify(equippedAccessories));
  }, [ownedAccessories, equippedAccessories]);

  function equipAccessory(accessoryId: string) {
    const acc = getAccessoryById(accessoryId);
    if (!acc || !ownedAccessories[accessoryId]) return;
    setEquippedAccessories((prev) => ({ ...prev, [acc.slot]: accessoryId }));
  }

  function unequipAccessory(slot: AccessorySlot) {
    setEquippedAccessories((prev) => ({ ...prev, [slot]: null }));
  }

  function getEquippedEffect(effectType: string) {
    for (const slotId of Object.values(equippedAccessories)) {
      if (!slotId) continue;
      const acc = getAccessoryById(slotId);
      if (acc && acc.effectType === effectType) return acc;
    }
    return null;
  }

  return {
    ownedAccessories,
    setOwnedAccessories,
    equippedAccessories,
    setEquippedAccessories,
    equipAccessory,
    unequipAccessory,
    getEquippedEffect,
  };
}
