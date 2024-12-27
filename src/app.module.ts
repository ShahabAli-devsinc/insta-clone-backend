import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './common/logger/custom-logger.service';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './modules/posts/entities/post.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AttachUserInterceptor } from './common/interceptors/attach-user.interceptor';
import { ENVIRONMENT_VALIDATION_SCHEMA } from './common/config/environment.validation';
import { LikeModule } from './modules/like/like.module';
import { CommentModule } from './modules/comment/comment.module';
import { Like } from './modules/like/entities/like.entity';
import { Comment } from './modules/comment/entities/comment.entity';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ExploreModule } from './modules/explore/explore.module';
import { FollowModule } from './modules/follow/follow.module';
import { Follow } from './modules/follow/entities/follow.entity';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ENVIRONMENT_VALIDATION_SCHEMA,
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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: true,
        synchronize: false,
        migrationsTableName: 'typeorm_migrations',
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    LikeModule,
    CommentModule,
    CloudinaryModule,
    ExploreModule,
    FollowModule,
    LoggerModule,
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
