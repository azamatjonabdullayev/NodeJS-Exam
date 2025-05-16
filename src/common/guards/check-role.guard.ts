import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import type { Request } from 'express';

@Injectable()
export class ChekRolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;
    const role = (req as any).user.role;
    if (!Object.values(Roles).includes(role) || role === Roles.USER) {
      throw new ForbiddenException('Invalid role');
    }
    return true;
  }
}
