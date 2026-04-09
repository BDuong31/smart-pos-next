import { IApiResponse } from '@/interfaces/api-response';
import { endpoints, axiosInstance
} from '@/utils/axios';
import { ICombo, IComboCreate, IComboUpdate, IComboItem, IComboItemCreate, IComboItemUpdate, IComboItemDetail } from '@/interfaces/combo';

// API for combo
// tạo combo
export const createCombo = async (data: IComboCreate): Promise<string> => {
    try {
        const response = await axiosInstance.post(endpoints.combo.createCombo, data);
        return response.data;
    } catch (error) {
        throw error;
    };
}

// cập nhật combo
export const updateCombo = async (id: string, data: IComboUpdate) => {
    try {
        const response = await axiosInstance.patch(endpoints.combo.updateCombo(id), data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// xóa combo
export const deleteCombo = async (id: string) => {
    try {
        const response = await axiosInstance.delete(endpoints.combo.deleteCombo(id));
        return response.data;
    } catch (error) {
        throw error;
    }
}

// lấy danh sách combo
export const getCombos = async (name?: string, price?: number, page?: number, limit?: number): Promise<IApiResponse<ICombo[]>> => {
    try {
        const response = await axiosInstance.get(endpoints.combo.getCombos(name, price, page, limit));
        return response.data;
    } catch (error) {
        throw error;
    }
};

// lấy danh sách combo theo nhiều id
export const getCombosByIds = async (ids: string[]): Promise<IApiResponse<ICombo[]>> => {
    try {
        const response = await axiosInstance.post(endpoints.combo.getListComboIds, { ids });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// lấy combo theo id
export const getComboById = async (id: string): Promise<IApiResponse<ICombo>> => {
    try {
        const response = await axiosInstance.get(endpoints.combo.getComboById(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};

// API for combo item
// tạo combo item
export const createComboItem = async (data: IComboItemCreate): Promise<string> => {
    try {
        const response = await axiosInstance.post(endpoints.combo.createCombosItem, data);
        return response.data;
    } catch (error) {
        throw error;
    };
}

// cập nhật combo item
export const updateComboItem = async (id: string, data: IComboItemUpdate): Promise<IApiResponse<IComboItem>> => {
    try {
        const response = await axiosInstance.patch(endpoints.combo.updateComboItem(id), data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// xóa combo item
export const deleteComboItem = async (id: string) => {
    try {
        const response = await axiosInstance.delete(endpoints.combo.deleteComboItem(id));
        return response.data;
    } catch (error) {
        throw error;
    }
}

// lấy danh sách combo item
export const getComboItems = async (comboId?: string, productId?: string, variant?: string, quantity?: number, page?: number, limit?: number): Promise<IApiResponse<IComboItemDetail[]>> => {
    try {
        const response = await axiosInstance.get(endpoints.combo.getComboItems(comboId, productId, variant, quantity, page, limit));
        return response.data;
    } catch (error) {
        throw error;
    }
};

// lấy danh sách combo item theo nhiều id
export const getComboItemsByIds = async (ids: string[]): Promise<IApiResponse<IComboItem[]>> => {
    try {
        const response = await axiosInstance.post(endpoints.combo.getListComboItemIds, { ids });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// lấy combo item theo id
export const getComboItemById = async (id: string): Promise<IApiResponse<IComboItemDetail>> => {
    try {
        const response = await axiosInstance.get(endpoints.combo.getComboItemById(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};
