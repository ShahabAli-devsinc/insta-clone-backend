import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/modules/users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile as UploadedFileEntity } from 'src/common/types/types';

@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Endpoint to create a new post.
   * @param createPostDto The data required to create a post.
   * @param req The HTTP request containing the authenticated user.
   * @returns The created post.
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({
    description: 'The post has been successfully created.',
    type: CreatePostDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: UploadedFileEntity | undefined,
    @CurrentUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto, user, file);
  }

  /**
   * Endpoint to update an existing post's caption.
   * @param id The ID of the post to update.
   * @param updatePostDto The data required to update the post.
   * @param user The authenticated user.
   * @returns The updated post.
   */
  @Patch(':id')
  @ApiOkResponse({
    description: 'The post has been successfully updated.',
    type: Post,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  /**
   * Endpoint to delete a post by ID.
   * @param id The ID of the post to delete.
   * @param user The authenticated user.
   * @returns No content if deletion is successful.
   */
  @Delete(':id')
  @ApiNoContentResponse({
    description: 'The post has been successfully deleted.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.postsService.deletePost(id, user);
  }

  /**
   * Endpoint to fetch all posts created by the authenticated user.
   * @param user The authenticated user.
   * @returns An array of posts created by the user.
   */
  @Get('user-posts')
  @ApiOkResponse({
    description: 'The posts have been successfully retrieved.',
    type: [PostEntity],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async fetchUserPosts(
    @CurrentUser() user: User,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: PostEntity[]; total: number }> {
    return this.postsService.getAllUserPosts(user, offset, limit);
  }

  /**
   * Endpoint to fetch all posts for the feed.
   * Currently returns all posts but can be extended to show posts from followed users.
   * @returns An array of posts for the feed.
   */

  @Get('feed')
  @ApiOkResponse({
    description: 'The feed posts have been successfully retrieved.',
    type: [Post],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async fetchFeed(
    @CurrentUser() currentUser: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postsService.getFeedPosts(currentUser.id, page, limit);
  }
}
