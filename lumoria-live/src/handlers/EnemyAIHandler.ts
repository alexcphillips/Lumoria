import { GameRoom } from "../rooms/GameRoom";
import { Enemy, EnemyState, EnemyType } from "../schemas/Enemy";
import { Vector3 } from "../schemas/Math";
import { Player } from "../schemas/Player";
import { lootDropHandler } from "./LootDropHandler";

export class EnemyAIHandler {
  constructor(private room: GameRoom) {}

  updateAllEnemies(deltaTime: number) {
    this.room.state.enemies.forEach((enemy) => {
      if (enemy.isAlive) {
        this.updateEnemyAI(enemy, deltaTime);
      }
    });
  }

  private updateEnemyAI(enemy: Enemy, deltaTime: number) {
    switch (enemy.state) {
      case EnemyState.IDLE:
        this.handleIdleState(enemy);
        break;
      case EnemyState.PATROLLING:
        this.handlePatrollingState(enemy, deltaTime);
        break;
      case EnemyState.CHASING:
        this.handleChasingState(enemy, deltaTime);
        break;
      case EnemyState.ATTACKING:
        this.handleAttackingState(enemy);
        break;
    }
  }

  private handleIdleState(enemy: Enemy) {
    // Look for nearby players
    const nearbyPlayers = this.findPlayersInRange(enemy, enemy.detectionRange);

    if (nearbyPlayers.length > 0) {
      const closestPlayer = this.getClosestPlayer(enemy, nearbyPlayers);
      enemy.setTarget(closestPlayer.id);
      enemy.setState(EnemyState.CHASING);
      return;
    }

    // Randomly start patrolling
    if (Math.random() < 0.01) {
      // 1% chance per update
      enemy.setState(EnemyState.PATROLLING);
    }
  }

  private handlePatrollingState(enemy: Enemy, deltaTime: number) {
    // Check for players while patrolling
    const nearbyPlayers = this.findPlayersInRange(enemy, enemy.detectionRange);

    if (nearbyPlayers.length > 0) {
      const closestPlayer = this.getClosestPlayer(enemy, nearbyPlayers);
      enemy.setTarget(closestPlayer.id);
      enemy.setState(EnemyState.CHASING);
      return;
    }

    // Simple patrol behavior - move randomly around spawn point
    const distanceFromSpawn = enemy.position.distance(enemy.spawnPosition);

    if (distanceFromSpawn > enemy.detectionRange) {
      // Return to spawn area
      this.moveTowardsTarget(enemy, enemy.spawnPosition, deltaTime);
    } else {
      // Random movement
      this.randomMovement(enemy, deltaTime);
    }

    // Randomly return to idle
    if (Math.random() < 0.005) {
      // 0.5% chance per update
      enemy.setState(EnemyState.IDLE);
    }
  }

  private handleChasingState(enemy: Enemy, deltaTime: number) {
    const target = this.room.state.players.get(enemy.targetPlayerId);

    if (!target || !target.isAlive) {
      enemy.setTarget("");
      enemy.setState(EnemyState.IDLE);
      return;
    }

    const distance = enemy.position.distance(target.position);

    if (distance <= enemy.attackRange) {
      enemy.setState(EnemyState.ATTACKING);
    } else if (distance > enemy.detectionRange * 1.5) {
      // Lost target, return to patrol or idle
      enemy.setTarget("");
      enemy.setState(
        this.shouldPatrol(enemy) ? EnemyState.PATROLLING : EnemyState.IDLE,
      );
    } else {
      // Move towards target
      this.moveTowardsTarget(enemy, target.position, deltaTime);
    }
  }

  private handleAttackingState(enemy: Enemy) {
    const target = this.room.state.players.get(enemy.targetPlayerId);

    if (!target || !target.isAlive) {
      enemy.setTarget("");
      enemy.setState(EnemyState.IDLE);
      return;
    }

    const distance = enemy.position.distance(target.position);

    if (distance > enemy.attackRange) {
      enemy.setState(EnemyState.CHASING);
      return;
    }

    // Perform attack if cooldown is ready
    if (enemy.canAttack()) {
      const damage = this.calculateEnemyDamage(enemy);
      const survived = target.takeDamage(damage);

      enemy.attack(); // Updates last attack time

      // Broadcast attack to all clients
      this.room.broadcast("enemy_attack", {
        enemyId: enemy.id,
        targetId: target.id,
        damage: damage,
        timestamp: Date.now(),
      });

      if (!survived) {
        this.room.broadcast("player_death", {
          playerId: target.id,
          killerId: enemy.id,
          timestamp: Date.now(),
        });

        enemy.setTarget("");
        enemy.setState(EnemyState.IDLE);
      }
    }
  }

  // Handle enemy death and calculate loot drops
  handleEnemyDeath(enemy: Enemy, killerPlayer: Player) {
    // Calculate loot drops based on enemy type and player's magic find
    const magicFind = lootDropHandler.getPlayerMagicFind(killerPlayer);
    const dropResult = lootDropHandler.calculateDrops(
      enemy.type as EnemyType,
      enemy.level,
      killerPlayer,
      magicFind,
    );

    // Broadcast loot drops to all clients
    this.room.broadcast("enemy_loot_drop", {
      enemyId: enemy.id,
      killerId: killerPlayer.id,
      killerName: killerPlayer.username,
      items: dropResult.items,
      gold: dropResult.gold,
      position: {
        x: enemy.position.x,
        y: enemy.position.y,
        z: enemy.position.z,
      },
      timestamp: Date.now(),
    });

    // Award gold to player (you might want to add this to player state)
    if (dropResult.gold > 0) {
      console.log(
        `💰 ${killerPlayer.username} received ${dropResult.gold} gold`,
      );
      // player.addGold(dropResult.gold); // Implement this in Player schema
    }

    // Award experience for the kill
    const expGained = this.calculateExperience(enemy);
    const oldLevel = killerPlayer.level;
    killerPlayer.level = Math.min(100, killerPlayer.level + expGained); // Cap at level 100

    if (killerPlayer.level > oldLevel) {
      this.room.broadcast("player_level_up", {
        playerId: killerPlayer.id,
        playerName: killerPlayer.username,
        newLevel: killerPlayer.level,
        timestamp: Date.now(),
      });
    }

    // Remove enemy from game state
    this.room.state.removeEnemy(enemy.id);
  }

