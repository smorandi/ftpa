import {ContextMenuService} from "../../core/services/contextmenu/context-menu.service";
import {Component, OnInit, OnDestroy, AfterViewInit, ExceptionHandler} from "angular2/core";

@Component({
    selector: 'context-menu-holder',
    styles: [
        '.container{width:150px;background-color:#eee;    z-index: 3;}',
        '.link{}', '.link:hover{background-color:#abc}',
        'ul{margin:0px;padding:0px;list-style-type: none}'
    ],
    host: {
        '(document:mousedown)': 'clickedOutside()'
    },
    template: `<div [ngStyle]="locationCss" class="container">
      <ul>
          <li (click)="link.subject.next(link.title)" class="link" *ngFor="#link of links">
              {{link.title}}
          </li>
      </ul>
    </div>
  `
})
export class ContextMenuHolderComponent {
    links = [];
    isShown = false;
    private mouseLocation:{left:number,top:number} = {left: 0, top: 0};

    constructor(private _contextMenuService:ContextMenuService) {
        _contextMenuService.show.subscribe(e => this.showMenu(e.event, e.obj));
    }

// the css for the container div
    get locationCss() {
        return {
            'position': 'fixed',
            'display': this.isShown ? 'block' : 'none',
            left: this.mouseLocation.left + 'px',
            top: this.mouseLocation.top + 'px',
        };
    }

    clickedOutside() {
        this.isShown = false; // hide the menu
    }

// show the menu and set the location of the mouse
    showMenu(event, links) {
        this.isShown = true;
        this.links = links;
        this.mouseLocation = {
            left: event.clientX,
            top: event.clientY
        }
    }
}