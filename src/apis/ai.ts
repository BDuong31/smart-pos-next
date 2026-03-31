import { axiosAiInstance, endpoints } from "@/utils/axios"

export const getForecasts = async (mode: string): Promise<any> => {
    const { data } = await axiosAiInstance.get(endpoints.ai.getForecast(mode))
    return data;
}

export const getRecommend = async (id: string): Promise<any> => {
    const { data } = await axiosAiInstance.get(endpoints.ai.getRecommend(id))
    return data;
}