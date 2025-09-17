import { Controller, Get, Param, Post, Body, Inject } from "@nestjs/common";
import {
  AppService,
  MapRegion,
  MapLocation,
  PlayerPosition,
} from "./app.service";

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getWelcome(): { message: string; version: string } {
    return this.appService.getWelcome();
  }

  @Get("map/regions")
  getAllRegions(): MapRegion[] {
    return this.appService.getAllRegions();
  }

  @Get("map/regions/:regionId")
  getRegion(@Param("regionId") regionId: string): MapRegion | null {
    return this.appService.getRegion(regionId);
  }

  @Get("map/locations/:locationId")
  getLocation(@Param("locationId") locationId: string): MapLocation | null {
    return this.appService.getLocationById(locationId);
  }

  @Get("map/locations")
  getDiscoveredLocations(): MapLocation[] {
    return this.appService.getDiscoveredLocations();
  }

  @Post("map/discover/:locationId")
  discoverLocation(
    @Param("locationId") locationId: string,
  ): MapLocation | null {
    return this.appService.discoverLocation(locationId);
  }

  @Post("map/vision")
  getPlayerVisibleMap(
    @Body() payload: { position: PlayerPosition; visionRadius?: number },
  ): { visibleLocations: MapLocation[]; currentRegion: MapRegion | null } {
    return this.appService.getPlayerVisibleMap(
      payload.position,
      payload.visionRadius,
    );
  }
}
