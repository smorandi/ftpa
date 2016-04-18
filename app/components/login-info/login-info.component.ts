import {Component, Input} from 'angular2/core';
import {CredentialsService} from "../../core/java.services";
import {Router, RouterLink} from 'angular2/router';
import {WebsocketEventHandlerService} from "../../core/services/websockets/websocket-event-handler.service";
import {LoginService} from "../../core/services/login/login.service";
import {EventDispatcherService} from "../../core/services/events/event-dispatcher.service";
import {EventDto} from "../../core/dto";

@Component({
    selector: 'ftpa-login-info',
    moduleId: __moduleName,
    templateUrl: 'login-info.component.html',
    styleUrls: ['login-info.component.css']
})
export class LoginInfoComponent {
    constructor(private loginService:LoginService,
                private credentialsService:CredentialsService,
                private wsService:WebsocketEventHandlerService,
                private eventDispatcher:EventDispatcherService) {
    }

    logout(event:Event):void {
        event.preventDefault();
        event.stopPropagation();

        this.loginService.logout();
    }

    switchTheme():void {
        let eventDto = new EventDto("ftpa-theme-event", null);
        this.eventDispatcher.dispatch(eventDto);
    }
}