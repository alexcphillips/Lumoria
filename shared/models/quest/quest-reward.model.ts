// shared/models/quest-reward.model.ts
import { SkillExperience } from "../skill/skill-experience.model";
import { Item } from "../item.model";

export type QuestReward = {
  experience?: SkillExperience; // skill-specific experience rewards
  coins?: number; // in-game currency
  items?: Item[]; // item rewards
};
