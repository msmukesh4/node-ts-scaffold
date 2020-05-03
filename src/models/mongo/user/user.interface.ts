import {Document} from 'mongoose';

export interface IUser {
    id?: string
    password: string
    name: string
    email: string
    age: number
    uuid?: string
    status?: string
}

export type IUserModel = IUser & Document;