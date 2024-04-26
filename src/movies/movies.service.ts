import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { MoviesRepository } from './repositories/movies-repository';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepo: MoviesRepository,
    private readonly redis: RedisService,
  ) {}

  private logger: Logger = new Logger('MOVIES_SERVICE');

  async findOne(data: { userId: string; id: string }) {
    try {
      return await this.moviesRepo.findOne(data);
    } catch (error) {
      throw new NotFoundException('movie not found!');
    }
  }

  async findAll(userId: string) {
    try {
      const allProductsCache = await this.redis.get(`all-products-${userId}`);

      if (allProductsCache) return allProductsCache;

      const allProducts = await this.moviesRepo.findAll(userId);

      await this.redis.save(`all-products-${userId}`, allProducts);

      return allProducts;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('there was an unexpected error!');
    }
  }

  async create(body: CreateMovieDto, userId: string): Promise<Movie> {
    try {
      const movie = new Movie({
        name: body.name,
        userId,
      });

      const product = await this.moviesRepo.create(movie);
      const cache: Movie[] =
        (await this.redis.get(`all-products-${userId}`)) || [];

      if (cache?.[0]?.id) {
        await this.redis.save(`all-products-${userId}`, [...cache, product]);
      }

      return product;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'There was an unknown error, please try again later!',
      );
    }
  }

  update(
    body: UpdateMovieDto,
    options: {
      userId: string;
      id: string;
    },
  ): Promise<Movie> {
    return this.moviesRepo.update(body, {
      userId: options.userId,
      id: options.id,
    });
  }

  delete(options: { userId: string; id: string }): Promise<any> {
    return this.moviesRepo.delete({
      userId: options.userId,
      id: options.id,
    });
  }
}
