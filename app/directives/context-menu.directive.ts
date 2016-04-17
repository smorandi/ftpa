import {Directive, Input, HostListener, ViewChild, Dependency} from 'angular2/core';
import {ContextMenuComponent} from "../components/cm/cm.component";
@Directive({
    selector: '[contextMenu]'
})
export class ContextMenuDirective {
    @Input("contextMenu")
    cm:ContextMenuComponent;

    constructor() {
    }

    @HostListener('contextmenu', ['$event'])
    public rightClicked(event:MouseEvent) {
        console.log("rightClicked()");
        this.cm.showMenu(event);
        event.preventDefault(); // to prevent the browser contextmenu
    }
}