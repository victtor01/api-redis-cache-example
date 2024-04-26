import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { UsersRepository } from './users/repositories/users-repository';
import { PrismaUsersRepository } from './users/repositories/implements/prisma-users-repository';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [UsersModule, RedisModule, AuthModule, MoviesModule],
  controllers: [],
  providers: [
    RedisService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
