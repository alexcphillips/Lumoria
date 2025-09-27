import { Test, TestingModule } from "@nestjs/testing";
import { HealthService } from "./health.service";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let healthController: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthService = app.get<HealthService>(HealthService);
    healthController = app.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(healthController).toBeDefined();
  });

  it("getHealth: should call healthService.getStatus()", () => {
    jest.spyOn(healthService, "getStatus").mockReturnValue(TEST_HEALTH);

    const health = healthController.getHealth();

    expect(healthService.getStatus).toHaveBeenCalled();
    expect(health).toEqual(TEST_HEALTH);
  });
});

const TEST_HEALTH = {
  status: "ok",
  uptime: { days: 0, hours: 0, minutes: 0, seconds: 0 },
  timestamp: new Date().toISOString(),
};
