import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { LootTable } from "./loot-table.entity";

@Entity("loot_table_entries")
export class LootTableEntry {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => LootTable, (table) => table.entries)
  lootTable!: LootTable;

  @Column()
  itemId!: string; // references Item entity

  @Column("float")
  dropChance!: number; // weighted chance to drop (0 to 100) eg 25.5 = 25.5%

  @Column({ default: 1 })
  minQuantity!: number;

  @Column({ default: 1 })
  maxQuantity!: number;

  @Column({ default: false })
  uniquePerKill!: boolean;
}
