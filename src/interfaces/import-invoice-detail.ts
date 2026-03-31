import { IIngredient } from "./ingredient"

export interface IImportInvoiceItem {
    id: string,
    invoiceId: string,
    ingredientId: string,
    quantity: number,
    unit: string,
    unitPrice: number,
    createdAt: Date,
    updatedAt: Date
}

export interface IImportInvoiceItemDetail {
    id: string,
    invoiceId: string,
    ingredientId: string,
    ingredient?: IIngredient,
    quantity: number,
    unit: string,
    unitPrice: number,
    createdAt: Date,
    updatedAt: Date
}

export interface CreateImportInvoiceDetail {
    invoiceId: string,
    ingredientId: string,
    quantity: number,
    unit: string,
    unitPrice: number
}

export interface UpdateImportInvoiceDetail {
    id: string,
    invoiceId?: string,
    ingredientId?: string,
    quantity?: number,
    unit?: string,
    unitPrice?: number
}

export interface ImportInvoiceDetailFilter {
    invoiceId?: string,
    ingredientId?: string,
    quantity?: number,
    unit?: string,
    unitPrice?: number
}