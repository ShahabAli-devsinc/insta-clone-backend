import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dtos/create-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const { postId, userId } = createLikeDto;

    // Prevent duplicate likes
    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      throw new Error('User has already liked this post.');
    }

    // Create a new like
    const like = this.likeRepository.create(createLikeDto);
    return this.likeRepository.save(like);
  }

  async deleteLike(createLikeDto: CreateLikeDto): Promise<{ message: string }> {
    const { postId, userId } = createLikeDto;

    const like = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (!like) {
      throw new NotFoundException('Like not found.');
    }

    await this.likeRepository.remove(like);
    return { message: 'Like removed successfully.' };
  }
}
