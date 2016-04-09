import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {IUser, User} from "../../dto";
import {BaseService} from "./base.service";
import {HttpClient} from "../../http/http.service";

@Injectable()
export class UserService extends BaseService<IUser>{
    static url:string = "http://localhost:3000/api/users/?size=small";

    constructor(http:HttpClient) {
        super(http, UserService.url);
    }

    // createRandomUsers(nb:number):IUser[] {
    //     var users:IUser[] = [];
    //     for (var i = 0; i < nb; i++) {
    //         var user:IUser = this.createRandomUser();
    //         users.push(user);
    //     }
    //     return users;
    // }
    //
    // createRandomUser():IUser {
    //     var user:IUser = new User();
    //
    //     user.id = uuid.v4().toString();
    //     user.firstname = _.sample(RefData.firstNames);
    //     user.lastname = _.sample(RefData.lastNames);
    //     user.loginname = user.firstname + "_" + user.lastname;
    //     user.password = window.btoa(user.loginname);
    //     user.age = _.random(20, 60);
    //
    //     return user;
    // }
}