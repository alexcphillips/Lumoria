import { BaseGameEvent } from "./base.event";

export interface PlayerDiedEvent extends BaseGameEvent {
  data: {
    region: string; // the region where the player died
    location: { x: number; y: number; z: number };
    killerId: string; // what killed the player
    cause: string; // e.g., poison, enemy attack #1
  };
}
