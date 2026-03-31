import { IIngredient } from "./ingredient"

export interface IInventoryBatch {
    id: string,
    ingredientId: string,
    importInvoiceDetailId: string,
    quantity: number,
    expiryDate: Date,
    importDate: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface IInventoryBatchDetail {
    id: string,
    ingredientId: string,
    importInvoiceDetailId: string,
    ingredient?: IIngredient,
    quantity: number,
    expiryDate: Date,
    importDate: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface CreateInventoryBatch {
    ingredientId: string,
    importInvoiceDetailId?: string,
    quantity: number,
    expiryDate: Date,
    importDate: Date
}

export interface UpdateInventoryBatch {
    id: string,
    ingredientId?: string,
    importInvoiceDetailId?: string,
    quantity?: number,
    expiryDate?: Date,
    importDate?: Date
}

export interface InventoryBatchFilter {
    ingredientId?: string,
    importInvoiceDetailId?: string,
    quantity?: number,
    expiryDate?: Date,
    importDate?: Date,
}


