import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '../../products.json';

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async () =>
  formatJSONResponse(products as never);

export const getProductsList = middyfy(handler);
