import type {
  GameEventMap,
  GameEventName,
  GameEventHandler,
  GameEventMiddleware,
} from './types';

// ═══════════════════════════════════════════════════════════
// GameEventBus — Sistema de eventos com suporte a Middleware
// ═══════════════════════════════════════════════════════════

class GameEventBus {
  private listeners = new Map<GameEventName, Set<GameEventHandler<never>>>();
  private middlewares = new Map<GameEventName, GameEventMiddleware<never>[]>();
  private debugMode = false;

  /**
   * Ativa/desativa logs de debug no console para todos os eventos emitidos.
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Registra um listener para um evento específico.
   *
   * @example
   * eventBus.on('onBlockMined', (payload) => {
   *   console.log(`Bloco ${payload.blockName} minerado!`);
   * });
   */
  on<K extends GameEventName>(event: K, handler: GameEventHandler<K>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as GameEventHandler<never>);
  }

  /**
   * Remove um listener previamente registrado.
   */
  off<K extends GameEventName>(event: K, handler: GameEventHandler<K>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler as GameEventHandler<never>);
    }
  }

  /**
   * Registra um middleware que intercepta o evento ANTES dos listeners.
   * Middlewares são executados na ordem de registro.
   * Se um middleware retornar `null`, o evento é cancelado (nenhum listener roda).
   * O middleware pode modificar o payload retornando uma versão alterada.
   *
   * @example
   * // Mod que dobra todos os drops
   * eventBus.use('onDropCalculated', (payload) => ({
   *   ...payload,
   *   finalAmount: payload.finalAmount * 2,
   * }));
   *
   * // Mod que bloqueia mineração no Nether
   * eventBus.use('onBlockMined', (payload) => {
   *   if (payload.dimension === 'Nether') return null; // cancela
   *   return payload;
   * });
   */
  use<K extends GameEventName>(event: K, middleware: GameEventMiddleware<K>): () => void {
    if (!this.middlewares.has(event)) {
      this.middlewares.set(event, []);
    }
    this.middlewares.get(event)!.push(middleware as unknown as GameEventMiddleware<never>);

    // Retorna uma função de cleanup para remover o middleware
    return () => {
      const mws = this.middlewares.get(event);
      if (mws) {
        const index = mws.indexOf(middleware as unknown as GameEventMiddleware<never>);
        if (index !== -1) mws.splice(index, 1);
      }
    };
  }

  /**
   * Emite um evento. O payload passa por todos os middlewares registrados.
   * Se nenhum middleware cancelar, todos os listeners são notificados.
   *
   * @returns O payload final (possivelmente modificado por middlewares) ou `null` se cancelado.
   */
  emit<K extends GameEventName>(event: K, payload: GameEventMap[K]): GameEventMap[K] | null {
    // Executar middlewares na ordem
    const middlewareChain = this.middlewares.get(event) as GameEventMiddleware<K>[] | undefined;
    let currentPayload: GameEventMap[K] | null = payload;

    if (middlewareChain) {
      for (const mw of middlewareChain) {
        if (currentPayload === null) break;
        currentPayload = mw(currentPayload);
      }
    }

    // Se algum middleware cancelou o evento
    if (currentPayload === null) {
      if (this.debugMode) {
        console.log(`[EventBus] ❌ ${event} CANCELLED by middleware`);
      }
      return null;
    }

    // Debug log
    if (this.debugMode) {
      console.log(`[EventBus] 🎮 ${event}`, currentPayload);
    }

    // Notificar listeners
    const handlers = this.listeners.get(event) as Set<GameEventHandler<K>> | undefined;
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(currentPayload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for ${event}:`, err);
        }
      }
    }

    return currentPayload;
  }

  /**
   * Remove todos os listeners e middlewares de um evento específico.
   */
  clear(event: GameEventName): void {
    this.listeners.delete(event);
    this.middlewares.delete(event);
  }

  /**
   * Remove TODOS os listeners e middlewares.
   */
  clearAll(): void {
    this.listeners.clear();
    this.middlewares.clear();
  }
}

/** Singleton global do Event Bus do jogo */
export const eventBus = new GameEventBus();
