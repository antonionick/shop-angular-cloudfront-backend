import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDB } from 'src/products.db/products.db';

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  const productsService = ProductsDB.getInstance();
  const products = await productsService.getProducts();

  return formatJSONResponse(products as never);
};

export const getProductsList = middyfy(handler);
