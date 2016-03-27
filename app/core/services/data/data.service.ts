import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Http} from "angular2/http";
import {BehaviorSubject} from "rxjs/Rx";
import {IUser, User} from "../../dto";

@Injectable()
export class DataService {
    private data:BehaviorSubject<IUser[]> = new BehaviorSubject([]);

    constructor(private http:Http) {
        for (var i = 0; i < 1000; i++) {
            var user:User = new User(""+i, "der", "fisch", "der_fisch", "xxx");
            this.data.getValue().push(user);
        }
    }

    getData():Observable<IUser[]> {
        return this.data.asObservable();
    }

    addData(data:IUser) {
        this.data.getValue().push(data);
        this.data.next(this.data.getValue());
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