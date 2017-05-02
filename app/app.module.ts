import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule }   from './app-routing.module';
import { AppComponent }   from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { routingComponents }   from './app-routing.module';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { DashboardComponent } from './main-content/dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
//import { ChartsModule } from 'ng2-charts/ng2-charts';
import '../../node_modules/chart.js/dist/Chart.bundle.min.js'; 


@NgModule({
  imports:      [ BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpModule, ChartsModule ],
  declarations: [ AppComponent, LoginComponent, routingComponents],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
