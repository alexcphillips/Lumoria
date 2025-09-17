import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "../dto/auth/login.dto";
import { RegisterDto } from "../dto/auth/register.dto";
import { User, UserProfile } from "../models/user.model";
import { Role } from "../models/roles.enum";

export interface AuthResult {
  access_token: string;
  user: UserProfile;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  // In-memory user store (replace with real database later)
  private users: User[] = [];

  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = this.users.find(
      (user) => user.email === registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      level: 1,
      experience: 0,
    };

    this.users.push(newUser);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const access_token = this.jwtService.sign(payload);

    // Return user profile (without password)
    const userProfile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      isActive: newUser.isActive,
      level: newUser.level,
      experience: newUser.experience,
      gameProgress: newUser.gameProgress,
    };

    return {
      access_token,
      user: userProfile,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    // Find user by email
    const user = this.users.find((u) => u.email === loginDto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    // Return user profile (without password)
    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
    };

    return {
      access_token,
      user: userProfile,
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserProfile | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Return user profile (without password)
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
    };
  }

  async findUserById(userId: string): Promise<UserProfile | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      return null;
    }

    // Return user profile (without password)
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
    };
  }

  // Development helper - get all users (remove in production)
  getAllUsers(): UserProfile[] {
    return this.users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
    }));
  }

  // Admin methods
  async deleteUser(userId: string): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    this.users.splice(userIndex, 1);
  }

  async updateUserRole(userId: string, role: Role): Promise<void> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.role = role;
    user.updatedAt = new Date();
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find((u) => u.id === userId) || null;
  }
}
