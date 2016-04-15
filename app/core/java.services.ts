import {Injectable, NgZone} from 'angular2/core';

interface IJavaService {
    serviceName:string;
}

export abstract class ServiceBase<T> implements IJavaService {
    public windowService:T;
    public hasWindowService:boolean;

    constructor(public serviceName:string) {
        this.windowService = window[this.serviceName];
        this.hasWindowService = this.windowService ? true : false;
        console.log("hasWindowService for " + this.serviceName + " : " + this.hasWindowService);
    }
}

// calculator services...
interface ICalculatorService extends IJavaService {
    sum(number1:number, number2:number):number;
}

@Injectable()
export class CalculatorService extends ServiceBase<ICalculatorService> implements ICalculatorService {
    static SERVICE_NAME = "ftpa-calculator-service";

    constructor() {
        super(CalculatorService.SERVICE_NAME);
    }

    sum(number1:number, number2:number):number {
        return this.hasWindowService ? this.windowService.sum(number1, number2) : number1 + number2;
    }
}

// list services...
interface IListService extends IJavaService {
    loadList(cb:(data:string[])=>void):void;
}

@Injectable()
export class ListService extends ServiceBase<IListService> implements IListService {
    static SERVICE_NAME = "ftpa-list-service";

    constructor(private zone:NgZone) {
        super(ListService.SERVICE_NAME);
    }

    loadList(cb:(data:string[])=>void):void {
        console.log("load list");
        if (this.hasWindowService) {
            let wrap:any = {
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


// event-handler service...
interface IEventHandlerService extends IJavaService {
    handle(json:string):void;
}

@Injectable()
export class EventHandlerService extends ServiceBase<IEventHandlerService> implements IEventHandlerService {
    static SERVICE_NAME:string = "ftpa-java-event-handler-service";

    constructor() {
        super(EventHandlerService.SERVICE_NAME);
    }

    handle(json:string):void {
        if (this.hasWindowService) {
            this.windowService.handle(json);
        }
        else {
            console.log("no window-service available");
        }
    }
}

// credentials service...
interface ICredentialsService extends IJavaService {
    getUsername():string;
    getPassword():string;
}


@Injectable()
export class CredentialsService extends ServiceBase<ICredentialsService> implements ICredentialsService {
    static SERVICE_NAME = "ftpa-credentials-service";
    public username:string = null;
    public password:string = null;

    constructor() {
        super(CredentialsService.SERVICE_NAME);
        this.initializeFromWindowService();
    }

    public initializeFromWindowService():void {
        if (this.hasWindowService) {
            this.username = this.windowService.getUsername();
            this.password = this.windowService.getPassword();
        }
    }

    public setUsername(username:string):void {
        this.username = username;
    }

    public setPassword(password:string):void {
        this.password = password;
    }

    public getUsername():string {
        return this.username;
    }

    public getPassword():string {
        return this.password;
    }
    
    public clear():void {
        this.username = null;
        this.password = null;
    }
}