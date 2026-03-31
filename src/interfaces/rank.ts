export interface IRank {
    id: string,
    name: string,
    minPoint: number,
    discountPercent: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface CreateRank {
    name: string,
    minPoint: number,
    discountPercent: number,
}

export interface UpdateRank {
    name?: string,
    minPoint?: number,
    discountPercent?: number,
}

export interface RankQuery {
    name?: string,
    minPoint?: number,
    discountPercent?: number,
}