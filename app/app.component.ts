import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LoginDataService } from './login/login.data.service';
import { HomeDataService } from './home/home.service';
import { Routes } from '@angular/router'
import { routingComponents }   from './app-routing.module';
import { ChartsModule } from 'ng2-charts';

@Component({
  selector: 'my-app',

  template : `
              <router-outlet [hidden]></router-outlet>
              `,

  // styles:[`
  //           input.ng-invalid{border-left:5px solid red;}
  //           input.ng-valid{border-left:5px solid green;}
  //         `],

  providers : [LoginDataService, HomeDataService]
})
export class AppComponent { 
  onSubmit(){
    console.log("Test");
  };

  sidebarData = [];
  errorMsg : string;
  userForm : FormGroup;

  constructor(private _loginDataService : LoginDataService ,private _formBuilder : FormBuilder){
    
  }

  ngOnInit(){
        this._loginDataService.getLoginData()
        .subscribe(resSidebarData => this.sidebarData = resSidebarData,
                    resSidebarError => this.errorMsg = resSidebarError);
                   
    }

    isLoggedIn() {
    if (window['isLogin'] || window.sessionStorage.getItem("CustomerId") != "") {
        return true;
    } else {
        return false;
    }
}

  checkLogin()
  {
      if(!this.isLoggedIn()){ window.location.hash = "login";}
  }

  customerName(){
    return window.sessionStorage.getItem("CustomerName");
  }


}
