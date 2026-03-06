Update 0.0.6

O sistema de Crafting atual, é um pouco limitado, e não tem muitas opções, portanto, ele será atualizado para ter mais opções e ser mais divertido.

## Atualizações

- [ ] Sistema de Crafting atualizado deverá usar bancadas de trabalho para realizar os craftings.
    - Com recursos como troncos, terão de ser transformados em tábuas.
    - Com tábuas você irá desbloquear a fabricação de uma bancada de trabalho.
    - Com bancada de trabalho você irá desbloquear a fabricação de ferramentas.
    - Ferramentas irão usar stick (palito) e tábuas para serem fabricadas ao invés de troncos.
    - Possibilidade de criar uma fornalha, agora os minérios irão ter que ser derretidos para serem usados. (Ferros, cobre, ouro)
    - Netherite precisará de uma blast fornece para ser derretido e irá gerar scraps que somandos como 4 scraps e 4 barras de ouro geraram a barra de netherita.
    - Adicionar a bancada de ferreiro, bancada do flecheiro, Composteira, bigorna e etc...

- [ ] Sistema da Fornalha deve funcionar assim como no minecraft, com combustivel como carvão e etc

- Adicionar receita para tesoura para possibilitar coleta de folhas.
- adicionar drop chance de drop de maça e gravetos ao quebra folha (lembrando que há a possibilidade de não dropar nada)
- adicionar porcentagem de drop de silax apartir do cascalho (cerca de 10% de chance)

- upgrades aos serem comprados devem sumir ao invés de ficarem opacos
- opção de selecionar o item que quer craftar o que quer, ao invés de ir melhorando uma por uma, você pode selecionar se quer craftar coisas de madeira, pedra, ferro etc...

- quando estiver em alguma aba do componente sidebar se apertar esc deve voltar ao mineração


Implementation Plan
31 minutes ago
View conversation

Review
Update 0.0.6 – Sistema de Crafting & Fornalha
O sistema de crafting atual usa matérias-primas diretamente (ex: "Oak Log" → Picareta). O UpdateLog.md pede uma reformulação completa: troncos devem virar tábuas, tábuas viram palitos, ferramentas usam palitos + tábuas/barras, e uma fornalha derrete minérios brutos em barras usando combustível.

Referência Visual da Fornalha
A imagem de referência do Minecraft mostra o funcionamento clássico da fornalha: slot de entrada (minério bruto), combustível embaixo (carvão/troncos), seta de progresso, e output (barra de cobre). O design do painel seguirá essa mesma lógica.

Referência da Fornalha

Proposed Changes
Novos Itens e Recursos
Itens que serão adicionados ao sistema:

Item	Obtido via	Uso
Oak Planks	Craftar 1 Oak Log → 4 Planks	Base de receitas
Stick	Craftar 2 Planks → 4 Sticks	Cabo de ferramentas
Copper Ingot	Fornalha: Raw Copper → Copper Ingot	Ferramentas de cobre
Iron Ingot	Fornalha: Raw Iron → Iron Ingot	Ferramentas de ferro
Gold Ingot	Fornalha: Raw Gold → Gold Ingot	Ferramentas de ouro
Netherite Scrap	Blast Furnace: Ancient Debris → Scrap	Barra de Netherite
Netherite Ingot	4 Scraps + 4 Gold Ingots	Ferramentas de netherite
Flint	10% drop do Gravel	Receita da fornalha
Shears	Workbench: 2 Iron Ingots	Coleta de folhas
Glass	Fornalha: Sand → Glass	Item decorativo
Apple	Drop chance das folhas	Consumível/venda
Estações de Trabalho (Workstations)
O jogador progride através de estações:

