import { LeaderboardScope } from "../../enums/leaderboard-scope.enum";

export type Leaderboard = {
  id: string; // unique identifier
  name: string; // e.g., "Fishing XP Global"
  metric: string; // e.g., "fishing_xp", "level"
  scope: LeaderboardScope;
  contestId?: string; // if tied to a contest
  start?: number; // unix timestamp
  end?: number; // unix timestamp
};
