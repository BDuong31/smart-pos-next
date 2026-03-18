export interface IImage {
    id: string,
    url: string,
    isMain: boolean,
    type: string,
    publicId: string,
    refId: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IImageCreate {
    isMain: boolean,
    refId: string,
    type: string,
}

export interface IImageUpdate {
    url?: string,
    isMain?: boolean,
    refId?: string,
    type?: string,
}

export interface IConditionalImage {
    url?: string,
    isMain?: boolean,
    refId?: string,
    type?: string,
}