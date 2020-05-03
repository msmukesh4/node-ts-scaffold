import {Request, Response} from "express";

export interface ExtendedRequest extends Request{
    params: any;
    query: any;
    body: any;
    file: any
}

export interface ExtendedResponse extends Response{
    success(data: any): Promise<any>;
    fail(err: string): any;
    json(data: any): any;
    entityNotFound(msg: string): any;
    respondError(msg: any) : any;
    wrongInput(msg: string): any;
    unauth(msg: any): any;
}