import { injectable } from "inversify";
import { Request, Response } from "express";
import * as log4js from 'log4js';
import config from '../config/config';
import { errors } from '../utils/errors';

@injectable()
export class ConsistentResponseMiddleware {
    private logger: log4js.Logger;

    constructor() {
        this.logger = log4js.getLogger('ResponseMiddleware');
        this.logger.level = config.get('logging').level;
    }
    public middleware(req: any, res: any, next: Function) {
        const self = this;
        req.success = (result: any) => {
            res.json({
                success: true,
                result: result
            });
        };

        req.fail = (message: any, isError: any) => {
            res.json({
                success: false,
                message: message
            });
        };

        // Errors were happening without these two babies.. (AS)
        res.success = (result: any) => {
            res.json({
                success: true,
                result: result
            });
        };
        res.respondError = (e: { message: any; }) => {
            // for (const type in errors) {
            //     if (errors.hasOwnProperty(type) && e instanceof errors[type] && typeof res[type] === 'function') {
            //         return res[type](e.message);
            //     }
            // }
            return res.fail(e.message);
        };

        res.entityNotFound = (message: any) => {
            res.json({
                success: false,
                message: message
            });
            res.status(204);
        };
        res.wrongInput = (message: any) => {
            res.json({
                success: false,
                message: message
            });
            res.status(422);
        };
        res.locked = (message: any) => {
            res.json({
                success: false,
                message: message
            });
            res.status(423);
        };
        res.fail = (message: any) => {
            res.status(400);
            res.json({
                success: false,
                message: message
            });
        };
        
        res.unauth = (message: any) => {
            res.status(401);
            res.json({
                success: false,
                message: message
            });
        };
        next();
    }
}