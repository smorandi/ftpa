import {Component, View} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {HttpClient} from "../../../core/http/http.service";
import {CredentialsService} from "../../../core/java.services";
import {PageHeader} from "../../page-header/page-header.component";

@Component({
    selector: "ftpa-login-page",
    moduleId: __moduleName,
    templateUrl: 'login-page.component.html',
    styleUrls: ['login-page.component.css'],
    directives: [PageHeader, RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
})
export class LoginPageComponent {
    constructor(public router:Router, public http:HttpClient, private credentialsService:CredentialsService) {
    }

    public login(event, username, password) {
        //prevents the router to reload the page...
        event.preventDefault();
        event.stopPropagation();

        this.credentialsService.setUsername(username);
        this.credentialsService.setPassword(password);
        this.router.navigateByUrl("/home");
    }
}