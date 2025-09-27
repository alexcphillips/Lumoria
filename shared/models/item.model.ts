import { ItemCategory } from "../enums/item-category.enum";
import { RarityTier } from "../enums/rarity.enum";

export type Item = {
  itemId: string;
  name: string;
  type: ItemCategory;
  effects?: Record<string, unknown>;
  rarity: RarityTier;
};
