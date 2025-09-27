import { BaseGameEvent } from "./base.event";

export interface DungeonCompletedEvent extends BaseGameEvent {
  data: {
    dungeonId: string;
    durationSeconds: number;
    loot?: string[]; // item IDs
  };
}
