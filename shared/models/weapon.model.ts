import { RarityTier } from "../enums/rarity.enum";

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
