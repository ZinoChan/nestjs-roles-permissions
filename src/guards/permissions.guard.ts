import { PERMISSION_REPOSITORY_TOKEN } from '@/constants';
import { IPermissionRepository } from '@/interfaces/permissions.interface';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private permissionRepository: IPermissionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userPermissions = await this.permissionRepository.getUserPermissions(
      user.id,
    );
    return permissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
