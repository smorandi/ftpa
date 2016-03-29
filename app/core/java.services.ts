import {Injectable, NgZone} from 'angular2/core';

export interface IJavaService {
}


// calculator services...
interface ICalculatorService extends IJavaService {
    sum(number1:number, number2:number):number;
}

export abstract class ServiceBase<T> implements IJavaService {
    public windowService:T;
    public hasWindowService:boolean;

    constructor(private serviceName:string) {
        this.windowService = window[serviceName];
        this.hasWindowService = this.windowService ? true : false;
        console.log("hasWindowService for " + this.serviceName + " : " + this.hasWindowService);
    }
}


@Injectable()
export class CalculatorService extends ServiceBase<ICalculatorService> implements ICalculatorService {
    static SERVICE_NAME = "calculatorService";

    constructor() {
        super(CalculatorService.SERVICE_NAME);
    }

    sum(number1:number, number2:number):number {
        if (this.hasWindowService) {
            return this.windowService.sum(number1, number2);
        }
        else {
            return number1 + number2;
        }
    }
}

// list services...
interface IListService extends IJavaService {
    loadList(cb:(data:string[])=>void):void;
}

@Injectable()
export class ListService extends ServiceBase<IListService> implements IListService {
    static SERVICE_NAME = "listService";

    constructor(private zone:NgZone) {
        super(ListService.SERVICE_NAME);
    }

    loadList(cb:(data:string[])=>void):void {
        console.log("load list");
        if (this.hasWindowService) {
            var wrap:any = {
                cb: json => {
                    this.zone.run(() => cb.call(this, JSON.parse(json)));
                }
            }

            this.windowService.loadList(wrap);
        }
        else {
            setTimeout(() => {
                cb.call(this, ["1", "2", "3"]);
            }, 1000);
        }
    }
}