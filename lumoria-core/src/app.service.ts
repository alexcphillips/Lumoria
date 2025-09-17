import { Injectable } from "@nestjs/common";

export interface MapLocation {
  id: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  type: "city" | "dungeon" | "landmark" | "resource";
  description?: string;
  discovered: boolean;
}

export interface PlayerPosition {
  x: number;
  y: number;
  region: string;
}

export interface MapRegion {
  id: string;
  name: string;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  locations: MapLocation[];
}

@Injectable()
export class AppService {
  private readonly regions: MapRegion[] = [
    {
      id: "starting-region",
      name: "Lumoria Valley",
      bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 },
      locations: [
        {
          id: "town-center",
          name: "Lumoria Town",
          coordinates: { x: 50, y: 50 },
          type: "city",
          description: "The heart of Lumoria Valley",
          discovered: true,
        },
        {
          id: "ancient-ruins",
          name: "Ancient Ruins",
          coordinates: { x: 25, y: 75 },
          type: "dungeon",
          description: "Mysterious ruins from a forgotten age",
          discovered: false,
        },
        {
          id: "crystal-cave",
          name: "Crystal Cave",
          coordinates: { x: 80, y: 30 },
          type: "resource",
          description: "A cave rich in magical crystals",
          discovered: false,
        },
      ],
    },
  ];

  getWelcome(): { message: string; version: string } {
    return {
      message: "Welcome to Lumoria API",
      version: "1.0.0",
    };
  }

  getAllRegions(): MapRegion[] {
    return this.regions;
  }

  getRegion(regionId: string): MapRegion | null {
    return this.regions.find((region) => region.id === regionId) || null;
  }

  getLocationById(locationId: string): MapLocation | null {
    for (const region of this.regions) {
      const location = region.locations.find((loc) => loc.id === locationId);
      if (location) return location;
    }
    return null;
  }

  getLocationsInRegion(regionId: string): MapLocation[] {
    const region = this.getRegion(regionId);
    return region ? region.locations : [];
  }

  discoverLocation(locationId: string): MapLocation | null {
    const location = this.getLocationById(locationId);
    if (location) {
      location.discovered = true;
      return location;
    }
    return null;
  }

  getDiscoveredLocations(): MapLocation[] {
    const discovered: MapLocation[] = [];
    for (const region of this.regions) {
      discovered.push(...region.locations.filter((loc) => loc.discovered));
    }
    return discovered;
  }

  getPlayerVisibleMap(
    playerPosition: PlayerPosition,
    visionRadius: number = 10,
  ): {
    visibleLocations: MapLocation[];
    currentRegion: MapRegion | null;
  } {
    const currentRegion =
      this.regions.find(
        (region) =>
          playerPosition.x >= region.bounds.minX &&
          playerPosition.x <= region.bounds.maxX &&
          playerPosition.y >= region.bounds.minY &&
          playerPosition.y <= region.bounds.maxY,
      ) || null;

    const visibleLocations: MapLocation[] = [];

    if (currentRegion) {
      for (const location of currentRegion.locations) {
        const distance = Math.sqrt(
          Math.pow(location.coordinates.x - playerPosition.x, 2) +
            Math.pow(location.coordinates.y - playerPosition.y, 2),
        );

        if (distance <= visionRadius) {
          visibleLocations.push(location);
          // Auto-discover locations that come into view
          location.discovered = true;
        }
      }
    }

    return {
      visibleLocations,
      currentRegion,
    };
  }

  validatePlayerPosition(position: PlayerPosition): boolean {
    const region = this.regions.find((r) => r.id === position.region);
    if (!region) return false;

    return (
      position.x >= region.bounds.minX &&
      position.x <= region.bounds.maxX &&
      position.y >= region.bounds.minY &&
      position.y <= region.bounds.maxY
    );
  }
}
