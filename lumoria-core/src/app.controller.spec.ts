import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { HealthService } from "./health/health.service";

describe("AppController", () => {
  let appController: AppController;
  let healthService: HealthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [HealthService],
    }).compile();

    healthService = app.get<HealthService>(HealthService);
    appController = app.get<AppController>(AppController);
  });

  describe("AppController", () => {
    it("should be defined", () => {
      expect(appController).toBeDefined();
    });

    it("getHealth: should call healthService.getStatus()", () => {
      jest.spyOn(healthService, "getStatus").mockReturnValue(TEST_HEALTH);

      const health = appController.getHealth();

      expect(healthService.getStatus).toHaveBeenCalled();
      expect(health).toEqual(TEST_HEALTH);
    });
  });
});

const TEST_HEALTH = {
  status: "ok",
  uptime: { days: 0, hours: 0, minutes: 0, seconds: 0 },
  timestamp: new Date().toISOString(),
};
