import { IPublicUser } from "./user"

export interface IStockCheck {
    id: string,
    code: string,
    userId: string,
    note: string | null,
    checkDate: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface IStockCheckFull {
    id: string,
    code: string,
    userId: string,
    user: IPublicUser
    note: string | null,
    checkDate: Date,
    createdAt: Date,
    updatedAt: Date
}

export interface CreateStockCheck {
    code?: string,
    userId: string,
    note?: string | null,
    checkDate: Date,
}

export interface UpdateStockCheck {
    code?: string,
    userId?: string,
    note?: string | null,
    checkDate?: Date,
}

export interface StockCheckQuery {
    code?: string,
    userId?: string,
    note?: string,
    checkDate?: Date,
}