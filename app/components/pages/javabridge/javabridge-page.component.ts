import {Component, NgZone, OnInit} from 'angular2/core';
import {PageHeader} from "../../page-header/page-header.component";
import {CalculatorService, ListService} from "../../../core/java.services";

@Component({
    selector: 'ftpa-javabridge-page',
    moduleId: __moduleName,
    templateUrl: 'javabridge-page.component.html',
    styleUrls: ['javabridge-page.component.css'],
    directives: [PageHeader]
})
export class JavaBridgePageComponent {
    list:string[] = ["entry1", "entry2"];
    number1:number = 0;
    number2:number = 2;
    sum:number = 0;

    constructor(private calculatorService:CalculatorService, private listService:ListService) {
    }

    recalc() {
        this.sum = this.calculatorService.sum(this.number1, this.number2);
    }

    updateList() {
        console.log("updateList()");
        this.list = ["loading..."];
        this.listService.loadList(data => {
            console.log(JSON.stringify(data));
            this.list = data;
        });
    }
}