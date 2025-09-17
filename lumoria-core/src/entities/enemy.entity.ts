// src/entities/enemy.entity.ts
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("enemies")
export class Enemy {
  @PrimaryColumn()
  enemy_id!: string;

  @Column()
  name!: string;

  @Column("json")
  attributes!: Record<string, number>; // hp, attack, defense, etc.

  @Column()
  loot_table_id!: string;
}
