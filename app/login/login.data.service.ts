import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginDataService {

    private _url : string = "apidata/api.json";

    
    

    constructor(private _http : Http){

    }

    getLoginData(){
        return this._http.get(this._url)
        .map((response:Response) => response.json())
        .catch(this._errorHandler);
    }
    _errorHandler(error : Response){
        //console.log("");
        console.error(error);
        return Observable.throw(error || "Severe Error");
    }

    userLoginStatus(username : string, password : string, url : string){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(url, JSON.stringify({'UserName' : username, 'Password' :  password}), options)
    }

    familyMemberLogin(url : string, Main_CustomerID : string, Authorization_Token : string){
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        headers.append('Authorization-Token', Authorization_Token);
        console.log("Header : ");
        console.log(headers);
        let options = new RequestOptions({ headers: headers });
        return this._http.post(url, JSON.stringify({'CustomerId' : Main_CustomerID}), options)
    }
}

