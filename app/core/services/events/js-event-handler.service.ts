import {Subject, BehaviorSubject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable, NgZone} from "angular2/core";
import {IEventDto} from "../../dto";

@Injectable()
export class JSEventHandlerService {
    static SERVICE_NAME:string = "ftpa-js-event-handler-service";
    static SERVICE_METHOD:string = "handle";

    private eventsSubject:BehaviorSubject<IEventDto[]> = new BehaviorSubject<IEventDto[]>([]);

    constructor(private zone:NgZone) {
        console.log("registering 'window' service as: " + JSEventHandlerService.SERVICE_NAME);
        window[JSEventHandlerService.SERVICE_NAME] = this;
    }

    getEvents():Observable<IEventDto[]> {
        return this.eventsSubject.asObservable();
    }

    handle(json:string) {
        console.log("data received: " + json);
        let eventDto:IEventDto = JSON.parse(json);

        var arr = this.eventsSubject.getValue();
        arr.length = 0;
        arr.unshift(eventDto);

        this.zone.run(() => this.eventsSubject.next(arr));
    }
}