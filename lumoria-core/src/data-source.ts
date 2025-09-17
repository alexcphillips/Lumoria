import { DataSource } from "typeorm";
import { Item } from "./entities/item.entity";
import { Enemy } from "./entities/enemy.entity";
import { User } from "./entities/user.entity";
import {
  EnemyLoot,
  EnemyLootSource,
  LootTable,
  LootTableEntry,
} from "./entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "lumoria",
  password: process.env.DB_PASSWORD || "lumoria",
  database: process.env.DB_DATABASE || "lumoria",
  entities: [
    Item,
    Enemy,
    User,
    EnemyLootSource,
    EnemyLoot,
    LootTable,
    LootTableEntry,
  ],
  synchronize: true, // dev only
  logging: process.env.NODE_ENV === "development",
});
