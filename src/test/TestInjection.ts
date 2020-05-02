import log4js from 'log4js'
import {injectable} from 'inversify';

@injectable()
export class TestInjection {

    private logger  : log4js.Logger

    constructor(){
        this.logger = log4js.getLogger('TestInjection');
    }


    public printDebug(data : String){
        this.logger.debug(data)
    }

    public printError(data : String){
        this.logger.error(data)
    }

    public printInfo(data : String){
        this.logger.info(data)
    }
}