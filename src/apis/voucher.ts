import { IVoucherCreate, IVoucherQuery, IVoucherUpdate } from "@/interfaces/voucher";
import { axiosInstance, endpoints } from "@/utils/axios";

export const createVoucher = async (dto: IVoucherCreate) => {
    const res = await axiosInstance.post(endpoints.voucher.createVoucher, dto)
    return res.data
}

export const updateVoucher = async (id: string, dto: IVoucherUpdate) => {
    const res = await axiosInstance.patch(endpoints.voucher.updateVoucher(id), dto)
    return res.data
}

export const deleteVoucher = async (id: string) => {
    const res = await axiosInstance.delete(endpoints.voucher.deleteVoucher(id))
    return res.data
}

export const getVouchers = async (query: IVoucherQuery, page: number, limit: number) => {
    const res = await axiosInstance.get(endpoints.voucher.getVouchers(query.code, query.type, query.value, query.minOrderVal, query.usageLimit, query.isActive, query.startDate, query.endDate, page, limit))
    return res.data.data
}

export const getVoucherId = async (id: string) => {
    const res = await axiosInstance.get(endpoints.voucher.getVoucherId(id))
    return res.data
}

export const getListVoucherIds = async (ids: string[]) => {
    const res = await axiosInstance.post(endpoints.voucher.getListVoucherIds, { ids })
    return res.data
}