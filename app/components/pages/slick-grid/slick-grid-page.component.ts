import {Component, ViewChild} from "angular2/core";
import {OnInit} from "angular2/core";
import {Subject} from "rxjs/Subject";
import {SlickGrid} from "./../../slickgrid/slickgrid";
import {ICar} from "../../../core/dto";
import {CarsService} from "../../../core/cars.service";
import {PageHeader} from "../../page-header/page-header.component";

@Component({
    selector: 'slick-grid-page',
    moduleId: __moduleName,
    templateUrl: "slick-grid-page.component.html",
    styleUrls: ['slick-grid-page.component.css'],
    directives: [PageHeader, SlickGrid]
})
export class SlickGridPageComponent implements OnInit {

    @ViewChild(SlickGrid)
    grid:SlickGrid<ICar>;

    dataColumns = [
        {id: 'id', name: 'LE.ID', field: 'id', sortable: true, resizable: false},
        {id: 'vin', name: 'Abbrev. Name', field: 'vin', sortable: true},
        {id: 'year', name: 'Short Name', field: 'year', sortable: true},
        {id: 'brand', name: 'Role', field: 'brand', sortable: true},
        {id: 'color', name: 'Environment', field: 'color', sortable: true},

        // { id: 'status', name: 'Status', field: 'STATUS', sortable: true },
        // { id: 'condition', name: 'Condition', field: 'CONDITION', sortable: true },
        // { id: 'country', name: 'Country', field: 'COUNTRY_CODE', sortable: true },
        // { id: 'isSponsoring', name: 'Is Sponsoring Participant', field: 'IS_SPONSORING_PARTICIPANT', formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, sortable: true, cssClass: "cell-align-center"},
        // { id: 'isXicbEntity', name: 'Is XICB Entity', field: 'IS_XICB_ENTITY', formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, sortable: true, cssClass: "cell-align-center" }
    ];

    options = {
        editable: false,
        autoEdit: false,
        forceFitColumns: false,
        enableCellNavigation: true,
        enableColumnReorder: true,
        autoHeight: false,
        dataItemColumnValueExtractor: this.getItemColumnValue,
    }

    cars:Subject<ICar[]> = Subject.create();
    hasLegalEntities:boolean = false;

    constructor(private carsService:CarsService) {
        console.log("blah");
    }

    getItemColumnValue(item, column) {
        var values = item[column.field];
        if (column.fieldIdx !== undefined) {
            return values && values[column.fieldIdx];
        } else {
            return values;
        }
    }

    ngOnInit() {
        this.carsService.getCars().subscribe(cars => {
            this.populateSearchResults(cars);
            setTimeout(() => this.grid.loadData(cars), 500);
        });
    }

    handleSelectionChange() {
        // var selRows = this.grid.getSelectedRows();
        // var sel:LegalEntity[] = [];
        //
        // jQuery.each(selRows, (index, value) => {
        //     sel.push(this.grid.getItemByIdx(value));
        // });
        // this.partyService.setSelectedLegalEntities(sel);
    }

    populateSearchResults(result:any) {
        console.log("Loaded " + result.length + " cars");

        // this.grid.loadData(this.legalEntities);
        this.cars.next(result);
    }
}