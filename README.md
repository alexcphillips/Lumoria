# Lumoria

**Lumoria** is a multiplayer RPG project. This monorepo contains three main components:

1. **Lumoria Core (NestJS API)**
   - Handles user accounts, authentication, and core game logic.
   - Provides REST endpoints for game data like items, leaderboards, quests, and profiles.

2. **Lumoria Live (Colyseus Server)**
   - Real-time multiplayer server.
   - Manages player movement, combat, inventory, and synchronized game state.
   - Communicates with Unity clients for real-time gameplay.

3. **Lumoria Analytics**
   - Collects game events and statistics from the live server.
   - Stores events like logins, deaths, trades, and dungeon completions.
   - Provides data for charts, dashboards, and balancing decisions.

---

## Project Architecture

- **Unity Client:** The game itself, running on player machines.
- **Colyseus / Lumoria Live:** Handles all real-time interactions and ensures consistent game state across players.
- **Lumoria Core / NestJS API:** Provides persistent data storage, authentication, and REST endpoints for game features.
- **Lumoria Analytics API:** Tracks events from the live server for reporting and game balancing.

---
