/**
 * HYPIXEL-STYLE DROP SYSTEM IMPROVEMENTS
 *
 * This file demonstrates how we could enhance our loot system to be more like
 * Hypixel Skyblock's sophisticated drop calculation system.
 */

import { ItemRarity } from "../src/handlers/LootDropHandler";

// =============================================================================
// HYPIXEL-STYLE DROP POOLS
// =============================================================================

interface WeightedDropItem {
  id: string;
  name: string;
  rarity: ItemRarity;
  weight: number; // Higher = more common
  minQuantity: number;
  maxQuantity: number;
  goldValue: number;
  canUpgrade?: boolean; // Can this item upgrade rarity?
}

interface DropPool {
  poolId: string;
  description: string;
  totalWeight: number;
  items: WeightedDropItem[];
  guaranteedDrops?: WeightedDropItem[]; // Always drop these
  maxDrops: number; // Maximum items that can drop from this pool
}

// =============================================================================
// ENHANCED MAGIC FIND SYSTEM
// =============================================================================

interface HypixelStyleMagicFind {
  // Core stats
  magicFind: number; // Base magic find %
  petLuck: number; // Special pet drop bonus
  looting: number; // Common item quantity bonus
  fortune: number; // Rare material bonus
  scavenging: number; // Gold find bonus

  // Special modifiers
  dropRateModifier: number; // Event/potion bonuses
  rarityUpgradeChance: number; // Chance to upgrade item rarity

  // Collection bonuses
  collectionBonuses: { [mobType: string]: number };
}

// =============================================================================
// HYPIXEL-STYLE DROP CALCULATION
// =============================================================================

export class HypixelStyleLootHandler {
  private dropPools: Map<string, DropPool> = new Map();

  constructor() {
    this.initializeDropPools();
  }

  private initializeDropPools() {
    // Zombie drop pool (Hypixel-style)
    this.addDropPool({
      poolId: "zombie_crypt",
      description: "Crypt zombie drops with rare enchanted items",
      totalWeight: 10000,
      maxDrops: 3,
      items: [
        {
          id: "rotten_flesh",
          name: "Rotten Flesh",
          rarity: ItemRarity.COMMON,
          weight: 6000, // 60% of total weight
          minQuantity: 1,
          maxQuantity: 3,
          goldValue: 2,
          canUpgrade: true,
        },
        {
          id: "undead_catalyst",
          name: "Undead Catalyst",
          rarity: ItemRarity.UNCOMMON,
          weight: 2000, // 20%
          minQuantity: 1,
          maxQuantity: 2,
          goldValue: 25,
          canUpgrade: true,
        },
        {
          id: "enchanted_rotten_flesh",
          name: "Enchanted Rotten Flesh",
          rarity: ItemRarity.RARE,
          weight: 1500, // 15%
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 160,
          canUpgrade: true,
        },
        {
          id: "revenant_flesh",
          name: "Revenant Flesh",
          rarity: ItemRarity.EPIC,
          weight: 400, // 4%
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 500,
          canUpgrade: true,
        },
        {
          id: "beheaded_horror",
          name: "Beheaded Horror",
          rarity: ItemRarity.LEGENDARY,
          weight: 90, // 0.9%
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 2500,
        },
        {
          id: "necromancer_sword",
          name: "Necromancer Sword",
          rarity: ItemRarity.MYTHIC,
          weight: 10, // 0.1%
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 50000,
        },
      ],
      guaranteedDrops: [
        {
          id: "combat_xp",
          name: "Combat XP",
          rarity: ItemRarity.COMMON,
          weight: 10000,
          minQuantity: 10,
          maxQuantity: 25,
          goldValue: 0,
        },
      ],
    });

    // Dragon drop pool (boss-tier)
    this.addDropPool({
      poolId: "superior_dragon",
      description: "Superior Dragon drops with guaranteed rare items",
      totalWeight: 1000,
      maxDrops: 5,
      guaranteedDrops: [
        {
          id: "superior_dragon_fragment",
          name: "Superior Dragon Fragment",
          rarity: ItemRarity.EPIC,
          weight: 1000,
          minQuantity: 3,
          maxQuantity: 8,
          goldValue: 1000,
        },
      ],
      items: [
        {
          id: "dragon_scale",
          name: "Superior Dragon Scale",
          rarity: ItemRarity.LEGENDARY,
          weight: 500, // 50%
          minQuantity: 1,
          maxQuantity: 3,
          goldValue: 2000,
        },
        {
          id: "dragon_claw",
          name: "Superior Dragon Claw",
          rarity: ItemRarity.LEGENDARY,
          weight: 300, // 30%
          minQuantity: 1,
          maxQuantity: 2,
          goldValue: 3000,
        },
        {
          id: "superior_dragon_chestplate",
          name: "Superior Dragon Chestplate",
          rarity: ItemRarity.LEGENDARY,
          weight: 150, // 15%
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 15000,
        },
        {
          id: "aspect_of_the_dragon",
          name: "Aspect of the Dragon",
          rarity: ItemRarity.LEGENDARY,
          weight: 40, // 4%
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 25000,
        },
        {
          id: "dragon_pet",
          name: "Superior Dragon Pet",
          rarity: ItemRarity.LEGENDARY,
          weight: 10, // 1%
          minQuantity: 1,
          maxQuantity: 1,
          goldValue: 100000,
        },
      ],
    });
  }

