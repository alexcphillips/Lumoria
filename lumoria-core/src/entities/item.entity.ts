import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("items")
export class Item {
  @PrimaryColumn()
  item_id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string; // consumable, equipment, etc.

  @Column("json", { nullable: true })
  effects!: Record<string, any>; // flexible map for buffs, heals, etc.
}
