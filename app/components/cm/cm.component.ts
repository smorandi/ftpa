import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ExceptionHandler,
    HostListener,
    ElementRef,
    ViewEncapsulation
} from "angular2/core";

@Component({
    selector: 'ftpa-contextMenu',
    moduleId: __moduleName,
    styleUrls: ['cm.component.css'],
    templateUrl: 'cm.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ContextMenuComponent implements OnInit,OnDestroy {
    private isShown = false;
    private mouseLocation:{left:number,top:number} = {left: 0, top: 0};
    private listener:any;

    constructor(private elementRef:ElementRef) {
    }

    onChange() {
        console.log("blah");
    }

    ngOnInit() {
        this.listener = () => this.closeMenu(null);

        window.addEventListener("blur", this.listener);
    }

    ngOnDestroy() {
        window.removeEventListener("blur", this.listener)
    }

    get locationCss() {
        return {
            'position': 'fixed',
            'display': this.isShown ? 'block' : 'none',
            left: this.mouseLocation.left + 'px',
            top: this.mouseLocation.top + 'px',
        };
    }

    @HostListener('document:mousedown', ['$event'])
    closeMenu(event:MouseEvent) {
        console.log("closeMenu()");
        this.isShown = false;
    }

    // show the menu and set the location of the mouse
    showMenu(event:MouseEvent) {
        console.log("showMenu");
        this.isShown = true;
        this.mouseLocation = {
            left: event.clientX,
            top: event.clientY
        }
    }
}