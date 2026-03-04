import { useState, useEffect } from 'react';
import {
  dimensions,
  dropMap,
  nameMap,
  availableUpgrades,
  toolChains,
  blockProperties,
  availablePets,
} from '../assets/consts';

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

  type CraftingTask = {
    toolCategory: string;
    tier: number;
    progress: number;
    totalTime: number;
  };
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

        // upg_idle_1 (2 secs)
        if (activeUpgrades.includes('upg_idle_1')) {
          const currentCap = Object.values(newInv).reduce(
            (acc, val) => acc + val,
            0
          );
          const maxCap =
            50 +
            (toolsLevel.storage > 0
              ? toolChains.storage[toolsLevel.storage - 1].capacityBonus
              : 0) +
            (activeUpgrades.includes('upg_storage_1') ? 100 : 0);
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
          const maxCap =
            50 +
            (toolsLevel.storage > 0
              ? toolChains.storage[toolsLevel.storage - 1].capacityBonus
              : 0) +
            (activeUpgrades.includes('upg_storage_1') ? 100 : 0);
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
          const maxCap =
            50 +
            (toolsLevel.storage > 0
              ? toolChains.storage[toolsLevel.storage - 1].capacityBonus
              : 0) +
            (activeUpgrades.includes('upg_storage_1') ? 100 : 0);
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
    ? 100
    : 0;
  const maxCapacity = 50 + storageCapacityBonus + upgradeCapacityBonus;

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

  // Estados dos Menus
  const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(true);
  const [isCraftingOpen, setIsCraftingOpen] = useState<boolean>(false);
  const [isPetsOpen, setIsPetsOpen] = useState<boolean>(false);

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

        const newDurability = toolDurabilities[reqTool] - 1;
        setToolDurabilities((prev) => ({ ...prev, [reqTool]: newDurability }));

        if (newDurability <= 0) {
          setWarningMessage('Sua ferramenta quebrou!');
          setTimeout(() => setWarningMessage(''), 2000);
          setToolsLevel((prev) => ({ ...prev, [reqTool]: 0 }));
        }
      }
    }

    const newProgress = miningProgress + toolSpeed + petSpeedBonus;
    if (newProgress >= hardness) {
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
        {/* Equipamentos Ativos */}
        <div className="bg-stone-200 dark:bg-stone-800 p-4 border-b border-stone-300 dark:border-stone-700 flex justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-500 uppercase">
              Picareta
            </span>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {toolsLevel.pickaxe > 0
                ? `${toolChains.pickaxe[toolsLevel.pickaxe - 1].name}`
                : 'Mão (Nenhum)'}
            </span>
            {toolsLevel.pickaxe > 0 && (
              <span className="text-xs text-amber-600">
                {toolDurabilities.pickaxe} /{' '}
                {toolChains.pickaxe[toolsLevel.pickaxe - 1].maxDurability}{' '}
                restantes
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-stone-500 uppercase">
              Pá
            </span>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {toolsLevel.shovel > 0
                ? `${toolChains.shovel[toolsLevel.shovel - 1].name}`
                : 'Mão (Nenhum)'}
            </span>
            {toolsLevel.shovel > 0 && (
              <span className="text-xs text-amber-600">
                {toolDurabilities.shovel} /{' '}
                {toolChains.shovel[toolsLevel.shovel - 1].maxDurability}{' '}
                restantes
              </span>
            )}
          </div>
        </div>

        {/* 1. Inventário */}
        <div className="p-6 bg-stone-200 dark:bg-stone-900 border-b border-stone-300 dark:border-stone-800 sticky top-0 z-20 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-3">
              <img
                src="/Backpack.png"
                alt="Backpack"
                className="w-8 h-8 drop-shadow-md"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              Inventário
            </h3>
            <span
              className={`text-sm font-bold px-3 py-1 bg-stone-100 dark:bg-stone-950 rounded-full border ${currentCapacity >= maxCapacity ? 'text-red-500 border-red-500' : 'text-stone-500 border-stone-300 dark:border-stone-700'}`}
            >
              {currentCapacity} / {maxCapacity}
            </span>
          </div>
          <div className="max-h-56 md:max-h-72 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 gap-3">
            {Object.entries(inventory).map(
              ([resourceName, amount]) =>
                amount > 0 && (
                  <div
                    key={resourceName}
                    className="flex items-center gap-3 bg-white dark:bg-stone-950 p-2 md:p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform flex-shrink-0 border border-stone-200 dark:border-stone-800">
                      <img
                        src={`/${resourceName.replaceAll(' ', '_')}.webp`}
                        alt={resourceName}
                        className="w-full h-full object-contain drop-shadow-sm"
                        onError={(e) =>
                          (e.currentTarget.style.display = 'none')
                        }
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span
                        className="text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider truncate"
                        title={resourceName.replace(/_/g, ' ')}
                      >
                        {resourceName.replace(/_/g, ' ')}
                      </span>
                      <span className="text-lg md:text-xl font-black text-stone-800 dark:text-stone-200">
                        {amount}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        {/* 2. Menu de Upgrades */}
        <div className="border-b border-stone-300 dark:border-stone-800">
          <button
            onClick={() => setIsUpgradesOpen(!isUpgradesOpen)}
            className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
          >
            <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
              <img
                src="/Anvil.webp"
                alt="Anvil"
                className="w-8 h-8 rounded drop-shadow-sm"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              Upgrades
            </span>
            {/* Imagem da Seta com Rotação CSS */}
            <img
              src="/Down_Arrow.png"
              alt="arrow"
              className={`w-4 h-4 transition-transform duration-300 ${isUpgradesOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </button>

          {isUpgradesOpen && (
            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
              {availableUpgrades.map((upgrade) => {
                const isBought = activeUpgrades.includes(upgrade.id);
                return (
                  <button
                    key={upgrade.id}
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={isBought}
                    className={`w-full text-left bg-white dark:bg-stone-800 border p-3 rounded-xl transition-colors flex gap-3 group shadow-sm ${isBought ? 'opacity-50 cursor-not-allowed border-stone-300 dark:border-stone-700' : 'border-stone-200 dark:border-stone-700 hover:border-amber-500 cursor-pointer'}`}
                  >
                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform flex-shrink-0">
                      {upgrade.icon}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-stone-800 dark:text-stone-200 truncate pr-2">
                          {upgrade.name}{' '}
                          {isBought && (
                            <span className="text-emerald-500 inline-block text-[10px] ml-1 uppercase">
                              (Comprado)
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100 dark:bg-stone-900 px-1.5 py-0.5 rounded flex-shrink-0">
                          {upgrade.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 leading-tight">
                        {upgrade.description}
                      </p>
                      {!isBought && (
                        <div className="mt-2 text-xs text-stone-500">
                          Custo:
                          {Object.entries(upgrade.cost).map(([res, amount]) => (
                            <span
                              key={res}
                              className="ml-1 inline-block bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-500 font-bold"
                            >
                              {amount as number} {res}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Menu de Crafting Funcional */}
        <div className="border-b border-stone-300 dark:border-stone-800">
          <button
            onClick={() => setIsCraftingOpen(!isCraftingOpen)}
            className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
          >
            <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
              <img
                src="/Crafting_Table.webp"
                alt="Crafting"
                className="w-8 h-8 rounded drop-shadow-sm"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              Crafting
            </span>
            {/* Imagem da Seta com Rotação CSS */}
            <img
              src="/Down_Arrow.png"
              alt="arrow"
              className={`w-4 h-4 transition-transform duration-300 ${isCraftingOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </button>

          {isCraftingOpen && (
            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
              {activeCraft && (
                <div className="bg-white dark:bg-stone-800 p-3 border border-emerald-500 rounded-xl mb-4 shadow-sm relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-emerald-500/10 transition-all duration-100"
                    style={{
                      width: `${(activeCraft.progress / activeCraft.totalTime) * 100}%`,
                    }}
                  />
                  <div className="relative z-10">
                    <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm mb-1">
                      Craftando:{' '}
                      {
                        toolChains[activeCraft.toolCategory][activeCraft.tier]
                          .name
                      }
                    </h4>
                    <p className="text-xs text-stone-500 font-bold">
                      {Math.min(
                        activeCraft.totalTime,
                        activeCraft.progress
                      ).toFixed(1)}
                      s / {activeCraft.totalTime}s
                    </p>
                  </div>
                </div>
              )}

              {Object.keys(toolChains).map((toolCategory) => {
                const currentTier = toolsLevel[toolCategory];
                const tool = toolChains[toolCategory][currentTier];

                // Se a ferramenta já foi upada no máximo, não exibe mais nada (ou você pode exibir "MÁXIMO")
                if (!tool) return null;

                return (
                  <button
                    key={tool.id}
                    onClick={() => buyTool(toolCategory)}
                    className="w-full text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl hover:border-emerald-500 transition-colors flex gap-3 group shadow-sm"
                  >
                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-800 dark:text-stone-200">
                        {tool.name}
                      </h4>
                      <div className="mt-2 text-xs text-stone-500">
                        Custo:
                        {Object.entries(tool.cost).map(([res, amount]) => (
                          <span
                            key={res}
                            className="ml-1 inline-block bg-stone-200 dark:bg-stone-900 px-1.5 py-0.5 rounded text-stone-700 dark:text-stone-300"
                          >
                            {amount as number} {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Menu de Pets */}
        <div className="border-b border-stone-300 dark:border-stone-800">
          <button
            onClick={() => setIsPetsOpen(!isPetsOpen)}
            className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
          >
            <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
              <span className="w-8 h-8 flex items-center justify-center text-xl bg-stone-200 dark:bg-stone-800 rounded">
                🐾
              </span>
              Meus Pets
            </span>
            <img
              src="/Down_Arrow.png"
              alt="arrow"
              className={`w-4 h-4 transition-transform duration-300 ${isPetsOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </button>

          {isPetsOpen && (
            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
              {Object.keys(ownedPets).length === 0 ? (
                <div className="text-center p-4 text-stone-500 text-sm font-bold bg-white dark:bg-stone-800 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
                  Nenhum Pet encontrado ainda.
                  <br /> Continue minerando!
                </div>
              ) : (
                Object.entries(ownedPets).map(([petId, level]) => {
                  const petInfo = availablePets.find((p) => p.id === petId);
                  if (!petInfo) return null;
                  const isEquipped = equippedPet === petId;

                  return (
                    <div
                      key={petId}
                      className={`w-full text-left bg-white dark:bg-stone-800 border p-3 rounded-xl transition-colors shadow-sm ${isEquipped ? 'border-amber-500' : 'border-stone-200 dark:border-stone-700'}`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-3xl border border-stone-200 flex-shrink-0 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-stone-800 text-white text-[9px] px-1 font-bold rounded-bl">
                            {petInfo.category.charAt(0)}
                          </div>
                          {petInfo.icon}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-stone-800 dark:text-stone-200 truncate pr-2">
                              {petInfo.name}{' '}
                              <span className="text-amber-600">Lv.{level}</span>
                            </h4>
                          </div>
                          <p className="text-[10px] text-stone-500 font-bold uppercase">
                            {petInfo.category} - {petInfo.baseBonusStr}
                          </p>
                          <button
                            onClick={() =>
                              setEquippedPet(isEquipped ? null : petId)
                            }
                            className={`mt-2 text-xs font-bold px-3 py-1 rounded transition-colors ${isEquipped ? 'bg-amber-100 text-amber-800 cursor-pointer' : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600'}`}
                          >
                            {isEquipped ? 'Desequipar' : 'Equipar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
