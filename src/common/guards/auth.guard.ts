import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const token = req?.cookies?._authToken;

    if (!token) throw new UnauthorizedException('Unauthorized');

    try {
      const verified = await this.jwt.verifyAsync(token);

      (req as any).user = verified;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
