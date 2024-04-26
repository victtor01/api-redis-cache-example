import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'example',
    description: 'name of user',
  })
  name: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'email of user',
  })
  email: string;

  @ApiProperty({
    example: 'example',
    description: 'password of user',
  })
  password: string;
}
