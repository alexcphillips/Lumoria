import { BaseGameEvent } from "./base.event";

export interface PlayerLoginEvent extends BaseGameEvent {
  data?: {
    ip?: string;
    device?: string;
  };
}
