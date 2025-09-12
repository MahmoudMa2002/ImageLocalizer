// src/image-localization.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ImageLocalizationService } from '../src/services/image-localization.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [ImageLocalizationService],
})
export class ImageLocalizationModule {}
