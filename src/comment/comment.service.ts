import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async deleteComment(
    createCommentDto: CreateCommentDto,
  ): Promise<{ message: string }> {
    const { postId, userId, content } = createCommentDto;

    const comment = await this.commentRepository.findOne({
      where: { postId, userId, content },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully.' };
  }
}
