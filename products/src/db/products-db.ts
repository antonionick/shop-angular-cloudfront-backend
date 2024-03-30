import crypto from 'node:crypto';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient } from 'src/db/doc-client-provider';
import { IProductModel, TProductCreate } from 'src/models/product.model';

export namespace ProductsDB {
  export const createProduct = async (productCreate: TProductCreate): Promise<any> => {
    const product: IProductModel = {
      ...productCreate,
      id: crypto.randomUUID(),
    };

    const command = new PutCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Item: product,
    });

    const documentClient = getDocumentClient();
    await documentClient.send(command);

    return product;
  };

  export const getAllProducts = async (): Promise<IProductModel[]> => {
    const command = new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
    });

    const documentClient = getDocumentClient();
    const response = await documentClient.send(command);

    return response.Items as IProductModel[];
  };

  export const getProductById = async (id: string): Promise<IProductModel> => {
    const command = new GetCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: { id },
    });

    const documentClient = getDocumentClient();
    const response = await documentClient.send(command);

    return response.Item as IProductModel;
  };
}
