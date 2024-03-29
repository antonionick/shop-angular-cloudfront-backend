import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient } from 'src/db/doc-client-provider';

export namespace ProductsDB {
  export const getAllProducts = async () => {
    const documentClient = getDocumentClient();

    const getCommand = new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
    });

    const response = await documentClient.send(getCommand);

    return response.Items;
  };
}
