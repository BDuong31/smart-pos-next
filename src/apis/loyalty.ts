import { IPointHistoryDetail, IPointHistoryQuery } from './../interfaces/point-history';
import { IApiResponse } from "@/interfaces/api-response";
import { IPointHistoryCreate } from "@/interfaces/point-history";
import { CreateRank, IRank, RankQuery, UpdateRank } from "@/interfaces/rank";
import { axiosInstance, endpoints } from "@/utils/axios";

export const createRank = async (dto: CreateRank): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.loyalty.createRank, dto);
    return data;
}

export const updateRank = async (id: string, dto: UpdateRank) => {
    const { data } = await axiosInstance.patch(endpoints.loyalty.updateRank(id), dto);
    return data;
}

export const deleteRank = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.loyalty.deleteRank(id));
    return data;
}

export const getListRank = async (dto: RankQuery, page: number, limit: number): Promise<IApiResponse<IRank[]>> => {
    const { data } = await axiosInstance.get(endpoints.loyalty.getListRank(dto.name, dto.minPoint, dto.discountPercent, page, limit));
    return data.data;
}

export const createPointHistory = async (dto: IPointHistoryCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.loyalty.createPointHistory, dto);
    return data;
}

export const getListPointHistory = async (dto: IPointHistoryQuery, page: number, limit: number): Promise<IApiResponse<IPointHistoryDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.loyalty.getListPointHistory(dto.userId, dto.amount, dto.reason, page, limit));
    return data;
}