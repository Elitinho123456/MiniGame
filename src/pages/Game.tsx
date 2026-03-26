import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { eventBus } from '../events';

// ─── Custom Hooks ────────────────────────────────────────
import { useMiningSystem } from '../hooks/useMiningSystem';
import { useIdleSystem } from '../hooks/useIdleSystem';
import { useCraftingSystem } from '../hooks/useCraftingSystem';
import { useRebirthSystem } from '../hooks/useRebirthSystem';
import { usePetSystem } from '../hooks/usePetSystem';
import { useSettingsSystem, useDebugCheats } from '../hooks/useSettingsSystem';
import { useEventSystem } from '../hooks/useEventSystem';

// ─── Components ──────────────────────────────────────────
import Sidebar from '../components/ui/Sidebar';
import MiningView from '../components/game/MiningView';
import GameRightPanel from '../components/game/GameRightPanel';
import ShopPanel from '../components/ShopPanel';
import VillagersPanel from '../components/VillagersPanel';
import AccessoriesPanel from '../components/AccessoriesPanel';
import RebirthPanel from '../components/RebirthPanel';

// ═══════════════════════════════════════════════════════════
// Game — Componente principal (SRP: apenas composição)
// ═══════════════════════════════════════════════════════════

export default function Game() {
  // ─── Store ───────────────────────────────────────────────
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  const isDebugMode = useGameStore((s) => s.isDebugMode);
  const rebirthCount = useGameStore((s) => s.rebirthCount);
  const currentDim = useGameStore((s) => s.currentDim);
  const toolsLevel = useGameStore((s) => s.toolsLevel);
  const inventory = useGameStore((s) => s.inventory);
  const mineCoins = useGameStore((s) => s.mineCoins);
  const activeUpgrades = useGameStore((s) => s.activeUpgrades);
  const ownedVillagers = useGameStore((s) => s.ownedVillagers);
  const ownedAccessories = useGameStore((s) => s.ownedAccessories);
  const equippedAccessories = useGameStore((s) => s.equippedAccessories);
  const activePotions = useGameStore((s) => s.activePotions);
  const prestigeCurrency = useGameStore((s) => s.prestigeCurrency);
  const rebirthUpgradesLevels = useGameStore((s) => s.rebirthUpgradesLevels);

  const setInventory = useGameStore((s) => s.setInventory);
  const setMineCoins = useGameStore((s) => s.setMineCoins);
  const setActivePotions = useGameStore((s) => s.setActivePotions);
  const equipAccessory = useGameStore((s) => s.equipAccessory);
  const unequipAccessory = useGameStore((s) => s.unequipAccessory);

  // ─── Hooks de Sistema ────────────────────────────────────
  const { handleMineBlock, handleDimensionChange } = useMiningSystem();
  const { handleRebirth, handleBuyRebirthUpgrade } = useRebirthSystem();
  const { upgradePet, hireVillager, buyUpgrade } = usePetSystem();
  const debugCheats = useDebugCheats();

  useIdleSystem();
  useCraftingSystem();
  useSettingsSystem();
  useEventSystem();

  // ─── Debug: ativa logs do Event Bus em modo debug ────────
  useEffect(() => {
    eventBus.setDebugMode(isDebugMode);
  }, [isDebugMode]);

  // ─── Atalhos de Teclado ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTab !== 'mining') {
        setActiveTab('mining');
      }
      switch (e.key) {
        case '1': setActiveTab('shop'); break;
        case '2': setActiveTab('pets'); break;
        case '3': setActiveTab('villagers'); break;
        case '4': setActiveTab('accessories'); break;
        case '5': setActiveTab('settings'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, setActiveTab]);

  // ─── Derived ─────────────────────────────────────────────
  const hasPickaxeLevel = toolsLevel.pickaxe || 0;
  const isFullscreenTab = activeTab === 'shop' || activeTab === 'villagers' || activeTab === 'accessories' || activeTab === 'rebirth';

  return (
    <div className="flex h-screen bg-stone-900 text-stone-100 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rebirthUnlocked={rebirthCount > 0 || hasPickaxeLevel >= 6 || currentDim === 'Nether'}
      />

      <div className="flex-1 flex flex-col md:flex-row relative">

        {/* ═══ FULLSCREEN PANELS ═══ */}
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
                  setMineCoins((prev) => prev - finalCost);
                  setActivePotions((prev) => ({
                    ...prev,
                    [potionId]: Date.now() + durationMs,
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

        {/* ═══ MINING + RIGHT PANEL ═══ */}
        {!isFullscreenTab && (
          <>
            <MiningView
              onMineBlock={handleMineBlock}
              onDimensionChange={handleDimensionChange}
              isActive={activeTab === 'mining'}
            />

            <GameRightPanel
              buyUpgrade={buyUpgrade}
              upgradePet={upgradePet}
              debugCheats={debugCheats}
            />
          </>
        )}

      </div>
    </div>
  );
}