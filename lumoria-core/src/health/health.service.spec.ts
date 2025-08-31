import { HealthService } from "./health.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getUptime", () => {
    it("should return an object with days, hours, minutes, and seconds", () => {
      const uptime = service.getUptime();
      expect(uptime).toHaveProperty("days");
      expect(uptime).toHaveProperty("hours");
      expect(uptime).toHaveProperty("minutes");
      expect(uptime).toHaveProperty("seconds");
    });

    it("should return non-negative values", () => {
      const uptime = service.getUptime();
      expect(uptime.days).toBeGreaterThanOrEqual(0);
      expect(uptime.hours).toBeGreaterThanOrEqual(0);
      expect(uptime.minutes).toBeGreaterThanOrEqual(0);
      expect(uptime.seconds).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getStatus", () => {
    it("should return status object with status, uptime, and timestamp", () => {
      const status = service.getStatus();
      expect(status).toHaveProperty("status", "ok");
      expect(status).toHaveProperty("uptime");
      expect(status).toHaveProperty("timestamp");
    });

    it("timestamp should be a valid ISO string", () => {
      const status = service.getStatus();
      expect(new Date(status.timestamp).toISOString()).toBe(status.timestamp);
    });
  });
});
