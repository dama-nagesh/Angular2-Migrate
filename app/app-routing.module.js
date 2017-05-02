"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var sidebar_component_1 = require("./sidebar.component");
var header_component_1 = require("./header.component");
var login_component_1 = require("./login/login.component");
var home_component_1 = require("./home/home.component");
var main_content_component_1 = require("./main-content/main-content.component");
var dashboard_component_1 = require("./main-content/dashboard/dashboard.component");
var routes = [
    { path: '', component: login_component_1.LoginComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'home', component: home_component_1.HomeComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: main_content_component_1.MainContentComponent }
        ]
    },
    { path: 'sidebar', component: sidebar_component_1.SideBarComponent }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forRoot(routes)
        ],
        exports: [
            router_1.RouterModule
        ]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
exports.routingComponents = [sidebar_component_1.SideBarComponent, header_component_1.HeaderComponent, login_component_1.LoginComponent, home_component_1.HomeComponent, main_content_component_1.MainContentComponent, dashboard_component_1.DashboardComponent];
//# sourceMappingURL=app-routing.module.js.map