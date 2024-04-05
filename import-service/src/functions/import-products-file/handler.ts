import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Name query parameter is not presented',
      }),
    };
  }

  return formatJSONResponse(event.queryStringParameters);
};

export const importProductsFile = middyfy(handler);
