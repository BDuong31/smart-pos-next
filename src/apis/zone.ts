import { IZone } from './../interfaces/zone';
import { IApiResponse } from './../interfaces/api-response';
import { CreateZone, UpdateZone, ZoneQuery } from "@/interfaces/zone";
import { axiosInstance, endpoints } from "@/utils/axios";

export const createZone = async (dto: CreateZone): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.zone.createZone, dto);
    return data;
}

export const updateZone = async (id: string, dto: UpdateZone) => {
    const { data } = await axiosInstance.patch(endpoints.zone.updateZone(id), dto);
    console.log("data: ", data)
    return data
}

export const deleteZone = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.zone.deleteZone(id));
    return data;
}

export const getZones = async (dto: ZoneQuery, page: number, limit: number): Promise<IApiResponse<IZone[]>> => {
    const { data } = await axiosInstance.get(endpoints.zone.getZones(dto.name, dto.description, dto.isActive, page, limit));
    return data;
}

export const getZoneById = async (id: string): Promise<IZone> => {
    const { data } = await axiosInstance.get(endpoints.zone.getZoneId(id));
    return data.data;
}

export const getListZoneIds = async (ids: string[]): Promise<IZone[]> => {
    const { data } = await axiosInstance.post(endpoints.zone.getListZoneIds, { ids });
    return data.data;
}