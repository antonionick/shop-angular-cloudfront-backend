import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient } from 'src/db/doc-client-provider';

export namespace ProductsDB {
  export const getAllProducts = async () => {
    const documentClient = getDocumentClient();

    const command = new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
    });

    const response = await documentClient.send(command);

    return response.Items;
  };

  export const getProductById = async (id: string) => {
    const documentClient = getDocumentClient();

    const command = new GetCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: { id },
    });

    const response = await documentClient.send(command);

    return response.Item;
  };
}
