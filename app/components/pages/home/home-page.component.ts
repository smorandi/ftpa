import {Component, AfterViewInit, OnInit, OnDestroy} from "angular2/core";
import {PageHeader} from "../../page-header/page-header.component";
import {IUser} from "../../../core/dto";
import {HomeService} from "../../../core/services/data/home.service";
import {Subscription} from "rxjs/Rx";
import {CanReuse, ComponentInstruction} from 'angular2/router';

@Component({
    selector: 'ftpa-home-page',
    moduleId: __moduleName,
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css'],
    directives: [PageHeader]
})
export class HomePageComponent implements OnInit, OnDestroy, CanReuse{
    private firstname:string;
    private lastname:string;
    private subscription:Subscription;

    constructor(private homeService:HomeService) {
    }

    ngOnInit() {
        this.subscription = this.homeService.getData().subscribe(data => {
            this.firstname = data.firstname;
            this.lastname = data.lastname;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    routerCanReuse(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        return false;
    }
}
