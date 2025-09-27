import { LeaderboardScope } from "../enums/leaderboard-scope.enum";
import { LeaderboardEntry } from "../models/leaderboard/leaderboard-entry.model";

export type LeaderboardResponse = {
  leaderboardId: string;
  entries: LeaderboardEntry[];
  metric: string;
  scope: LeaderboardScope;
  contestId?: string;
  start?: number;
  end?: number;
  updatedAt: number;
};
