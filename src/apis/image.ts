import { IApiResponse } from '@/interfaces/api-response';
import { IConditionalImage, IImage, IImageCreate, IImageUpdate } from '@/interfaces/image';
import { axiosInstance, endpoints } from '@/utils/axios';
export const getImages = async (dto: IConditionalImage, page: number, limit: number): Promise<IApiResponse<IImage[]>> => {
    try {
        const { data } = await axiosInstance.get(endpoints.image.getImages(dto.refId, dto.type, dto.isMain, page, limit));
        return data;
    } catch (error) {
        console.error('Failed to fetch images:', error);
        throw error;
    }
}

export const uploadImage = async (
    dto: IImageCreate,
    file: File
) : Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    if (dto) {
        formData.append('isMain', String(dto.isMain ?? false));
        formData.append('refId', String(dto.refId ?? ''));
        formData.append('type', String(dto.type ?? ''));
    }
    try {
        const { data } = await axiosInstance.post(endpoints.image.createImage, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    } catch (error) {
        console.error('Failed to upload image:', error);
        throw error;
    }
}

export const deleteImage = async (id: string): Promise<string> => {
    try {
        const { data } = await axiosInstance.delete(endpoints.image.deleteImage(id));
        return data;
    } catch (error) {
        console.error('Failed to delete image:', error);
        throw error;
    }
}

export const updateImage = async (id: string, dto: IImageUpdate): Promise<string> => {
    try {
        const { data } = await axiosInstance.patch(endpoints.image.updateImage(id), dto);
        return data;
    } catch (error) {
        console.error('Failed to update image:', error);
        throw error;
    }
}
