import {Component, ViewEncapsulation} from 'angular2/core';
import {
    RouteConfig,
    ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomeComponent} from '../home/home.component';
import {ContactComponent} from '../contact/contact.component';
import {HttpUtil} from '../../core/http.util';
import {Notification} from '../../core/dto';
import {DragAndDropComponent} from "../dnd/dnd.component";
import {JavaBridgeComponent} from "../javabridge/javabridge.component";
import {MegaMenu} from 'primeng/primeng';
import {GridComponent} from "../grid/grid.component";

@Component({
    selector: 'app',
    moduleId: __moduleName,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [MegaMenu, ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/', component: HomeComponent, as: 'Home', useAsDefault:true},
    {path: '/contact', component: ContactComponent, as: 'Contact'},
    {path: '/dnd', component: DragAndDropComponent, as: 'DragAndDrop'},
    {path: '/javabridge', component: JavaBridgeComponent, as: 'JavaBridge'},
    {path: '/grid', component: GridComponent, as: 'Grid'}
])

export class AppComponent {
    loading:boolean;

    constructor(private httpUtil:HttpUtil) {

        let numReqStarted = 0;
        let numReqCompleted = numReqStarted;

        this.httpUtil.requestNotifier.subscribe((notification:Notification) => {

            if (notification.type === 'start') {
                ++numReqStarted;
            } else if (notification.type === 'complete') {
                ++numReqCompleted;
            }

            this.loading = numReqStarted > numReqCompleted;
        });
    }
}
