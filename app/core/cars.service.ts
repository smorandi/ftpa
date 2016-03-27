import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Http} from "angular2/http";
import {ReplaySubject, BehaviorSubject} from "rxjs/Rx";
import {ICar, Car} from "./dto";

@Injectable()
export class CarsService {
    private cars:BehaviorSubject<ICar[]> = new BehaviorSubject([]);

    constructor(private http:Http) {
        for (var i = 0; i < 1000; i++) {
            this.cars.getValue().push(
                new Car("" + i, "asd", "asd", "asd", "55"));
        }
    }

    getCars():Observable<ICar[]> {
        return this.cars.asObservable();
    }

    addCar(car:ICar) {
        this.cars.getValue().push(car);
        this.cars.next(this.cars.getValue());
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