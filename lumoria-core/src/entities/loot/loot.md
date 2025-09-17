# Loot System Overview

## 1. Entities

### Enemy

Represents a creature or opponent in the game.

**Fields:**

- `id`, `name`, `attributes` (HP, attack, defense, etc.)
- `lootSources`: References standard loot tables for the enemy.
- `extraLoot`: Optional per-enemy custom loot, including unique drops and drop chances.

### LootTable

Represents a table of possible items to drop.

**Fields:**

- `id`, `name`
- `items`: Array of items with probabilities, min/max quantities, and other metadata.
- `ultraRare`: Optional subset of items rolled independently.

### EnemyLootSource

Connects an `Enemy` to one or more `LootTables`.

**Fields:**

- `enemy`: The enemy that can drop from this table.
- `lootTable`: The referenced loot table.
- `rolls`: Number of independent attempts for this loot table.
- `chance`: Probability of attempting a roll at all.

---

## 2. High-Level Loot Flow

### 2.1 Enemy Defeat

When an enemy dies, the loot system triggers.

### 2.2 Roll EnemyLootSource Tables

Each `EnemyLootSource` is considered:

1. Check `chance` to determine if the table is rolled.
2. Perform `rolls` number of independent attempts.
3. For each roll, randomly select an item from the referenced `LootTable` based on item probabilities.

### 2.3 Roll Extra Loot

Any `extraLoot` defined directly on the enemy is rolled independently:

- Supports `uniquePerKill`, min/max quantities, and special effects.

### 2.4 Handle Ultra-Rare Items

- Ultra-rare items can be defined per table or per enemy.
- Rolled independently of general loot to allow extremely low chances without affecting regular drops.

### 2.5 Remove Duplicates (Optional)

- If `uniquePerKill` is set, duplicate items in the same kill are prevented.

### 2.6 Finalize Loot

- All successful rolls are added to the player’s inventory.
- Optional: trigger special effects (e.g., potions, fire damage buffs, teleporting weapons).

---

## 3. Notes on Design

- **Multiple Rolls:** Enables multiple independent attempts at rare or common drops.
- **Chance to Get Nothing:** Simply allow probabilities that sum to less than 100%.
- **Hybrid System:** Combines a general loot table, enemy-specific extra loot, and ultra-rare independent rolls.
- **Extensible:** You can add new item effects or unique loot behaviors without modifying the core loot tables.
