import {Component, AfterViewInit} from 'angular2/core';
import {
    RouteConfig,
    ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomePageComponent} from "../pages/home/home-page.component";
import {DragAndDropPageComponent} from "../pages/dnd/dnd-page.component";
import {AgGridPageComponent} from "../pages/ag-grid/ag-grid-page.component";
import {SlickGridPageComponent} from "../pages/slick-grid/slick-grid-page.component";
import {JavaBridgePageComponent} from "../pages/javabridge/javabridge-page.component";

@Component({
    selector: 'app',
    moduleId: __moduleName,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/', component: HomePageComponent, as: 'HomePage', useAsDefault: true},
    {path: '/dnd', component: DragAndDropPageComponent, as: 'DragAndDropPage'},
    {path: '/javabridge', component: JavaBridgePageComponent, as: 'JavaBridgePage'},
    {path: '/agGrid', component: AgGridPageComponent, as: 'AgGridPage'},
    {path: '/slickGrid', component: SlickGridPageComponent, as: 'SlickGridPage'},
])

export class AppComponent {
}