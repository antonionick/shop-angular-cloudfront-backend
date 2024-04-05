import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient } from 'src/db/doc-client-provider';
import { IStockModel } from 'src/models/stock.model';

export namespace StocksDB {
  export const getAllStocks = async (): Promise<IStockModel[]> => {
    const command = new ScanCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
    });

    const documentClient = getDocumentClient();
    const response = await documentClient.send(command);

    return response.Items as IStockModel[];
  };

  export const getStockById = async (product_id: string): Promise<IStockModel> => {
    const command = new GetCommand({
      TableName: process.env.STOCKS_TABLE_NAME,
      Key: { product_id },
    });

    const documentClient = getDocumentClient();
    const response = await documentClient.send(command);

    return response.Item as IStockModel;
  };
}
