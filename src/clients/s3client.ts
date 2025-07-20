const AWS = require('aws-sdk');

export const s3Client = new AWS.S3({
  endpoint: process.env.MINIO_ENDPOINT,
  accessKeyId: process.env.MINIO_ACCESS_KEY,
  secretAccessKey: process.env.MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

export const bucketUrl = `https://${process.env.MINIO_ENDPOINT}/${process.env.BUCKET_NAME}`;