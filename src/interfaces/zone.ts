export interface IZone {
    id: string,
    name: string,
    description: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface CreateZone {
    name: string,
    description: string,
    isActive: boolean,
}

export interface UpdateZone {
    name?: string,
    description?: string,
    isActive?: boolean,
}

export interface ZoneQuery {
    name?: string,
    description?: string,
    isActive?: boolean,
}