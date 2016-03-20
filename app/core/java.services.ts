import {Injectable, NgZone} from 'angular2/core';

export interface IJavaService {
}


// calculator services...
interface ICalculatorService extends IJavaService {
    sum(number1:number, number2:number):number;
}

export abstract class ACalculatorService implements ICalculatorService {
    abstract sum(number1:number, number2:number):number;
}

@Injectable()
export class CalculatorService extends ACalculatorService {
    sum(number1:number, number2:number):number {
        return window["calculatorService"].sum(number1, number2);
    }
}

@Injectable()
export class CalculatorServiceMock extends ACalculatorService {
    sum(number1:number, number2:number):number {
        return number1 + number2;
    }
}

// fruits services...
interface IFruitsService extends IJavaService {
    loadFruits(cb:(data:string[])=>void):void;
}

export abstract class AFruitsService implements IFruitsService {
    abstract loadFruits(cb:(data:string[])=>void):void;
}

@Injectable()
export class FruitsService extends AFruitsService {
    constructor(private zone:NgZone) {
        super();
        console.log("constructor!!");
        window["fruitsService"].loadFruits(data => console.log("fishy"));
    }

    loadFruits(cb:(data:string[])=>void):void {

        console.log("load fruits");

        var wrap = {
            cb: json => {
                this.zone.run(() => {
                    cb.call(this, JSON.parse(json));
                });
            }
        }

        window["fruitsService"].loadFruits(wrap);
    }
}

@Injectable()
export class FruitsServiceMock extends AFruitsService {
    loadFruits(cb:(data:string[])=>void):void {
        setTimeout(() => {
            cb.call(this, ["1", "2", "3"]);
        }, 1000);
    }
}