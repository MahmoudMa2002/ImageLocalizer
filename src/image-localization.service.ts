// image-localization.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ImageLocalizationService {
    private readonly logger = new Logger(ImageLocalizationService.name);

    //@Cron(CronExpression.EVERY_DAY_AT_2AM) // Cron for company logos – runs daily at 2 AM
    @Cron('*/10 * * * * *') // For testing - runs every 10 Seconds
    async localizeCompanyLogos() {
        this.logger.log('---------------------------------------------------------')
        this.logger.log('Starting company logo localization job...');

        //-------------------TODO-------------------
        // 1. Fetch companies updated since last run
        // const companies = await this.companyService.getUpdatedCompanies();

        // 2. Filter those with external logos
        // const externalLogos = companies.filter(c => c.logo.startsWith('http'));

        // 3. Loop through and upload to S3
        // for (const company of externalLogos) {
        //   // download image
        //   // upload to S3
        //   // update company DB with new path
        // }

        // 4. Log summary
        this.logger.log('Company logo localization job ended!');
    }

    //@Cron('0 3 * * *') // Cron for contact avatars – runs daily at 3 AM
    @Cron('*/10 * * * * *') // For testing - runs every 10 Seconds
    async localizeContactAvatars() {
        this.logger.log('Starting contact avatar localization job...');
        // same steps as above for contacts
        this.logger.log('Contact avatar localization job ended!');
        this.logger.log('---------------------------------------------------------')
    }
}
