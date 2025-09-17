import { Room, Client } from "colyseus";
import { Schema, type } from "@colyseus/schema";

export class LobbyState extends Schema {
  @type("number") playerCount: number = 0;
  @type(["string"]) availableRooms: string[] = [];
  @type("number") lastUpdate: number = 0;

  constructor() {
    super();
    this.lastUpdate = Date.now();
  }

  updatePlayerCount(count: number) {
    this.playerCount = count;
    this.lastUpdate = Date.now();
  }

  addAvailableRoom(roomId: string) {
    if (!this.availableRooms.includes(roomId)) {
      this.availableRooms.push(roomId);
      this.lastUpdate = Date.now();
    }
  }

  removeAvailableRoom(roomId: string) {
    const index = this.availableRooms.indexOf(roomId);
    if (index > -1) {
      this.availableRooms.splice(index, 1);
      this.lastUpdate = Date.now();
    }
  }
}

export class LobbyRoom extends Room<LobbyState> {
  onCreate(options: any) {
    console.log("LobbyRoom created", options);

    this.setState(new LobbyState());
    this.maxClients = process.env.MAX_CLIENTS_PER_LOBBY
      ? parseInt(process.env.MAX_CLIENTS_PER_LOBBY)
      : 40;

    this.setupMessageHandlers();
  }

  onJoin(client: Client, _options: any) {
    console.log(`Client ${client.sessionId} joined lobby`);
    this.state.updatePlayerCount(this.clients.length);

    // Send current lobby state to the new client
    client.send("lobby_state", {
      playerCount: this.state.playerCount,
      availableRooms: this.state.availableRooms,
    });
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`Client ${client.sessionId} left lobby`);
    this.state.updatePlayerCount(this.clients.length);
  }

  onDispose() {
    console.log("LobbyRoom disposed");
  }

  private setupMessageHandlers() {
    this.onMessage("request_rooms", (client) => {
      // In a real implementation, you'd query your room registry
      client.send("available_rooms", {
        rooms: this.state.availableRooms,
      });
    });

    this.onMessage("create_room", (client, _message) => {
      // Handle room creation request
      client.send("room_creation_response", {
        success: true,
        roomId: `game_${Date.now()}`,
      });
    });

    this.onMessage("join_room", (client, message) => {
      // Handle room join request
      if (message.roomId) {
        client.send("room_join_response", {
          success: true,
          roomId: message.roomId,
        });
      }
    });
  }
}
