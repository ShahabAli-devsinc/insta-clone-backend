import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'Image URL must be a valid URL.' })
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
