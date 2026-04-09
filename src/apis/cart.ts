import { IApiResponse } from "@/interfaces/api-response";
import { ICart, ICartItem, ICartItemCreate, ICartItemOption, ICartItemOptionCreate } from "@/interfaces/cart";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getCart = async (userId?: string, totalItem?: number, page?: number, limit?: number): Promise<IApiResponse<ICart>> => {
    console.log('getCart userId', userId);
    const { data } = await axiosInstance.get(endpoints.cart.getCarts(userId, totalItem, page, limit));
    return data;
}

export const createCartItem = async (cartItem: ICartItemCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.cartItem.createCartItem, cartItem);
    return data;
}

export const updateCartItem = async (id: string, cartItem: ICartItemCreate) => {
    const { data } = await axiosInstance.patch(endpoints.cartItem.updateCartItem(id), cartItem);
    return data;
}

export const deleteCartItem = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.cartItem.deleteCartItem(id));
    return data;
}

export const getCartItems = async (cartId?: string, productId?: string, variantId?: string, quantity?: number, note?: string, page?: number, limit?: number): Promise<IApiResponse<ICartItem[]>> => {
    const { data } = await axiosInstance.get(endpoints.cartItem.getCartItems(cartId, productId, variantId, quantity, note, page, limit));
    return data;
}

export const getCartItemId = async (id: string): Promise<ICartItem> => {
    const { data } = await axiosInstance.get(endpoints.cartItem.getCartItemId(id));
    return data;
}

export const getCartItemIds = async (ids: string[]): Promise<ICartItem[]> => {
    const { data } = await axiosInstance.post(endpoints.cartItem.getCartItemIds, ids);
    return data;
}

export const createCartItemOption = async (cartItemOption: ICartItemOptionCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.cartItemOption.createCartItemOption, cartItemOption);
    return data;
}

export const deleteCartItemOption = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.cartItemOption.deleteCartItemOption(id));
    return data;
}

export const getCartItemOptions = async (cartItemId?: string, optionItemId?: string, page?: number, limit?: number): Promise<IApiResponse<ICartItemOption[]>> => {
    const { data } = await axiosInstance.get(endpoints.cartItemOption.getCartItemOptions(cartItemId, optionItemId, page, limit));
    return data;
}

export const getCartItemOptionId = async (id: string): Promise<ICartItemOption> => {
    const { data } = await axiosInstance.get(endpoints.cartItemOption.getCartItemOptionId(id));
    return data;
}

export const getCartItemOptionIds = async (ids: string[]): Promise<ICartItemOption[]> => {
    const { data } = await axiosInstance.post(endpoints.cartItemOption.getCartItemOptionIds, ids);
    return data;    
}