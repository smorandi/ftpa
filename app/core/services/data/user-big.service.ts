import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Http} from "angular2/http";
import {BehaviorSubject} from "rxjs/Rx";
import {IUser, User} from "../../dto";
import * as _ from 'lodash';
import * as uuid from 'node-uuid';
import RefData from "../../refData";

@Injectable()
export class UserService_Big {
    static url:string = "http://localhost:3000/api/users/big";
    private dataBehaviorSubject:BehaviorSubject<IUser[]> = new BehaviorSubject([]);

    constructor(private http:Http) {
        this.http.get(UserService_Big.url).map(res => {
            return res.json();
        }).subscribe(data => {
            this.setUsers(data);
            console.log(data);
        });
    }

    createRandomUsers(nb:number):IUser[] {
        var users:IUser[] = [];
        for (var i = 0; i < nb; i++) {
            var user:IUser = this.createRandomUser();
            users.push(user);
        }
        return users;
    }

    createRandomUser():IUser {
        var user:User = new User();

        user.id = uuid.v4().toString();
        user.firstname = _.sample(RefData.firstNames);
        user.lastname = _.sample(RefData.lastNames);
        user.loginname = user.firstname + "_" + user.lastname;
        user.password = window.btoa(user.loginname);
        user.age = _.random(20, 60);

        return user;
    }

    setUsers(users:IUser[]) {
        var arr = this.dataBehaviorSubject.getValue();
        arr.length = 0;
        arr.push.apply(arr, users);
        this.dataBehaviorSubject.next(arr);
    }

    getData():Observable<IUser[]> {
        return this.dataBehaviorSubject.asObservable();
    }

    addData(data:IUser) {
        var arr = this.dataBehaviorSubject.getValue();
        data.id = uuid.v4().toString();
        arr.unshift(data);
        this.dataBehaviorSubject.next(arr);
    }

    updateData(data:IUser) {
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