import {Subject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable, NgZone} from "angular2/core";
import {ServiceBase} from "../../java.services";
import {JavaEventHandlerService} from "./java-event-handler.service";
import {WebsocketEventHandlerService} from "../websockets/websocket-event-handler.service";
import {IEventDto} from "../../dto";

@Injectable()
export class EventDispatcherService extends ServiceBase<EventDispatcherService>{
    constructor(private zone:NgZone, private webSocketService:WebsocketEventHandlerService) {
        super(JavaEventHandlerService.SERVICE_NAME);
    }

    dispatch(dto:IEventDto) {
        if (this.hasWindowService) {
            let json = JSON.stringify(dto);
            this.windowService[JavaEventHandlerService.SERVICE_METHOD](json);
        }
        else {
            console.log("no window service available");
        }

        this.webSocketService.dispatch(dto);
    }
}