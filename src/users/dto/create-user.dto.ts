import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'The username of the user. It must be unique.',
    example: 'johndoe',
  })
  username: string;

  @IsString()
  @ApiProperty({
    description: 'The email address of the user. It must be unique.',
    example: 'johndoe@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password for the user account.',
    example: 'password123',
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional biography of the user.',
    example: 'Software developer from NYC',
    nullable: true,
    required: false,
  })
  bio?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "Optional URL to the user's profile picture.",
    example: 'https://example.com/profile.jpg',
    nullable: true,
    required: false,
  })
  profilePicture?: string;
}
