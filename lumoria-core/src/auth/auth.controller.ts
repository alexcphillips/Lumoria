import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Inject,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { AuthService, AuthResult } from "./auth.service";
import { LoginDto } from "../dto/auth/login.dto";
import { RegisterDto } from "../dto/auth/register.dto";
import { CreateAdminDto } from "../dto/auth/admin.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { UserProfile } from "../models/user.model";
import { AdminOnly, SuperAdminOnly } from "../decorators";
import { Role } from "../models/roles.enum";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<AuthResult> {
    return this.authService.login(loginDto);
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto): Promise<AuthResult> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: any): UserProfile {
    return req.user;
  }

  // Admin-only endpoint to get all users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @Get("users")
  getAllUsers(): UserProfile[] {
    return this.authService.getAllUsers();
  }

  // SuperAdmin-only endpoint to delete users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SuperAdminOnly()
  @Delete("users/:id")
  async deleteUser(@Param("id") id: string): Promise<{ message: string }> {
    await this.authService.deleteUser(id);
    return { message: `User ${id} deleted successfully` };
  }

  // SuperAdmin-only endpoint to promote users to admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SuperAdminOnly()
  @Patch("users/:id/promote")
  async promoteToAdmin(@Param("id") id: string): Promise<{ message: string }> {
    await this.authService.updateUserRole(id, Role.ADMIN);
    return { message: `User ${id} promoted to admin` };
  }

  // SuperAdmin-only endpoint to demote admins to users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SuperAdminOnly()
  @Patch("users/:id/demote")
  async demoteToUser(@Param("id") id: string): Promise<{ message: string }> {
    await this.authService.updateUserRole(id, Role.USER);
    return { message: `User ${id} demoted to user` };
  }

  // SuperAdmin-only endpoint to create admin users
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SuperAdminOnly()
  @Post("create-admin")
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AuthResult> {
    // Modify the DTO to set the role appropriately
    const registerDto = {
      ...createAdminDto,
    };

    const result = await this.authService.register(registerDto);
    // Update the role after creation if specified
    if (createAdminDto.role) {
      await this.authService.updateUserRole(
        result.user.id,
        createAdminDto.role,
      );
    }

    return result;
  }
}
