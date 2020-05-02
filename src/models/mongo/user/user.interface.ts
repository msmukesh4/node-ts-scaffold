import {Document} from 'mongoose';

export interface IUser {
    id?: string
    name: string
    age: number
    uuid?: string
    status?: string
}

export type IUserModel = IUser & Document;