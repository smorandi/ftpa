import {Component, NgZone, OnInit, OnDestroy} from 'angular2/core';
import {PageHeader} from "../../page-header/page-header.component";
import {CalculatorService, ListService} from "../../../core/java.services";
import {JSEventHandlerService} from "../../../core/services/events/js-event-handler.service";
import {EventDto} from "../../../core/dto";
import {WebsocketEventHandlerService} from "../../../core/services/websockets/websocket-event-handler.service";
import {Subscription} from "rxjs/Rx";

@Component({
    selector: 'ftpa-javabridge-page',
    moduleId: __moduleName,
    templateUrl: 'javabridge-page.component.html',
    styleUrls: ['javabridge-page.component.css'],
    directives: [PageHeader]
})
export class JavaBridgePageComponent implements OnInit, OnDestroy {
    list:string[] = ["entry1", "entry2"];
    number1:number = 0;
    number2:number = 2;
    sum:number = 0;
    javaEvents:EventDto[] = null;
    webSocketEvents:EventDto[] = null;
    private webSocketSubscription:Subscription;
    private javaSubscription:Subscription;

    constructor(private calculatorService:CalculatorService,
                private listService:ListService,
                private eventHandlerService:JSEventHandlerService,
                private webSocketEventHandlerService:WebsocketEventHandlerService) {
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

    asString(object:Object):string {
        return JSON.stringify(object, null, 2);
    }

    ngOnInit() {
        this.javaSubscription = this.eventHandlerService.getEvents().subscribe(events => {
            this.javaEvents = events;
        });
        this.webSocketSubscription = this.webSocketEventHandlerService.getEvents().subscribe(events => {
            this.webSocketEvents = events;
        });
    }

    ngOnDestroy() {
        this.javaSubscription.unsubscribe();
        this.webSocketSubscription.unsubscribe();
    }
}