import middy from '@middy/core';
import { SQSEvent, SQSHandler } from 'aws-lambda';

const handler: SQSHandler = (event: SQSEvent) => {
  event.Records.forEach((record) => {
    console.log(record);
    console.log(record.attributes);
    console.log(record.messageAttributes);
  });
};

export const catalogBatchProcess = middy(handler);
