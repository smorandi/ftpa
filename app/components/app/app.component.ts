import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {HomePageComponent} from "../pages/home/home-page.component";
import {DragAndDropPageComponent} from "../pages/dnd/dnd-page.component";
import {AgGridPageComponent} from "../pages/ag-grid/ag-grid-page.component";
import {JavaBridgePageComponent} from "../pages/javabridge/javabridge-page.component";
import {Subject, Observable} from "rxjs/Rx"
import {JSEventHandlerService} from "../../core/services/events/js-event-handler.service";
import {WebsocketEventHandlerService} from "../../core/services/websockets/websocket-event-handler.service";
import {JavabridgeGridPageComponent} from "../pages/javabridge-grid/javabridge-grid-page.component";

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
    {path: '/javabridgeGrid', component: JavabridgeGridPageComponent, as: 'JavabridgeGridPage'},
])

export class AppComponent {
    private socket:any;

    constructor(private jsEventHandlerService:JSEventHandlerService,
                private websocketEventHandlerService:WebsocketEventHandlerService) {
    }
}