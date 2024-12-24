import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { User } from 'src/users/entities/user.entity';
import { LoggerModule } from 'src/common/logger/logger.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    LoggerModule,
    CloudinaryModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
