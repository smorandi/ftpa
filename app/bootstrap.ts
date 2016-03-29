import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './components/app/app.component';
import * as JS from './core/java.services';
import {CarsService} from "./core/cars.service";
import {UserService} from "./core/services/data/user.service";

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    CarsService,
    UserService,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(JS.CalculatorService, {useClass: JS.CalculatorService}),
    provide(JS.ListService, {useClass: JS.ListService}),
]);