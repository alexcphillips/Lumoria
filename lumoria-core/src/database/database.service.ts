import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource, private config: ConfigService) {}

  getHost(): string {
    return this.config.get<string>("DB_HOST", "localhost");
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.dataSource.query("SELECT 1");
      return true;
    } catch (err) {
      console.error("Database connection failed:", err);
      return false;
    }
  }
}
