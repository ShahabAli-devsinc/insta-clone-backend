import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './common/logger/custom-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
      }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5434),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: 'Logger',
    useClass: CustomLoggerService,  // Use the custom logger
  },],
})
export class AppModule {}
