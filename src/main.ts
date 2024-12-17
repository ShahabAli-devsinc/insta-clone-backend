import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLoggerService } from './common/logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Instagram Clone API')
    .setDescription('API documentation for the Instagram Clone app')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Logger Setup
  app.useLogger(app.get(CustomLoggerService));


  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
