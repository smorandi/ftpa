import {Component, AfterViewInit, OnInit, OnDestroy} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, Utils, SvgFactory} from 'ag-grid/main';

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';
import {PageHeader} from "../../page-header/page-header.component";
import {UserService} from "../../../core/services/data/user.service";
import {IUser, User, EventDto} from "../../../core/dto";
import * as _ from 'lodash';
import {Subscription} from "rxjs/Rx";
import {EventDispatcherService} from "../../../core/services/events/event-dispatcher.service";

@Component({
    selector: 'ftpa-javabridge-grid-page',
    moduleId: __moduleName,
    templateUrl: 'javabridge-grid-page.component.html',
    styleUrls: ['javabridge-grid-page.component.css'],
    directives: [PageHeader, AgGridNg2],
})

export class JavabridgeGridPageComponent implements AfterViewInit, OnInit, OnDestroy {
    private gridOptions:GridOptions;
    private rows:any[] = [];
    private columnDefs:any[];
    private subscription:Subscription;

    constructor(private userService:UserService, private eventDispatcherService:EventDispatcherService) {
        this.gridOptions = <GridOptions>{
            suppressMenuHide: false,
            rowSelection: 'single',
            rowDeselection: true
        };

        this.createColumnDefs();
    }

    ngOnInit() {
        this.userService.setUsers(this.userService.createRandomUsers(10));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit() {
        console.log("after-view-init");
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

    changeRow(ev:Event) {
        var selectedNodes:any[] = this.gridOptions.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
            var users:IUser[] = _.map(selectedNodes, "data");
            var clone = Object.assign(new User(), users[0]);
            clone.firstName = "derFisch";
            this.userService.updateData(clone);
        }
    }

    addRow(ev:Event) {
        this.userService.addData(this.userService.createRandomUser());
    }

    deleteRow(ev:Event) {
        var selectedNodes:any[] = this.gridOptions.api.getSelectedNodes();
        var ids:any[] = _.map(selectedNodes, "data.id");
        this.userService.deleteData(ids);
    }

    private onRowSelected($event) {
        console.log('onRowSelected: ' + $event.node.data.id);

        if ($event.node.selected) {
            let eventDto = new EventDto("ftpa-selection-event", $event.node.data);
            this.eventDispatcherService.dispatch(eventDto);
        }
    }
}