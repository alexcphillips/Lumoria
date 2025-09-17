import { SetMetadata } from "@nestjs/common";
import { Role } from "../models/roles.enum";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Convenience decorators for specific roles
export const AdminOnly = () => Roles(Role.ADMIN, Role.SUPERADMIN);
export const SuperAdminOnly = () => Roles(Role.SUPERADMIN);
