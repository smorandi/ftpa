import {Component, Input} from 'angular2/core';

@Component({
    selector: 'page-header',
    moduleId: __moduleName,
    templateUrl: 'page-header.component.html'
})
export class PageHeader {
    @Input()
    title: string;
}
