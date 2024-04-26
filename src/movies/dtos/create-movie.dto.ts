import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    example: 'O auto da compadecida',
    description: 'nome do filme a ser criado',
  })
  name: string;
}
