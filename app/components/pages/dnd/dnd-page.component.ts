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
        // ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData("text/plain", data);
    }

    onDragOver(ev:DragEvent) {
        if (ev.preventDefault) {
            ev.preventDefault();
        }

        // ev.dataTransfer.dropEffect = "move";
        return false;
    }
    
    onDragEnd(ev:DragEvent) {
        console.log("drag end");
        if (ev.preventDefault) {
            ev.preventDefault();
        }

        if (ev.stopPropagation) {
            ev.stopPropagation();
        }
    }

    onDrop(ev:DragEvent) {
        if (ev.preventDefault) {
            ev.preventDefault();
        }
        if (ev.stopPropagation) {
            ev.stopPropagation();
        }

        console.log("" + ev.dataTransfer.types);

        var data:string = ev.dataTransfer.getData("text/plain");
        console.log(data);
        this.list.push(data);
        ev.dataTransfer.clearData();
    }
}