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
var LoginDataService = (function () {
    function LoginDataService(_http) {
        this._http = _http;
        this._url = "apidata/api.json";
    }
    LoginDataService.prototype.getLoginData = function () {
        return this._http.get(this._url)
            .map(function (response) { return response.json(); })
            .catch(this._errorHandler);
    };
    LoginDataService.prototype._errorHandler = function (error) {
        //console.log("");
        console.error(error);
        return Observable_1.Observable.throw(error || "Severe Error");
    };
    LoginDataService.prototype.userLoginStatus = function (username, password, url) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(url, JSON.stringify({ 'UserName': username, 'Password': password }), options);
    };
    LoginDataService.prototype.familyMemberLogin = function (url, Main_CustomerID, Authorization_Token) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        headers.append('Authorization-Token', Authorization_Token);
        console.log("Header : ");
        console.log(headers);
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(url, JSON.stringify({ 'CustomerId': Main_CustomerID }), options);
    };
    return LoginDataService;
}());
LoginDataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], LoginDataService);
exports.LoginDataService = LoginDataService;
//# sourceMappingURL=login.data.service.js.map