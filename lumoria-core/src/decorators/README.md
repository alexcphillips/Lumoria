# Admin Role System Documentation

This document describes the implementation of role-based access control (RBAC) in the Lumoria application.

## Roles

### Available Roles

1. **USER** (`user`) - Regular users with basic access
2. **ADMIN** (`admin`) - Administrative users with elevated privileges
3. **SUPERADMIN** (`superadmin`) - Super administrators with full system access

## Decorators

The role system provides several decorators located in `src/decorators/roles.decorator.ts`:

### Core Decorators

- `@Roles(...roles)` - Requires one of the specified roles
- `@AdminOnly()` - Allows ADMIN and SUPERADMIN roles only
- `@SuperAdminOnly()` - Allows SUPERADMIN role only
- `@AdminBlocked()` - Blocks ADMIN and SUPERADMIN roles (regular users only)

### Usage Examples

```typescript
import { AdminOnly, SuperAdminOnly, AdminBlocked, Roles } from '../decorators';
import { Role } from '../models/roles.enum';

// Admin or SuperAdmin access
@UseGuards(JwtAuthGuard, RolesGuard)
@AdminOnly()
@Get('admin-data')
getAdminData() {
  // Only admins and superadmins can access
}

// SuperAdmin only access
@UseGuards(JwtAuthGuard, RolesGuard)
@SuperAdminOnly()
@Delete('users/:id')
deleteUser(@Param('id') id: string) {
  // Only superadmins can access
}

// Block admins (regular users only)
@UseGuards(JwtAuthGuard, RolesGuard)
@AdminBlocked()
@Post('user-action')
userOnlyAction() {
  // Admins are blocked from this endpoint
}

// Custom role requirements
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
@Get('limited-access')
limitedAccess() {
  // Only USER and ADMIN roles allowed
}
```

## Guards

### RolesGuard

The `RolesGuard` enforces role-based access control. It must be used with `JwtAuthGuard`:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@AdminOnly()
@Get('protected')
protectedEndpoint() {
  // Protected endpoint
}
```

The guard:

- Extracts user role from JWT token
- Checks required roles against user's role
- Handles admin-blocked endpoints
- Throws `ForbiddenException` for unauthorized access

## API Endpoints

### Authentication Endpoints

#### Regular User Endpoints

- `POST /auth/register` - Register new user (default role: USER)
- `POST /auth/login` - User authentication
- `GET /auth/profile` - Get user profile (authenticated users)

#### Admin Endpoints (ADMIN + SUPERADMIN)

- `GET /auth/users` - Get all users

#### SuperAdmin Endpoints (SUPERADMIN only)

- `POST /auth/create-admin` - Create admin users
- `DELETE /auth/users/:id` - Delete users
- `PATCH /auth/users/:id/promote` - Promote user to admin
- `PATCH /auth/users/:id/demote` - Demote admin to user

#### Admin-Blocked Endpoints (USER only)

- `POST /auth/user-only-action` - Example endpoint blocked for admins

## DTOs

### Admin DTOs

Located in `src/dto/auth/admin.dto.ts`:

#### CreateAdminDto

```typescript
{
  email: string;
  password: string;
  username?: string;
  role?: Role; // Defaults to ADMIN
}
```

#### UpdateUserRoleDto

```typescript
{
  role: Role;
}
```

## JWT Token Structure

JWT tokens include the user's role for authorization:

```typescript
{
  sub: string; // User ID
  email: string; // User email
  role: string; // User role
  iat: number; // Issued at
  exp: number; // Expires at
}
```

## Database Schema

### User Entity

The User entity includes a role field:

```typescript
@Column({ type: "enum", enum: Role, default: Role.USER })
role!: Role;
```

This creates a PostgreSQL enum type `users_role_enum` with values:

- `user`
- `admin`
- `superadmin`

## Error Handling

The system throws appropriate HTTP exceptions:

- `ForbiddenException` - Insufficient permissions
- `UnauthorizedException` - Not authenticated
- `NotFoundException` - User not found (admin operations)

Example error responses:

```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: admin, superadmin",
  "error": "Forbidden"
}
```

```json
{
  "statusCode": 403,
  "message": "Admins are not allowed to access this endpoint",
  "error": "Forbidden"
}
```

## Implementation Notes

### Initial SuperAdmin Setup

To create the first SuperAdmin, you'll need to:

1. Register a regular user
2. Manually update their role in the database to `superadmin`
3. Or create a migration/seed script for initial setup

### Security Considerations

- Roles are embedded in JWT tokens - ensure proper token security
- Role changes require new token generation (users must re-login)
- Admin actions should be logged for audit purposes
- Consider implementing role change notifications

### Future Enhancements

- Role-based permissions (granular permissions within roles)
- Role inheritance and hierarchies
- Time-based role assignments
- Audit logging for admin actions
- Bulk user operations for SuperAdmins

## Testing

### Manual Testing

1. Register a user: `POST /auth/register`
2. Login to get JWT: `POST /auth/login`
3. Try accessing admin endpoint: `GET /auth/users` (should fail)
4. Update user role to admin in database
5. Login again to get new token with admin role
6. Try accessing admin endpoint again (should succeed)

### Automated Testing

Consider adding tests for:

- Role decorator behavior
- Guard authorization logic
- Admin endpoint access control
- Token role validation
- Error responses for unauthorized access
