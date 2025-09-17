# DTO Organization

This directory contains all Data Transfer Objects (DTOs) for the Lumoria application, organized by domain.

## Structure

```text
src/dto/
├── index.ts              # Barrel exports for all DTOs
├── auth/                 # Authentication-related DTOs
│   ├── login.dto.ts      # LoginDto for user authentication
│   └── register.dto.ts   # RegisterDto for user registration
└── user/                 # User management DTOs
    ├── create-user.dto.ts # CreateUserDto for user creation
    └── update-user.dto.ts # UpdateUserDto for user updates
```

## Usage

### Import Individual DTOs

```typescript
import { LoginDto } from "../dto/auth/login.dto";
import { CreateUserDto } from "../dto/user/create-user.dto";
```

### Import from Barrel (Recommended)

```typescript
import { LoginDto, RegisterDto, CreateUserDto, UpdateUserDto } from "../dto";
```

## Guidelines

1. **Domain Organization**: DTOs are organized by domain (auth, user, etc.)
2. **Class-based DTOs**: All DTOs use class-based definitions with validation decorators
3. **Validation**: DTOs include appropriate validation decorators from `class-validator`
4. **Naming Convention**: Use descriptive names ending with `.dto.ts`
5. **Barrel Exports**: Always update `index.ts` when adding new DTOs

## DTO Validation

All DTOs use `class-validator` decorators for input validation:

- `@IsEmail()` - Email validation
- `@IsString()` - String validation
- `@IsNotEmpty()` - Required fields
- `@IsOptional()` - Optional fields
- `@IsNumber()` - Number validation
- `@IsBoolean()` - Boolean validation
- `@ValidateNested()` - Nested object validation

## Relationship to Entities

DTOs should be used for:

- API request/response payloads
- Data validation and transformation
- Decoupling external API from internal entity structure

The `User` entity in `src/entities/user.entity.ts` represents the database structure, while DTOs handle the API layer.
