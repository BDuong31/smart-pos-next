import { IApiResponse } from "@/interfaces/api-response";
import axiosInstance, { endpoints } from "@/utils/axios";

interface LoginParams {
    username: string;
    password: string;
}

interface RegisterParams {
    username: string;
    fullName: string;
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

interface introspectResponse {
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
export const login = async (params: LoginParams): Promise<LoginResponse> => {
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
export const resendForgotPasswordOtp = async(token: string): Promise<any> => {
    const response = await axiosInstance.post(endpoints.auth.resendForgotPassword, { token });
    return response.data;
}

// Đặt lại mật khẩu bằng mã xác thực
export const resetPassword = async(token: string, otp: string, newPassword: string): Promise<void> => {
    const response = await axiosInstance.post(endpoints.auth.resetPassword, { token, otp, newPassword });
    return response.data;
}

// Đổi mật khẩu
export const changePassword = async(currentPassword: string, newPassword: string): Promise<void> => {
    const response = await axiosInstance.post(endpoints.auth.changePassword, { currentPassword, newPassword });
    return response.data;
}

// Làm mới token
export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post(endpoints.auth.refreshToken, { refreshToken });
    return response.data;
}

// Đăng xuất
export const logout = async (refreshToken: string): Promise<void> => {
    const response = await axiosInstance.post(endpoints.auth.logout, { refreshToken });
    return response.data;
}

// Kiểm tra token hợp lệ
export const introspect = async (params: introspectParams ): Promise<introspectResponse> => {
  const response = await axiosInstance.post(endpoints.auth.introspect, params)
  return response.data.data
}