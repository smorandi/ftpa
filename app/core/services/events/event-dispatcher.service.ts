import {Injectable, NgZone} from "angular2/core";
import {EventHandlerService} from "../../java.services";
import {WebsocketEventHandlerService} from "../websockets/websocket-event-handler.service";
import {IEventDto} from "../../dto";

@Injectable()
export class EventDispatcherService{
    constructor(private webSocketService:WebsocketEventHandlerService,
                private eventHandlerService:EventHandlerService) {
    }

    dispatch(dto:IEventDto) {
        let json = JSON.stringify(dto);

        console.log("EventDispatcherService: dispatching on java-service");
        this.eventHandlerService.handle(json);
        
        console.log("EventDispatcherService: dispatching on web-socket");
        this.webSocketService.dispatch(json);
    }
}