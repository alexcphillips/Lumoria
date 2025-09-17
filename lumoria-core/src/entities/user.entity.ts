import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../models/roles.enum";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string; // Will be hashed

  @Column({ type: "varchar", nullable: true })
  username?: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role!: Role;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Game-specific fields (for future)
  @Column({ type: "int", default: 1 })
  level!: number;

  @Column({ type: "int", default: 0 })
  experience!: number;

  @Column({ type: "json", nullable: true })
  gameProgress?: {
    currentRegion?: string;
    discoveredLocations?: string[];
    playerPosition?: {
      x: number;
      y: number;
      region: string;
    };
  };
}
