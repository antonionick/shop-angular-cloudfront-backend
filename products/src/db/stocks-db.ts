import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient } from 'src/db/doc-client-provider';

export namespace StocksDB {
  export const getAllStocks = async () => {
    const documentClient = getDocumentClient();

    const getCommand = new ScanCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
    });

    const response = await documentClient.send(getCommand);

    return response.Items;
  };
}
