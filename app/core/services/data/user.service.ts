import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Http} from "angular2/http";
import {BehaviorSubject} from "rxjs/Rx";
import {IUser, User} from "../../dto";
import * as _ from 'lodash';
import * as uuid from 'node-uuid';
import RefData from "../../refData";

@Injectable()
export class UserService {
    private dataBehaviorSubject:BehaviorSubject<IUser[]> = new BehaviorSubject([]);

    constructor(private http:Http) {
        for (var i = 0; i < 10000; i++) {
            var user:IUser = this.createRandomUser();
            this.dataBehaviorSubject.getValue().push(user);
        }
    }

    createRandomUser():IUser {
        var user:User = new User();

        user.id = uuid.v4().toString();
        user.firstName = _.sample(RefData.firstNames);
        user.lastName = _.sample(RefData.lastNames);
        user.loginName = user.firstName + "_" + user.lastName;
        user.password = window.btoa(user.loginName);
        user.age = _.random(20, 60);

        return user;
    }

    getData():Observable<IUser[]> {
        return this.dataBehaviorSubject.asObservable();
    }

    addData(data:IUser) {
        var arr = this.dataBehaviorSubject.getValue();
        data.id = uuid.v4().toString();
        arr.push(data);
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

    //
    // updateCar(car:ICar) {
    //     this._http.put(`/api/cars/${car.id}`, JSON.stringify(car))
    //         .map(response => response.json()).subscribe(data => {
    //         this._dataStore.cars.forEach((car, i) => {
    //             if (car.id === data.id) {
    //                 this._dataStore.cars[i] = data;
    //             }
    //         });
    //
    //         this._carsObserver.next(this._dataStore.cars);
    //     }, error => console.error('Could not update car.'));
    // }
    //
    // deleteCar(carId:string) {
    //     this._http.delete(`/api/cars/${carId}`).subscribe(response => {
    //         this._dataStore.cars.forEach((t, index) => {
    //             if (t.id === carId) {
    //                 this._dataStore.cars.splice(index, 1);
    //             }
    //         });
    //
    //         this._carsObserver.next(this._dataStore.cars);
    //     }, error => console.error('Could not delete car.'));
    // }
}