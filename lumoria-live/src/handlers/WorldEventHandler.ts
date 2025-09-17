import { GameRoom } from "../rooms/GameRoom";
import { WorldEvent, WorldEventType } from "../types/Messages";
import { EnemyType } from "../schemas/Enemy";
import { Vector3 } from "../schemas/Math";

export class WorldEventHandler {
  private eventQueue: WorldEvent[] = [];
  private lastDayNightTransition: number = 0;
  private lastWeatherChange: number = 0;
  private lastBossSpawn: number = 0;

  constructor(private room: GameRoom) {
    this.scheduleInitialEvents();
  }

  update(_deltaTime: number) {
    this.processEventQueue();
    this.checkScheduledEvents();
  }

  private scheduleInitialEvents() {
    // Schedule first weather change
    this.scheduleEvent(
      WorldEventType.WEATHER_CHANGE,
      {
        weather: "rain",
        duration: 5 * 60 * 1000, // 5 minutes
      },
      2 * 60 * 1000,
    ); // In 2 minutes

    // Schedule first boss spawn
    this.scheduleEvent(
      WorldEventType.BOSS_SPAWN,
      {
        bossType: EnemyType.DRAGON,
        spawnArea: "central_clearing",
      },
      10 * 60 * 1000,
    ); // In 10 minutes
  }

  private processEventQueue() {
    const now = Date.now();

    // Process events that are ready
    const readyEvents = this.eventQueue.filter(
      (event) => event.timestamp <= now,
    );

    readyEvents.forEach((event) => {
      this.executeEvent(event);
    });

    // Remove processed events
    this.eventQueue = this.eventQueue.filter((event) => event.timestamp > now);
  }

  private checkScheduledEvents() {
    const now = Date.now();

    // Check for day/night transition
    if (now - this.lastDayNightTransition > 12 * 60 * 1000) {
      // Every 12 minutes
      this.triggerDayNightTransition();
      this.lastDayNightTransition = now;
    }

    // Check for weather changes
    if (now - this.lastWeatherChange > 5 * 60 * 1000) {
      // Every 5 minutes
      this.triggerWeatherChange();
      this.lastWeatherChange = now;
    }

    // Check for boss spawns
    if (now - this.lastBossSpawn > 15 * 60 * 1000) {
      // Every 15 minutes
      this.triggerBossSpawn();
      this.lastBossSpawn = now;
    }
  }

  private executeEvent(event: WorldEvent) {
    console.log(`Executing world event: ${event.type}`);

    switch (event.type) {
      case WorldEventType.DAY_NIGHT_TRANSITION:
        this.handleDayNightTransition(event);
        break;
      case WorldEventType.WEATHER_CHANGE:
        this.handleWeatherChange(event);
        break;
      case WorldEventType.BOSS_SPAWN:
        this.handleBossSpawn(event);
        break;
      case WorldEventType.TREASURE_SPAWN:
        this.handleTreasureSpawn(event);
        break;
      case WorldEventType.WORLD_ANNOUNCEMENT:
        this.handleWorldAnnouncement(event);
        break;
    }
  }

  private handleDayNightTransition(event: WorldEvent) {
    const isDay =
      this.room.state.dayNightCycle > 0.25 &&
      this.room.state.dayNightCycle < 0.75;

    // Broadcast transition to all clients
    this.room.broadcast("day_night_transition", {
      isDay: isDay,
      dayNightCycle: this.room.state.dayNightCycle,
      timestamp: event.timestamp,
    });

    // Different events happen at day vs night
    if (!isDay) {
      // Night time - spawn more enemies
      this.scheduleEvent(
        WorldEventType.WORLD_ANNOUNCEMENT,
        {
          message:
            "Darkness falls... dangerous creatures emerge from the shadows.",
          type: "warning",
        },
        1000,
      );

      // Increase enemy spawn rate temporarily
      this.increaseEnemySpawnRate(2.0, 5 * 60 * 1000); // 2x rate for 5 minutes
    } else {
      // Day time
      this.scheduleEvent(
        WorldEventType.WORLD_ANNOUNCEMENT,
        {
          message: "Dawn breaks across the land. A new day begins in Lumoria.",
          type: "info",
        },
        1000,
      );
    }
  }

  private handleWeatherChange(event: WorldEvent) {
    const weatherTypes = ["clear", "rain", "storm", "snow", "fog"];
    const newWeather =
      event.data.weather ||
      weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

    this.room.state.weather = newWeather;

    // Broadcast weather change
    this.room.broadcast("weather_change", {
      weather: newWeather,
      duration: event.data.duration || 5 * 60 * 1000,
      timestamp: event.timestamp,
    });

    // Weather effects
    switch (newWeather) {
      case "storm":
        this.scheduleEvent(
          WorldEventType.WORLD_ANNOUNCEMENT,
          {
            message:
              "A powerful storm approaches! Seek shelter or face the lightning!",
            type: "warning",
          },
          2000,
        );
        break;
      case "snow":
        this.scheduleEvent(
          WorldEventType.WORLD_ANNOUNCEMENT,
          {
            message: "Snow begins to fall, blanketing the world in white.",
            type: "info",
          },
          2000,
        );
        break;
      case "fog":
        this.scheduleEvent(
          WorldEventType.WORLD_ANNOUNCEMENT,
          {
            message: "Thick fog rolls in, reducing visibility.",
            type: "warning",
          },
          2000,
        );
        break;
    }

    // Schedule next weather change
    const nextChangeDelay = 3 * 60 * 1000 + Math.random() * 4 * 60 * 1000; // 3-7 minutes
    this.scheduleEvent(WorldEventType.WEATHER_CHANGE, {}, nextChangeDelay);
  }

