import { IImage } from "./image";

export interface IIngredient {
    id: string;
    name: string;
    baseUnit: string;
    minStock: number;
    forecastDataId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IIngredientDetail {
    id: string;
    name: string;
    baseUnit: string;
    minStock: number;
    forecastDataId: string;
    images: IImage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IIngredientCreate {
    name: string;
    baseUnit: string;
    minStock: number;
    forecastDataId?: string;
}

export interface IIngredientUpdate {
    name?: string;
    baseUnit?: string;
    minStock?: number;
    forecastDataId?: string;
}   