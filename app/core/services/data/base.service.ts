import {Observable} from "rxjs/Observable";
import {Http, Headers, RequestOptionsArgs} from "angular2/http";
import {BehaviorSubject} from "rxjs/Rx";
import * as _ from "lodash";
import * as uuid from "node-uuid";
import {IBaseDto} from "../../dto";
import {Subscription} from "rxjs/Subscription";

export abstract class BaseService<T extends IBaseDto> {
    private subscription:Subscription;
    private dataBehaviorSubject:BehaviorSubject<T[]> = new BehaviorSubject([]);

    constructor(private http:Http, url?:string) {
        if (url) {
            this.setUrl(url);
        }
    }

    setUrl(url:string) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        var headers:Headers = new Headers();
        headers.append("Authorization", "Basic U29waGlhX0RhbHRvbjpkZXJGaXNjaA==");
        var args:RequestOptionsArgs = {headers: headers};

        this.subscription = this.http.get(url, args).map(res => {
            return res.json();
        }).subscribe(data => {
            this.setData(data);
        }, err => {
            this.dataBehaviorSubject.error(err);
        });
    }

    setData(users:T[]) {
        var arr = this.dataBehaviorSubject.getValue();
        arr.length = 0;
        arr.push.apply(arr, users);
        this.dataBehaviorSubject.next(arr);
    }

    getData():Observable<T[]> {
        return this.dataBehaviorSubject.asObservable();
    }

    addData(data:T) {
        var arr = this.dataBehaviorSubject.getValue();
        data.id = uuid.v4().toString();
        arr.unshift(data);
        this.dataBehaviorSubject.next(arr);
    }

    updateData(data:T) {
        var arr = this.dataBehaviorSubject.getValue();
        var index = _.indexOf(arr, _.find(arr, e => e.id === data.id));
        arr.splice(index, 1, data);
        this.dataBehaviorSubject.next(arr);
    }

    deleteData(ids:string[]) {
        var arr = this.dataBehaviorSubject.getValue();
        var removes = _.forEach(ids, id => _.remove(arr, e => e.id == id));
        if (!_.isEmpty(removes)) {
            this.dataBehaviorSubject.next(arr);
        }
    }
}