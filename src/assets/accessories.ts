// ═══════════════════════════════════════════════════════════
// Sistema de Acessórios
// ═══════════════════════════════════════════════════════════

export type AccessorySlot = 'ring' | 'amulet' | 'belt' | 'glove';

export type AccessoryRarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário' | 'Mítico';

export type AccessoryEffectType =
  // ── Efeitos Implementados ──
  | 'automation_surge'      // Chance de dobrar velocidade idle
  | 'resource_explosion'    // Chance de 100x clique
  | 'bouncy_click'          // 1-4 cliques extras
  | 'crit_chance'           // Aumenta chance de crítico
  | 'greed_bar'             // Barra de ganância → bônus
  | 'luck_boost'            // +% a todas chances RNG
  | 'echo_resource'         // Chance de dobrar recurso após delay
  | 'double_capacity'       // Dobra capacidade de inventário
  | 'session_scaler'        // Multiplicador escala com tempo de sessão
  | 'combo_slow_decay'      // Combo decai mais lentamente
  | 'passive_click_power'   // % do poder de clique gerado passivamente
  | 'upgrade_discount'      // Desconto surpresa em upgrades
  | 'negate_negative'       // Anula eventos negativos
  | 'burst_clicks'          // Cliques rápidos = explosão de produção
  | 'attract_bonuses'       // Dobra ganhos de eventos
  | 'fortune_roll'          // 20% 2x, 5% 3x, 1% 4x drop
  | 'auto_click_burst'      // Auto-clique 3s + cooldown
  | 'fire_dot'              // Dano contínuo após cliques rápidos
  | 'silence_charge'        // Energia acumula sem clicar
  | 'oxidation'             // Muda com uso: crítico→dano base
  // ── Placeholder (sem efeito mecânico ainda) ──
  | 'passive_placeholder';

export interface Accessory {
  id: string;
  name: string;
  slot: AccessorySlot;
  emoji: string;
  rarity: AccessoryRarity;
  effectName: string;
  effectDescription: string;
  effectType: AccessoryEffectType;
  effectParams: Record<string, number>;
}

