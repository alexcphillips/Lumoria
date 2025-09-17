import { EnemyType } from "../schemas/Enemy";
import { Player } from "../schemas/Player";

// ===== CONSTANTS =====
const PERCENTAGE_SCALE = 100; // Human-readable percentages (0-100)
const RARITY_UPGRADE_BASE_CHANCE = 5; // 5% base chance for rarity upgrade
const MAGIC_FIND_RARITY_MULTIPLIER = 0.01; // 1% per magic find point

/**
 * Item rarity tiers from common to mythic
 */
export enum ItemRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
  MYTHIC = "mythic",
}

/**
 * Represents a droppable item with its properties
 */
export interface DropItem {
  id: string;
  name: string;
  rarity: ItemRarity;
  baseDropChance: number; // Percentage (0-100)
  minQuantity: number;
  maxQuantity: number;
  goldValue: number;
}

/**
 * Drop table configuration for a specific enemy type and level
 */
export interface DropTable {
  enemyType: EnemyType;
  level: number;
  guaranteedDrops: DropItem[];
  possibleDrops: DropItem[];
  goldDrop: {
    min: number;
    max: number;
    baseChance: number; // Percentage (0-100)
  };
}

/**
 * Player's magic find statistics that affect loot drops
 */
export interface MagicFindStats {
  magicFind: number; // Increases drop rates
  rarityBonus: number; // Increases chance of rarity upgrades
  quantityBonus: number; // Increases item quantities
  goldFind: number; // Increases gold amounts
}

/**
 * Result of a loot drop calculation
 */
export interface DropResult {
  items: (DropItem & { quantity: number })[];
  gold: number;
}

/**
 * Enhanced loot drop system with human-readable percentages,
 * magic find mechanics, and comprehensive drop calculations.
 *
 * Features:
 * - Percentage-based drop rates (0-100)
 * - Magic find stat effects
 * - Rarity upgrade system
 * - Quantity bonuses
 * - Gold find mechanics
 * - Guaranteed vs. possible drops
 */
export class LootDropHandler {
  private dropTables = new Map<string, DropTable>();

  constructor() {
    this.initializeDropTables();
  }

  /**
   * Initialize all enemy drop tables with their loot configurations
   */
  private initializeDropTables(): void {
    // Goblin drops - Entry level enemy
    this.addDropTable({
      enemyType: EnemyType.GOBLIN,
      level: 1,
      guaranteedDrops: [], // No guaranteed drops for low-level enemies
      possibleDrops: [
        {
          id: "goblin_ear",
          name: "Goblin Ear",
          rarity: ItemRarity.COMMON,
          baseDropChance: 30, // 30% chance
          minQuantity: 1,
          maxQuantity: 2,
          goldValue: 5,
        },
        {
          id: "rusty_dagger",
          name: "Rusty Dagger",
          rarity: ItemRarity.COMMON,
          baseDropChance: 15, // 15% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 25,
        },
        {
          id: "goblin_potion",
          name: "Goblin Healing Potion",
          rarity: ItemRarity.UNCOMMON,
          baseDropChance: 5, // 5% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 50,
        },
        {
          id: "goblin_ring",
          name: "Crude Goblin Ring",
          rarity: ItemRarity.RARE,
          baseDropChance: 1, // 1% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 200,
        },
      ],
      goldDrop: {
        min: 1,
        max: 10,
        baseChance: 75, // 75% chance for gold drop
      },
    });

    // Orc drops - Mid-level enemy
    this.addDropTable({
      enemyType: EnemyType.ORC,
      level: 5,
      guaranteedDrops: [
        {
          id: "orc_hide",
          name: "Orc Hide",
          rarity: ItemRarity.COMMON,
          baseDropChance: 100, // Guaranteed
          minQuantity: 1,
          maxQuantity: 3,
          goldValue: 15,
        },
      ],
      possibleDrops: [
        {
          id: "orc_axe",
          name: "Orc Battle Axe",
          rarity: ItemRarity.UNCOMMON,
          baseDropChance: 25, // 25% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 100,
        },
        {
          id: "orc_armor",
          name: "Orc Chain Mail",
          rarity: ItemRarity.RARE,
          baseDropChance: 8, // 8% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 350,
        },
        {
          id: "orc_medallion",
          name: "Orc War Medallion",
          rarity: ItemRarity.EPIC,
          baseDropChance: 2, // 2% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 750,
        },
      ],
      goldDrop: {
        min: 10,
        max: 50,
        baseChance: 85, // 85% chance for gold drop
      },
    });

    // Dragon drops - High-level boss enemy
    this.addDropTable({
      enemyType: EnemyType.DRAGON,
      level: 20,
      guaranteedDrops: [
        {
          id: "dragon_scale",
          name: "Dragon Scale",
          rarity: ItemRarity.RARE,
          baseDropChance: 100, // Guaranteed
          minQuantity: 3,
          maxQuantity: 8,
          goldValue: 500,
        },
        {
          id: "dragon_bone",
          name: "Dragon Bone",
          rarity: ItemRarity.EPIC,
          baseDropChance: 100, // Guaranteed
          minQuantity: 1,
          maxQuantity: 3,
          goldValue: 1000,
        },
      ],
      possibleDrops: [
        {
          id: "dragon_heart",
          name: "Dragon Heart",
          rarity: ItemRarity.LEGENDARY,
          baseDropChance: 15, // 15% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 5000,
        },
        {
          id: "dragon_soul",
          name: "Ancient Dragon Soul",
          rarity: ItemRarity.MYTHIC,
          baseDropChance: 3, // 3% chance
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 15000,
        },
      ],
      goldDrop: {
        min: 200,
        max: 1000,
        baseChance: 100, // Dragons always drop gold
      },
    });
  }

