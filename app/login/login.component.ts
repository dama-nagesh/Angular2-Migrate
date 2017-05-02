import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, RequestOptions , Headers} from '@angular/http';
import { Router } from '@angular/router';
import { LoginDataService } from './login.data.service';

@Component({
  selector: 'login-app',

  templateUrl : 'app/login/login.component.html',

  // styles:[`
  //           input.ng-invalid{border-left:5px solid red;}
  //           input.ng-valid{border-left:5px solid green;}
  //         `],

  providers : [LoginDataService]
})
export class LoginComponent { 
  onSubmit(){
    console.log("Test");
  };

password : string;
username : string;

  loginData = {};
  errorMsg : string;
  userForm : FormGroup;
  url : string;
  familyUrl : string;
  Main_CustomerID : string;
  Authorization_Token : string;
  familyData = {};

  

  a : {};
  loggedUser : {};

  constructor(private _loginDataService : LoginDataService , private _router : Router ,private _formBuilder : FormBuilder, private _http : Http){
    
  }

onSelect(empdep){
        //this._router.navigate(['/login', empdep.id]);
    }

  ngOnInit(){
        this._loginDataService.getLoginData()
        .subscribe(resLoginData => this.loginData = resLoginData,
                    resLoginError => this.errorMsg = resLoginError);

    }

    SignInClicked(){
      
    this.url = this.loginData['account'].login_api_url_dev;

    this.familyUrl = this.loginData['account'].familyMember_url_dev;

      this._loginDataService.userLoginStatus(this.username, this.password, this.url)
      .subscribe(
        (resLoggedUserData) => {
          this.loggedUser = resLoggedUserData
          if(this.loggedUser != undefined){
            console.log(this.loggedUser);
            this.a = this.loggedUser;
            //window.location.hash = "#!/home";
            window['isLogin'] = true;
            sessionStorage.setItem("currentUser", JSON.stringify(this.loggedUser));
            
            this._router.navigate(['/home']);
            var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            //var token = currentUser.token; // your token
            console.log(JSON.parse(currentUser['_body']));
            this.Main_CustomerID = JSON.parse(currentUser['_body']).CustomerId;
            this.Authorization_Token = JSON.parse(currentUser['_body']).Authorization_Token;
            console.log("main customerid : " + this.Main_CustomerID + " \n " + "Authorization_Token" + this.Authorization_Token)
            // sessionStorage.setItem("UserID", this.a);
            // sessionStorage.setItem("CustomerId", a.CustomerId);
            // sessionStorage.setItem("Token", a.Authorization_Token);
            // sessionStorage.setItem("CustomerName", a.FirstName);
            // sessionStorage.setItem("Gender", a.Gender);
            // sessionStorage.setItem("LogoPath", a.LogoPath);

            this._loginDataService.familyMemberLogin(this.familyUrl, this.Main_CustomerID, this.Authorization_Token)
          .subscribe(
        (resFamilyMemberData) => {
          this.familyData = resFamilyMemberData
          if(this.familyData != undefined){
            console.log(this.familyData);
            sessionStorage.setItem("MembersData", JSON.stringify(this.familyData));
            var currentUser = JSON.parse(sessionStorage.getItem('MembersData'));
            console.log(JSON.parse(currentUser));
                
          }
        },
            resFamilyMemberError => this.errorMsg = resFamilyMemberError
      )
                
          }
        },
                    resLoggedUserError => this.errorMsg = resLoggedUserError
      )

      
    }


    enableForgotPassword () {
            
            for(var i=0; i< document.getElementsByClassName('forget-form').length; i++){
                var div = document.getElementsByClassName('forget-form')[i]
                div.setAttribute("style","display:block");
                console.log("forget-form");
            }
            for(var i=0; i< document.getElementsByClassName('login-form').length; i++){
                var div = document.getElementsByClassName('login-form')[i]
                div.setAttribute("style","display:none");
                console.log("login-form");
            }
            console.log("enableForgotPassword");
        }

        forgotBackClicked () {
            for(var i=0; i< document.getElementsByClassName('forget-form').length; i++){
                var div = document.getElementsByClassName('forget-form')[i]
                div.setAttribute("style","display:none");
            }
            for(var i=0; i< document.getElementsByClassName('login-form').length; i++){
                var div = document.getElementsByClassName('login-form')[i]
                div.setAttribute("style","display:block");
            }
            console.log("forgotBackClicked");
        }

        forgotSubmitClicked () {

        }

        modalClick(){
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
          console.log("modalclick")
        }


}
