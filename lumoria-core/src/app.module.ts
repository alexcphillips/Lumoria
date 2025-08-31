import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { HealthModule } from "./health/health.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
