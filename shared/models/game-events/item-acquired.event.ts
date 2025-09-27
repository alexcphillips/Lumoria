import { AcquisitionMethod } from "../../enums/acquisition-method.enum";
import { BaseGameEvent } from "./base.event";

export interface ItemAcquiredEvent extends BaseGameEvent {
  data: {
    itemId: string;
    quantity: number;
    acquisitionMethod: AcquisitionMethod;
    source?: string; // optional chestId, monsterId
  };
}
