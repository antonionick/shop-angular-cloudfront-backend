import crypto from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const main = async () => {
	const client = new DynamoDBClient({ region: "eu-central-1" });
	const docClient = DynamoDBDocumentClient.from(client);

	const products = Array.from({ length: 10 }).map((_, index) => generateProduct(index + 1));

	await putProductsTable(docClient, products);
	await putStockTable(docClient, products);
};

const generateProduct = (index) => ({
	id: crypto.randomUUID(),
	title: `Product ${index} Title`,
	description: `Product ${index} Description`,
	price: getRandomNumber(index * 10, index * 5),
});

const getRandomNumber = (max, min) => Math.ceil(Math.random() * (max - min) + min);

const putProductsTable = async (docClient, products) => {
	const putCommands = products.map(product => new PutCommand({
		TableName: 'Products',
		Item: product,
	}));

	const operationsProcesses = putCommands.map(putCommand => docClient.send(putCommand));

	await Promise.all(operationsProcesses);
};

const putStockTable = async (docClient, products) => {
	const stockItems = products.map((product, index) => ({
		product_id: product.id,
		count: getRandomNumber((index+ 1) * 20, (index + 1) * 7),
	}));

	const putCommands = stockItems.map(Item => new PutCommand({
		Item,
		TableName: 'Stocks',
	}))

	const operationsProcesses = putCommands.map(putCommand => docClient.send(putCommand));

	await Promise.all(operationsProcesses);
};

main();