Crafting Manual – Log→Planks, Planks→Sticks (sempre disponível)
Crafting Table – Custo: 4 Oak Planks. Desbloqueia receitas de ferramentas, fornalha, etc.
Furnace – Custo: 8 Cobblestone (via Crafting Table). Derrete minérios usando combustível.
Blast Furnace – Custo: 5 Iron Ingots + 1 Furnace + 3 Cobblestone. Para Netherite.
Componentes Modificados
[MODIFY] 
consts.ts
Novos exports: handRecipes, workbenchRecipes, furnaceRecipes, blastFurnaceRecipes, fuelItems
handRecipes: Log→4 Planks, 2 Planks→4 Sticks
workbenchRecipes: Crafting Table, Furnace, Blast Furnace, Shears, e receitas com barras
furnaceRecipes: Raw Iron→Iron Ingot, Raw Copper→Copper Ingot, Raw Gold→Gold Ingot, Sand→Glass, Cobblestone→Stone
blastFurnaceRecipes: Ancient Debris→Netherite Scrap
fuelItems: { Coal: 8, 'Oak Log': 1.5, 'Oak Planks': 1.5, Stick: 0.5 }
Atualizar toolChains: ferramentas de pedra, cobre, ferro, ouro e diamante agora usam Sticks + Ingots/Planks ao invés de "Oak Log" + "Raw X"
Netherite tools: usar Netherite Ingot no custo
Atualizar dropMap: Oak_Leaves ganha drop chance de Stick e Apple; Gravel ganha 10% de Flint
Novos items em nameMap, itemPrices
[NEW] 
FurnacePanel.tsx
Novo componente de UI para fornalha/blast furnace:

Selecionar item para derreter (dropdown dos itens no inventário que têm receita)
Selecionar combustível (dropdown dos combustíveis disponíveis no inventário)
Barra de progresso com animação de fogo
Output slot com botão "Coletar"
Toggle entre Fornalha Normal e Blast Furnace
Mostrado apenas quando o jogador possui a estação correspondente
[MODIFY] 
CraftingPanel.tsx
Dividir em seções: "Crafting Manual" (sempre visível) e "Bancada de Trabalho" (visível somente com Crafting Table)
Crafting manual: receitas instantâneas — Log→Planks, Planks→Sticks
Bancada: receitas de ferramentas atualizadas (usando Sticks+Ingots), Shears, Furnace, Blast Furnace
Ferramentas continuam com barra de progresso (craft timed)
[MODIFY] 
Game.tsx
Novo estado: ownedStations: Record<string, boolean> (crafting_table, furnace, blast_furnace)
Novo estado: furnaceTask: { recipe, fuel, progress, totalTime, output } | null
Novo useEffect para tick da fornalha (consome combustível, avança progresso)
Nova função handleHandCraft(recipeId) para crafting instantâneo
Nova função handleWorkbenchCraft(recipeId) para crafting com timer na bancada
Nova função startSmelting(recipeId, fuelId) para iniciar derretimento
Nova função collectSmeltOutput() para coletar barras
Atualizar 
handleMineBlock()
: Oak_Leaves agora tem 20% chance de Stick, 5% chance de Apple; Gravel tem 10% chance de Flint
Renderizar FurnacePanel dentro do painel de mineração, depois do CraftingPanel
Imagens Necessárias (em public/)
Já existentes: 
Furnace.webp
, 
Crafting_Table.webp
, 
Copper_Ingot.webp
, 
Iron_Ingot.webp
, 
Gold_Ingot.webp
, 
Oak_Planks.webp
, 
Stick.webp
, 
Glass.webp
, 
Coal.webp
, 
Fire.webp

Sticks: Craftar Sticks a partir de Planks → verificar inventário
Crafting Table: Craftar Crafting Table (4 Planks) → seção "Bancada de Trabalho" aparece
Furnace craft: Com Crafting Table, craftar Fornalha (8 Cobblestone) → painel de fornalha aparece
Smelting: Adicionar Raw Iron e Coal na fornalha → esperar progresso → coletar Iron Ingot
Drop de Folhas: Minerar Oak_Leaves várias vezes → verificar se drops de Stick/Apple aparecem
Drop de Flint: Minerar Gravel → verificar se Flint aparece (10% chance)