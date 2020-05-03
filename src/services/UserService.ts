import { inject, injectable } from "inversify";
import * as log4js from 'log4js';
import config from '../config/config';
import { UserDAO } from '../dao/UserDAO';
import { UserInfo } from '../routers/UserRouter'
import { IUserModel, IUser } from "../models/mongo/user";
import { errors } from "../utils/errors";

@injectable()
export class UserService {

	private logger: log4js.Logger;

	constructor(
		@inject(UserDAO) private userDAO: UserDAO
	) {
		this.logger = log4js.getLogger('UserService');
		this.logger.level = config.get('logging').level;
	}

    /**
	 *
	 * @returns {Promise<Array<IUserModel>>}
	 */
	public async fetchUsers(offset: number, limit: number, search: string): Promise<Array<IUserModel>> {
		return this.userDAO.fetchUsers(offset, limit, search);
	}

	/**
	 *
	 * @returns {PromiseIUserModel>}
	 */
	public async fetchUser(id: IUser['id']): Promise<IUserModel | null>{
		return this.userDAO.fetchUser(id);
	}
	
	public async fetchUserByCredentails(name: IUser['email'], password: IUser['password']): Promise<IUserModel | null| void>{
		return this.userDAO.fetchUserByCredentails(name, password);
	}

	public async countUsers(search: string | RegExp): Promise<number> {
		return this.userDAO.countUsers(search);
	}

    /**
	 *
	 * @param {UserInfo} userData
	 * @returns {Promise<IUserModel|null>}
	 */
	async registerUser(userData: UserInfo): Promise<IUserModel | null> {

		this.logger.debug("register new user", userData);
		if (!userData.name) {
			throw new errors.wrongInput('Username must be provided');
		}

		const userName = userData.name;

		if (userName.search(/^[a-zA-Z0-9_-]*$/)) {
			throw new errors.wrongInput('Username contains invalid characters');
		}

		if (userName.length < 2 || userName.length > 20) {
			throw new errors.wrongInput(
				'Username length must be between 2 and 20 characters long');
		}

		const nUser = await this.userDAO.saveUserAndRelations(userData);
		return nUser;

	}
}