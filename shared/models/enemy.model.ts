import { SlayerType } from "../enums/slayer-type.enum";
import { EnemyType } from "../enums/enemy-type.enum";
import { WeightedDropItem } from "./weighted-drop-item.model";

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
