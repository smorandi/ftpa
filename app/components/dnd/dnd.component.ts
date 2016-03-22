import {Component} from 'angular2/core';

@Component({
    selector: 'dnd',
    templateUrl: 'app/components/dnd/dnd.component.html'
})

export class DragAndDropComponent {
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