  /**
   * Add a drop table for a specific enemy type and level
   */
  private addDropTable(table: DropTable): void {
    const key = `${table.enemyType}_${table.level}`;
    this.dropTables.set(key, table);
  }

  /**
   * Calculate loot drops for a killed enemy
   * @param enemyType The type of enemy killed
   * @param enemyLevel The level of the enemy
   * @param killerPlayer The player who killed the enemy
   * @param magicFind Magic find stats affecting the drop
   * @returns The calculated drop result
   */
  calculateDrops(
    enemyType: EnemyType,
    enemyLevel: number,
    _killerPlayer: Player,
    magicFind: MagicFindStats,
  ): DropResult {
    const dropTable = this.getDropTableInfo(enemyType, enemyLevel);
    if (!dropTable) {
      console.warn(`No drop table found for ${enemyType} level ${enemyLevel}`);
      return { items: [], gold: 0 };
    }

    const result: DropResult = { items: [], gold: 0 };

    // Process guaranteed drops
    for (const item of dropTable.guaranteedDrops) {
      const quantity = this.calculateQuantity(item, magicFind);
      result.items.push({ ...item, quantity });
    }

    // Process possible drops
    for (const item of dropTable.possibleDrops) {
      if (this.rollForDrop(item, magicFind)) {
        const quantity = this.calculateQuantity(item, magicFind);

        // Apply rarity upgrade system
        const finalItem = this.applyRarityUpgrade(item, magicFind);
        result.items.push({ ...finalItem, quantity });
      }
    }

    // Calculate gold drop
    if (this.rollForGold(dropTable.goldDrop, magicFind)) {
      result.gold = this.calculateGoldAmount(dropTable.goldDrop, magicFind);
    }

    // Log significant drops for debugging/analytics
    this.logDropResults(enemyType, enemyLevel, result);

    return result;
  }

  /**
   * Roll to determine if an item drops
   */
  private rollForDrop(item: DropItem, magicFind: MagicFindStats): boolean {
    const magicFindBonus = magicFind.magicFind * 0.1; // 0.1% per magic find point
    const adjustedChance = item.baseDropChance + magicFindBonus;
    const roll = Math.random() * PERCENTAGE_SCALE;
    return roll <= adjustedChance;
  }

  /**
   * Roll to determine if gold drops
   */
  private rollForGold(
    goldDrop: DropTable["goldDrop"],
    magicFind: MagicFindStats,
  ): boolean {
    const magicFindBonus = magicFind.magicFind * 0.05; // 0.05% per magic find point for gold
    const adjustedChance = goldDrop.baseChance + magicFindBonus;
    const roll = Math.random() * PERCENTAGE_SCALE;
    return roll <= adjustedChance;
  }

  /**
   * Calculate the quantity of an item drop
   */
  private calculateQuantity(item: DropItem, magicFind: MagicFindStats): number {
    const baseQuantity = Math.floor(
      Math.random() * (item.maxQuantity - item.minQuantity + 1) +
        item.minQuantity,
    );

    // Apply quantity bonus (10% per point = 10% chance for +1)
    const bonusRolls = magicFind.quantityBonus;
    let bonusQuantity = 0;

    for (let i = 0; i < bonusRolls; i++) {
      if (Math.random() < 0.1) {
        // 10% chance per bonus roll
        bonusQuantity++;
      }
    }

    return Math.max(1, baseQuantity + bonusQuantity);
  }

