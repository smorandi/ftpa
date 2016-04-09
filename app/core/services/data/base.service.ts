import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/Rx";
import * as _ from "lodash";
import * as uuid from "node-uuid";
import {IBaseDto} from "../../dto";
import {Subscription} from "rxjs/Subscription";
import {HttpClient} from "../../http/http.service";

export abstract class BaseService<T extends IBaseDto> {
    constructor(public http:HttpClient, private url?:string) {
        if (url) {
            this.setUrl(url);
        }
    }

    setUrl(url:string) {
        this.url = url;
    }

    setData(users:T[]) {
    }

    getData():Observable<T[]> {
        return this.http.get(this.url).map(res => {
            return res.json();
        });
    }

    addData(data:T) {
    }

    updateData(data:T) {
    }

    deleteData(ids:string[]) {
    }
}