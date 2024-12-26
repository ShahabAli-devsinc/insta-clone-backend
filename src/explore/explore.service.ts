import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { CustomLoggerService } from '../common/logger/custom-logger.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ExploreService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly logger: CustomLoggerService,
  ) {}

  /**
   * Fetches paginated and filtered posts for the Explore page.
   * @param currentUserId The ID of the current user.
   * @param query Optional search query for filtering by caption or username.
   * @param page Current page number for pagination.
   * @param limit Number of posts per page.
   * @returns A paginated and filtered list of posts.
   */
  async getPaginatedAndFilteredPosts(
    currentUserId: number,
    query: string,
    page: number,
    limit: number,
  ): Promise<{ posts: Post[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const queryBuilder = this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.likes', 'likes')
        .leftJoinAndSelect('post.comments', 'comments')
        .leftJoinAndSelect('likes.user', 'likesUser')
        .leftJoinAndSelect('comments.user', 'commentsUser')
        .where('post.user.id != :currentUserId', { currentUserId });

      if (query) {
        queryBuilder.andWhere(
          '(post.caption ILIKE :query OR user.username ILIKE :query)',
          { query: `%${query}%` },
        );
      }

      const [posts, total] = await queryBuilder
        .orderBy('post.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { posts, total };
    } catch (error) {
      this.logger.error(
        'Error occurred while fetching paginated and filtered posts',
        error,
      );
      throw new Error(
        'Error occurred while fetching paginated and filtered posts',
      );
    }
  }

  /**
   * Fetches paginated and filtered users for the Explore page.
   * @param currentUserId The ID of the current user.
   * @param query Optional search query for filtering by username or bio.
   * @param page Current page number for pagination.
   * @param limit Number of users per page.
   * @returns A paginated and filtered list of users.
   */
  async getPaginatedAndFilteredUsers(
    currentUserId: number,
    query: string,
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const queryBuilder = this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'posts')
        .leftJoinAndSelect('posts.likes', 'postLikes')
        .leftJoinAndSelect('posts.comments', 'postComments')
        .leftJoinAndSelect('user.followers', 'followers')
        .leftJoinAndSelect('followers.follower', 'followerUser')
        .leftJoinAndSelect('user.following', 'following')
        .leftJoinAndSelect('following.following', 'followingUser')
        .where('user.id != :currentUserId', { currentUserId });

      if (query) {
        queryBuilder.andWhere(
          '(user.username ILIKE :query OR user.bio ILIKE :query)',
          { query: `%${query}%` },
        );
      }

      const [users, total] = await queryBuilder
        .orderBy('user.createdAt', 'DESC') // Sort by latest users
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { users, total };
    } catch (error) {
      this.logger.error(
        'Error occurred while fetching paginated and filtered users',
        error,
      );
      throw new Error(
        'Error occurred while fetching paginated and filtered users',
      );
    }
  }
}
