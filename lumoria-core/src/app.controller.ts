import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health/health.service";
import { Health } from "./models/health.model";

@Controller()
export class AppController {
  constructor(private healthService: HealthService) {}

  @Get()
  getHealth(): Health {
    return this.healthService.getStatus();
  }
}
