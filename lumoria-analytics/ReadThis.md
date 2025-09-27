# Lumoria Analytics API

## What this API does

This is the **third API** in the Lumoria project.

Its main responsibility is to **store analytics and statistics** about the game. For example:

- When players log in or log out
- Trades between players
- Dungeon completion times
- Player deaths

Eventually, the data collected here will be used to:

- Create charts and graphs
- Make informed decisions about game balancing
- Understand what players enjoy most and how they behave

---

## How it works

[Player Action] --> [Game Server] --> [Analytics API / DB] --> [Stats / Reports]

- Unity clients communicate with the **real-time game server** (`/lumoria-live`).
- The game server validates actions and sends **events** to this Analytics API.
- The API stores the events in a database and calculates aggregated **stats**.

---

## What we want here

- Run the API on **port 3002** (3000 and 3001 are used by other APIs).
- **GET /events** — fetch all stored events.
- **POST /event** — add a new event to the database (or start with an in-memory array `[]`).

---

## Getting started (step-by-step)

Follow these steps to reach the initial goal. You can research, use AI, or ask me if you need help — no worries.

1. **Set up Express**
   - Get an Express API running on port 3002.
   - Reference: [Express Hello World](https://expressjs.com/en/starter/hello-world.html)

2. **Add a GET endpoint**
   - Returns all stored events.
   - For now, use an in-memory array (`[]`) instead of a database.

3. **Add a POST endpoint**
   - Adds new events to the array/database.
   - The endpoint should expect a JSON object representing the event in the request body. Example:

```json
{
  "playerId": "player1",
  "type": "login",
  "timestamp": "2025-09-27T14:00:00Z"
}
```

4. **Test your endpoints**

- **Download Postman** to make requests: [https://www.postman.com/](https://www.postman.com/)

- **GET request**
  - URL: `http://localhost:3002/events`
  - This fetches all stored events.

- **POST request**
  - URL: `http://localhost:3002/event`
  - Set the body type to **raw JSON** and enter an event object, for example:

```json
{
  "playerId": "player1",
  "type": "login",
  "timestamp": "2025-09-27T14:00:00Z"
}
```

> **Tip:** JSON is the standard format for sending and receiving data in APIs.
