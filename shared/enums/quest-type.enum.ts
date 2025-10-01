export enum QuestType {
  INTERACT = "interact", // talk to NPC or interact with object
  DISCOVER = "discover", // reach a location
  FETCH = "fetch", // get an item and bring back
  OBTAIN = "obtain", // player manually harvests or crafts something (not bought or traded)
  HARVEST = "harvest", // acquire something manually (resource, plant, etc.)
  KILL = "kill", // defeat enemies X times
}
