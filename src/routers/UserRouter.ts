import  expressPromiseRouter from 'express-promise-router';
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

        router.post('/', (req, res) => {
            const user = (req as ExtendedRequest).body as UserInfo;
            this.logger.info('register user');
            return this.$user.registerUser(user)
                .then((response) => {
                    return (res as ExtendedResponse).success(response);
                })
                .catch((err) => {
                    return (res as ExtendedResponse).fail(err.message);
                });
        });
    }

    getRoutes(): Router {
        return this.router;
    }
}

export interface UserInfo {
    name: string,
    age: number,
}