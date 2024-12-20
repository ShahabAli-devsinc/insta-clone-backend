import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLoggerService } from './common/logger/custom-logger.service';
import { APP_CONSTANTS } from 'src/common/constants/constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS using constants
  app.enableCors({
    origin: APP_CONSTANTS.CORS_ORIGIN,
    credentials: true,
  });

  // Use cookie-parser
  app.use(cookieParser());

  // Swagger setup using constants
  const config = new DocumentBuilder()
    .setTitle(APP_CONSTANTS.SWAGGER.TITLE)
    .setDescription(APP_CONSTANTS.SWAGGER.DESCRIPTION)
    .setVersion(APP_CONSTANTS.SWAGGER.VERSION)
    .addTag(APP_CONSTANTS.SWAGGER.TAGS[0])
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Logger Setup
  app.useLogger(app.get(CustomLoggerService));

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Use constant for default port
  await app.listen(process.env.PORT ?? APP_CONSTANTS.DEFAULT_PORT);
}

bootstrap();
