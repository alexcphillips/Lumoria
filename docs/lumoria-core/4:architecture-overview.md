# Lumoria Architecture Overview

This document provides a high-level view of the Lumoria backend services and their responsibilities.

---

## Services Overview

### 1. Lumoria Core

- **Type:** API Service
- **Framework:** NestJS (TypeScript)
- **Responsibilities:**
  - Handles all core application logic
  - Manages users, items, weapons, and enemies
  - Implements authentication and authorization (JWT)
  - Exposes REST API endpoints for the frontend or other services
  - Connects to the database for persistence

---

### 2. Lumoria Live

- **Type:** Real-time / Live Service
- **Framework:** TypeScript + WebSockets
- **Responsibilities:**
  - Handles live game sessions and real-time events
  - Manages in-game state synchronization
  - Sends updates to connected clients (players)
  - May interact with core API for persistent data

---

### 3. Database (PostgreSQL)

- **Type:** Relational Database
- **Responsibilities:**
  - Stores all persistent data (users, items, weapons, enemies, sessions)
  - Supports transactions and queries for core and live services
  - Managed via Docker for local development
  - Accessible to services via environment-configured connection

---

### 4. Optional / Future Services

- **Caching Service (Redis)** – For session management, leaderboards, or frequently accessed data
- **Worker / Background Jobs** – For heavy or scheduled tasks (like generating loot, sending notifications)
- **Monitoring & Health Checks** – Observability for uptime and errors

---

## Key Points

- Each service runs independently in Docker containers.
- Services communicate over internal Docker network using service names (`db` for database).
- Environment variables configure sensitive information (DB credentials, JWT secrets, ports).
- Core logic and real-time logic are intentionally separated to allow scalability.
