import {
    Component, OnInit, Input, Output, EventEmitter, AfterViewInit, AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef
} from "angular2/core";

import {Subject} from "rxjs/Subject";

declare var Slick:any;

@Component({
    selector: 'SlickGrid',
    moduleId: __moduleName,
    templateUrl: 'slickgrid.html',
    styleUrls: ['slickgrid.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlickGrid<T> implements OnInit, AfterViewInit, AfterContentInit {

    public grid:any;
    public dataView:any;
    sortCol:any;

    @Input('id')
    id:string;
    @Input('outerDiv')
    outerDiv:string;
    @Input('data')
    data:Subject<T[]>;
    @Input('columnData')
    columnData:any[];
    @Input('options')
    options:any;
    @Input('offsetCalc')
    offsetCalc:number = 0;

    @Output('selectionChanged')
    selectionChanged:EventEmitter<T[]> = new EventEmitter();

    private wrapperId:string;
    private toolbarId:string;
    private tableId:string;

    constructor(private cd:ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.loadGrid();
    }

    ngAfterContentInit() {
        // console.log(this.id);
    }

    getSelectedRows() {
        return this.grid.getSelectedRows();
    }

    getItemByIdx(idx:number) {
        return this.dataView.getItemByIdx(idx);
    }

    ngOnInit() {
        if (this.data instanceof Subject) {
            this.data.subscribe((x) => {
                this.loadData(x);
                this.cd.markForCheck();
            });
        }

        this.wrapperId = "dgWrapper_" + this.id;
        this.toolbarId = "dgToolbar_" + this.id;
        this.tableId = "dgTable_" + this.id;
    }

    loadGrid() {
        var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();

        this.dataView = new Slick.Data.DataView({
            inlineFilters: true,
            groupItemMetadataProvider: groupItemMetadataProvider
        });
        this.grid = new Slick.Grid("#" + this.tableId, this.dataView, this.columnData, this.options);
        this.grid.registerPlugin(groupItemMetadataProvider);
        this.grid.setSelectionModel(new Slick.RowSelectionModel());
        var columnpicker = new Slick.Controls.ColumnPicker(this.columnData, this.grid, this.options);
        // this.grid.onClick.subscribe((e, args) => this.handleGridClick(e, args));
        this.grid.onSelectedRowsChanged.subscribe(() => this.handleSelectionChange());
        this.grid.onSort.subscribe((e, args) => {
            var sortdir = args.sortAsc ? 1 : -1;
            this.sortCol = args.sortCol.field;
            this.dataView.sort((a, b) => this.comparer(a, b), args.sortAsc);
        });

        this.grid.onCellChange.subscribe((e, args) => {
            this.dataView.updateItem(args.item.id, args.item);
        });

        this.dataView.onRowCountChanged.subscribe((e, args) => {
            this.grid.updateRowCount();
            this.grid.render();
        });
        this.dataView.onRowsChanged.subscribe((e, args) => {
            this.grid.invalidateRows(args.rows);
            this.grid.render();
        });

        this.dataView.syncGridSelection(this.grid, true);

        this.redraw();
    }

    reloadData() {
        this.loadData(this.data);
    }

    loadData(data?:any) {
        this.dataView.beginUpdate();
        this.dataView.setItems(data);
        this.dataView.endUpdate();
    }


    redraw() {
        // not sure why 75, just is
        var v = $("#" + this.outerDiv).height() + this.offsetCalc;
        // console.log("redrawing, height: " + jQuery("#"+this.outerDiv).height());

        var wrapper:any = $("#" + this.wrapperId);
        wrapper.height(v);
        wrapper.parent().height(v);

        this.grid.resizeCanvas();
    }

    handleSelectionChange() {
        var selRows = this.grid.getSelectedRows();
        var sel:T[] = [];

        $.each(selRows, (index, value) => {
            sel.push(this.dataView.getItemByIdx(value));
        });

        this.selectionChanged.emit(sel);
    }

    comparer(a, b) {
        var x = a[this.sortCol], y = b[this.sortCol];
        return (x == y ? 0 : (x > y ? 1 : -1));
    }
}