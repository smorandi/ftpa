import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/Rx";
import * as _ from "lodash";
import * as uuid from "node-uuid";
import {IBaseDto} from "../../dto";
import {Subscription} from "rxjs/Subscription";
import {HttpClient} from "../../http/http.service";

export abstract class BaseService<T extends IBaseDto> {
    private subscription:Subscription;
    private dataBehaviorSubject:BehaviorSubject<T[]> = new BehaviorSubject([]);

    constructor(private http:HttpClient, private url?:string) {
        if (url) {
            this.setUrl(url);
        }
    }

    fetchData() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.http.get(this.url).map(res => {
            return res.json();
        }).subscribe(data => {
            this.setData(data);
        }, err => {
            this.dataBehaviorSubject.error(err);
        });
    }

    setUrl(url:string) {
        this.url = url;
        this.fetchData();
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