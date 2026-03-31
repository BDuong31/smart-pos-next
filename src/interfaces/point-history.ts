import { IPublicUser } from "./user";

export interface IPointHisoty {
    id: string,
    userId: string,
    amount: number,
    reason: string,
    createdAt: string,
    updatedAt: string,
}

export interface IPointHistoryDetail {
    id: string,
    userId: string,
    user: IPublicUser,
    amount: number,
    reason: string,
    createdAt: string,
    updatedAt: string,
}

export interface IPointHistoryCreate {
    userId: string,
    amount: number,
    reason: string,
}

export interface IPointHistoryUpdate {
    userId?: string,
    amount?: number,
    reason?: string,
}

export interface IPointHistoryQuery {
    userId?: string,
    amount?: number,
    reason?: string,
}