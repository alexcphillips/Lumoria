export interface LeaderboardEntry {
  playerId: string;
  score: number;
  rank?: number; // optional, can be calculated
  updatedAt: number; // timestamp
}
