import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './components/app/app.component';
import * as JS from './core/java.services';
import {UserService} from "./core/services/data/user.service";
import {JSEventHandlerService} from "./core/services/events/js-event-handler.service";
import {EventDispatcherService} from "./core/services/events/event-dispatcher.service";
import {WebsocketEventHandlerService} from "./core/services/websockets/websocket-event-handler.service";

// bootstrap angular 2 app now!
bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    UserService,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(JS.CalculatorService, {useClass: JS.CalculatorService}),
    provide(JS.ListService, {useClass: JS.ListService}),
    provide(EventDispatcherService, {useClass: EventDispatcherService}),
    provide(JSEventHandlerService, {useClass: JSEventHandlerService}),
    provide(WebsocketEventHandlerService, {useClass: WebsocketEventHandlerService}),
]);
