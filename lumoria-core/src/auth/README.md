# Authentication Module

This module provides JWT-based authentication for the Lumoria application.

## Features

- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- Passport.js integration for authentication strategies

## Setup

1. Copy the environment variables from `.env.example` to your `.env` file:

   ```bash
   cp lumoria-core/.env.example lumoria-core/.env
   ```

2. Update the JWT secret in your `.env` file:

   ```bash
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   ```

## API Endpoints

### POST /auth/register

Register a new user account.

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com"
  }
}
```

### POST /auth/login

Login with existing credentials.

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com"
  }
}
```

### GET /auth/profile

Get the current user's profile (requires authentication).

**Headers:**

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "userId": "123",
  "email": "user@example.com"
}
```

## Usage in Other Modules

To protect routes in other controllers, use the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("protected")
export class ProtectedController {
  @UseGuards(AuthGuard("jwt"))
  @Get()
  getProtectedResource() {
    return { message: "This is protected" };
  }
}
```

## TODO

- [ ] Integrate with User entity/service
- [ ] Add refresh token functionality
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add rate limiting for auth endpoints
- [ ] Add user roles and permissions
