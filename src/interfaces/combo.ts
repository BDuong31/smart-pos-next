import { IImage } from "./image";
import { IProduct, IProductDetails } from "./product";
import { IVariant } from "./variant";

export interface ICombo {
    id: string;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComboDetail {
    id: string;
    name: string;
    price: number;
    images: IImage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IComboCreate {
    name: string;
    price: number;
} 

export interface IComboUpdate {
    name?: string;
    price?: number;
}

export interface IComboItem {
    id: string;
    comboId: string;
    productId: string;
    variantId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComboItemDetail {
    id: string;
    comboId: string;
    productId: string;
    variantId: string;
    quantity: number;
    product: IProduct;
    variant: IVariant;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComboItemCreate {
    comboId: string;
    productId: string;
    variantId: string;
    quantity: number;
}

export interface IComboItemUpdate {
    comboId?: string;
    productId?: string;
    variantId?: string;
    quantity?: number;
}