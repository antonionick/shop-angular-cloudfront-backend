import middy from '@middy/core';
import { SNSHandler } from 'aws-lambda';
import { SNSClient, SubscribeCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

const handler: SNSHandler = async () => {
  try {
    await snsClient.send(
      new SubscribeCommand({
        Protocol: 'email',
        TopicArn: 'arn:aws:sns:eu-central-1:058264190345:CreateProductTopic',
        Endpoint: 'anton.halauko.service@gmail.com',
      }),
    );
  } catch (err) {
    console.error(err);
  }
};

export const createProductNotification = middy(handler);
