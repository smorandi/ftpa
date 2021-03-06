import {Component, AfterViewInit, OnInit, OnDestroy} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, Utils, SvgFactory, IRowModel, RowNode, MouseEventService} from 'ag-grid/main';
import {ComponentInstruction, CanActivate} from "angular2/router";

import {PageHeader} from "../../page-header/page-header.component";
import {UserService} from "../../../core/services/data/user.service";
import {IUser, User, EventDto} from "../../../core/dto";
import * as _ from 'lodash';
import {Subscription} from "rxjs/Rx";
import {EventDispatcherService} from "../../../core/services/events/event-dispatcher.service";
import {JSEventHandlerService} from "../../../core/services/events/js-event-handler.service";
import {WebsocketEventHandlerService} from "../../../core/services/websockets/websocket-event-handler.service";

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';
import {checkLoggedIn} from "../../../core/services/login/check-logged-in";

@Component({
    selector: 'ftpa-javabridge-grid-page',
    moduleId: __moduleName,
    templateUrl: 'javabridge-grid-page.component.html',
    styleUrls: ['javabridge-grid-page.component.css'],
    directives: [PageHeader, AgGridNg2],
})
@CanActivate((next:ComponentInstruction, previous:ComponentInstruction) => checkLoggedIn(next, previous))
export class JavabridgeGridPageComponent implements AfterViewInit, OnInit, OnDestroy {
    private gridOptions:GridOptions;
    private rows:any[] = [];
    private columnDefs:any[];
    private subscription:Subscription;

    private javaEvents:EventDto[] = [];
    private wsJavaEvents:EventDto[] = [];
    private wsJSEvents:EventDto[] = [];

    private webSocketJavaSubscription:Subscription;
    private webSocketJSSubscription:Subscription;
    private javaSubscription:Subscription;

    constructor(private userService:UserService,
                private eventDispatcherService:EventDispatcherService,
                private eventHandlerService:JSEventHandlerService,
                private webSocketEventHandlerService:WebsocketEventHandlerService) {
        this.gridOptions = <GridOptions>{
            suppressMenuHide: false,
            rowSelection: 'multiple',
            suppressRowClickSelection: true,
            suppressCellSelection: false,
            rowDeselection: false,
        };

        this.createColumnDefs();
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
        this.subscription.unsubscribe();
    }

    ngAfterViewInit() {
        this.subscription = this.userService.getData().subscribe(data => {
            this.rows.splice(0, this.rows.length);
            this.rows.push.apply(this.rows, data);
            this.gridOptions.api.setRowData(this.rows);
        });
    }

    private createColumnDefs() {
        this.columnDefs = [
            {headerName: "ID", field: "id", width: 150, filter: 'text'},
            {headerName: "First Name", field: "firstname", width: 150, filter: 'text'},
            {headerName: "Last Name", field: "lastname", width: 150, filter: 'text'},
            {headerName: "Age", field: "age", width: 50, filter: 'text'},
            {headerName: "Login Name", field: "loginname", width: 150, filter: 'text'},
            {headerName: "Password", field: "password", width: 150, filter: 'text'}
        ];
    }

    asString(object:Object):string {
        return JSON.stringify(object, null, 2);
    }

    changeRow(ev:Event) {
        var selectedNodes:any[] = this.gridOptions.api.getSelectedNodes();
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
        var selectedNodes:any[] = this.gridOptions.api.getSelectedNodes();
        var ids:any[] = _.map(selectedNodes, "data.id");
        this.userService.deleteData(ids);
    }

    onMousedown($event:MouseEvent) {
        let rowModel:IRowModel = this.gridOptions.api.getModel();
        let mes:MouseEventService = this.gridOptions.api["gridPanel"].mouseEventService;
        let index:number = mes.getCellForMouseEvent($event).rowIndex;

        let rowNode:RowNode = rowModel.getRow(index);
        if ($event.ctrlKey) {
            if (rowNode.isSelected()) {
                rowNode.setSelected(false, true);
            }
            else {
                rowNode.setSelected(true, false);
            }
        }
        else {
            if (!rowNode.isSelected()) {
                rowNode.setSelected(true, true);
            }
        }
    }

    private onRowSelected($event) {
        console.log('onRowSelected: ' + $event.node.data.id);

        if ($event.node.selected) {
            let eventDto = new EventDto("ftpa-selection-event", $event.node.data);
            this.eventDispatcherService.dispatch(eventDto);
        }
    }
}