import {Component} from "angular2/core";
import {AgGridNg2} from 'ag-grid-ng2/main';
import {GridOptions, Utils, SvgFactory} from 'ag-grid/main';

// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';
import RefData from "../../../core/refData";
import SkillFilter from "../../../filters/skillFilter";
import ProficiencyFilter from "../../../filters/proficiencyFilter";
import {PageHeader} from "../../page-header/page-header.component";

@Component({
    selector: 'ftpa-ag-grid-page',
    moduleId: __moduleName,
    templateUrl: 'ag-grid-page.component.html',
    styleUrls: ['ag-grid-page.component.css'],
    directives: [PageHeader, AgGridNg2],
})

export class AgGridPageComponent {

    private gridOptions:GridOptions;
    private showGrid:boolean;
    private rowData:any[];
    private columnDefs:any[];
    private rowCount:string;

    constructor() {
        // we pass an empty gridOptions in, so we can grab the api out
        this.gridOptions = <GridOptions>{
            getMainMenuItems: params => this.getMainMenuItems(params),
            suppressMenuHide: false,
            rowSelection: 'single',
            getHeaderCellTemplate: params => this.getHeaderCellTemplate(params),
        };
        this.createRowData();
        this.createColumnDefs();
        this.showGrid = true;
    }

    private createRowData() {
        var rowData:any[] = [];

        for (var i = 0; i < 100; i++) {
            var countryData = RefData.countries[i % RefData.countries.length];
            rowData.push({
                name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
                skills: {
                    android: Math.random() < 0.4,
                    html5: Math.random() < 0.4,
                    mac: Math.random() < 0.4,
                    windows: Math.random() < 0.4,
                    css: Math.random() < 0.4
                },
                address: RefData.addresses[i % RefData.addresses.length],
                years: Math.round(Math.random() * 100),
                proficiency: Math.round(Math.random() * 100),
                country: countryData.country,
                continent: countryData.continent,
                language: countryData.language,
                mobile: createRandomPhoneNumber(),
                landline: createRandomPhoneNumber()
            });
        }

        this.rowData = rowData;
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
                suppressMenu: true, pinned: true
            },
            {
                headerName: 'Employee',
                children: [
                    {
                        headerName: "Name", field: "name",
                        width: 150, pinned: false,
                    },
                    {
                        headerName: "Country", field: "country", width: 150,
                        cellRenderer: countryCellRenderer, pinned: false,
                        filterParams: {cellRenderer: countryCellRenderer, cellHeight: 20}
                    },
                ]
            },
            {
                headerName: 'IT Skills',
                children: [
                    {
                        headerName: "Skills",
                        width: 125,
                        suppressSorting: true,
                        cellRenderer: skillsCellRenderer,
                        filter: SkillFilter
                    },
                    {
                        headerName: "Proficiency",
                        field: "proficiency",
                        width: 120,
                        cellRenderer: percentCellRenderer,
                        filter: ProficiencyFilter
                    },
                ]
            },
            {
                headerName: 'Contact',
                children: [
                    {headerName: "Mobile", field: "mobile", width: 150, filter: 'text'},
                    {headerName: "Land-line", field: "landline", width: 150, filter: 'text'},
                    {headerName: "Address", field: "address", width: 500, filter: 'text'}
                ]
            }
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
        console.log('onRowSelected: ' + $event.node.data.name);
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

    private addInIcon(eTemplate, gridOptionsWrapper, iconName, cssSelector, column, defaultIconFactory) {
        var eIcon = Utils.createIconNoSpan(iconName, gridOptionsWrapper, column, defaultIconFactory);
        eTemplate.querySelector(cssSelector).appendChild(eIcon);
    };

