import {Component, OnInit, OnDestroy} from "angular2/core";
import {ComponentInstruction, CanActivate} from "angular2/router";
import {PageHeader} from "../../page-header/page-header.component";
import {checkLoggedIn} from "../../../core/services/login/check-logged-in";
import {LoggingService} from "../../../core/java.services";
import {Button} from "primeng/primeng";

// only import this if you are using the ag-Grid-Enterprise

@Component({
    selector: 'ftpa-logging-page',
    moduleId: __moduleName,
    templateUrl: 'logging.component.html',
    styleUrls: ['logging.component.css'],
    directives: [PageHeader, Button]
})
@CanActivate((next:ComponentInstruction, previous:ComponentInstruction) => checkLoggedIn(next, previous))
export class LoggingPageComponent implements OnInit, OnDestroy {
    constructor(private loggingService:LoggingService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    doTraceLog(event:Event):void {
        this.loggingService.trace("This is a 'trace' message");
    }
    doDebugLog(event:Event):void {
        this.loggingService.debug("This is a 'debug' message");
    }
    doInfoLog(event:Event):void {
        this.loggingService.info("This is a 'info' message");
    }
    doWarnLog(event:Event):void {
        this.loggingService.warn("This is a 'warning' message");
    }
    doErrorLog(event:Event):void {
        this.loggingService.error("This is a 'error' message");
    }
}