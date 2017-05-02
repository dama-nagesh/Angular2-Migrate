import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SidebarDataService } from './sidebar.data.service';
@Component({
  selector: 'my-app',

  template : `  <h1>Routing Application</h1>
            <nav>
              <a routerLink="/sidebar" routerLinkActive="active">Side Bar</a>
            </nav>
            <router-outlet></router-outlet>
            <div class="page-container">
            <sidebar-list></sidebar-list>
            <div ng-view class="page-content-wrapper"></div>
            <!-- BEGIN QUICK SIDEBAR -->
            <a href="javascript:;" class="page-quick-sidebar-toggler">
                <i class="icon-login"></i>
            </a>
            <div class="page-quick-sidebar-wrapper" data-close-on-body-click="false">
                <div class="page-quick-sidebar">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="javascript:;" data-target="#quick_sidebar_tab_1" data-toggle="tab"> Users
                                <span class="badge badge-danger">2</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;" data-target="#quick_sidebar_tab_2" data-toggle="tab"> Alerts
                                <span class="badge badge-success">7</span>
                            </a>
                        </li>
                        <li class="dropdown">
                            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown"> More
                                <i class="fa fa-angle-down"></i>
                            </a>
                            <ul class="dropdown-menu pull-right">
                                <li>
                                    <a href="javascript:;" data-target="#quick_sidebar_tab_3" data-toggle="tab">
                                        <i class="icon-bell"></i> Alerts </a>
                                </li>
                                <li>
                                    <a href="javascript:;" data-target="#quick_sidebar_tab_3" data-toggle="tab">
                                        <i class="icon-info"></i> Notifications </a>
                                </li>
                                <li>
                                    <a href="javascript:;" data-target="#quick_sidebar_tab_3" data-toggle="tab">
                                        <i class="icon-speech"></i> Activities </a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="javascript:;" data-target="#quick_sidebar_tab_3" data-toggle="tab">
                                        <i class="icon-settings"></i> Settings </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- END QUICK SIDEBAR -->
        </div>
              `,

  styles:[`
            input.ng-invalid{border-left:5px solid red;}
            input.ng-valid{border-left:5px solid green;}
          `],

  providers : [SidebarDataService]
})
export class AppComponent { 
  onSubmit(){
    console.log("Test");
  };

  sidebarData = [];
  errorMsg : string;
  userForm : FormGroup;

  constructor(private _sidebarDataService : SidebarDataService ,private _formBuilder : FormBuilder){
    
  }

  ngOnInit(){
        this._sidebarDataService.getSideBarData()
        .subscribe(resSidebarData => this.sidebarData = resSidebarData,
                    resSidebarError => this.errorMsg = resSidebarError);
    }

}
