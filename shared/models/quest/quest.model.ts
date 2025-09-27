import { QuestStatus } from "shared/enums/quest-status.enum";
import { QuestObjective } from "./quest-objective.model";
import { QuestReward } from "./quest-reward.model";

export type Quest = {
  questId: string; // unique ID for the quest instance
  title: string; // quest name
  description: string; // full quest description
  status: QuestStatus; // current status
  objectives: QuestObjective[]; // list of objectives
  rewards: QuestReward; // rewards for completing the quest
  startedAt?: Date;
  completedAt?: Date;
};
