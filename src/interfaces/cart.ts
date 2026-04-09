
export interface ICart {
    id: string;
    userId: string;
    totalItem: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartItem {
    id: string;
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartItemCreate {
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    note: string;
}

export interface ICartItemUpdate {
    quantity?: number;
    note?: string;
}

export interface ICartItemCond {
    id?: string;
    cartId?: string;
    productId?: string;
    variantId?: string;
    quantity?: number;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICartItemOption {
    id: string;
    cartItemId: string;
    optionItemId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartItemOptionCreate {
    cartItemId: string;
    optionItemId: string;
}

export interface ICartItemOptionCond {
    id?: string;
    cartItemId?: string;
    optionItemId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
