import { axiosInstance, endpoints } from '@/utils/axios';
import { CreateTable, ITable, ITableDetail, TableQuery, UpdateTable } from './../interfaces/table';
import { IApiResponse } from '@/interfaces/api-response';

export const createTable = async (dto: CreateTable): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.table.createTable, dto);
    return data;
}

export const updateTable = async (id: string, dto: UpdateTable): Promise<string> => {
    const { data } = await axiosInstance.patch(endpoints.table.updateTable(id), dto);
    return data;
}

export const deleteTable = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.table.deleteTable(id));
    return data;
}

export const getTables = async (dto: TableQuery, page: number, limit: number): Promise<IApiResponse<ITableDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.table.getTables(dto.zoneId, dto.name, dto.qrCode, dto.capacity, dto.isActive, dto.status, page, limit));
    return data;
}

export const getTableById = async (id: string): Promise<ITableDetail> => {
    const { data } = await axiosInstance.get(endpoints.table.getTableId(id));
    return data.data;
}

export const getListTableIds = async (ids: string[]): Promise<ITable[]> => {
    const { data } = await axiosInstance.post(endpoints.table.getListTableIds, { ids });
    return data.data;
}

export const getTableAvailible = async ( time: Date): Promise<ITable[]> => {
    const { data } = await axiosInstance.get(endpoints.table.getListTableAvailable(time));
    return data.data;
}