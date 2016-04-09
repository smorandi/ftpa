import {Component, Input} from 'angular2/core';

@Component({
    selector: 'page-header',
    moduleId: __moduleName,
    templateUrl: 'page-header.component.html',
    styleUrls: ['page-header.component.css']
})
export class PageHeader {
    @Input()
    title: string;
    @Input()
    subtitle: string;

    constructor(){
    }
}
