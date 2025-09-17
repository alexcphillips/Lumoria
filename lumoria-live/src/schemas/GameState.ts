import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Vector3 } from "./Math";

export enum GameEventType {
  PLAYER_JOINED = "player_joined",
  PLAYER_LEFT = "player_left",
  PLAYER_DIED = "player_died",
  PLAYER_RESPAWNED = "player_respawned",
  ENEMY_SPAWNED = "enemy_spawned",
  ENEMY_DIED = "enemy_died",
  ITEM_PICKED_UP = "item_picked_up",
  SPELL_CAST = "spell_cast",
  DAMAGE_DEALT = "damage_dealt",
  CHAT_MESSAGE = "chat_message",
}

export class GameEvent extends Schema {
  @type("string") id: string = "";
  @type("string") type: string = "";
  @type("string") playerId: string = "";
  @type("string") targetId: string = "";
  @type("string") data: string = "{}";
  @type("number") timestamp: number = 0;
  @type(Vector3) position: Vector3 = new Vector3();

  constructor(type: GameEventType, playerId?: string, data?: any) {
    super();
    this.id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.playerId = playerId || "";
    this.timestamp = Date.now();
    this.data = data ? JSON.stringify(data) : "{}";
  }

  setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
  }

  setTarget(targetId: string) {
    this.targetId = targetId;
  }

  getData(): any {
    try {
      return JSON.parse(this.data);
    } catch {
      return {};
    }
  }
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Enemy }) enemies = new MapSchema<Enemy>();
  @type([GameEvent]) recentEvents = new Array<GameEvent>();
  @type("string") worldState: string = "active";
  @type("number") worldTime: number = 0;
  @type("number") dayNightCycle: number = 0; // 0-1, where 0 is midnight, 0.5 is noon
  @type("string") weather: string = "clear";
  @type("number") tickRate: number = 20;
  @type("number") lastUpdateTime: number = 0;

  constructor() {
    super();
    this.worldTime = Date.now();
    this.lastUpdateTime = Date.now();
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
    this.addEvent(
      new GameEvent(GameEventType.PLAYER_JOINED, player.id, {
        username: player.username,
        level: player.level,
      }),
    );
  }

  removePlayer(playerId: string) {
    const player = this.players.get(playerId);
    if (player) {
      this.addEvent(
        new GameEvent(GameEventType.PLAYER_LEFT, playerId, {
          username: player.username,
        }),
      );
      this.players.delete(playerId);
    }
  }

  addEnemy(enemy: Enemy) {
    this.enemies.set(enemy.id, enemy);
    this.addEvent(
      new GameEvent(GameEventType.ENEMY_SPAWNED, "", {
        enemyId: enemy.id,
        type: enemy.type,
        position: {
          x: enemy.position.x,
          y: enemy.position.y,
          z: enemy.position.z,
        },
      }),
    );
  }

  removeEnemy(enemyId: string) {
    const enemy = this.enemies.get(enemyId);
    if (enemy) {
      this.addEvent(
        new GameEvent(GameEventType.ENEMY_DIED, "", {
          enemyId: enemyId,
          type: enemy.type,
        }),
      );
      this.enemies.delete(enemyId);
    }
  }

  addEvent(event: GameEvent) {
    this.recentEvents.push(event);

    // Keep only the last 50 events
    if (this.recentEvents.length > 50) {
      this.recentEvents.shift();
    }
  }

  update(deltaTime: number) {
    this.worldTime += deltaTime;
    this.lastUpdateTime = Date.now();

    // Update day/night cycle (24 hour cycle = 24 minutes real time)
    const cycleLength = 24 * 60 * 1000; // 24 minutes in milliseconds
    this.dayNightCycle = (this.worldTime % cycleLength) / cycleLength;
  }

  getPlayersNear(position: Vector3, radius: number): Player[] {
    const nearbyPlayers: Player[] = [];

    this.players.forEach((player) => {
      if (player.position.distance(position) <= radius) {
        nearbyPlayers.push(player);
      }
    });

    return nearbyPlayers;
  }

  getEnemiesNear(position: Vector3, radius: number): Enemy[] {
    const nearbyEnemies: Enemy[] = [];

    this.enemies.forEach((enemy) => {
      if (enemy.isAlive && enemy.position.distance(position) <= radius) {
        nearbyEnemies.push(enemy);
      }
    });

    return nearbyEnemies;
  }
}
