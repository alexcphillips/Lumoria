import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "../dto/auth/login.dto";
import { RegisterDto } from "../dto/auth/register.dto";
import { User } from "../entities/user.entity";
import { UserProfile } from "../models/user.model";

export interface AuthResult {
  access_token: string;
  user: UserProfile;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create new user
    const newUser = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
    });

    // Save to database
    const savedUser = await this.userRepository.save(newUser);

    // Generate JWT token
    const payload: JwtPayload = { sub: savedUser.id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    // Return user profile (without password)
    const userProfile: UserProfile = {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      isActive: savedUser.isActive,
      lastLoginAt: savedUser.lastLoginAt,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      level: savedUser.level,
      experience: savedUser.experience,
      gameProgress: savedUser.gameProgress,
      role: savedUser.role,
    };

    return {
      access_token,
      user: userProfile,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

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

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    // Return user profile (without password)
    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
      role: user.role,
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
    const user = await this.userRepository.findOne({
      where: { email },
    });

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
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
      role: user.role,
    };
  }

  async findUserById(userId: string): Promise<UserProfile | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // Return user profile (without password)
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
      role: user.role,
    };
  }

  // Game-specific methods
  async updateUserGameProgress(
    userId: string,
    gameProgress: UserProfile["gameProgress"],
  ): Promise<UserProfile | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    user.gameProgress = { ...user.gameProgress, ...gameProgress };
    const updatedUser = await this.userRepository.save(user);

    return this.findUserById(updatedUser.id);
  }

  async addExperience(
    userId: string,
    exp: number,
  ): Promise<UserProfile | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    user.experience += exp;

    // Level up logic (every 100 exp = 1 level)
    const newLevel = Math.floor(user.experience / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }

    const updatedUser = await this.userRepository.save(user);
    return this.findUserById(updatedUser.id);
  }

  // Development helper - get all users (remove in production)
  async getAllUsers(): Promise<UserProfile[]> {
    const users = await this.userRepository.find({
      order: { createdAt: "DESC" },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      level: user.level,
      experience: user.experience,
      gameProgress: user.gameProgress,
      role: user.role,
    }));
  }
}
