import middy from '@middy/core';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

const client = new S3Client({ region: 'eu-central-1' });
const sqsClient = new SQSClient({ region: 'eu-central-1' });

const sendSqsMessageHandler = async (message: object) => {
  const command = new SendMessageCommand({
    QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/058264190345/catalog-item-queue',
    MessageBody: JSON.stringify(message),
  });

  await sqsClient.send(command);
};

const handler = async (event: S3Event) => {
  const processes = event.Records.map(async (record) => {
    const getObjectCommand = new GetObjectCommand({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    });

    try {
      const response = await client.send(getObjectCommand);

      const messagesRequests = await new Promise<Promise<unknown>[]>((resolve, reject) => {
        const sendMessagePromises = [];

        response.Body.pipe(csv())
          .on('data', (data) => {
            const sendMessagePromise = new Promise((internalResolve, internalReject) =>
              sendSqsMessageHandler(data).then(internalResolve, internalReject),
            );

            sendMessagePromises.push(sendMessagePromise);
          })
          .on('error', reject)
          .on('end', () => resolve(sendMessagePromises));
      });

      await Promise.all(messagesRequests);
    } catch (err) {
      console.error(err);
    }
  });

  await Promise.all(processes);
};

export const importFileParser = middy(handler);
