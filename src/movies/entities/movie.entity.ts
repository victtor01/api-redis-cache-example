import { User } from 'src/users/entities/user.entity';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { randomUUID } from 'crypto';

export class Movie {
  id?: string = randomUUID();
  name: string;
  userId: string;
  createdAt?: Date;
  updateAt?: Date;

  constructor(props: Movie) {
    Object.assign(this, props);
  }
}
