import { RarityTier } from "../enums/rarity.enum";

export type Ore = {
  id: number;
  name: string;
  rarity: RarityTier;
  baseValue: number;
  miningLevelRequired: number;
  experience: number;
};