  private handleBossSpawn(event: WorldEvent) {
    const bossType = event.data.bossType || this.getRandomBossType();
    const spawnPosition = this.getBossSpawnPosition(event.data.spawnArea);

    // Check if there's already a boss alive
    const existingBoss = Array.from(this.room.state.enemies.values()).find(
      (enemy) => enemy.type === bossType && enemy.isAlive,
    );

    if (existingBoss) {
      console.log(`Boss ${bossType} already exists, skipping spawn`);
      return;
    }

    // Spawn the boss using the AI handler
    if (this.room.enemyAIHandler) {
      const bossId = this.room.enemyAIHandler.spawnBossEnemy(
        bossType,
        spawnPosition,
      );

      // Announce boss spawn
      this.scheduleEvent(
        WorldEventType.WORLD_ANNOUNCEMENT,
        {
          message: `A mighty ${bossType.toUpperCase()} has appeared! Brave adventurers, unite to face this threat!`,
          type: "boss",
        },
        3000,
      );

      // Schedule treasure spawn after boss is defeated (checked elsewhere)
      console.log(`🐲 Boss ${bossType} spawned with ID: ${bossId}`);
    }

    // Schedule next boss spawn
    const nextBossDelay = 15 * 60 * 1000 + Math.random() * 10 * 60 * 1000; // 15-25 minutes
    this.scheduleEvent(WorldEventType.BOSS_SPAWN, {}, nextBossDelay);
  }

  private handleTreasureSpawn(event: WorldEvent) {
    const treasurePosition =
      event.data.position || this.getRandomTreasurePosition();

    // Broadcast treasure spawn
    this.room.broadcast("treasure_spawned", {
      position: treasurePosition,
      treasureType: event.data.treasureType || "golden_chest",
      timestamp: event.timestamp,
    });

    this.scheduleEvent(
      WorldEventType.WORLD_ANNOUNCEMENT,
      {
        message:
          "Ancient treasure has been discovered! Seek it out before others claim it!",
        type: "treasure",
      },
      2000,
    );
  }

  private handleWorldAnnouncement(event: WorldEvent) {
    // Broadcast announcement to all players
    this.room.broadcast("world_announcement", {
      message: event.data.message,
      type: event.data.type || "info",
      timestamp: event.timestamp,
    });
  }

  private scheduleEvent(type: WorldEventType, data: any, delayMs: number) {
    const event: WorldEvent = {
      type,
      data,
      timestamp: Date.now() + delayMs,
      duration: data.duration,
    };

    this.eventQueue.push(event);
    this.eventQueue.sort((a, b) => a.timestamp - b.timestamp);
  }

  private getRandomBossType(): EnemyType {
    const bossTypes = [EnemyType.DRAGON, EnemyType.ORC]; // Add more boss types as needed
    return bossTypes[Math.floor(Math.random() * bossTypes.length)];
  }

  private getBossSpawnPosition(spawnArea?: string): Vector3 {
    // Define spawn areas
    const spawnAreas = {
      central_clearing: new Vector3(0, 0, 0),
      northern_hills: new Vector3(0, 0, 30),
      southern_swamp: new Vector3(0, 0, -30),
      eastern_forest: new Vector3(30, 0, 0),
      western_desert: new Vector3(-30, 0, 0),
    };

    if (spawnArea && spawnAreas[spawnArea]) {
      return spawnAreas[spawnArea];
    }

    // Random spawn area
    const areas = Object.values(spawnAreas);
    return areas[Math.floor(Math.random() * areas.length)];
  }

  private getRandomTreasurePosition(): Vector3 {
    // Random position within reasonable bounds
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 20;

    return new Vector3(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance,
    );
  }

  private increaseEnemySpawnRate(multiplier: number, durationMs: number) {
    // This would need to be implemented in the enemy AI handler
    console.log(
      `🌙 Increasing enemy spawn rate by ${multiplier}x for ${durationMs}ms`,
    );

    // Schedule rate reset
    setTimeout(() => {
      console.log("🌅 Enemy spawn rate returned to normal");
    }, durationMs);
  }

  // Public methods for triggering events manually
  triggerDayNightTransition() {
    this.scheduleEvent(WorldEventType.DAY_NIGHT_TRANSITION, {}, 0);
  }

  triggerWeatherChange(weather?: string) {
    this.scheduleEvent(WorldEventType.WEATHER_CHANGE, { weather }, 0);
  }

  triggerBossSpawn(bossType?: EnemyType, spawnArea?: string) {
    this.scheduleEvent(WorldEventType.BOSS_SPAWN, { bossType, spawnArea }, 0);
  }

  triggerTreasureSpawn(position?: Vector3, treasureType?: string) {
    this.scheduleEvent(
      WorldEventType.TREASURE_SPAWN,
      { position, treasureType },
      0,
    );
  }

  announceToWorld(message: string, type: string = "info") {
    this.scheduleEvent(WorldEventType.WORLD_ANNOUNCEMENT, { message, type }, 0);
  }
}
