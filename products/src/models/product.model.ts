import { IStockModel } from 'src/models/stock.model';

export interface IProductModel {
	id: string;
	title: string;
	description: string;
	price: number;
}

export type TProductCreate = Omit<IProductModel, 'id'>;

export type TProductStock = IProductModel & IStockModel;