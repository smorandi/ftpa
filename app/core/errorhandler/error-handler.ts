/**
 * Created by Stefano on 09.04.2016.
 */

import {ExceptionHandler} from 'angular2/core';
import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Rx";

@Injectable()
export class CustomErrorHandler {
    private errorSubject:Subject<string> = new Subject<string>();

    // call(exception:any, stackTrace:any, reason:string):void {
    //     this.pubishError(JSON.stringify(exception) + ":" + stackTrace + ":" + reason);
    // }

    getErrors():Observable<string> {
        return this.errorSubject.asObservable();
    }

    publishError(error:string) {
        this.errorSubject.next(error);
    }
}