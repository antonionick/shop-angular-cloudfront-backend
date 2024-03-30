import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDB } from 'src/db/products-db';
import { StocksDB } from 'src/db/stocks-db';

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const eventId = event.pathParameters.id;

  const product = await ProductsDB.getProductById(eventId);

  if (!product) {
    return {
      statusCode: 400,
      body: 'Product not found',
    };
  }

  const stock = await StocksDB.getStockById(eventId);

  const result = {
    ...product,
    count: stock?.count ?? 0,
  };

  return formatJSONResponse(result);
};

export const getProductsById = middyfy(handler);
