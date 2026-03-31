export interface ISupplier {
    id: string;
    name: string;
    contact: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISupplierCreate {
    name: string;
    contact: string;
}

export interface ISupplierUpdate {
    name?: string;
    contact?: string;
}