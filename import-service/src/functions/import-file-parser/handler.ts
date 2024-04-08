import middy from '@middy/core';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import csv from 'csv-parser';

const client = new S3Client({ region: 'eu-central-1' });

const handler = async (event: S3Event) => {
  const processes = event.Records.map(async (record) => {
    const getObjectCommand = new GetObjectCommand({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key,
    });

    try {
      const response = await client.send(getObjectCommand);

      await new Promise((resolve, reject) =>
        response.Body.pipe(csv())
          .on('data', (data) => console.log(data))
          .on('error', reject)
          .on('end', resolve),
      );
    } catch (err) {
      console.error(err);
    }
  });

  await Promise.all(processes);
};

export const importFileParser = middy(handler);
