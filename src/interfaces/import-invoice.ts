import { ISupplier } from "./supplier"

export interface IImportInvoice {
    id: string,
    code: string,
    supplierId: string,
    totalCost: number,
    importDate: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface IImportInvoiceFull {
    id: string,
    code: string,
    supplierId: string,
    supplier: ISupplier,
    totalCost: number,
    importDate: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface CreateImportInvoice {
    code: string,
    supplierId: string,
    totalCost: number,
    importDate: Date
}

export interface UpdateImportInvoice {
    id: string,
    code?: string,
    supplierId?: string,
    totalCost?: number,
    importDate?: Date
}

export interface ImportInvoiceFilter {
    code?: string,
    supplierId?: string,
    totalCost?: number,
    importDate?: Date
}