import { SQSClient } from '@aws-sdk/client-sqs';

export const sqsClient = new SQSClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY!,
  },
});
