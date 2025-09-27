import { ItemCategory } from "../enums/item-category.enum";
import { RarityTier } from "../enums/rarity.enum";

export type WeightedDropItem = {
  id: string;
  name: string;
  rarity: RarityTier;
  category: ItemCategory;
  weight: number; // Higher = more common
  minQuantity: number;
  maxQuantity: number;
  goldValue: number;
  canUpgrade?: boolean; // If this item can upgrade in rarity
};
