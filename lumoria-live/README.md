# Lumoria Live - Real-time Multiplayer Game Server

A Colyseus-based real-time multiplayer game server for Lumoria, featuring enemy AI, world events, and an advanced loot drop system.

## Features

### 🎮 Real-time Multiplayer

- WebSocket-based communication using Colyseus
- Game rooms and lobby system
- Player synchronization and state management
- Unity client integration ready

### 🤖 Enemy AI System

- State-based AI (Idle, Patrol, Chase, Attack)
- Configurable behavior parameters
- Real-time enemy position and state sync
- Automatic threat detection and engagement

### 🌍 Dynamic World Events

- Weather system (Clear, Rain, Storm)
- Boss spawn events
- Treasure chest appearances
- Server-wide announcements

### 🎁 Advanced Loot Drop System

- **Human-readable percentages** - Easy to configure and understand
- **Magic Find system** - Level-based bonuses for better loot
- **Six rarity tiers** - Common to Mythic items
- **Ultra-rare items** - Including the legendary Crown of Eternal Dominion (1 in 4 million)
- **Smart gold drops** - Configurable chances with magic find bonuses
- **Detailed logging** - Complete drop tracking and analytics

## Quick Start

### Installation

```bash
cd lumoria-live
npm install
```

### Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
PORT=3000
NODE_ENV=development
```

### Running the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## Project Structure

```
lumoria-live/
├── src/
│   ├── main.ts                 # Server entry point
│   ├── rooms/                  # Colyseus room definitions
│   │   ├── GameRoom.ts         # Main game room
│   │   └── LobbyRoom.ts        # Player matchmaking
│   ├── schemas/                # State synchronization schemas
│   │   ├── GameState.ts        # Overall game state
│   │   ├── Player.ts           # Player data structure
│   │   ├── Enemy.ts            # Enemy data structure
│   │   └── Math.ts             # Utility math schema
│   ├── handlers/               # Game logic handlers
│   │   ├── UnityMessageHandler.ts  # Unity client messages
│   │   ├── EnemyAIHandler.ts       # Enemy AI logic
│   │   ├── WorldEventHandler.ts    # Dynamic world events
│   │   └── LootDropHandler.ts      # Advanced loot system
│   └── types/
│       └── Messages.ts         # Message type definitions
├── docs/
│   └── LOOT_SYSTEM.md         # Comprehensive loot system guide
├── examples/
│   └── loot-system-examples.ts # Usage examples and testing
└── lib/                       # Compiled JavaScript output
```

## Loot Drop System

The centerpiece of Lumoria Live is its sophisticated loot drop system. See the [complete documentation](./docs/LOOT_SYSTEM.md) for details.

### Quick Example

```typescript
import { lootDropHandler } from "./src/handlers/LootDropHandler";

// When an enemy dies
const magicFind = lootDropHandler.getPlayerMagicFind(player);
const drops = lootDropHandler.calculateDrops(
  EnemyType.DRAGON,
  10,
  player,
  magicFind,
);

// Process the drops
drops.items.forEach((item) => {
  console.log(`${player.username} received ${item.name} x${item.quantity}`);
  // Add to player inventory
});
player.gold += drops.gold;
```

### Current Drop Tables

- **Goblins** (Level 1) - Basic materials, occasional rings
- **Orcs** (Level 3) - Weapons, armor, magic runes
- **Dragons** (Level 10) - Legendary items, ultra-rare Crown of Eternal Dominion

## Unity Integration

### Client Setup

1. Install Colyseus Unity SDK
2. Connect to the game server
3. Handle schema synchronization
4. Process game messages

### Example Unity Integration

```csharp
// Connect to game room
var room = await client.JoinOrCreate<GameState>("game_room");

// Handle loot drops
room.OnMessage<LootDropMessage>("loot_drop", (message) => {
    foreach(var item in message.items) {
        ShowLootPickup(item.name, item.quantity, item.rarity);
        playerInventory.AddItem(item.id, item.quantity);
    }

    if(message.gold > 0) {
        playerGold += message.gold;
        ShowGoldPickup(message.gold);
    }
});
```

## Enemy AI

Enemies use a state machine with the following behaviors:

- **Idle** - Standing still, scanning for players
- **Patrol** - Moving along predefined routes
- **Chase** - Pursuing detected players
- **Attack** - Engaging players in combat

Configure AI parameters in `EnemyAIHandler.ts`:

```typescript
const AI_CONFIG = {
  DETECTION_RANGE: 100,
  ATTACK_RANGE: 25,
  CHASE_SPEED: 80,
  PATROL_SPEED: 30,
  ATTACK_COOLDOWN: 2000,
};
```

## World Events

Dynamic events keep the world engaging:

### Weather Events

- **Clear** - Normal conditions
- **Rain** - Reduced visibility, water effects
- **Storm** - Lightning, heavy rain, dramatic atmosphere

### Special Events

- **Boss Spawns** - Rare powerful enemies
- **Treasure Chests** - Limited-time loot opportunities
- **Server Announcements** - Important game updates

Configure event timing in `WorldEventHandler.ts`.

## API Documentation

### Room Messages

#### From Unity to Server

- `player_move` - Player position updates
- `player_attack` - Combat actions
- `interact_object` - World interactions

#### From Server to Unity

- `enemy_update` - Enemy state changes
- `loot_drop` - Item and gold drops
- `world_event` - Dynamic world events
- `player_joined` / `player_left` - Player management

### State Synchronization

All game state is automatically synchronized via Colyseus schemas:

- **GameState** - Overall room state
- **Player** - Individual player data
- **Enemy** - Enemy positions and states
- **Math** - Utility structures (Vector2, etc.)

## Development

### Adding New Features

1. **New Enemy Types** - Extend `EnemyType` enum and add AI behaviors
2. **Custom Loot Tables** - Use `lootDropHandler.addCustomDropTable()`
3. **World Events** - Add handlers in `WorldEventHandler.ts`
4. **Unity Messages** - Define in `Messages.ts` and handle in `UnityMessageHandler.ts`

### Testing

Run the loot system examples:

```bash
npm run examples
```

### Building

Compile TypeScript:

```bash
npm run build
```

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Game Balance

Adjust gameplay balance in the configuration objects:

- **Drop rates** - `DROP_PERCENTAGES` in `LootDropHandler.ts`
- **Magic find scaling** - `MAGIC_FIND_CONFIG`
- **Enemy AI** - `AI_CONFIG` in `EnemyAIHandler.ts`
- **World events** - `EVENT_CONFIG` in `WorldEventHandler.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions and support, please create an issue in the repository or contact the development team.
