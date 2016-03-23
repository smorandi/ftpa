import {Component, AfterViewInit} from 'angular2/core';
import {
    RouteConfig,
    ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomeComponent} from '../home/home.component';
import {ContactComponent} from '../contact/contact.component';
import {DragAndDropComponent} from "../dnd/dnd.component";
import {JavaBridgeComponent} from "../javabridge/javabridge.component";
import {PanelMenu} from 'primeng/primeng';
import {GridComponent} from "../grid/grid.component";
import {PageHeader} from "../page-header/page-header.component";

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

    onClick() {
        $('.hamburger').click();
    }

    private hamburgerCross() {
        var trigger = $('.hamburger'),
            overlay = $('.overlay');

        var isClosed = trigger.hasClass("is-open");

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
        }
    }

    ngAfterViewInit() {
        var trigger = $('.hamburger'),
            overlay = $('.overlay'),
            isClosed = false;

        trigger.click(() => {
            this.hamburgerCross();
        });

        $('[data-toggle="offcanvas"]').click(() => {
            $('#wrapper').toggleClass('toggled');
        });
    }
}