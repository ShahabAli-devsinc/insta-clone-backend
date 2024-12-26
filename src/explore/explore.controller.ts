import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { Post as PostEntity } from '../posts/entities/post.entity';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('explore')
@UseGuards(JwtGuard)
@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  // /**
  //  * Endpoint to fetch all posts for the Explore page.
  //  * Returns all posts irrespective of the user.
  //  * @returns An array of posts for the Explore page.
  //  */
  // @Get('posts')
  // @ApiOkResponse({
  //   description: 'All posts have been successfully retrieved.',
  //   type: [PostEntity],
  // })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // async fetchAllPosts(@CurrentUser() user: User): Promise<PostEntity[]> {
  //   return this.exploreService.getAllPosts(user.id);
  // }
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
  async fetchAllPosts(
    @CurrentUser() user: User,
    @Query('query') query?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ posts: PostEntity[]; total: number }> {
    return this.exploreService.getPaginatedAndFilteredPosts(
      user.id,
      query,
      page,
      limit,
    );
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
  async fetchAllUsers(
    @CurrentUser() user: User,
    @Query('query') query?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ users: User[]; total: number }> {
    return this.exploreService.getPaginatedAndFilteredUsers(
      user.id,
      query,
      page,
      limit,
    );
  }
}
