/**
 * Created by Stefano on 09.04.2016.
 */
import {Http, Headers, RequestOptionsArgs, Response} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {CredentialsService} from "../java.services";
import {Observable} from "rxjs/Observable";
import {CustomErrorHandler} from "../errorhandler/error-handler";
import {Router, RouterLink} from 'angular2/router';
import {LoginService} from "../services/login/login.service";

@Injectable()
export class HttpClient {

    constructor(private http:Http,
                private credentialsService:CredentialsService,
                private loginService:LoginService,
                private errorHandler:CustomErrorHandler,
                private router:Router) {
    }

    private createAuthenticationHeaders(headers:Headers) {
        let username = this.credentialsService.getUsername();
        let password = this.credentialsService.getPassword();
        headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        headers.append("Accept", "application/json");
    }

    public get(url) {
        let headers:Headers = new Headers();
        this.createAuthenticationHeaders(headers);
        return this.http.get(url, {headers: headers})
            .catch(response => this.handleError(response));
    }

    public post(url, data) {
        let headers:Headers = new Headers();
        this.createAuthenticationHeaders(headers);
        return this.http.post(url, data, {headers: headers});
    }

    private handleError(error:Response) {
        console.log(JSON.stringify(error));
        // if (error.status === 401) {
        //     console.log("navigate by url");
        //     setTimeout(() => {
        //         this.router.navigateByUrl("/login");
        //     }, 100);
        // }
        this.errorHandler.publishError(error.json().message || 'Server error');
        return Observable.throw(error.json().message || 'Server error');
    }
}