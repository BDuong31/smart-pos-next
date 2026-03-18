import { IApiResponse } from '@/interfaces/api-response';
import { IConditionalProduct, IProduct, IProductCreate, IProductDetails } from '@/interfaces/product';
import {
  default as axios,
  default as axiosInstance,
  endpoints,
} from '@/utils/axios';

export const getProducts = async (dto: IConditionalProduct, page: number, limit: number): Promise<IApiResponse<IProductDetails[]>> => {
    try {
        const { data } = await axiosInstance.get(endpoints.product.getProducts(dto.name, dto.categoryId, dto.printerId, dto.basePrice, dto.isActive, dto.isCombo, page, limit));
        return data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
    }
}

export const getProductById = async (id: string): Promise<IApiResponse<IProductDetails>> => {
    try {
        const { data } = await axiosInstance.get(endpoints.product.getProductId(id));
        return data;
    } catch (error) {
        console.error('Failed to fetch product by ID:', error);
        throw error;
    }
}

export const createProduct = async (productData: IProductCreate): Promise<string> => {
  try {
    const { data } = await axiosInstance.post(endpoints.product.createProduct, productData);
    return data.data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<string> => {
    try {
        const { data } = await axiosInstance.patch(endpoints.product.updateProduct(id), productData);
        return data;
    } catch (error) {
        console.error('Failed to update product:', error);
        throw error;
    }
}

export const deleteProduct = async (id: string): Promise<string> => {
    try {
        const { data } = await axiosInstance.delete(endpoints.product.deleteProduct(id));
        return data;
    } catch (error) {
        console.error('Failed to delete product:', error);
        throw error;
    }
}