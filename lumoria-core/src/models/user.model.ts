// Business logic interfaces - keep these for type safety
import { Role } from "./roles.enum";

export interface User {
  id: string;
  email: string;
  password: string; // This will be hashed
  username?: string;
  isActive: boolean;
  role: Role;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  level: number;
  experience: number;
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

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  isActive: boolean;
  role: Role;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  level: number;
  experience: number;
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

// Note: DTOs have been moved to src/dto/user/ for better organization
// Use CreateUserDto and UpdateUserDto from '../dto/user/' instead