  private addDropPool(pool: DropPool) {
    this.dropPools.set(pool.poolId, pool);
  }

  /**
   * Hypixel-style drop calculation with multiple systems
   */
  public calculateHypixelDrops(
    poolId: string,
    playerMagicFind: HypixelStyleMagicFind,
    killStreak: number = 1,
    specialEvents: string[] = [],
  ): HypixelDropResult {
    const pool = this.dropPools.get(poolId);
    if (!pool) {
      throw new Error(`Drop pool ${poolId} not found`);
    }

    const result: HypixelDropResult = {
      items: [],
      coins: 0,
      experience: 0,
      collectionProgress: {},
      magicFindUsed: playerMagicFind.magicFind,
      specialEvents: [],
    };

    // 1. Roll for guaranteed drops first
    if (pool.guaranteedDrops) {
      for (const guaranteedItem of pool.guaranteedDrops) {
        const quantity = this.calculateQuantity(
          guaranteedItem,
          playerMagicFind,
        );
        result.items.push({
          ...guaranteedItem,
          quantity,
          wasUpgraded: false,
        });
      }
    }

    // 2. Determine number of drops to roll (Hypixel often does 0-3 drops)
    const dropCount = this.calculateDropCount(
      pool,
      playerMagicFind,
      killStreak,
    );

    // 3. Roll each drop independently
    for (let i = 0; i < dropCount; i++) {
      const droppedItem = this.rollFromPool(pool, playerMagicFind);
      if (droppedItem) {
        result.items.push(droppedItem);
      }
    }

    // 4. Calculate coins (separate from item drops)
    result.coins = this.calculateCoinDrop(playerMagicFind, killStreak);

    // 5. Apply special event bonuses
    this.applySpecialEventBonuses(result, specialEvents);

    return result;
  }

