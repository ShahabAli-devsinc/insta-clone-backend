import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly logger: CustomLoggerService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const comment = this.commentRepository.create(createCommentDto);
      return this.commentRepository.save(comment);
    } catch (error) {
      this.logger.error('Error occurred while creating comment.', error);
      throw new HttpException(
        'Error occurred while creating comment. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteComment(
    createCommentDto: CreateCommentDto,
  ): Promise<{ message: string }> {
    try {
      const { postId, userId, content } = createCommentDto;

      const createdComment = await this.commentRepository.findOne({
        where: { postId, userId, content },
      });

      if (!createdComment) {
        throw new NotFoundException('Comment not found.');
      }

      await this.commentRepository.remove(createdComment);
      return { message: 'Comment deleted successfully.' };
    } catch (error) {
      this.logger.error('Error occurred while deleting comment', error);
      throw new HttpException(
        'Error occurred while deleting comment. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
