export enum AcquisitionMethod {
  HARVEST = "harvest", // gathered manually (fishing, mining, etc.)
  KILL = "kill", // dropped from monsters
  CRAFTED = "crafted", // player-crafted items
  QUEST_REWARD = "quest_reward", // from other quests
  MARKET = "market", // purchased from market/store
  TRADE = "trade", // obtained from another player
  VENDOR = "vendor", // bought from NPC vendor
  DUNGEON_REWARD = "dungeon_reward", // from dungeon or raid
  EVENT_REWARD = "event_reward", // from special events
  PICKPOCKETED = "pickpocketed", // stolen from NPC
  LOCKPICKED = "lockpicked", // obtained by lockpicking
  GAMBLE = "gamble", // obtained via gambling
}
