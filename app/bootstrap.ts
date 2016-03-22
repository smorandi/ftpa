import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {HttpUtil} from './core/http.util';
import {AppComponent} from './components/app/app.component';
import {ContactService} from './components/contact/contact.service';
import * as JS from './core/java.services';
import {CarsService} from "./components/grid/cars.service";

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    HttpUtil,
    ContactService,
    CarsService,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    // provide(JS.ACalculatorService, {useClass: JS.CalculatorService}),
    // provide(JS.AFruitsService, {useClass: JS.FruitsService}),

    // mock-services when used to run in ws
    provide(JS.ACalculatorService, {useClass: JS.CalculatorServiceMock}),
    provide(JS.AFruitsService, {useClass: JS.FruitsServiceMock}),
]);