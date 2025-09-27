import { BaseGameEvent } from "./base.event";

export interface DungeonStartedEvent extends BaseGameEvent {
  data: {
    dungeonId: string; // ID of the dungeon
    members: string[]; // player IDs
  };
}
