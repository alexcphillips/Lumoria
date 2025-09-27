import { AcquisitionMethod } from "shared/enums/acquisition-method.enum";

export type QuestObjective = {
  description: string;
  progress: number;
  target: number;
  requiredItemId?: string;
  allowedAcquisitionMethods?: AcquisitionMethod[];
};
