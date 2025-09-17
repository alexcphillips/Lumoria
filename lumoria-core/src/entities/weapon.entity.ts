import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("weapons")
export class Weapon {
  @PrimaryColumn()
  weapon_id!: string;

  @Column()
  name!: string;

  @Column("int")
  attack!: number;

  @Column()
  rarity!: string;
}
