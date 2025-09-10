<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Built with [NestJS](https://github.com/nestjs/nest) framework featuring automated image localization, S3 storage integration, and scheduled data processing tasks.

## Features

- **Image Localization Service**: Automatically downloads and stores external images (company logos, contact avatars) to your own S3 bucket
- **Scheduled Jobs**: Daily automated tasks for data processing and image synchronization
- **AWS S3 Integration**: Secure file storage and management
- **Enterprise-ready**: Built for scalability and reliability


## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region

# S3 Bucket Configuration
S3_BUCKET_BRANDING_IMAGES=your-branding-images-bucket

# Database Configuration (if applicable)
DATABASE_URL=your_database_connection_string
```

## Compile and run the project

```bash
# development
$ npm run start

```

## Scheduled Jobs

The application runs the following automated tasks:

- **Company Logo Localization**: Every 10 Seconds for testing
- **Contact Avatar Localization**: Every 10 Seconds for testing


## Architecture

```
src/
├── core/
│   ├── config/          # Configuration files
│   └── services/        # Core services (AWS, etc.)
├── services/
│   └── image-localization.service.ts  # Image processing service
└── main.ts              # Application bootstrap
