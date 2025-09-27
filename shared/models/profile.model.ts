import { Position } from "./position.model";
import { Quest } from "./quest/quest.model";
import { Skills } from "./skill/skills.model";

export type Profile = {
  profileId: string; // unique ID for this save slot
  profileName: string; // profile random name from category
  accountId: string; // references the user/account
  slotNumber: number; // 1, 2, 3, etc
  level: number;
  xp: number;
  currentHealth: number;
  currentMana: number;
  coins: number;
  inventory: any[];
  hotbar: any[];
  region: string; // in game region
  quests: Quest[];
  skills: Skills;
  position: Position;
  createdAt?: Date;
  updatedAt?: Date;
};
