import { IApiResponse } from "@/interfaces/api-response";
import { CreateInventoryBatch, IInventoryBatch, IInventoryBatchDetail, InventoryBatchFilter, UpdateInventoryBatch } from "@/interfaces/inventory-batch";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getInventoryBatchs = async (dto?: InventoryBatchFilter | undefined, page?: number, limit?: number): Promise<IApiResponse<IInventoryBatchDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.inventoryBatch.getInventoryBatches(dto?.ingredientId, dto?.importInvoiceDetailId, dto?.quantity, dto?.expiryDate, dto?.importDate, page, limit));
    return data;
}

export const getInventoryBatchById = async (id: string): Promise<IInventoryBatchDetail> => {
    const { data } = await axiosInstance.get(endpoints.inventoryBatch.getInventoryBatchById(id));
    return data;
}

export const getInventoryBatchByIds = async (ids: string[]): Promise<IInventoryBatch[]> => {
    const { data } = await axiosInstance.post(endpoints.inventoryBatch.getListInventoryBatchIds, { ids });
    return data;
}

export const createInventoryBatch = async (dto: CreateInventoryBatch): Promise<IInventoryBatch> => {
    const { data } = await axiosInstance.post(endpoints.inventoryBatch.createInventoryBatch, dto);
    return data;
}

export const deleteInventoryBatch = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.inventoryBatch.deleteInventoryBatch(id));
    return data;
}

export const updateInventoryBatch = async (dto: UpdateInventoryBatch): Promise<IInventoryBatch> => {
    const { id, ...rest} = dto;
    const { data } = await axiosInstance.patch(endpoints.inventoryBatch.updateInventoryBatch(id), rest);
    return data;
}