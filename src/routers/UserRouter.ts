import expressPromiseRouter from 'express-promise-router';
import { inject, injectable } from "inversify";
import log4js from 'log4js';
import { Router } from "express";
import { HasRoutes } from './HasRoutes';
import { UserService } from '../services/UserService'
import config from '../config/config'
import { ExtendedRequest, ExtendedResponse } from '../utils/common';


@injectable()
export class UserRouter implements HasRoutes {

    private router: Router = expressPromiseRouter();
    private logger: log4js.Logger;

    constructor(
        @inject(UserService) private $user: UserService
    ) {
        this.logger = log4js.getLogger('UserService');
        this.logger.level = config.get('logging').level;
        this.initRoutes()
    }

    private initRoutes(): void {
        const router = this.router;

        // get a list of users
        router.get('/', async (req, res) => {
            let { offset = 0, limit = 10, search = '.*' } = (req as ExtendedRequest).query;
            offset = parseInt(offset);
            limit = parseInt(limit);

            return this.$user.fetchUsers(offset, limit, search)
                .then(async (users) => {
                    const resp = {
                        count: await this.$user.countUsers(search),
                        data: users
                    }
                    return (res as ExtendedResponse).success(resp);
                })
                .catch((err) => {
                    return (res as ExtendedResponse).fail(err.message);
                });
        })

        // login user
        router.post('/login', async (req, res) => {
            let {email, password } = (req as ExtendedRequest).body;
            if (!email || !password) {
                return (res as ExtendedResponse).fail("Provide email and password")
            }
            this.logger.info("logging user : ", (req as ExtendedRequest).body)
            return this.$user.fetchUserByCredentails(email, password)
                .then((user) => {
                    return (res as ExtendedResponse).success(user)
                })
                .catch((err) => {
                    return (res as ExtendedResponse).unauth(err.message);
                })
        })

        // get a user by id
        router.get('/:id', async (req, res) => {
            let { id } = (req as ExtendedRequest).params
            this.logger.info(`get user by id : ${id}`)

            return this.$user.fetchUser(id)
                .then((user) => {
                    return (res as ExtendedResponse).success(user)
                })
                .catch((err) => {
                    return (res as ExtendedResponse).fail(err.message);
                })
        })

        // register a user
        router.post('/', async (req, res) => {
            const user = (req as ExtendedRequest).body as UserInfo;
            this.logger.info('register user', user);
            try {
                const response = await this.$user.registerUser(user);
                return (res as ExtendedResponse).success(response);
            }
            catch (err) {
                this.logger.error('registerUser: ', err);
                return (res as ExtendedResponse).fail(err.message);
            }
        });
    }

    getRoutes(): Router {
        return this.router;
    }
}

export interface UserInfo {
    name: string,
    age: number,
    password: string,
    email: string
}