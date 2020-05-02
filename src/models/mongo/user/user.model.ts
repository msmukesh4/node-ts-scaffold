import {BaseModel} from '../baseModel'
import {Connection} from 'mongoose'
import {IUserModel} from './user.interface'
import {UserSchema} from './user.schema'

export class User extends BaseModel<IUserModel> {
	constructor (connection: Connection) {
		super(connection, 'User', UserSchema);
	}
}