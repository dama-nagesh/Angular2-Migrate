"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var DashboardService = (function () {
    function DashboardService(_http) {
        this._http = _http;
        this._url = "apidata/api.json";
    }
    DashboardService.prototype.getApiJsonData = function () {
        return this._http.get(this._url)
            .map(function (response) { return response.json(); })
            .catch(this._errorHandler);
    };
    DashboardService.prototype._errorHandler = function (error) {
        //console.log("");
        console.error(error);
        return Observable_1.Observable.throw(error || "Severe Error");
    };
    DashboardService.prototype.getDashBoardData = function (url, dataMonthSelected) {
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        //var token = currentUser.token; // your token
        //console.log(JSON.parse(currentUser['_body']));
        this.Main_CustomerID = JSON.parse(currentUser['_body']).CustomerId;
        this.Authorization_Token = JSON.parse(currentUser['_body']).Authorization_Token;
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        headers.append('Authorization-Token', this.Authorization_Token);
        //headers.append('Accept','application/json');
        //headers.append('Access-Control-Allow-Origin', '*');
        // console.log("Header : ");
        // console.log(headers);
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(url, "=" + JSON.stringify({ 'CustomerId': this.Main_CustomerID, 'AssetType': '0',
            'days': dataMonthSelected }), options)
            .map(function (res) { return res.json(); }) // ...and calling .json() on the response to return data
            .catch(function (error) { return Observable_1.Observable.throw(error.json().error || 'Server error'); });
        // var returnValue = this._http.post(url, JSON.stringify({'CustomerId' : this.Main_CustomerID, 'AssetType': '0',
        //                         'days': dataMonthSelected}), options)
        //                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
        //                          .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
        //                     for(let i = 0; i < 1000000 ; i++) {
        //                     }
        //                     return returnValue;
    };
    return DashboardService;
}());
DashboardService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map