import { CreateStockCheckDetail, UpdateStockCheckDetail, StockCheckDetailQuery, IStockCheckDetail, IStockCheckDetailFull } from "@/interfaces/stock-check-detail";
import { axiosInstance, endpoints } from "@/utils/axios";

export const createStockCheckDetail = async (dto: CreateStockCheckDetail): Promise<IStockCheckDetail> => {
    const { data } = await axiosInstance.post(endpoints.stockCheckDetail.createStockCheckDetail, dto);
    return data;
}

export const updateStockCheckDetail = async (id: string, dto: UpdateStockCheckDetail): Promise<IStockCheckDetail> => {
    const { data } = await axiosInstance.patch(endpoints.stockCheckDetail.updateStockCheckDetail(id), dto);
    return data;
}

export const deleteStockCheckDetail = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.stockCheckDetail.deleteStockCheckDetail(id));
    return data;
}

export const getStockCheckDetails = async (dto: StockCheckDetailQuery, page: number, limit: number) => {
    const { data } = await axiosInstance.get(endpoints.stockCheckDetail.getStockCheckDetails(dto.checkId, dto.ingredientId, dto.systemQty, dto.actualQty, dto.reason, page, limit));
    return data;
}

export const getStockCheckDetailById = async (id: string): Promise<IStockCheckDetailFull> => {
    const { data } = await axiosInstance.get(endpoints.stockCheckDetail.getStockCheckDetailById(id));
    return data;
}

export const getListStockCheckDetailIds = async (ids: string[]): Promise<IStockCheckDetailFull[]> => {
    const { data } = await axiosInstance.get(endpoints.stockCheckDetail.getListStockCheckDetailIds, { params: { ids } });
    return data;
}