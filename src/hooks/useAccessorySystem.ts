import { useState } from 'react';
import { type AccessorySlot, getAccessoryById } from '../assets/accessories';

export function useAccessorySystem() {
  const [ownedAccessories, setOwnedAccessories] = useState<Record<string, boolean>>({});
  const [equippedAccessories, setEquippedAccessories] = useState<Record<AccessorySlot, string | null>>({
    ring: null,
    amulet: null,
    belt: null,
    glove: null,
  });

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
