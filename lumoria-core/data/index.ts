export enum RarityTier {
  COMMON = "Common", // white
  UNCOMMON = "Uncommon", // green
  RARE = "Rare", // blue
  EPIC = "Epic", // purple
  LEGENDARY = "Legendary", // orange
  MYTHIC = "Mythic", // pink
  KEY_ITEM = "Key Item", // gold
  SPECIAL = "Special", // red
}

export enum EnemyType {
  BUG = "Bug",
  UNDEAD = "Undead",
  HUMAN = "Human",
  SEA_CREATURE = "Sea Creature",
}

export enum SlayerType {
  BUG = "Bug",
  UNDEAD = "Undead",
  HUMAN = "Human",
  NECROMANCER = "Necromancer",
}

export enum ItemCategory {
  WEAPON = "Weapon",
  ARMOR = "Armor",
  ACCESSORY = "Accessory",
  TALISMAN = "Talisman",
  UTILITY = "Utility",
  CONSUMABLE = "Consumable",
  TOOL = "Tool",
  KEY_ITEM = "Key Item",
  MATERIAL = "Material",
}

interface WeightedDropItem {
  id: string;
  name: string;
  rarity: RarityTier;
  category: ItemCategory;
  weight: number; // Higher = more common
  minQuantity: number;
  maxQuantity: number;
  goldValue: number;
  canUpgrade?: boolean; // If this item can upgrade in rarity
}

export type Enemy = {
  id: string;
  name: string;
  health: number;
  damage: number;
  defense: number;
  trueDefense: number;
  speed: number;
  level: number;
  enemyType: EnemyType; // e.g., "bug", "undead", "human", "marine"
  isSeaCreature: boolean;
  experienceDrop: number;
  slayerType: SlayerType; // different from enemyType, used to determine if gets xp for active slayer quest
  goldDrop: [number, number]; // min and max gold drop
  loot: WeightedDropItem[];
};

export type Weapon = {
  id: string;
  name: string;
  rarity: RarityTier;
  damage: number;
  speed: number; // attacks per second
  levelRequirement: number;
  goldValue: number;
  canUpgrade: boolean;
};

export type Ore = {
  id: number;
  name: string;
  rarity: RarityTier;
  baseValue: number;
  miningLevelRequired: number;
  experience: number;
};
