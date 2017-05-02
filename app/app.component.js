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
var forms_1 = require("@angular/forms");
var login_data_service_1 = require("./login/login.data.service");
var home_service_1 = require("./home/home.service");
var AppComponent = (function () {
    function AppComponent(_loginDataService, _formBuilder) {
        this._loginDataService = _loginDataService;
        this._formBuilder = _formBuilder;
        this.sidebarData = [];
    }
    AppComponent.prototype.onSubmit = function () {
        console.log("Test");
    };
    ;
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._loginDataService.getLoginData()
            .subscribe(function (resSidebarData) { return _this.sidebarData = resSidebarData; }, function (resSidebarError) { return _this.errorMsg = resSidebarError; });
    };
    AppComponent.prototype.isLoggedIn = function () {
        if (window['isLogin'] || window.sessionStorage.getItem("CustomerId") != "") {
            return true;
        }
        else {
            return false;
        }
    };
    AppComponent.prototype.checkLogin = function () {
        if (!this.isLoggedIn()) {
            window.location.hash = "login";
        }
    };
    AppComponent.prototype.customerName = function () {
        return window.sessionStorage.getItem("CustomerName");
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n              <router-outlet [hidden]></router-outlet>\n              ",
        // styles:[`
        //           input.ng-invalid{border-left:5px solid red;}
        //           input.ng-valid{border-left:5px solid green;}
        //         `],
        providers: [login_data_service_1.LoginDataService, home_service_1.HomeDataService]
    }),
    __metadata("design:paramtypes", [login_data_service_1.LoginDataService, forms_1.FormBuilder])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map