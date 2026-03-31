
import { IApiResponse } from "@/interfaces/api-response";
import { CreateStaff, IUserProfile, IUserProfileDetail, UpdateUser, UserQuery } from "@/interfaces/user";
import { axiosInstance, endpoints } from "@/utils/axios";

export const createStaff = async (staff: CreateStaff): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.user.createStaff, staff);
    return data;
}

export const getProfile = async (): Promise<IApiResponse<IUserProfileDetail>> => {
    const { data } = await axiosInstance.get(endpoints.user.profile);
    return data;
}

export const getListUser = async (query: UserQuery, page: number, limit: number): Promise<IApiResponse<IUserProfileDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.user.listUser(query.username, query.fullName, query.email, query.role, query.status, query.rankId, page, limit));
    return data;
}

export const getUserId = async (id: string): Promise<IApiResponse<IUserProfileDetail>> => {
    const { data } = await axiosInstance.get(endpoints.user.getUserId(id));
    return data;
}

export const getListUserIds = async (ids: string[]): Promise<IApiResponse<IUserProfile[]>> => {
    const { data } = await axiosInstance.post(endpoints.user.getListUserIds, ids);
    return data;
}

export const getListStaff = async (query: UserQuery, page: number, limit: number): Promise<IApiResponse<IUserProfileDetail[]>> => {
    const { data } = await axiosInstance.get(endpoints.user.listStaff(query.username, query.fullName, query.email, query.role, query.status, query.rankId, page, limit));
    return data;
}

export const updateUserId = async (id: string, user: UpdateUser): Promise<IUserProfileDetail> => {
    const { data } = await axiosInstance.patch(endpoints.user.updateUserId(id), user);
    return data;
}

export const updateUserAdminId = async (id: string, user: UpdateUser): Promise<IUserProfileDetail> => {
    const { data } = await axiosInstance.patch(endpoints.user.updateUserAdminId(id), user);
    return data;
}

export const deleteUserId = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.user.deleteUserId(id));
    return data;
}
