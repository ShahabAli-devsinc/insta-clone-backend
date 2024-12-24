import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Follow } from './entities/follow.entity';
import { CreateFollowDto } from './dtos/create-follow.dto';
import { CustomLoggerService } from 'src/common/logger/custom-logger.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: CustomLoggerService,
  ) {}

  async followUser(
    followerId: number,
    dto: CreateFollowDto,
  ): Promise<{ message: string } | Follow> {
    try {
      const { followingId } = dto;

      // Prevent self-following
      if (followerId === followingId) {
        return { message: 'You cannot follow yourself.' };
      }

      // Check if the follower and following users exist
      const follower = await this.userRepository.findOneBy({ id: followerId });
      const following = await this.userRepository.findOneBy({
        id: followingId,
      });

      if (!follower || !following) {
        throw new NotFoundException('User not found.');
      }

      // Check if the follow relationship already exists
      const existingFollow = await this.followRepository.findOne({
        where: { follower: { id: followerId }, following: { id: followingId } },
      });

      if (existingFollow) {
        return { message: 'You are already following this user.' };
      }

      // Create a new follow relationship
      const newFollow = this.followRepository.create({ follower, following });
      await this.followRepository.save(newFollow);

      // Return the newly created follow relationship
      return newFollow;
    } catch (error) {
      this.logger.error('Error occurred in follow user', error);
      throw new Error(error.message || 'Error occurred in follow user');
    }
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    try {
      const follow = await this.followRepository.findOne({
        where: { follower: { id: followerId }, following: { id: followingId } },
      });

      if (!follow) {
        throw new NotFoundException('Follow relationship not found.');
      }

      await this.followRepository.remove(follow);
    } catch (error) {
      this.logger.error('Error occurred in unfollow user', error);
      throw new Error('Error occurred in unfollow user');
    }
  }

  async getFollowers(userId: number): Promise<User[]> {
    try {
      const followers = await this.followRepository.find({
        where: { following: { id: userId } },
        relations: ['follower'],
      });

      return followers.map((f) => f.follower);
    } catch (error) {
      this.logger.error('Error occurred in get followers', error);
      throw new Error('Error occurred in get followers');
    }
  }

  async getFollowing(userId: number): Promise<User[]> {
    try {
      const following = await this.followRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'],
      });

      return following.map((f) => f.following);
    } catch (error) {
      this.logger.error('Error occurred in get following', error);
      throw new Error('Error occurred in get following');
    }
  }
}
