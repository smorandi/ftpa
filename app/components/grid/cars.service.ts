import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Http} from "angular2/http";
import {ICar, Car} from "../../core/dto";

import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {Subject} from "rxjs/Subject";

@Injectable()
export class CarsService {
    private _carsSource = new Subject<Car[]>();

    cars$:Observable<Car[]>;

    // cars$:Observable<ICar[]>;
    // private _carsObserver:Observer<ICar[]>;
    // private _dataStore:{
    //     cars:ICar[]
    // };

    constructor(private _http:Http) {
        console.log(_http);
        this.cars$ = this._carsSource.asObservable();
    }

    loadCars() {
        var cars =
            [new Car("1", "asd", "asd", "asd", "55"),
                new Car("2", "asd", "asd", "asd", "55"),
                new Car("3", "asd", "asd", "asd", "55")];

        this._carsSource.next(cars);


        // this._http.get('/api/cars').map(response => response.json()).subscribe(data => {
        //     // Update data store
        //     this._dataStore.cars = data;
        //     // Push the new list of cars into the Observable stream
        //     this._carsObserver.next(this._dataStore.cars);
        // }, error => console.error('Could not load cars.'));
    }

    // createCar(car:ICar) {
    //     this._http.post('/api/cars', JSON.stringify(car))
    //         .map(response => response.json()).subscribe(data => {
    //         this._dataStore.cars.push(data);
    //         this._carsObserver.next(this._dataStore.cars);
    //     }, error => console.error('Could not create car.'));
    // }
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