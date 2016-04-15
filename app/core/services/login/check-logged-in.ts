import {Injector} from 'angular2/core';
import {ComponentInstruction} from 'angular2/router';
import {appInjector} from "../../app-injector/app-injector";
import {LoginService} from "./login.service";

export const checkLoggedIn = (next: ComponentInstruction, previous: ComponentInstruction):Promise<boolean> => {
    // get the stored reference to the injector
    let injector: Injector = appInjector();
    let loginService:LoginService = injector.get(LoginService);
    return loginService.checkLoggedIn(next, previous);
};