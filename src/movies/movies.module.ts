import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/database/prisma.service';
import { MoviesRepository } from './repositories/movies-repository';
import { PrismaMoviesRepository } from './repositories/implements/prisma-movies.repository';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    PrismaService,
    {
      provide: MoviesRepository,
      useClass: PrismaMoviesRepository,
    },
  ],
})
export class MoviesModule {}
