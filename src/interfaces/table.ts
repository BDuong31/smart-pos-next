import { IZone } from "./zone";

export interface ITable {
    id: string,
    zoneId: string,
    name: string,
    qrCode: string,
    capacity: number,
    isActive: boolean,
    status: 'available' | 'occupied' | 'reserved' | 'maintenance',
    createdAt: Date,
    updatedAt: Date,
}

export interface ITableDetail {
    id: string,
    zoneId: string,
    zone: IZone,
    name: string,
    qrCode: string,
    capacity: number,
    isActive: boolean,
    status: 'available' | 'occupied' | 'reserved' | 'maintenance',
    createdAt: Date,
    updatedAt: Date,
}

export interface CreateTable {
    zoneId: string,
    name: string,
    qrCode: string,
    capacity: number,
    isActive: boolean,
}

export interface UpdateTable {
    zoneId?: string,
    name?: string,
    qrCode?: string,
    capacity?: number,
    isActive?: boolean,
    status?: string,
}

export interface TableQuery {
    zoneId?: string,
    name?: string,
    qrCode?: string,
    capacity?: number,
    isActive?: boolean,
    status?: string,
}

export const TableStatus = {
    available: 'Bàn trống',
    occupied: 'Bàn đã có khách',
    reserved: 'Bàn đã đặt trước',
    maintenance: 'Bàn đang bảo trì',
}