# nestjs-role-permissions

A NestJS package for implementing role-based access control (RBAC) and permissions management with customizable repositories. This package supports a database-agnostic approach, allowing you to integrate it into your NestJS applications without tying it to a specific database solution.

## Features

- **Role-based Access Control (RBAC)**: Define and manage user roles (e.g., admin, user, editor).
- **Permission Management**: Assign and revoke granular permissions (e.g., read:users, write:posts).
- **Customizable Repositories**: Use your custom repository implementations for roles and permissions.
- **Guards**: Protect your routes with Role and Permission Guards.

## Installation

To install the package, you can either link it locally for development or install it directly from npm (after publishing).

### Local Development (Linking)

If you are developing the package locally, you can link it to your NestJS application:

1. Navigate to the `nestjs-role-permissions` package directory and run:

```bash
   npm link
```

2. In your NestJS application, run:

```bash
   npm link nestjs-role-permissions
```

### NPM Installation

Once the package is published, install it using npm:

```bash
npm install nestjs-role-permissions
```

### Usage

#### Step 1: Import the Module

In your NestJS application, import the RolePermissionsModule and configure it with your custom repositories.

```ts
import { Module } from '@nestjs/common';
import { RolePermissionsModule } from 'nestjs-role-permissions';

@Module({
  imports: [
    RolePermissionsModule.forRoot({
      roleRepository: MyRoleRepository, // Your custom role repository
      permissionRepository: MyPermissionRepository, // Your custom permission repository
    }),
  ],
})
export class AppModule {}
```

#### Step 2: Implement Your Custom Repositories

You need to implement your own repositories for roles and permissions. Below is an example of how to implement them with static data.

- Example MyRoleRepository

```ts
import { IRoleRepository } from 'nestjs-role-permissions';

export class MyRoleRepository implements IRoleRepository {
  private roles = ['admin', 'user', 'editor'];

  async getUserRoles(userId: string): Promise<string[]> {
    // Return static roles for the user (you can replace this with actual DB queries)
    if (userId === '1') {
      return ['admin'];
    }
    return ['user'];
  }
}
```

- Example MyPermissionRepository

```ts
import { IPermissionRepository } from 'nestjs-role-permissions';

export class MyPermissionRepository implements IPermissionRepository {
  private permissions = ['read:posts', 'write:posts', 'delete:posts'];

  async getUserPermissions(userId: string): Promise<string[]> {
    // Return static permissions for the user
    if (userId === '1') {
      return ['read:posts', 'write:posts'];
    }
    return ['read:posts'];
  }
}
```

#### Step 3: Protect Routes with Guards

Use the RoleGuard and PermissionGuard to protect your routes.
Example:

```ts
import { Controller, Get } from '@nestjs/common';
import { Roles } from 'nestjs-role-permissions'; // Role decorator
import { RoleGuard } from 'nestjs-role-permissions'; // Role guard

@Controller('posts')
export class PostsController {
  @Get()
  @Roles('admin', 'editor') // Only 'admin' and 'editor' can access this route
  @UseGuards(RoleGuard)
  getPosts() {
    return 'Here are your posts';
  }
}
```

- Example: Protect a Route with Permissions

```ts
import { Controller, Get } from '@nestjs/common';
import { RequirePermissions } from 'nestjs-role-permissions'; // Permissions decorator
import { PermissionGuard } from 'nestjs-role-permissions'; // Permissions guard

@Controller('posts')
export class PostsController {
  @Get()
  @RequirePermissions('read:posts') // User must have 'read:posts' permission
  @UseGuards(PermissionGuard)
  getPosts() {
    return 'Here are your posts';
  }
}
```

### License

This project is licensed under the MIT License.

### Key Sections:

1. **Installation**: Explains how to install the package, locally using `npm link` for development.
2. **Usage**: Describes how to integrate the module into your NestJS app by configuring it with custom repositories for roles and permissions.
3. **License**: Standard section for licensing information.
