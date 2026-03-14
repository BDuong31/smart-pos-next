import { IApiResponse } from "@/interfaces/api-response";
import { ICategory, ICategoryCreate, ICategoryUpdate } from "@/interfaces/category";
import axiosInstance, { endpoints } from "@/utils/axios";

export const getCategories = async (name?: string | undefined, parentId?: string | undefined, page?: number, limit?: number): Promise<IApiResponse<ICategory[]>> => {
    const { data } = await axiosInstance.get(endpoints.category.getCategories(name, parentId, page, limit));
    return data;
};

export const getCategoriesById = async (id: string): Promise<IApiResponse<ICategory>> => {
    const { data } = await axiosInstance.get(endpoints.category.getCategoryId(id));
    return data;
}

export const getListCategoryIds = async (ids: string[]): Promise<IApiResponse<ICategory[]>> => {
    const { data } = await axiosInstance.post(endpoints.category.getListCategoryIds, { ids });
    return data;
}

export const createCategory = async (dto: ICategoryCreate): Promise<IApiResponse<ICategory>> => {
    const { data } = await axiosInstance.post(endpoints.category.createCategory, dto);
    return data;
}

export const deleteCategory = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.category.deleteCategoryId(id));
    return data;
}

export const updateCategory = async (id: string, dto: ICategoryUpdate): Promise<IApiResponse<ICategory>> => {
    const { data } = await axiosInstance.patch(endpoints.category.updateCategoryId(id), dto);
    return data;
}