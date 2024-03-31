import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ProductsDB } from 'src/products.db/products.db';

const handler: ValidatedEventAPIGatewayProxyEvent<unknown> = async (event) => {
	const productsDb = ProductsDB.getInstance();
	const products = await productsDb.getProducts();

	const eventId = event.pathParameters.id;
	const productById = products.find(product => product.id === eventId);

	if (!productById) {
		return {
			statusCode: 400,
			body: 'Product not found'
		};
	}

	return formatJSONResponse(productById);
};

export const getProductsById = middyfy(handler);
