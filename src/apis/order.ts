import { IApiResponse } from './../interfaces/api-response';
import { IOrderCreate, IOrderQuery, IOrderUpdate, IOrderItemCreate, IOrderItemUpdate, IOrderItemQuery, IOrderVoucherCreate, IOrderVoucherUpdate, IOrderVoucherQuery, IOrderTableCreate, IOrderTableUpdate, IOrderTableQuery, IInvoiceCreate, IInvoiceUpdate, IInvoiceQuery, IOrderDetail, IOrderItemDetail, IOrderItemOptionCreate, IOrderItemOptionUpdate, IOrderItemOptionDetail, IOrderItemOptionQuery, IOrderVoucher, IOrderTableDetail, IInvoiceDetail } from '@/interfaces/order';
import { axiosInstance, endpoints } from '@/utils/axios';

export const createOrder = async (dto: IOrderCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.order.createOrder, dto)
    return data
}

export const updateOrder = async (id: string, dto: IOrderUpdate) => {
    const { data } = await axiosInstance.put(endpoints.order.updateOrder(id), dto)
    return data
}

export const deleteOrder = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.order.deleteOrder(id))
    return data
}

export const getOrderId = async (id: string): Promise<IOrderDetail> => {
    const { data } = await axiosInstance.get(endpoints.order.getOrderById(id))
    return data
}

export const getOrders = async (query: IOrderQuery, page: number, limit: number): Promise<IApiResponse<IOrderDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.order.getOrders(query.userId, query.totalAmount, query.status, page, limit))
    return data
}

export const getOrderIds= async (ids: string[]): Promise<IOrderDetail[]> => {
    const { data } = await axiosInstance.post(endpoints.order.getListOrderIds, { ids })
    return data
}

export const createOrderItem = async (dto: IOrderItemCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.orderItem.createOrderItem, dto)
    return data
}

export const updateOrderItem = async (id: string, dto: IOrderItemUpdate) => {
    const { data } = await axiosInstance.put(endpoints.orderItem.updateOrderItem(id), dto)
    return data
}

export const deleteOrderItem = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.orderItem.deleteOrderItem(id))
    return data
}

export const getOrderItemId = async (id: string): Promise<IOrderItemDetail> => {
    const { data } = await axiosInstance.get(endpoints.orderItem.getOrderItemId(id))
    return data
}

export const getOrderItems = async (query: IOrderItemQuery, page: number, limit: number): Promise<IApiResponse<IOrderItemDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.orderItem.getOrderItem(query.orderId, query.productId, query.variantId, query.productName, query.price, query.quantity, page, limit))
    return data
}

export const getOrderItemIds = async (ids: string[]): Promise<IOrderItemDetail[]> => {
    const { data } = await axiosInstance.post(endpoints.orderItem.getOrderItemIds, { ids })
    return data
}

export const createOrderItemOption = async (dto: IOrderItemOptionCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.orderItemOption.createOrderItemOption, dto)
    return data
}

export const updateOrderItemOption = async (id: string, dto: IOrderItemOptionUpdate) => {
    const { data } = await axiosInstance.put(endpoints.orderItemOption.updateOrderItemOption(id), dto)
    return data
}

export const deleteOrderItemOption = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.orderItemOption.deleteOrderItemOption(id))
    return data
}

export const getOrderItemOptionId = async (id: string): Promise<IOrderItemOptionDetail> => {
    const { data } = await axiosInstance.get(endpoints.orderItemOption.getOrderItemOptionId(id))
    return data
}

export const getOrderItemOptions = async (query: IOrderItemOptionQuery, page: number, limit: number): Promise<IApiResponse<IOrderItemOptionDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.orderItemOption.getOrderItemOption(query.orderItemId, query.optionItemId, query.optionName, query.price, page, limit))
    return data
}

export const getOrderItemOptionIds = async (ids: string[]): Promise<IOrderItemOptionDetail[]> => {
    const { data } = await axiosInstance.post(endpoints.orderItemOption.getOrderItemOptionIds, { ids })
    return data
}

export const createOrderVoucher = async (dto: IOrderVoucherCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.orderVoucher.createOrderVoucher, dto)
    return data
}

export const updateOrderVoucher = async (id: string, dto: IOrderVoucherUpdate) => {
    const { data } = await axiosInstance.put(endpoints.orderVoucher.updateOrderVoucher(id), dto)
    return data
}

export const deleteOrderVoucher = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.orderVoucher.deleteOrderVoucher(id))
    return data
}

export const getOrderVoucherId = async (id: string): Promise<IOrderVoucher> => {
    const { data } = await axiosInstance.get(endpoints.orderVoucher.getOrderVoucherId(id))
    return data
}

export const getOrderVouchers = async (query: IOrderVoucherQuery, page: number, limit: number): Promise<IApiResponse<IOrderVoucher[]>> => {
    const { data } = await axiosInstance.get(endpoints.orderVoucher.getOrderVoucher(query.orderId, query.voucherId, query.discountApplied, page, limit))
    return data
}

export const getOrderVoucherIds = async (ids: string[]): Promise<IOrderVoucher[]> => {
    const { data } = await axiosInstance.post(endpoints.orderVoucher.getOrderVoucherIds, { ids })
    return data
}

export const createOrderTable = async (dto: IOrderTableCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.orderTable.createOrderTable, dto)
    return data
}

export const updateOrderTable = async (id: string, dto: IOrderTableUpdate) => {
    const { data } = await axiosInstance.put(endpoints.orderTable.updateOrderTable(id), dto)
    return data
}

export const deleteOrderTable = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.orderTable.deleteOrderTable(id))
    return data
}

export const getOrderTableId = async (id: string): Promise<IOrderTableDetail> => {
    const { data } = await axiosInstance.get(endpoints.orderTable.getOrderTableId(id))
    return data
}

export const getOrderTables = async (query: IOrderTableQuery, page: number, limit: number): Promise<IApiResponse<IOrderTableDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.orderTable.getOrderTable(query.orderId, query.tableId, page, limit))
    return data
}

export const getOrderTableIds = async (ids: string[]): Promise<IOrderTableDetail[]> => {
    const { data } = await axiosInstance.post(endpoints.orderTable.getOrderTableIds, { ids })
    return data
}

export const createInvoice = async (dto: IInvoiceCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.invoice.createInvoice, dto)
    return data
}

export const updateInvoice = async (id: string, dto: IInvoiceUpdate) => {
    const { data } = await axiosInstance.put(endpoints.invoice.updateInvoice(id), dto)
    return data
}

export const deleteInvoice = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.invoice.deleteInvoice(id))
    return data
}

export const getInvoiceId = async (id: string): Promise<IInvoiceDetail> => {
    const { data } = await axiosInstance.get(endpoints.invoice.getInvoiceId(id))
    return data
}

export const getInvoices = async (query: IInvoiceQuery, page: number, limit: number): Promise<IApiResponse<IInvoiceDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.invoice.getInvoices(query.orderId, query.taxCode, query.issuedAt, page, limit))
    return data
}

export const getInvoiceIds = async (ids: string[]): Promise<IInvoiceDetail[]> => {
    const { data } = await axiosInstance.post(endpoints.invoice.getListInvoiceIds, { ids })
    return data
}