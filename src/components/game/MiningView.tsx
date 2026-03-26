import { useGameStore } from '../../store/useGameStore';
import {
  dimensions,
  nameMap,
  blockProperties,
} from '../../assets/consts';
import EventBanner from '../ui/EventBanner';
import DimensionSelector from '../ui/DimensionSelector';

// ═══════════════════════════════════════════════════════════
// MiningView — Área de gameplay (bloco, barra de progresso)
// ═══════════════════════════════════════════════════════════

interface MiningViewProps {
  onMineBlock: () => void;
  onDimensionChange: (dim: string) => void;
  isActive: boolean;
}

export default function MiningView({ onMineBlock, onDimensionChange, isActive }: MiningViewProps) {
  const currentDim = useGameStore((s) => s.currentDim);
  const currentBlock = useGameStore((s) => s.currentBlock);
  const miningProgress = useGameStore((s) => s.miningProgress);
  const warningMessage = useGameStore((s) => s.warningMessage);
  const videoQuality = useGameStore((s) => s.videoQuality);
  const activeTab = useGameStore((s) => s.activeTab);
  const rebirthCount = useGameStore((s) => s.rebirthCount);
  const pickaxeLevel = useGameStore((s) => s.toolsLevel.pickaxe) || 0;
  const activeEvent = useGameStore((s) => s.activeEvent);
  const eventEndTime = useGameStore((s) => s.eventEndTime);

  const currentDimData = dimensions[currentDim];
  const blockName = nameMap[currentBlock] || currentBlock;
  const hardness = blockProperties[currentBlock]?.hardness || 10;

  return (
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
          onChange={onDimensionChange}
          disabled={!isActive}
          rebirthCount={rebirthCount}
          pickaxeLevel={pickaxeLevel}
        />

        <button
          onClick={onMineBlock}
          className={`group relative cursor-pointer transform ${videoQuality !== 'Baixa' ? 'transition-all duration-100 hover:scale-110 active:scale-95 active:rotate-3' : ''}`}
          disabled={!isActive}
        >
          {videoQuality !== 'Baixa' && (
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}
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

        <div
          className={`w-48 md:w-64 h-6 bg-stone-900/80 rounded-full border border-stone-600 mt-6 overflow-hidden relative ${videoQuality === 'Alta' ? 'shadow-inner' : ''}`}
        >
          <div
            className={`h-full bg-emerald-500 ${videoQuality !== 'Baixa' ? 'transition-all duration-150' : ''}`}
            style={{
              width: `${Math.min(100, (miningProgress / hardness) * 100)}%`,
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-stone-200 drop-shadow-md">
            {Math.floor(miningProgress)} / {hardness}
          </span>
        </div>

        <p className="mt-4 font-bold text-stone-300 text-2xl md:text-3xl capitalize drop-shadow-lg">
          {blockName}
        </p>
      </div>
    </div>
  );
}
