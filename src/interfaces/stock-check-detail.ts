import { IIngredient } from "./ingredient"

export interface IStockCheckDetail {
    id: string,
    checkId: string,
    ingredientId: string,
    systemQty: number,
    actualQty: number,
    reason?: string | null,
    createdAt: Date,
    updatedAt: Date
}

export interface IStockCheckDetailFull {
    id: string,
    checkId: string,
    ingredientId: string,
    ingredient: IIngredient,
    systemQty: number,
    actualQty: number,
    reason?: string | null,
    createdAt: Date,
    updatedAt: Date
}

export interface CreateStockCheckDetail {
    checkId: string,
    ingredientId: string,
    systemQty: number,
    actualQty: number,
    reason?: string | null,
}

export interface UpdateStockCheckDetail {
    checkId?: string,
    ingredientId?: string,
    systemQty?: number,
    actualQty?: number,
    reason?: string | null,
}

export interface StockCheckDetailQuery {
    checkId?: string,
    ingredientId?: string,
    systemQty?: number,
    actualQty?: number,
    reason?: string,
}