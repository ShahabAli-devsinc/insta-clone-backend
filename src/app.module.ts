import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './common/logger/custom-logger.service';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AttachUserInterceptor } from './common/interceptors/attach-user.interceptor';
import { environmentValidationSchema } from './common/config/environment.validation';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { Like } from './like/entities/like.entity';
import { Comment } from './comment/entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Post, Like, Comment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    LikeModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'Logger',
      useClass: CustomLoggerService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AttachUserInterceptor,
    },
  ],
})
export class AppModule {}
