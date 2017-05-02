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
var router_1 = require("@angular/router");
var sidebar_data_service_1 = require("./sidebar.data.service");
var modules_data_service_1 = require("./modules.data.service");
var SideBarComponent = (function () {
    function SideBarComponent(router, _sidebarDataService, _modulesDataService) {
        this.router = router;
        this._sidebarDataService = _sidebarDataService;
        this._modulesDataService = _modulesDataService;
        this.sidebarData = [];
        this.pageUrls = [];
    }
    //logourl = window.data.LOGO.LogoImgUrl + window.sessionStorage.getItem("LogoPath");
    SideBarComponent.prototype.onSelect = function (empdep) {
        this.router.navigate(['/sidebar', empdep.id]);
    };
    SideBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._sidebarDataService.getSideBarData()
            .subscribe(function (resSidebarData) { return _this.sidebarData = resSidebarData; }, function (resSidebarError) { return _this.errorMsg = resSidebarError; });
        this._modulesDataService.getModulesData()
            .subscribe(function (resModulesData) { return _this.pageUrls = resModulesData; }, function (resModulesError) { return _this.errorMsg = resModulesError; });
        //this.logourl = this.pageUrls["LOGO"].LogoImgUrl;
    };
    return SideBarComponent;
}());
SideBarComponent = __decorate([
    core_1.Component({
        selector: 'sidebar-list',
        // template : `
        //             `,
        templateUrl: 'app/sidebar1.component.html',
        providers: [sidebar_data_service_1.SidebarDataService, modules_data_service_1.ModulesDataService]
    }),
    __metadata("design:paramtypes", [router_1.Router, sidebar_data_service_1.SidebarDataService, modules_data_service_1.ModulesDataService])
], SideBarComponent);
exports.SideBarComponent = SideBarComponent;
;
//# sourceMappingURL=sidebar.component.js.map