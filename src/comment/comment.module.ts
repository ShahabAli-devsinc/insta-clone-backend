import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), LoggerModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