export const rarityColors: Record<AccessoryRarity, { bg: string; border: string; text: string; glow: string }> = {
  Comum:    { bg: 'bg-stone-500/10', border: 'border-stone-400/30', text: 'text-stone-300', glow: '' },
  Incomum:  { bg: 'bg-green-500/10', border: 'border-green-400/30', text: 'text-green-400', glow: '' },
  Raro:     { bg: 'bg-blue-500/10', border: 'border-blue-400/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  Épico:    { bg: 'bg-purple-500/10', border: 'border-purple-400/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  Lendário: { bg: 'bg-amber-500/10', border: 'border-amber-400/30', text: 'text-amber-400', glow: 'shadow-amber-500/30' },
  Mítico:   { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-400/30', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/30' },
};

// ═══════════════════════════════════════════════════════════
// ANÉIS
// ═══════════════════════════════════════════════════════════

export const allAccessories: Accessory[] = [
  // ── Anéis ────────────────────────────────────────────────
  {
    id: 'ring_redstone', name: 'Anel de Redstone', slot: 'ring', emoji: '💍',
    rarity: 'Comum', effectName: 'Sobrecarga de Automação',
    effectDescription: '5% de chance por clique de dobrar velocidade idle por 10s.',
    effectType: 'automation_surge', effectParams: { chance: 0.05, duration: 10000, multiplier: 2 },
  },
  {
    id: 'ring_creeper', name: 'Anel do Creeper', slot: 'ring', emoji: '💥',
    rarity: 'Épico', effectName: 'Detonação de Recursos',
    effectDescription: '1% de chance por clique de coletar 100 cliques de uma só vez.',
    effectType: 'resource_explosion', effectParams: { chance: 0.01, clicks: 100 },
  },
  {
    id: 'ring_lapis', name: 'Anel de Lápis-Lazúli', slot: 'ring', emoji: '🔵',
    rarity: 'Raro', effectName: 'Sorte do Encantador',
    effectDescription: 'Chance passiva de upgrades custarem 50% menos.',
    effectType: 'upgrade_discount', effectParams: { chance: 0.15, discount: 0.5 },
  },
  {
    id: 'ring_slime', name: 'Anel de Slime', slot: 'ring', emoji: '🟢',
    rarity: 'Comum', effectName: 'Clique Saltitante',
    effectDescription: 'Cada clique tem chance de gerar 1 a 4 cliques extras.',
    effectType: 'bouncy_click', effectParams: { chance: 0.15, minExtra: 1, maxExtra: 4 },
  },
  {
    id: 'ring_enderman', name: 'Anel do Enderman', slot: 'ring', emoji: '🟣',
    rarity: 'Lendário', effectName: 'Salto Temporal',
    effectDescription: '0.1% de chance de conceder 1 hora de produção ociosa.',
    effectType: 'passive_placeholder', effectParams: { chance: 0.001 },
  },
  {
    id: 'ring_villager', name: 'Anel do Aldeão', slot: 'ring', emoji: '🤎',
    rarity: 'Raro', effectName: 'Pechincha Esmeralda',
    effectDescription: 'Periodicamente reduz o custo do upgrade mais caro por 15s.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'ring_copper', name: 'Anel de Cobre', slot: 'ring', emoji: '🟤',
    rarity: 'Incomum', effectName: 'Oxidação',
    effectDescription: '+200% clique nos primeiros 5 min, depois +200% idle.',
    effectType: 'oxidation', effectParams: { clickBonus: 2, idleBonus: 2, transitionTime: 300000 },
  },
  {
    id: 'ring_warden', name: 'Anel do Warden', slot: 'ring', emoji: '🖤',
    rarity: 'Épico', effectName: 'Silêncio Profundo',
    effectDescription: 'Desativa idle, mas clique manual vale 50x mais.',
    effectType: 'passive_placeholder', effectParams: { clickMultiplier: 50 },
  },
  {
    id: 'ring_magma', name: 'Anel de Magma', slot: 'ring', emoji: '🔥',
    rarity: 'Raro', effectName: 'Combustão Contínua',
    effectDescription: 'Críticos deixam tela em chamas, gerando recursos passivos por 5s.',
    effectType: 'fire_dot', effectParams: { duration: 5000, percent: 1 },
  },
  {
    id: 'ring_spider', name: 'Anel da Teia', slot: 'ring', emoji: '🕸️',
    rarity: 'Incomum', effectName: 'Bônus Preso',
    effectDescription: 'Multiplica duração de buffs temporários por 2x.',
    effectType: 'passive_placeholder', effectParams: { durationMultiplier: 2 },
  },
  {
    id: 'ring_skeleton', name: 'Anel do Esqueleto', slot: 'ring', emoji: '💀',
    rarity: 'Raro', effectName: 'Precisão Perfurante',
    effectDescription: 'Chance de crítico aleatória entre 5% e 25% ao abrir o jogo.',
    effectType: 'crit_chance', effectParams: { minChance: 0.05, maxChance: 0.25 },
  },
  {
    id: 'ring_wither', name: 'Anel do Wither', slot: 'ring', emoji: '☠️',
    rarity: 'Épico', effectName: 'Drenagem Sombria',
    effectDescription: 'Drena 5% recursos/s, mas triplica chance de baús.',
    effectType: 'passive_placeholder', effectParams: { drain: 0.05, chestMultiplier: 3 },
  },
  {
    id: 'ring_totem', name: 'Anel do Totem', slot: 'ring', emoji: '🛡️',
    rarity: 'Lendário', effectName: 'Imortalidade Financeira',
    effectDescription: 'Se recursos chegarem a zero, recupera 25% do último gasto.',
    effectType: 'passive_placeholder', effectParams: { recovery: 0.25 },
  },
  {
    id: 'ring_obsidian', name: 'Anel de Obsidiana', slot: 'ring', emoji: '⬛',
    rarity: 'Épico', effectName: 'Resistência a Eventos',
    effectDescription: 'Imune a eventos negativos, converte em cliques grátis.',
    effectType: 'negate_negative', effectParams: {},
  },
  {
    id: 'ring_gold', name: 'Anel de Ouro', slot: 'ring', emoji: '✨',
    rarity: 'Lendário', effectName: 'Frenesi do Piglin',
    effectDescription: 'Cliques rápidos enchem barra de ganância → pepitas de ouro.',
    effectType: 'greed_bar', effectParams: { fillRate: 0.02, decayRate: 0.01, rewardMultiplier: 50 },
  },
  {
    id: 'ring_netherite', name: 'Anel de Netherite', slot: 'ring', emoji: '🖤',
    rarity: 'Mítico', effectName: 'Forja Indestrutível',
    effectDescription: 'Ao dar Prestige, mantém um gerador aleatório.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'ring_quartz', name: 'Anel de Quartzo', slot: 'ring', emoji: '🤍',
    rarity: 'Raro', effectName: 'Bateria do Nether',
    effectDescription: '+500% coleta offline, mas reduz velocidade quando ativo.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'ring_notch', name: 'Anel da Maçã Dourada Encantada', slot: 'ring', emoji: '🍎',
    rarity: 'Mítico', effectName: 'Regeneração Divina',
    effectDescription: 'A cada 10.000 cliques, próximos 10 upgrades são grátis.',
    effectType: 'passive_placeholder', effectParams: { clicksNeeded: 10000, freeUpgrades: 10 },
  },
  {
    id: 'ring_ice', name: 'Anel de Gelo Compactado', slot: 'ring', emoji: '🧊',
    rarity: 'Incomum', effectName: 'Deslizamento Rápido',
    effectDescription: 'Reduz cooldown de habilidades em 10-40%.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'ring_nether_star', name: 'Anel da Estrela do Nether', slot: 'ring', emoji: '⭐',
    rarity: 'Mítico', effectName: 'Sinalizador',
    effectDescription: 'Buff aleatório que muda a cada minuto.',
    effectType: 'passive_placeholder', effectParams: {},
  },

  // ── Amuletos ─────────────────────────────────────────────
  {
    id: 'amulet_ghast', name: 'Amuleto da Lágrima de Ghast', slot: 'amulet', emoji: '😢',
    rarity: 'Raro', effectName: 'Melancolia Produtiva',
    effectDescription: 'Produção passiva ganha 1.5x-3x se não clicar por 1 minuto.',
    effectType: 'session_scaler', effectParams: { minMultiplier: 1.5, maxMultiplier: 3, idleTime: 60000 },
  },
  {
    id: 'amulet_heart', name: 'Amuleto do Coração do Mar', slot: 'amulet', emoji: '💙',
    rarity: 'Épico', effectName: 'Maré de Recursos',
    effectDescription: '10% de chance de arredondar upgrades para baixo.',
    effectType: 'upgrade_discount', effectParams: { chance: 0.1, discount: 0.05 },
  },
  {
    id: 'amulet_ender', name: 'Amuleto da Pérola do Fim', slot: 'amulet', emoji: '🟢',
    rarity: 'Épico', effectName: 'Teleporte de Produção',
    effectDescription: 'Em intervalos (5-20 min), avança idle em 30 min.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'amulet_rabbit', name: 'Amuleto do Pé de Coelho', slot: 'amulet', emoji: '🐰',
    rarity: 'Raro', effectName: 'Sorte Pura',
    effectDescription: '+7.77% em todas as chances RNG do jogo.',
    effectType: 'luck_boost', effectParams: { bonus: 0.0777 },
  },
  {
    id: 'amulet_amethyst', name: 'Amuleto da Ametista', slot: 'amulet', emoji: '🔮',
    rarity: 'Épico', effectName: 'Eco Cristalino',
    effectDescription: '5% de chance de repetir o recurso gerado após 3s.',
    effectType: 'echo_resource', effectParams: { chance: 0.05, delay: 3000 },
  },
  {
    id: 'amulet_clock', name: 'Amuleto do Relógio de Ouro', slot: 'amulet', emoji: '⏰',
    rarity: 'Raro', effectName: 'Distorção de Ticks',
    effectDescription: 'Geradores produzem 20% mais rápido.',
    effectType: 'passive_placeholder', effectParams: { speedBonus: 0.2 },
  },
  {
    id: 'amulet_lightning', name: 'Amuleto do Para-raios', slot: 'amulet', emoji: '⚡',
    rarity: 'Épico', effectName: 'Atração de Tempestades',
    effectDescription: 'Atrai bônus e 50% de chance de vir em dobro.',
    effectType: 'attract_bonuses', effectParams: { doubleChance: 0.5 },
  },
  {
    id: 'amulet_elytra', name: 'Amuleto de Elytra', slot: 'amulet', emoji: '🪽',
    rarity: 'Mítico', effectName: 'Voo de Ascensão',
    effectDescription: '+10-40% bônus na moeda de prestige.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'amulet_shulker', name: 'Amuleto do Shulker', slot: 'amulet', emoji: '📦',
    rarity: 'Lendário', effectName: 'Bolso Dimensional',
    effectDescription: 'Dobra a capacidade máxima do inventário.',
    effectType: 'double_capacity', effectParams: { multiplier: 2 },
  },
  {
    id: 'amulet_honeycomb', name: 'Amuleto do Favo de Mel', slot: 'amulet', emoji: '🍯',
    rarity: 'Incomum', effectName: 'Combo Pegajoso',
    effectDescription: 'Combo de cliques decai 3x mais lentamente.',
    effectType: 'combo_slow_decay', effectParams: { decayMultiplier: 3 },
  },
  {
    id: 'amulet_phantom', name: 'Amuleto do Phantom', slot: 'amulet', emoji: '👻',
    rarity: 'Raro', effectName: 'Insônia Lucrativa',
    effectDescription: 'Multiplicador idle escala com tempo de sessão.',
    effectType: 'session_scaler', effectParams: { minMultiplier: 1, maxMultiplier: 5, scalePerMinute: 0.01 },
  },
  {
    id: 'amulet_corrupted', name: 'Amuleto Corrompido', slot: 'amulet', emoji: '🕷️',
    rarity: 'Épico', effectName: 'Inversão de Status',
    effectDescription: 'Transforma debuffs em bônus 2x.',
    effectType: 'negate_negative', effectParams: { convertMultiplier: 2 },
  },
  {
    id: 'amulet_nautilus', name: 'Amuleto da Concha de Nautilus', slot: 'amulet', emoji: '🐚',
    rarity: 'Raro', effectName: 'Tesouro das Profundezas',
    effectDescription: 'A cada 1.000 cliques, pesca um item consumível aleatório.',
    effectType: 'passive_placeholder', effectParams: { clicksNeeded: 1000 },
  },
  {
    id: 'amulet_blaze', name: 'Amuleto do Blaze', slot: 'amulet', emoji: '🔥',
    rarity: 'Lendário', effectName: 'Frenesi Incandescente',
    effectDescription: 'Nível máximo de gerador → dobra velocidade permanente.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'amulet_golden_carrot', name: 'Amuleto da Cenoura Dourada', slot: 'amulet', emoji: '🥕',
    rarity: 'Épico', effectName: 'Visão Noturna Financeira',
    effectDescription: 'Revela upgrades ocultos na loja temporariamente.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'amulet_iron_rose', name: 'Amuleto do Golem de Ferro', slot: 'amulet', emoji: '🌹',
    rarity: 'Raro', effectName: 'Proteção de Base',
    effectDescription: 'Produção nunca cai abaixo de 50% do recorde.',
    effectType: 'passive_placeholder', effectParams: { floor: 0.5 },
  },
  {
    id: 'amulet_bone_meal', name: 'Amuleto de Pó de Osso', slot: 'amulet', emoji: '🦴',
    rarity: 'Lendário', effectName: 'Crescimento Instantâneo',
    effectDescription: 'Novo gerador pula para nível 5 grátis.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'amulet_dragon', name: 'Amuleto do Ovo de Dragão', slot: 'amulet', emoji: '🥚',
    rarity: 'Mítico', effectName: 'Presença Ancestral',
    effectDescription: '+1% poder por conquista, variando ±0.5% por RNG.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'amulet_prismarine', name: 'Amuleto de Prismarinho', slot: 'amulet', emoji: '🌊',
    rarity: 'Épico', effectName: 'Guardião Ancião',
    effectDescription: 'Cliques -80%, mas geradores fracos recebem prod do mais forte.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'amulet_recovery', name: 'Amuleto da Bússola de Recuperação', slot: 'amulet', emoji: '🧭',
    rarity: 'Mítico', effectName: 'Eco da Morte',
    effectDescription: 'Offline usa seu pico de CPS da sessão anterior.',
    effectType: 'passive_placeholder', effectParams: {},
  },

  // ── Cintos ───────────────────────────────────────────────
  {
    id: 'belt_hopper', name: 'Cinto de Funil', slot: 'belt', emoji: '⬇️',
    rarity: 'Comum', effectName: 'Coleta Periférica',
    effectDescription: 'Gera 10% do poder de clique por segundo passivamente.',
    effectType: 'passive_click_power', effectParams: { percent: 0.1 },
  },
  {
    id: 'belt_saddle', name: 'Cinto da Sela', slot: 'belt', emoji: '🐴',
    rarity: 'Incomum', effectName: 'Ritmo de Cavalgada',
    effectDescription: 'Ritmo constante de cliques aumenta rendimento progressivamente.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_chainmail', name: 'Cinto de Cota de Malha', slot: 'belt', emoji: '⛓️',
    rarity: 'Raro', effectName: 'Amortecimento de Custos',
    effectDescription: 'Desconto surpresa de 1-15% em compras de upgrades.',
    effectType: 'upgrade_discount', effectParams: { chance: 0.25, minDiscount: 0.01, maxDiscount: 0.15 },
  },
  {
    id: 'belt_shulker', name: 'Cinto de Shulker Box', slot: 'belt', emoji: '📦',
    rarity: 'Épico', effectName: 'Inventário de Vantagens',
    effectDescription: 'Pode guardar até 3 buffs temporários para usar depois.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_tnt', name: 'Cinto de TNT', slot: 'belt', emoji: '🧨',
    rarity: 'Épico', effectName: 'Pavio Curto',
    effectDescription: '50 cliques em 5s → explosão 10x no produtor mais forte.',
    effectType: 'burst_clicks', effectParams: { clicksNeeded: 50, timeWindow: 5000, multiplier: 10, duration: 60000 },
  },
  {
    id: 'belt_brewing', name: 'Cinto do Suporte de Poções', slot: 'belt', emoji: '⚗️',
    rarity: 'Raro', effectName: 'Mistura Instável',
    effectDescription: 'A cada 30 min, efeito forte caótico (+500% ou -50%).',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_thorns', name: 'Cinto de Espinhos', slot: 'belt', emoji: '🌵',
    rarity: 'Épico', effectName: 'Retaliação Econômica',
    effectDescription: 'Anula eventos negativos e devolve em dobro.',
    effectType: 'negate_negative', effectParams: { reflectMultiplier: 2 },
  },
  {
    id: 'belt_composter', name: 'Cinto da Composteira', slot: 'belt', emoji: '♻️',
    rarity: 'Incomum', effectName: 'Reciclagem Orgânica',
    effectDescription: 'Geradores básicos dão multiplicador 1.1-2x ao melhor gerador.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_chorus', name: 'Cinto de Chorus', slot: 'belt', emoji: '🍇',
    rarity: 'Mítico', effectName: 'Teleporte de Preços',
    effectDescription: '0.05% por clique de trocar preço mais caro pelo mais barato.',
    effectType: 'passive_placeholder', effectParams: { chance: 0.0005 },
  },
  {
    id: 'belt_bartering', name: 'Cinto de Ouro dos Piglins', slot: 'belt', emoji: '🐷',
    rarity: 'Raro', effectName: 'Escambo Compulsivo',
    effectDescription: 'Gasta recursos passivamente, mas dá loot boxes.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_powder_snow', name: 'Cinto de Neve Fofa', slot: 'belt', emoji: '❄️',
    rarity: 'Incomum', effectName: 'Congelamento de Combo',
    effectDescription: 'Combo demora 3x mais para decair.',
    effectType: 'combo_slow_decay', effectParams: { decayMultiplier: 3 },
  },
  {
    id: 'belt_sculk', name: 'Cinto de Sculk', slot: 'belt', emoji: '🟫',
    rarity: 'Lendário', effectName: 'Absorção Sônica',
    effectDescription: 'Comprar upgrades carrega energia. 100 cargas = 10 min de idle.',
    effectType: 'passive_placeholder', effectParams: { maxCharges: 100 },
  },
  {
    id: 'belt_repeater', name: 'Cinto do Repetidor de Redstone', slot: 'belt', emoji: '🔴',
    rarity: 'Raro', effectName: 'Loop de Carga',
    effectDescription: 'A cada 10 cliques, 5% de chance de repetir 15x em 1s.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_cobweb', name: 'Cinto de Teia', slot: 'belt', emoji: '🕸️',
    rarity: 'Incomum', effectName: 'Desaceleração Temporal',
    effectDescription: 'Buffs temporários duram 1.5-2.5x mais.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_lodestone', name: 'Cinto Magnético de Magnetita', slot: 'belt', emoji: '🧲',
    rarity: 'Lendário', effectName: 'Centro de Gravidade',
    effectDescription: 'Atrai bônus e dobra ganhos de eventos clicáveis.',
    effectType: 'attract_bonuses', effectParams: { multiplier: 2 },
  },
  {
    id: 'belt_ominous', name: 'Cinto do Estandarte', slot: 'belt', emoji: '🏴',
    rarity: 'Épico', effectName: 'Mau Presságio',
    effectDescription: '-20% idle, mas próximo baú terá raridade máxima.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_honey', name: 'Cinto de Bloco de Mel', slot: 'belt', emoji: '🍯',
    rarity: 'Raro', effectName: 'Retenção Pegajosa',
    effectDescription: 'Excesso de recursos no limite → pontos de Prestige.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_waxed_copper', name: 'Cinto de Cobre Encerrado', slot: 'belt', emoji: '🟫',
    rarity: 'Mítico', effectName: 'Trava de Multiplicador',
    effectDescription: '2% de chance de tornar buff temporário permanente.',
    effectType: 'passive_placeholder', effectParams: { chance: 0.02 },
  },
  {
    id: 'belt_ender', name: 'Cinto do Ender Chest', slot: 'belt', emoji: '🟪',
    rarity: 'Mítico', effectName: 'Bolso Dimensional Seguro',
    effectDescription: 'Guarda 1-5% da produção, mantém após Prestige.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'belt_bamboo', name: 'Cinto de Bambu', slot: 'belt', emoji: '🎋',
    rarity: 'Incomum', effectName: 'Crescimento Contínuo',
    effectDescription: 'Poder de clique +0.1% por minuto (reseta ao fechar).',
    effectType: 'session_scaler', effectParams: { scalePerMinute: 0.001 },
  },

  // ── Luvas ────────────────────────────────────────────────
  {
    id: 'glove_silk', name: 'Luvas de Seda', slot: 'glove', emoji: '🧤',
    rarity: 'Incomum', effectName: 'Toque Suave',
    effectDescription: 'Remove penalidades de fadiga de outros itens.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_skeleton', name: 'Luvas de Esqueleto', slot: 'glove', emoji: '💀',
    rarity: 'Incomum', effectName: 'Tiro de Longa Distância',
    effectDescription: 'Aumenta alcance efetivo do clique.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_spider', name: 'Luvas de Aranha', slot: 'glove', emoji: '🕷️',
    rarity: 'Incomum', effectName: 'Escalada de Progresso',
    effectDescription: 'A cada 10 cliques, bônus de XP/nível em gerador aleatório.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_sheep', name: 'Luvas de Ovelha', slot: 'glove', emoji: '🐑',
    rarity: 'Comum', effectName: 'Colheita Macia',
    effectDescription: '-5% custo upgrades, +10% custo de reset/prestige.',
    effectType: 'upgrade_discount', effectParams: { discount: 0.05 },
  },
  {
    id: 'glove_iron_golem', name: 'Luvas de Golem de Ferro', slot: 'glove', emoji: '🤖',
    rarity: 'Raro', effectName: 'Força Bruta',
    effectDescription: '+10% poder de clique, -5% produção passiva.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_slime', name: 'Luvas de Slime', slot: 'glove', emoji: '🟢',
    rarity: 'Comum', effectName: 'Salto de Produção',
    effectDescription: 'A cada 5 cliques, 2% de chance de dobrar próximo recurso.',
    effectType: 'bouncy_click', effectParams: { chance: 0.02, interval: 5 },
  },
  {
    id: 'glove_blaze', name: 'Luvas de Blaze', slot: 'glove', emoji: '🔥',
    rarity: 'Raro', effectName: 'Calor Intenso',
    effectDescription: '+produção fogo/energia, -produção água/gelo.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_ghast', name: 'Luvas de Ghast', slot: 'glove', emoji: '😢',
    rarity: 'Raro', effectName: 'Lágrima Ácida',
    effectDescription: '1% de chance de recursos extras, mas pode danificar geradores.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_enderman', name: 'Luvas de Enderman', slot: 'glove', emoji: '🟣',
    rarity: 'Épico', effectName: 'Teletransporte de Recursos',
    effectDescription: '5% de chance de duplicar bônus de upgrade em outro gerador.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_ender_pearl', name: 'Luvas de Pérola do Fim', slot: 'glove', emoji: '🟢',
    rarity: 'Épico', effectName: 'Salto de Inventário',
    effectDescription: 'Armazena 2x mais de um recurso específico.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_heart_sea', name: 'Luvas do Coração do Mar', slot: 'glove', emoji: '💙',
    rarity: 'Épico', effectName: 'Maré de Sorte',
    effectDescription: '+5% itens raros, -2% recursos básicos.',
    effectType: 'luck_boost', effectParams: { bonus: 0.05 },
  },
  {
    id: 'glove_nautilus', name: 'Luvas de Concha de Nautilus', slot: 'glove', emoji: '🐚',
    rarity: 'Raro', effectName: 'Pesca de Bônus',
    effectDescription: 'A cada 100 cliques, pesca um consumível aleatório.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_shulker', name: 'Luvas de Shulker', slot: 'glove', emoji: '📦',
    rarity: 'Raro', effectName: 'Bolso Secreto',
    effectDescription: '-3% custo upgrades, +3% produção passiva.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_wither', name: 'Luvas de Fogo Fátuo', slot: 'glove', emoji: '☠️',
    rarity: 'Épico', effectName: 'Aura de Decadência',
    effectDescription: '+10% todos geradores, -5% geradores fracos.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  // Gem gloves (placeholder batch)
  {
    id: 'glove_light', name: 'Luvas de Gema de Luz', slot: 'glove', emoji: '☀️',
    rarity: 'Raro', effectName: 'Brilho Celestial',
    effectDescription: '+5% todos geradores, +5% eventos positivos.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_dark', name: 'Luvas de Gema de Escuridão', slot: 'glove', emoji: '🌑',
    rarity: 'Raro', effectName: 'Sombra Oculta',
    effectDescription: '+10% geradores escuridão, -5% geradores luz.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_life', name: 'Luvas de Gema de Vida', slot: 'glove', emoji: '💚',
    rarity: 'Épico', effectName: 'Pulso Vital',
    effectDescription: 'A cada 10 cliques, +5% todos geradores por 10s.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_time', name: 'Luvas de Gema de Tempo', slot: 'glove', emoji: '⏳',
    rarity: 'Épico', effectName: 'Aceleração Temporal',
    effectDescription: '+5% todos geradores, -5% tempo entre eventos.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  // ── Luvas com efeitos implementados ──
  {
    id: 'glove_iron_golem_heavy', name: 'Luva de Ferro do Golem', slot: 'glove', emoji: '🦾',
    rarity: 'Lendário', effectName: 'Impacto Pesado',
    effectDescription: 'Max 2 cliques/s, mas cada clique vale 50-100x.',
    effectType: 'passive_placeholder', effectParams: { minMultiplier: 50, maxMultiplier: 100 },
  },
  {
    id: 'glove_fortune', name: 'Luva do Encantador', slot: 'glove', emoji: '🍀',
    rarity: 'Raro', effectName: 'Toque da Fortuna',
    effectDescription: '20% chance 2x, 5% chance 3x, 1% chance 4x drop.',
    effectType: 'fortune_roll', effectParams: { double: 0.20, triple: 0.05, quad: 0.01 },
  },
  {
    id: 'glove_silk_touch', name: 'Luva de Toque Suave', slot: 'glove', emoji: '✋',
    rarity: 'Épico', effectName: 'Colheita Pura',
    effectDescription: '0.5% chance de extrair moeda premium em vez de recurso.',
    effectType: 'passive_placeholder', effectParams: { chance: 0.005 },
  },
  {
    id: 'glove_redstone', name: 'Luva de Redstone', slot: 'glove', emoji: '🔴',
    rarity: 'Raro', effectName: 'Curto-Circuito',
    effectDescription: 'Segurar clique → auto-clique 3s, cooldown 10-30s.',
    effectType: 'auto_click_burst', effectParams: { duration: 3000, minCooldown: 10000, maxCooldown: 30000 },
  },
  {
    id: 'glove_magma', name: 'Luva de Creme de Magma', slot: 'glove', emoji: '🟠',
    rarity: 'Épico', effectName: 'Dano Contínuo',
    effectDescription: 'Cliques rápidos → 20% do poder passivo por 5s.',
    effectType: 'fire_dot', effectParams: { percent: 0.2, duration: 5000 },
  },
  {
    id: 'glove_slimeball', name: 'Luva Pegajosa de Slime', slot: 'glove', emoji: '💚',
    rarity: 'Incomum', effectName: 'Clique Ricochete',
    effectDescription: 'Clique ativa 1-3 geradores passivos instantaneamente.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_sweeping', name: 'Luva da Lâmina Arrasadora', slot: 'glove', emoji: '⚔️',
    rarity: 'Raro', effectName: 'Varredura de Tela',
    effectDescription: '15% de chance de coletar todos bônus na tela.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_sculk', name: 'Luva de Sculk', slot: 'glove', emoji: '🟫',
    rarity: 'Lendário', effectName: 'Energia Acumulada',
    effectDescription: 'Sem clicar, acumula energia. Próximo clique até 500x.',
    effectType: 'silence_charge', effectParams: { maxMultiplier: 500, chargePerSecond: 5 },
  },
  {
    id: 'glove_copper', name: 'Luva de Cobre', slot: 'glove', emoji: '🟤',
    rarity: 'Incomum', effectName: 'Condutividade Oxidante',
    effectDescription: '50% crítico inicial, perde 10% a cada 1000 cliques, ganha dano base.',
    effectType: 'oxidation', effectParams: { initialCrit: 0.5, decayPer1000: 0.1, baseDamageGain: 1 },
  },
  {
    id: 'glove_emerald', name: 'Luva do Aldeão', slot: 'glove', emoji: '💎',
    rarity: 'Incomum', effectName: 'Mão Aberta',
    effectDescription: '0.1% chance por clique de ganhar +1 nível no gerador mais barato.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_prismarine', name: 'Luva do Guardião Ancião', slot: 'glove', emoji: '🌊',
    rarity: 'Épico', effectName: 'Fadiga Categórica',
    effectDescription: '-50% clique, mas 5% chance de Laser 100x por 3s.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_blaze_combo', name: 'Luva Incandescente', slot: 'glove', emoji: '🔥',
    rarity: 'Raro', effectName: 'Combo em Chamas',
    effectDescription: 'Cliques em <0.5s aumentam multiplicador em +0.1x.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_honey', name: 'Luva de Favo de Mel', slot: 'glove', emoji: '🍯',
    rarity: 'Incomum', effectName: 'Arrastar e Soltar',
    effectDescription: 'Arrastar cursor → cada 100px = clique com bônus.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_obsidian', name: 'Luva de Obsidiana', slot: 'glove', emoji: '⬛',
    rarity: 'Lendário', effectName: 'Densidade Máxima',
    effectDescription: 'Máx 1 clique/s, mas todo clique é crítico garantido.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_ghast_tear', name: 'Luva Fantasmal', slot: 'glove', emoji: '👻',
    rarity: 'Épico', effectName: 'Clique Intangível',
    effectDescription: 'Ignora debuffs e gera +50% bônus durante eles.',
    effectType: 'negate_negative', effectParams: { bonus: 0.5 },
  },
  {
    id: 'glove_phantom', name: 'Luva de Phantom', slot: 'glove', emoji: '🦇',
    rarity: 'Raro', effectName: 'Insônia Ativa',
    effectDescription: 'Clique escala com tempo de sessão aberta.',
    effectType: 'session_scaler', effectParams: { scalePerMinute: 0.005 },
  },
  {
    id: 'glove_shulker_lev', name: 'Luva de Shulker', slot: 'glove', emoji: '📦',
    rarity: 'Épico', effectName: 'Levitação de Lucros',
    effectDescription: '10% chance de recurso flutuar, clicar nele = 10x.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_netherite', name: 'Manopla de Netherite', slot: 'glove', emoji: '🖤',
    rarity: 'Mítico', effectName: 'Imune à Lava',
    effectDescription: '15% chance de reverter upgrade errado e devolver recursos.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_totem', name: 'Luva do Totem', slot: 'glove', emoji: '🛡️',
    rarity: 'Mítico', effectName: 'Salvação do Dedo',
    effectDescription: 'Ao dar Prestige, leva 5% do poder de clique permanentemente.',
    effectType: 'passive_placeholder', effectParams: {},
  },
  {
    id: 'glove_nether_star', name: 'Luva da Estrela do Nether', slot: 'glove', emoji: '⭐',
    rarity: 'Mítico', effectName: 'Frequência do Sinalizador',
    effectDescription: 'Cada clique buffa geradores em +1% por 5s, acumulável.',
    effectType: 'passive_placeholder', effectParams: {},
  },
];

// Helpers
export function getAccessoriesBySlot(slot: AccessorySlot): Accessory[] {
  return allAccessories.filter(a => a.slot === slot);
}

export function getAccessoryById(id: string): Accessory | undefined {
  return allAccessories.find(a => a.id === id);
}
