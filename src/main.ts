// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ImageLocalizationModule } from './image-localization.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ImageLocalizationModule);
  const port = process.env.PORT || 3021;
  await app.listen(port);
  Logger.log(` ImageLocalizer running on http://localhost:${port}`);
}
bootstrap();
