import { Client } from "colyseus";
import { GameRoom } from "../rooms/GameRoom";
import {
  UnityPlayerMovement,
  UnityPlayerAttack,
  UnitySpellCast,
  UnityChatMessage,
  UnityPlayerInteraction,
} from "../types/Messages";

export class UnityMessageHandler {
  constructor(private room: GameRoom) {}

  handleMovement(client: Client, message: UnityPlayerMovement) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;

    // Validate movement (anti-cheat basic checks)
    if (this.isValidPosition(message.position)) {
      player.updatePosition(
        message.position.x,
        message.position.y,
        message.position.z,
      );

      if (message.rotation) {
        player.updateRotation(
          message.rotation.x,
          message.rotation.y,
          message.rotation.z,
          message.rotation.w,
        );
      }

      if (message.velocity) {
        player.updateVelocity(
          message.velocity.x,
          message.velocity.y,
          message.velocity.z,
        );
      }
    }
  }

  handleAttack(client: Client, message: UnityPlayerAttack) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player || !player.isAlive) return;

    // Validate attack range and target
    if (message.targetType === "enemy" && message.targetId) {
      const enemy = this.room.state.enemies.get(message.targetId);
      if (enemy && enemy.isAlive) {
        const distance = player.position.distance(enemy.position);
        const maxAttackRange = 5.0; // Base attack range

        if (distance <= maxAttackRange) {
          const damage = this.calculateDamage(player, enemy, message);
          const survived = enemy.takeDamage(damage);

          // Broadcast attack to all clients for visual effects
          this.room.broadcast(
            "player_attack",
            {
              attackerId: client.sessionId,
              targetId: message.targetId,
              targetType: "enemy",
              damage: damage,
              position: message.position,
              timestamp: Date.now(),
            },
            { except: client },
          );

          if (!survived) {
            // Use the AI handler to process enemy death with loot drops
            this.room.enemyAIHandler.handleEnemyDeath(enemy, player);
          }
        }
      }
    }
  }

  handleSpellCast(client: Client, message: UnitySpellCast) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player || !player.isAlive) return;

    const manaCost = message.manaCost || 10;
    if (player.consumeMana(manaCost)) {
      // Broadcast spell effect to all clients
      this.room.broadcast("spell_cast", {
        casterId: client.sessionId,
        spellName: message.spellName,
        position: player.position,
        targetPosition: message.targetPosition,
        timestamp: Date.now(),
      });

      // Apply spell effects based on spell type
      this.applySpellEffects(client, message);
    } else {
      client.send("spell_failed", {
        reason: "insufficient_mana",
        required: manaCost,
        current: player.mana,
      });
    }
  }

  handleChat(client: Client, message: UnityChatMessage) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;

    // Basic chat moderation
    const cleanText = this.moderateText(message.text);

    if (cleanText && cleanText.length > 0) {
      this.room.broadcast("chat", {
        playerId: client.sessionId,
        username: player.username,
        text: cleanText,
        timestamp: Date.now(),
      });
    }
  }

  handleInteraction(client: Client, message: UnityPlayerInteraction) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player || !player.isAlive) return;

    // Handle different interaction types
    switch (message.interactionType) {
      case "pickup":
        this.handleItemPickup(client, message);
        break;
      case "use":
        this.handleItemUse(client, message);
        break;
      case "activate":
        this.handleObjectActivation(client, message);
        break;
    }
  }

  private isValidPosition(position: {
    x: number;
    y: number;
    z: number;
  }): boolean {
    // Basic validation - check for reasonable bounds and NaN
    return (
      !isNaN(position.x) &&
      !isNaN(position.y) &&
      !isNaN(position.z) &&
      Math.abs(position.x) < 1000 &&
      Math.abs(position.z) < 1000
    );
  }

  private calculateDamage(
    player: any,
    _enemy: any,
    attackMessage: UnityPlayerAttack,
  ): number {
    // Basic damage calculation - could be more complex
    let baseDamage = attackMessage.damage || 20;

    // Level scaling
    baseDamage += player.level * 2;

    // Random variance (±20%)
    const variance = 0.8 + Math.random() * 0.4;

    return Math.floor(baseDamage * variance);
  }

  private applySpellEffects(client: Client, message: UnitySpellCast) {
    const player = this.room.state.players.get(client.sessionId);
    if (!player) return;

    switch (message.spellName.toLowerCase()) {
      case "fireball":
        this.applyFireballEffect(client, message);
        break;
      case "heal":
        this.applyHealEffect(client, message);
        break;
      case "lightning":
        this.applyLightningEffect(client, message);
        break;
      default:
        console.log(`Unknown spell: ${message.spellName}`);
    }
  }

  private applyFireballEffect(_client: Client, message: UnitySpellCast) {
    if (!message.targetPosition) return;

    const explosionRadius = 3.0;
    const damage = 30;

    // Find enemies in explosion radius
    this.room.state.enemies.forEach((enemy) => {
      if (enemy.isAlive) {
        const distance = enemy.position.distance({
          x: message.targetPosition!.x,
          y: message.targetPosition!.y,
          z: message.targetPosition!.z,
        } as any);

        if (distance <= explosionRadius) {
          enemy.takeDamage(damage);
          if (!enemy.isAlive) {
            this.room.state.removeEnemy(enemy.id);
          }
        }
      }
    });
  }

  private applyHealEffect(client: Client, _message: UnitySpellCast) {
    const player = this.room.state.players.get(client.sessionId);
    if (player) {
      const healAmount = 50;
      player.heal(healAmount);

      client.send("healing_received", {
        amount: healAmount,
        newHealth: player.health,
      });
    }
  }

  private applyLightningEffect(_client: Client, message: UnitySpellCast) {
    // Lightning chains between nearby enemies
    const damage = 40;
    const chainRange = 5.0;
    const maxChains = 3;

    // Find initial target
    let currentTarget: any = null;
    if (message.targetPosition) {
      this.room.state.enemies.forEach((enemy) => {
        if (enemy.isAlive && !currentTarget) {
          const distance = enemy.position.distance({
            x: message.targetPosition!.x,
            y: message.targetPosition!.y,
            z: message.targetPosition!.z,
          } as any);
          if (distance <= 2.0) {
            currentTarget = enemy;
          }
        }
      });
    }

    const hitTargets = new Set<string>();
    let chainCount = 0;

    while (currentTarget && chainCount < maxChains) {
      if (!hitTargets.has(currentTarget.id)) {
        hitTargets.add(currentTarget.id);
        currentTarget.takeDamage(damage);

        if (!currentTarget.isAlive) {
          this.room.state.removeEnemy(currentTarget.id);
        }

        // Find next chain target
        let nextTarget: any = null;
        let closestDistance = chainRange;

        this.room.state.enemies.forEach((enemy) => {
          if (enemy.isAlive && !hitTargets.has(enemy.id)) {
            const distance = enemy.position.distance(currentTarget.position);
            if (distance < closestDistance) {
              nextTarget = enemy;
              closestDistance = distance;
            }
          }
        });

        currentTarget = nextTarget;
        chainCount++;
      } else {
        break;
      }
    }
  }

  private moderateText(text: string): string {
    // Basic text moderation
    if (!text || text.length > 200) return "";

    // Remove potentially harmful content
    const cleanText = text
      .replace(/[<>]/g, "") // Remove HTML-like brackets
      .trim();

    return cleanText;
  }

  private handleItemPickup(client: Client, message: UnityPlayerInteraction) {
    // Placeholder for item pickup logic
    client.send("item_pickup_result", {
      success: true,
      itemId: message.targetId,
    });
  }

  private handleItemUse(client: Client, message: UnityPlayerInteraction) {
    // Placeholder for item use logic
    client.send("item_use_result", {
      success: true,
      itemId: message.targetId,
    });
  }

  private handleObjectActivation(
    client: Client,
    message: UnityPlayerInteraction,
  ) {
    // Placeholder for object activation logic
    client.send("object_activation_result", {
      success: true,
      objectId: message.targetId,
    });
  }
}
