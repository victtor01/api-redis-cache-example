import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    example: 'example',
    description: 'Password of user',
  })
  password: string;
}
