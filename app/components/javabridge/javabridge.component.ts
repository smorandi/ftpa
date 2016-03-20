import {Component, Input, Output, NgZone, OnInit} from 'angular2/core';
import {ACalculatorService, AFruitsService} from '../../core/java.services';

@Component({
    selector: 'javabridge',
    moduleId: __moduleName,
    templateUrl: 'javabridge.component.html'
})
export class JavaBridgeComponent {
    fruits:string[] = ["t1", "t2"];

    constructor(private calculatorService:ACalculatorService, private fruitsService:AFruitsService, private ngZone:NgZone) {
    }

    // calculator
    number1:number = 0;
    number2:number = 2;
    sum:number = 0;

    recalc() {
        this.sum = this.calculatorService.sum(this.number1, this.number2);
    }

    updateFruits() {
        console.log("updateFruits()");
        this.fruits = ["loading..."];
        this.fruitsService.loadFruits(data => {
            console.log(JSON.stringify(data));
            this.fruits = data;
        });
    }
}