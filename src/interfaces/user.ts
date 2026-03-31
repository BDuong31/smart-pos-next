import { IImage } from "./image";
import { IRank } from "./rank";

export interface IUserProfile {
    id: string,
    username: string,
    email: string,
    fullName: string,
    birthday: Date,
    role: string,
    rankId: string | null,
    mongoUserId: string | null,
    currentPoints: number,
    status: string,
    fcmToken: string | null,
    createdAt: Date,
    updatedAt: Date,
}

export interface IUserProfileDetail {
    id: string,
    username: string,
    avatar: IImage,
    email: string,
    fullName: string,
    birthday: Date | string,
    role: string,
    rankId: string | null,
    rank: IRank,
    mongoUserId: string | null,
    currentPoints: number,
    status: string,
    fcmToken: string | null,
    createdAt: Date | string,
    updatedAt: Date | string,
}

export interface IPublicUser {
        id: string,
        username: string,
        email: string,
        fullName: string,
        birthday: Date,
        rankId: string | null,
}

export interface CreateStaff {
    username: string,
    fullName: string,
    email: string,
    password: string,
    birthday: Date,
}

export interface UpdateUser {
    username?: string,
    salt?: string,
    password?: string,
    fullName?: string,
    email?: string,
    birthday?: Date,
    role?: string,
    rankId?: string,
    mongoUserId?: string,
    currentPoints?: number,
    status?: string,
    fcmToken?: string,
}

export interface UserQuery {
    username?: string,
    fullName?: string,
    email?: string,
    role?: string,
    status?: string,
    rankId?: string,
}