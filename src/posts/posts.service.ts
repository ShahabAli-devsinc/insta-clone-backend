import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadedFileType } from 'src/common/types/types';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private readonly logger: CustomLoggerService,
    private cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Creates a new post associated with a user.
   * @param createPostDto Data Transfer Object containing post details.
   * @param user The authenticated user creating the post.
   * @returns The created post.
   */
  async createPost(
    createPostDto: CreatePostDto,
    user: User,
    file: UploadedFileType,
  ): Promise<Post> {
    try {
      if (file) {
        const uploadedImage = await this.uploadImageToCloudinary(file);
        createPostDto.imageUrl = uploadedImage.secure_url;
      }
      const post = this.postsRepository.create({
        ...createPostDto,
        user,
      });
      return this.postsRepository.save(post);
    } catch (error) {
      this.logger.error('Error occurred while create post', error);
      throw new Error('Error occurred while create post');
    }
  }

  async uploadImageToCloudinary(file: UploadedFileType) {
    return await this.cloudinaryService.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  /**
   * Updates an existing post's caption.
   * @param id The ID of the post to update.
   * @param updatePostDto Data Transfer Object containing updated caption.
   * @param user The authenticated user updating the post.
   * @returns The updated post.
   */
  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: Number(id) },
      });

      if (!post) {
        throw new NotFoundException(
          'Post not found or you do not have permission to edit this post.',
        );
      }

      post.caption = updatePostDto.caption;
      return this.postsRepository.save(post);
    } catch (error) {
      this.logger.error('Error occurred while update post', error);
      throw new Error('Error occurred while update post');
    }
  }

  /**
   * Deletes a post by ID.
   * @param id The ID of the post to delete.
   * @param user The authenticated user attempting to delete the post.
   */
  async deletePost(id: string, user: User): Promise<{ message: string }> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id: Number(id) },
      });

      if (!post) {
        throw new NotFoundException(
          'Post not found or you do not have permission to delete this post.',
        );
      }

      await this.postsRepository.remove(post);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      this.logger.error('Error occurred while deleting post', error);
      throw new Error('Error occurred while deleting post');
    }
  }

  /**
   * Fetches all posts created by the specified user.
   * @param user The authenticated user.
   * @returns An array of posts created by the user.
   */
  async getAllUserPosts(user: User): Promise<Post[]> {
    try {
      return await this.postsRepository.find({
        where: { userId: user.id },
        relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user'],
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error('Error occurred while fetching user posts', error);
      throw new Error('Error occurred while fetching user posts');
    }
  }

  /**
   * Fetches posts for the feed.
   * Currently returns all posts but can be extended to show posts from followed users.
   * Posts are displayed in reverse chronological order.
   * @returns An array of posts for the feed.
   */
  async getFeedPosts(): Promise<Post[]> {
    try {
      return await this.postsRepository.find({
        relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user'],
        order: {
          createdAt: 'DESC',
        },
      });

      // Future Logic: Use a "follower-following" system to fetch posts of followed users.
    } catch (error) {
      this.logger.error('Error occurred while fetching feed posts', error);
      throw new Error('Error occurred while fetching feed posts');
    }
  }
}
