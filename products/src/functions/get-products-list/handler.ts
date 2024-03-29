import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDB } from 'src/db/products-db';
import { StocksDB } from 'src/db/stocks-db';

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  try {
    const products = await ProductsDB.getAllProducts();
    const stocks = await StocksDB.getAllStocks();

    const result = products.map((product) => {
      const foundStock = stocks.find((stock) => product.id === stock.product_id);

      return {
        ...product,
        count: foundStock?.count ?? 0,
      };
    });

    return formatJSONResponse(result as never);
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

export const getProductsList = middyfy(handler);
