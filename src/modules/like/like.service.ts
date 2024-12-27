import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dtos/create-like.dto';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';
import { handleErrorThrow } from 'src/common/helper';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly logger: CustomLoggerService,
  ) {}

  async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
    try {
      const { postId, userId } = createLikeDto;

      // Prevent duplicate likes
      const existingLike = await this.likeRepository.findOne({
        where: { postId, userId },
      });

      if (existingLike) {
        throw new BadRequestException('User has already liked this post.');
      }
      const like = this.likeRepository.create(createLikeDto);
      return this.likeRepository.save(like);
    } catch (error) {
      this.logger.error('Error occurred while creating like.', error);

      handleErrorThrow(error, 'Handle like failed, please try again.');
    }
  }

  async deleteLike(createLikeDto: CreateLikeDto): Promise<{ message: string }> {
    try {
      const { postId, userId } = createLikeDto;
      const like = await this.likeRepository.findOne({
        where: { postId, userId },
      });

      if (!like) {
        throw new NotFoundException('Like not found.');
      }

      await this.likeRepository.remove(like);
      return { message: 'Like removed successfully.' };
    } catch (error) {
      this.logger.error('Error occurred while deleting like', error);

      handleErrorThrow(error, 'Handle like failed, please try again.');
    }
  }
}
