import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";
import {HomePageComponent} from "../pages/home/home-page.component";
import {DragAndDropPageComponent} from "../pages/dnd/dnd-page.component";
import {AgGridPageComponent} from "../pages/ag-grid/ag-grid-page.component";
import {JavaBridgePageComponent} from "../pages/javabridge/javabridge-page.component";
import {$WebSocket} from "angular2-websocket/angular2-websocket";
import {Subject, Observable} from "rxjs/Rx"

@Component({
    selector: 'app',
    moduleId: __moduleName,
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/', component: HomePageComponent, as: 'HomePage', useAsDefault: true},
    {path: '/dnd', component: DragAndDropPageComponent, as: 'DragAndDropPage'},
    {path: '/javabridge', component: JavaBridgePageComponent, as: 'JavaBridgePage'},
    {path: '/agGrid', component: AgGridPageComponent, as: 'AgGridPage'},
])

export class AppComponent {
    private ws:$WebSocket;

    constructor() {
        this.ws = new $WebSocket("ws://localhost:3000", null, {
            initialTimeout: 500,
            maxTimeout: 300000,
            reconnectIfNotNormalClose: true
        });

        var dataStream:Subject<any> = this.ws.getDataStream();
        this.ws.send("blah blah");

        dataStream.error = (err) => {
            console.log("Error:" + err);
        };
        dataStream.complete = () => {
            console.log('Completed');
        };

        dataStream.subscribe(
            data => {
                console.log('Got: ' + data.data);
            },
            err => {
                console.log('Error: ' + err);
            },
            () => {
                console.log('Completed');
            }
        );
    }
}