import { Room, Client } from "colyseus";
import { GameState } from "../schemas/GameState";
import { Player } from "../schemas/Player";
import { UnityMessageHandler } from "../handlers/UnityMessageHandler";
import { EnemyAIHandler } from "../handlers/EnemyAIHandler";
import { WorldEventHandler } from "../handlers/WorldEventHandler";

export interface JoinOptions {
  username?: string;
  characterClass?: string;
  level?: number;
}

export class GameRoom extends Room<GameState> {
  private gameLoop!: NodeJS.Timeout;
  private enemySpawnTimer!: NodeJS.Timeout;
  private tickRate: number = parseInt(process.env.WORLD_TICK_RATE || "20");
  private deltaTime: number = 1000 / this.tickRate;

  // Handler instances
  private unityMessageHandler!: UnityMessageHandler;
  public enemyAIHandler!: EnemyAIHandler;
  private worldEventHandler!: WorldEventHandler;

  onCreate(options: any) {
    console.log(`🎮 GameRoom created with options:`, options);

    this.setState(new GameState());
    this.state.tickRate = this.tickRate;

    // Set max clients
    this.maxClients = parseInt(process.env.MAX_CLIENTS_PER_ROOM || "50");

    // Initialize handlers
    this.unityMessageHandler = new UnityMessageHandler(this);
    this.enemyAIHandler = new EnemyAIHandler(this);
    this.worldEventHandler = new WorldEventHandler(this);

    // Start game loop
    this.startGameLoop();

    // Start enemy spawning
    this.startEnemySpawning();

    // Message handlers
    this.setupMessageHandlers();
  }

  onJoin(client: Client, options: JoinOptions) {
    console.log(`👤 Player ${client.sessionId} joined:`, options);

    const player = new Player(
      client.sessionId,
      options.username || `Player_${client.sessionId.substring(0, 6)}`,
    );

    if (options.characterClass) {
      player.characterClass = options.characterClass;
    }

    if (options.level) {
      player.level = options.level;
    }

    // Set spawn position (you can customize this)
    player.updatePosition(0, 0, 0);

    this.state.addPlayer(player);

    // Send welcome message
    client.send("welcome", {
      playerId: client.sessionId,
      worldTime: this.state.worldTime,
      dayNightCycle: this.state.dayNightCycle,
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`👋 Player ${client.sessionId} left (consented: ${consented})`);
    this.state.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log("🗑️ GameRoom disposed");

    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }

    if (this.enemySpawnTimer) {
      clearInterval(this.enemySpawnTimer);
    }
  }

  private setupMessageHandlers() {
    // Use Unity message handler for all Unity client messages
    this.onMessage("move", (client, message) => {
      this.unityMessageHandler.handleMovement(client, message);
    });

    this.onMessage("attack", (client, message) => {
      this.unityMessageHandler.handleAttack(client, message);
    });

    this.onMessage("spell", (client, message) => {
      this.unityMessageHandler.handleSpellCast(client, message);
    });

    this.onMessage("chat", (client, message) => {
      this.unityMessageHandler.handleChat(client, message);
    });

    this.onMessage("interact", (client, message) => {
      this.unityMessageHandler.handleInteraction(client, message);
    });
  }

  private startGameLoop() {
    this.gameLoop = setInterval(() => {
      this.updateGame();
    }, this.deltaTime);
  }

  private updateGame() {
    this.state.update(this.deltaTime);

    // Update AI and world events using handlers
    this.enemyAIHandler.updateAllEnemies(this.deltaTime);
    this.worldEventHandler.update(this.deltaTime);

    // Regenerate player mana
    this.state.players.forEach((player) => {
      if (player.mana < player.maxMana) {
        player.restoreMana(1); // Slow mana regeneration
      }
    });
  }

  private startEnemySpawning() {
    this.enemySpawnTimer = setInterval(() => {
      this.enemyAIHandler.spawnRandomEnemy();
    }, 30000); // Spawn enemy every 30 seconds
  }
}
