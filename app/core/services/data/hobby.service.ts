import {Injectable} from "angular2/core";
import {IHobby, IUser} from "../../dto";
import {BaseService} from "./base.service";
import {HttpClient} from "../../http/http.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class HobbyService extends BaseService<IHobby> {
    static baseUrl:string = "http://localhost:3000/api/users/";

    constructor(http:HttpClient) {
        super(http);
    }

    fetchDataForUser(user:IUser):Observable<IHobby[]> {
        let url = HobbyService.baseUrl + "/" + user.id + "/hobbies";
        return this.http.get(url).map(res => {
            return res.json();
        })
    }
}