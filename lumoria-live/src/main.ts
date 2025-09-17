import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import dotenv from "dotenv";

// Import rooms

import { GameRoom } from "./rooms/GameRoom";
import { LobbyRoom } from "./rooms/LobbyRoom";

// Load environment variables
dotenv.config();

const port = Number(process.env.PORT) || 3001;
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Create Colyseus server
const gameServer = new Server({
  server,
  presence: process.env.REDIS_URL
    ? new (require("@colyseus/redis-presence").RedisPresence)()
    : undefined,
});

// Register room handlers
gameServer.define("lobby", LobbyRoom);
gameServer.define("game", GameRoom, {
  maxClients: parseInt(process.env.MAX_CLIENTS_PER_ROOM || "50"),
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    activeRooms: 0, // Will implement room counting later
  });
});

// Development tools
if (process.env.NODE_ENV !== "production") {
  // Colyseus monitor
  app.use("/colyseus", monitor());

  // Colyseus playground
  app.use("/", playground);
}

// Start the server
gameServer.listen(port);
console.log(`🎮 Lumoria Live Server listening on port ${port}`);
console.log(`📊 Monitor: http://localhost:${port}/colyseus`);
console.log(`🎯 Playground: http://localhost:${port}`);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Shutting down server...");
  gameServer.gracefullyShutdown();
});

export default gameServer;
