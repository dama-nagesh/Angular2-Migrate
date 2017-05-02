import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http, Response, RequestOptions , Headers} from '@angular/http';
import { Router } from '@angular/router';
import { HomeDataService } from './home.service';
import { SideBarComponent } from '../sidebar.component';
import { HeaderComponent } from '../header.component';
import { MainContentComponent } from '../main-content/main-content.component';


@Component({
  selector: 'home-app',

  template : `  
   <header class="main-header row">
   
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
        <span class="sr-only">Toggle navigation</span>
      </a>

      <div class="navbar-custom-menu">
       
      </div>
    </nav>
  </header>
   <sidebar-list></sidebar-list>
                <main-content></main-content>
 
               
                
            `,


  //templateUrl : 'app/home/home.component.html',

  styles:[`
            input.ng-invalid{border-left:5px solid red;}
            input.ng-valid{border-left:5px solid green;}
            sidebar-list {float : left; width : 15% auto}
            main-content { width : 60%}
          `],

  providers : [HomeDataService, MainContentComponent ],
  
})
export class HomeComponent { 
  onSubmit(){
    console.log("Test");
  };


onSelect(empdep){
        //this._router.navigate(['/login', empdep.id]);
    }

  ngOnInit(){

    }

  


}
