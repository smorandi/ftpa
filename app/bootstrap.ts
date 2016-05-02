import {provide, ExceptionHandler, ComponentRef} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './components/app/app.component';
import * as Java from './core/java.services';
import {JSEventHandlerService} from "./core/services/events/js-event-handler.service";
import {EventDispatcherService} from "./core/services/events/event-dispatcher.service";
import {WebsocketEventHandlerService} from "./core/services/websockets/websocket-event-handler.service";
import {UserService} from "./core/services/data/user.service";
import {UserService_Big} from "./core/services/data/user-big.service";
import {HobbyService} from "./core/services/data/hobby.service";
import {HttpClient} from "./core/http/http.service";
import {CustomErrorHandler} from "./core/errorhandler/error-handler";
import {HomeService} from "./core/services/data/home.service";
import {LoginService} from "./core/services/login/login.service";
import {appInjector} from "./core/app-injector/app-injector";

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LoginService, {useClass: LoginService}),
    provide(CustomErrorHandler, {useClass: CustomErrorHandler}),
    provide(HttpClient, {useClass: HttpClient}),
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(UserService, {useClass: UserService}),
    provide(UserService_Big, {useClass: UserService_Big}),
    provide(HobbyService, {useClass: HobbyService}),
    provide(HomeService, {useClass: HomeService}),
    provide(EventDispatcherService, {useClass: EventDispatcherService}),
    provide(JSEventHandlerService, {useClass: JSEventHandlerService}),
    provide(WebsocketEventHandlerService, {useClass: WebsocketEventHandlerService}),
    provide(Java.CalculatorService, {useClass: Java.CalculatorService}),
    provide(Java.ListService, {useClass: Java.ListService}),
    provide(Java.CredentialsService, {useClass: Java.CredentialsService}),
    provide(Java.EventHandlerService, {useClass: Java.EventHandlerService}),
    provide(Java.ContextMenuService, {useClass: Java.ContextMenuService}),
    provide(Java.DialogService, {useClass: Java.DialogService}),
    provide(Java.LoggingService, {useClass: Java.LoggingService}),
])
    .then((appRef:ComponentRef) => {
        // store a reference to the application injector
        appInjector(appRef.injector);
    })
    .catch(err => console.error(err));