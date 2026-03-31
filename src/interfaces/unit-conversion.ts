import { IIngredient } from "./ingredient";

export interface IUnitConversion {
    id: string;
    ingredientId: string;
    fromUnit: string;
    toUnit: string;
    factor: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUnitConversionDetail {
    id: string;
    ingredientId: string;
    fromUnit: string;
    toUnit: string;
    factor: number;
    ingredient: IIngredient;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUnitConversionCreate {
    ingredientId: string;
    fromUnit: string;
    toUnit: string;
    factor: number;
}

export interface IUnitConversionUpdate {
    ingredientId?: string;
    fromUnit?: string;
    toUnit?: string;
    factor?: number;
}