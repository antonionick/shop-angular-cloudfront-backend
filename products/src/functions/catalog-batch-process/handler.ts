import middy from '@middy/core';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SQSEvent, SQSHandler } from 'aws-lambda';

const snsClient = new SNSClient({ region: process.env.AWS_REGION });
const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
});

const handler: SQSHandler = async (event: SQSEvent) => {
  const processes = event.Records.map(async (record) => {
    try {
      const invokeCommand = new InvokeCommand({
        FunctionName: 'shop-angular-cloudfront-backend-dev-createProduct',
        InvocationType: 'Event',
        Payload: JSON.stringify({
          headers: { 'Content-Type': 'application/json' },
          body: record.body,
        }),
      });

      await lambdaClient.send(invokeCommand);
    } catch (err) {
      console.error(err);
    }
  });

  await Promise.all(processes);

  try {
    const publishCommand = new PublishCommand({
      TopicArn: 'arn:aws:sns:eu-central-1:058264190345:CreateProductTopic',
      Message: 'Products are created!',
    });
    await snsClient.send(publishCommand);
  } catch (err) {
    console.error(err);
  }
};

export const catalogBatchProcess = middy(handler);
