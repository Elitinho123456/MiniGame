import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { eventBus } from '../events';
import {
  dimensions,
  dropMap,
  blockProperties,
  availablePets,
  toolChains,
} from '../assets/consts';
import { rollChestDrop, rollChestRewards } from '../assets/events';

// ═══════════════════════════════════════════════════════════
// useMiningSystem — Lógica de mineração extraída do Game.tsx
// ═══════════════════════════════════════════════════════════

export function useMiningSystem() {
  const store = useGameStore;

  const handleMineBlock = useCallback(() => {
    const state = store.getState();
    const {
      currentBlock,
      currentDim,
      miningProgress,
      activePotions,
      toolsLevel,
      toolDurabilities,
      equippedPet,
      ownedPets,
      activeUpgrades,
      toolEnchantments,
    } = state;

    const currentCapacity = state.getCurrentCapacity();
    const maxCapacity = state.getMaxCapacity();

    if (currentCapacity >= maxCapacity) {
      state.setWarningMessage('Inventário Cheio!');
      setTimeout(() => state.setWarningMessage(''), 2000);
      return;
    }

    const now = Date.now();
    const hasSpeedPotion = activePotions['pot_speed'] && activePotions['pot_speed'] > now;
    const hasLootPotion = activePotions['pot_loot'] && activePotions['pot_loot'] > now;
    const hasDurabilityPotion = activePotions['pot_durability'] && activePotions['pot_durability'] > now;
    const hasXpPotion = activePotions['pot_xp'] && activePotions['pot_xp'] > now;
    const hasMagnetPotion = activePotions['pot_magnet'] && activePotions['pot_magnet'] > now;

    const blockProps = blockProperties[currentBlock];
    const hardness = blockProps ? blockProps.hardness : 10;
    const reqTool = blockProps ? blockProps.reqTool : 'none';
    const reqLevel = blockProps ? blockProps.reqLevel : 0;

    let toolSpeed = 1;
    let petSpeedBonus = 0;
    let petDropBonus = 0;

    if (equippedPet) {
      const activePetInfo = availablePets.find((p) => p.id === equippedPet);
      const petData = ownedPets[equippedPet];
      const petLevel = petData ? petData.level : 1;

      if (activePetInfo) {
        if (activePetInfo.effect.type === 'speed') {
          petSpeedBonus =
            activePetInfo.effect.baseValue +
            activePetInfo.effect.valuePerLevel * (petLevel - 1);
        }
        if (activePetInfo.effect.type === 'drop') {
          petDropBonus =
            activePetInfo.effect.baseValue +
            activePetInfo.effect.valuePerLevel * (petLevel - 1);
        }
        if (activePetInfo.id === 'pet_dragon') {
          petDropBonus += 0.5 * petLevel;
        }
        if (activePetInfo.id === 'pet_unicorn') {
          petSpeedBonus += 5 * petLevel;
        }
      }
    }

    if (reqTool !== 'none') {
      const currentTier = toolsLevel[reqTool] || 0;

      if (currentTier < reqLevel) {
        state.setWarningMessage('Ferramenta insuficiente para minerar este bloco!');
        setTimeout(() => state.setWarningMessage(''), 2000);
        return;
      }

      if (currentTier > 0) {
        const activeTool = toolChains[reqTool][currentTier - 1];
        toolSpeed = activeTool.speed;
        if (hasSpeedPotion) {
          toolSpeed *= 1.5;
        }

        if (toolDurabilities[reqTool] <= 0) {
          state.setWarningMessage('Sua ferramenta quebrou!');
          setTimeout(() => state.setWarningMessage(''), 2000);
          state.setToolsLevel((prev) => ({ ...prev, [reqTool]: 0 }));

          // Emit tool broken event
          eventBus.emit('onToolBroken', {
            toolType: reqTool,
            toolTier: currentTier,
            toolName: activeTool.name,
          });
          return;
        }
      }
    }

    const { speedMult: rebirthSpeedMult, dropBonus: rebirthDropBonus } = state.getRebirthModifiers();
    const { miningSpeedMult: eventMiningSpeedMult, dropMult: eventDropMult, petChanceMult: eventPetChanceMult } = state.getEventModifiers();

    const fortuneGlove = state.getEquippedEffect('fortune_roll');
    const luckAcc = state.getEquippedEffect('luck_boost');
    const luckBonus = luckAcc ? (luckAcc.effectParams.bonus || 0) : 0;

    const baseMiningSpeed = (toolSpeed + petSpeedBonus) * eventMiningSpeedMult * rebirthSpeedMult;
    let finalMiningSpeed = (toolsLevel.pickaxe === 0 && reqTool === 'none')
      ? baseMiningSpeed * 0.5
      : baseMiningSpeed;

    // Accessory Effects
    const bouncyRing = state.getEquippedEffect('bouncy_click');
    if (bouncyRing && Math.random() < (bouncyRing.effectParams.chance || 0.15)) {
      const minEx = bouncyRing.effectParams.minExtra || 1;
      const maxEx = bouncyRing.effectParams.maxExtra || 4;
      const extraClicks = Math.floor(Math.random() * (maxEx - minEx + 1)) + minEx;
      finalMiningSpeed *= (1 + extraClicks);
    }

    const creeperRing = state.getEquippedEffect('resource_explosion');
    if (creeperRing && Math.random() < (creeperRing.effectParams.chance || 0.01)) {
      finalMiningSpeed *= (creeperRing.effectParams.clicks || 100);
    }

    // ─── Enchantment: Efficiency ───
    const currentToolEnchants = toolEnchantments[reqTool] || {};
    if (currentToolEnchants['efficiency']) {
      finalMiningSpeed *= (1 + (currentToolEnchants['efficiency'] * 0.25));
    }

    const newProgress = miningProgress + finalMiningSpeed;

    if (newProgress >= hardness) {
      // Bloco quebrado — dano na ferramenta
      if (reqTool !== 'none' && toolsLevel[reqTool] > 0 && !hasDurabilityPotion) {
        let takesDamage = true;
        // ─── Enchantment: Unbreaking ───
        if (currentToolEnchants['unbreaking']) {
          const unbreakingLvl = currentToolEnchants['unbreaking'];
          // Chance de ignorar dano = unbreakingLvl / (unbreakingLvl + 1) -> Nv 3 = 75%
          if (Math.random() < (unbreakingLvl / (unbreakingLvl + 1))) {
            takesDamage = false;
          }
        }

        if (takesDamage) {
          const newDurability = toolDurabilities[reqTool] - 1;
          state.setToolDurabilities((prev) => ({ ...prev, [reqTool]: newDurability }));

          if (newDurability <= 0) {
          state.setWarningMessage('Sua ferramenta quebrou!');
          setTimeout(() => state.setWarningMessage(''), 2000);
          state.setToolsLevel((prev) => ({ ...prev, [reqTool]: 0 }));

          eventBus.emit('onToolBroken', {
            toolType: reqTool,
            toolTier: toolsLevel[reqTool],
            toolName: toolChains[reqTool][toolsLevel[reqTool] - 1]?.name || reqTool,
          });
        }
        }
      }

      // ─── Enchantment: Silk Touch ───
      let drop = dropMap[currentBlock];
      if (currentToolEnchants['silk_touch']) {
        drop = currentBlock; // Coleta o bloco em si
      }

      // ─── Cálculo de drops ───
      let dropAmount = 1;
      let upgradeBonus = 0;
      if (activeUpgrades.includes('upg_mining_1')) {
        dropAmount += 1;
        upgradeBonus = 1;
      }

      let rebirthBonusApplied = 0;
      if (Math.random() < rebirthDropBonus) {
        dropAmount += 1;
        rebirthBonusApplied += 1;
      }
      if (rebirthDropBonus > 1) {
        dropAmount += Math.floor(rebirthDropBonus);
        rebirthBonusApplied += Math.floor(rebirthDropBonus);
      }

      let petBonusApplied = 0;
      if (petDropBonus > 0) {
        const bonus = Math.floor(petDropBonus);
        dropAmount += bonus;
        petBonusApplied += bonus;
        if (Math.random() < petDropBonus % 1) {
          dropAmount += 1;
          petBonusApplied += 1;
        }
      }

      const potionMult = hasLootPotion ? 2 : 1;
      if (hasLootPotion) dropAmount *= 2;
      if (hasMagnetPotion) dropAmount += 1;

      dropAmount = Math.floor(dropAmount * eventDropMult);

      let fortuneMult = 1;
      if (fortuneGlove) {
        const roll = Math.random();
        if (roll < (fortuneGlove.effectParams.quad || 0.01)) {
          dropAmount *= 4;
          fortuneMult = 4;
        } else if (roll < (fortuneGlove.effectParams.triple || 0.05)) {
          dropAmount *= 3;
          fortuneMult = 3;
        } else if (roll < (fortuneGlove.effectParams.double || 0.20)) {
          dropAmount *= 2;
          fortuneMult = 2;
        }
      }

      // ─── Enchantment: Fortune ───
      if (currentToolEnchants['fortune'] && !currentToolEnchants['silk_touch']) {
        const roll = Math.random();
        const fortuneLevel = currentToolEnchants['fortune'];
        // Fórmula simpes: (Level) chance de ter drop extra
        if (roll < (fortuneLevel * 0.25)) {
          const extra = Math.floor(Math.random() * fortuneLevel) + 1;
          dropAmount += extra;
        }
      }

      // 🎮 Emit onDropCalculated — middleware pode modificar
      const dropEvent = eventBus.emit('onDropCalculated', {
        blockName: currentBlock,
        baseDrop: drop,
        baseAmount: 1,
        finalAmount: dropAmount,
        modifiers: {
          upgradeBonus,
          potionMultiplier: potionMult,
          petBonus: petBonusApplied,
          rebirthBonus: rebirthBonusApplied,
          eventMultiplier: eventDropMult,
          fortuneMultiplier: fortuneMult,
          accessoryMultiplier: 1,
        },
      });

      // Se o middleware modificou o finalAmount, usar o valor modificado
      if (dropEvent) {
        dropAmount = dropEvent.finalAmount;
      }

      if (drop) {
        state.setInventory((prev) => ({
          ...prev,
          [drop]: (prev[drop] || 0) + dropAmount,
        }));
      }

      // Drops extras
      if (currentBlock === 'Oak_Leaves') {
        const leafDrops: Record<string, number> = {};
        if (Math.random() < 0.20) leafDrops['Stick'] = dropAmount;
        if (Math.random() < 0.05) leafDrops['Apple'] = dropAmount;

        if (Object.keys(leafDrops).length > 0) {
          state.setInventory((prev) => {
            const newInv = { ...prev };
            for (const [key, val] of Object.entries(leafDrops)) {
              newInv[key] = (newInv[key] || 0) + val;
            }
            return newInv;
          });
        }
      } else if (currentBlock === 'Gravel') {
        if (Math.random() < 0.10) {
          state.setInventory((prev) => ({
            ...prev,
            'Flint': (prev['Flint'] || 0) + dropAmount,
          }));
        }
      }

      // Ganho de XP Direto (Mineração)
      const xpOrbs: Record<string, number> = {
        'Coal_Ore': 1,
        'Lapis_Lazuli_Ore': 3,
        'Redstone_Ore': 3,
        'Diamond_Ore': 5,
        'Emerald_Ore': 5,
        'Nether_Quartz_Ore': 3,
      };
      if (xpOrbs[currentBlock]) {
        const xpAmount = xpOrbs[currentBlock];
        
        // ─── Enchantment: Mending ───
        if (currentToolEnchants['mending'] && reqTool !== 'none' && toolsLevel[reqTool] > 0) {
            const currentDurability = toolDurabilities[reqTool] || 0;
            const maxDurability = toolChains[reqTool][toolsLevel[reqTool] - 1]?.maxDurability || 0;
            if (currentDurability < maxDurability) {
                // Restaura durabilidade (2 de dura por 1 XP)
                const restored = Math.min(xpAmount * 2, maxDurability - currentDurability);
                state.setToolDurabilities(prev => ({ ...prev, [reqTool]: currentDurability + restored }));
                // Não adiciona XP pro player se curou a ferramenta
            } else {
                state.addPlayerXp(xpAmount);
            }
        } else {
            state.addPlayerXp(xpAmount);
        }
      }

      // 🎮 Emit onBlockMined
      eventBus.emit('onBlockMined', {
        blockName: currentBlock,
        dimension: currentDim,
        dropName: drop,
        dropAmount,
        toolUsed: reqTool,
        toolTier: toolsLevel[reqTool] || 0,
        timestamp: Date.now(),
      });

      // Check for Pet Drops
      const petRoll = Math.random() * 100;
      for (const pet of availablePets) {
        const adjustedChance = pet.dropChance * eventPetChanceMult * (1 + luckBonus);
        if (petRoll < adjustedChance) {
          alert(`CARAMBA! VOCÊ ACHOU UM PET: ${pet.name} (${pet.category})!`);

          // 🎮 Emit onEntitySpawn (pet)
          eventBus.emit('onEntitySpawn', {
            entityType: 'pet',
            entityId: pet.id,
            entityName: pet.name,
            rarity: pet.category,
            context: { dropChance: adjustedChance, roll: petRoll },
          });

          state.setOwnedPets((prev) => {
            const current = prev[pet.id];
            if (current) {
              return { ...prev, [pet.id]: { ...current, xp: current.xp + 50 } };
            } else {
              return { ...prev, [pet.id]: { level: 1, xp: 0 } };
            }
          });
          break;
        }
      }

      // Check for Chest Drops
      const chestDrop = rollChestDrop(toolsLevel.pickaxe || 0);
      if (chestDrop) {
        const rewards = rollChestRewards(chestDrop);
        state.setPendingChest(chestDrop);
        state.setChestRewards(rewards);

        // 🎮 Emit onEntitySpawn (chest)
        eventBus.emit('onEntitySpawn', {
          entityType: 'chest',
          entityId: chestDrop.id,
          entityName: chestDrop.name,
          rarity: chestDrop.id,
          context: { rewards, pickaxeLevel: toolsLevel.pickaxe || 0 },
        });
      }

      // XP passivo pro pet equipado
      if (equippedPet) {
        const xpGain = hasXpPotion ? 3 : 1;
        state.setOwnedPets((prev) => {
          const current = prev[equippedPet];
          if (!current) return prev;
          const petDef = availablePets.find(p => p.id === equippedPet);
          if (petDef && current.level < petDef.maxLevel) {
            return { ...prev, [equippedPet]: { ...current, xp: current.xp + xpGain } };
          }
          return prev;
        });
      }

      // Selecionar próximo bloco
      const currentDimData = dimensions[currentDim];
      const blocksInDim = currentDimData.blocks;

      const availableBlocks = blocksInDim.filter(b => {
        const props = blockProperties[b.name];
        if (!props) return true;
        if (props.reqTool !== 'none' && props.reqLevel > 0) {
          const playerTier = toolsLevel[props.reqTool] || 0;
          if (playerTier < props.reqLevel) return false;
        }
        return true;
      });

      const blocksToRoll = availableBlocks.length > 0 ? availableBlocks : [blocksInDim[0]];

      const pickaxeLevel = toolsLevel.pickaxe || 0;
      let totalWeight = 0;
      const weightedBlocks = blocksToRoll.map((b) => {
        let w = b.weight;
        if (w < 10 && pickaxeLevel > 0) {
          w *= 1 + pickaxeLevel * 0.2;
        }
        totalWeight += w;
        return { ...b, weight: w };
      });

      let rand = Math.random() * totalWeight;
      let selectedBlock = weightedBlocks[0].name;
      for (const b of weightedBlocks) {
        if (rand < b.weight) {
          selectedBlock = b.name;
          break;
        }
        rand -= b.weight;
      }

      const previousBlock = currentBlock;
      state.setCurrentBlock(selectedBlock);
      state.setMiningProgress(0);
      state.setWarningMessage('');

      // 🎮 Emit onPlayerMove (block changed)
      if (selectedBlock !== previousBlock) {
        eventBus.emit('onPlayerMove', {
          from: { dimension: currentDim, block: previousBlock },
          to: { dimension: currentDim, block: selectedBlock },
        });
      }
    } else {
      state.setMiningProgress(newProgress);
    }
  }, []);

  const handleDimensionChange = useCallback((newDim: string) => {
    const state = store.getState();
    const previousDim = state.currentDim;
    const previousBlock = state.currentBlock;
    const newBlock = dimensions[newDim].blocks[0].name;

    state.setCurrentDim(newDim);
    state.setCurrentBlock(newBlock);
    state.setMiningProgress(0);
    state.setWarningMessage('');

    // 🎮 Emit onPlayerMove (dimension change)
    eventBus.emit('onPlayerMove', {
      from: { dimension: previousDim, block: previousBlock },
      to: { dimension: newDim, block: newBlock },
    });
  }, []);

  return { handleMineBlock, handleDimensionChange };
}
