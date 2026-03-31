import { IApiResponse } from "@/interfaces/api-response";
import { ISupplier } from "@/interfaces/supplier";
import { axiosInstance, endpoints } from "@/utils/axios";

export const getSuppliers = async (name?: string | undefined, page?: number, limit?: number): Promise<IApiResponse<ISupplier[]>> => {
    const { data } = await axiosInstance.get(endpoints.supplier.getSuppliers(name, page, limit));
    return data;
};

export const getSupplierById = async (id: string): Promise<IApiResponse<ISupplier>> => {
    const { data } = await axiosInstance.get(endpoints.supplier.getSupplierId(id));
    return data;
}

export const getListSupplierIds = async (ids: string[]): Promise<IApiResponse<ISupplier[]>> => {
    const { data } = await axiosInstance.post(endpoints.supplier.getListSupplierIds, { ids });
    return data;
}

export const createSupplier = async (dto: Omit<ISupplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<IApiResponse<ISupplier>> => {
    const { data } = await axiosInstance.post(endpoints.supplier.createSupplier, dto);
    return data;
}

export const deleteSupplier = async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete(endpoints.supplier.deleteSupplierId(id));
    return data;
}

export const updateSupplier = async (id: string, dto: Partial<Omit<ISupplier, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IApiResponse<ISupplier>> => {
    const { data } = await axiosInstance.patch(endpoints.supplier.updateSupplierId(id), dto);
    return data;
}