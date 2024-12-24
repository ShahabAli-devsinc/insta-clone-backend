import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'URL of the image associated with the post',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Caption for the post',
    example: 'A beautiful sunset!',
  })
  caption: string;
}
