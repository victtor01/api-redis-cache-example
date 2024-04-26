import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { Movie } from '../entities/movie.entity';

export abstract class MoviesRepository {
  abstract create(body: Movie): Promise<Movie>;
  abstract findAll(userId: string): Promise<Movie[]>;
  abstract delete(options: { userId: string; id: string }): Promise<any>;
  abstract findOne(body: { userId: string, id: string }): Promise<Movie>;
  abstract update(
    body: UpdateMovieDto,
    options: {
      userId: string;
      id: string;
    },
  ): Promise<Movie>;
}
