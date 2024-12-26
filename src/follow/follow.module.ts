import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { LoggerModule } from 'src/common/logger/logger.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow, User]),
    LoggerModule,
    UsersModule,
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
