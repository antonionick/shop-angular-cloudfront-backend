import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient } from 'src/db/doc-client-provider';

export namespace StocksDB {
  export const getAllStocks = async () => {
    const documentClient = getDocumentClient();

    const command = new ScanCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
    });

    const response = await documentClient.send(command);

    return response.Items;
  };

  export const getStockById = async (product_id: string) => {
    const documentClient = getDocumentClient();

    const command = new GetCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
      Key: { product_id },
    });

    const response = await documentClient.send(command);

    return response.Item;
  };
}
