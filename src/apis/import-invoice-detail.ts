import { IApiResponse } from "@/interfaces/api-response";
import { CreateImportInvoiceDetail, IImportInvoiceDetail, IImportInvoiceDetailDetail, ImportInvoiceDetailFilter, UpdateImportInvoiceDetail } from "@/interfaces/import-invoice-detail";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getImportInvoiceDetails = async (dto?: ImportInvoiceDetailFilter | undefined, page?: number, limit?: number): Promise<IApiResponse<IImportInvoiceDetailDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.importInvoiceDetail.getImportInvoiceDetails(dto?.invoiceId, dto?.ingredientId, dto?.quantity, dto?.unit, dto?.unitPrice, page, limit));
    return data;
}

export const getImportInvoiceDetailById = async (id: string): Promise<IImportInvoiceDetailDetail> => {
    const { data } = await axiosInstance.get(endpoints.importInvoiceDetail.getImportInvoiceDetailById(id));
    return data;
}

export const getImportInvoiceDetailsByIds = async (ids: string[]): Promise<IImportInvoiceDetail[]> => {
    const { data } = await axiosInstance.post(endpoints.importInvoiceDetail.getListImportInvoiceDetailIds, { ids });
    return data;
}

export const createImportInvoiceDetail = async (dto: CreateImportInvoiceDetail): Promise<IImportInvoiceDetail> => {
    const { data } = await axiosInstance.post(endpoints.importInvoiceDetail.createImportInvoiceDetail, dto);
    return data;
}

export const deleteImportInvoiceDetail = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.importInvoiceDetail.deleteImportInvoiceDetail(id));
    return data;
}

export const updateImportInvoiceDetail = async (dto: UpdateImportInvoiceDetail): Promise<IImportInvoiceDetail> => {
    const { id, ...rest} = dto;
    const { data } = await axiosInstance.patch(endpoints.importInvoiceDetail.updateImportInvoiceDetail(id), rest);
    return data;
}