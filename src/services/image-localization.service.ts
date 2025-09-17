// src/services/image-localization.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { MongoClient } from 'mongodb';
import { S3Buckets } from '../core/config/config';

@Injectable()
export class ImageLocalizationService {
  private readonly logger = new Logger(ImageLocalizationService.name);
  private readonly s3 = new S3({ region: process.env.AWS_REGION || 'eu-west-1' });

  private async localizeImage(url: string, prefix: string): Promise<string | null> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
      const buffer = Buffer.from(response.data);
      const key = `${prefix}/${uuid()}.jpg`;

      await this.s3.putObject({
        Bucket: S3Buckets.imageLocalizer,
        Key: key,
        Body: buffer,
        ContentType: response.headers['content-type'] || 'image/jpeg',
      }).promise();

      return `https://${S3Buckets.imageLocalizer}.s3.${process.env.AWS_REGION || 'eu-west-1'}.amazonaws.com/${key}`;
    } catch (error) {
      this.logger.error(`Failed to localize: ${url}`);
      return null;
    }
  }

  private async logJob(jobName: string, success: number, failed: number) {
    const client = new MongoClient(process.env.MONGO_URI_COMPANY || '');
    await client.connect();

    await client.db().collection('cronLogs').insertOne({
      jobName,
      lastRunTime: new Date(),
      status: failed === 0 ? 'SUCCESS' : 'PARTIAL',
      successCount: success,
      failedCount: failed,
      createdAt: new Date()
    });

    await client.close();
    this.logger.log(`[${jobName}] Success: ${success}, Failed: ${failed}`);
  }

  @Cron('*/15 * * * * *') //@Cron('0 0 2 * * *') // Daily at 2 AM
  async handleCompanyLogos() {
    const client = new MongoClient(process.env.MONGO_URI_COMPANY || '');
    await client.connect();

    // Debug: Check total companies
    const totalCompanies = await client.db().collection('companies').countDocuments();
    this.logger.debug(`Total companies in DB: ${totalCompanies}`);

    // Debug: Check companies with any logo/profileImage
    const companiesWithImages = await client.db().collection('companies').countDocuments({
      $or: [{ logo: { $exists: true } }, { profileImage: { $exists: true } }]
    });
    this.logger.debug(`Companies with logo/profileImage: ${companiesWithImages}`);

    // Get companies with external logos updated in last 24h
    const companies = await client.db().collection('companies').find({
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      $or: [
        { logo: /^https?:\/\// },
        { profileImage: /^https?:\/\// }
      ]
    }).toArray();

    this.logger.debug(`Found ${companies.length} companies to process`);

    let success = 0, failed = 0;

    for (const company of companies) {
      try {
        const updates: any = {};

        if (company.logo && /^https?:\/\//.test(company.logo)) {
          const newLogo = await this.localizeImage(company.logo, 'companies/logos');
          if (newLogo) updates.logo = newLogo;
        }

        if (company.profileImage && /^https?:\/\//.test(company.profileImage)) {
          const newImage = await this.localizeImage(company.profileImage, 'companies/profiles');
          if (newImage) updates.profileImage = newImage;
        }

        if (Object.keys(updates).length > 0) {
          await client.db().collection('companies').updateOne(
            { _id: company._id },
            { $set: { ...updates, updatedAt: new Date() } }
          );
          success++;
        }
      } catch (error) {
        failed++;
        this.logger.error(`Error processing company ${company._id}`);
      }
    }

    await client.close();
    await this.logJob('COMPANY_LOGOS', success, failed);
  }

  @Cron('*/20 * * * * *') //@Cron('0 15 2 * * *') // Daily at 2:15 AM
  async handleContactAvatars() {
    const client = new MongoClient(process.env.MONGO_URI_USER || '');
    await client.connect();

    // Debug: Check total contacts
    const totalContacts = await client.db().collection('contacts').countDocuments();
    this.logger.debug(`Total contacts in DB: ${totalContacts}`);

    // Debug: Check contacts with avatars
    const contactsWithAvatars = await client.db().collection('contacts').countDocuments({
      avatar: { $exists: true }
    });
    this.logger.debug(`Contacts with avatars: ${contactsWithAvatars}`);

    // Get contacts with external avatars updated in last 24h
    const contacts = await client.db().collection('contacts').find({
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      avatar: /^https?:\/\//
    }).toArray();

    this.logger.debug(`Found ${contacts.length} contacts to process`);

    let success = 0, failed = 0;

    for (const contact of contacts) {
      try {
        const newAvatar = await this.localizeImage(contact.avatar, 'contacts/avatars');
        if (newAvatar) {
          await client.db().collection('contacts').updateOne(
            { _id: contact._id },
            { $set: { avatar: newAvatar, updatedAt: new Date() } }
          );
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        this.logger.error(`Error processing contact ${contact._id}`);
      }
    }

    await client.close();
    await this.logJob('CONTACT_AVATARS', success, failed);
  }
}