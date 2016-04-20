import {Component, AfterViewInit, OnInit, OnDestroy, ViewChild} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, Utils, SvgFactory, IRowModel, RowNode, MouseEventService, GridCell, GridPanel} from 'ag-grid/main';
import {ComponentInstruction, CanActivate} from "angular2/router";

import {PageHeader} from "../../page-header/page-header.component";
import {UserService} from "../../../core/services/data/user.service";
import {Subscription, Observable} from "rxjs/Rx";

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';
import {checkLoggedIn} from "../../../core/services/login/check-logged-in";
import {ContextMenuComponent} from "../../cm/cm.component";
import {ContextMenuDirective} from "../../../directives/context-menu.directive";
import {WebsocketEventHandlerService} from "../../../core/services/websockets/websocket-event-handler.service";
import {IEventDto} from "../../../core/dto";
import {ContextMenuService} from "../../../core/java.services";

@Component({
    selector: 'ftpa-popups-page',
    moduleId: __moduleName,
    templateUrl: 'popups.component.html',
    styleUrls: ['popups.component.css'],
    directives: [PageHeader, AgGridNg2, ContextMenuDirective, ContextMenuComponent]
})
@CanActivate((next:ComponentInstruction, previous:ComponentInstruction) => checkLoggedIn(next, previous))
export class PopupsPageComponent implements OnInit, OnDestroy {
    private gridOptions:GridOptions;
    private rows:any[] = [];
    private columnDefs:any[];
    private dataSubscription:Subscription;

    private isFxContextMenu:boolean;

    @ViewChild("bodycm")
    private bodyCm:ContextMenuComponent;

    constructor(private userService:UserService,
                private contextMenuService:ContextMenuService) {
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

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.dataSubscription = this.userService.getData().subscribe(data => {
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

        let isHeaderArea:boolean = elementMouseIsOver.className.indexOf("header-cell") >= 0;
        let isBodyArea:boolean = !(bodyY < 0 || bodyY - clientHeight > 0 || bodyX < 0 || bodyX - clientWidth > 0);

        this.bodyCm.closeMenu(null);

        if (isBodyArea) {
            if (this.isFxContextMenu) {
                this.contextMenuService.showContextMenu({
                    screenX: event.screenX,
                    screenY: event.screenY,
                    items: [{data: "der"}, {data: "fisch"}]
                });
            }
            else {
                this.bodyCm.showMenu(event);
            }
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