import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDB } from 'src/products.db/products.db';

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  const productsDb = ProductsDB.getInstance();
  const products = await productsDb.getProducts();

  return formatJSONResponse(products as never);
};

export const getProductsList = middyfy(handler);
