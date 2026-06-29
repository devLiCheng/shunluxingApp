import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/user.entity';

export const Roles = (...roles: UserRole[]) =>
  (target: any, key?: any, descriptor?: any) => {
    if (descriptor) {
      Reflect.defineMetadata('roles', roles, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata('roles', roles, target);
    return target;
  };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) return true;
    const { user } = context.switchToHttp().getRequest();
    return user && roles.includes(user.role);
  }
}
