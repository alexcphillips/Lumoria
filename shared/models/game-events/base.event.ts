export interface BaseGameEvent {
  eventId: string; // unique ID
  playerId: string; // player who triggered the event
  timestamp: Date; // when it occurred
  data?: Record<string, unknown>; // optional payload
}
