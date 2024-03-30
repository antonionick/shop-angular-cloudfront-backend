import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      httpApi: {
        method: 'POST',
        path: '/products',
      },
    },
  ],
  environment: {
    PRODUCTS_TABLE_NAME: 'Products',
  },
};