  /**
   * Calculate gold amount with magic find bonuses
   */
  private calculateGoldAmount(
    goldDrop: DropTable["goldDrop"],
    magicFind: MagicFindStats,
  ): number {
    const baseAmount = Math.floor(
      Math.random() * (goldDrop.max - goldDrop.min + 1) + goldDrop.min,
    );

    // Apply gold find bonus (1% per point)
    const goldFindMultiplier = 1 + magicFind.goldFind * 0.01;
    return Math.floor(baseAmount * goldFindMultiplier);
  }

  /**
   * Apply rarity upgrade system (similar to Hypixel)
   */
  private applyRarityUpgrade(
    item: DropItem,
    magicFind: MagicFindStats,
  ): DropItem {
    const rarityOrder = [
      ItemRarity.COMMON,
      ItemRarity.UNCOMMON,
      ItemRarity.RARE,
      ItemRarity.EPIC,
      ItemRarity.LEGENDARY,
      ItemRarity.MYTHIC,
    ];

    const currentRarityIndex = rarityOrder.indexOf(item.rarity);
    if (
      currentRarityIndex === -1 ||
      currentRarityIndex >= rarityOrder.length - 1
    ) {
      return item; // Already at max rarity or invalid rarity
    }

    // Calculate upgrade chance
    const baseUpgradeChance = RARITY_UPGRADE_BASE_CHANCE;
    const magicFindBonus = magicFind.rarityBonus * MAGIC_FIND_RARITY_MULTIPLIER;
    const totalUpgradeChance = baseUpgradeChance + magicFindBonus;

    if (Math.random() * PERCENTAGE_SCALE <= totalUpgradeChance) {
      const upgradedRarity = rarityOrder[currentRarityIndex + 1];
      return {
        ...item,
        rarity: upgradedRarity,
        goldValue: Math.floor(item.goldValue * 2.5), // Increase value for upgraded rarity
        name: item.name + " [UPGRADED]",
      };
    }

    return item;
  }

  /**
   * Check if an item is rare or higher rarity
   */
  private isRareOrHigher(rarity: ItemRarity): boolean {
    return [
      ItemRarity.RARE,
      ItemRarity.EPIC,
      ItemRarity.LEGENDARY,
      ItemRarity.MYTHIC,
    ].includes(rarity);
  }

  /**
   * Log significant drop results for analytics
   */
  private logDropResults(
    enemyType: EnemyType,
    enemyLevel: number,
    result: DropResult,
  ): void {
    const rareItems = result.items.filter((item) =>
      this.isRareOrHigher(item.rarity),
    );

    if (rareItems.length > 0) {
      console.log(`🎯 Rare drops from ${enemyType} (Level ${enemyLevel}):`);
      rareItems.forEach((item) => {
        console.log(
          `  • ${item.name} (${item.rarity}) x${item.quantity} - ${item.goldValue}g`,
        );
      });
    }

    if (result.gold > 100) {
      console.log(
        `💰 Large gold drop: ${result.gold}g from ${enemyType} (Level ${enemyLevel})`,
      );
    }
  }

  /**
   * Extract magic find stats from a player
   */
  getPlayerMagicFind(_player: Player): MagicFindStats {
    // In a real implementation, these would come from player equipment/stats
    // For now, return default values or extract from player properties
    return {
      magicFind: (_player as any).stats?.magicFind || 0,
      rarityBonus: (_player as any).stats?.rarityBonus || 0,
      quantityBonus: (_player as any).stats?.quantityBonus || 0,
      goldFind: (_player as any).stats?.goldFind || 0,
    };
  }

  /**
   * Add a custom drop table (useful for special events, custom content)
   */
  addCustomDropTable(table: DropTable): void {
    this.addDropTable(table);
  }

  /**
   * Get drop table information for debugging/admin tools
   */
  getDropTableInfo(enemyType: EnemyType, level: number): DropTable | undefined {
    const key = `${enemyType}_${level}`;
    return this.dropTables.get(key);
  }
}

// Export singleton instance for use throughout the application
export const lootDropHandler = new LootDropHandler();
