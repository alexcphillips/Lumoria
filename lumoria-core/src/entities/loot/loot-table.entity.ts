import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { LootTableEntry } from "./loot-table-entry.entity";

@Entity("loot_tables")
export class LootTable {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string; // e.g. "general_zombie_loot"

  @OneToMany(() => LootTableEntry, (entry) => entry.lootTable, {
    cascade: true,
  })
  entries!: LootTableEntry[];
}
