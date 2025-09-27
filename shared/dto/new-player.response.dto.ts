import { Skill } from "../models/skill/skill.model";

export type NewPlayerDTO = {
  playerId: string;
  username: string;
  level: number;
  xp: number;
  maxHealth: number;
  maxMana: number;
  currentHealth: number;
  currentMana: number;
  coins: number;
  inventory: any[];
  hotbar: any[];
  region: string;
  position: { x: number; y: number; z: number };
  activeQuests: any[];
  skills: Skill[];
};
