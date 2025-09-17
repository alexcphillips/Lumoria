# Lumoria Loot Drop System

A comprehensive, human-readable loot drop system for the Lumoria multiplayer game.

## Features

- 🎯 **Human-readable percentages** - Use simple percentages instead of confusing base-10000 systems
- 🎮 **Magic Find system** - Level-based bonuses for better loot
- 💎 **Six rarity tiers** - Common, Uncommon, Rare, Epic, Legendary, Mythic
- 🐉 **Ultra-rare items** - Crown of Eternal Dominion (1 in 4 million chance)
- 💰 **Smart gold drops** - Configurable gold chances with magic find bonuses
- 📊 **Detailed logging** - Track all drops for debugging and analytics
- 🔧 **Easy configuration** - Simple constants for tweaking drop rates

## Quick Start

```typescript
import { lootDropHandler } from "./handlers/LootDropHandler";

// Get player's magic find stats
const magicFind = lootDropHandler.getPlayerMagicFind(player);

// Calculate drops when enemy dies
const drops = lootDropHandler.calculateDrops(
  EnemyType.DRAGON,
  10,
  player,
  magicFind,
);

// Process the drops
drops.items.forEach((item) => {
  player.inventory.addItem(item.id, item.quantity);
});
player.gold += drops.gold;
```

## Drop Rates Configuration

All drop rates use human-readable percentages defined in `DROP_PERCENTAGES`:

```typescript
export const DROP_PERCENTAGES = {
  GUARANTEED: 100, // Always drops
  VERY_HIGH: 80, // 4 out of 5 kills
  HIGH: 50, // 1 out of 2 kills
  MEDIUM: 30, // 3 out of 10 kills
  MEDIUM_LOW: 15, // 1.5 out of 10 kills
  LOW: 5, // 1 out of 20 kills
  VERY_LOW: 2, // 1 out of 50 kills
  RARE: 1, // 1 out of 100 kills
  VERY_RARE: 0.5, // 1 out of 200 kills
  ULTRA_RARE: 0.25, // 1 out of 400 kills
  EPIC_RARE: 0.1, // 1 out of 1,000 kills
  MYTHIC_ULTRA_RARE: 0.000025, // 1 out of 4,000,000 kills
};
```

## Magic Find System

Players gain magic find bonuses based on their level:

- **Base Magic Find**: 5% per level
- **Rare Item Bonus**: 2% per level (applies to rare+ items)
- **Quantity Bonus**: 0.5% per level (more items)
- **Gold Find Bonus**: 10% per level (more gold)

## Item Rarity Tiers

1. **Common** (gray) - Basic materials and low-value items
2. **Uncommon** (green) - Better gear and useful items
3. **Rare** (blue) - Valuable equipment and magic items
4. **Epic** (purple) - Powerful gear with special properties
5. **Legendary** (orange) - Extremely rare and powerful items
6. **Mythic** (red) - Ultra-rare artifacts and endgame items

## Current Drop Tables

### Goblin (Level 1)

- **Goblin Ear**: 30% chance, 1-2 quantity, 5 gold value
- **Rusty Dagger**: 15% chance, 1 quantity, 25 gold value
- **Goblin Healing Potion**: 5% chance, 1 quantity, 50 gold value (Uncommon)
- **Goblin's Lucky Ring**: 0.5% chance, 1 quantity, 200 gold value (Rare)
- **Gold**: 80% chance, 5-15 amount

### Orc (Level 3)

- **Orc Tooth**: 100% guaranteed, 1-3 quantity, 8 gold value
- **Iron Battle Axe**: 20% chance, 1 quantity, 75 gold value (Uncommon)
- **Crude Orc Armor**: 12% chance, 1 quantity, 100 gold value (Uncommon)
- **Rune of Strength**: 2% chance, 1 quantity, 300 gold value (Rare)
- **Orc Warlord Helmet**: 0.25% chance, 1 quantity, 800 gold value (Epic)
- **Gold**: 90% chance, 15-35 amount

### Dragon (Level 10 Boss)

- **Ancient Dragon Scale**: 100% guaranteed, 3-7 quantity, 500 gold value (Epic)
- **Dragon Heart**: 100% guaranteed, 1 quantity, 2000 gold value (Legendary)
- **Dragonfire Blade**: 15% chance, 1 quantity, 5000 gold value (Legendary)
- **Dragon Scale Armor**: 10% chance, 1 quantity, 7500 gold value (Legendary)
- **Orb of Draconic Power**: 1% chance, 1 quantity, 20000 gold value (Mythic)
- **Crown of Eternal Dominion**: 0.000025% chance, 1 quantity, 1000000 gold value (Mythic)
- **Gold**: 100% guaranteed, 500-1500 amount

## Adding New Drop Tables

```typescript
lootDropHandler.addCustomDropTable({
  enemyType: EnemyType.SKELETON,
  level: 5,
  description: "Undead skeleton drops",
  guaranteedDrops: [
    {
      id: "bone",
      name: "Ancient Bone",
      rarity: ItemRarity.COMMON,
      dropChancePercent: DROP_PERCENTAGES.GUARANTEED,
      quantity: { min: 1, max: 3 },
      goldValue: 10,
    },
  ],
  possibleDrops: [
    {
      id: "bone_sword",
      name: "Bone Sword",
      rarity: ItemRarity.UNCOMMON,
      dropChancePercent: DROP_PERCENTAGES.MEDIUM,
      quantity: { min: 1, max: 1 },
      goldValue: 150,
    },
  ],
  goldDrop: {
    amount: { min: 10, max: 30 },
    chancePercent: DROP_PERCENTAGES.HIGH,
  },
});
```

## Configuration

Adjust magic find scaling in `MAGIC_FIND_CONFIG`:

```typescript
export const MAGIC_FIND_CONFIG = {
  BASE_MAGIC_FIND_PER_LEVEL: 5, // 5% magic find per level
  RARE_BONUS_PER_LEVEL: 2, // 2% rare+ bonus per level
  QUANTITY_BONUS_PER_LEVEL: 0.5, // 0.5% quantity bonus per level
  GOLD_FIND_PER_LEVEL: 10, // 10% gold find per level
  GOLD_CHANCE_REDUCTION_FACTOR: 200, // Divide magic find by this for gold chance
  MAX_DROP_CHANCE: 100, // Cap drop chance at 100%
};
```

## Debugging

The system provides detailed logging for all drops:

```
🎁 Loot drop for PlayerName from DRAGON:
   Magic Find: 250%, Rarity Bonus: 100%
   📦 Ancient Dragon Scale x5 (epic)
   📦 Dragon Heart x1 (legendary)
   📦 Dragonfire Blade x1 (legendary)
   💰 1247 gold
```

## API Reference

### Main Methods

- `calculateDrops(enemyType, level, player, magicFind)` - Calculate drops for killed enemy
- `getPlayerMagicFind(player)` - Get player's magic find stats
- `addCustomDropTable(table)` - Add new drop table
- `getDropTableInfo(enemyType, level)` - Get drop table for debugging

### Interfaces

- `DropItem` - Individual item that can drop
- `DropTable` - Complete drop configuration for enemy type/level
- `MagicFindStats` - Player's magic find bonuses
- `DropResult` - Result of drop calculation

## Integration with Unity

The loot system integrates seamlessly with Unity through Colyseus messages. When an enemy dies, the server calculates drops and sends them to all clients for display and inventory updates.

## Future Enhancements

- Equipment-based magic find bonuses
- Seasonal/event-specific drop tables
- Player trade value calculations
- Drop history and analytics
- Conditional drops based on player achievements
