import { BaseGameEvent } from "./base.event";

export interface KillEvent extends BaseGameEvent {
  data: {
    monsterId: string;
    location: { x: number; y: number; z: number };
    xpGained?: Record<string, number>; // skill-based XP
    loot?: string[]; // item IDs
  };
}
