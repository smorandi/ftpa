import {Component, OnInit, OnDestroy} from "angular2/core";
import {PageHeader} from "../../page-header/page-header.component";
import {ComponentInstruction, CanActivate} from 'angular2/router';
import {LoginService} from "../../../core/services/login/login.service";
import {checkLoggedIn} from "../../../core/services/login/check-logged-in";

@Component({
    selector: 'ftpa-home-page',
    moduleId: __moduleName,
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css'],
    directives: [PageHeader]
})
@CanActivate((next:ComponentInstruction, previous:ComponentInstruction) => checkLoggedIn(next, previous))
export class HomePageComponent implements OnInit, OnDestroy {
    constructor(private loginService:LoginService) {
        console.log(__moduleName + " constructor()");
    }

    ngOnInit() {
        console.log(__moduleName + " ngOnInit()");
    }

    ngOnDestroy() {
        console.log(__moduleName + " ngOnDestroy()");
    }
}