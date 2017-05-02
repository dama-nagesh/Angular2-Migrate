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
var sidebar_data_service_1 = require("./sidebar.data.service");
var AppComponent = (function () {
    function AppComponent(_sidebarDataService, _formBuilder) {
        this._sidebarDataService = _sidebarDataService;
        this._formBuilder = _formBuilder;
        this.sidebarData = [];
    }
    AppComponent.prototype.onSubmit = function () {
        console.log("Test");
    };
    ;
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._sidebarDataService.getSideBarData()
            .subscribe(function (resSidebarData) { return _this.sidebarData = resSidebarData; }, function (resSidebarError) { return _this.errorMsg = resSidebarError; });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "  <h1>Routing Application</h1>\n            <nav>\n              <a routerLink=\"/sidebar\" routerLinkActive=\"active\">Side Bar</a>\n            </nav>\n            <router-outlet></router-outlet>\n            <div class=\"page-container\">\n            <sidebar-list></sidebar-list>\n            <div ng-view class=\"page-content-wrapper\"></div>\n            <!-- BEGIN QUICK SIDEBAR -->\n            <a href=\"javascript:;\" class=\"page-quick-sidebar-toggler\">\n                <i class=\"icon-login\"></i>\n            </a>\n            <div class=\"page-quick-sidebar-wrapper\" data-close-on-body-click=\"false\">\n                <div class=\"page-quick-sidebar\">\n                    <ul class=\"nav nav-tabs\">\n                        <li class=\"active\">\n                            <a href=\"javascript:;\" data-target=\"#quick_sidebar_tab_1\" data-toggle=\"tab\"> Users\n                                <span class=\"badge badge-danger\">2</span>\n                            </a>\n                        </li>\n                        <li>\n                            <a href=\"javascript:;\" data-target=\"#quick_sidebar_tab_2\" data-toggle=\"tab\"> Alerts\n                                <span class=\"badge badge-success\">7</span>\n                            </a>\n                        </li>\n                        <li class=\"dropdown\">\n                            <a href=\"javascript:;\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"> More\n                                <i class=\"fa fa-angle-down\"></i>\n                            </a>\n                            <ul class=\"dropdown-menu pull-right\">\n                                <li>\n                                    <a href=\"javascript:;\" data-target=\"#quick_sidebar_tab_3\" data-toggle=\"tab\">\n                                        <i class=\"icon-bell\"></i> Alerts </a>\n                                </li>\n                                <li>\n                                    <a href=\"javascript:;\" data-target=\"#quick_sidebar_tab_3\" data-toggle=\"tab\">\n                                        <i class=\"icon-info\"></i> Notifications </a>\n                                </li>\n                                <li>\n                                    <a href=\"javascript:;\" data-target=\"#quick_sidebar_tab_3\" data-toggle=\"tab\">\n                                        <i class=\"icon-speech\"></i> Activities </a>\n                                </li>\n                                <li class=\"divider\"></li>\n                                <li>\n                                    <a href=\"javascript:;\" data-target=\"#quick_sidebar_tab_3\" data-toggle=\"tab\">\n                                        <i class=\"icon-settings\"></i> Settings </a>\n                                </li>\n                            </ul>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n            <!-- END QUICK SIDEBAR -->\n        </div>\n              ",
        styles: ["\n            input.ng-invalid{border-left:5px solid red;}\n            input.ng-valid{border-left:5px solid green;}\n          "],
        providers: [sidebar_data_service_1.SidebarDataService]
    }),
    __metadata("design:paramtypes", [sidebar_data_service_1.SidebarDataService, forms_1.FormBuilder])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app1.component.js.map