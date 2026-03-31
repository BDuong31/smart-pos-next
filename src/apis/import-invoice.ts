import { IApiResponse } from "@/interfaces/api-response";
import { CreateImportInvoice, IImportInvoice, IImportInvoiceDetail, ImportInvoiceFilter, UpdateImportInvoice } from "@/interfaces/import-invoice";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getImportInvoices = async (dto: ImportInvoiceFilter, page?: number, limit?: number): Promise<IApiResponse<IImportInvoiceDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.importInvoice.getImportInvoices(dto.code, dto.supplierId, dto.totalCost, dto.importDate, page, limit));
    return data;
}

export const getImportInvoiceById = async (id: string): Promise<IImportInvoiceDetail> => {
    const { data } = await axiosInstance.get(endpoints.importInvoice.getImportInvoiceById(id));
    return data;
}

export const getImportInvoiceByIds = async (ids: string[]): Promise<IImportInvoiceDetail[]> => {
    const { data } = await axiosInstance.post(endpoints.importInvoice.getListImportInvoiceIds, { ids });
    return data;
}

export const createImportInvoice = async (dto: CreateImportInvoice): Promise<IImportInvoice> => {
    const { data } = await axiosInstance.post(endpoints.importInvoice.createImportInvoice, dto);
    return data;
}

export const deleteImportInvoice = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.importInvoice.deleteImportInvoice(id));
    return data;
}

export const updateImportInvoice = async (dto: UpdateImportInvoice): Promise<IImportInvoice> => {
    const { id, ...rest} = dto;
    const { data } = await axiosInstance.patch(endpoints.importInvoice.updateImportInvoice(id), rest);
    return data;
}