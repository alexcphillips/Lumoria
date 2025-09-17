// src/entities/enemy-loot-source.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Enemy } from "../enemy.entity";
import { LootTable } from "./loot-table.entity";

@Entity("enemy_loot_sources")
export class EnemyLootSource {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Enemy, (enemy) => enemy.lootTables, { onDelete: "CASCADE" })
  enemy!: Enemy;

  @ManyToOne(() => LootTable, { eager: true })
  lootTable!: LootTable;

  @Column("int", { default: 1 })
  rolls!: number; // how many pulls from the table

  @Column("float", { default: 1.0 })
  chance!: number; // probability of attempting this loot source
}
