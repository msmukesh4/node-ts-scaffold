import {Container} from "inversify";
import "reflect-metadata";

import { TestInjection } from '../test/TestInjection'
import { MongoService } from "./mongo";
import { UserService } from "../services/UserService";

import { UserRouter } from '../routers/UserRouter'
import { UserDAO } from "../dao/UserDAO";
import { ConsistentResponseMiddleware } from "../middleware/ConsistentResponseMiddleware";


const container = new Container();

// DAO
container.bind<UserDAO>(UserDAO).to(UserDAO).inSingletonScope();

// service
container.bind<MongoService>(MongoService).to(MongoService).inSingletonScope();
container.bind<UserService>(UserService).to(UserService).inSingletonScope();

// router
container.bind<UserRouter>(UserRouter).to(UserRouter);

//extras
container.bind<TestInjection>(TestInjection).to(TestInjection).inSingletonScope();
container.bind<ConsistentResponseMiddleware>(ConsistentResponseMiddleware).to(ConsistentResponseMiddleware);

export {container};