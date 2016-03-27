import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './components/app/app.component';
import * as JS from './core/java.services';
import {CarsService} from "./core/cars.service";

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    CarsService,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    // provide(JS.ACalculatorService, {useClass: JS.CalculatorService}),
    // provide(JS.AFruitsService, {useClass: JS.FruitsService}),

    // mock-services when used to run in ws
    provide(JS.ACalculatorService, {useClass: JS.CalculatorServiceMock}),
    provide(JS.AFruitsService, {useClass: JS.FruitsServiceMock}),
]);