// src/services/image-localization.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const S3_BUCKET = process.env.S3_BUCKET || 'aladdinb2b-image-localizer-staging';
const REGION = process.env.AWS_REGION || 'eu-west-1';

@Injectable()
export class ImageLocalizationService {
  private readonly logger = new Logger(ImageLocalizationService.name);
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({ region: REGION });
  }

  /**
   * Downloads an image and (in production) uploads it to S3.
   * In dry-run mode, just logs what would happen.
   */
  async localizeImage(url: string, prefix: string): Promise<string | null> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const key = `${prefix}/${uuid()}.jpg`;

      // --- Dry run mode: log instead of uploading ---
      this.logger.log(`DRY RUN → would upload ${url} → s3://${S3_BUCKET}/${key}`);
      
      // Uncomment for real uploads:
      // await this.s3
      //   .putObject({
      //     Bucket: S3_BUCKET,
      //     Key: key,
      //     Body: buffer,
      //     ContentType: response.headers['content-type'] || 'image/jpeg',
      //   })
      //   .promise();

      return key;
    } catch (error) {
      this.logger.error(`Failed to localize image ${url}`, error.stack);
      return null;
    }
  }

  @Cron('*/10 * * * * *') // every 10s
  async handleCompanyLogos() {
    this.logger.debug('Cron → Localizing company logos...');
    const exampleCompanyLogos = [
      'https://dummyimage.com/200x200/000/fff.png&text=Company+A',
      'https://dummyimage.com/200x200/111/fff.png&text=Company+B',
    ];

    for (const logoUrl of exampleCompanyLogos) {
      await this.localizeImage(logoUrl, 'companies/logos');
    }
  }

  @Cron('*/15 * * * * *') // every 15s
  async handleContactAvatars() {
    this.logger.debug('Cron → Localizing contact avatars...');
    const exampleContactAvatars = [
      'https://dummyimage.com/100x100/222/fff.png&text=User+1',
      'https://dummyimage.com/100x100/333/fff.png&text=User+2',
    ];

    for (const avatarUrl of exampleContactAvatars) {
      await this.localizeImage(avatarUrl, 'contacts/avatars');
    }
  }
}
