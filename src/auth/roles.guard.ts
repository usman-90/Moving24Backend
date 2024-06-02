import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(roles, user?.roles);
    let isUserAllowed = false;
    user?.roles?.forEach((role: string) => {
      if (roles.includes(role)) {
        isUserAllowed = true;
      }
    });
    return isUserAllowed;
  }
}
