import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { User } from 'src/modules/users/entities/user.entity';
import { LoggerModule } from 'src/common/logger/logger.module';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';
import { FollowModule } from 'src/modules/follow/follow.module';
import { Follow } from 'src/modules/follow/entities/follow.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Follow]),
    CloudinaryModule,
    FollowModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
