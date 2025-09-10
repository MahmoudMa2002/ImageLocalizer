// image-localization.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthorizedS3 } from 'src/core/services/AWS'; // adjust path if needed
import { S3Buckets } from 'src/core/config/config';
import * as https from 'https'; // for downloading external images

@Injectable()
export class ImageLocalizationService {
    private readonly logger = new Logger(ImageLocalizationService.name);

    // --- Helper: download image from external URL into Buffer ---
    private async downloadImage(url: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                const chunks: Uint8Array[] = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', (err) => reject(err));
            });
        });
    }

    // --- Helper: upload image buffer to S3 ---
    private async uploadToS3(
        file: Buffer,
        fileName: string,
        mimeType: string,
    ): Promise<string> {
        const params = {
            Bucket: S3Buckets.brandingImages, // confirmed bucket
            Key: fileName, // e.g., "companies/{id}/logo.png"
            Body: file,
            ContentType: `image/${mimeType}`,
        };
        const uploaded = await AuthorizedS3.upload(params).promise();
        return uploaded.Location; // return new S3 URL
    }

    // --- Company logos (runs daily at 2 AM) ---
    @Cron('*/10 * * * * *')
    async localizeCompanyLogos() {
        this.logger.log('---------------------------------------------------------');
        this.logger.log('Starting company logo localization job...');

        // TODO: 1. Fetch companies updated since last run
        // const companies = await this.companyService.getUpdatedCompanies();

        // TODO: 2. Filter those with external logos (http/https)
        // const externalLogos = companies.filter(c => c.logo?.startsWith('http'));

        // TODO: 3. For each external logo:
        //   - download image (downloadImage)
        //   - upload to S3 (uploadToS3 with "companies/{id}/logo.png")
        //   - update DB record with new S3 path

        this.logger.log('Company logo localization job ended!');
    }

    // --- Contact avatars (runs daily at 3 AM) ---
    @Cron('*/10 * * * * *')
    async localizeContactAvatars() {
        this.logger.log('Starting contact avatar localization job...');

        // TODO: 1. Fetch contacts updated since last run
        // const contacts = await this.contactService.getUpdatedContacts();

        // TODO: 2. Filter those with external avatars (http/https)
        // const externalAvatars = contacts.filter(c => c.avatar?.startsWith('http'));

        // TODO: 3. For each external avatar:
        //   - download image (downloadImage)
        //   - upload to S3 (uploadToS3 with "contacts/{id}/avatar.png")
        //   - update DB record with new S3 path

        this.logger.log('Contact avatar localization job ended!');
        this.logger.log('---------------------------------------------------------');
    }
}
