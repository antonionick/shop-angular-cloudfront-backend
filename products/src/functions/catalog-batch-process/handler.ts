import middy from '@middy/core';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { SQSEvent, SQSHandler } from 'aws-lambda';

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
      console.log(err);
    }
  });

  await Promise.all(processes);
};

export const catalogBatchProcess = middy(handler);
