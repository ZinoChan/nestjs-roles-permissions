import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRoleRepository } from '../interfaces/role.interface';
import { ROLE_REPOSITORY_TOKEN } from '@/constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ROLE_REPOSITORY_TOKEN) private roleRepository: IRoleRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userRoles = await this.roleRepository.getUserRoles(user.id);
    return userRoles.some((role) => roles.includes(role));
  }
}
