import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const REGION = 'eu-central-1';
const BUCKET_NAME = 'import-service-bucket-anton';

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Name query parameter is not presented',
      }),
    };
  }

  const signedUrl = await createPresignedUrlWithClient({
    region: REGION,
    bucket: BUCKET_NAME,
    key: name,
  });

  return {
    statusCode: 200,
    body: signedUrl,
  };
};

export const importProductsFile = middyfy(handler);
