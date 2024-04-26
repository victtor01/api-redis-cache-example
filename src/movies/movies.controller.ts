import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { MoviesService } from './movies.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateMovieDto } from './dtos/update-movie.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("movies")
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll(@Req() req: { user: User }) {
    return this.moviesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: User }) {
    const { id: userId } = req.user;
    return this.moviesService.findOne({ userId, id });
  }

  @Post()
  create(@Body() body: CreateMovieDto, @Req() req: { user: User }) {
    return this.moviesService.create(body, req.user.id);
  }

  @Put(':id')
  update(
    @Body() body: UpdateMovieDto,
    @Req() req: { user: User },
    @Param('id') id: string,
  ) {
    return this.moviesService.update(body, {
      userId: req.user.id,
      id: id,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: { user: User }) {
    return this.moviesService.delete({
      userId: req.user.id,
      id: id,
    });
  }
}
