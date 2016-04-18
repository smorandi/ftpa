import {Component, AfterViewInit, OnInit, OnDestroy, ViewChild} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, GridCell, Utils, SvgFactory, IRowModel, RowNode, MouseEventService, GridPanel} from 'ag-grid/main';
import {ComponentInstruction, CanActivate} from "angular2/router";

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';
import {PageHeader} from "../../page-header/page-header.component";
import {IUser, User, IEventDto} from "../../../core/dto";
import * as _ from 'lodash';
import {Subscription, Observable, Subject} from "rxjs/Rx";
import {UserService_Big} from "../../../core/services/data/user-big.service";
import {checkLoggedIn} from "../../../core/services/login/check-logged-in";
import {ContextMenuDirective} from "../../../directives/context-menu.directive";
import {ContextMenuComponent} from "../../cm/cm.component";
import {TieredMenu} from 'primeng/primeng';
import {WebsocketEventHandlerService} from "../../../core/services/websockets/websocket-event-handler.service";

@Component({
    selector: 'ftpa-ag-grid-page',
    moduleId: __moduleName,
    templateUrl: 'ag-grid-page.component.html',
    styleUrls: ['ag-grid-page.component.css'],
    directives: [PageHeader, AgGridNg2, ContextMenuDirective, ContextMenuComponent],
})
@CanActivate((next:ComponentInstruction, previous:ComponentInstruction) => checkLoggedIn(next, previous))
export class AgGridPageComponent implements AfterViewInit, OnInit, OnDestroy {
    private gridOptions:GridOptions;
    private rowData:any[] = [];
    private rawData:any[] = [];
    private columnDefs:any[];
    private rowCount:string;
    private dataSource:any;
    private dataSubscription:Subscription;


    @ViewChild("headercm")
    private headerCm:ContextMenuComponent;
    @ViewChild("bodycm")
    private bodyCm:ContextMenuComponent;

