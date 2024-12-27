import { IsNumber } from 'class-validator';

export class CreateFollowDto {
  @IsNumber()
  followingId: number;
}
