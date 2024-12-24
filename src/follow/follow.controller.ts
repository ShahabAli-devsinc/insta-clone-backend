import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dtos/create-follow.dto';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Follow')
@UseGuards(JwtGuard)
@Controller('follow')
@ApiBearerAuth()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async followUser(
    @CurrentUser() currentUser: User,
    @Body() createFollowDto: CreateFollowDto,
  ) {
    return this.followService.followUser(currentUser.id, createFollowDto);
  }

  @Delete(':followingId')
  async unfollowUser(
    @CurrentUser() currentUser: User,
    @Param('followingId') followingId: number,
  ) {
    return this.followService.unfollowUser(currentUser.id, followingId);
  }

  @Get('followers/:userId')
  async getFollowers(@Param('userId') userId: number) {
    return this.followService.getFollowers(userId);
  }

  @Get('following/:userId')
  async getFollowing(@Param('userId') userId: number) {
    return this.followService.getFollowing(userId);
  }
}
