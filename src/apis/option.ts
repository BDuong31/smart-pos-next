import { IApiResponse } from "@/interfaces/api-response";
import { IOption, IOptionCreate, IOptionItem, IOptionItemCreate, IOptionItemUpdate, IOptionUpdate, IProductOptionConfig } from "@/interfaces/option";
import { axiosInstance, endpoints } from "@/utils/axios";

// Option APIs
// thêm option
export const createOption = async (dto: IOptionCreate) => {
    const data = await axiosInstance.post(endpoints.option.createOption, dto)

    return data;
}

// cập nhật option
export const updateOption = async (id: string, dto: IOptionUpdate) => {
    const data = await axiosInstance.put(endpoints.option.updateOption(id), dto)

    return data;
}

// xóa option
export const deleteOption = async (id: string) => {
    const data = await axiosInstance.delete(endpoints.option.deleteOption(id))
    return data;
}

// lấy option theo id
export const getOptionById = async (id: string): Promise<IApiResponse<IOption>> => {
    const { data } = await axiosInstance.get(endpoints.option.getOptionById(id));
    return data;
}
   
// lấy danh sách option theo query
export const getOptions = async (name?: string | undefined, isMultiSellect?: boolean | undefined, page?: number, limit?: number): Promise<IApiResponse<IOption[]>> => {
    const { data } = await axiosInstance.get(endpoints.option.getOptions(name, isMultiSellect, page, limit));
    return data;
}

// lấy danh sách option theo nhiều id
export const getListOptionIds = async (ids: string[]): Promise<IApiResponse<IOption[]>> => {
    const { data } = await axiosInstance.post(endpoints.option.getListOptionIds, { ids });
    return data;
}

// Option Item APIs
// thêm option item
export const createOptionItem = async (dto: IOptionItemCreate): Promise<IOptionItem> => {
    const { data } = await axiosInstance.post(endpoints.option.createOptionItem, dto);
    return data;
}

// cập nhật option item
export const updateOptionItem = async (id: string, dto: IOptionItemUpdate): Promise<IOptionItem> => {
    const { data } = await axiosInstance.put(endpoints.option.updateOptionItem(id), dto);
    return data;
}

// xóa option item
export const deleteOptionItem = async (id: string) => {
    const data = await axiosInstance.delete(endpoints.option.deleteOptionItem(id))
    return data;
}

// lấy option item theo id
export const getOptionItemById = async (id: string): Promise<IApiResponse<IOptionItem>> => {
    const { data } = await axiosInstance.get(endpoints.option.getOptionItemById(id));
    return data;
}

// lấy danh sách option item theo query
export const getOptionItems = async (groupId?: string, name?: string | undefined, priceExtra?: number | undefined, page?: number, limit?: number): Promise<IApiResponse<IOptionItem[]>> => {
    const { data } = await axiosInstance.get(endpoints.option.getOptionItems(groupId, name, priceExtra, page, limit));
    return data;
}


// lấy danh sách option item theo nhiều id
export const getListOptionItemIds = async (ids: string[]): Promise<IApiResponse<IOptionItem[]>> => {
    const { data } = await axiosInstance.post(endpoints.option.getListOptionItemIds, { ids });
    return data;
}

// Product Option Config APIs
// thiết lập cấu hình option cho sản phẩm
export const setProductOptionConfig = async (productId: string, optionGroupId: string) => {
    const data = await axiosInstance.post(endpoints.option.setProductOptionConfig, { productId, optionGroupId })
    return data;
}

// lấy cấu hình option của sản phẩm theo id
export const getProductOptionConfigById = async (id: string): Promise<IApiResponse<IProductOptionConfig>> => {
    const { data } = await axiosInstance.get(endpoints.option.getProductOptionConfigsById(id));
    return data;
}

// lấy cấu hình option của sản phẩm theo query
export const getProductOptionConfigs = async (productId?: string, optionGroupId?: string, page?: number, limit?: number): Promise<IApiResponse<IProductOptionConfig[]>> => {
    const { data } = await axiosInstance.get(endpoints.option.getProductOptionConfigs(productId, optionGroupId, page, limit));
    return data;
}

// xóa cấu hình option của sản phẩm theo id
export const deleteProductOptionConfig = async (id: string) => {
    const data = await axiosInstance.delete(endpoints.option.deleteProductOptionConfigById(id))
    return data;
}
