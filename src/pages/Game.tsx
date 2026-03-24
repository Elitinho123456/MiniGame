import { useState, useEffect } from 'react';
import {
  dimensions,
  dropMap,
  nameMap,
  availableUpgrades,
  toolChains,
  blockProperties,
  availablePets,
  BASE_INVENTORY_CAPACITY,
  UPGRADE_STORAGE_BONUS,
  itemPrices,
} from '../assets/consts';
import { randomEvents, rollChestDrop, rollChestRewards } from '../assets/events';
import { allAccessories } from '../assets/accessories';
import { useEventSystem } from '../hooks/useEventSystem';
import { useAccessorySystem } from '../hooks/useAccessorySystem';
import { useChestSystem } from '../hooks/useChestSystem';

import EquipmentHeader from '../components/ui/EquipmentHeader';
import InventoryPanel from '../components/InventoryPanel';
import UpgradesPanel from '../components/UpgradesPanel';
import CraftingPanel, { type CraftingTask } from '../components/CraftingPanel';
import FurnacePanel, { type SmeltingState } from '../components/FurnacePanel';
import PetsPanel from '../components/PetsPanel';
import ShopPanel from '../components/ShopPanel';
import Sidebar, { type ActiveTab } from '../components/ui/Sidebar';
import SettingsPanel from '../components/SettingsPanel';
import VillagersPanel from '../components/VillagersPanel';
import DimensionSelector from '../components/ui/DimensionSelector';
import EventBanner from '../components/ui/EventBanner';
import ChestModal from '../components/ChestModal';
import AccessoriesPanel from '../components/AccessoriesPanel';
import RebirthPanel from '../components/RebirthPanel';

