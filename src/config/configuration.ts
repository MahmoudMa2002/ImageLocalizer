export default () => ({
  port: parseInt(process.env.PORT ?? '3021', 10),
  mongo: {
    company: process.env.MONGO_URI_COMPANY ?? '',
    event: process.env.MONGO_URI_EVENT ?? '',
    meeting: process.env.MONGO_URI_MEETING ?? '',
    subscription: process.env.MONGO_URI_SUBSCRIPTION ?? '',
    user: process.env.MONGO_URI_USER ?? '',
  },
  aws: {
    region: process.env.AWS_REGION ?? 'eu-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    bucket: process.env.S3_BUCKET ?? 'aladdinb2b-image-localizer-staging',
  },
});
