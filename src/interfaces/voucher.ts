export interface IVoucher {
    id: string,
    code: string,
    type: string,
    value: number,
    minOrderVal: number,
    usageLimit: number,
    isActive: boolean,
    startDate: Date,
    endDate: Date,
    createdAt: Date,
    updatedAt: Date,
}

export interface IVoucherCreate {
    code: string,
    type: string,
    value: number,
    minOrderVal: number,
    usageLimit: number,
    isActive: boolean,
    startDate: Date,
    endDate: Date,
}

export interface IVoucherUpdate {
    code?: string,
    type?: string,
    value?: number,
    minOrderVal?: number,
    usageLimit?: number,
    isActive?: boolean,
    startDate?: Date,
    endDate?: Date,
}

export interface IVoucherQuery {
    code?: string,
    type?: string,
    value?: string,
    minOrderVal?: string,
    usageLimit?: string,
    isActive?: string,
    startDate?: string,
    endDate?: string,
}