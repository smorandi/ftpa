import {Directive, Input} from 'angular2/core';
import {ContextMenuService} from "../core/services/contextmenu/context-menu.service";
@Directive({
    selector: '[context-menu]',
    host: {'(contextmenu)': 'rightClicked($event)'}
})
export class ContextMenuDirective {
    @Input('context-menu') links;

    constructor(private contextMenuService:ContextMenuService) {
    }

    rightClicked(event:MouseEvent) {
        this.contextMenuService.show.next({event: event, obj: this.links});
        event.preventDefault(); // to prevent the browser contextmenu
    }
}