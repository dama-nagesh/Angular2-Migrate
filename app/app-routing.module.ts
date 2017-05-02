import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideBarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MainContentComponent } from './main-content/main-content.component';
import { DashboardComponent } from './main-content/dashboard/dashboard.component';

const routes : Routes = [
    {path : '', component: LoginComponent},
    {path : 'login', component: LoginComponent},
    {path : 'home', component: HomeComponent,
        children : [
            {path : '', redirectTo : 'dashboard', pathMatch: 'full'},
            {path : 'dashboard', component : MainContentComponent}
        ]    
    },
    {path : 'sidebar', component: SideBarComponent}
];

@NgModule({
    imports : [
        RouterModule.forRoot(routes)
    ],
    exports : [
        RouterModule
    ]
})

export class AppRoutingModule { }
export const routingComponents = [SideBarComponent, HeaderComponent, LoginComponent, HomeComponent, MainContentComponent, DashboardComponent]
