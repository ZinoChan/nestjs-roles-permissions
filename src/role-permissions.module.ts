import { Module, DynamicModule, Global } from '@nestjs/common';
import { RoleGuard } from './guards/roles.guard';
import { PermissionGuard } from './guards/permissions.guard';
import { IRoleRepository } from './interfaces/role.interface';
import { IPermissionRepository } from './interfaces/permissions.interface';
import {
  PERMISSION_REPOSITORY_TOKEN,
  ROLE_REPOSITORY_TOKEN,
} from './constants';

interface RolePermissionsModuleOptions {
  roleRepository: new (...args: any[]) => IRoleRepository;
  permissionRepository: new (...args: any[]) => IPermissionRepository;
}

@Global()
@Module({
  providers: [RoleGuard, PermissionGuard],
  exports: [RoleGuard, PermissionGuard],
})
export class RolePermissionsModule {
  static forRoot(options: RolePermissionsModuleOptions): DynamicModule {
    return {
      module: RolePermissionsModule,
      providers: [
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useClass: options.roleRepository,
        },
        {
          provide: PERMISSION_REPOSITORY_TOKEN,
          useClass: options.permissionRepository,
        },
      ],
      exports: [ROLE_REPOSITORY_TOKEN, PERMISSION_REPOSITORY_TOKEN],
    };
  }
}
