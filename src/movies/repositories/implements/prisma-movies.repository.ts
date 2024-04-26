import { Movie } from 'src/movies/entities/movie.entity';
import { MoviesRepository } from '../movies-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMovieDto } from 'src/movies/dtos/create-movie.dto';
import { UpdateMovieDto } from 'src/movies/dtos/update-movie.dto';

@Injectable()
export class PrismaMoviesRepository implements MoviesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      where: {
        userId,
      },
    });
  }

  async create(body: Movie): Promise<Movie> {
    const { userId, ...data } = body;
    return await this.prisma.movie.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(body: { userId: string; id: string }): Promise<Movie> {
    return await this.prisma.movie.findUnique({
      where: {
        id: body.id,
      },
    });
  }

  async update(
    body: UpdateMovieDto,
    options: {
      id: string;
      userId: string;
    },
  ): Promise<Movie> {
    return await this.prisma.movie.update({
      where: {
        userId: options.userId,
        id: options.id,
      },
      data: body,
    });
  }

  async delete(options: { userId: string; id: string }): Promise<any> {
    return await this.prisma.movie.delete({
      where: {
        id: options.id,
        userId: options.userId,
      },
    });
  }
}
