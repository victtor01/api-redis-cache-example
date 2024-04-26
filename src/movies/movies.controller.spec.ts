import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { PrismaService } from 'src/database/prisma.service';
import { MoviesRepository } from './repositories/movies-repository';
import { PrismaMoviesRepository } from './repositories/implements/prisma-movies.repository';
import { RedisModule } from 'src/redis/redis.module';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
