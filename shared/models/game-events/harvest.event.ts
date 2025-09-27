import { BaseGameEvent } from "./base.event";
import { SkillName } from "../../enums/skill.enum";

export interface HarvestEvent extends BaseGameEvent {
  data: {
    skill: SkillName;
    itemId: string;
    quantity: number;
    location: { x: number; y: number; z: number };
  };
}