  /**
   * Roll a single item from the drop pool using weighted selection
   */
  private rollFromPool(
    pool: DropPool,
    magicFind: HypixelStyleMagicFind,
  ): HypixelDroppedItem | null {
    // Apply magic find to weights (higher rarity = more benefit)
    const adjustedItems = pool.items.map((item) => ({
      ...item,
      adjustedWeight: this.calculateAdjustedWeight(item, magicFind),
    }));

    const totalAdjustedWeight = adjustedItems.reduce(
      (sum, item) => sum + item.adjustedWeight,
      0,
    );
    const roll = Math.random() * totalAdjustedWeight;

    let currentWeight = 0;
    for (const item of adjustedItems) {
      currentWeight += item.adjustedWeight;
      if (roll <= currentWeight) {
        const quantity = this.calculateQuantity(item, magicFind);
        let finalItem = { ...item };
        let wasUpgraded = false;

        // Try to upgrade rarity if possible
        if (item.canUpgrade && this.rollForRarityUpgrade(magicFind)) {
          finalItem = this.upgradeItemRarity(finalItem);
          wasUpgraded = true;
        }

        return {
          ...finalItem,
          quantity,
          wasUpgraded,
        };
      }
    }

    return null; // No drop
  }

  /**
   * Calculate adjusted weight based on magic find (Hypixel-style)
   */
  private calculateAdjustedWeight(
    item: WeightedDropItem,
    magicFind: HypixelStyleMagicFind,
  ): number {
    let weight = item.weight;

    // Magic find affects rare items more than common ones
    const rarityMultipliers = {
      [ItemRarity.COMMON]: 1.0,
      [ItemRarity.UNCOMMON]: 1.1,
      [ItemRarity.RARE]: 1.3,
      [ItemRarity.EPIC]: 1.7,
      [ItemRarity.LEGENDARY]: 2.5,
      [ItemRarity.MYTHIC]: 4.0,
    };

    const baseMagicFindBonus = magicFind.magicFind / 100;
    const rarityMultiplier = rarityMultipliers[item.rarity] || 1.0;
    const magicFindEffect = 1 + baseMagicFindBonus * rarityMultiplier;

    return weight * magicFindEffect;
  }

  /**
   * Roll for rarity upgrade (Hypixel pets/items can upgrade)
   */
  private rollForRarityUpgrade(magicFind: HypixelStyleMagicFind): boolean {
    const upgradeChance = Math.min(magicFind.rarityUpgradeChance / 100, 0.15); // Cap at 15%
    return Math.random() < upgradeChance;
  }

  /**
   * Upgrade item to next rarity tier
   */
  private upgradeItemRarity(item: WeightedDropItem): WeightedDropItem {
    const rarityOrder = [
      ItemRarity.COMMON,
      ItemRarity.UNCOMMON,
      ItemRarity.RARE,
      ItemRarity.EPIC,
      ItemRarity.LEGENDARY,
      ItemRarity.MYTHIC,
    ];

    const currentIndex = rarityOrder.indexOf(item.rarity);
    if (currentIndex >= 0 && currentIndex < rarityOrder.length - 1) {
      return {
        ...item,
        rarity: rarityOrder[currentIndex + 1],
        goldValue: Math.floor(item.goldValue * 2.5), // Upgraded items worth more
        name: `Upgraded ${item.name}`,
      };
    }

    return item;
  }

  /**
   * Calculate how many items should drop (0-maxDrops)
   */
  private calculateDropCount(
    pool: DropPool,
    magicFind: HypixelStyleMagicFind,
    killStreak: number,
  ): number {
    // Base drop chance increases with magic find and kill streak
    const baseDropChance = 0.6; // 60% chance for at least 1 drop
    const magicFindBonus = magicFind.magicFind / 500; // Every 500 MF = +20% drop chance
    const killStreakBonus = Math.min(killStreak * 0.02, 0.3); // Max 30% bonus

    const dropChance = Math.min(
      baseDropChance + magicFindBonus + killStreakBonus,
      0.95,
    );

    let dropCount = 0;

    // Roll for each possible drop
    for (let i = 0; i < pool.maxDrops; i++) {
      if (Math.random() < dropChance) {
        dropCount++;
      }

      // Each additional drop is harder to get
      dropChance *= 0.6;
    }

    return dropCount;
  }

