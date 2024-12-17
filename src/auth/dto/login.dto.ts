import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @ApiProperty({
    description: 'The username of the user attempting to login',
    example: 'johndoe',
  })
  username: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user attempting to login',
    example: 'password123',
  })
  password: string;
}
