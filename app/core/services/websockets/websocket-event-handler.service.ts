import {Subject, BehaviorSubject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable, NgZone} from "angular2/core";
import {IEventDto} from "../../dto";

@Injectable()
export class WebsocketEventHandlerService {
    private ws_url:string = "http://localhost:3000";
    private ws_channel:string = "ws-java-events";
    private socket:any;
    private eventsSubject:BehaviorSubject<IEventDto[]> = new BehaviorSubject<IEventDto[]>([]);

    constructor(private zone:NgZone) {
        console.log("registering websocket @ " + this.ws_url);
        this.socket = io(this.ws_url);

        console.log("listening on channel " + this.ws_channel);
        this.socket.on(this.ws_channel, json => {
            this.handle(json);
        });
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