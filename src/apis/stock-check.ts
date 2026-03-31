import { CreateStockCheck, IStockCheck, IStockCheckFull, StockCheckQuery, UpdateStockCheck } from '@/interfaces/stock-check';
import { axiosInstance, endpoints } from '@/utils/axios';

export const createStockCheck = async (dto: CreateStockCheck): Promise<IStockCheck> => {
    const res = await axiosInstance.post(endpoints.stockCheck.createStockCheck, dto);
    return res.data.data;
}

export const updateStockCheck = async (id: string, dto: UpdateStockCheck): Promise<IStockCheck> => {
    const res = await axiosInstance.patch(endpoints.stockCheck.updateStockCheck(id), dto);
    return res.data;
}

export const deleteStockCheck = async (id: string) => {
    const res = await axiosInstance.delete(endpoints.stockCheck.deleteStockCheck(id));
    return res.data;
}

export const getStockChecks = async (dto: StockCheckQuery, page: number, limit: number) => {
    const res = await axiosInstance.get(endpoints.stockCheck.getStockChecks(dto.code, dto.userId, dto.note, dto.checkDate, page, limit));
    return res.data;
}

export const getStockCheckById = async (id: string): Promise<IStockCheckFull> => {
    const res = await axiosInstance.get(endpoints.stockCheck.getStockCheckById(id));
    return res.data;
}

export const getListStockCheckIds = async (ids: string[]): Promise<IStockCheckFull[]> => {
    const res = await axiosInstance.get(endpoints.stockCheck.getListStockCheckIds, { params: { ids } });
    return res.data;
}