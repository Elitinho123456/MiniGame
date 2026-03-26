// ═══════════════════════════════════════════════════════════
// Game Event Types — Tipagem rigorosa para o sistema de mods
// ═══════════════════════════════════════════════════════════

/**
 * Payload emitido quando um bloco é completamente minerado.
 */
export interface BlockMinedEvent {
  blockName: string;
  dimension: string;
  dropName: string | null;
  dropAmount: number;
  toolUsed: string;
  toolTier: number;
  timestamp: number;
}

/**
 * Payload emitido após o cálculo final dos drops de um bloco.
 * Um middleware pode interceptar este evento para modificar a quantidade final.
 */
export interface DropCalculatedEvent {
  blockName: string;
  baseDrop: string | null;
  baseAmount: number;
  finalAmount: number;
  modifiers: {
    upgradeBonus: number;
    potionMultiplier: number;
    petBonus: number;
    rebirthBonus: number;
    eventMultiplier: number;
    fortuneMultiplier: number;
    accessoryMultiplier: number;
  };
}

/**
 * Payload emitido quando uma entidade (pet ou baú) aparece.
 */
export interface EntitySpawnEvent {
  entityType: 'pet' | 'chest';
  entityId: string;
  entityName: string;
  rarity: string;
  context: Record<string, unknown>;
}

/**
 * Payload emitido quando o jogador muda de dimensão ou bloco alvo.
 */
export interface PlayerMoveEvent {
  from: { dimension: string; block: string };
  to: { dimension: string; block: string };
}

/**
 * Payload emitido quando o inventário é alterado.
 */
export interface InventoryChangedEvent {
  item: string;
  delta: number;
  newTotal: number;
  source: 'mining' | 'crafting' | 'furnace' | 'idle' | 'shop' | 'chest' | 'event' | 'debug' | 'rebirth';
}

/**
 * Payload emitido quando uma ferramenta quebra.
 */
export interface ToolBrokenEvent {
  toolType: string;
  toolTier: number;
  toolName: string;
}

/**
 * Payload emitido quando um craft é concluído.
 */
export interface CraftCompletedEvent {
  itemName: string;
  amount: number;
  isToolUpgrade: boolean;
  toolCategory?: string;
  toolTier?: number;
}

/**
 * Payload emitido quando o jogador faz rebirth.
 */
export interface RebirthPerformedEvent {
  rebirthCount: number;
  shardsEarned: number;
  previousPickaxeLevel: number;
  previousCoins: number;
}

/**
 * Mapa de todos os eventos do jogo.
 * Cada chave é o nome do evento, cada valor é o tipo do payload.
 */
export interface GameEventMap {
  onBlockMined: BlockMinedEvent;
  onDropCalculated: DropCalculatedEvent;
  onEntitySpawn: EntitySpawnEvent;
  onPlayerMove: PlayerMoveEvent;
  onInventoryChanged: InventoryChangedEvent;
  onToolBroken: ToolBrokenEvent;
  onCraftCompleted: CraftCompletedEvent;
  onRebirthPerformed: RebirthPerformedEvent;
}

/** Nome de qualquer evento do jogo */
export type GameEventName = keyof GameEventMap;

/** Handler genérico de evento */
export type GameEventHandler<K extends GameEventName> = (payload: GameEventMap[K]) => void;

/**
 * Middleware que pode interceptar um evento antes dos listeners.
 * Retorna o payload (possivelmente modificado) ou `null` para cancelar o evento.
 */
export type GameEventMiddleware<K extends GameEventName> = (
  payload: GameEventMap[K],
) => GameEventMap[K] | null;
