import {Subject, BehaviorSubject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable, NgZone} from "angular2/core";
import {IEventDto} from "../../dto";
import {CredentialsService} from "../../java.services";

@Injectable()
export class WebsocketEventHandlerService {
    private ws_url:string = "http://localhost:3000";
    private wsJavaEventChannel:string = "ws-java-events";
    private wsJSEventChannel:string = "ws-js-events";
    public socket:any;

    private javaEventsSubject:Subject<IEventDto> = new Subject<IEventDto>();
    private jsEventsSubject:Subject<IEventDto> = new Subject<IEventDto>();

    constructor(private zone:NgZone,
                private credentialsService:CredentialsService) {
        console.log("registering websocket @ " + this.ws_url);
        this.socket = io(this.ws_url, {autoConnect: false});
        this.socket.on('connect', () => {
            this.socket.emit('authentication', JSON.stringify({
                username: this.credentialsService.getUsername(),
                password: this.credentialsService.getPassword()
            }));
            this.socket.on('authenticated', () => {
                this.socket.authenticated = true;
                console.log("listening on channel " + this.wsJavaEventChannel);
                this.socket.on(this.wsJavaEventChannel, json => {
                    this.handleJavaEvent(json);
                });

                console.log("listening on channel " + this.wsJSEventChannel);
                this.socket.on(this.wsJSEventChannel, json => {
                    this.handleJSEvent(json);
                });
            });
            this.socket.on('unauthorized', err => {
                console.log("There was an error with the ws-authentication: " + err.message);
            });
        });
        this.socket.on("connect_error", err => {
            console.log("socket connect error: " + err.message);
        });
        this.socket.on("disconnect", () => {
            console.log("socket disconnected");
            this.socket.authenticated = false;
        });
    }

    public connect():void {
        this.socket.connect();
    }

    public disconnect():void {
        this.socket.disconnect();
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