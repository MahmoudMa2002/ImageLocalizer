import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ImageLocalizationService } from './image-localization.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // enables cron jobs
  ],
  providers: [ImageLocalizationService],
})
export class AppModule {}
