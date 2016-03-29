import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './components/app/app.component';
import * as JS from './core/java.services';
import {CarsService} from "./core/cars.service";
import {UserService} from "./core/services/data/user.service";
import {SelectionService} from "./core/services/global/global.service";


// load the services into the window space...
var selectionService = new SelectionService();
window["ftpa-selectionService"] = selectionService;

// bootstrap angular 2 app now!
bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    CarsService,
    UserService,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(JS.CalculatorService, {useClass: JS.CalculatorService}),
    provide(JS.ListService, {useClass: JS.ListService}),
    provide(SelectionService, {useValue: selectionService})
]);
