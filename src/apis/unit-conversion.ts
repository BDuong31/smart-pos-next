import { IApiResponse } from "@/interfaces/api-response";
import { IUnitConversion, IUnitConversionCreate, IUnitConversionDetail, IUnitConversionUpdate } from "@/interfaces/unit-conversion";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getUnitConversions = async (ingredientId?: string | undefined, fromUnit?: string | undefined, toUnit?: string | undefined, factor?: number, page?: number, limit?: number): Promise<IApiResponse<IUnitConversionDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.unitConversion.getUnitConversions(ingredientId, fromUnit, toUnit, factor, page, limit));
    return data;
};

export const getUnitConversionById = async (id: string): Promise<IApiResponse<IUnitConversionDetail>> => {
    const { data } = await axiosInstance.get(endpoints.unitConversion.getUnitConversionById(id));
    return data;
}

export const getListUnitConversionIds = async (ids: string[]): Promise<IApiResponse<IUnitConversionDetail[]>> => {
    const { data } = await axiosInstance.post(endpoints.unitConversion.getUnitConversionByIds, { ids });
    return data;
}

export const createUnitConversion = async (dto: IUnitConversionCreate): Promise<IApiResponse<IUnitConversion>> => {
    const { data } = await axiosInstance.post(endpoints.unitConversion.createUnitConversion, dto);
    return data;
}

export const deleteUnitConversion = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.unitConversion.deleteUnitConversion(id));
    return data;
}   

export const updateUnitConversion = async (id: string, dto: IUnitConversionUpdate): Promise<IApiResponse<IUnitConversion>> => {
    const { data } = await axiosInstance.patch(endpoints.unitConversion.updateUnitConversion(id), dto);
    return data;
}