import {Component, AfterViewInit} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, Utils, SvgFactory} from 'ag-grid/main';

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';
import {PageHeader} from "../../page-header/page-header.component";
import {UserService} from "../../../core/services/data/user.service";

@Component({
    selector: 'ftpa-ag-grid-page',
    moduleId: __moduleName,
    templateUrl: 'ag-grid-page.component.html',
    styleUrls: ['ag-grid-page.component.css'],
    directives: [PageHeader, AgGridNg2],
})

export class AgGridPageComponent implements AfterViewInit {
    private gridOptions:GridOptions;
    private rowData:any[];
    private columnDefs:any[];
    private rowCount:string;

    constructor(private userService:UserService) {
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
            debug: true,
            rowSelection: 'multiple',
            enableColResize: true,
            rowModelType: 'pagination'
        };


        this.createColumnDefs();
    }

    ngAfterViewInit() {
        console.log("after-view-init");
        this.userService.getData().subscribe(data => {
            // this.rowData = data;
            var dataSource = {
                // rowCount: null, // behave as infinite scroll
                pageSize: 10000,
                // overflowSize: 10000,
                // maxConcurrentRequests: 1,
                // maxPagesInCache: 2,
                getRows: function (params) {
                    console.log('asking for ' + params.startRow + ' to ' + params.endRow);
                    // At this point in your code, you would call the server, using $http if in AngularJS.
                    // To make the demo look real, wait for 500ms before returning
                    setTimeout( function() {
                        // take a slice of the total rows
                        var rowsThisPage = data.slice(params.startRow, params.endRow);
                        // if on or after the last page, work out the last row.
                        var lastRow = -1;
                        if (data.length <= params.endRow) {
                            lastRow = data.length;
                        }
                        // call the success callback
                        params.successCallback(rowsThisPage, lastRow);
                    }, 500);
                }
            };
            this.gridOptions.api.setDatasource(dataSource);
        });
    }

    private createColumnDefs() {
        this.columnDefs = [
            {headerName: "ID", field: "id", width: 150, filter: 'text'},
            {headerName: "First Name", field: "firstName", width: 150, filter: 'text'},
            {headerName: "Last Name", field: "lastName", width: 150, filter: 'text'},
            {headerName: "Login Name", field: "loginName", width: 150, filter: 'text'},
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

    changeData() {
        this.rowData;
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
        console.log('onRowClicked: ' + $event.node.data.name);
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