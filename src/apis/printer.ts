import { axiosInstance, endpoints } from "@/utils/axios"
import { IPrinterCreate, IPrinterUpdate } from "@/interfaces/printer"
import { IApiResponse } from "@/interfaces/api-response"
import { IPrinter } from "@/interfaces/printer"

export const createPrinter = async (dto: IPrinterCreate) => {
    const { data } = await axiosInstance.post(endpoints.printer.createPrinter, dto)

    return data;
}

export const updatePrinter = async (id: string, dto: IPrinterUpdate) => {
    const { data } = await axiosInstance.put(endpoints.printer.updatePrinterId(id), dto)

    return data;
}

export const deletePrinter = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.printer.deletePrinterId(id))

    return data;
}

export const getPrinters = async (name?: string | undefined, ipAddress?: string | undefined,type?: string | undefined, page?: number, limit?: number): Promise<IApiResponse<IPrinter[]>> => {
    const { data } = await axiosInstance.get(endpoints.printer.getPrinters(name, ipAddress, type, page, limit));
    return data;
};

export const getPrinterById = async (id: string): Promise<IApiResponse<IPrinter>> => {
    const { data } = await axiosInstance.get(endpoints.printer.getPrinterId(id));
    return data;
}

export const getListPrinterIds = async (ids: string[]): Promise<IApiResponse<IPrinter[]>> => {
    const { data } = await axiosInstance.post(endpoints.printer.getListPrinterIds, { ids });
    return data;
}