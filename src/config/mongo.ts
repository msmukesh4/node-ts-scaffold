import config from './config'
import { injectable } from 'inversify'
import * as log4js from 'log4js';
import { Connection, createConnection, Model, set } from 'mongoose';
import { BaseModel } from '../models/mongo/baseModel';

const DB_CONFIG = config.get('mongo');
const DB_MONGO_CONNECTION =  DB_CONFIG.host.includes('localhost') ? 
    `mongodb://${DB_CONFIG.host}/${DB_CONFIG.dbname}` : 
    `mongodb://${DB_CONFIG.username}:${DB_CONFIG.password}@${DB_CONFIG.host}/${DB_CONFIG.dbname}?${DB_CONFIG.params}`

@injectable()
export class MongoService {
    public readonly _connection: any;
    private _models: { [key: string]: BaseModel<any> } = {};
    private logger: log4js.Logger;

    constructor() {
        this.logger = log4js.getLogger('MongoService');
        this.logger.level = config.get('logging').level;
        try {
            this.logger.debug(DB_MONGO_CONNECTION);
            // set('debug', true);
            this._connection = createConnection(
                DB_MONGO_CONNECTION, 
                { useNewUrlParser: true, useUnifiedTopology: true }
            );
            this.logger.debug('MongoService: ', 'Connected');
        } catch (e) {
            this.logger.error('MongoService: ', e);
        }
    }

    get connection(): Connection {
        return this._connection;
    }

    setModels(...args: any[]) {
        args.forEach((model) => {
            const _model = new model(this._connection);
            this._models[_model.id] = _model;
        });
    }

    getModel(id: string): Model<any> {
        if (!id || !this._models.hasOwnProperty(id)) {
            throw new Error(`Id is not defined or model doesn't exist [${id}]`);
        }

        return this._models[id].getModel();
    }
}