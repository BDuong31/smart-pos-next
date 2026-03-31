import { IIngredient } from "./ingredient";

export interface IRecipe {
    id: string;
    ingredientId: string;
    amount: number;
    productId: string;
    variantId: string;
    optionItemId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRecipeDetail {
    id: string;
    ingredientId: string;
    amount: number;
    productId: string;
    variantId: string;
    optionItemId: string;
    ingredient: IIngredient;
    createdAt: Date;
    updatedAt: Date;
 }

export interface IRecipeCreate {
    ingredientId: string;
    amount: number;
    productId?: string;
    variantId?: string;
    optionItemId?: string;
}

export interface IRecipeUpdate {
    ingredientId?: string;
    amount?: number;
    productId?: string;
    variantId?: string;
    optionItemId?: string;
}