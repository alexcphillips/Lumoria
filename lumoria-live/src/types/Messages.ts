// Unity Client Message Types
export interface UnityPlayerMovement {
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number; w: number };
  velocity?: { x: number; y: number; z: number };
  timestamp: number;
}

export interface UnityPlayerAttack {
  targetType: "enemy" | "player";
  targetId: string;
  damage: number;
  attackType: string;
  position: { x: number; y: number; z: number };
  timestamp: number;
}

export interface UnitySpellCast {
  spellName: string;
  manaCost: number;
  targetPosition?: { x: number; y: number; z: number };
  targetId?: string;
  timestamp: number;
}

export interface UnityChatMessage {
  text: string;
  timestamp: number;
}

export interface UnityPlayerInteraction {
  interactionType: "pickup" | "use" | "activate";
  targetId: string;
  position: { x: number; y: number; z: number };
  timestamp: number;
}

// Server to Unity Message Types
export interface ServerWelcome {
  playerId: string;
  worldTime: number;
  dayNightCycle: number;
  serverVersion: string;
}

export interface ServerPlayerUpdate {
  playerId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  health: number;
  mana: number;
  level: number;
  isAlive: boolean;
}

export interface ServerEnemyUpdate {
  enemyId: string;
  type: string;
  state: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  health: number;
  targetPlayerId?: string;
}

export interface ServerDamageEvent {
  sourceId: string;
  targetId: string;
  damage: number;
  damageType: string;
  position: { x: number; y: number; z: number };
  timestamp: number;
}

export interface ServerSpellEffect {
  casterId: string;
  spellName: string;
  position: { x: number; y: number; z: number };
  targetPosition?: { x: number; y: number; z: number };
  duration: number;
  timestamp: number;
}

export interface ServerChatBroadcast {
  playerId: string;
  username: string;
  text: string;
  timestamp: number;
}

// Game Configuration
export interface GameRoomOptions {
  roomName?: string;
  maxPlayers?: number;
  gameMode?: "pve" | "pvp" | "cooperative";
  difficulty?: "easy" | "normal" | "hard" | "expert";
  worldSeed?: number;
}

export interface PlayerJoinOptions {
  username: string;
  characterClass: "warrior" | "mage" | "archer" | "rogue";
  level?: number;
  characterData?: any;
}

// World Events
export enum WorldEventType {
  DAY_NIGHT_TRANSITION = "day_night_transition",
  WEATHER_CHANGE = "weather_change",
  BOSS_SPAWN = "boss_spawn",
  TREASURE_SPAWN = "treasure_spawn",
  WORLD_ANNOUNCEMENT = "world_announcement",
}

export interface WorldEvent {
  type: WorldEventType;
  data: any;
  timestamp: number;
  duration?: number;
}
