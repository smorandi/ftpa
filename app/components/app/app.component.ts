import {Component, OnInit, OnDestroy, HostBinding} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES, OnActivate, ComponentInstruction} from "angular2/router";
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
import {CredentialsService} from "../../core/java.services";
import {LoginService} from "../../core/services/login/login.service";
import {PopupsPageComponent} from "../pages/popups/popups.component";
import {Subscription, Observable} from "rxjs/Rx";
import {IEventDto} from "../../core/dto";

@Component({
    selector: 'app',
    moduleId: __moduleName,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES, LoginInfoComponent, ErrorInfoComponent]
})
@RouteConfig([
    {path: '/', redirectTo: ['/HomePage']},
    {path: '/login', component: LoginPageComponent, as: 'LoginPage'},
    {path: '/home', component: HomePageComponent, as: 'HomePage'},
    {path: '/dnd', component: DragAndDropPageComponent, as: 'DragAndDropPage'},
    {path: '/javabridge', component: JavaBridgePageComponent, as: 'JavaBridgePage'},
    {path: '/agGrid', component: AgGridPageComponent, as: 'AgGridPage'},
    {path: '/javabridgeGrid', component: JavabridgeGridPageComponent, as: 'JavabridgeGridPage'},
    {path: '/hobbyGrid', component: HobbyGridPageComponent, as: 'HobbyGridPage'},
    {path: '/popupsGrid', component: PopupsPageComponent, as: 'PopupsPage'},
])

export class AppComponent implements OnInit, OnDestroy {
    private wsEventsSubscription:Subscription;

    private theme_dark = {
        app: "app/assets/css/theme/dark/theme-app.css",
        scrollbar: "app/assets/css/theme/dark/theme-scrollbar.css",
        grid: "app/assets/css/theme/dark/theme-ag-ftpa.css"
    };
    private theme_default = {
        app: "app/assets/css/theme/default/theme-app.css",
        scrollbar: "app/assets/css/theme/default/theme-scrollbar.css",
        grid: "app/assets/css/theme/default/theme-ag-ftpa.css"
    };
    private currentTheme = this.theme_dark;

    constructor(private jsEventHandlerService:JSEventHandlerService,
                private webSocketEventHandlerService:WebsocketEventHandlerService,
                private credentialsService:CredentialsService,
                private loginService:LoginService) {
    }

    ngOnInit() {
        if (this.credentialsService.hasWindowService) {
            this.credentialsService.initializeFromWindowService();
        }
        else {
            this.credentialsService.setUsername("ftpa");
            this.credentialsService.setPassword("test");
        }

        let wsJsEvents:Observable<IEventDto> = this.webSocketEventHandlerService.getJSEvents();
        let wsJavaEvents:Observable<IEventDto> = this.webSocketEventHandlerService.getJavaEvents();

        this.wsEventsSubscription = wsJsEvents.merge(wsJavaEvents).subscribe(event => {
            if (event.type === "ftpa-theme-event") {
                this.currentTheme = this.currentTheme === this.theme_dark ? this.theme_default : this.theme_dark;
            }
        });
    }

    ngOnDestroy() {
        this.wsEventsSubscription.unsubscribe();
    }
}