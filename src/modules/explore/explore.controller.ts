import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { Post as PostEntity } from '../posts/entities/post.entity';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/modules/users/entities/user.entity';

@ApiTags('explore')
@UseGuards(JwtGuard)
@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  /**
   * Endpoint to fetch posts for the Explore page with pagination and search.
   * @returns A paginated and filtered list of posts.
   */
  @Get('posts')
  @ApiOkResponse({
    description: 'Paginated posts have been successfully retrieved.',
    type: [PostEntity],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAllPosts(
    @CurrentUser() user: User,
    @Query('query') query?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ posts: PostEntity[]; total: number }> {
    return this.exploreService.getPosts(user.id, query, page, limit);
  }

  /**
   * Endpoint to fetch paginated and filtered users for the Explore page.
   * Returns users based on search query or pagination.
   * @returns A paginated and filtered list of users.
   */
  @Get('users')
  @ApiOkResponse({
    description: 'Paginated users have been successfully retrieved.',
    type: [User],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getAllUsers(
    @CurrentUser() user: User,
    @Query('query') query?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ users: User[]; total: number }> {
    return this.exploreService.getUsers(user.id, query, page, limit);
  }
}
