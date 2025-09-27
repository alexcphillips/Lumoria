import { BaseGameEvent } from "./base.event";
import { QuestReward } from "../quest/quest-reward.model";

export interface QuestCompletedEvent extends BaseGameEvent {
  data: {
    questId: string;
    rewards: QuestReward;
  };
}
