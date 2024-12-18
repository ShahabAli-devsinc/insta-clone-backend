import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  @ApiProperty({
    description: 'The updated username of the user. This field is optional.',
    example: 'john_doe_updated',
    required: false,
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Biography must be at most 200 characters long' })
  @ApiProperty({
    description: 'The updated biography of the user. This field is optional.',
    example: 'Full-stack developer from NYC',
    nullable: true,
    required: false,
  })
  bio?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'The updated profile picture URL of the user. This field is optional.',
    example: 'https://example.com/new-profile.jpg',
    nullable: true,
    required: false,
  })
  profilePicture?: string;
}
