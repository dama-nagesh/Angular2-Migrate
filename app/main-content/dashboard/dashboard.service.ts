import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class DashboardService {

    private _url : string = "apidata/api.json";

    Main_CustomerID : string;
  Authorization_Token : string;
    
    constructor(private _http : Http){

    }

    getApiJsonData(){
        return this._http.get(this._url)
        .map((response:Response) => response.json())
        .catch(this._errorHandler);
    }

    _errorHandler(error : Response){
        //console.log("");
        console.error(error);
        return Observable.throw(error || "Severe Error");
    }
  

    getDashBoardData(url : string, dataMonthSelected : string) : Observable<Object>{
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            //var token = currentUser.token; // your token
            //console.log(JSON.parse(currentUser['_body']));
            this.Main_CustomerID = JSON.parse(currentUser['_body']).CustomerId;
            this.Authorization_Token = JSON.parse(currentUser['_body']).Authorization_Token;
         let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
         headers.append('Authorization-Token', this.Authorization_Token);
         //headers.append('Accept','application/json');
      //headers.append('Access-Control-Allow-Origin', '*');
        // console.log("Header : ");
        // console.log(headers);
         let options = new RequestOptions({ headers: headers });
         
         return this._http.post(url, "=" + JSON.stringify({'CustomerId' : this.Main_CustomerID, 'AssetType': '0',
                        'days': dataMonthSelected}), options)
                        .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

// var returnValue = this._http.post(url, JSON.stringify({'CustomerId' : this.Main_CustomerID, 'AssetType': '0',
//                         'days': dataMonthSelected}), options)
//                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
//                          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

//                     for(let i = 0; i < 1000000 ; i++) {

//                     }

//                     return returnValue;

    }
}

