import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { sqsClient } from '../clients/sqsClient';

export async function handler(event: APIGatewayProxyEventV2) {
  const parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  const records = parsedBody?.Records;

  if (!Array.isArray(records)) {
    return { statusCode: 400, body: 'Formato de evento inválido' };
  }
  
  await Promise.all(
    records.map(async (record: any) => {
      const fileKey = decodeURIComponent(record?.s3?.object?.key || '');

      if (!fileKey) {
        return;
      }

      console.log('===> Ambiente em tempo de execução:', process.env.STAGE);
      console.log('===> URL da fila que será usada:', process.env.MEALS_QUEUE_URL);
      const queueUrl = process.env.MEALS_QUEUE_URL;

      console.log('===> Enviando mensagem para a fila SQS:', queueUrl);
      
      const command = new SendMessageCommand({
        QueueUrl: queueUrl!,
        MessageBody: fileKey,
      });

      await sqsClient.send(command);
    })
  );

  return { statusCode: 200, body: 'Mensagens enviadas com sucesso' };
}
