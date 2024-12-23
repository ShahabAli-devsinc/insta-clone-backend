import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'ID of the post to be liked',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @ApiProperty({
    description: 'ID of the user who is liking the post',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
