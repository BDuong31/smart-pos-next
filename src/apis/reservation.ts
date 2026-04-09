import { IReservationCreate, IReservationQuery, IReservationUpdate } from "@/interfaces/reservation";
import { axiosInstance, endpoints } from "@/utils/axios";

export const createReservation = async (dto: IReservationCreate): Promise<string> => {
    const { data } = await axiosInstance.post(endpoints.reservation.createReservation, dto)
    return data;
}

export const updateReservation = async (id: string,dto: IReservationUpdate) => {
    const { data } = await axiosInstance.patch(endpoints.reservation.updateReservationId(id), dto)
    return data;
}

export const deleteReservation = async (id: string) => {
    const { data } = await axiosInstance.delete(endpoints.reservation.deleteReservationId(id))
    return data;
}

export const getResesvations = async (query: IReservationQuery, page?: number, limit?: number) => {
    const { data } = await axiosInstance.get(endpoints.reservation.getReservations(query, page, limit))
    return data;
}

export const getReservationById = async (id: string) => {
    const { data } = await axiosInstance.get(endpoints.reservation.getReservationId(id))
    return data;
}

export const getReservationsByIds = async (ids: string[]) => {
    const { data } = await axiosInstance.post(endpoints.reservation.getReservationIds, ids)
    return data;
}