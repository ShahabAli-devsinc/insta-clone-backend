import { Module } from '@nestjs/common';
import { ExploreController } from './explore.controller';
import { ExploreService } from './explore.service';
import { LoggerModule } from 'src/common/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), LoggerModule],
  controllers: [ExploreController],
  providers: [ExploreService],
})
export class ExploreModule {}
