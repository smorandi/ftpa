import {Component, Input} from 'angular2/core';
import {CredentialsService} from "../../core/java.services";
import {Router, RouterLink} from 'angular2/router';

@Component({
    selector: 'ftpa-login-info',
    moduleId: __moduleName,
    templateUrl: 'login-info.component.html',
    styleUrls: ['login-info.component.css']
})
export class LoginInfoComponent {
    constructor(private credentialsService:CredentialsService, private router:Router){
    }

    logout(event:Event):void {
        event.preventDefault();
        event.stopPropagation();

        this.credentialsService.setUsername("");
        this.credentialsService.setPassword("");
        this.credentialsService.isLoggedIn = false;
        this.router.navigateByUrl("/home");
    }
}