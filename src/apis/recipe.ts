import { IApiResponse } from "@/interfaces/api-response";
import { IRecipe, IRecipeDetail, IRecipeCreate, IRecipeUpdate } from "@/interfaces/recipe";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getRecipes = async (ingredientId?: string | undefined, amount?: number | undefined, productId?: string | undefined, variantId?: string | undefined, optionItemId?: string | undefined, page?: number, limit?: number): Promise<IApiResponse<IRecipeDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.recipe.getRecipes(ingredientId, amount, productId, variantId, optionItemId, page, limit));
    return data;
}

export const getRecipeById = async (id: string): Promise<IApiResponse<IRecipeDetail>> => {
    const { data } = await axiosInstance.get(endpoints.recipe.getRecipeById(id));
    return data;
}

export const getListRecipeIds = async (ids: string[]): Promise<IApiResponse<IRecipe[]>> => {
    const { data } = await axiosInstance.post(endpoints.recipe.getListRecipeIds, { ids });
    return data;
}

export const createRecipe = async (dto: IRecipeCreate): Promise<IApiResponse<IRecipe>> => {
    const { data } = await axiosInstance.post(endpoints.recipe.createRecipe, dto);
    return data;
}

export const deleteRecipe = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.recipe.deleteRecipe(id));
    return data;
}

export const updateRecipe = async (id: string, dto: IRecipeUpdate): Promise<IApiResponse<IRecipe>> => {
    const { data } = await axiosInstance.patch(endpoints.recipe.updateRecipe(id), dto);
    return data;
}