import {Injectable, NgZone} from "angular2/core";
import {EventHandlerService, CredentialsService} from "../../java.services";
import {WebsocketEventHandlerService} from "../websockets/websocket-event-handler.service";
import {IEventDto, IUser} from "../../dto";
import {HomeService} from "../data/home.service";
import {HttpClient} from "../../http/http.service";
import {Http, Headers, RequestOptionsArgs, Response} from 'angular2/http';
import {CustomErrorHandler} from "../../errorhandler/error-handler";
import {Router, ComponentInstruction} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

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
        console.log(__moduleName + " constructor()");
    }

    private doLogin():Observable<IUser> {
        console.log(__moduleName + " doLogin()");
        let username = this.credentialsService.getUsername();
        let password = this.credentialsService.getPassword();

        let headers:Headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Accept", "application/json");

        return this.http.get(LoginService.url, {headers: headers})
            .map(res => res.json())
            .do((user) => {
                this.isLoggedIn = true;
                this.loggedInUser = user;
                this.wsService.connect();
            })
    }

    login(username:string, password:string):void {
        console.log(__moduleName + " login()");
        this.credentialsService.setUsername(username);
        this.credentialsService.setPassword(password);

        this.doLogin()
            .subscribe(user => {
                this.router.navigateByUrl("/home");
            }, err => {
                this.credentialsService.clear();
                this.errorHandler.publishError(JSON.stringify(err) || 'Server error');
            });
    }

    logout():void {
        console.log(__moduleName + " logout()");

        this.isLoggedIn = false;
        this.loggedInUser = null;
        this.wsService.disconnect();
        this.credentialsService.clear();
        this.router.navigateByUrl("/login");
    }

    checkLoggedIn(next:ComponentInstruction, previous:ComponentInstruction):Promise<boolean> {
        console.log(__moduleName + " checkLoggedIn()");

        // return a boolean or a promise that resolves a boolean
        return new Promise<boolean>(resolve => {
            if (this.isLoggedIn) {
                resolve(true);
            }
            else {
                this.doLogin()
                    .subscribe(user => {
                        if (user) {
                            resolve(true);
                        } else {
                            this.router.navigateByUrl("/login");
                            resolve(false);
                        }
                    }, err => {
                        this.errorHandler.publishError(JSON.stringify(err) || 'Server error');
                        this.credentialsService.clear();
                        this.router.navigateByUrl("/login");
                        resolve(false);
                    });
            }
        });
    };
}