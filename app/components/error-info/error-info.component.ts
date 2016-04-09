import {Component, OnInit, OnDestroy, AfterViewInit, ExceptionHandler} from "angular2/core";
import {CustomErrorHandler} from "../../core/errorhandler/error-handler";
import {Subscription} from "rxjs/Rx";

@Component({
    selector: 'ftpa-error-info',
    moduleId: __moduleName,
    templateUrl: 'error-info.component.html',
    styleUrls: ['error-info.component.css']
})
export class ErrorInfoComponent implements OnInit, OnDestroy {
    private subscription:Subscription;
    private errorMessage:string = null;

    constructor(private errorHandler:CustomErrorHandler) {
    }

    ngOnInit() {
        this.subscription = this.errorHandler.getErrors().subscribe(error => {
            this.errorMessage = error;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    close() {
        this.errorMessage = null;
    }

    hasError():boolean {
        return this.errorMessage !== null;
    }
}