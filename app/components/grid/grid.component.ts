import {Component} from "angular2/core";
import {DataTable, Column, Menubar, Header, Footer, Dialog, Button, InputText} from "primeng/primeng";
import {ICar, Car} from "../../core/dto";
import {CarsService} from "./cars.service";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions} from 'ag-grid/main';

@Component({
    selector: 'grid',
    moduleId: __moduleName,
    templateUrl: 'grid.component.html',
    directives: [DataTable, Column, Header, Footer, Dialog, Button, InputText, Menubar],
})
export class GridComponent {
    displayDialog: boolean;

    car: ICar = new Car();

    selectedCar: ICar;

    newCar: boolean;

    cars:ICar[];

    constructor(private carsService:CarsService) {
    }

    ngOnInit() {
        this.carsService.getCars().subscribe(cars => {
            this.cars = cars;
        });
    }

    showDialogToAdd() {
        this.newCar = true;
        this.car = new Car();
        this.displayDialog = true;
    }

    save() {
        if(this.newCar) {
            this.carsService.addCar(this.car);
        }
        // else
        //     this.carsService.updateCar(this.car);

        this.car = null;
        this.displayDialog = false;
    }

    delete() {
        this.cars.splice(this.findSelectedCarIndex(), 1);
        this.car = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newCar = false;
        this.car = this.cloneCar(event.data);
        this.displayDialog = true;
    }

    cloneCar(c: Car): Car {
        let car = new Car();
        for(let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }

    findSelectedCarIndex(): number {
        return this.cars.indexOf(this.selectedCar);
    }
}