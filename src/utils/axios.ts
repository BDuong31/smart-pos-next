'use client';

import axios, { AxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { setToken, logout } from '@/store/slices/authSlice';
import { HOST_API, AI_API } from '@/global-config';
import { createCategory } from '@/apis/category';
import { get } from 'http';
import { id } from 'zod/v4/locales';
import { IReservationQuery } from '@/interfaces/reservation';
import { verify } from 'crypto';
// Tạo một instance của axios với cấu hình mặc định
export const axiosInstance = axios.create({ 
    baseURL: HOST_API, 
    withCredentials: true,
});

// Tạo một instance của axios với cấu hình cho AI
export const axiosAiInstance = axios.create({
    baseURL: AI_API
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
    console.log("Current token in request interceptor: ", token);

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
})

axiosAiInstance.interceptors.request.use((config) => {
    config.headers['x-api-key'] = process.env.NEXT_PUBLIC_AI_API_KEY;

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
                    console.log(token)
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

        if (err.response?.status === 503) {
            if (err.response.data?.error === 'MAINTENANCE_MODE') {
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/maintenance')) {
                    window.location.href = 'http://localhost:3000/maintenance';
                }
            }
            return Promise.reject(err);
        }

        return Promise.reject(err);
    }
);

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
        listUser: (username?: string, fullName?: string, email?: string, role?: string, status?: string, rankId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams();

            if (username) params.append('username', username);
            if (fullName) params.append('fullName', fullName);
            if (email) params.append('email', email);
            if (role) params.append('role', role);
            if (status) params.append('status', status);
            if (rankId) params.append('rankId', rankId);
            if (page) params.append('page', String(page));
            if (limit) params.append('limit', String(limit));

            return `${VERSION_PREFIX}/users?${params.toString()}`;
        },
        getUserId: (id: string) => `${VERSION_PREFIX}/users/${id}`,
        getListUserIds: `${VERSION_PREFIX}/users/list-by-ids`,
        listStaff: (username?: string, fullName?: string, email?: string, role?: string, status?: string, rankId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams();

            if (username) params.append('username', username);
            if (fullName) params.append('fullName', fullName);
            if (email) params.append('email', email);
            if (role) params.append('role', role);
            if (status) params.append('status', status);
            if (rankId) params.append('rankId', rankId);
            if (page) params.append('page', String(page));
            if (limit) params.append('limit', String(limit));

            return `${VERSION_PREFIX}/users/staff?${params.toString()}`;
        },
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
    loyalty: {
        createRank: `${VERSION_PREFIX}/loyalty/user-ranks`,
        updateRank: (id: string) => `${VERSION_PREFIX}/loyalty/user-ranks/${id}`,
        deleteRank: (id: string) => `${VERSION_PREFIX}/loyalty/user-ranks/${id}`,
        getListRank: (name?: string, minPoint?: number, discountPercent?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (minPoint) params.append("minPoint", String(minPoint))
            if (discountPercent) params.append("discountPercent", String(discountPercent))

            return `${VERSION_PREFIX}/loyalty/user-ranks/list?${params.toString()}`
        },
        createPointHistory: `${VERSION_PREFIX}/loyalty/point-histories`,
        getListPointHistory: (userId?: string, amount?: number,  reason?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()

            params.append("limit", String(limit))
            params.append("page", String(page))

            if (userId) params.append("userId", userId)
            if (amount) params.append("amount", String(amount))
            if (reason) params.append("reason", reason)

            return `${VERSION_PREFIX}/loyalty/point-histories?${params.toString()}`
        }
    },
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
        getProductOptionConfigsByProductId: (productId: string) => `${VERSION_PREFIX}/options/product/config/${productId}`,
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
    zone: {
        createZone: `${VERSION_PREFIX}/zones`,
        updateZone: (id: string) => `${VERSION_PREFIX}/zones/${id}`,
        deleteZone: (id: string) => `${VERSION_PREFIX}/zones/${id}`,
        getZones: (name?: string, description?: string, isActive?: boolean, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (description) params.append("description", description)
            if (isActive !== undefined) params.append("isActive", String(isActive))

            return `${VERSION_PREFIX}/zones?${params.toString()}`
        },
        getZoneId: (id: string) => `${VERSION_PREFIX}/zones/${id}`,
        getListZoneIds: `${VERSION_PREFIX}/zones/list-by-ids`,
    },
    table: {
        createTable: `${VERSION_PREFIX}/tables`,
        updateTable: (id: string) => `${VERSION_PREFIX}/tables/${id}`,
        deleteTable: (id: string) => `${VERSION_PREFIX}/tables/${id}`,
        getTables: (zoneId?: string, name?: string, qrCode?: string, capacity?: number, isActive?: boolean, status?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (zoneId) params.append("zoneId", zoneId)
            if (name) params.append("name", name)
            if (qrCode) params.append("qrCode", qrCode)
            if (capacity !== undefined) params.append("capacity", String(capacity))
            if (isActive !== undefined) params.append("isActive", String(isActive))
            if (status) params.append("status", status)

            return `${VERSION_PREFIX}/tables?${params.toString()}`
        },
        getTableId: (id: string) => `${VERSION_PREFIX}/tables/${id}`,
        getListTableIds: `${VERSION_PREFIX}/tables/list-by-ids`,
        getListTableAvailable: (time: Date) => {
            const params = new URLSearchParams()
            params.append("time", time.toISOString())
            return `${VERSION_PREFIX}/tables/available?${params.toString()}`
        }
    },
    reservation: {
        createReservation: `${VERSION_PREFIX}/reservations`,
        getReservations: (query?: IReservationQuery, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (query) {
                if (query.userId) params.append("userId", query.userId)
                if (query.tableId) params.append("tableId", query.tableId)
                if (query.customerName) params.append("customerName", query.customerName)
                if (query.phone) params.append("phone", query.phone)
                if (query.time) params.append("time", query.time.toISOString())
                if (query.guestCount !== undefined) params.append("guestCount", String(query.guestCount))
                if (query.note) params.append("note", query.note)
                if (query.status) params.append("status", query.status)
            }

            return `${VERSION_PREFIX}/reservations?${params.toString()}`
        },
        getReservationId: (id: string) => `${VERSION_PREFIX}/reservations/${id}`,
        getReservationIds: `${VERSION_PREFIX}/reservations/list-by-ids`,
        updateReservationId: (id: string) => `${VERSION_PREFIX}/reservations/${id}`,
        deleteReservationId: (id: string) => `${VERSION_PREFIX}/reservations/${id}`,
    },
    cart: {
        createCart: `${VERSION_PREFIX}/carts`,
        updateCart: (id: string) => `${VERSION_PREFIX}/carts/${id}`,
        deleteCart: (id: string) => `${VERSION_PREFIX}/carts/${id}`,
        getCarts: (userId?: string | undefined, totalItem?: number | undefined, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (userId) params.append("userId", userId)
            if (totalItem !== undefined) params.append("totalItem", String(totalItem))
            
            return `${VERSION_PREFIX}/carts?${params.toString()}`
        },
        getCartId: (id: string) => `${VERSION_PREFIX}/carts/${id}`,
        getCartIds: `${VERSION_PREFIX}/carts/list-by-ids`,
    },
    cartItem: {
        createCartItem: `${VERSION_PREFIX}/carts/item`,
        updateCartItem: (id: string) => `${VERSION_PREFIX}/carts/item/${id}`,
        deleteCartItem: (id: string) => `${VERSION_PREFIX}/carts/item/${id}`,
        getCartItems: (cartId?: string, productId?: string, variantId?: string, quantity?: number, note?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (cartId) params.append("cartId", cartId)
            if (productId) params.append("productId", productId)
            if (variantId) params.append("variantId", variantId)
            if (quantity !== undefined) params.append("quantity", String(quantity))
            if (note) params.append("note", note)

            return `${VERSION_PREFIX}/carts/item?${params.toString()}`
        },
        getCartItemId: (id: string) => `${VERSION_PREFIX}/carts/item/${id}`,
        getCartItemIds: `${VERSION_PREFIX}/carts/item/list-by-ids`,
    },
    cartItemOption: {
        createCartItemOption: `${VERSION_PREFIX}/carts/item/option`,
        updateCartItemOption: (id: string) => `${VERSION_PREFIX}/carts/item/option/${id}`,
        deleteCartItemOption: (id: string) => `${VERSION_PREFIX}/carts/item/option/${id}`,
        getCartItemOptions: (cartItemId?: string, optionItemId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (cartItemId) params.append("cartItemId", cartItemId)
            if (optionItemId) params.append("optionItemId", optionItemId)

            return `${VERSION_PREFIX}/carts/item/option?${params.toString()}`
        },
        getCartItemOptionId: (id: string) => `${VERSION_PREFIX}/carts/item/option/${id}`,
        getCartItemOptionIds: `${VERSION_PREFIX}/carts/item/option/list-by-ids`,        
    },
    order: {
        createOrder: `${VERSION_PREFIX}/orders`,
        updateOrder: (id: string) => `${VERSION_PREFIX}/orders/${id}`,
        deleteOrder: (id: string) => `${VERSION_PREFIX}/orders/${id}`,
        getOrders: (userId?: string, totalAmount?: number, status?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (userId) params.append("userId", userId)
            if (totalAmount) params.append("totalAmount", String(totalAmount))
            if (status) params.append("status", status)

            return `${VERSION_PREFIX}/orders?${params.toString()}`
        },
        getOrderById: (id: string) => `${VERSION_PREFIX}/orders/${id}`,
        getListOrderIds: `${VERSION_PREFIX}/orders/list-by-ids`,
    },
    orderItem: {
        createOrderItem: `${VERSION_PREFIX}/orders/item`,
        updateOrderItem: (id: string) => `${VERSION_PREFIX}/orders/item/${id}`,
        deleteOrderItem: (id: string) => `${VERSION_PREFIX}/orders/item/${id}`,
        getOrderItem: (orderId?: string, productId?: string, variantId?: string, productName?: string, quantity?: number, price?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (orderId) params.append("orderId", orderId)
            if (productId) params.append("productId", productId)
            if (variantId) params.append("variantId", variantId)
            if (productName) params.append("productName", productName)
            if (quantity) params.append("quantity", String(quantity))
            if (price) params.append("price", String(price))

            return `${VERSION_PREFIX}/orders/item?${params.toString()}`
        },
        getOrderItemId: (id: string) => `${VERSION_PREFIX}/orders/item/${id}`,
        getOrderItemIds: `${VERSION_PREFIX}/orders/item/list-by-ids`,
    },
    orderItemOption: {
        createOrderItemOption: `${VERSION_PREFIX}/orders/item/option`,
        updateOrderItemOption: (id: string) => `${VERSION_PREFIX}/orders/item/option/${id}`,
        deleteOrderItemOption: (id: string) => `${VERSION_PREFIX}/orders/item/option/${id}`,
        getOrderItemOption: (orderItemId?: string, optionItemId?: string, optionName?: string, price?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (orderItemId) params.append("orderItemId", orderItemId)
            if (optionItemId) params.append("optionItemId", optionItemId)
            if (optionName) params.append("optionName", optionName)
            if (price) params.append("price", String(price))

            return `${VERSION_PREFIX}/orders/item/option?${params.toString()}`
        },
        getOrderItemOptionId: (id: string) => `${VERSION_PREFIX}/orders/item/option/${id}`,
        getOrderItemOptionIds: `${VERSION_PREFIX}/orders/item/option/list-by-ids`,
    },
    orderTable: {
        createOrderTable: `${VERSION_PREFIX}/orders/table`,
        updateOrderTable: (id: string) => `${VERSION_PREFIX}/orders/table/${id}`,
        deleteOrderTable: (id: string) => `${VERSION_PREFIX}/orders/table/${id}`,
        getOrderTable: (orderId?: string, tableId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (orderId) params.append("orderId", orderId)
            if (tableId) params.append("tableId", tableId)

            return `${VERSION_PREFIX}/orders/table?${params.toString()}`
        },
        getOrderTableId: (id: string) => `${VERSION_PREFIX}/orders/table/${id}`,
        getOrderTableIds: `${VERSION_PREFIX}/orders/table/list-by-ids`,
    },
    orderVoucher: {
        createOrderVoucher: `${VERSION_PREFIX}/orders/voucher`,
        updateOrderVoucher: (id: string) => `${VERSION_PREFIX}/orders/voucher/${id}`,
        deleteOrderVoucher: (id: string) => `${VERSION_PREFIX}/orders/voucher/${id}`,
        getOrderVoucher: (orderId?: string, voucherId?: string, discountApplied?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (orderId) params.append("orderId", orderId)
            if (voucherId) params.append("voucherId", voucherId)
            if (discountApplied) params.append("discountApplied", String(discountApplied))

            return `${VERSION_PREFIX}/orders/voucher?${params.toString()}`
        },
        getOrderVoucherId: (id: string) => `${VERSION_PREFIX}/orders/voucher/${id}`,
        getOrderVoucherIds: `${VERSION_PREFIX}/orders/voucher/list-by-ids`,
    },
    invoice: {
        createInvoice: `${VERSION_PREFIX}/invoices`,
        updateInvoice: (id: string) => `${VERSION_PREFIX}/invoices/${id}`,
        deleteInvoice: (id: string) => `${VERSION_PREFIX}/invoices/${id}`,
        getInvoices: (orderId?: string, taxCode?: string, issuedAt?: Date, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (orderId) params.append("orderId", orderId)
            if (taxCode) params.append("taxCode", taxCode)
            if (issuedAt) params.append("issuedAt", issuedAt.toISOString())

            return `${VERSION_PREFIX}/invoices?${params.toString()}`
        },
        getInvoiceId: (id: string) => `${VERSION_PREFIX}/invoices/${id}`,
        getListInvoiceIds: `${VERSION_PREFIX}/invoices/list-by-ids`,
    },
    voucher: {
        createVoucher: `${VERSION_PREFIX}/vouchers`,
        updateVoucher: (id: string) => `${VERSION_PREFIX}/vouchers/${id}`,
        deleteVoucher: (id: string) => `${VERSION_PREFIX}/vouchers/${id}`,
        getVouchers: (code?: string, type?: string, value?: string, minOrderVal?: string, usageLimit?: string, isActive?: string, startDate?: string, endDate?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (code) params.append("code", code)
            if (type) params.append("type", type)
            if (value) params.append("value", value)
            if (minOrderVal) params.append("minOrderVal", minOrderVal)
            if (usageLimit) params.append("usageLimit", usageLimit)
            if (isActive) params.append("isActive", isActive)
            if (startDate) params.append("startDate", startDate)
            if (endDate) params.append("endDate", endDate)   

            return `${VERSION_PREFIX}/vouchers?${params.toString()}`   
        },
        getVoucherId: (id: string) => `${VERSION_PREFIX}/vouchers/${id}`,
        getListVoucherIds: `${VERSION_PREFIX}/vouchers/list-by-ids`,
    },
    payment: {
        createPayment: `${VERSION_PREFIX}/payments`,
        updatePayment: (id: string) => `${VERSION_PREFIX}/payments/${id}`,
        deletePayment: (id: string) => `${VERSION_PREFIX}/payments/${id}`,
        getPayments: (orderId?: string, externalTransactionId?: string, method?: string, status?: string, paidAt?: Date, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (orderId) params.append("orderId", orderId)
            if (externalTransactionId) params.append("externalTransactionId", externalTransactionId)
            if (method) params.append("method", method)
            if (status) params.append("status", status)
            if (paidAt) params.append("paidAt", paidAt.toISOString())

            return `${VERSION_PREFIX}/payments?${params.toString()}`
        },
        getPaymentId: (id: string) => `${VERSION_PREFIX}/payments/${id}`,
        getListPaymentIds: `${VERSION_PREFIX}/payments/list-by-ids`,
        initiatePayment: `${VERSION_PREFIX}/payments/initiate`,
        verifyPayment: `${VERSION_PREFIX}/payments/verify`,
        queryStatus: `${VERSION_PREFIX}/payments/query-status`,
        refundPayment: `${VERSION_PREFIX}/payments/refund`,
        cancelPayment: `${VERSION_PREFIX}/payments/cancel`,
    },
    supplier: {
        createSupplier: `${VERSION_PREFIX}/suppliers`,  
        getSuppliers: (name?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)   

            return `${VERSION_PREFIX}/suppliers?${params.toString()}`   
        },  
        getSupplierId: (id: string) => `${VERSION_PREFIX}/suppliers/${id}`,
        getListSupplierIds: `${VERSION_PREFIX}/suppliers/list-by-ids`,
        updateSupplierId: (id: string) => `${VERSION_PREFIX}/suppliers/${id}`,
        deleteSupplierId: (id: string) => `${VERSION_PREFIX}/suppliers/${id}`,
    },
    ingredient: {
        createIngredient: `${VERSION_PREFIX}/ingredients`,
        getIngredients: (name?: string, baseUnit?: string, minStock?: number, forecastDataId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (name) params.append("name", name)
            if (baseUnit) params.append("baseUnit", baseUnit)
            if (minStock !== undefined) params.append("minStock", String(minStock))
            if (forecastDataId) params.append("forecastDataId", forecastDataId)

            return `${VERSION_PREFIX}/ingredients?${params.toString()}`
        },
        getIngredientById: (id: string) => `${VERSION_PREFIX}/ingredients/${id}`,
        getListIngredientIds: `${VERSION_PREFIX}/ingredients/list-by-ids`,
        updateIngredient: (id: string) => `${VERSION_PREFIX}/ingredients/${id}`,
        deleteIngredient: (id: string) => `${VERSION_PREFIX}/ingredients/${id}`,
    },
    unitConversion: {
        createUnitConversion: `${VERSION_PREFIX}/unit-conversions`,
        getUnitConversions: (ingredientId?: string, fromUnit?: string, toUnit?: string, factor?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (ingredientId) params.append("ingredientId", ingredientId)
            if (fromUnit) params.append("fromUnit", fromUnit)
            if (toUnit) params.append("toUnit", toUnit)
            if (factor !== undefined) params.append("factor", String(factor))

            return `${VERSION_PREFIX}/unit-conversions?${params.toString()}`
        },
        getUnitConversionById: (id: string) => `${VERSION_PREFIX}/unit-conversions/${id}`,
        getUnitConversionByIds: `${VERSION_PREFIX}/unit-conversions/list-by-ids`,
        updateUnitConversion: (id: string) => `${VERSION_PREFIX}/unit-conversions/${id}`,
        deleteUnitConversion: (id: string) => `${VERSION_PREFIX}/unit-conversions/${id}`,
    },
    inventoryBatch: {
        createInventoryBatch: `${VERSION_PREFIX}/inventory-batches`,
        getInventoryBatches: (ingredientId?: string, importInvoiceDetailId?: string, quantity?: number, expiryDate?: Date, importDate?: Date, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (ingredientId) params.append("ingredientId", ingredientId)
            if (importInvoiceDetailId) params.append("importInvoiceDetailId", importInvoiceDetailId)
            if (quantity !== undefined) params.append("quantity", String(quantity))
            if (expiryDate) params.append("expiryDate", expiryDate.toISOString())
            if (importDate) params.append("importDate", importDate.toISOString())

            return `${VERSION_PREFIX}/inventory-batches?${params.toString()}`
        },
        getInventoryBatchById: (id: string) => `${VERSION_PREFIX}/inventory-batches/${id}`,
        getListInventoryBatchIds: `${VERSION_PREFIX}/inventory-batches/list-by-ids`,
        updateInventoryBatch: (id: string) => `${VERSION_PREFIX}/inventory-batches/${id}`,
        deleteInventoryBatch: (id: string) => `${VERSION_PREFIX}/inventory-batches/${id}`,
    },
    recipe: {
        createRecipe: `${VERSION_PREFIX}/recipes`,
        getRecipes: (ingredientId?: string, amount?: number, productId?: string, variantId?: string, optionItemId?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (ingredientId) params.append("ingredientId", ingredientId)
            if (amount !== undefined) params.append("amount", String(amount))
            if (productId) params.append("productId", productId)
            if (variantId) params.append("variantId", variantId)
            if (optionItemId) params.append("optionItemId", optionItemId)

            return `${VERSION_PREFIX}/recipes?${params.toString()}`
        },
        getRecipeById: (id: string) => `${VERSION_PREFIX}/recipes/${id}`,
        getListRecipeIds: `${VERSION_PREFIX}/recipes/list-by-ids`,
        updateRecipe: (id: string) => `${VERSION_PREFIX}/recipes/${id}`,
        deleteRecipe: (id: string) => `${VERSION_PREFIX}/recipes/${id}`,
    },
    importInvoice: {
        createImportInvoice: `${VERSION_PREFIX}/import-invoices`,
        getImportInvoices: (code?: string, supplierId?: string, totalCost?: number, importDate?: Date, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (code) params.append("code", code)
            if (supplierId) params.append("supplierId", supplierId)
            if (totalCost !== undefined) params.append("totalCost", String(totalCost))
            if (importDate) params.append("importDate", importDate.toISOString())

            return `${VERSION_PREFIX}/import-invoices?${params.toString()}`
        },
        getImportInvoiceById: (id: string) => `${VERSION_PREFIX}/import-invoices/${id}`,
        getListImportInvoiceIds: `${VERSION_PREFIX}/import-invoices/list-by-ids`,
        updateImportInvoice: (id: string) => `${VERSION_PREFIX}/import-invoices/${id}`,
        deleteImportInvoice: (id: string) => `${VERSION_PREFIX}/import-invoices/${id}`,
    },
    importInvoiceDetail: {
        createImportInvoiceDetail: `${VERSION_PREFIX}/import-invoice-details`,
        getImportInvoiceDetails: (invoiceId?: string, ingredientId?: string, quantity?: number, unit?: string, unitPrice?: number, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (invoiceId) params.append("invoiceId", invoiceId)
            if (ingredientId) params.append("ingredientId", ingredientId)
            if (quantity !== undefined) params.append("quantity", String(quantity))
            if (unit) params.append("unit", unit)
            if (unitPrice !== undefined) params.append("unitPrice", String(unitPrice))

            return `${VERSION_PREFIX}/import-invoice-details?${params.toString()}`
        },
        getImportInvoiceDetailById: (id: string) => `${VERSION_PREFIX}/import-invoice-details/${id}`,
        getListImportInvoiceDetailIds: `${VERSION_PREFIX}/import-invoice-details/list-by-ids`,
        updateImportInvoiceDetail: (id: string) => `${VERSION_PREFIX}/import-invoice-details/${id}`,
        deleteImportInvoiceDetail: (id: string) => `${VERSION_PREFIX}/import-invoice-details/${id}`,    
    },
    purchaseProposal: {},
    purchaseProposalDetail: {},
    stockCheck: {
        createStockCheck: `${VERSION_PREFIX}/stock-checks`,
        updateStockCheck: (id: string) => `${VERSION_PREFIX}/stock-checks/${id}`,
        deleteStockCheck: (id: string) => `${VERSION_PREFIX}/stock-checks/${id}`,
        getStockChecks: (code?: string, userId?: string, note?: string, checkDate?: Date, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (code) params.append("code", code)
            if (userId) params.append("userId", userId)
            if (note) params.append("note", note)
            if (checkDate) params.append("checkDate", checkDate.toISOString())

            return `${VERSION_PREFIX}/stock-checks?${params.toString()}`
        },
        getStockCheckById: (id: string) => `${VERSION_PREFIX}/stock-checks/${id}`,
        getListStockCheckIds: `${VERSION_PREFIX}/stock-checks/list-by-ids`,
    },
    stockCheckDetail: {
        createStockCheckDetail: `${VERSION_PREFIX}/stock-check-details`,
        updateStockCheckDetail: (id: string) => `${VERSION_PREFIX}/stock-check-details/${id}`,
        deleteStockCheckDetail: (id: string) => `${VERSION_PREFIX}/stock-check-details/${id}`,
        getStockCheckDetails: (stockCheckId?: string, ingredientId?: string, systemQty?: number, actualQty?: number, reason?: string, page?: number, limit?: number) => {
            const params = new URLSearchParams()
            params.append("limit", String(limit))
            params.append("page", String(page))

            if (stockCheckId) params.append("stockCheckId", stockCheckId)
            if (ingredientId) params.append("ingredientId", ingredientId)
            if (systemQty !== undefined) params.append("systemQty", String(systemQty))
            if (actualQty !== undefined) params.append("actualQty", String(actualQty))
            if (reason) params.append("reason", reason)

            return `${VERSION_PREFIX}/stock-check-details?${params.toString()}`
        },
        getStockCheckDetailById: (id: string) => `${VERSION_PREFIX}/stock-check-details/${id}`,
        getListStockCheckDetailIds: `${VERSION_PREFIX}/stock-check-details/list-by-ids`,
    },
    system: {
        setMaintenance: `${VERSION_PREFIX}/system/maintenance`,
        maintenanceStatus: `${VERSION_PREFIX}/system/maintenance-status`,
    },
    ai: {
        getForecast: (mode: string) => {
            const params = new URLSearchParams()
            params.append("mode", mode)
            return `forecast?${params.toString()}`
        },
        getRecommend: (id: string) => `recommend/${id}`,
    }
}