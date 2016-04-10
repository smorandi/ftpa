import {Component, Input} from 'angular2/core';
import {CredentialsService} from "../../core/java.services";
import {Router, RouterLink} from 'angular2/router';
import {WebsocketEventHandlerService} from "../../core/services/websockets/websocket-event-handler.service";
import {LoginService} from "../../core/services/login/login.service";

@Component({
    selector: 'ftpa-login-info',
    moduleId: __moduleName,
    templateUrl: 'login-info.component.html',
    styleUrls: ['login-info.component.css']
})
export class LoginInfoComponent {
    constructor(private loginService:LoginService,
                private credentialsService:CredentialsService,
                private wsService:WebsocketEventHandlerService) {
    }

    logout(event:Event):void {
        event.preventDefault();
        event.stopPropagation();

        this.loginService.logout();
    }
}