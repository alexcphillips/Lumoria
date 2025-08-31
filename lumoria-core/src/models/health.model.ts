export type Health = {
  status: string;
  uptime: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  timestamp: string;
};
