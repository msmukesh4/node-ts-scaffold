import { Model } from 'mongoose';
import { IUserModel, IUser } from '../models/mongo/user';
import { inject, injectable } from 'inversify';
import { MongoService } from '../config/mongo';
import * as uuid from 'uuid'
import log4js from 'log4js'
import bcrypt from 'bcrypt'


@injectable()
export class UserDAO {
	private $user: Model<IUserModel>;
	private logger: log4js.Logger

	constructor(
		@inject(MongoService) private $mongo: MongoService
	) {
		this.$user = this.$mongo.getModel('User');
		this.logger = log4js.getLogger('UserDAO');
	}

    /**
	 * @returns {Promise<Array<IUserModel>>}
	 */
	public async fetchUsers(offset: number, limit: number, search: string): Promise<Array<IUserModel>> {
		this.logger.debug(search);
		return this.$user.find({
			$or: [{
				name: new RegExp(search, 'gi')
			}, {
				email: new RegExp(search, 'gi')
			}]
		}, {}, {
			skip: offset,
			limit
		});
	}

	/**
	 * @param {number} id
	 * @returns {Promise<IUserModel|null>}
	 */
	public async fetchUser(id: IUser['id']): Promise<IUserModel | null> {
		return this.$user.findById(id);
	}

	public async fetchUserByCredentails(email: IUser['email'], password: IUser['password']): Promise<IUserModel | null | void> {
		const user : any = await this.$user.findOne({ email })
		this.logger.debug("user found ", user)
		if (!user) {
			throw new Error("Invalid email or password");
		}

		const match = await bcrypt.compare(password, user.password)

		if(!match){
			throw new Error("Invalid email or password");
		}

		return user;
	}

	public async countUsers(search: string | RegExp): Promise<number> {
		return this.$user.count({
			// is_admin: false,
			$or: [{
				name: new RegExp(search, 'gi')
			}, {
				email: new RegExp(search, 'gi')
			}]
		});
	}

    /**
	 * @param userData
	 * @returns {Promise<IUserModel>}
	 */
	async saveUserAndRelations(userData: any): Promise<IUserModel> {

		const user = new this.$user({
			'name': userData.name,
			'age': userData.age,
			'password': userData.password,
			'uuid': uuid.v4(),
			'email': userData.email
		});

		this.logger.debug('start register');
		return Promise.all([
			user.save()
		]).then(async ([user]) => {
			this.logger.debug('regitser done');
			let tempUser = JSON.parse(JSON.stringify(user))
			return tempUser;
		});
	}
}