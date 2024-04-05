import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/products/{id}',
      },
    },
  ],
  environment: {
    STOCKS_TABLE_NAME: 'Stocks',
    PRODUCTS_TABLE_NAME: 'Products',
  },
};
