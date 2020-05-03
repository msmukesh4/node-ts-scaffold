import express from 'express';
import log4js from 'log4js'
import config from './config/config';
import path from 'path'
import { Container, inject } from 'inversify';
import { container } from './config/inversify.config';
import { TestInjection } from './test/TestInjection';
import { MongoService } from './config/mongo';
import { User } from './models/mongo/user';
import bodyParser from 'body-parser'
import { UserRouter } from './routers/UserRouter';
import { ExtendedResponse } from './utils/genericReqRes';
import { ConsistentResponseMiddleware } from './middleware/ConsistentResponseMiddleware';


export class App {
    private static readonly PORT: number = 4000;
    private app: express.Application;
    private logger: log4js.Logger;
    private container: Container = container;

    constructor() {
        console.log(`Starting app with current env : ${process.env.NODE_ENV}`);
        console.log(config.get('logging'));

        this.app = express();
        this.configMongo();
        this.config();
        this.logger = log4js.getLogger('AppServer');
        this.logger.level = config.get('logging').level;
        this.registerRoutes();
        this.startServer();
        this.testInject();
    }

    private config(): void {
        log4js.configure({
            appenders: {
                console: { type: 'console' },
                file: {
                    type: 'file',
                    filename: path.join(__dirname, config.get('logging').filePath)
                }
            },
            categories: {
                app: { appenders: ['file'], level: 'info' },
                default: { appenders: ['console'], level: 'debug' }
            }
        });
    }

    private configMongo() {
        try {

            const $mongo = this.container.get<MongoService>(MongoService);
            $mongo.setModels(User);

        } catch (error) {
            this.logger.error('error connecting mongo: ', error)
        }
    }

    private registerRoutes(): void {

        const consistentResponseMiddleware = this.container.get<ConsistentResponseMiddleware>(
            ConsistentResponseMiddleware).middleware;


        // use this to turn on maintenance mode 
        // this.app.use((req, res, next) => {
        //     res.sendStatus(503);
        // })

        this.app.use('/*', bodyParser.urlencoded({ extended: true }), bodyParser.json({
            verify: function (req: any, res, buf) {
                req.rawData = buf;
            }
        }), consistentResponseMiddleware);

        this.app.get('/', (req, res) => {
            return (res as ExtendedResponse).success("App is running")
        })

        this.app.use('/api/users', this.container.get<UserRouter>(UserRouter).getRoutes());

    }

    private startServer(): void {

        let port = process.env.PORT || App.PORT;

        this.logger.info(`process.env.PORT : ${process.env.PORT}`)
        this.logger.info(`App.PORT : ${App.PORT}`)

        this.app.listen(port, () => {
            this.logger.debug(`server is running on port ${port}`);
        });

        process.on('SIGTERM', () => {
            this.logger.warn('server is terminated by SIGTERM call');
            process.exit(0);
        });


        process.on('SIGINT', async () => {
            this.logger.warn('server is terminated by SIGINT call');
            process.exit(0);
        });

        // process.on('SIGKILL',  () =>{
        //     this.logger.warn('server is terminated by SIGKILL call');
        //     this.io.close( () => {
        //         process.exit(0);
        //     });
        // });
    }

    private testInject() {
        let testInjection = this.container.get<TestInjection>(TestInjection);
        testInjection.printDebug('debug test')
        testInjection.printError('error test')
        testInjection.printInfo('info test')
    }

    public getApp(): express.Application {
        return this.app;
    }
}



