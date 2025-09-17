import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Enemy } from "./enemy.entity";
import { LootTable } from "./loot-table.entity";

@Entity("enemy_loot")
export class EnemyLoot {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Enemy, (enemy) => enemy.lootTables)
  enemy!: Enemy;

  @ManyToOne(() => LootTable)
  lootTable!: LootTable;

  @Column({ default: 1 })
  rolls!: number; // how many times to roll this table
}
