import { IApiResponse } from "@/interfaces/api-response";
import axiosInstance, { endpoints } from "@/utils/axios";

interface LoginParams {
    email: string;
    password: string;
}

interface RegisterParams {
    username: string;
    fullname: string;
    birthday: Date;
    email: string;
    password: string;
}

interface RegisterResponse {
    token: {
        sessionId: string;
        expiry: string;
    }
}

interface LoginResponse  {
    accessToken: string;
}

interface introspectParams {
    token: string;
}

interface IntrospectResponse {
    sub: string;
    role: string;
}

// Đăng ký tài khoản mới
export const register = async (params: RegisterParams): Promise<IApiResponse<RegisterResponse>> => {
    const response = await axiosInstance.post(endpoints.auth.register, params);

    return response.data;
}

// Gửi lại mã xác thực
export const resendVerifyOtp = async(token: string): Promise<any> => {
    const response = await axiosInstance.post(endpoints.auth.resendVerifyOtp, { token });

    return response.data;
}

// Yêu cầu kích hoạt lại tài khoản
export const activateAccount = async(email: string): Promise<IApiResponse<RegisterResponse>> => {
    const response = await axiosInstance.post(endpoints.auth.activateAccount, { email });

    return response.data;
}

// Xác minh tài khoản bằng mã xác thực
export const verifyAccount = async(token: string, otp: string): Promise<void> => {
    const response = await axiosInstance.post(endpoints.auth.verifyAccount, { token, otp });

    return response.data;
}

// Đăng nhập
export const login = async (params: LoginParams): Promise<IApiResponse<LoginResponse>> => {
    const response = await axiosInstance.post(endpoints.auth.authenticate, params);

    return response.data;
}

// Đăng nhập Google

// Yêu cầu quên mật khẩu
export const forgotPassword = async (email: string): Promise<IApiResponse<RegisterResponse>> => {
    const response = await axiosInstance.post(endpoints.auth.forgotPassword, { email });

    return response.data;
}

// Gửi lại mã xác thực quên mật khẩu

// Đặt lại mật khẩu bằng mã xác thực

// Đặt lại mật khẩu bằng token

// Đổi mật khẩu

// Làm mới token

// Đăng xuất

// Kiểm tra token hợp lệ