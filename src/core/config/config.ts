export const maximumQueryRecords = 50;
export const S3Buckets =
  process.env.RUNNING_ENVIRONMENT === 'STAGING'
    ? {
        attachment: 'aladdinb2b-attachment-staging',
        brandingImages: 'aladdinb2b-event-branding-staging',
      }
    : process.env.RUNNING_ENVIRONMENT === 'PRODUCTION'
    ? {
        attachment: 'aladdinb2b-attachment-prod',
        brandingImages: 'aladdinb2b-event-branding-prod',
      }
    : {
        attachment: 'aladdinb2b-attachment-staging',
        brandingImages: 'aladdinb2b-event-branding-staging',
      };

export const presignedUrlExpiration = {
  download: 15 * 60, // 15 minutes
  upload: 15 * 60,
};

export const requiredDirs = [];

export const BASE_URL = process.env.BASE_URL;

export const hexColorRegExp = new RegExp(
  '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$',
);