    private getHeaderCellTemplate(params:any) {

        var template:string = '<div class="ag-header-cell">' +
            '  <div id="agResizeBar" class="ag-header-cell-resize"></div>' +
            '  <span id="agMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
            '  <div id="agHeaderCellLabel" class="ag-header-cell-label">' +
            '    <span id="agSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
            '    <span id="agSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
            '    <span id="agNoSort" class="ag-header-icon ag-sort-none-icon"></span>' +
            '    <span id="agFilter" class="ag-header-icon ag-filter-icon"></span>' +
            '    <span id="agText" class="ag-header-cell-text"></span>' +
            '  </div>' +
            '</div>';

        var eTemplate:HTMLElement = Utils.loadTemplate(template);
        var column = params.column;
        var svgFactory = SvgFactory.getInstance();
        var gridOptionsWrapper = column.gridOptionsWrapper;

        this.addInIcon(eTemplate, gridOptionsWrapper, 'sortAscending', '#agSortAsc', column, svgFactory.createArrowUpSvg);
        this.addInIcon(eTemplate, gridOptionsWrapper, 'sortDescending', '#agSortDesc', column, svgFactory.createArrowDownSvg);
        this.addInIcon(eTemplate, gridOptionsWrapper, 'sortUnSort', '#agNoSort', column, svgFactory.createArrowUpDownSvg);
        this.addInIcon(eTemplate, gridOptionsWrapper, 'menu', '#agMenu', column, svgFactory.createMenuSvg);
        this.addInIcon(eTemplate, gridOptionsWrapper, 'filter', '#agFilter', column, svgFactory.createFilterSvg);

        var eMenu:any = eTemplate.querySelector('#agMenu');
        eTemplate.addEventListener("contextmenu", function (ev:Event) {
            ev.stopPropagation();
            ev.preventDefault();
            eMenu.click();
        });

        return eTemplate;
    }

    private getMainMenuItems(params) {
        // you don't need to switch, we switch below to just demonstrate some different options
        // you have on how to build up the menu to return
        switch (params.column.getId()) {
            // return the defaults, put add some extra items at the end
            case 'athlete':
                var athleteMenuItems = params.defaultItems.slice(0);
                athleteMenuItems.push({
                    name: 'ag-Grid Is Great', action: function () {
                        console.log('ag-Grid is great was selected');
                    }
                });
                athleteMenuItems.push({
                    name: 'Casio Watch', action: function () {
                        console.log('People who wear casio watches are cool');
                    }
                });
                return athleteMenuItems;
            // return some dummy items

            case 'age':

                return [

                    { // our own item with an icon

                        name: 'Joe Abercrombie',

                        action: function () {
                            console.log('He wrote a book');
                        },

                        icon: 'icon'

                    },

                    { // our own icon with a check box

                        name: 'Larsson',

                        action: function () {
                            console.log('He also wrote a book');
                        },

                        checked: true

                    },

                    'resetColumns' // a built in item

                ];



            // return all the default items, but remove app seperators and the two sub menus

            case 'country':
                var countryMenuItems = [];
                var itemsToExclude = ['separator', 'pinSubMenu', 'valueAggSubMenu'];
                params.defaultItems.forEach(function (item) {
                    if (itemsToExclude.indexOf(item) < 0) {
                        countryMenuItems.push(item);
                    }
                });

                return countryMenuItems;
            default:
                // make no changes, just accept the defaults
                return params.defaultItems;
        }
    }
}

function skillsCellRenderer(params) {
    var data = params.data;
    var skills = [];
    RefData.IT_SKILLS.forEach(function (skill) {
        if (data && data.skills && data.skills[skill]) {
            skills.push("x");
        }
    });
    return skills.join(' ');
}

function countryCellRenderer(params) {
    var flag = "blah";
    return flag + " " + params.value;
}

function createRandomPhoneNumber() {
    var result = '+';
    for (var i = 0; i < 12; i++) {
        result += Math.round(Math.random() * 10);
        if (i === 2 || i === 5 || i === 8) {
            result += ' ';
        }
    }
    return result;
}

function percentCellRenderer(params) {
    var value = params.value;

    var eDivPercentBar = document.createElement('div');
    eDivPercentBar.className = 'div-percent-bar';
    eDivPercentBar.style.width = value + '%';
    if (value < 20) {
        eDivPercentBar.style.backgroundColor = 'red';
    } else if (value < 60) {
        eDivPercentBar.style.backgroundColor = '#ff9900';
    } else {
        eDivPercentBar.style.backgroundColor = '#00A000';
    }

    var eValue = document.createElement('div');
    eValue.className = 'div-percent-value';
    eValue.innerHTML = value + '%';

    var eOuterDiv = document.createElement('div');
    eOuterDiv.className = 'div-outer-div';
    eOuterDiv.appendChild(eValue);
    eOuterDiv.appendChild(eDivPercentBar);

    return eOuterDiv;
}