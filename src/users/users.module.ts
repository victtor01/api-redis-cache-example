import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users-repository';
import { PrismaUsersRepository } from './repositories/implements/prisma-users-repository';
import { PrismaService } from 'src/database/prisma.service';
import { UsersController } from './users.controller';

@Module({
  providers: [
    UsersService,
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
