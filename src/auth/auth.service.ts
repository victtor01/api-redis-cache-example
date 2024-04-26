import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { Response } from 'express';
import { constantsJWT } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async auth(body: AuthDto, response: Response): Promise<any> {
    const userdb =
      (await this.usersService.findOneByEmail(body?.email)) || null;

    if (!userdb?.email) throw new NotFoundException('user not found');

    const comparePassword = await compare(body.password, userdb.password);

    if (!comparePassword) throw new UnauthorizedException('incorrect password');

    const access_token = await this.jwtService.signAsync({
      id: userdb.id,
      name: userdb.name,
      email: userdb.email,
    });

    const refresh_token = await this.jwtService.signAsync(
      {
        id: userdb.id,
        name: userdb.name,
        email: userdb.email,
      },
      {
        expiresIn: constantsJWT.token_refresh_expiration,
      },
    );

    response.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });

    return {
      access_token,
      refresh_token
    };
  }

  async decode(acesss_token: string): Promise<any> {
    return await this.jwtService.decode(acesss_token);
  }
}
