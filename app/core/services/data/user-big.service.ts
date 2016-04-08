import {Injectable} from 'angular2/core';
import {Http} from "angular2/http";
import {IUser} from "../../dto";
import {BaseService} from "./base.service";

@Injectable()
export class UserService_Big extends BaseService<IUser> {
    static url:string = "http://localhost:3000/api/users/";

    constructor(http:Http) {
        super(http, UserService_Big.url);
    }
}