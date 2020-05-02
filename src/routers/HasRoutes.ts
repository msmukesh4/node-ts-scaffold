import {Router} from "express";

export interface HasRoutes{
    getRoutes(): Router;
}