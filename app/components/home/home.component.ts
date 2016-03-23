import {Component} from 'angular2/core';
import {PageHeader} from "../page-header/page-header.component";

@Component({
  selector: 'home',
  moduleId: __moduleName,
  templateUrl: 'home.component.html',
  directives: [PageHeader]
})
export class HomeComponent {}
