import { IApiResponse } from "@/interfaces/api-response";
import { IConditionalVariant, IVariant } from "@/interfaces/variant";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getVariants = async (dto: IConditionalVariant, page: number, limit: number): Promise<IApiResponse<IVariant[]>> => {
    try {
        const { data } = await axiosInstance.get(endpoints.variant.getVariants(dto.productId, dto.name, dto.priceDiff, page, limit));
        return data;
    } catch (error) {
        console.error('Failed to fetch variants:', error);
        throw error;
    }
}

export const getVariantById = async (id: string): Promise<IApiResponse<IVariant>> => {
    try {
        const { data } = await axiosInstance.get(endpoints.variant.getVariantById(id));
        return data;
    } catch (error) {
        console.error('Failed to fetch variant by ID:', error);
        throw error;
    }
}

export const getListVariantIds = async (ids: string[]): Promise<IApiResponse<IVariant[]>> => {
    try {
        const { data } = await axiosInstance.post(endpoints.variant.getListVariantIds, ids);
        return data;
    } catch (error) {
        console.error('Failed to fetch variants by IDs:', error);
        throw error;
    }
}

export const createVariant = async (variantData: Partial<IVariant>): Promise<string> => {
  try {
    const { data } = await axiosInstance.post(endpoints.variant.createVariant, variantData);
    return data;
  } catch (error) {
    console.error('Failed to create variant:', error);
    throw error;
  }
}

export const updateVariant = async (id: string, variantData: Partial<IVariant>): Promise<string> => {
    try {
        const { data } = await axiosInstance.patch(endpoints.variant.updateVariant(id), variantData);
        return data;
    } catch (error) {
        console.error('Failed to update variant:', error);
        throw error;
    }
}

export const deleteVariant = async (id: string): Promise<string> => {
    try {
        const { data } = await axiosInstance.delete(endpoints.variant.deleteVariant(id));
        return data;
    } catch (error) {
        console.error('Failed to delete variant:', error);
        throw error;
    }
}