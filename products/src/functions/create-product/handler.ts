import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import middy from '@middy/core';
import validator from '@middy/validator';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { transpileSchema } from '@middy/validator/transpile';
import { ProductsDB } from 'src/db/products-db';
import { TProductCreate } from 'src/models/product.model';

const handler: ValidatedEventAPIGatewayProxyEvent<TProductCreate> = async (event) => {
  try {
    console.log(event);

    const productToCreate = event.body as TProductCreate;

    const response = await ProductsDB.createProduct(productToCreate);

    return formatJSONResponse(response);
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

const schema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['title', 'description', 'price'],
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        price: {
          type: 'number',
        },
      },
    },
  },
};

export const createProduct = middy()
  .use(middyJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(schema) }))
  .handler(handler);
