import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Rx';

@Injectable()
export class ContextMenuService {
    public show:Subject<{event:MouseEvent,obj:any[]}> = new Subject<{event:MouseEvent,obj:any[]}>();
}