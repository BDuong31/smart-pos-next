import { axiosInstance, endpoints } from "@/utils/axios";

export const setMaintenance = async (enabled: boolean) => {
    const { data } = await axiosInstance.post(endpoints.system.setMaintenance, { enabled });
    return data;
}

export const getMaintenanceStatus = async () => {
    const { data } = await axiosInstance.get(endpoints.system.maintenanceStatus);
    return data;
}