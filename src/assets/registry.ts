export interface DimensionData {
  name: string;
  background: string;
  blocks: { name: string; weight: number }[];
}

export interface BlockProperty {
  hardness: number;
  reqTool: string;
  reqLevel: number;
}

export interface ToolInstance {
  id: string;
  name: string;
  cost: Record<string, number>;
  icon: string;
  speed: number;
  maxDurability: number;
  craftTime: number;
  capacityBonus?: number; // for storage
}

export interface Upgrade {
  id: string;
  category: string;
  name: string;
  description: string;
  cost: Record<string, number>;
  mineCoinCost?: number;
  icon: string;
}

export interface PetEffect {
  type: 'speed' | 'drop' | 'special';
  baseValue: number;
  valuePerLevel: number;
}

export interface Pet {
  id: string;
  name: string;
  category: string;
  baseBonusStr: string;
  dropChance: number;
  icon: string;
  maxLevel: number;
  effect: PetEffect;
}

export interface Recipe {
  id: string;
  name: string;
  creates: string;
  amount: number;
  cost: Record<string, number>;
  craftTime: number;
  icon: string;
}

export interface SmeltingRecipe {
  output: string;
  time: number;
  icon: string;
  exp: number;
}

export class RegistryManager {
  public dimensions: Record<string, DimensionData> = {};
  public blockProperties: Record<string, BlockProperty> = {};
  public dropMap: Record<string, string | null> = {};
  public nameMap: Record<string, string> = {};
  public toolChains: Record<string, ToolInstance[]> = {};
  public availableUpgrades: Upgrade[] = [];
  public availablePets: Pet[] = [];
  public itemPrices: Record<string, number> = {};
  public handRecipes: Recipe[] = [];
  public workbenchRecipes: Recipe[] = [];
  public furnaceRecipes: Record<string, SmeltingRecipe> = {};
  public blastFurnaceRecipes: Record<string, SmeltingRecipe> = {};
  public fuelItems: Record<string, number> = {};

  registerDimension(key: string, data: DimensionData) {
    this.dimensions[key] = data;
  }

  registerBlockProperty(blockName: string, prop: BlockProperty) {
    this.blockProperties[blockName] = prop;
  }

  registerDrop(blockName: string, dropName: string | null) {
    this.dropMap[blockName] = dropName;
  }

  registerName(key: string, localizedName: string) {
    this.nameMap[key] = localizedName;
  }

  registerToolChain(category: string, chain: ToolInstance[]) {
    this.toolChains[category] = chain;
  }

  registerUpgrade(upgrade: Upgrade) {
    this.availableUpgrades.push(upgrade);
  }

  registerPet(pet: Pet) {
    this.availablePets.push(pet);
  }

  registerItemPrice(itemName: string, price: number) {
    this.itemPrices[itemName] = price;
  }

  registerHandRecipe(recipe: Recipe) {
    this.handRecipes.push(recipe);
  }

  registerWorkbenchRecipe(recipe: Recipe) {
    this.workbenchRecipes.push(recipe);
  }

  registerFurnaceRecipe(input: string, recipe: SmeltingRecipe) {
    this.furnaceRecipes[input] = recipe;
  }

  registerBlastFurnaceRecipe(input: string, recipe: SmeltingRecipe) {
    this.blastFurnaceRecipes[input] = recipe;
  }

  registerFuel(item: string, duration: number) {
    this.fuelItems[item] = duration;
  }
}

export const gameRegistry = new RegistryManager();
