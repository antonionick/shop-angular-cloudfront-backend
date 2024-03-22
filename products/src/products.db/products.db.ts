import products from './products.json';

export class ProductsDB {
	private static instance: ProductsDB;

	public static getInstance(): ProductsDB {
		if (!this.instance) {
			this.instance = new ProductsDB();
		}

		return this.instance;
	}

	protected constructor() {}

	public async getProducts() {
		return products;
	}
}