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
} from '../assets/consts';

import EquipmentHeader from '../components/EquipmentHeader';
import InventoryPanel from '../components/InventoryPanel';
import UpgradesPanel from '../components/UpgradesPanel';
import CraftingPanel, { type CraftingTask } from '../components/CraftingPanel';
import PetsPanel from '../components/PetsPanel';

export default function Game() {
  // Estado de Dimensões e Blocos
  const [currentDim, setCurrentDim] = useState<string>('Overworld');
  const [currentBlock, setCurrentBlock] = useState<string>('Grass_Block');

  // Inventário
  const [inventory, setInventory] = useState<Record<string, number>>({});

  // Equipamentos do Jogador (Controla em qual tier a ferramenta está: 0, 1, 2...)
  const [toolsLevel, setToolsLevel] = useState<Record<string, number>>({
    pickaxe: 0,
    shovel: 0,
    storage: 0,
  });

  const [toolDurabilities, setToolDurabilities] = useState<
    Record<string, number>
  >({
    pickaxe: 0,
    shovel: 0,
  });

  const [miningProgress, setMiningProgress] = useState<number>(0);
  const [warningMessage, setWarningMessage] = useState<string>('');

  const [activeCraft, setActiveCraft] = useState<CraftingTask | null>(null);
  const [activeUpgrades, setActiveUpgrades] = useState<string[]>([]);

  // Pets
  const [ownedPets, setOwnedPets] = useState<Record<string, number>>({});
  const [equippedPet, setEquippedPet] = useState<string | null>(null);

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
          const petLevel = ownedPets['pet_cat'] || 1;
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
  const maxCapacity = BASE_INVENTORY_CAPACITY + storageCapacityBonus + upgradeCapacityBonus;

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
  }, [activeCraft?.toolCategory, activeCraft?.tier, activeCraft?.totalTime]);

  useEffect(() => {
    if (activeCraft && activeCraft.progress >= activeCraft.totalTime) {
      const category = activeCraft.toolCategory;
      const nextToolIndex = activeCraft.tier;
      const nextTool = toolChains[category][nextToolIndex];

      setToolsLevel((prev) => ({
        ...prev,
        [category]: prev[category] + 1,
      }));
      setToolDurabilities((prev) => ({
        ...prev,
        [category]: nextTool.maxDurability,
      }));
      setActiveCraft(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCraft?.progress]);

  const blockName = nameMap[currentBlock] || currentBlock;
  const currentDimData = dimensions[currentDim];

  // Lógica de Upgrades
  function buyUpgrade(upgradeId: string) {
    if (activeUpgrades.includes(upgradeId)) return;
    const upg = availableUpgrades.find((u) => u.id === upgradeId);
    if (!upg) return;

    let canBuy = true;
    for (const [res, amount] of Object.entries(upg.cost)) {
      if ((inventory[res] || 0) < (amount as number)) canBuy = false;
    }

    if (canBuy) {
      setInventory((prev) => {
        const newInv = { ...prev };
        for (const [res, amount] of Object.entries(upg.cost)) {
          newInv[res] -= amount as number;
        }
        return newInv;
      });
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

  // Lógica de Crafting (Compra de Ferramentas)
  function buyTool(toolCategory: string) {
    const currentTier = toolsLevel[toolCategory];
    const nextTool = toolChains[toolCategory][currentTier];

    if (!nextTool) return; // Já está no nível máximo

    // Verifica se tem todos os recursos
    let canBuy = true;
    for (const [res, amount] of Object.entries(nextTool.cost)) {
      if ((inventory[res] || 0) < (amount as number)) canBuy = false;
    }

    if (canBuy) {
      // Desconta recursos
      setInventory((prev) => {
        const newInv = { ...prev };
        for (const [res, amount] of Object.entries(nextTool.cost)) {
          newInv[res] -= amount as number;
        }
        return newInv;
      });
      if (activeCraft) {
        alert('Você já está craftando um item!');
        return;
      }

      let timeMultiplier = 1;
      if (activeUpgrades.includes('upg_crafting_1')) timeMultiplier -= 0.2; // 20% mais rápido

      setActiveCraft({
        toolCategory,
        tier: currentTier,
        progress: 0,
        totalTime: (nextTool.craftTime || 2) * timeMultiplier,
      });
    } else {
      alert('Recursos insuficientes!');
    }
  }

  // Lógica de Mineração
  function handleMineBlock() {
    if (currentCapacity >= maxCapacity) {
      setWarningMessage('Inventário Cheio!');
      setTimeout(() => setWarningMessage(''), 2000);
      return;
    }

    const blockProps = blockProperties[currentBlock];
    const hardness = blockProps ? blockProps.hardness : 10;
    const reqTool = blockProps ? blockProps.reqTool : 'none';
    const reqLevel = blockProps ? blockProps.reqLevel : 0;

    let toolSpeed = 1;
    let petSpeedBonus = 0;
    let petDropBonus = 0;

    if (equippedPet) {
      const activePetInfo = availablePets.find((p) => p.id === equippedPet);
      const petLevel = ownedPets[equippedPet] || 1;

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

        if (toolDurabilities[reqTool] <= 0) {
          setWarningMessage('Sua ferramenta quebrou!');
          setTimeout(() => setWarningMessage(''), 2000);
          setToolsLevel((prev) => ({ ...prev, [reqTool]: 0 }));
          return;
        }
      }
    }

    const newProgress = miningProgress + toolSpeed + petSpeedBonus;
    if (newProgress >= hardness) {
      // Bloco quebrado! Agora aplicamos o dano na ferramenta.
      if (reqTool !== 'none' && toolsLevel[reqTool] > 0) {
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

      if (petDropBonus > 0) {
        dropAmount += Math.floor(petDropBonus);
        if (Math.random() < petDropBonus % 1) dropAmount += 1;
      }

      if (drop) {
        setInventory((prev) => ({
          ...prev,
          [drop]: (prev[drop] || 0) + dropAmount,
        }));
      }

      // Check for Pet Drops (Random Roll 0-100)
      const petRoll = Math.random() * 100;
      for (const pet of availablePets) {
        if (petRoll < pet.dropChance) {
          alert(`CARAMBA! VOCÊ ACHOU UM PET: ${pet.name} (${pet.category})!`);
          setOwnedPets((prev) => ({
            ...prev,
            [pet.id]: (prev[pet.id] || 0) + 1, // Gain level se já tiver
          }));
          break; // Max 1 per hit
        }
      }

      const blocksInDim = currentDimData.blocks;
      const pickaxeLevel = toolsLevel.pickaxe || 0;
      let totalWeight = 0;
      const weightedBlocks = blocksInDim.map((b) => {
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-900 text-stone-100 transition-colors duration-300 overflow-hidden">
      {/* LADO ESQUERDO: Gameplay */}
      <div
        className="relative flex-1 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4 min-h-[50vh] md:min-h-screen border-b md:border-b-0 md:border-r border-stone-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] transition-all duration-700"
        style={{ backgroundImage: `url('${currentDimData.background}')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Seletor de Dimensões */}
          <div className="mb-12 flex items-center gap-2">
            <select
              value={currentDim}
              onChange={(e) => handleDimensionChange(e.target.value)}
              className="px-6 py-3 bg-stone-900/80 border border-stone-600 backdrop-blur-md rounded-full shadow-lg text-xl md:text-2xl font-black text-stone-200 tracking-widest uppercase cursor-pointer outline-none hover:bg-stone-800 transition-colors"
            >
              {Object.keys(dimensions).map((dimKey) => (
                <option key={dimKey} value={dimKey}>
                  {dimensions[dimKey].name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleMineBlock}
            className="group relative cursor-pointer transform transition-all duration-100 hover:scale-110 active:scale-95 active:rotate-3"
          >
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={`/${currentBlock}.webp`}
              alt={currentBlock}
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
              draggable={false}
            />
          </button>

          {warningMessage && (
            <div className="absolute top-0 text-red-500 font-bold bg-black/50 px-4 py-2 rounded-full transform -translate-y-full">
              {warningMessage}
            </div>
          )}

          <div className="w-48 md:w-64 h-6 bg-stone-900/80 rounded-full border border-stone-600 mt-6 overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-emerald-500 transition-all duration-150"
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

      {/* LADO DIREITO: Gerenciamento */}
      <div className="w-full md:w-100 bg-stone-100 dark:bg-stone-950 flex flex-col h-[50vh] md:h-screen overflow-y-auto custom-scrollbar">
        <EquipmentHeader
          toolsLevel={toolsLevel}
          toolDurabilities={toolDurabilities}
        />

        <InventoryPanel
          inventory={inventory}
          currentCapacity={currentCapacity}
          maxCapacity={maxCapacity}
        />

        <UpgradesPanel
          activeUpgrades={activeUpgrades}
          buyUpgrade={buyUpgrade}
        />

        <CraftingPanel
          toolsLevel={toolsLevel}
          activeCraft={activeCraft}
          buyTool={buyTool}
        />

        <PetsPanel
          ownedPets={ownedPets}
          equippedPet={equippedPet}
          setEquippedPet={setEquippedPet}
        />
      </div>
    </div>
  );
}
