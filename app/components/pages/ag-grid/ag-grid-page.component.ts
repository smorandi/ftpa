import {Component, AfterViewInit, OnInit, OnDestroy} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, Utils, SvgFactory} from 'ag-grid/main';

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';
import {PageHeader} from "../../page-header/page-header.component";
import {IUser, User} from "../../../core/dto";
import * as _ from 'lodash';
import {Subscription} from "rxjs/Rx";
import {UserService_Big} from "../../../core/services/data/user-big.service";

@Component({
    selector: 'ftpa-ag-grid-page',
    moduleId: __moduleName,
    templateUrl: 'ag-grid-page.component.html',
    styleUrls: ['ag-grid-page.component.css'],
    directives: [PageHeader, AgGridNg2],
})

export class AgGridPageComponent implements AfterViewInit, OnInit, OnDestroy {
    private gridOptions:GridOptions;
    private rowData:any[] = [];
    private rawData:any[] = [];
    private columnDefs:any[];
    private rowCount:string;
    private dataSource:any;
    private subscription:Subscription;

    constructor(private userService:UserService_Big) {
        // this.gridOptions = <GridOptions>{
        //     enableColResize: true,
        //     virtualPaging: true, // this is important, if not set, normal paging will be done
        //     debug: true,
        //     rowSelection: 'multiple',
        //     rowDeselection: true,
        //     rowModelType: 'virtual'
        // };

        // this.gridOptions = <GridOptions>{
        //     rowSelection: 'multiple',
        // };

        this.gridOptions = <GridOptions>{
            // note - we do not set 'virtualPaging' here, so the grid knows we are doing standard paging
            enableSorting: true,
            enableFilter: true,
            suppressLoadingOverlay: true,
            debug: true,
            rowSelection: 'multiple',
            enableColResize: true,
            rowModelType: 'pagination'
        };

        this.createColumnDefs();
    }


    getRows(params) {
        console.log('asking for ' + params.startRow + ' to ' + params.endRow);
        var rowsThisPage = this.rawData.slice(params.startRow, params.endRow);

        // if on or after the last page, work out the last row.
        var lastRow = -1;
        if (this.rawData.length <= params.endRow) {
            lastRow = this.rawData.length;
        }

        // call the success callback
        params.successCallback(rowsThisPage, lastRow);
    }

    ngOnInit() {
        // this.userService.setUsers(this.userService.createRandomUsers(10000));
    }

    ngAfterViewInit() {
        console.log("after-view-init");

        this.dataSource = {
            pageSize: 10000,
            getRows: (params) => {
                this.getRows(params);
            }
        };
        this.gridOptions.api.setDatasource(this.dataSource);

        this.subscription = this.userService.getData().subscribe(data => {
            this.rawData = data;
            this.gridOptions.api.setDatasource(this.dataSource);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            var model = this.gridOptions.api.getModel();
            var totalRows = this.rowData.length;
            var processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
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

    private onContextMenu() {
        console.log('onContextMenu');
    }

    private onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    }

    private onReady() {
        console.log('onReady');
        this.calculateRowCount();
    }

    private onCellClicked($event) {
        console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellValueChanged($event) {
        console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
    }

    private onCellDoubleClicked($event) {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellContextMenu($event) {
        console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellFocused($event) {
        console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
    }

    private onRowSelected($event) {
        console.log('onRowSelected: ' + $event.node.data.id);
    }

    private onSelectionChanged() {
        console.log('selectionChanged');
    }

    private onBeforeFilterChanged() {
        console.log('beforeFilterChanged');
    }

    private onAfterFilterChanged() {
        console.log('afterFilterChanged');
    }

    private onFilterModified() {
        console.log('onFilterModified');
    }

    private onBeforeSortChanged() {
        console.log('onBeforeSortChanged');
    }

    private onAfterSortChanged() {
        console.log('onAfterSortChanged');
    }

    private onVirtualRowRemoved($event) {
        // because this event gets fired LOTS of times, we don't print it to the
        // console. if you want to see it, just uncomment out this line
        // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
    }

    private onRowClicked($event) {
        console.log('onRowClicked: ' + $event.node);
    }

    private onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event) {
        console.log('onColumnEvent: ' + $event);
    }
}