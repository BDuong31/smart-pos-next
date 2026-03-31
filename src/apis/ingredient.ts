import { IApiResponse } from "@/interfaces/api-response";
import { IIngredientDetail, IIngredient, IIngredientCreate, IIngredientUpdate } from "@/interfaces/ingredient";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getIngredients = async (name?: string | undefined, baseUnit?: string, minStock?: number, forecastDataId?: string, page?: number, limit?: number): Promise<IApiResponse<IIngredientDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.ingredient.getIngredients(name, baseUnit, minStock, forecastDataId, page, limit));
    return data;
};

export const getIngredientById = async (id: string): Promise<IApiResponse<IIngredientDetail>> => {
    const { data } = await axiosInstance.get(endpoints.ingredient.getIngredientById(id));
    return data;
}

export const getListIngredientIds = async (ids: string[]): Promise<IApiResponse<IIngredientDetail[]>> => {
    const { data } = await axiosInstance.post(endpoints.ingredient.getListIngredientIds, { ids });
    return data;
}

export const createIngredient = async (dto: IIngredientCreate): Promise<IApiResponse<IIngredient>> => {
    const { data } = await axiosInstance.post(endpoints.ingredient.createIngredient, dto);
    return data;
}

export const deleteIngredient = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.ingredient.deleteIngredient(id));
    return data;
}

export const updateIngredient = async (id: string, dto: IIngredientUpdate): Promise<IApiResponse<IIngredient>> => {
    const { data } = await axiosInstance.patch(endpoints.ingredient.updateIngredient(id), dto);
    return data;
}