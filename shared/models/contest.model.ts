export interface GameContest {
  id: string;
  name: string; // "Fishing Fiesta"
  metric: string; // what is being tracked
  start: number; // start timestamp
  end: number; // end timestamp
  description?: string;
  rewards?: Record<string, any>; // optional reward mapping
}
