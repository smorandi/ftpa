import {Injectable, NgZone} from "angular2/core";
import {EventHandlerService, CredentialsService} from "../../java.services";
import {WebsocketEventHandlerService} from "../websockets/websocket-event-handler.service";
import {IEventDto, IUser} from "../../dto";
import {HomeService} from "../data/home.service";
import {HttpClient} from "../../http/http.service";
import {Http, Headers, RequestOptionsArgs, Response} from 'angular2/http';
import {CustomErrorHandler} from "../../errorhandler/error-handler";
import {Router, RouterLink} from 'angular2/router';

@Injectable()
export class LoginService {
    static url:string = "http://localhost:3000/api/home";

    public isLoggedIn:boolean = false;
    public loggedInUser:IUser = null;

    constructor(private wsService:WebsocketEventHandlerService,
                private errorHandler:CustomErrorHandler,
                private credentialsService:CredentialsService,
                private http:Http,
                private router:Router) {
    }

    login(username:string, password:string):void {
        let headers:Headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Accept", "application/json");

        this.http.get(LoginService.url, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                this.isLoggedIn = true;
                this.loggedInUser = data;
                this.credentialsService.setUsername(username);
                this.credentialsService.setPassword(password);

                this.router.navigateByUrl("/home");
                this.wsService.connect();
            }, err => {
                this.errorHandler.publishError(JSON.stringify(err) || 'Server error');
            });
    }

    logout():void {
        this.isLoggedIn = false;
        this.loggedInUser = null;
        this.wsService.disconnect();
        this.router.navigateByUrl("/login");
        this.credentialsService.setUsername(null);
        this.credentialsService.setPassword(null);
    }
}