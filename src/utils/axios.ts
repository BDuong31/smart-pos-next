'use client';

import axios, { AxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { setToken, logout } from '@/store/slices/authSlice';
import { HOST_API } from '@/global-config';
import { createCategory } from '@/apis/category';
import { get } from 'http';
// Tạo một instance của axios với cấu hình mặc định
const axiosInstance = axios.create({ 
    baseURL: HOST_API, 
    withCredentials: true,
});

// Interceptor để tự động thêm token vào header của mỗi request
let isRefreshing = false;
let failedQueue: any[] = [];

// Hàm để xử lý hàng đợi khi token đang được làm mới
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })

  failedQueue = []
}

// Interceptor để thêm token vào header của mỗi request
axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
})

// Interceptor để xử lý lỗi 401 và làm mới token
axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalConfig = err.config;

        if (err.response?.status === 401 && !originalConfig._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalConfig.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalConfig);
                })
            }

            originalConfig._retry = true;
            isRefreshing = true;

            try {
                const res = await axiosInstance.post(
                    '/v1/auth/refresh-token',
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.accessToken;

                store.dispatch(setToken(newToken));

                processQueue(null, newToken);

                originalConfig.headers['Authorization'] = 'Bearer ' + newToken;
                return axiosInstance(originalConfig);
            } catch (error) {
                processQueue(error, null);
                store.dispatch(logout());
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default axiosInstance;

export const fetcher = async (args: string | [string, AxiosRequestConfig?]) => {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance(url, { ...config});

    return res.data;
}

const VERSION_PREFIX = '/v1';

export const endpoints = {
    image: {
        createImage: `${VERSION_PREFIX}/images`,
        getImages: (refId?: string, type?: string, isMain?: boolean, page?: number, limit?: number) => {
            const params = new URLSearchParams();
            if (refId) params.append('refId', refId);
            if (type) params.append('type', type);
            if (isMain !== undefined) params.append('isMain', String(isMain));
            if (page !== undefined) params.append('page', String(page));
            if (limit !== undefined) params.append('limit', String(limit));

            return `${VERSION_PREFIX}/images?${params.toString()}`;
        },
        getImageId: (id: string) => `${VERSION_PREFIX}/images/${id}`,
        updateImage: (id: string) => `${VERSION_PREFIX}/images/${id}`,
        deleteImage: (id: string) => `${VERSION_PREFIX}/images/${id}`,
        rpcImageRefId: `${VERSION_PREFIX}/images/rpc/get-by-ref-id`,
    },

    auth: {
        register: `${VERSION_PREFIX}/auth/register`,
        resendVerifyOtp: `${VERSION_PREFIX}/auth/resend-verify-otp`,
        activateAccount: `${VERSION_PREFIX}/auth/activate-account`,
        verifyAccount: `${VERSION_PREFIX}/auth/verify-account`,
        authenticate: `${VERSION_PREFIX}/auth/authenticate`,
        forgotPassword: `${VERSION_PREFIX}/auth/forgot-password`,
        resendForgotPassword: `${VERSION_PREFIX}/auth/resend-forgot-password-otp`,
        verifyForgotPassword: `${VERSION_PREFIX}/auth/verify-forgot-password-otp`,
        resetPassword: `${VERSION_PREFIX}/auth/reset-password`,
        changePassword: `${VERSION_PREFIX}/auth/change-password`,
        refreshToken: `${VERSION_PREFIX}/auth/refresh-token`,
        logout: `${VERSION_PREFIX}/auth/logout`,
        introspect: `${VERSION_PREFIX}/rpc/auth/introspect`,
    },

    user: {
        createStaff: `${VERSION_PREFIX}/users`,
        profile: `${VERSION_PREFIX}/users/profile`,
        listUser: (username?: string, fullName?: string, email?: string, role?: string, status?: string, rankId?: string, page?: number, limit?: number) =>
            `${VERSION_PREFIX}/users?limit=${limit || 10}&page=${page || 1}&username=${username || ''}&fullName=${fullName || ''}&email=${email || ''}&role=${role || ''}&status=${status || ''}&rankId=${rankId || ''}`,
        getUserId: (id: string) => `${VERSION_PREFIX}/users/${id}`,
        getListUserIds: `${VERSION_PREFIX}/users/list-by-ids`,
        updateUserId: (id: string) => `${VERSION_PREFIX}/users/${id}`,
        updateUserAdminId: (id: string) => `${VERSION_PREFIX}/users/admin-update/${id}`,
        deleteUserId: (id: string) => `${VERSION_PREFIX}/users/${id}`,
        addFcmToken: `${VERSION_PREFIX}/users/add-fcm-token`,
        removeFcmToken: `${VERSION_PREFIX}/users/remove-fcm-token`,
    },
    shift: {
        checkin: `${VERSION_PREFIX}/shifts/checkin`,
        checkout: (id: string) => `${VERSION_PREFIX}/shifts/checkout/${id}`,
        getCurrentShift: `${VERSION_PREFIX}/shifts/current`,
        getHistoryShift: (page?: number, limit?: number) => `${VERSION_PREFIX}/shifts/history?limit=${limit || 10}&page=${page || 1}`,
        getSearchShift: (userId?: string, startTime?: Date | string, endTime?: Date | string, page?: number, limit?: number) =>
            `${VERSION_PREFIX}/shifts/search?limit=${limit || 10}&page=${page || 1}&userId=${userId || ''}&startTime=${startTime ? new Date(startTime).toISOString() : ''}&endTime=${endTime ? new Date(endTime).toISOString() : ''}`,
        getShiftId: (id: string) => `${VERSION_PREFIX}/shifts/${id}`,
    },
    loyalty: {},
    category: {
        createCategory: `${VERSION_PREFIX}/categories`,
        getCategories: (name?: string, parentId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (parentId) params.append("parentId", parentId)

            return `${VERSION_PREFIX}/categories?${params.toString()}`
        },
        getCategoryId: (id: string) => `${VERSION_PREFIX}/categories/${id}`,
        getListCategoryIds: `${VERSION_PREFIX}/categories/list-by-ids`,
        updateCategoryId: (id: string) => `${VERSION_PREFIX}/categories/${id}`,
        deleteCategoryId: (id: string) => `${VERSION_PREFIX}/categories/${id}`,
    },
    product: {
        createProduct: `${VERSION_PREFIX}/products`,
        getProducts: (name?: string, categoryId?: string, printerId?: string, basePrice?: number, isActive?: boolean, isCombo?: boolean, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (categoryId) params.append("categoryId", categoryId)
            if (printerId) params.append("printerId", printerId)
            if (basePrice !== undefined) params.append("basePrice", String(basePrice))
            if (isActive !== undefined) params.append("isActive", String(isActive))
            if (isCombo !== undefined) params.append("isCombo", String(isCombo))

            return `${VERSION_PREFIX}/products?${params.toString()}`
        },
        getProductId: (id: string) => `${VERSION_PREFIX}/products/${id}`,
        getListProductIds: `${VERSION_PREFIX}/products/list-by-ids`,
        updateProduct: (id: string) => `${VERSION_PREFIX}/products/${id}`,
        deleteProduct: (id: string) => `${VERSION_PREFIX}/products/${id}`,
    },
    variant: {
        createVariant: `${VERSION_PREFIX}/variants`,
        getVariants: (productId?: string, name?: string, priceDiff?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (productId) params.append("productId", productId)
            if (name) params.append("name", name)
            if (priceDiff !== undefined) params.append("priceDiff", String(priceDiff))

            return `${VERSION_PREFIX}/variants?${params.toString()}`
        },
        getVariantById: (id: string) => `${VERSION_PREFIX}/variants/${id}`,
        getListVariantIds: `${VERSION_PREFIX}/variants/list-by-ids`,
        updateVariant: (id: string) => `${VERSION_PREFIX}/variants/${id}`,
        deleteVariant: (id: string) => `${VERSION_PREFIX}/variants/${id}`,
    },
    option: {
        createOption: `${VERSION_PREFIX}/options/group`,
        getOptions: (name?: string, isMultiSellect?: boolean, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (isMultiSellect !== undefined) params.append("isMultiSellect", String(isMultiSellect))

            return `${VERSION_PREFIX}/options/group?${params.toString()}`
        },
        getOptionById: (id: string) => `${VERSION_PREFIX}/options/group/${id}`,
        getListOptionIds: `${VERSION_PREFIX}/options/group/list-by-ids`,
        updateOption: (id: string) => `${VERSION_PREFIX}/options/group/${id}`,
        deleteOption: (id: string) => `${VERSION_PREFIX}/options/group/${id}`,

        createOptionItem: `${VERSION_PREFIX}/options/group/item`,
        getOptionItems: (groupId?: string, name?: string, priceExtra?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (groupId) params.append("groupId", groupId)
            if (name) params.append("name", name)
            if (priceExtra !== undefined) params.append("priceExtra", String(priceExtra))

            return `${VERSION_PREFIX}/options/group/item/list?${params.toString()}`
        },
        getOptionItemById: (id: string) => `${VERSION_PREFIX}/options/group/item/${id}`,
        getListOptionItemIds: `${VERSION_PREFIX}/options/group/item/list-by-ids`,
        updateOptionItem: (id: string) => `${VERSION_PREFIX}/options/group/item/${id}`,
        deleteOptionItem: (id: string) => `${VERSION_PREFIX}/options/group/item/${id}`,

        setProductOptionConfig: `${VERSION_PREFIX}/options/product/config`,
        getProductOptionConfigs: (productId?: string, optionGroupId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (productId) params.append("productId", productId)
            if (optionGroupId) params.append("optionGroupId", optionGroupId)

            return `${VERSION_PREFIX}/options/product/config?${params.toString()}`
        },
        getProductOptionConfigsById: (id: string) => `${VERSION_PREFIX}/options/product/config/${id}`,
        deleteProductOptionConfigById: (id: string) => `${VERSION_PREFIX}/options/product/config/${id}`,
    },
    combo: {
        createCombo: `${VERSION_PREFIX}/combos`,
        getCombos: (name?: string, price?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (price !== undefined) params.append("price", String(price))

            return `${VERSION_PREFIX}/combos?${params.toString()}`
        },
        getComboById: (id: string) => `${VERSION_PREFIX}/combos/${id}`,
        getListComboIds: `${VERSION_PREFIX}/combos/list-by-ids`,
        updateCombo: (id: string) => `${VERSION_PREFIX}/combos/${id}`,
        deleteCombo: (id: string) => `${VERSION_PREFIX}/combos/${id}`,

        createCombosItem: `${VERSION_PREFIX}/combos/items`,
        getComboItems: (comboId?: string, productId?: string, variantId?: string, quantity?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (comboId) params.append("comboId", comboId)
            if (productId) params.append("productId", productId)
            if (variantId) params.append("variantId", variantId)
            if (quantity !== undefined) params.append("quantity", String(quantity))

            return `${VERSION_PREFIX}/combos/items/list?${params.toString()}`
        },
        getComboItemById: (id: string) => `${VERSION_PREFIX}/combos/items/${id}`,
        getListComboItemIds: `${VERSION_PREFIX}/combos/items/list-by-ids`,
        updateComboItem: (id: string) => `${VERSION_PREFIX}/combos/items/${id}`,
        deleteComboItem: (id: string) => `${VERSION_PREFIX}/combos/items/${id}`,
    },
    printer: {
        createPrinter: `${VERSION_PREFIX}/printers`,
        getPrinters: (name?: string, ipAddress?: string, type?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (ipAddress) params.append("ipAddress", ipAddress)
            if (type) params.append("type", type)

            return `${VERSION_PREFIX}/printers?${params.toString()}`
        },
        getPrinterId: (id: string) => `${VERSION_PREFIX}/printers/${id}`,
        getListPrinterIds: `${VERSION_PREFIX}/printers/list-by-ids`,
        updatePrinterId: (id: string) => `${VERSION_PREFIX}/printers/${id}`,
        deletePrinterId: (id: string) => `${VERSION_PREFIX}/printers/${id}`,
    },
    zone: {},
    table: {},
    reservation: {},
    cart: {},
    cartItem: {},
    cartItemOption: {},
    order: {},
    orderItem: {},
    orderItemOption: {},
    orderTable: {},
    orderVoucher: {},
    invoice: {},
    voucher: {},
    payment: {},
    supplier: {},
    ingredient: {},
    unitConversion: {},
    inventoryBatch: {},
    recipe: {},
    importInvoice: {},
    importInvoiceDetail: {},
    purchaseProposal: {},
    purchaseProposalDetail: {},
    stockCheck: {},
    stockCheckDetail: {},
}