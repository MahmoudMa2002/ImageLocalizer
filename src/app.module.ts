import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageLocalizationService } from './services/image-localization.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  providers: [ImageLocalizationService],
})
export class AppModule {}
