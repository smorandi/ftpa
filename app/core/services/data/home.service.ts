import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {IUser, User} from "../../dto";
import {BaseService} from "./base.service";
import {HttpClient} from "../../http/http.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class HomeService {
    static url:string = "http://localhost:3000/api/home";

    constructor(private http:HttpClient) {
    }

    getData():Observable<IUser> {
        return this.http.get(HomeService.url).map(res => res.json());
    }
}