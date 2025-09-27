import { BaseGameEvent } from "./base.event";

export interface PlayerLogoutEvent extends BaseGameEvent {
  data?: {
    sessionDurationSeconds?: number;
  };
}
