import { useGameStore } from '../../store/useGameStore';

import EquipmentHeader from '../ui/EquipmentHeader';
import InventoryPanel from '../InventoryPanel';
import UpgradesPanel from '../UpgradesPanel';
import CraftingPanel from '../CraftingPanel';
import FurnacePanel from '../FurnacePanel';
import EnchantmentPanel from '../EnchantmentPanel';
import PetsPanel from '../PetsPanel';
import FarmingPanel from '../FarmingPanel';
import SettingsPanel from '../SettingsPanel';
import ChestModal from '../ChestModal';

// ═══════════════════════════════════════════════════════════
// GameRightPanel — Painel direito com tabs de gerenciamento
// ═══════════════════════════════════════════════════════════

interface GameRightPanelProps {
  buyUpgrade: (id: string) => void;
  upgradePet: (id: string) => void;
  debugCheats: {
    onCheatAddCoins: (amount: number) => void;
    onCheatAddResources: () => void;
    onCheatUnlockPets: () => void;
    onCheatTriggerEvent: () => void;
    onCheatUnlockAccessories: () => void;
  };
}

export default function GameRightPanel({ buyUpgrade, upgradePet, debugCheats }: GameRightPanelProps) {
  const activeTab = useGameStore((s) => s.activeTab);
  const toolsLevel = useGameStore((s) => s.toolsLevel);
  const toolDurabilities = useGameStore((s) => s.toolDurabilities);
  const inventory = useGameStore((s) => s.inventory);
  const activeUpgrades = useGameStore((s) => s.activeUpgrades);
  const mineCoins = useGameStore((s) => s.mineCoins);
  const isDebugMode = useGameStore((s) => s.isDebugMode);
  const activeCraft = useGameStore((s) => s.activeCraft);
  const ownedStations = useGameStore((s) => s.ownedStations);
  const furnaceState = useGameStore((s) => s.furnaceState);
  const ownedPets = useGameStore((s) => s.ownedPets);
  const equippedPet = useGameStore((s) => s.equippedPet);
  const videoQuality = useGameStore((s) => s.videoQuality);
  const audioVolume = useGameStore((s) => s.audioVolume);
  const isMuted = useGameStore((s) => s.isMuted);
  const pendingChest = useGameStore((s) => s.pendingChest);
  const chestRewards = useGameStore((s) => s.chestRewards);

  const setInventory = useGameStore((s) => s.setInventory);
  const setActiveCraft = useGameStore((s) => s.setActiveCraft);
  const setFurnaceState = useGameStore((s) => s.setFurnaceState);
  const setEquippedPet = useGameStore((s) => s.setEquippedPet);
  const setVideoQuality = useGameStore((s) => s.setVideoQuality);
  const setAudioVolume = useGameStore((s) => s.setAudioVolume);
  const setIsMuted = useGameStore((s) => s.setIsMuted);
  const setIsDebugMode = useGameStore((s) => s.setIsDebugMode);
  const handleCloseChest = useGameStore((s) => s.handleCloseChest);

  const currentCapacity = useGameStore.getState().getCurrentCapacity();
  const maxCapacity = useGameStore.getState().getMaxCapacity();

  return (
    <div
      className={`w-full md:w-100 lg:w-125 bg-stone-100 dark:bg-stone-950 flex flex-col h-screen overflow-y-auto custom-scrollbar border-l border-stone-800 ${
        activeTab !== 'mining' && activeTab !== 'pets' && activeTab !== 'settings' && activeTab !== 'farming' ? 'hidden' : ''
      }`}
    >
      {(activeTab === 'mining' || activeTab === 'pets') && (
        <EquipmentHeader toolsLevel={toolsLevel} toolDurabilities={toolDurabilities} />
      )}

      {activeTab === 'mining' && (
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
          <EnchantmentPanel />
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

      {activeTab === 'farming' && (
        <FarmingPanel />
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
          onCheatAddCoins={debugCheats.onCheatAddCoins}
          onCheatAddResources={debugCheats.onCheatAddResources}
          onCheatUnlockPets={debugCheats.onCheatUnlockPets}
          onCheatTriggerEvent={debugCheats.onCheatTriggerEvent}
          onCheatUnlockAccessories={debugCheats.onCheatUnlockAccessories}
        />
      )}

      {/* Chest Modal */}
      {pendingChest && (
        <ChestModal chest={pendingChest} rewards={chestRewards} onClose={handleCloseChest} />
      )}
    </div>
  );
}
