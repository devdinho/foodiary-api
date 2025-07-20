import { SQSEvent } from "aws-lambda";
import { ProcessMeal } from "../queues/processMeal";

export async function handler(event: SQSEvent) {
  console.log('Received SQS event:', JSON.stringify(event, null, 2));

  await Promise.all(
    event.Records.map(async (record) => {
      const fileKey = record.body;
      await ProcessMeal.process(fileKey);
    })
  );
}
