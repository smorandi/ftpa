import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {HomePageComponent} from "../pages/home/home-page.component";
import {DragAndDropPageComponent} from "../pages/dnd/dnd-page.component";
import {AgGridPageComponent} from "../pages/ag-grid/ag-grid-page.component";
import {JavaBridgePageComponent} from "../pages/javabridge/javabridge-page.component";
import {JSEventHandlerService} from "../../core/services/events/js-event-handler.service";
import {WebsocketEventHandlerService} from "../../core/services/websockets/websocket-event-handler.service";
import {JavabridgeGridPageComponent} from "../pages/javabridge-grid/javabridge-grid-page.component";
import {HobbyGridPageComponent} from "../pages/hobby-grid/hobby-grid-page.component";
import {LoginPageComponent} from "../pages/login/login-page.component";
import {LoginInfoComponent} from "../login-info/login-info.component";
import {ErrorInfoComponent} from "../error-info/error-info.component";

@Component({
    selector: 'app',
    moduleId: __moduleName,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, LoginInfoComponent, ErrorInfoComponent]
})
@RouteConfig([
    {path: '/', redirectTo: ['/HomePage'], useAsDefault: true},
    {path: '/home', component: HomePageComponent, as: 'HomePage'},
    {path: '/login', component: LoginPageComponent, as: 'LoginPage'},
    {path: '/dnd', component: DragAndDropPageComponent, as: 'DragAndDropPage'},
    {path: '/javabridge', component: JavaBridgePageComponent, as: 'JavaBridgePage'},
    {path: '/agGrid', component: AgGridPageComponent, as: 'AgGridPage'},
    {path: '/javabridgeGrid', component: JavabridgeGridPageComponent, as: 'JavabridgeGridPage'},
    {path: '/hobbyGrid', component: HobbyGridPageComponent, as: 'HobbyGridPage'},
])

export class AppComponent {
    constructor(private jsEventHandlerService:JSEventHandlerService,
                private websocketEventHandlerService:WebsocketEventHandlerService) {
    }
}