import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID of the post being commented on',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @ApiProperty({
    description: 'ID of the user making the comment',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a great post!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, {
    message: 'Comment content should not exceed 500 characters.',
  })
  content: string;
}
