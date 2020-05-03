import jwt from 'jsonwebtoken'
import { injectable } from 'inversify'
import log4js from 'log4js'
import config from '../config/config'
import { ExtendedResponse } from '../utils/genericReqRes'

@injectable()
export class AuthMiddleware {

    private static readonly secretKey = "myrandomsecretkey"
    private logger: log4js.Logger

    constructor() {
        this.logger = log4js.getLogger('AuthMiddleware');
        this.logger.level = config.get('logging').level;
    }

    public async generateToken(data: any) {
        return jwt.sign({ _id: data.toString() }, AuthMiddleware.secretKey, { expiresIn: '2h' })
    }

    public authenticate = async (req, res, next) => {
        this.logger.info('cheking auth')
        try {

            const token = req.header('Authorization').replace('Bearer ', '')
            const decodedData = jwt.verify(token, AuthMiddleware.secretKey)
            req.current_user = decodedData['_id']
            next();
        } catch (error) {
            (res as ExtendedResponse).unauth("Invalid token")
        }
    }

    public async testAuth() {
        const data = "Random data"
        const token = await this.generateToken(data)
        const decodedData = jwt.verify(token, AuthMiddleware.secretKey)
        this.logger.debug(decodedData)
        this.logger.debug('token', token)
    }
}