import {Subject, BehaviorSubject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable, NgZone} from "angular2/core";
import {IEventDto} from "../../dto";

@Injectable()
export class WebsocketEventHandlerService {
    private ws_url:string = "http://localhost:3000";
    private wsJavaEventChannel:string = "ws-java-events";
    private wsJSEventChannel:string = "ws-js-events";
    private socket:any;

    private javaEventsSubject:Subject<IEventDto> = new Subject<IEventDto>();
    private jsEventsSubject:Subject<IEventDto> = new Subject<IEventDto>();

    constructor(private zone:NgZone) {
        console.log("registering websocket @ " + this.ws_url);
        this.socket = io(this.ws_url);

        console.log("listening on channel " + this.wsJavaEventChannel);
        this.socket.on(this.wsJavaEventChannel, json => {
            this.handleJavaEvent(json);
        });

        console.log("listening on channel " + this.wsJSEventChannel);
        this.socket.on(this.wsJSEventChannel, json => {
            this.handleJSEvent(json);
        });
    }

    getJavaEvents():Observable<IEventDto> {
        return this.javaEventsSubject.asObservable();
    }

    getJSEvents():Observable<IEventDto> {
        return this.jsEventsSubject.asObservable();
    }

    handleJavaEvent(json:string) {
        console.log("ws-java-event received: " + json);
        this.zone.run(() => this.javaEventsSubject.next(JSON.parse(json)));
    }

    handleJSEvent(json:string) {
        console.log("ws-js-event received: " + json);
        this.zone.run(() => this.jsEventsSubject.next(JSON.parse(json)));
    }

    dispatch(json:string) {
        console.log("dispatch to websocket: " + json);
        this.socket.emit(this.wsJSEventChannel, json);
    }
}