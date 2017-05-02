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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var login_data_service_1 = require("./login.data.service");
var LoginComponent = (function () {
    function LoginComponent(_loginDataService, _router, _formBuilder, _http) {
        this._loginDataService = _loginDataService;
        this._router = _router;
        this._formBuilder = _formBuilder;
        this._http = _http;
        this.loginData = {};
        this.familyData = {};
    }
    LoginComponent.prototype.onSubmit = function () {
        console.log("Test");
    };
    ;
    LoginComponent.prototype.onSelect = function (empdep) {
        //this._router.navigate(['/login', empdep.id]);
    };
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._loginDataService.getLoginData()
            .subscribe(function (resLoginData) { return _this.loginData = resLoginData; }, function (resLoginError) { return _this.errorMsg = resLoginError; });
    };
    LoginComponent.prototype.SignInClicked = function () {
        var _this = this;
        this.url = this.loginData['account'].login_api_url_dev;
        this.familyUrl = this.loginData['account'].familyMember_url_dev;
        this._loginDataService.userLoginStatus(this.username, this.password, this.url)
            .subscribe(function (resLoggedUserData) {
            _this.loggedUser = resLoggedUserData;
            if (_this.loggedUser != undefined) {
                console.log(_this.loggedUser);
                _this.a = _this.loggedUser;
                //window.location.hash = "#!/home";
                window['isLogin'] = true;
                sessionStorage.setItem("currentUser", JSON.stringify(_this.loggedUser));
                _this._router.navigate(['/home']);
                var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                //var token = currentUser.token; // your token
                console.log(JSON.parse(currentUser['_body']));
                _this.Main_CustomerID = JSON.parse(currentUser['_body']).CustomerId;
                _this.Authorization_Token = JSON.parse(currentUser['_body']).Authorization_Token;
                console.log("main customerid : " + _this.Main_CustomerID + " \n " + "Authorization_Token" + _this.Authorization_Token);
                // sessionStorage.setItem("UserID", this.a);
                // sessionStorage.setItem("CustomerId", a.CustomerId);
                // sessionStorage.setItem("Token", a.Authorization_Token);
                // sessionStorage.setItem("CustomerName", a.FirstName);
                // sessionStorage.setItem("Gender", a.Gender);
                // sessionStorage.setItem("LogoPath", a.LogoPath);
                _this._loginDataService.familyMemberLogin(_this.familyUrl, _this.Main_CustomerID, _this.Authorization_Token)
                    .subscribe(function (resFamilyMemberData) {
                    _this.familyData = resFamilyMemberData;
                    if (_this.familyData != undefined) {
                        console.log(_this.familyData);
                        sessionStorage.setItem("MembersData", JSON.stringify(_this.familyData));
                        var currentUser = JSON.parse(sessionStorage.getItem('MembersData'));
                        console.log(JSON.parse(currentUser));
                    }
                }, function (resFamilyMemberError) { return _this.errorMsg = resFamilyMemberError; });
            }
        }, function (resLoggedUserError) { return _this.errorMsg = resLoggedUserError; });
    };
    LoginComponent.prototype.enableForgotPassword = function () {
        for (var i = 0; i < document.getElementsByClassName('forget-form').length; i++) {
            var div = document.getElementsByClassName('forget-form')[i];
            div.setAttribute("style", "display:block");
            console.log("forget-form");
        }
        for (var i = 0; i < document.getElementsByClassName('login-form').length; i++) {
            var div = document.getElementsByClassName('login-form')[i];
            div.setAttribute("style", "display:none");
            console.log("login-form");
        }
        console.log("enableForgotPassword");
    };
    LoginComponent.prototype.forgotBackClicked = function () {
        for (var i = 0; i < document.getElementsByClassName('forget-form').length; i++) {
            var div = document.getElementsByClassName('forget-form')[i];
            div.setAttribute("style", "display:none");
        }
        for (var i = 0; i < document.getElementsByClassName('login-form').length; i++) {
            var div = document.getElementsByClassName('login-form')[i];
            div.setAttribute("style", "display:block");
        }
        console.log("forgotBackClicked");
    };
    LoginComponent.prototype.forgotSubmitClicked = function () {
    };
    LoginComponent.prototype.modalClick = function () {
        //   this._modal.alert("")
        // .showClose(true)
        // .title('A simple Alert style modal window')
        // .body(`
        //     <h4>Alert is a classic (title/body/footer) 1 button modal window that 
        //     does not block.</h4>
        //     <b>Configuration:</b>
        //     <ul>
        //         <li>Non blocking (click anywhere outside to dismiss)</li>
        //         <li>Size large</li>
        //         <li>Dismissed with default keyboard key (ESC)</li>
        //         <li>Close wth button click</li>
        //         <li>HTML content</li>
        //     </ul>`)
        // .open();
        //this.modal.alert().open();
        // confirm("Other Terms and Conditions")
        console.log("modalclick");
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'login-app',
        templateUrl: 'app/login/login.component.html',
        // styles:[`
        //           input.ng-invalid{border-left:5px solid red;}
        //           input.ng-valid{border-left:5px solid green;}
        //         `],
        providers: [login_data_service_1.LoginDataService]
    }),
    __metadata("design:paramtypes", [login_data_service_1.LoginDataService, router_1.Router, forms_1.FormBuilder, http_1.Http])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map