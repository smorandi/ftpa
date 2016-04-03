import {Subject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable, NgZone} from "angular2/core";
import {ServiceBase} from "../../java.services";
import {JavaEventHandlerService} from "./java-event-handler.service";

@Injectable()
export class EventDispatcherService extends ServiceBase<EventDispatcherService>{
    constructor(private zone:NgZone) {
        super(JavaEventHandlerService.SERVICE_NAME);
    }

    dispatch(data:string) {
        if (this.hasWindowService) {
            let json = JSON.stringify(data);
            return this.windowService[JavaEventHandlerService.SERVICE_METHOD](json);
        }
        else {
            console.error("no window service available");
        }
    }
}