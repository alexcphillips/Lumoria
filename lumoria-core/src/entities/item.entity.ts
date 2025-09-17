import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("items")
export class Item {
  @PrimaryColumn()
  item_id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string; // e.g., "weapon", "potion", "quest"

  @Column("json", { nullable: true })
  effects?: Record<string, any>; // e.g., { damageBonus: 10, heal: 50 }

  @Column()
  rarity!: string; // common, rare, epic, legendary
}
