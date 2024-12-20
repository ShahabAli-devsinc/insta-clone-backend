import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  @ApiProperty({
    description: 'The username of the user. It must be unique.',
    example: 'johndoe',
  })
  username: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @ApiProperty({
    description: 'The email address of the user. It must be unique.',
    example: 'johndoe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
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
