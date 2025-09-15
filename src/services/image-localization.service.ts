// src/services/image-localization.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { S3Buckets, presignedUrlExpiration } from '../core/config/config';

const REGION = process.env.AWS_REGION;

@Injectable()
export class ImageLocalizationService {
  private readonly logger = new Logger(ImageLocalizationService.name);
  private readonly s3 = new S3({ region: REGION });
  private readonly bucket = S3Buckets.imageLocalizer;

  private async localizeImage(url: string, prefix: string): Promise<boolean> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const key = `${prefix}/${uuid()}.jpg`;

      // Dry run log
      this.logger.log(`Would upload: s3://${this.bucket}/${key}`);

      // Uncomment to actually upload
      // await this.s3.putObject({
      //   Bucket: this.bucket,
      //   Key: key,
      //   Body: buffer,
      //   ContentType: response.headers['content-type'] || 'image/jpeg',
      // }).promise();

      return true;
    } catch (err) {
      this.logger.error(`Failed to localize image: ${url}`);
      return false;
    }
  }

  private async handleImages(name: string, urls: string[], prefix: string) {
    let success = 0;
    let failed = 0;

    for (const url of urls) {
      const result = await this.localizeImage(url, prefix);
      if (result) success++;
      else failed++;
    }

    this.logger.log(`[${name}] Success: ${success}, Failed: ${failed}`);
  }

  @Cron('*/10 * * * * *') // every 10s
  handleCompanyLogos() {
    this.logger.debug('Cron => Localizing company logos....');
    const logos = [
      'https://dummyimage.com/200x200/000/fff.png&text=Company+A',
      'https://dummyimage.com/200x200/111/fff.png&text=Company+B',
    ];
    return this.handleImages('Company Logos', logos, 'companies/logos');
  }

  @Cron('*/15 * * * * *') // every 15s
  handleContactAvatars() {
    this.logger.debug('Cron => Localizing contact avatars....')
    const avatars = [
      'https://dummyimage.com/100x100/222/fff.png&text=User+1',
      'https://dummyimage.com/100x100/333/fff.png&text=User+2',
    ];
    return this.handleImages('Contact Avatars', avatars, 'contacts/avatars');
  }
}