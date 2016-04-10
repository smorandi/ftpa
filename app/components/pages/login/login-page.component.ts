import {Component, View} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {HttpClient} from "../../../core/http/http.service";
import {CredentialsService} from "../../../core/java.services";
import {PageHeader} from "../../page-header/page-header.component";
import {LoginService} from "../../../core/services/login/login.service";

@Component({
    selector: "ftpa-login-page",
    moduleId: __moduleName,
    templateUrl: 'login-page.component.html',
    styleUrls: ['login-page.component.css'],
    directives: [PageHeader, CORE_DIRECTIVES, FORM_DIRECTIVES],
})
export class LoginPageComponent {
    constructor(private loginService:LoginService) {
    }

    public login(event, username, password) {
        //prevents the router to reload the page...
        event.preventDefault();
        event.stopPropagation();

        this.loginService.login(username, password);
    }
}