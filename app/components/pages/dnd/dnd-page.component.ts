import {Component} from 'angular2/core';
import {PageHeader} from "../../page-header/page-header.component";

@Component({
    selector: 'ftpa-dnd-page',
    moduleId: __moduleName,
    templateUrl: 'dnd-page.component.html',
    styleUrls: ['dnd-page.component.css'],
    directives: [PageHeader]
})
export class DragAndDropPageComponent {
    list:string[] = [];

    constructor() {
        this.list.push("der Fisch", "das Kamel");
    }

    onDragStart(ev:DragEvent, data:string) {
        ev.dataTransfer.setData('Text', data);
    }

    onDragOver(ev:DragEvent) {
        if (ev.preventDefault) {
            ev.preventDefault();
        }

        ev.dataTransfer.dropEffect = "all";
        return false;
    }

    onDrop(ev:DragEvent) {
        if (ev.preventDefault) {
            ev.preventDefault();
        }

        if (ev.stopPropagation) {
            ev.stopPropagation();
        }

        var data:string = ev.dataTransfer.getData("text");
        console.log(data);
        this.list.push(data);
    }
}