import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {IHobby, IUser} from "../../dto";
import {BaseService} from "./base.service";

@Injectable()
export class HobbyService extends BaseService<IHobby> {
    static baseUrl:string = "http://localhost:3000/api/users/";

    constructor(http:Http) {
        super(http);
    }

    fetchDataForUser(user:IUser):void {
        let url = HobbyService.baseUrl + "/" + user.id + "/hobbies";
        super.setUrl(url);
    }
}