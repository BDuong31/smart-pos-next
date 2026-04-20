import { IOptionItem } from "./option";
import { IProduct } from "./product";
import { ITable } from "./table";
import { IPublicUser } from "./user";
import { IVariant } from "./variant";

export interface IOrder {
    id: string,
    code: string,
    userId: string,
    totalAmount: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderDetail {
    id: string,
    code: string,
    userId: string,
    user: IPublicUser,
    totalAmount: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderCreate {
    userId: string,
    totalAmount: number,
}

export interface IOrderUpdate {
    totalAmount?: number,
    status?: string,
}

export interface IOrderQuery {
    userId?: string,
    totalAmount?: number,
    status?: string,
}

export interface IOrderItem {
    id: string,
    orderId: string,
    productId: string,
    variantId: string,
    productName: string,
    price: number,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderItemDetail {
    id: string,
    orderId: string,
    productId: string,
    product: IProduct,
    variantId: string,
    variant: IVariant,
    productName: string,
    price: number,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderItemCreate {
    orderId: string,
    productId: string,
    variantId: string,
    productName: string,
    quantity: number,
}

export interface IOrderItemUpdate {
    price?: number,
    quantity?: number,
}

export interface IOrderItemQuery {
    orderId?: string,
    productId?: string,
    variantId?: string,
    productName?: string,
    price?: number,
    quantity?: number,
}

export interface IOrderItemOption {
    id: string,
    orderItemId: string,
    optionItemId: string,
    optionName: string,
    price: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderItemOptionDetail {
    id: string,
    orderItemId: string,
    optionItemId: string,
    optionItem: IOptionItem,
    optionName: string,
    price: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderItemOptionCreate {
    orderItemId: string,
    optionItemId: string,
    optionName: string,
    price: number,
}

export interface IOrderItemOptionUpdate {
    optionItemId?: string,
    optionName?: string,
    price?: number,
}

export interface IOrderItemOptionQuery {
    orderItemId?: string,
    optionItemId?: string,
    optionName?: string,
    price?: number,
}

export interface IOrderVoucher {
    id: string,
    orderId: string,
    voucherId: string,
    discountApplied: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderVoucherCreate {
    orderId: string,
    couponId: string,
    discountApplied: number,
}

export interface IOrderVoucherUpdate {
    discountApplied?: number,
}

export interface IOrderVoucherQuery {
    orderId?: string,
    voucherId?: string,
    discountApplied?: number,
}

export interface IOrderTable {
    id: string,
    orderId: string,
    tableId: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderTableDetail {
    id: string,
    orderId: string,
    tableId: string,
    table: ITable,
    createdAt: Date,
    updatedAt: Date,
}

export interface IOrderTableCreate {
    orderId: string,
    tableId: string,
}

export interface IOrderTableUpdate {
    tableId?: string,
}

export interface IOrderTableQuery {
    orderId?: string,
    tableId?: string,
}

export interface IInvoice {
    id: string,
    orderId: string,
    taxCode: string,
    issuedAt: Date,
    createdAt: Date,
    updatedAt: Date,
}

export interface IInvoiceDetail {
    id: string,
    orderId: string,
    order: IOrder,
    taxCode: string,
    issuedAt: Date,
    createdAt: Date,
    updatedAt: Date,
}

export interface IInvoiceCreate {
    orderId: string,
    taxCode: string,
    issuedAt: Date,
}

export interface IInvoiceUpdate {
    taxCode?: string,
    issuedAt?: Date,
}

export interface IInvoiceQuery {
    orderId?: string,
    taxCode?: string,
    issuedAt?: Date,
}