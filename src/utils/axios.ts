'use client';

import axios, { AxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { setToken, logout } from '@/store/slices/authSlice';
import { HOST_API } from '@/global-config';
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
                const res = await axiosInstance.post('/v1/auth/refresh-token');

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
        getImage: (refId?: string, type?: string, isMain?: boolean, page?: number, limit?: number) => 
            `${VERSION_PREFIX}/images?limit=${limit}&page=${page}&refId=${refId || ''}&type=${type || ''}&isMain=${isMain !== undefined ? isMain : ''}`,
        getImageId: (id: string) => `${VERSION_PREFIX}/images/${id}`,
        updateImageId: (id: string) => `${VERSION_PREFIX}/images/${id}`,
        deleteImageId: (id: string) => `${VERSION_PREFIX}/images/${id}`,
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
    category: {},
    product: {},
    variant: {},
    option: {},
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