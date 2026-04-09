import { ITable } from "./table";
import { IPublicUser } from "./user";

export interface IReservation {
    id: string,
    userId: string,
    tableId: string,
    customerName: string,
    phone: string,
    time: Date,
    guestCount: number,
    note: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IReservationDetail {
    id: string,
    userId: string,
    tableId: string,
    customerName: string,
    phone: string,
    time: Date,
    guestCount: number,
    note: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    table: ITable,
    user: IPublicUser,
}

export interface IReservationCreate {
    userId: string,
    tableId: string,
    customerName: string,
    phone: string,
    time: Date,
    guestCount: number,
    note: string,
}

export interface IReservationUpdate {
    userId?: string,
    tableId?: string,
    customerName?: string,
    phone?: string,
    time?: Date,
    guestCount?: number,
    note?: string,
    status?: string,
}

export interface IReservationQuery {
    userId?: string,
    tableId?: string,
    customerName?: string,
    phone?: string,
    time?: Date,
    guestCount?: number,
    note?: string,
    status?: string,
}