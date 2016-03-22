import {Component} from 'angular2/core';
import {DataTable, Column} from 'primeng/primeng';
import {Observable} from "rxjs/Observable";
import {Car, ICar} from "../../core/dto";
import {CarsService} from "./cars.service";

@Component({
    selector: 'grid',
    moduleId: __moduleName,
    templateUrl: 'grid.component.html',
    directives: [DataTable, Column],
})
export class GridComponent {
    cars:ICar[];

    constructor(private _carsService:CarsService) {
        console.log(_carsService);
    }

    ngOnInit() {
        this._carsService.cars$.subscribe(cars => {
            this.cars = cars;
        });
        this._carsService.loadCars();
    }

    // onSubmit() {
    //     this._carsService.createCar(new Car("xxx", "asd", "asd", "asd", "55"));
    // }
    //
    // deleteTodo(todoId:string) {
    //     this._carsService.deleteCar(todoId);
    // }
}