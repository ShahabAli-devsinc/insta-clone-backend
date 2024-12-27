import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';

export class FollowResponseDto {
  @ApiProperty({ description: 'User who follows' })
  follower: User;

  @ApiProperty({ description: 'User being followed' })
  following: User;

  @ApiProperty({ description: 'Timestamp when the follow occurred' })
  followedAt: Date;
}
