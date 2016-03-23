import {Component, ViewEncapsulation, AfterViewInit} from 'angular2/core';
import {
    RouteConfig,
    ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomeComponent} from '../home/home.component';
import {ContactComponent} from '../contact/contact.component';
import {DragAndDropComponent} from "../dnd/dnd.component";
import {JavaBridgeComponent} from "../javabridge/javabridge.component";
import {MegaMenu, PanelMenu} from 'primeng/primeng';
import {GridComponent} from "../grid/grid.component";

@Component({
    selector: 'app',
    moduleId: __moduleName,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/', component: HomeComponent, as: 'Home', useAsDefault: true},
    {path: '/contact', component: ContactComponent, as: 'Contact'},
    {path: '/dnd', component: DragAndDropComponent, as: 'DragAndDrop'},
    {path: '/javabridge', component: JavaBridgeComponent, as: 'JavaBridge'},
    {path: '/grid', component: GridComponent, as: 'Grid'}
])

export class AppComponent implements AfterViewInit {

    ngAfterViewInit() {
        $("#leftside-navigation .sub-menu > a").click(function (e) {
            $("#leftside-navigation ul ul").slideUp(), $(this).next().is(":visible") || $(this).next().slideDown(),
                e.stopPropagation()
        })
    }
}