    constructor(private userService:UserService_Big) {
        console.log(__moduleName + " constructor()");

        this.gridOptions = <GridOptions>{
            enableSorting: true,
            enableFilter: true,
            suppressLoadingOverlay: true,
            debug: true,
            rowSelection: 'single',
            enableColResize: true,
            rowModelType: 'pagination',
            rowHeight: 22,
            headerHeight: 30,
            suppressRowClickSelection: true,
            suppressCellSelection: false,
            rowDeselection: false,
            suppressContextMenu: true,
            suppressMenuFilterPanel: true,
            suppressMenuMainPanel: true,
            suppressMenuColumnPanel: true,
            getHeaderCellTemplate: params => this.getHeaderCellTemplate(params),
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
    }
    ngOnDestroy() {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        console.log("after-view-init");

        this.dataSource = {
            pageSize: 10000,
            getRows: (params) => this.getRows(params)
        };
        this.gridOptions.api.setDatasource(this.dataSource);

        this.dataSubscription = this.userService.getData().subscribe(data => {
            this.rawData = data;
            this.gridOptions.api.setDatasource(this.dataSource);
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

    onContextMenu(event:MouseEvent) {
        let rowModel:IRowModel = this.gridOptions.api.getModel();
        let gridPanel:GridPanel = this.gridOptions.api["gridPanel"];
        let mes:MouseEventService = gridPanel["mouseEventService"];
        let cell:GridCell = mes.getCellForMouseEvent(event);
        let index:number = cell.rowIndex;

        let clientRect = gridPanel.getBodyViewportClientRect();
        let bodyX = event.clientX - clientRect.left;
        let bodyY = event.clientY - clientRect.top;
        let clientWidth = gridPanel.getBodyViewport().clientWidth;
        let clientHeight = gridPanel.getBodyViewport().clientHeight;

        let elementMouseIsOver:Element = document.elementFromPoint(event.clientX, event.clientY);

        let isContextMenu:boolean = event.button === 2;
        let isHeaderArea:boolean = elementMouseIsOver.className.indexOf("header-cell") >= 0;
        let isBodyArea:boolean = !(bodyY < 0 || bodyY - clientHeight > 0 || bodyX < 0 || bodyX - clientWidth > 0);

        this.bodyCm.closeMenu(null);
        this.headerCm.closeMenu(null);
        
        if (isBodyArea) {
            this.bodyCm.showMenu(event);
        }
        else if (isHeaderArea) {
            this.headerCm.showMenu(event);
        }
    }

    onMousedown(event:MouseEvent) {
        let rowModel:IRowModel = this.gridOptions.api.getModel();
        let gridPanel:GridPanel = this.gridOptions.api["gridPanel"];
        let mes:MouseEventService = gridPanel["mouseEventService"];
        let cell:GridCell = mes.getCellForMouseEvent(event);
        let index:number = cell.rowIndex;

        let clientRect = gridPanel.getBodyViewportClientRect();
        let bodyX = event.clientX - clientRect.left;
        let bodyY = event.clientY - clientRect.top;
        let clientWidth = gridPanel.getBodyViewport().clientWidth;
        let clientHeight = gridPanel.getBodyViewport().clientHeight;

        let elementMouseIsOver:Element = document.elementFromPoint(event.clientX, event.clientY);

        let isContextMenu:boolean = event.button === 2;
        let isHeaderArea:boolean = elementMouseIsOver.className.indexOf("header-cell") >= 0;
        let isBodyArea:boolean = !(bodyY < 0 || bodyY - clientHeight > 0 || bodyX < 0 || bodyX - clientWidth > 0);

        if (isBodyArea) {
            let rowNode:RowNode = rowModel.getRow(index);
            if (event.ctrlKey) {
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
        console.log("changeRow()");
        var selectedNodes:any[] = this.gridOptions.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
            var users:IUser[] = _.map(selectedNodes, "data");
            var clone:IUser = Object.assign(new User(), users[0]);
            clone.firstname = "derFisch";
            this.userService.updateData(clone);
        }
    }

    addRow(ev:Event) {
        console.log("addRow()");
    }

    deleteRow(ev:Event) {
        console.log("deleteRow()");
        var selectedNodes:any[] = this.gridOptions.api.getSelectedNodes();
        var ids:any[] = _.map(selectedNodes, "data.id");
        this.userService.deleteData(ids);
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


    // custom handling for the header stuff...
    private addInIcon(eTemplate, gridOptionsWrapper, iconName, cssSelector, column, defaultIconFactory) {
        var eIcon = Utils.createIconNoSpan(iconName, gridOptionsWrapper, column, defaultIconFactory);
        eTemplate.querySelector(cssSelector).appendChild(eIcon);
    };

    private getHeaderCellTemplate(params:any) {
        var template:string = '<div class="ag-header-cell">' +
            '  <div id="agResizeBar" class="ag-header-cell-resize"></div>' +
            '  <span id="agMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
            '  <div id="agHeaderCellLabel" class="ag-header-cell-label">' +
            '    <div id="agText" class="ag-header-cell-text"></div>' +
            '    <div id="agSortAsc"><i class="fa fa-caret-up"></i></div>' +
            '    <div id="agSortDesc"><i class="fa fa-caret-down"></i></div>' +
            '    <div id="agNoSort" class="ag-header-icon ag-sort-none-icon"></div>' +
            '    <div id="agFilter" <i class="fa fa-filter"></div>' +
            '  </div>' +
            '</div>';

        var eTemplate:HTMLElement = Utils.loadTemplate(template);
        var column = params.column;
        var svgFactory = SvgFactory.getInstance();
        var gridOptionsWrapper = column.gridOptionsWrapper;

        // this.addInIcon(eTemplate, gridOptionsWrapper, 'sortAscending', '#agSortAsc', column, svgFactory.createArrowUpSvg);
        // this.addInIcon(eTemplate, gridOptionsWrapper, 'sortDescending', '#agSortDesc', column, svgFactory.createArrowDownSvg);
        this.addInIcon(eTemplate, gridOptionsWrapper, 'sortUnSort', '#agNoSort', column, svgFactory.createArrowUpDownSvg);
        this.addInIcon(eTemplate, gridOptionsWrapper, 'menu', '#agMenu', column, svgFactory.createMenuSvg);
        // this.addInIcon(eTemplate, gridOptionsWrapper, 'filter', '#agFilter', column, svgFactory.createFilterSvg);

        // var eMenu:any = eTemplate.querySelector('#agMenu');
        eTemplate.addEventListener("contextmenu", (ev:MouseEvent) => {
            // this.headerCm.showMenu(ev);
        });

        return eTemplate;
    }
}