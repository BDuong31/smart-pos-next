import { IApiResponse } from "@/interfaces/api-response";
import { InitiatePayment, IPayment, IPaymentCreate, IPaymentQuery, IPaymentUpdate } from "@/interfaces/payment";
import { axiosInstance, endpoints } from "@/utils/axios";

export const createPayment = async (dto: IPaymentCreate): Promise<IPayment> => {
    const { data } = await axiosInstance.post(endpoints.payment.createPayment, dto);
    return data;
}

export const updatePayment = async (id: string, dto: IPaymentUpdate): Promise<IPayment> => {
    const { data } = await axiosInstance.patch(endpoints.payment.updatePayment(id), dto);
    return data;
}

export const deletePayment = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.payment.deletePayment(id));
    return data;
}

export const getPaymentById = async (id: string): Promise<IApiResponse<IPayment>> => {
    const { data } = await axiosInstance.get(endpoints.payment.getPaymentId(id));
    return data;
}

export const getPayments = async (dto: IPaymentQuery, page: number, limit: number): Promise<IApiResponse<IPayment>> => {
    const { data } = await axiosInstance.get(endpoints.payment.getPayments(dto.orderId, dto.externalTransactionId, dto.method, dto.status, dto.paidAt, page, limit));
    return data;
}

export const getListPaymentIds = async (ids: string[]): Promise<IApiResponse<IPayment[]>> => {
    const { data } = await axiosInstance.post(endpoints.payment.getListPaymentIds, ids);
    return data;
}

export const initiatePayment = async (dto: InitiatePayment): Promise<{ paymentUrl?: string; paymentId?: string; success: boolean }> => {
    const { data } = await axiosInstance.post(endpoints.payment.initiatePayment, dto);
    return data;
}

export const verifyPayment = async (gateway: string, externalPaymentId: string): Promise<Boolean> => {
    const { data } = await axiosInstance.post(endpoints.payment.verifyPayment, { gateway, externalPaymentId });
    return data;
}

export const queryStatus = async (gateway: string, externalPaymentId: string): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.payment.queryStatus, { gateway, externalPaymentId });
    return data.status;
}

export const refundPayment = async (paymentId: string, amount: number): Promise<IPayment> => {
    const { data } = await axiosInstance.post(endpoints.payment.refundPayment, { paymentId, amount });
    return data;
}

export const cancelPayment = async (paymentId: string): Promise<IPayment> => {
    const { data } = await axiosInstance.post(endpoints.payment.cancelPayment, { paymentId });
    return data;
}