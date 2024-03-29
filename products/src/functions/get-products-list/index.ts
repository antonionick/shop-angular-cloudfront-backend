import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/products',
      },
    },
  ],
  environment: {
    STOCKS_TABLE_NAME: 'Stocks',
    PRODUCTS_TABLE_NAME: 'Products',
  },
};
