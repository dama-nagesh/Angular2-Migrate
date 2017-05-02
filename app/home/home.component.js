"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var home_service_1 = require("./home.service");
var main_content_component_1 = require("../main-content/main-content.component");
var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.onSubmit = function () {
        console.log("Test");
    };
    ;
    HomeComponent.prototype.onSelect = function (empdep) {
        //this._router.navigate(['/login', empdep.id]);
    };
    HomeComponent.prototype.ngOnInit = function () {
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home-app',
        template: "  \n   <header class=\"main-header row\">\n   \n    <!-- Header Navbar: style can be found in header.less -->\n    <nav class=\"navbar navbar-static-top\">\n      <!-- Sidebar toggle button-->\n      <a href=\"#\" class=\"sidebar-toggle\" data-toggle=\"offcanvas\" role=\"button\">\n        <span class=\"sr-only\">Toggle navigation</span>\n      </a>\n\n      <div class=\"navbar-custom-menu\">\n       \n      </div>\n    </nav>\n  </header>\n   <sidebar-list></sidebar-list>\n                <main-content></main-content>\n \n               \n                \n            ",
        //templateUrl : 'app/home/home.component.html',
        styles: ["\n            input.ng-invalid{border-left:5px solid red;}\n            input.ng-valid{border-left:5px solid green;}\n            sidebar-list {float : left; width : 15% auto}\n            main-content { width : 60%}\n          "],
        providers: [home_service_1.HomeDataService, main_content_component_1.MainContentComponent],
    })
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map