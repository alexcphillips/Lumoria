import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Item } from "./item.entity";

@Entity()
export class ItemEffect {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Item, (item) => item.effects)
  item!: Item;

  @Column()
  effectType!: string; // 'damageBoost', 'heal', 'magicFind''

  @Column("json")
  effectData: any; // e.g., { amount: 10, duration: 30, damageType: 'fire' }
}
