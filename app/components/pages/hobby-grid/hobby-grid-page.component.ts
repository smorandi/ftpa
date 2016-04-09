import {Component, AfterViewInit, OnInit, OnDestroy} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, Utils, SvgFactory} from 'ag-grid/main';

import {PageHeader} from "../../page-header/page-header.component";
import {UserService} from "../../../core/services/data/user.service";
import {IUser, User, EventDto, IHobby} from "../../../core/dto";
import * as _ from 'lodash';
import {Subscription} from "rxjs/Rx";
import {EventDispatcherService} from "../../../core/services/events/event-dispatcher.service";
import {JSEventHandlerService} from "../../../core/services/events/js-event-handler.service";
import {WebsocketEventHandlerService} from "../../../core/services/websockets/websocket-event-handler.service";
import {HobbyService} from "../../../core/services/data/hobby.service";

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';

@Component({
    selector: 'ftpa-hobby-grid-page',
    moduleId: __moduleName,
    templateUrl: 'hobby-grid-page.component.html',
    styleUrls: ['hobby-grid-page.component.css'],
    directives: [PageHeader, AgGridNg2],
})

export class HobbyGridPageComponent implements AfterViewInit, OnInit, OnDestroy {
    private userGridOptions:GridOptions;
    private hobbyGridOptions:GridOptions;

    private userRows:IUser[] = [];
    private hobbyRows:IHobby[] = [];

    private userColumnDefs:any[];
    private hobbyColumnDefs:any[];

    private userDataSubscription:Subscription;
    private hobbyDataSubscription:Subscription;

    private javaEvents:EventDto[] = null;
    private wsJavaEvents:EventDto[] = null;
    private wsJSEvents:EventDto[] = null;

    private webSocketJavaSubscription:Subscription;
    private webSocketJSSubscription:Subscription;
    private javaSubscription:Subscription;

    constructor(private userService:UserService,
                private eventDispatcherService:EventDispatcherService,
                private eventHandlerService:JSEventHandlerService,
                private hobbyService:HobbyService,
                private webSocketEventHandlerService:WebsocketEventHandlerService) {
        this.userGridOptions = <GridOptions>{
            suppressMenuHide: false,
            rowSelection: 'single',
            rowDeselection: true
        };

        this.hobbyGridOptions = <GridOptions>{
            suppressMenuHide: false,
            rowSelection: 'single',
            rowDeselection: true
        };

        this.userColumnDefs = [
            {headerName: "ID", field: "id", width: 150, filter: 'text'},
            {headerName: "First Name", field: "firstname", width: 150, filter: 'text'},
            {headerName: "Last Name", field: "lastname", width: 150, filter: 'text'},
            {headerName: "Age", field: "age", width: 50, filter: 'text'},
            {headerName: "Login Name", field: "loginname", width: 150, filter: 'text'},
            {headerName: "Password", field: "password", width: 150, filter: 'text'}
        ];

        this.hobbyGridOptions = <GridOptions>{
            suppressMenuHide: false,
            rowSelection: 'single',
            rowDeselection: true
        };

        this.hobbyColumnDefs = [
            {headerName: "ID", field: "id", width: 150, filter: 'text'},
            {headerName: "Name", field: "name", width: 150, filter: 'text'}
        ];
    }

    ngOnInit() {
        this.javaSubscription = this.eventHandlerService.getEvents().subscribe(events => this.javaEvents = events);
        this.webSocketJavaSubscription = this.webSocketEventHandlerService.getJavaEvents().subscribe(event => this.wsJavaEvents.unshift(event));
        this.webSocketJSSubscription = this.webSocketEventHandlerService.getJSEvents().subscribe(event => this.wsJSEvents.unshift(event));
    }

    ngOnDestroy() {
        this.javaSubscription.unsubscribe();
        this.webSocketJavaSubscription.unsubscribe();
        this.webSocketJSSubscription.unsubscribe();
        this.userDataSubscription.unsubscribe();

        if (this.hobbyDataSubscription) {
            this.hobbyDataSubscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.userDataSubscription = this.userService.getData().subscribe(data => {
            this.userRows.splice(0, this.userRows.length);
            this.userRows.push.apply(this.userRows, data);
            this.userGridOptions.api.setRowData(this.userRows);
        });

    }

    asString(object:Object):string {
        return JSON.stringify(object, null, 2);
    }

    changeRow(ev:Event) {
        var selectedNodes:any[] = this.userGridOptions.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
            var users:IUser[] = _.map(selectedNodes, "data");
            var clone:IUser = Object.assign(new User(), users[0]);
            clone.firstname = "derFisch";
            this.userService.updateData(clone);
        }
    }

    addRow(ev:Event) {
        // this.userService.addData(this.userService.createRandomUser());
    }

    deleteRow(ev:Event) {
        var selectedNodes:any[] = this.userGridOptions.api.getSelectedNodes();
        var ids:any[] = _.map(selectedNodes, "data.id");
        this.userService.deleteData(ids);
    }

    private onRowSelected($event) {
        console.log('onRowSelected: ' + $event.node.data.id);

        if ($event.node.selected) {
            let eventDto = new EventDto("ftpa-selection-event", $event.node.data);
            this.eventDispatcherService.dispatch(eventDto);

            this.hobbyDataSubscription = this.hobbyService.fetchDataForUser($event.node.data).subscribe(data => {
                this.hobbyRows.splice(0, this.hobbyRows.length);
                this.hobbyRows.push.apply(this.hobbyRows, data);
                this.hobbyGridOptions.api.setRowData(this.hobbyRows);
            });
        }
    }
}