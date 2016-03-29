import {Subject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable, NgZone} from "angular2/core";

@Injectable()
export class SelectionService {
    static SERVICE_NAME:string = "ftpa-selection-service";

    private selectionsSubject:Subject<string> = new Subject<string>();

    constructor(private zone:NgZone) {
        if(window["ftpa-trd-gui"]) {
            console.log("registering selection service in 'window' with name: " + "'ftpa-selection-service'");
            window[SelectionService.SERVICE_NAME] = this;
            window.alert(SelectionService.SERVICE_NAME);
        }
    }

    getSelections():Observable<string> {
        return this.selectionsSubject.asObservable();
    }

    selectionChanged(data:string) {
        console.log("selectionChanged: " + data);
        this.zone.run(() => this.selectionsSubject.next(data));
    }
}