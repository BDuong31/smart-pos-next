export interface IVariant {
    id: string,
    productId: string,
    name: string,
    priceDiff: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface IVariantCreate {
    productId: string,
    name: string,
    priceDiff: number,
}
export interface IVariantUpdate {
    productId?: string,
    name?: string,
    priceDiff?: number,
}

export interface IConditionalVariant {
    productId?: string,
    name?: string,
    priceDiff?: number,
}