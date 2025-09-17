import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { EnemyLoot } from "./enemy-loot.entity";

@Entity("enemies")
export class Enemy {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("json")
  attributes!: Record<string, number>; // hp, attack, defense, etc.

  @OneToMany(() => EnemyLoot, (enemyLoot) => enemyLoot.enemy, { cascade: true })
  lootTables!: EnemyLoot[];

  @Column("json", { nullable: true })
  extraLoot?: Array<{
    itemId: string;
    dropChance: number;
    minQuantity?: number;
    maxQuantity?: number;
    uniquePerKill?: boolean;
  }>;
}
