import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { RedisModule } from 'src/redis/redis.module';
import { MoviesRepository } from './repositories/movies-repository';
import { RedisService } from 'src/redis/redis.service';
import { Movie } from './entities/movie.entity';

jest.mock("src/redis/redis.service")
jest.mock("src/redis/redis.module")
jest.mock("ioredis")

const RedisServiceMock = jest.fn().mockImplementation(() => ({
  get: jest.fn(),
  save: jest.fn(),
}));

const movie = new Movie({
  name: 'example',
  userId: 'user-exists',
});

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesRepo: MoviesRepository;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [
        MoviesService,
        {
          provide: RedisService,
          useClass: RedisServiceMock
        },
        {
          provide: MoviesRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    moviesRepo = module.get<MoviesRepository>(MoviesRepository);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(redisService).toBeDefined()
  });

  describe("findOne", () => {
    it('should return one product', async () => {
      jest.spyOn(moviesRepo, 'findOne').mockReturnValue(Promise.resolve(movie));
      
      const response = await service.findOne({
        userId: 'user-exists',
        id: 'id-exists'
      })
  
      expect(response).toBeInstanceOf(Movie);
      expect(response.name).toEqual(movie.name);
    });
  })

  describe("findAll", () => {
    it("should returns cache", async () => {
      jest.spyOn(redisService, 'get').mockReturnValue(Promise.resolve([movie]));
      
      const response = await service.findAll("userId")
  
      expect(response?.[0]).toBeInstanceOf(Movie);
      expect(moviesRepo.findAll).toHaveBeenCalledTimes(0);
    })
  })


});
