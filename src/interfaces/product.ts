import { ICategory } from "./category";
import { IImage } from "./image";
import { IPrinter } from "./printer";
import { IVariant } from "./variant";

export interface IProduct {
    id: string;
    name: string;
    categoryId: string;
    printerId: string;
    basePrice: number;
    isCombo: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductDetails extends IProduct {
    category: ICategory;
    images: IImage[];
    printer: IPrinter;
    variants: IVariant[];
}

export interface IProductCreate {
    name: string,
    categoryId: string,
    printerId: string,
    basePrice: number,
    isActive: boolean,
    isCombo: boolean,
}

export interface IProductUpdate {
    name?: string,
    categoryId?: string,
    printerId?: string,
    basePrice?: number,
    isActive?: boolean,
    isCombo?: boolean,
}

export interface IConditionalProduct {
    name?: string,
    categoryId?: string,
    printerId?: string,
    basePrice?: number,
    isActive?: boolean,
    isCombo?: boolean,
}