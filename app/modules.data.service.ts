import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ModulesDataService {

    private _url : string = "apidata/api.json";
    constructor(private _http : Http){

    }

    getModulesData(){
        return this._http.get(this._url)
        .map((response:Response) => response.json())
        .catch(this._errorHandler);
    }
    _errorHandler(error : Response){
        //console.log("");
        console.error(error);
        return Observable.throw(error || "Severe Error");
    }
}