  private calculateExperience(enemy: Enemy): number {
    // XP based on enemy type and level
    const baseXP = {
      [EnemyType.GOBLIN]: 25,
      [EnemyType.ORC]: 50,
      [EnemyType.SKELETON]: 40,
      [EnemyType.DRAGON]: 500,
    };

    const xp = (baseXP[enemy.type as EnemyType] || 25) * enemy.level;
    return xp * 0.01; // Convert to level progression (adjust as needed)
  }

  private findPlayersInRange(enemy: Enemy, range: number): Player[] {
    const playersInRange: Player[] = [];

    this.room.state.players.forEach((player) => {
      if (player.isAlive) {
        const distance = enemy.position.distance(player.position);
        if (distance <= range) {
          playersInRange.push(player);
        }
      }
    });

    return playersInRange;
  }

  private getClosestPlayer(enemy: Enemy, players: Player[]): Player {
    let closestPlayer = players[0];
    let closestDistance = enemy.position.distance(closestPlayer.position);

    for (let i = 1; i < players.length; i++) {
      const distance = enemy.position.distance(players[i].position);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlayer = players[i];
      }
    }

    return closestPlayer;
  }

  private moveTowardsTarget(
    enemy: Enemy,
    targetPosition: Vector3,
    deltaTime: number,
  ) {
    const direction = {
      x: targetPosition.x - enemy.position.x,
      y: targetPosition.y - enemy.position.y,
      z: targetPosition.z - enemy.position.z,
    };

    // Normalize direction
    const length = Math.sqrt(
      direction.x * direction.x +
        direction.y * direction.y +
        direction.z * direction.z,
    );

    if (length > 0) {
      direction.x /= length;
      direction.y /= length;
      direction.z /= length;

      // Move towards target
      const moveDistance = enemy.movementSpeed * (deltaTime / 1000);

      enemy.position.x += direction.x * moveDistance;
      enemy.position.y += direction.y * moveDistance;
      enemy.position.z += direction.z * moveDistance;

      // Update rotation to face target
      const angle = Math.atan2(direction.x, direction.z);
      enemy.rotation.y = Math.sin(angle / 2);
      enemy.rotation.w = Math.cos(angle / 2);
    }
  }

  private randomMovement(enemy: Enemy, deltaTime: number) {
    // Simple random movement
    const angle = Math.random() * Math.PI * 2;
    const moveDistance = enemy.movementSpeed * 0.3 * (deltaTime / 1000); // Slower than chasing

    enemy.position.x += Math.cos(angle) * moveDistance;
    enemy.position.z += Math.sin(angle) * moveDistance;

    // Update rotation
    enemy.rotation.y = Math.sin(angle / 2);
    enemy.rotation.w = Math.cos(angle / 2);
  }

  private shouldPatrol(enemy: Enemy): boolean {
    // Different enemy types have different patrol behaviors
    switch (enemy.type) {
      case EnemyType.GOBLIN:
        return Math.random() < 0.7; // 70% chance to patrol
      case EnemyType.ORC:
        return Math.random() < 0.3; // 30% chance to patrol (more aggressive)
      case EnemyType.SKELETON:
        return Math.random() < 0.8; // 80% chance to patrol
      case EnemyType.DRAGON:
        return false; // Dragons don't patrol, they guard their territory
      default:
        return Math.random() < 0.5;
    }
  }

  private calculateEnemyDamage(enemy: Enemy): number {
    // Base damage with some randomness
    const baseDamage = enemy.damage;
    const variance = 0.8 + Math.random() * 0.4; // ±20% variance

    return Math.floor(baseDamage * variance);
  }

  spawnRandomEnemy(): boolean {
    if (this.room.state.enemies.size >= 20) return false; // Max enemies limit

    const enemyTypes = [EnemyType.GOBLIN, EnemyType.ORC, EnemyType.SKELETON];
    const randomType =
      enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    // Random spawn position around origin
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 20;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    const enemyId = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const enemy = new Enemy(enemyId, randomType, x, 0, z);

    this.room.state.addEnemy(enemy);

    console.log(
      `🐺 Spawned ${randomType} at (${x.toFixed(1)}, 0, ${z.toFixed(1)})`,
    );

    return true;
  }

  spawnBossEnemy(type: EnemyType, position: Vector3): string {
    const enemyId = `boss_${type}_${Date.now()}`;
    const enemy = new Enemy(enemyId, type, position.x, position.y, position.z);

    // Make it a boss (enhanced stats)
    enemy.health = enemy.maxHealth = enemy.maxHealth * 3;
    enemy.damage = enemy.damage * 2;
    enemy.detectionRange = enemy.detectionRange * 1.5;
    enemy.level = 5;

    this.room.state.addEnemy(enemy);

    // Broadcast boss spawn event
    this.room.broadcast("boss_spawned", {
      enemyId: enemyId,
      type: type,
      position: { x: position.x, y: position.y, z: position.z },
      timestamp: Date.now(),
    });

    console.log(
      `🐲 Boss spawned: ${type} at (${position.x}, ${position.y}, ${position.z})`,
    );

    return enemyId;
  }
}