  /**
   * Calculate item quantity with looting bonus
   */
  private calculateQuantity(
    item: WeightedDropItem,
    magicFind: HypixelStyleMagicFind,
  ): number {
    const baseQuantity =
      Math.floor(Math.random() * (item.maxQuantity - item.minQuantity + 1)) +
      item.minQuantity;

    // Looting affects common items more
    const lootingBonus =
      item.rarity === ItemRarity.COMMON
        ? magicFind.looting / 100
        : magicFind.looting / 300;
    const bonusQuantity = Math.floor(baseQuantity * lootingBonus);

    return baseQuantity + bonusQuantity;
  }

  /**
   * Calculate coin drops (separate from items)
   */
  private calculateCoinDrop(
    magicFind: HypixelStyleMagicFind,
    killStreak: number,
  ): number {
    const baseCoinRange = { min: 5, max: 25 };
    const baseCoins =
      Math.floor(Math.random() * (baseCoinRange.max - baseCoinRange.min + 1)) +
      baseCoinRange.min;

    // Scavenging affects coin drops
    const scavengingMultiplier = 1 + magicFind.scavenging / 100;
    const killStreakMultiplier = 1 + Math.min(killStreak * 0.01, 0.5); // Max 50% bonus

    return Math.floor(baseCoins * scavengingMultiplier * killStreakMultiplier);
  }

  /**
   * Apply special event bonuses (2x drops, etc.)
   */
  private applySpecialEventBonuses(
    result: HypixelDropResult,
    events: string[],
  ) {
    if (events.includes("double_drops")) {
      result.items.forEach((item) => {
        item.quantity *= 2;
      });
      result.specialEvents.push("Double drops event active!");
    }

    if (events.includes("magic_find_boost")) {
      result.magicFindUsed *= 1.5;
      result.specialEvents.push("Magic find boost active!");
    }
  }

  /**
   * Get player's magic find stats (would come from equipment/pets/potions)
   */
  public getPlayerMagicFind(
    playerLevel: number,
    equipment: any[] = [],
    pets: any[] = [],
  ): HypixelStyleMagicFind {
    // This would normally calculate from equipment, pets, potions, etc.
    return {
      magicFind: playerLevel * 3 + 50, // Base 50 + 3 per level
      petLuck: 0,
      looting: playerLevel * 2,
      fortune: 0,
      scavenging: playerLevel * 5,
      dropRateModifier: 1.0,
      rarityUpgradeChance: playerLevel * 0.1, // 0.1% per level
      collectionBonuses: {},
    };
  }
}

// =============================================================================
// RESULT INTERFACES
// =============================================================================

interface HypixelDroppedItem extends WeightedDropItem {
  quantity: number;
  wasUpgraded: boolean;
}

interface HypixelDropResult {
  items: HypixelDroppedItem[];
  coins: number;
  experience: number;
  collectionProgress: { [itemType: string]: number };
  magicFindUsed: number;
  specialEvents: string[];
}

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

export function demonstrateHypixelSystem() {
  const hypixelLoot = new HypixelStyleLootHandler();

  // Simulate a level 50 player with good magic find
  const playerMagicFind = hypixelLoot.getPlayerMagicFind(50);

  console.log("=== HYPIXEL-STYLE LOOT SIMULATION ===");
  console.log("Player Magic Find:", playerMagicFind);

  // Kill 10 zombies to see the drop variety
  for (let i = 0; i < 10; i++) {
    const drops = hypixelLoot.calculateHypixelDrops(
      "zombie_crypt",
      playerMagicFind,
      i + 1, // Kill streak
      i === 4 ? ["double_drops"] : [], // Special event on 5th kill
    );

    console.log(`\n--- Kill ${i + 1} ---`);
    console.log(`Coins: ${drops.coins}`);
    drops.items.forEach((item) => {
      const upgrade = item.wasUpgraded ? " (UPGRADED!)" : "";
      console.log(`${item.name} x${item.quantity} (${item.rarity})${upgrade}`);
    });

    if (drops.specialEvents.length > 0) {
      console.log("Special:", drops.specialEvents.join(", "));
    }
  }
}
