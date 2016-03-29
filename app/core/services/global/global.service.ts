import {Subject} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {Injectable} from "angular2/core";

@Injectable()
export class SelectionService {
    private selectionsSubject:Subject<string> = new Subject<string>();

    constructor() {
    }

    getSelections():Observable<string> {
        return this.selectionsSubject.asObservable();
    }

    selectionChanged(data:string) {
        this.selectionsSubject.next(data);
    }
}
