import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  private startTime: number;

  constructor() {
    this.startTime = Date.now(); // record app start timestamp
  }

  getUptime() {
    const now = Date.now();
    const diffMs = now - this.startTime;

    const seconds = Math.floor(diffMs / 1000) % 60;
    const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  }

  getStatus() {
    return {
      status: "ok",
      uptime: this.getUptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
