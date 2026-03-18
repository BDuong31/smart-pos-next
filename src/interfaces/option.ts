import { IImage } from "@/interfaces/image";
// interface data type for option
export interface IOption {
    id : string;
    name: string;
    isMultiSelect: boolean; // true: nhiều lựa chọn, false: một lựa chọn
    createdAt: Date;
    updatedAt: Date;
}

export interface IOptionCreate {
    name: string;
    isMultiSelect: boolean; // true: nhiều lựa chọn, false: một lựa chọn
}

export interface IOptionUpdate {
    name?: string;
    isMultiSelect?: boolean; // true: nhiều lựa chọn, false: một lựa chọn
}

export interface IOptionQuery {
    name?: string;
    isMultiSelect?: boolean; // true: nhiều lựa chọn, false: một lựa chọn
}

// interface data type for option item
export interface IOptionItem {
    id: string;
    groupId: string;
    name: string;
    priceExtra: number;
    images: IImage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IOptionItemCreate {
    groupId: string;
    name: string;
    priceExtra: number;
}

export interface IOptionItemUpdate {
    groupId?: string;
    name?: string;
    priceExtra?: number;
}

export interface IOptionItemQuery {
    groupId?: string;
    name?: string;
    priceExtra?: number;
}

// interface data type for product option config
export interface IProductOptionConfig {
    id: string
    productId: string;
    optionGroupId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductOptionConfigCreate {
    productId: string;
    optionGroupId: string;
}

export interface IProductOptionConfigUpdate {
    productId?: string;
    optionGroupId?: string;
}

export interface IProductOptionConfigQuery {
    productId?: string;
    optionGroupId?: string;
}