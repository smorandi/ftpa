import {Component, View} from 'angular2/core';
import {PageHeader} from "../../page-header/page-header.component";

@Component({
    selector: 'ftpa-home-page',
    moduleId: __moduleName,
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css'],
    directives: [PageHeader]
})
export class HomePageComponent {
    constructor() {
        console.log("home-page instantiated");
    }
}
