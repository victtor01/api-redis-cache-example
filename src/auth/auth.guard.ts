import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/config/constants';
import { SECRET_KEY } from './constants/secret';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    
    const request = context.switchToHttp().getRequest();

    const response = context.switchToHttp().getResponse();
    
    const token = request?.cookies?.['access_token'] || null;

    if (!token) {
      throw new UnauthorizedException('passport não está presente!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: SECRET_KEY,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        message: 'houve um erro ao tentar autenticar',
      });
    }

    return true;
  }
}
