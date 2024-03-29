import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let documentClient: DynamoDBDocumentClient;

export const getDocumentClient = () => {
  if (!documentClient) {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    documentClient = DynamoDBDocumentClient.from(client);
  }

  return documentClient;
};
