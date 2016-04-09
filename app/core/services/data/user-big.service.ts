import {Injectable} from 'angular2/core';
import {IUser} from "../../dto";
import {BaseService} from "./base.service";
import {HttpClient} from "../../http/http.service";

@Injectable()
export class UserService_Big extends BaseService<IUser> {
    static url:string = "http://localhost:3000/api/users/";

    constructor(http:HttpClient) {
        super(http, UserService_Big.url);
    }
}