export default function Game() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mining');

  // Tecla ESC para voltar a aba de mineração
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTab !== 'mining') {
        setActiveTab('mining');
      }
      switch (e.key) {

        case '1':
          setActiveTab('shop')
          break;

        case '2':
          setActiveTab('pets')
          break;

        case '3':
          setActiveTab('villagers')
          break;

        case '4':
          setActiveTab('accessories')
          break;

        case '5':
          setActiveTab('settings')
          break;

        default:
          break;

      }

    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const [videoQuality, setVideoQuality] = useState<'Baixa' | 'Média' | 'Alta'>('Alta');
  const [audioVolume, setAudioVolume] = useState<number>(() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement | null;
    return audio ? audio.volume : 0.5;
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement | null;
    return audio ? audio.muted : false;
  });

  useEffect(() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement | null;
    if (audio) {
      audio.volume = audioVolume;
      audio.muted = isMuted;
    }
  }, [audioVolume, isMuted]);

  // Rebirth State
  const [rebirthCount, setRebirthCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('rebirthCount') || '0');
  });
  const [prestigeCurrency, setPrestigeCurrency] = useState<number>(() => {
    return parseFloat(localStorage.getItem('prestigeCurrency') || '0');
  });
  const [rebirthUpgradesLevels, setRebirthUpgradesLevels] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('rebirthUpgradesLevels') || '{}');
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('rebirthCount', rebirthCount.toString());
    localStorage.setItem('prestigeCurrency', prestigeCurrency.toString());
    localStorage.setItem('rebirthUpgradesLevels', JSON.stringify(rebirthUpgradesLevels));
  }, [rebirthCount, prestigeCurrency, rebirthUpgradesLevels]);

  // Global Modifiers derived from Rebirth
  const coinMult = 1 + (rebirthUpgradesLevels['reb_coin_mult'] || 0) * 1.5;
  const rebirthSpeedMult = 1 + (rebirthUpgradesLevels['reb_efficiency'] || 0) * 0.1;
  const rebirthDropBonus = (rebirthUpgradesLevels['reb_drop_chance'] || 0) * 0.05;

  // Estado de Dimensões e Blocos
  const [currentDim, setCurrentDim] = useState<string>('Overworld');
  const [currentBlock, setCurrentBlock] = useState<string>('Grass_Block');

  // Inventário
  const [inventory, setInventory] = useState<Record<string, number>>({});

  // Estações
  const [ownedStations, setOwnedStations] = useState<Record<string, boolean>>({});

  // Equipamentos do Jogador (Controla em qual tier a ferramenta está: 0, 1, 2...)
  const [toolsLevel, setToolsLevel] = useState<Record<string, number>>({
    pickaxe: 0,
    shovel: 0,
    axe: 0,
    hoe: 0,
    storage: 0,
  });

  const [toolDurabilities, setToolDurabilities] = useState<
    Record<string, number>
  >({
    pickaxe: 0,
    shovel: 0,
    axe: 0,
    hoe: 0,
  });

  const [mineCoins, setMineCoins] = useState<number>(0);
  const [activePotions, setActivePotions] = useState<Record<string, number>>({});

  const [miningProgress, setMiningProgress] = useState<number>(0);
  const [warningMessage, setWarningMessage] = useState<string>('');

  const [activeCraft, setActiveCraft] = useState<CraftingTask | null>(null);
  const [activeUpgrades, setActiveUpgrades] = useState<string[]>([]);
  const [furnaceState, setFurnaceState] = useState<SmeltingState | null>(null);

  // Pets
  const [ownedPets, setOwnedPets] = useState<Record<string, { level: number; xp: number }>>({});
  const [equippedPet, setEquippedPet] = useState<string | null>(null);

  // Villagers
  const [ownedVillagers, setOwnedVillagers] = useState<Record<string, number>>({});

  // Debug
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false);

  // ═══ HOOKS DE SISTEMAS ═══
  const { activeEvent, setActiveEvent, eventEndTime, setEventEndTime } = useEventSystem(setInventory);

  const {
    ownedAccessories,
    setOwnedAccessories,
    equippedAccessories,
    equipAccessory,
    unequipAccessory,
    getEquippedEffect,
  } = useAccessorySystem();

  const {
    pendingChest,
    setPendingChest,
    chestRewards,
    setChestRewards,
    handleCloseChest,
  } = useChestSystem(setInventory, setMineCoins, setOwnedAccessories);

  useEffect(() => {
    const idleInterval = setInterval(() => {
      setInventory((prev) => {
        const newInv = { ...prev };
        let updated = false;

        const maxCap =
          BASE_INVENTORY_CAPACITY +
          (toolsLevel.storage > 0
            ? toolChains.storage[toolsLevel.storage - 1].capacityBonus
            : 0) +
          (activeUpgrades.includes('upg_storage_1') ? UPGRADE_STORAGE_BONUS : 0);

        // upg_idle_1 (2 secs)
        if (activeUpgrades.includes('upg_idle_1')) {
          const currentCap = Object.values(newInv).reduce(
            (acc, val) => acc + val,
            0
          );
          if (currentCap < maxCap) {
            const drops = ['Dirt', 'Sand', 'Oak Log'];
            const drop = drops[Math.floor(Math.random() * drops.length)];
            newInv[drop] = (newInv[drop] || 0) + 1;
            updated = true;
          }
        }

        // upg_idle_2 (2 secs)
        if (activeUpgrades.includes('upg_idle_2')) {
          const currentCap = Object.values(newInv).reduce(
            (acc, val) => acc + val,
            0
          );
          if (currentCap < maxCap) {
            const drops = ['Cobblestone', 'Raw Copper', 'Coal'];
            const drop = drops[Math.floor(Math.random() * drops.length)];
            newInv[drop] = (newInv[drop] || 0) + 1;
            updated = true;
          }
        }

        // Pet Gato (Idle Speed Bonus / Extra drops)
        if (equippedPet === 'pet_cat') {
          const petData = ownedPets['pet_cat'];
          const petLevel = petData ? petData.level : 1;
          const currentCap = Object.values(newInv).reduce(
            (acc, val) => acc + val,
            0
          );
          if (currentCap < maxCap) {
            // 5% chance pra pingar drop extra por level nesse ciclo idle
            if (Math.random() * 100 < 5 * petLevel) {
              const drop = 'Dirt';
              newInv[drop] = (newInv[drop] || 0) + 1;
              updated = true;
            }
          }
        }

        // upg_autosell (2 secs)
        if (activeUpgrades.includes('upg_autosell')) {
          const sellable = ['Dirt', 'Sand', 'Gravel', 'Cobblestone'];
          for (const item of sellable) {
            if (newInv[item] && newInv[item] > 0) {
              const sellAmt = Math.min(newInv[item], 10);
              newInv[item] -= sellAmt;
              setMineCoins(prev => prev + (sellAmt * (itemPrices[item] || 1)) * coinMult);
              updated = true;
            }
          }
        }

        // upg_villagers_unlock (2 secs)
        if (activeUpgrades.includes('upg_villagers_unlock')) {
          const currentCap = Object.values(newInv).reduce((acc, val) => acc + val, 0);
          if (currentCap < maxCap) {
            Object.entries(ownedVillagers).forEach(([dimId, count]) => {
              if (count > 0) {
                const dim = dimensions[dimId];
                if (dim && dim.blocks.length > 0) {
                  const blockToFarm = dim.blocks[0];
                  const dropName = dropMap[blockToFarm.name];
                  if (dropName) {
                    newInv[dropName] = (newInv[dropName] || 0) + count;
                    updated = true;
                  }
                }
              }
            });
          }
        }

        return updated ? newInv : prev;
      });
    }, 2000);
    return () => clearInterval(idleInterval);
  }, [activeUpgrades, toolsLevel.storage, equippedPet, ownedPets]);

  const currentCapacity = Object.values(inventory).reduce(
    (acc, val) => acc + val,
    0
  );
  const currentStorageTier = toolsLevel.storage || 0;
  const storageCapacityBonus =
    currentStorageTier > 0
      ? toolChains.storage[currentStorageTier - 1].capacityBonus
      : 0;
  const upgradeCapacityBonus = activeUpgrades.includes('upg_storage_1')
    ? UPGRADE_STORAGE_BONUS
    : 0;
  const shulkerAmulet = getEquippedEffect('double_capacity');
  const accessoryCapacityMult = shulkerAmulet ? (shulkerAmulet.effectParams.multiplier || 2) : 1;
  const maxCapacity = Math.floor((BASE_INVENTORY_CAPACITY + storageCapacityBonus + upgradeCapacityBonus) * accessoryCapacityMult);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeCraft) {
      interval = setInterval(() => {
        setActiveCraft((prev) => {
          if (!prev) return null;
          return { ...prev, progress: prev.progress + 0.1 };
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeCraft?.toolCategory, activeCraft?.tier, activeCraft?.totalTime, activeCraft?.customRecipe]);

  useEffect(() => {
    if (activeCraft && activeCraft.progress >= activeCraft.totalTime) {
      if (activeCraft.customRecipe) {
        const recipe = activeCraft.customRecipe;
        if (recipe.creates === 'Crafting Table' || recipe.creates === 'Furnace' || recipe.creates === 'Blast Furnace') {
          setOwnedStations(prev => ({ ...prev, [recipe.creates]: true }));
        } else {
          setInventory(prev => ({ ...prev, [recipe.creates]: (prev[recipe.creates] || 0) + recipe.amount }));
        }
      } else if (activeCraft.toolCategory && activeCraft.tier !== undefined) {
        const category = activeCraft.toolCategory;
        const nextToolIndex = activeCraft.tier;
        const nextTool = toolChains[category][nextToolIndex];

        setToolsLevel((prev) => {
          const currentTier = prev[category] || 0;
          // Only update max durability if we are actually advancing in tier
          if (currentTier <= nextToolIndex) {
            setToolDurabilities(dPrev => ({
              ...dPrev,
              [category]: nextTool.maxDurability,
            }));
          } else {
            // If crafting a lower tier tool (for fun?), reset it to max ONLY if the current durability of the high tier is lower than the new low tier max? No, just don't overwrite durability of higher tier.
          }
          return {
            ...prev,
            [category]: Math.max(currentTier, nextToolIndex + 1),
          };
        });
      }
      setActiveCraft(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCraft?.progress]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (furnaceState && furnaceState.progress < furnaceState.totalTime) {
      interval = setInterval(() => {
        setFurnaceState((prev) => {
          if (!prev) return null;
          const newProgress = prev.progress + 0.1;
          if (newProgress >= prev.totalTime) {
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

  const blockName = nameMap[currentBlock] || currentBlock;
  const currentDimData = dimensions[currentDim];

  // Lógica de Upgrades
  function buyUpgrade(upgradeId: string) {
    if (activeUpgrades.includes(upgradeId)) return;
    const upg = availableUpgrades.find((u) => u.id === upgradeId);
    if (!upg) return;

    let canBuy = true;
    if (!isDebugMode) {
      for (const [res, amount] of Object.entries(upg.cost)) {
        if ((inventory[res] || 0) < (amount as number)) canBuy = false;
      }
      if (upg.mineCoinCost && mineCoins < upg.mineCoinCost) {
        canBuy = false;
      }
    }

    if (canBuy) {
      if (!isDebugMode) {
        setInventory((prev) => {
          const newInv = { ...prev };
          for (const [res, amount] of Object.entries(upg.cost)) {
            newInv[res] -= amount as number;
          }
          return newInv;
        });
        if (upg.mineCoinCost) {
          setMineCoins(prev => prev - upg.mineCoinCost!);
        }
      }
      setActiveUpgrades((prev) => [...prev, upgradeId]);
    } else {
      alert('Recursos insuficientes para o upgrade!');
    }
  }

  // Lógica para Mudar de Dimensão
  function handleDimensionChange(newDim: string) {
    setCurrentDim(newDim);
    setCurrentBlock(dimensions[newDim].blocks[0].name); // Reseta pro primeiro bloco da dimensão
    setMiningProgress(0); // Reseta progresso ao trocar de dimensão
    setWarningMessage('');
  }



  // Lógica de Rebirth
  function handleRebirth() {
    const confirmRebirth = window.confirm('Sua jornada atingiu o pico. Tem certeza que deseja Ascender? Você perderá todos seus itens, níveis de ferramentas, upgrades e moedas normais.');
    if (!confirmRebirth) return;

    let shards = 10;
    if (toolsLevel.pickaxe >= 5) shards += 20; // Recompensa extra se tiver alto nível
    if (toolsLevel.pickaxe >= 6) shards += 50; 
    shards += Math.floor(mineCoins / 50000);
    
    // Contabiliza valor do inventário
    const invValue = Object.entries(inventory).reduce((acc, [item, amt]) => acc + (itemPrices[item] || 0) * amt, 0);
    shards += Math.floor(invValue / 10000);

    setPrestigeCurrency(prev => prev + shards);
    setRebirthCount(prev => prev + 1);

    // Hard Reset
    setInventory({});
    setToolsLevel({ pickaxe: 0, shovel: 0, axe: 0, hoe: 0, storage: 0 });
    setToolDurabilities({ pickaxe: 0, shovel: 0, axe: 0, hoe: 0 });
    setMineCoins(0);
    setActiveUpgrades([]);
    setOwnedVillagers({});
    setCurrentDim('Overworld');
    setCurrentBlock('Grass_Block');
    setActiveTab('mining');
  }

  function handleBuyRebirthUpgrade(upgradeId: string, cost: number) {
    if (prestigeCurrency >= cost) {
      setPrestigeCurrency(prev => prev - cost);
      setRebirthUpgradesLevels(prev => ({ ...prev, [upgradeId]: (prev[upgradeId] || 0) + 1 }));
    }
  }

  // Lógica de Mineração
  function handleMineBlock() {
    if (currentCapacity >= maxCapacity) {
      setWarningMessage('Inventário Cheio!');
      setTimeout(() => setWarningMessage(''), 2000);
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
        // Especial dragão
        if (activePetInfo.id === 'pet_dragon') {
          petDropBonus += 0.5 * petLevel;
        }
        // Especial Unicornio Lendário
        if (activePetInfo.id === 'pet_unicorn') {
          petSpeedBonus += 5 * petLevel;
        }
      }
    }

    if (reqTool !== 'none') {
      const currentTier = toolsLevel[reqTool] || 0;

      if (currentTier < reqLevel) {
        setWarningMessage('Ferramenta insuficiente para minerar este bloco!');
        setTimeout(() => setWarningMessage(''), 2000);
        return; // não pode minerar
      }

      if (currentTier > 0) {
        const activeTool = toolChains[reqTool][currentTier - 1];
        toolSpeed = activeTool.speed;
        if (hasSpeedPotion) {
          toolSpeed *= 1.5; // +50% speed from potion
        }

        if (toolDurabilities[reqTool] <= 0) {
          setWarningMessage('Sua ferramenta quebrou!');
          setTimeout(() => setWarningMessage(''), 2000);
          setToolsLevel((prev) => ({ ...prev, [reqTool]: 0 }));
          return;
        }
      }
    }

    const baseMiningSpeed = (toolSpeed + petSpeedBonus) * eventMiningSpeedMult * rebirthSpeedMult;
    // Opcional: fazer a mineração inicial ser mais lenta mitigando o valor final se as ferramentas forem de tier 0
    let finalMiningSpeed = (toolsLevel.pickaxe === 0 && reqTool === 'none') ? baseMiningSpeed * 0.5 : baseMiningSpeed;

    // Accessory Effects triggering on-click
    const bouncyRing = getEquippedEffect('bouncy_click');
    if (bouncyRing && Math.random() < (bouncyRing.effectParams.chance || 0.15)) {
      const minEx = bouncyRing.effectParams.minExtra || 1;
      const maxEx = bouncyRing.effectParams.maxExtra || 4;
      const extraClicks = Math.floor(Math.random() * (maxEx - minEx + 1)) + minEx;
      finalMiningSpeed *= (1 + extraClicks);
    }

    const creeperRing = getEquippedEffect('resource_explosion');
    if (creeperRing && Math.random() < (creeperRing.effectParams.chance || 0.01)) {
      finalMiningSpeed *= (creeperRing.effectParams.clicks || 100);
    }

    const newProgress = miningProgress + finalMiningSpeed;

    if (newProgress >= hardness) {
      // Bloco quebrado! Agora aplicamos o dano na ferramenta.
      if (reqTool !== 'none' && toolsLevel[reqTool] > 0 && !hasDurabilityPotion) {
        const newDurability = toolDurabilities[reqTool] - 1;
        setToolDurabilities((prev) => ({ ...prev, [reqTool]: newDurability }));

        if (newDurability <= 0) {
          setWarningMessage('Sua ferramenta quebrou!');
          setTimeout(() => setWarningMessage(''), 2000);
          setToolsLevel((prev) => ({ ...prev, [reqTool]: 0 }));
        }
      }

      const drop = dropMap[currentBlock];

      let dropAmount = 1;
      if (activeUpgrades.includes('upg_mining_1')) dropAmount += 1;

      // Rebirth Drop Bonus Chance (adds +1 drops based on percentage)
      if (Math.random() < rebirthDropBonus) dropAmount += 1;
      if (rebirthDropBonus > 1) dropAmount += Math.floor(rebirthDropBonus);

      if (petDropBonus > 0) {
        dropAmount += Math.floor(petDropBonus);
        if (Math.random() < petDropBonus % 1) dropAmount += 1;
      }

      if (hasLootPotion) {
        dropAmount *= 2;
      }

      if (hasMagnetPotion) {
        dropAmount += 1;
      }

      // Event: double drops
      dropAmount = Math.floor(dropAmount * eventDropMult);

      // Fortune Glove: 20% 2x, 5% 3x, 1% 4x
      if (fortuneGlove) {
        const roll = Math.random();
        if (roll < (fortuneGlove.effectParams.quad || 0.01)) {
          dropAmount *= 4;
        } else if (roll < (fortuneGlove.effectParams.triple || 0.05)) {
          dropAmount *= 3;
        } else if (roll < (fortuneGlove.effectParams.double || 0.20)) {
          dropAmount *= 2;
        }
      }

      if (drop) {
        setInventory((prev) => ({
          ...prev,
          [drop]: (prev[drop] || 0) + dropAmount,
        }));
      }

      // Drops extras (Folhas e Cascalho)
      if (currentBlock === 'Oak_Leaves') {
        const leafDrops: Record<string, number> = {};
        if (Math.random() < 0.20) leafDrops['Stick'] = dropAmount; // 20%
        if (Math.random() < 0.05) leafDrops['Apple'] = dropAmount; // 5%

        if (Object.keys(leafDrops).length > 0) {
          setInventory((prev) => {
            const newInv = { ...prev };
            for (const [key, val] of Object.entries(leafDrops)) {
              newInv[key] = (newInv[key] || 0) + val;
            }
            return newInv;
          });
        }
      } else if (currentBlock === 'Gravel') {
        if (Math.random() < 0.10) {
          setInventory((prev) => ({
            ...prev,
            'Flint': (prev['Flint'] || 0) + dropAmount
          }));
        }
      }

      // Check for Pet Drops (Random Roll 0-100) — event + luck boost
      const petRoll = Math.random() * 100;
      for (const pet of availablePets) {
        const adjustedChance = pet.dropChance * eventPetChanceMult * (1 + luckBonus);
        if (petRoll < adjustedChance) {
          alert(`CARAMBA! VOCÊ ACHOU UM PET: ${pet.name} (${pet.category})!`);
          setOwnedPets((prev) => {
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
        setPendingChest(chestDrop);
        setChestRewards(rewards);
      }

      // Dar XP passivo pro pet equipado
      if (equippedPet) {
        const xpGain = hasXpPotion ? 3 : 1; // 3x XP com poção
        setOwnedPets((prev) => {
          const current = prev[equippedPet];
          if (!current) return prev;
          const petDef = availablePets.find(p => p.id === equippedPet);
          if (petDef && current.level < petDef.maxLevel) {
            return { ...prev, [equippedPet]: { ...current, xp: current.xp + xpGain } };
          }
          return prev;
        });
      }

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
        // Boost raro se tiver picareta melhor
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
      setCurrentBlock(selectedBlock);
      setMiningProgress(0);
      setWarningMessage('');
    } else {
      setMiningProgress(newProgress);
    }
  }

  // Level up Pet
  function upgradePet(petId: string) {
    const petData = ownedPets[petId];
    if (!petData) return;
    const petDef = availablePets.find(p => p.id === petId);
    if (!petDef) return;
    if (petData.level >= petDef.maxLevel) return;

    const xpNeeded = petData.level * 100;
    if (petData.xp >= xpNeeded) {
      setOwnedPets(prev => ({
        ...prev,
        [petId]: { level: petData.level + 1, xp: petData.xp - xpNeeded }
      }));
    } else {
      // Alternative: pay with MineCoins if short on XP
      const xpMissing = xpNeeded - petData.xp;
      const costMC = xpMissing * 2; // 2 MC per 1 XP missing

      if (mineCoins >= costMC) {
        setMineCoins(prev => prev - costMC);
        setOwnedPets(prev => ({
          ...prev,
          [petId]: { level: petData.level + 1, xp: 0 }
        }));
      } else {
        alert(`Você não tem EXP nem MineCoins suficientes! Faltam ${costMC} MC.`);
      }
    }
  }

  // 3. Add hireVillager function
  function hireVillager(dimId: string) {
    const count = ownedVillagers[dimId] || 0;
    const baseCost = 500;
    const cost = baseCost * Math.pow(1.5, count);

    if (mineCoins >= cost) {
      setMineCoins(prev => prev - cost);
      setOwnedVillagers(prev => ({
        ...prev,
        [dimId]: count + 1
      }));
    } else {
      alert('Mine Coins insuficientes para contratar!');
    }
  }

  // Handlers and effects for events, accessories, and chests have been extracted to their respective hooks.

  // ═══ COMPUTE ACCESSORY MODIFIERS ═══
  // Fortune glove
  const fortuneGlove = getEquippedEffect('fortune_roll');

  // Luck boost (Rabbit Amulet)
  const luckAcc = getEquippedEffect('luck_boost');
  const luckBonus = luckAcc ? (luckAcc.effectParams.bonus || 0) : 0;

  // Event modifiers
  const isEventActive = activeEvent && Date.now() < eventEndTime;
  const eventMiningSpeedMult = (isEventActive && activeEvent?.modifier === 'mining_speed') ? activeEvent.modifierValue : 1;
  const eventDropMult = (isEventActive && activeEvent?.modifier === 'drop_amount') ? activeEvent.modifierValue : 1;
  const eventPetChanceMult = (isEventActive && activeEvent?.modifier === 'pet_drop_chance') ? activeEvent.modifierValue : 1;

  const isFullscreenTab = activeTab === 'shop' || activeTab === 'villagers' || activeTab === 'accessories' || activeTab === 'rebirth';
  const hasPickaxeLevel = toolsLevel.pickaxe || 0;

  return (
    <div className="flex h-screen bg-stone-900 text-stone-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} rebirthUnlocked={rebirthCount > 0 || hasPickaxeLevel >= 6 || currentDim === 'Nether'} />

      <div className="flex-1 flex flex-col md:flex-row relative">

        {/* ═══ FULLSCREEN PANELS (Shop / Villagers / Rebirth) ═══ */}
        {activeTab === 'rebirth' && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <RebirthPanel
              prestigeCurrency={prestigeCurrency}
              rebirthCount={rebirthCount}
              rebirthUpgradesLevels={rebirthUpgradesLevels}
              onBuyUpgrade={handleBuyRebirthUpgrade}
              onRebirth={handleRebirth}
              currentDim={currentDim}
              toolsLevel={toolsLevel}
              inventory={inventory}
              mineCoins={mineCoins}
            />
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <ShopPanel
              inventory={inventory}
              setInventory={setInventory}
              mineCoins={mineCoins}
              setMineCoins={setMineCoins}
              activePotions={activePotions}
              isDebugMode={isDebugMode}
              onBuyPotion={(potionId, cost, durationMs) => {
                const finalCost = isDebugMode ? 0 : cost;
                if (mineCoins >= finalCost) {
                  setMineCoins(prev => prev - finalCost);
                  setActivePotions(prev => ({
                    ...prev,
                    [potionId]: Date.now() + durationMs
                  }));
                }
              }}
            />
          </div>
        )}

        {activeTab === 'villagers' && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {activeUpgrades.includes('upg_villagers_unlock') ? (
              <VillagersPanel
                ownedVillagers={ownedVillagers}
                hireVillager={hireVillager}
                mineCoins={mineCoins}
              />
            ) : (
              <div className="flex-1 bg-linear-to-b from-[#1a1025] via-[#0d1b2a] to-[#0a0f1a] flex items-center justify-center flex-col text-center">
                <div className="text-8xl mb-6 opacity-40">🔒</div>
                <h2 className="text-3xl font-black text-stone-400 mb-3">Sistema Bloqueado</h2>
                <p className="text-stone-600 font-bold max-w-sm text-sm leading-relaxed">
                  Compre o upgrade "Taverna Local" na aba de Upgrades para liberar os Aldeões.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══ ACCESSORIES (Fullscreen) ═══ */}
        {activeTab === 'accessories' && (
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <AccessoriesPanel
              ownedAccessories={ownedAccessories}
              equippedAccessories={equippedAccessories}
              onEquip={equipAccessory}
              onUnequip={unequipAccessory}
            />
          </div>
        )}

        {/* ═══ MINING + RIGHT PANEL (only visible when NOT fullscreen tab) ═══ */}
        {!isFullscreenTab && (
          <>
            {/* LADO ESQUERDO: Gameplay */}
            <div
              className={`relative flex-1 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 min-h-[50vh] transition-all duration-700 ${activeTab !== 'mining' ? 'hidden md:flex opacity-50 pointer-events-none' : ''}`}
              style={{ backgroundImage: `url('${currentDimData.background}')` }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

              {/* Event Banner */}
              <EventBanner activeEvent={activeEvent} eventEndTime={eventEndTime} />

              <div className="relative z-10 flex flex-col items-center">
                {/* Seletor de Dimensões */}
                <DimensionSelector
                  currentDim={currentDim}
                  dimensions={dimensions}
                  onChange={handleDimensionChange}
                  disabled={activeTab !== 'mining'}
                  rebirthCount={rebirthCount}
                  pickaxeLevel={hasPickaxeLevel}
                />

                <button
                  onClick={handleMineBlock}
                  className={`group relative cursor-pointer transform ${videoQuality !== 'Baixa' ? 'transition-all duration-100 hover:scale-110 active:scale-95 active:rotate-3' : ''}`}
                  disabled={activeTab !== 'mining'}
                >
                  {videoQuality !== 'Baixa' && <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                  <img
                    src={`/${currentBlock}.webp`}
                    alt={currentBlock}
                    className={`w-48 h-48 md:w-64 md:h-64 object-contain ${videoQuality === 'Alta' ? 'drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]' : ''}`}
                    draggable={false}
                  />
                </button>

                {warningMessage && (
                  <div className="absolute top-0 text-red-500 font-bold bg-black/50 px-4 py-2 rounded-full transform -translate-y-full">
                    {warningMessage}
                  </div>
                )}

                <div className={`w-48 md:w-64 h-6 bg-stone-900/80 rounded-full border border-stone-600 mt-6 overflow-hidden relative ${videoQuality === 'Alta' ? 'shadow-inner' : ''}`}>
                  <div
                    className={`h-full bg-emerald-500 ${videoQuality !== 'Baixa' ? 'transition-all duration-150' : ''}`}
                    style={{
                      width: `${Math.min(100, (miningProgress / (blockProperties[currentBlock]?.hardness || 10)) * 100)}%`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-stone-200 drop-shadow-md">
                    {Math.floor(miningProgress)} /{' '}
                    {blockProperties[currentBlock]?.hardness || 10}
                  </span>
                </div>

                <p className="mt-4 font-bold text-stone-300 text-2xl md:text-3xl capitalize drop-shadow-lg">
                  {blockName}
                </p>
              </div>
            </div>

            {/* LADO DIREITO: Gerenciamento (Tabs) */}
            <div className={`w-full md:w-100 lg:w-125 bg-stone-100 dark:bg-stone-950 flex flex-col h-screen overflow-y-auto custom-scrollbar border-l border-stone-800 ${activeTab !== 'mining' && activeTab !== 'pets' && activeTab !== 'settings' ? 'hidden' : ''}`}>

              {(activeTab === 'mining' || activeTab === 'pets') && (
                <EquipmentHeader
                  toolsLevel={toolsLevel}
                  toolDurabilities={toolDurabilities}
                />
              )}

              {(activeTab === 'mining') && (
                <>
                  <InventoryPanel
                    inventory={inventory}
                    currentCapacity={currentCapacity}
                    maxCapacity={maxCapacity}
                  />
                  <UpgradesPanel
                    activeUpgrades={activeUpgrades}
                    buyUpgrade={buyUpgrade}
                    mineCoins={mineCoins}
                    isDebugMode={isDebugMode}
                  />
                  <CraftingPanel
                    toolsLevel={toolsLevel}
                    activeCraft={activeCraft}
                    inventory={inventory}
                    setInventory={setInventory}
                    ownedStations={ownedStations}
                    setActiveCraft={setActiveCraft}
                    activeUpgrades={activeUpgrades}
                    isDebugMode={isDebugMode}
                  />
                  <FurnacePanel
                    inventory={inventory}
                    setInventory={setInventory}
                    ownedStations={ownedStations}
                    furnaceState={furnaceState}
                    setFurnaceState={setFurnaceState}
                  />
                </>
              )}

              {activeTab === 'pets' && (
                <PetsPanel
                  ownedPets={ownedPets}
                  equippedPet={equippedPet}
                  setEquippedPet={setEquippedPet}
                  upgradePet={upgradePet}
                  mineCoins={mineCoins}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPanel
                  setVideoQuality={setVideoQuality}
                  videoQuality={videoQuality}
                  audioVolume={audioVolume}
                  setAudioVolume={setAudioVolume}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  isDebugMode={isDebugMode}
                  setIsDebugMode={setIsDebugMode}
                  onCheatAddCoins={(amount) => setMineCoins(prev => prev + amount)}
                  onCheatAddResources={() => {
                    setInventory(prev => {
                      const newInv = { ...prev };
                      const allResources = ['Dirt', 'Wood', 'Cobblestone', 'Iron Ingot', 'Gold Ingot', 'Diamond', 'Netherite Ingot', 'Oak Log', 'Sand', 'Gravel', 'Raw Iron', 'Raw Gold', 'Ancient Debris', 'Stick', 'Oak Planks', 'Flint', 'Apple', 'Netherite Scrap', 'Coal', 'Raw Copper'];
                      allResources.forEach(res => {
                        newInv[res] = (newInv[res] || 0) + 1000;
                      });
                      return newInv;
                    });
                  }}
                  onCheatUnlockPets={() => {
                    setOwnedPets(prev => {
                      const newPets = { ...prev };
                      availablePets.forEach(pet => {
                        if (!newPets[pet.id]) newPets[pet.id] = { level: 1, xp: 0 };
                      });
                      return newPets;
                    });
                    alert('Todos os pets desbloqueados!');
                  }}
                  onCheatTriggerEvent={() => {
                    const evt = randomEvents[Math.floor(Math.random() * randomEvents.length)];
                    setActiveEvent(evt);
                    setEventEndTime(Date.now() + evt.durationMs);
                  }}
                  onCheatUnlockAccessories={() => {
                    setOwnedAccessories(prev => {
                      const newAcc = { ...prev };
                      allAccessories.forEach(acc => { newAcc[acc.id] = true; });
                      return newAcc;
                    });
                    alert('Todos os acessórios desbloqueados!');
                  }}
                />
              )}

              {/* Chest Modal */}
              {pendingChest && (
                <ChestModal
                  chest={pendingChest}
                  rewards={chestRewards}
                  onClose={handleCloseChest}
                />
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}